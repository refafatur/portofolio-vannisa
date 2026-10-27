import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// PUT - Update timeline
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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
      .update({ year: year.trim(), title: title.trim(), description: description.trim() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating timeline:', error);
    return NextResponse.json({ error: 'Failed to update timeline' }, { status: 500 });
  }
}

// DELETE - Hapus timeline
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { error } = await supabase
      .from('tbl_timelines')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Timeline deleted successfully' });
  } catch (error) {
    console.error('Error deleting timeline:', error);
    return NextResponse.json({ error: 'Failed to delete timeline' }, { status: 500 });
  }
}
