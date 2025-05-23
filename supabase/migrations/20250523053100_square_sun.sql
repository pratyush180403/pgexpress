/*
  # Authentication and Database System

  1. New Tables
    - `user_profiles`
      - Extended user information
      - KYC document references
      - Verification status tracking
    
    - `kyc_documents`
      - Document storage and verification
      - Support for multiple document types
      - Verification status tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access
    - Secure document access control

  3. Changes
    - Add verification fields to users table
    - Add document verification workflow
*/

-- Add verification fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code_expires_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  address text,
  city text,
  state text,
  postal_code text,
  country text,
  emergency_contact_name text,
  emergency_contact_phone text,
  kyc_status verification_status DEFAULT 'pending',
  kyc_verified_at timestamptz,
  kyc_verified_by uuid REFERENCES users(id),
  police_verification_status verification_status DEFAULT 'pending',
  police_verification_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create kyc_documents table
CREATE TABLE IF NOT EXISTS kyc_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  status verification_status DEFAULT 'pending',
  verified_at timestamptz,
  verified_by uuid REFERENCES users(id),
  rejection_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 5242880) -- 5MB limit
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Staff can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Staff can update all profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

-- Create RLS policies for kyc_documents
CREATE POLICY "Users can view their own documents"
  ON kyc_documents
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can upload their own documents"
  ON kyc_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff can view all documents"
  ON kyc_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Staff can verify documents"
  ON kyc_documents
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'manager')
    )
  );

-- Create update triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_documents_updated_at
  BEFORE UPDATE ON kyc_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create functions for document verification
CREATE OR REPLACE FUNCTION verify_document(
  document_id uuid,
  verified_by_user_id uuid,
  new_status verification_status,
  rejection_reason text DEFAULT NULL
) RETURNS kyc_documents AS $$
DECLARE
  document kyc_documents;
BEGIN
  -- Update document status
  UPDATE kyc_documents
  SET status = new_status,
      verified_at = CASE WHEN new_status = 'approved' THEN now() ELSE NULL END,
      verified_by = verified_by_user_id,
      rejection_reason = CASE WHEN new_status = 'rejected' THEN rejection_reason ELSE NULL END
  WHERE id = document_id
  RETURNING * INTO document;

  -- Update user profile KYC status if all documents are verified
  IF new_status = 'approved' THEN
    UPDATE user_profiles
    SET kyc_status = CASE
      WHEN NOT EXISTS (
        SELECT 1 FROM kyc_documents
        WHERE user_id = document.user_id
        AND status != 'approved'
      ) THEN 'approved'
      ELSE kyc_status
    END,
    kyc_verified_at = CASE
      WHEN NOT EXISTS (
        SELECT 1 FROM kyc_documents
        WHERE user_id = document.user_id
        AND status != 'approved'
      ) THEN now()
      ELSE kyc_verified_at
    END,
    kyc_verified_by = CASE
      WHEN NOT EXISTS (
        SELECT 1 FROM kyc_documents
        WHERE user_id = document.user_id
        AND status != 'approved'
      ) THEN verified_by_user_id
      ELSE kyc_verified_by
    END
    WHERE id = document.user_id;
  END IF;

  RETURN document;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;