import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await client.fetch(`
      *[_type == "project"] | order(order asc) {
        _id,
        title,
        subtitle,
        "slug": slug.current,
        image,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      }
    `);

    console.log('Projects fetched:', projects.length, 'projects');
    console.log('Projects data:', JSON.stringify(projects, null, 2));
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}