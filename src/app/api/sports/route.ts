import { NextResponse } from 'next/server';
import { fetchSportsData } from '@/lib/sports-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const matches = await fetchSportsData();
    return NextResponse.json(matches);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch sports data' }, { status: 500 });
  }
}
