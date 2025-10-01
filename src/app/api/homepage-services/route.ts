import { NextResponse } from 'next/server'
import { client, queries } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const services = await client.fetch(queries.homepageServices)
    console.log('Homepage services fetched:', services.length, 'services')
    console.log('Services data:', JSON.stringify(services, null, 2))
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching homepage services:', error)
    return NextResponse.json({ error: 'Failed to fetch homepage services' }, { status: 500 })
  }
}
