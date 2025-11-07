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
      *[_type == "project" && slug.current == $slug && (!defined(hideProject) || hideProject != true)][0] {
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
          "thumbnailAlt": thumbnail.alt,
          "thumbnailSmall": thumbnail.asset->url + "?w=400&h=225&fit=crop&auto=format",
          "thumbnailMedium": thumbnail.asset->url + "?w=800&h=450&fit=crop&auto=format",
          "thumbnailLarge": thumbnail.asset->url + "?w=1200&h=675&fit=crop&auto=format"
        },
        credits[] {
          role,
          people[] {
            type,
            teamMember->{
              fullName
            },
            manualName
          }
        },
        awards[]->{
          _id,
          name,
          year,
          category,
          description
        },
        images[] {
          _id,
          "imageUrl": asset->url,
          "imageAlt": alt
        },
        "relatedProjects": *[_type == "project" && _id in ^.relatedProjects[]._ref && (!defined(hideProject) || hideProject != true)]{
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