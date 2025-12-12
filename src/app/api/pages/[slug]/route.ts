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
    
    // Process video: prioritize heroVideo (uploaded file) first, fallback to heroVideoLink if no uploaded file
    if (page.videoUrl) {
      // Use uploaded video file (heroVideo) - videoUrl is already set from the query
      // No additional processing needed for direct video files
      page.isEmbeddable = false;
      // Clear heroVideoLink to ensure it's not used
      page.heroVideoLink = null;
    } else if (page.heroVideoLink && page.heroVideoLink.url && page.heroVideoLink.type) {
      // Fallback to heroVideoLink if no uploaded video file exists
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
