import { NextResponse } from 'next/server';
import { client, queries } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const menu = await client.fetch(queries.menu);
    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}


