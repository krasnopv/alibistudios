import { NextResponse } from 'next/server'
import { client, queries } from '@/lib/sanity'

export async function GET() {
  try {
    // Check if client is properly configured
    if (!client.config().projectId) {
      throw new Error('Sanity client not properly configured')
    }
    
    const addresses = await client.fetch(queries.addresses)
    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch addresses', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
