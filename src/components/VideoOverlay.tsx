'use client';

import { useEffect } from 'react';

interface VideoOverlayProps {
  videoUrl: string | null;
  onClose: () => void;
}

const VideoOverlay = ({ videoUrl, onClose }: VideoOverlayProps) => {
  // Function to convert video URLs to embed format
  const getEmbedUrl = (url: string): string => {
    // Vimeo URL conversion
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    
    // YouTube URL conversion
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    
    // For direct video files, return as is
    return url;
  };

  // Close overlay on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (videoUrl) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [videoUrl, onClose]);

  if (!videoUrl) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4" 
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-black text-2xl hover:text-gray-600 transition-colors duration-200 z-10"
          aria-label="Close video"
        >
          ✕
        </button>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={getEmbedUrl(videoUrl)}
            className="absolute inset-0 w-full h-full rounded-lg"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Video player"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoOverlay;
