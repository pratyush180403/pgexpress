/*
  # Meal Management System Schema

  1. New Tables
    - meals
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - type (text)
      - price (numeric)
      - available_on (text[])
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - meal_bookings
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - meal_id (uuid, foreign key)
      - date (date)
      - status (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - meal_preferences
      - user_id (uuid, primary key)
      - dietary_restrictions (text[])
      - allergies (text[])
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - meal_feedback
      - id (uuid, primary key)
      - booking_id (uuid, foreign key)
      - rating (integer)
      - comments (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for CRUD operations
*/

-- Create meals table
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text NOT NULL,
  price numeric(10,2) NOT NULL,
  available_on text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_meal CHECK (
    length(name) > 0 AND
    price > 0
  )
);

-- Create meal_bookings table
CREATE TABLE IF NOT EXISTS meal_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  meal_id uuid REFERENCES meals(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create meal_preferences table
CREATE TABLE IF NOT EXISTS meal_preferences (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  dietary_restrictions text[] DEFAULT '{}',
  allergies text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create meal_feedback table
CREATE TABLE IF NOT EXISTS meal_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES meal_bookings(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL,
  comments text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_rating CHECK (
    rating >= 1 AND rating <= 5
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_meal_bookings_user ON meal_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_bookings_date ON meal_bookings(date);
CREATE INDEX IF NOT EXISTS idx_meal_feedback_booking ON meal_feedback(booking_id);

-- Enable RLS
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for meals
CREATE POLICY "Anyone can view available meals"
  ON meals
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can manage meals"
  ON meals
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- Create policies for meal_bookings
CREATE POLICY "Users can view their own bookings"
  ON meal_bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Staff can view all bookings"
  ON meal_bookings
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'manager')
  );

CREATE POLICY "Users can create their own bookings"
  ON meal_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings"
  ON meal_bookings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for meal_preferences
CREATE POLICY "Users can manage their own preferences"
  ON meal_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff can view all preferences"
  ON meal_preferences
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- Create policies for meal_feedback
CREATE POLICY "Users can manage their own feedback"
  ON meal_feedback
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meal_bookings
      WHERE id = booking_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all feedback"
  ON meal_feedback
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_meals_timestamp
  BEFORE UPDATE ON meals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_bookings_timestamp
  BEFORE UPDATE ON meal_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_preferences_timestamp
  BEFORE UPDATE ON meal_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_feedback_timestamp
  BEFORE UPDATE ON meal_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();