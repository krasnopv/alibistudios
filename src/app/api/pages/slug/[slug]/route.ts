import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const page = await client.fetch(`
      *[_type == "page" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description,
        heroVideo,
        "heroVideoUrl": heroVideo.asset->url,
        image,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        heroTitle,
        heroSubtitle,
        content,
        seoImage,
        "seoImageUrl": seoImage.asset->url,
        publishedAt,
        isPublished
      }
    `, { slug });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    console.log('Page fetched:', page.title, 'slug:', slug);
    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}
