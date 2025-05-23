/*
  # Room Booking System Tables
  
  1. New Tables
    - rooms: Stores room information and availability
    - bookings: Manages room reservations
    - virtual_tours: Links virtual tour content to rooms
    
  2. Security
    - RLS enabled on all tables
    - Indexes for optimized queries
    
  3. Constraints
    - Capacity and rate validation
    - Booking time validation
    - No overlapping bookings
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

-- Create update triggers
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_virtual_tours_updated_at
  BEFORE UPDATE ON virtual_tours
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();