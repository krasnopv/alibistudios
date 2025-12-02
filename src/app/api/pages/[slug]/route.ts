import { NextResponse } from 'next/server'
import { client, queries } from '@/lib/sanity'
import { getEmbedUrl, isEmbeddableVideo } from '@/lib/videoUtils'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    console.log('Fetching page with slug:', slug)
    const query = queries.pageBySlug(slug)
    console.log('GROQ query:', query)
    
    const page = await client.fetch(query)
    console.log('Fetched page data:', page)
    
    if (!page) {
      console.log('No page found for slug:', slug)
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    
    // Process heroVideoLink: prioritize it over heroVideo if it exists
    if (page.heroVideoLink && page.heroVideoLink.url && page.heroVideoLink.type) {
      const videoType = page.heroVideoLink.type as 'vimeo' | 'youtube' | 'custom';
      const embedUrl = getEmbedUrl(page.heroVideoLink.url, videoType, true); // Start muted
      
      // Set videoUrl to the embed URL and mark it as embeddable
      page.videoUrl = embedUrl;
      page.videoType = videoType;
      page.isEmbeddable = isEmbeddableVideo(videoType);
      // Keep original URL for mute/unmute control
      page.heroVideoLink = {
        ...page.heroVideoLink,
        url: page.heroVideoLink.url
      };
    }
    
    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 })
  }
}
