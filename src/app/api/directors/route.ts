import { NextResponse } from 'next/server'
import { client, queries } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const directors = await client.fetch(queries.directors)
    console.log('Directors fetched:', directors.length, 'directors')
    return NextResponse.json(directors)
  } catch (error) {
    console.error('Error fetching directors:', error)
    return NextResponse.json({ error: 'Failed to fetch directors' }, { status: 500 })
  }
}
