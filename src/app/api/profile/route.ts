import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { defaultProfile, ProfileData, calculateAge } from '@/lib/profileData';

const USER_ID = 2; // Vannisa's user ID

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tbl_users')
      .select('nama, email, title, bio, about_desc, phone, location, freelance, roles, avatar_url, cv_url, socials')
      .eq('id', USER_ID)
      .single();

    if (error || !data) {
      return NextResponse.json(defaultProfile);
    }

    const profile: ProfileData = {
      nama: data.nama || defaultProfile.nama,
      email: data.email || defaultProfile.email,
      title: data.title || defaultProfile.title,
      bio: data.bio || defaultProfile.bio,
      aboutDesc: data.about_desc || defaultProfile.aboutDesc,
      phone: data.phone || defaultProfile.phone,
      location: data.location || defaultProfile.location,
      freelance: data.freelance || defaultProfile.freelance,
      roles: data.roles ? data.roles.split(',').map((r: string) => r.trim()) : defaultProfile.roles,
      avatarUrl: data.avatar_url || defaultProfile.avatarUrl,
      cvUrl: data.cv_url || '',
      age: String(calculateAge('2004-05-18')),
      socials: data.socials || defaultProfile.socials,
    };

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json(defaultProfile);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const rolesStr = Array.isArray(body.roles)
      ? body.roles.join(',')
      : (body.roles || defaultProfile.roles.join(','));

    const updateData: Record<string, unknown> = {
      nama: body.nama || defaultProfile.nama,
      email: body.email || defaultProfile.email,
      title: body.title || defaultProfile.title,
      bio: body.bio || defaultProfile.bio,
      about_desc: body.aboutDesc || defaultProfile.aboutDesc,
      phone: body.phone || defaultProfile.phone,
      location: body.location || defaultProfile.location,
      freelance: body.freelance || defaultProfile.freelance,
      roles: rolesStr,
      avatar_url: body.avatarUrl || defaultProfile.avatarUrl,
      cv_url: body.cvUrl || '',
      socials: body.socials || defaultProfile.socials,
    };

    const { error } = await supabase
      .from('tbl_users')
      .update(updateData)
      .eq('id', USER_ID);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Build response profile
    const updatedProfile: ProfileData = {
      nama: updateData.nama as string,
      email: updateData.email as string,
      title: updateData.title as string,
      bio: updateData.bio as string,
      aboutDesc: updateData.about_desc as string,
      phone: updateData.phone as string,
      location: updateData.location as string,
      freelance: updateData.freelance as string,
      roles: rolesStr.split(',').map((r: string) => r.trim()),
      avatarUrl: updateData.avatar_url as string,
      cvUrl: updateData.cv_url as string,
      age: String(calculateAge('2004-05-18')),
      socials: updateData.socials as ProfileData['socials'],
    };

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
