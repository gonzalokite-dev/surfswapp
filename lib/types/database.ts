export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          location: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          location?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          location?: string | null
          bio?: string | null
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          price: number
          category: string
          subcategory: string | null
          condition: string
          brand: string | null
          location: string | null
          sport_type: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          price: number
          category: string
          subcategory?: string | null
          condition: string
          brand?: string | null
          location?: string | null
          sport_type: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string
          price?: number
          category?: string
          subcategory?: string | null
          condition?: string
          brand?: string | null
          location?: string | null
          sport_type?: string
          status?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          order_index?: number
          created_at?: string
        }
        Update: {
          url?: string
          order_index?: number
        }
      }
      conversations: {
        Row: {
          id: string
          product_id: string | null
          buyer_id: string
          seller_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          buyer_id: string
          seller_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          created_at?: string
          read_at?: string | null
        }
        Update: {
          read_at?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type ProductImage = Database['public']['Tables']['product_images']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']

export type ProductWithImages = Product & {
  product_images: ProductImage[]
  profiles: Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url' | 'location'>
}

export type ConversationWithDetails = Conversation & {
  products: Pick<Product, 'id' | 'title' | 'price' | 'status'> & {
    product_images: Pick<ProductImage, 'url'>[]
  } | null
  buyer: Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url'>
  seller: Pick<Profile, 'id' | 'username' | 'full_name' | 'avatar_url'>
  messages: Pick<Message, 'content' | 'created_at'>[]
}

export const CATEGORIES = [
  { value: 'surf', label: 'Surf', emoji: '🏄' },
  { value: 'kitesurf', label: 'Kitesurf', emoji: '🪁' },
  { value: 'windsurf', label: 'Windsurf', emoji: '🌬️' },
  { value: 'wing', label: 'Wing', emoji: '🦅' },
  { value: 'foil', label: 'Foil', emoji: '⚡' },
  { value: 'accesorios', label: 'Accesorios', emoji: '🎒' },
] as const

export const CONDITIONS = [
  { value: 'como_nuevo', label: 'Como nuevo' },
  { value: 'muy_buen_estado', label: 'Muy buen estado' },
  { value: 'buen_estado', label: 'Buen estado' },
  { value: 'usado', label: 'Usado' },
  { value: 'para_reparar', label: 'Para reparar' },
] as const

export const PRODUCT_STATUSES = [
  { value: 'active', label: 'Activo' },
  { value: 'reserved', label: 'Reservado' },
  { value: 'sold', label: 'Vendido' },
] as const
