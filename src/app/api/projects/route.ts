import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await client.fetch(`
      *[_type == "project" && featured == true] | order(order asc, _createdAt asc) {
        _id,
        title,
        subtitle,
        description,
        fullTitle,
        credits[]{
          role,
          person,
          award->{
            _id,
            name
          }
        },
        images[]{
          _id,
          "imageUrl": image.asset->url,
          "imageAlt": image.alt
        },
        relatedProjects[]->{
          _id,
          title,
          subtitle,
          "imageUrl": image.asset->url,
          "imageAlt": image.alt
        },
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      }
    `);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
