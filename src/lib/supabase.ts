import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          stock: number;
          category_id: string | null;
          image_url: string;
          is_new: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          price: number;
          stock?: number;
          category_id?: string | null;
          image_url?: string;
          is_new?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          stock?: number;
          category_id?: string | null;
          image_url?: string;
          is_new?: boolean;
          updated_at?: string;
        };
      };
      wishes: {
        Row: {
          id: string;
          user_name: string;
          user_email: string;
          product_description: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_name: string;
          user_email: string;
          product_description: string;
          status?: string;
          created_at?: string;
        };
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
      };
    };
  };
};
