import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { nama, email, password } = await request.json();

    // Check if email exists
    const { data: existing } = await supabase
      .from('tbl_users')
      .select('id')
      .eq('email', email);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 400 });
    }

    // SHA-256 hash
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const { data, error } = await supabase
      .from('tbl_users')
      .insert([{ nama, email, password: hashedPassword }])
      .select();

    if (error) return NextResponse.json({ error: `Registration failed: ${error.message}` }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
