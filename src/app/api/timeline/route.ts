import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Ambil semua timeline
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tbl_timelines')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 });
  }
}

// POST - Tambah timeline baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, title, description } = body;

    if (
      typeof year !== 'string' || !year.trim() ||
      typeof title !== 'string' || !title.trim() ||
      typeof description !== 'string' || !description.trim()
    ) {
      return NextResponse.json(
        { error: 'Year, title, and description are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('tbl_timelines')
      .insert([{ year: year.trim(), title: title.trim(), description: description.trim() }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating timeline:', error);
    return NextResponse.json({ error: 'Failed to create timeline' }, { status: 500 });
  }
}
