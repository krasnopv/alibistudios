import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const page = await client.fetch(`
      *[_type == "page" && slug.current == "studios-tax-rebate"][0] {
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
        content[] {
          ...,
          url {
            ...,
            internalPage->{
              _id,
              "slug": slug.current
            }
          }
        },
        seoImage,
        "seoImageUrl": seoImage.asset->url,
        publishedAt,
        isPublished
      }
    `);

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    console.log('Studios Tax Rebate page fetched:', page.title);
    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching studios-tax-rebate page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}
