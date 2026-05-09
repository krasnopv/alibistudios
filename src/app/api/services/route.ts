import { NextResponse } from 'next/server'
import { client, queries } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const services = await client.fetch(queries.services) as Array<{
      featuredImageType?: string;
      featuredImageUrl?: string | null;
      featuredImageAlt?: string | null;
      imageUrl?: string | null;
      imageAlt?: string | null;
    }>;
    // Enforce featured image type so "url" / "Image from URL" always use featuredImageUrl
    services.forEach((s) => {
      const t = s.featuredImageType;
      if (t === 'none') {
        s.imageUrl = null;
        s.imageAlt = null;
      } else if (t === 'url' || t === 'Image from URL') {
        s.imageUrl = s.featuredImageUrl ?? null;
        s.imageAlt = s.featuredImageAlt ?? null;
      }
    });
    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}
