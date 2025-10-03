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
        videoTrailer {
          type,
          url,
          videoFile,
          "videoFileUrl": videoFile.asset->url,
          thumbnail,
          "thumbnailUrl": thumbnail.asset->url,
          "thumbnailAlt": thumbnail.alt
        },
        credits[] {
          role,
          people[] {
            type,
            teamMember->{
              fullName
            },
            manualName
          },
          award->{
            _id,
            name
          }
        },
        images[] {
          _id,
          "imageUrl": asset->url,
          "imageAlt": alt
        },
        relatedProjects[]->{
          _id,
          title,
          subtitle,
          "slug": slug.current,
          image,
          "imageUrl": image.asset->url,
          "imageAlt": image.alt
        },
        services[]->{
          _id,
          title,
          "slug": slug.current
        },
        image,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      }
    `, { slug });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    console.log('Project fetched:', project.title, 'slug:', slug);
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}