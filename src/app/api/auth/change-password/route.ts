import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const USER_ID = 2;

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Password lama dan baru harus diisi.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password baru minimal 6 karakter.' }, { status: 400 });
    }

    // Get current password hash
    const { data, error } = await supabase
      .from('tbl_users')
      .select('password')
      .eq('id', USER_ID)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });
    }

    // Hash current password input and compare
    const encoder = new TextEncoder();
    const currentBytes = encoder.encode(currentPassword);
    const currentHashBuffer = await crypto.subtle.digest('SHA-256', currentBytes);
    const currentHashArray = Array.from(new Uint8Array(currentHashBuffer));
    const currentHashed = currentHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (currentHashed !== data.password) {
      return NextResponse.json({ error: 'Password lama tidak sesuai.' }, { status: 401 });
    }

    // Hash new password
    const newBytes = encoder.encode(newPassword);
    const newHashBuffer = await crypto.subtle.digest('SHA-256', newBytes);
    const newHashArray = Array.from(new Uint8Array(newHashBuffer));
    const newHashed = newHashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Update password
    const { error: updateErr } = await supabase
      .from('tbl_users')
      .update({ password: newHashed })
      .eq('id', USER_ID);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Password berhasil diperbarui.' });
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
