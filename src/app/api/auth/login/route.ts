import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const { data, error } = await supabase
      .from('tbl_users')
      .select('*')
      .eq('email', email);

    if (error || !data || data.length === 0) {
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    }

    // SHA-256 hash
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedInput = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashedInput !== data[0].password) {
      return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      user: { 
        id: data[0].id, 
        nama: data[0].nama, 
        email: data[0].email 
      } 
    });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
