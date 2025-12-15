import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { getEmbedUrl, isEmbeddableVideo } from '@/lib/videoUtils';

export const dynamic = 'force-dynamic';

interface ProjectWithHideFlag {
  _id: string;
  title: string;
  subtitle: string;
  slug: string;
  hideProject?: boolean;
  imageUrl: string;
  imageAlt: string;
  imageSmall?: string;
  imageMedium?: string;
  imageLarge?: string;
  subServices?: Array<{
    _id: string;
    title: string;
    slug: string;
  }>;
}

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
        heroVideoLink {
          type,
          url
        },
        "heroVideoUrl": heroVideo.asset->url,
        heroImage,
        "heroImageUrl": heroImage.asset->url,
        "heroImageAlt": heroImage.alt,
        image,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        reels[] {
          type,
          url,
          videoFile {
            asset->{
              _id,
              url
            }
          },
          "videoFileUrl": videoFile.asset->url,
          thumbnail {
            asset->{
              _id,
              url
            },
            alt,
            caption
          },
          "thumbnailUrl": thumbnail.asset->url,
          "thumbnailAlt": thumbnail.alt,
          "thumbnailCaption": thumbnail.caption
        },
        "projects": projects[]->{
          _id,
          title,
          subtitle,
          "slug": slug.current,
          hideProject,
          order,
          "imageUrl": image.asset->url,
          "imageAlt": image.alt,
          "imageSmall": image.asset->url + "?w=300&h=169&fit=crop&auto=format",
          "imageMedium": image.asset->url + "?w=600&h=338&fit=crop&auto=format",
          "imageLarge": image.asset->url + "?w=900&h=506&fit=crop&auto=format",
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

    // Filter out projects where hideProject is true, preserving the order from Sanity
    if (service.projects) {
      service.projects = (service.projects as ProjectWithHideFlag[])
        .filter((project: ProjectWithHideFlag) => project && (!project.hideProject || project.hideProject !== true))
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ hideProject, ...project }: ProjectWithHideFlag) => project); // Remove hideProject from response
    }

    // Process video: prioritize heroVideo (uploaded file) first, fallback to heroVideoLink if no uploaded file
    if (service.heroVideoUrl) {
      // Use uploaded video file (heroVideo) - heroVideoUrl is already set from the query
      // No additional processing needed for direct video files
      service.isEmbeddable = false;
    } else if (service.heroVideoLink && service.heroVideoLink.url && service.heroVideoLink.type) {
      // Fallback to heroVideoLink if no uploaded video file exists
      const videoType = service.heroVideoLink.type as 'vimeo' | 'youtube' | 'custom';
      const embedUrl = getEmbedUrl(service.heroVideoLink.url, videoType, true); // Start muted
      
      // Set heroVideoUrl to the embed URL and mark it as embeddable
      service.heroVideoUrl = embedUrl;
      service.videoType = videoType;
      service.isEmbeddable = isEmbeddableVideo(videoType);
      // Keep original URL for mute/unmute control
      service.heroVideoLink = {
        ...service.heroVideoLink,
        url: service.heroVideoLink.url
      };
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}
