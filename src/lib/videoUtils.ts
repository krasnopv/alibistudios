/**
 * Converts video URLs to embeddable format for Vimeo, YouTube, or returns custom URLs as-is
 * @param url - The original video URL
 * @param type - The video platform type
 * @param muted - Whether the video should be muted (default: true)
 */
export function getEmbedUrl(url: string, type: 'vimeo' | 'youtube' | 'custom', muted: boolean = true): string {
  if (type === 'vimeo') {
    // Handle Vimeo URLs
    // Supports: https://vimeo.com/123456789, https://vimeo.com/123456789?param=value
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match && match[1]) {
      const muteParam = muted ? '&muted=1' : '&muted=0';
      return `https://player.vimeo.com/video/${match[1]}?autoplay=1&loop=1${muteParam}&background=1`;
    }
    // If already an embed URL, update mute parameter
    if (url.includes('player.vimeo.com')) {
      const muteParam = muted ? '&muted=1' : '&muted=0';
      // Remove existing muted parameter and add new one
      const urlWithoutMute = url.replace(/[&?]muted=\d+/g, '');
      const separator = urlWithoutMute.includes('?') ? '&' : '?';
      return `${urlWithoutMute}${separator}${muteParam.substring(1)}`;
    }
  } else if (type === 'youtube') {
    // Handle YouTube URLs
    // Supports: https://www.youtube.com/watch?v=VIDEO_ID, https://youtu.be/VIDEO_ID
    let videoId: string | null = null;
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    if (videoId) {
      const muteParam = muted ? '&mute=1' : '&mute=0';
      return `https://www.youtube.com/embed/${videoId}?autoplay=1${muteParam}&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;
    }
    
    // If already an embed URL, update mute parameter
    if (url.includes('youtube.com/embed')) {
      const muteParam = muted ? '&mute=1' : '&mute=0';
      // Remove existing mute parameter and add new one
      const urlWithoutMute = url.replace(/[&?]mute=\d+/g, '');
      const separator = urlWithoutMute.includes('?') ? '&' : '?';
      return `${urlWithoutMute}${separator}${muteParam.substring(1)}`;
    }
  }
  
  // For custom URLs, return as-is
  return url;
}

/**
 * Determines if a URL is an embeddable video (iframe) or a direct video file
 */
export function isEmbeddableVideo(type: 'vimeo' | 'youtube' | 'custom'): boolean {
  return type === 'vimeo' || type === 'youtube';
}

