export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'manager' | 'tenant'
          phone: string | null
          avatar_url: string | null
          verified: boolean
          kyc_status: 'pending' | 'approved' | 'rejected'
          police_verification: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'manager' | 'tenant'
          phone?: string | null
          avatar_url?: string | null
          verified?: boolean
          kyc_status?: 'pending' | 'approved' | 'rejected'
          police_verification?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'manager' | 'tenant'
          phone?: string | null
          avatar_url?: string | null
          verified?: boolean
          kyc_status?: 'pending' | 'approved' | 'rejected'
          police_verification?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          number: string
          floor: number
          capacity: number
          price: number
          status: 'available' | 'occupied' | 'maintenance'
          amenities: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          number: string
          floor: number
          capacity: number
          price: number
          status?: 'available' | 'occupied' | 'maintenance'
          amenities?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          number?: string
          floor?: number
          capacity?: number
          price?: number
          status?: 'available' | 'occupied' | 'maintenance'
          amenities?: Json
          created_at?: string
          updated_at?: string
        }
      }
      // Add other table types here...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'manager' | 'tenant'
      room_status: 'available' | 'occupied' | 'maintenance'
      booking_status: 'pending' | 'approved' | 'rejected' | 'cancelled'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      document_type: 'id_proof' | 'address_proof' | 'police_verification' | 'other'
      verification_status: 'pending' | 'approved' | 'rejected'
    }
  }
}