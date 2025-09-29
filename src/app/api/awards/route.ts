import { NextResponse } from 'next/server'
import { client, queries } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const awards = await client.fetch(queries.awards)
    return NextResponse.json(awards)
  } catch (error) {
    console.error('Error fetching awards:', error)
    return NextResponse.json({ error: 'Failed to fetch awards' }, { status: 500 })
  }
}
