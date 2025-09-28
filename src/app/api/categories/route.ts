import { NextResponse } from 'next/server'
import { client, queries } from '@/lib/sanity'

export const dynamic = 'force-static'

export async function GET() {
  try {
    const categories = await client.fetch(queries.categoriesWithFilms)
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
