import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const service = await client.fetch(`
      *[_type == "service" && slug.current == $slug][0] {
        _id,
        title,
        subtitle,
        description,
        url,
        features,
        heroVideo,
        "heroVideoUrl": heroVideo.asset->url,
        heroImage,
        "heroImageUrl": heroImage.asset->url,
        "heroImageAlt": heroImage.alt,
        image,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        projects[]->{
          _id,
          title,
          subtitle,
          "slug": slug.current,
          "imageUrl": image.asset->url,
          "imageAlt": image.alt,
          subServices[]->{
            _id,
            title,
            "slug": slug.current
          }
        },
        subServices[]->{
          _id,
          title,
          "slug": slug.current
        }
      }
    `, { slug });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}
