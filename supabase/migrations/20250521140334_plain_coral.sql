/*
  # Chat System Schema

  1. New Tables
    - conversations
      - id (uuid, primary key)
      - tenant_id (uuid, references users)
      - manager_id (uuid, references users)
      - last_message_time (timestamptz)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - messages
      - id (uuid, primary key)
      - conversation_id (uuid, references conversations)
      - sender_id (uuid, references users)
      - content (text)
      - read_status (boolean)
      - created_at (timestamptz)
      - updated_at (timestamptz)
      - attachments (jsonb)

  2. Security
    - Enable RLS on both tables
    - Add policies for proper access control
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  manager_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  last_message_time timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, manager_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  read_status boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  attachments jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT valid_message CHECK (length(content) > 0)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_manager ON conversations(manager_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_time DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations
CREATE POLICY "Users can view their own conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = tenant_id OR 
    auth.uid() = manager_id OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can create conversations they're part of"
  ON conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = tenant_id OR 
    auth.uid() = manager_id OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Create policies for messages
CREATE POLICY "Users can view messages in their conversations"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      AND (tenant_id = auth.uid() OR manager_id = auth.uid())
    ) OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      AND (tenant_id = auth.uid() OR manager_id = auth.uid())
    ) OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Create function to update conversation last_message_time
CREATE OR REPLACE FUNCTION update_conversation_last_message_time()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_time = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating last_message_time
CREATE TRIGGER update_conversation_timestamp
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message_time();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating updated_at
CREATE TRIGGER update_conversations_timestamp
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_timestamp
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();