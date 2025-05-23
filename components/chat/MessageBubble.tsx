import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { FileText, Download } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeContext';
import { useAuthContext } from '@/components/AuthContext';
import { Message } from '@/components/ChatContext';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { colors } = useTheme();
  const { user } = useAuthContext();
  const isOwnMessage = message.senderId === user?.id;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleDownload = async (url: string) => {
    // TODO: Implement file download
    console.log('Download file:', url);
  };

  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.ownMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.bubble,
        {
          backgroundColor: isOwnMessage ? colors.primary : colors.surface,
        }
      ]}>
        <Text style={[
          styles.text,
          { color: isOwnMessage ? '#FFFFFF' : colors.text }
        ]}>
          {message.content}
        </Text>

        {message.attachments?.map((attachment, index) => (
          <View key={index} style={styles.attachment}>
            {attachment.type === 'image' ? (
              <Image
                source={{ uri: attachment.url }}
                style={styles.attachmentImage}
                resizeMode="cover"
              />
            ) : (
              <TouchableOpacity
                style={[styles.documentContainer, { backgroundColor: colors.surface + '80' }]}
                onPress={() => handleDownload(attachment.url)}
              >
                <FileText size={24} color={isOwnMessage ? '#FFFFFF' : colors.primary} />
                <Text style={[
                  styles.documentName,
                  { color: isOwnMessage ? '#FFFFFF' : colors.text }
                ]}>
                  {attachment.name}
                </Text>
                <Download size={20} color={isOwnMessage ? '#FFFFFF' : colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <Text style={[
          styles.time,
          { color: isOwnMessage ? '#FFFFFF80' : colors.textSecondary }
        ]}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  attachment: {
    marginTop: 8,
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  documentName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  time: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});