import { NextResponse } from 'next/server'
import { client, queries } from '@/lib/sanity'

export async function GET() {
  try {
    const films = await client.fetch(queries.films)
    return NextResponse.json(films)
  } catch (error) {
    console.error('Error fetching films:', error)
    return NextResponse.json({ error: 'Failed to fetch films' }, { status: 500 })
  }
}
