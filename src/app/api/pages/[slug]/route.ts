import { NextResponse } from 'next/server'
import { client, queries } from '@/lib/sanity'

export const dynamic = 'force-static'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    console.log('Fetching page with slug:', slug)
    const query = queries.pageBySlug(slug)
    console.log('GROQ query:', query)
    
    const page = await client.fetch(query)
    console.log('Fetched page data:', page)
    
    if (!page) {
      console.log('No page found for slug:', slug)
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    
    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 })
  }
}
