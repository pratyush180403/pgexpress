/*
  # Add performance indexes and constraints

  1. New Indexes
    - Add indexes for frequently queried columns
    - Add composite indexes for common query patterns
    
  2. Additional Constraints
    - Add check constraints for data validation
    - Add foreign key constraints with proper deletion behavior
*/

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_bookings_tenant_dates ON bookings(tenant_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_payments_tenant_date ON payments(tenant_id, payment_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_tenant_status ON maintenance_requests(tenant_id, status);

-- Add check constraints
ALTER TABLE rooms
ADD CONSTRAINT chk_room_capacity 
CHECK (capacity > 0);

ALTER TABLE payments
ADD CONSTRAINT chk_payment_amount 
CHECK (amount > 0);

ALTER TABLE bookings
ADD CONSTRAINT chk_booking_dates 
CHECK (end_date IS NULL OR end_date >= start_date);

-- Add cascade delete for related records
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS bookings_room_id_fkey,
ADD CONSTRAINT bookings_room_id_fkey
FOREIGN KEY (room_id)
REFERENCES rooms(id)
ON DELETE CASCADE;

ALTER TABLE payments
DROP CONSTRAINT IF EXISTS payments_booking_id_fkey,
ADD CONSTRAINT payments_booking_id_fkey
FOREIGN KEY (booking_id)
REFERENCES bookings(id)
ON DELETE CASCADE;