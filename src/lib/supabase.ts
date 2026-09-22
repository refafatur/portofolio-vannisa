import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabaseBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'Portofolio';

// Validasi sederhana agar tidak error saat build
if (!supabaseUrl || !supabaseKey) {
  console.warn("Peringatan: Supabase ENV tidak ditemukan!");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
);

export { supabaseBucket };
