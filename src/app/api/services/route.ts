import { NextResponse } from 'next/server'
import { client, queries } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const services = await client.fetch(queries.services)
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}
