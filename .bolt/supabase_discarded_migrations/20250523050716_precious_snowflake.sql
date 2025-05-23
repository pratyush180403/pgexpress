/*
  # Room Booking System Schema

  1. Tables
    - rooms: Stores room information and availability
    - bookings: Manages room reservations
    - virtual_tours: Handles virtual tour content for rooms

  2. Security
    - RLS enabled on all tables
    - Policies for user access control
    - Staff-specific management policies

  3. Indexes
    - Optimized queries for room status and booking dates
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  amenities jsonb DEFAULT '{}',
  hourly_rate numeric(10,2) NOT NULL CHECK (hourly_rate > 0),
  status room_status DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms ON DELETE CASCADE,
  user_id uuid REFERENCES users ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status booking_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_booking_time CHECK (end_time > start_time),
  CONSTRAINT no_overlapping_bookings UNIQUE (room_id, start_time, end_time)
);

-- Create virtual_tours table
CREATE TABLE IF NOT EXISTS virtual_tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms ON DELETE CASCADE,
  tour_url text NOT NULL,
  thumbnail_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_tours ENABLE ROW LEVEL SECURITY;

-- Create policies for rooms
CREATE POLICY "Anyone can view available rooms"
  ON rooms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can manage rooms"
  ON rooms
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff can manage all bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- Create policies for virtual tours
CREATE POLICY "Anyone can view virtual tours"
  ON virtual_tours
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Staff can manage virtual tours"
  ON virtual_tours
  FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'manager')
  );

-- Create indexes
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_bookings_room_date ON bookings(room_id, start_time, end_time);
CREATE INDEX idx_bookings_user ON bookings(user_id);

-- Create update trigger for rooms
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create update trigger for bookings
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create update trigger for virtual_tours
CREATE TRIGGER update_virtual_tours_updated_at
  BEFORE UPDATE ON virtual_tours
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();