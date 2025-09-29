import { NextResponse } from 'next/server'
import { client, queries } from '@/lib/sanity'

export const dynamic = 'force-static'

export async function GET() {
  try {
    const services = await client.fetch(queries.homepageServices)
    console.log('Homepage services fetched:', services.length, 'services')
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching homepage services:', error)
    return NextResponse.json({ error: 'Failed to fetch homepage services' }, { status: 500 })
  }
}
