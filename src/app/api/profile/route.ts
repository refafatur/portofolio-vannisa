import { NextResponse } from 'next/server';
import { supabase, supabaseBucket } from '@/lib/supabase';
import { defaultProfile, ProfileData } from '@/lib/profileData';

const PROFILE_FILE_PATH = 'profile/data.json';

export async function GET() {
  try {
    const { data, error } = await supabase.storage
      .from(supabaseBucket)
      .download(PROFILE_FILE_PATH);

    if (error || !data) {
      return NextResponse.json(defaultProfile);
    }

    const text = await data.text();
    const parsed = JSON.parse(text) as ProfileData;
    return NextResponse.json({ ...defaultProfile, ...parsed });
  } catch {
    return NextResponse.json(defaultProfile);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updatedProfile: ProfileData = {
      ...defaultProfile,
      ...body,
    };

    const buffer = Buffer.from(JSON.stringify(updatedProfile, null, 2), 'utf-8');

    const { error } = await supabase.storage
      .from(supabaseBucket)
      .upload(PROFILE_FILE_PATH, buffer, {
        contentType: 'application/json',
        upsert: true,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also update tbl_users if nama / email changed
    try {
      await supabase
        .from('tbl_users')
        .update({
          nama: updatedProfile.nama,
          email: updatedProfile.email,
        })
        .eq('id', 1);
    } catch {
      // ignore if user id is different or not found
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
