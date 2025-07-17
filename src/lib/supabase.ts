
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image: string | null
          category: string
          whatsapp_number: string
          location: string
          seller_id: string
          seller_name: string
          created_at: string
          status: 'active' | 'sold'
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image?: string | null
          category: string
          whatsapp_number: string
          location: string
          seller_id: string
          seller_name: string
          created_at?: string
          status?: 'active' | 'sold'
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image?: string | null
          category?: string
          whatsapp_number?: string
          location?: string
          seller_id?: string
          seller_name?: string
          created_at?: string
          status?: 'active' | 'sold'
        }
      }
      user_profiles: {
        Row: {
          id: string
          clerk_user_id: string
          email: string
          first_name: string | null
          last_name: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
