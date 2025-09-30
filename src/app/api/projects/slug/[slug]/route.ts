import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const project = await client.fetch(`
      *[_type == "project" && slug.current == $slug][0] {
        _id,
        title,
        subtitle,
        description,
        fullTitle,
        credits[]{
          role,
          person{
            type,
            teamMember->{
              fullName,
              name
            },
            manualName
          },
          award->{
            _id,
            name
          }
        },
        videoTrailer{
          type,
          url,
          "videoFileUrl": videoFile.asset->url,
          "thumbnailUrl": thumbnail.asset->url,
          "thumbnailAlt": thumbnail.alt
        },
        images[]{
          _id,
          "imageUrl": asset->url,
          "imageAlt": alt
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
    `, { slug });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}
