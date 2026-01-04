import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';
import { getEmbedUrl, isEmbeddableVideo } from '@/lib/videoUtils';

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
        subtitle,
        slug,
        description,
        heroVideo,
        heroVideoLink {
          type,
          url
        },
        "heroVideoUrl": heroVideo.asset->url,
        heroVideoPoster,
        image,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt,
        "posterUrl": heroVideoPoster.asset->url,
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
    `, { slug });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Process video: prioritize heroVideoLink for all pages, fallback to heroVideo (uploaded file)
    if (page.heroVideoLink && page.heroVideoLink.url && page.heroVideoLink.type) {
      // Prioritize heroVideoLink for all pages
      const videoType = page.heroVideoLink.type as 'vimeo' | 'youtube' | 'custom';
      const embedUrl = getEmbedUrl(page.heroVideoLink.url, videoType, true); // Start muted
      
      // Set videoUrl to the embed URL and mark it as embeddable
      page.videoUrl = embedUrl;
      page.videoType = videoType;
      page.isEmbeddable = isEmbeddableVideo(videoType);
      page.heroVideoLink = {
        ...page.heroVideoLink,
        url: page.heroVideoLink.url // Keep original URL for mute/unmute control
      };
    } else if (page.heroVideoUrl) {
      // Fallback to uploaded video file (heroVideo) - set videoUrl from heroVideoUrl
      page.videoUrl = page.heroVideoUrl;
      page.isEmbeddable = false;
    }

    console.log('Page fetched:', page.title, 'slug:', slug);
    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}
