import { NextResponse } from 'next/server';
import { supabase, supabaseBucket } from '@/lib/supabase';

const VIEWS_FILE = 'analytics/views.json';

interface ViewsData {
  totalViews: number;
  monthlyViews: number;
  currentMonth: string; // YYYY-MM
  lastUpdated: string;
}

async function getViewsData(): Promise<ViewsData> {
  const currentMonth = new Date().toISOString().slice(0, 7); // e.g. "2026-10"
  try {
    const { data, error } = await supabase.storage.from(supabaseBucket).download(VIEWS_FILE);
    if (!error && data) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      return {
        totalViews: parsed.totalViews || 0,
        monthlyViews: parsed.currentMonth === currentMonth ? (parsed.monthlyViews || 0) : 0,
        currentMonth: currentMonth,
        lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.error('Error fetching views file:', err);
  }

  return {
    totalViews: 0,
    monthlyViews: 0,
    currentMonth: currentMonth,
    lastUpdated: new Date().toISOString(),
  };
}

async function saveViewsData(data: ViewsData) {
  try {
    const buffer = Buffer.from(JSON.stringify(data, null, 2), 'utf-8');
    await supabase.storage.from(supabaseBucket).upload(VIEWS_FILE, buffer, {
      contentType: 'application/json',
      upsert: true,
    });
  } catch (err) {
    console.error('Error saving views data:', err);
  }
}

export async function GET() {
  const data = await getViewsData();
  return NextResponse.json(data);
}

export async function POST() {
  const current = await getViewsData();
  const updated: ViewsData = {
    totalViews: current.totalViews + 1,
    monthlyViews: current.monthlyViews + 1,
    currentMonth: current.currentMonth,
    lastUpdated: new Date().toISOString(),
  };

  await saveViewsData(updated);
  return NextResponse.json(updated);
}
