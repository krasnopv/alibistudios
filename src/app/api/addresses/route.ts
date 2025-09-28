import { NextResponse } from 'next/server'
import { client, queries } from '@/lib/sanity'

export async function GET() {
  try {
    const addresses = await client.fetch(queries.addresses)
    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
  }
}
