import { NextResponse } from 'next/server';
import { client, queries } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const teamMembers = await client.fetch(queries.team);
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json([], { status: 500 });
  }
}
