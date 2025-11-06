import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await client.fetch(`
      *[_type == "project" && _id == $id && (!defined(hideProject) || hideProject != true)][0] {
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
        images[]{
          _id,
          "imageUrl": asset->url,
          "imageAlt": alt
        },
        relatedProjects[]->[(!defined(hideProject) || hideProject != true)]{
          _id,
          title,
          subtitle,
          "imageUrl": image.asset->url,
          "imageAlt": image.alt
        },
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      }
    `, { id });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}
