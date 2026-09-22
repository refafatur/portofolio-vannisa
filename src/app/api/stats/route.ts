import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const [projects, certificates, gallery] = await Promise.all([
      supabase.from('tbl_project').select('*', { count: 'exact', head: true }),
      supabase.from('tbl_certificates').select('*', { count: 'exact', head: true }),
      supabase.from('tbl_galeris').select('*', { count: 'exact', head: true }),
    ]);

    return NextResponse.json({
      projects: projects.count || 0,
      certificates: certificates.count || 0,
      gallery: gallery.count || 0,
    });
  } catch {
    return NextResponse.json({ projects: 0, certificates: 0, gallery: 0 });
  }
}
