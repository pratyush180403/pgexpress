import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from './AuthContext';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readStatus: boolean;
  createdAt: string;
  attachments: Array<{
    type: 'image' | 'document';
    url: string;
    name: string;
  }>;
}

export interface Conversation {
  id: string;
  tenantId: string;
  managerId: string;
  lastMessageTime: string;
  participant: {
    id: string;
    name: string;
    avatar_url?: string;
    online?: boolean;
  };
  unreadCount: number;
}

interface ChatContextValue {
  conversations: Conversation[];
  currentConversation: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  setCurrentConversation: (id: string | null) => void;
  markAsRead: (messageIds: string[]) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  startConversation: (userId: string) => Promise<string>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const MESSAGES_PER_PAGE = 50;

  // Fetch conversations
  useEffect(() => {
    if (!user) return;

    async function fetchConversations() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('conversations')
          .select(`
            *,
            tenant:tenant_id(id, name, avatar_url),
            manager:manager_id(id, name, avatar_url)
          `)
          .or(`tenant_id.eq.${user.id},manager_id.eq.${user.id}`)
          .order('last_message_time', { ascending: false });

        if (fetchError) throw fetchError;

        const formattedConversations = data.map(conv => ({
          id: conv.id,
          tenantId: conv.tenant_id,
          managerId: conv.manager_id,
          lastMessageTime: conv.last_message_time,
          participant: user.id === conv.tenant_id ? conv.manager : conv.tenant,
          unreadCount: 0, // Will be updated by separate query
        }));

        setConversations(formattedConversations);

        // Subscribe to conversation updates
        const subscription = supabase
          .channel('conversations')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'conversations',
              filter: `tenant_id=eq.${user.id},manager_id=eq.${user.id}`,
            },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setConversations(prev => [payload.new as Conversation, ...prev]);
              } else if (payload.eventType === 'UPDATE') {
                setConversations(prev =>
                  prev.map(conv => conv.id === payload.new.id ? payload.new as Conversation : conv)
                );
              }
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to load conversations');
      } finally {
        setIsLoading(false);
      }
    }

    fetchConversations();
  }, [user]);

  // Fetch messages for current conversation
  useEffect(() => {
    if (!currentConversation) return;

    async function fetchMessages() {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', currentConversation)
          .order('created_at', { ascending: false })
          .range(0, MESSAGES_PER_PAGE - 1);

        if (fetchError) throw fetchError;

        setMessages(data || []);
        setHasMore(data?.length === MESSAGES_PER_PAGE);
        setPage(1);

        // Subscribe to message updates
        const subscription = supabase
          .channel('messages')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'messages',
              filter: `conversation_id=eq.${currentConversation}`,
            },
            (payload) => {
              if (payload.eventType === 'INSERT') {
                setMessages(prev => [payload.new as Message, ...prev]);
              }
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
  }, [currentConversation]);

  const sendMessage = async (content: string, attachments: File[] = []) => {
    if (!currentConversation || !user) return;

    try {
      // Upload attachments if any
      const uploadedAttachments = await Promise.all(
        attachments.map(async (file) => {
          const { data, error } = await supabase.storage
            .from('chat-attachments')
            .upload(`${currentConversation}/${file.name}`, file);

          if (error) throw error;

          return {
            type: file.type.startsWith('image/') ? 'image' : 'document',
            url: data.path,
            name: file.name,
          };
        })
      );

      // Send message
      const { error: sendError } = await supabase
        .from('messages')
        .insert({
          conversation_id: currentConversation,
          sender_id: user.id,
          content,
          attachments: uploadedAttachments,
        });

      if (sendError) throw sendError;
    } catch (err) {
      console.error('Error sending message:', err);
      throw new Error('Failed to send message');
    }
  };

  const markAsRead = async (messageIds: string[]) => {
    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ read_status: true })
        .in('id', messageIds);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error marking messages as read:', err);
      throw new Error('Failed to mark messages as read');
    }
  };

  const loadMoreMessages = async () => {
    if (!currentConversation || !hasMore) return;

    try {
      setIsLoading(true);
      const start = page * MESSAGES_PER_PAGE;
      const end = start + MESSAGES_PER_PAGE - 1;

      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', currentConversation)
        .order('created_at', { ascending: false })
        .range(start, end);

      if (fetchError) throw fetchError;

      setMessages(prev => [...prev, ...(data || [])]);
      setHasMore(data?.length === MESSAGES_PER_PAGE);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error loading more messages:', err);
      setError('Failed to load more messages');
    } finally {
      setIsLoading(false);
    }
  };

  const startConversation = async (userId: string): Promise<string> => {
    if (!user) throw new Error('Not authenticated');

    try {
      // Check if conversation already exists
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(tenant_id.eq.${user.id},manager_id.eq.${userId}),and(tenant_id.eq.${userId},manager_id.eq.${user.id})`)
        .single();

      if (existing) return existing.id;

      // Create new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          tenant_id: user.role === 'tenant' ? user.id : userId,
          manager_id: user.role === 'manager' ? user.id : userId,
        })
        .select()
        .single();

      if (error) throw error;

      return data.id;
    } catch (err) {
      console.error('Error starting conversation:', err);
      throw new Error('Failed to start conversation');
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        messages,
        isLoading,
        error,
        sendMessage,
        setCurrentConversation,
        markAsRead,
        loadMoreMessages,
        startConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}