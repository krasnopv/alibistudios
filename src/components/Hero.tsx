'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { getEmbedUrl } from '@/lib/videoUtils';
import { useEmbeddedVideoPlayer } from '@/hooks/useEmbeddedVideoPlayer';

interface HeroVideo {
  videoUrl: string;
  originalUrl?: string; // Store original URL for embedded videos
  posterUrl?: string;
  title?: string;
  subtitle?: string;
  videoType?: 'vimeo' | 'youtube' | 'custom';
  isEmbeddable?: boolean;
}

interface HeroProps {
  pageSlug?: string;
  className?: string;
  onRenderChange?: (hasContent: boolean) => void;
}

const Hero = ({ 
  pageSlug = 'home',
  className = '',
  onRenderChange
}: HeroProps) => {
  // Handle root slug - convert '/' to 'home'
  const actualSlug = pageSlug === '/' ? 'home' : pageSlug;
  const [heroData, setHeroData] = useState<HeroVideo | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  // Use embedded video player hook for YouTube/Vimeo
  const { setMuted: setPlayerMuted, isReady: isPlayerReady } = useEmbeddedVideoPlayer({
    iframeRef,
    videoType: heroData?.videoType,
    videoUrl: heroData?.originalUrl
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // Try to fetch page data from Sanity
        const isLocalDev = process.env.NODE_ENV === 'development';
        
        if (isLocalDev) {
          // Use API route for local development
          const response = await fetch(`/api/pages/${actualSlug}`);
          if (response.ok) {
            const pageData = await response.json();
            console.log('Hero data for', actualSlug, ':', pageData);
            // Always set heroData if we have a page, even without video
            // originalUrl is only needed for embedded videos (heroVideoLink), not for uploaded files (heroVideo)
            // Only set originalUrl if we're actually using heroVideoLink (isEmbeddable === true)
            const videoData = {
              videoUrl: pageData.videoUrl || null,
              originalUrl: pageData.isEmbeddable && pageData.heroVideoLink?.url ? pageData.heroVideoLink.url : null,
              posterUrl: pageData.posterUrl,
              title: pageData.heroTitle,
              subtitle: pageData.heroSubtitle,
              videoType: pageData.videoType,
              isEmbeddable: pageData.isEmbeddable || false
            };
            setHeroData(videoData);
            
            // Generate initial embed URL if it's embeddable
            if (videoData.isEmbeddable && videoData.videoType && videoData.originalUrl) {
              setEmbedUrl(getEmbedUrl(videoData.originalUrl, videoData.videoType, true));
            } else if (videoData.videoUrl) {
              setEmbedUrl(videoData.videoUrl);
            }
          }
        } else {
          // For production, also use API route to avoid CORS issues
          const response = await fetch(`/api/pages/${actualSlug}`);
          if (response.ok) {
            const pageData = await response.json();
            console.log('Hero data for', actualSlug, ':', pageData);
            // originalUrl is only needed for embedded videos (heroVideoLink), not for uploaded files (heroVideo)
            // Only set originalUrl if we're actually using heroVideoLink (isEmbeddable === true)
            const videoData = {
              videoUrl: pageData.videoUrl || null,
              originalUrl: pageData.isEmbeddable && pageData.heroVideoLink?.url ? pageData.heroVideoLink.url : null,
              posterUrl: pageData.posterUrl,
              title: pageData.heroTitle,
              subtitle: pageData.heroSubtitle,
              videoType: pageData.videoType,
              isEmbeddable: pageData.isEmbeddable || false
            };
            setHeroData(videoData);
            
            // Generate initial embed URL if it's embeddable
            if (videoData.isEmbeddable && videoData.videoType && videoData.originalUrl) {
              setEmbedUrl(getEmbedUrl(videoData.originalUrl, videoData.videoType, true));
            } else if (videoData.videoUrl) {
              setEmbedUrl(videoData.videoUrl);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      }
    };

    fetchHeroData();
  }, [actualSlug]);

  const handleVideoError = () => {
    console.error('Video failed to load');
  };

  const toggleSound = async () => {
    if (videoRef) {
      // Direct video file
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    } else if (heroData?.isEmbeddable && isPlayerReady) {
      // Embedded video - use player API to control mute without reloading
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      await setPlayerMuted(newMuted);
    }
  };

  // Determine what to show based on Sanity data only
  const isSanityVideo = heroData?.videoUrl;
  const isEmbeddable = heroData?.isEmbeddable === true;
  const hasPosterOnly = !isSanityVideo && heroData?.posterUrl;
  const hasAnyMedia = isSanityVideo || hasPosterOnly;
  
  console.log('Hero render for', actualSlug, ':', {
    videoUrl: heroData?.videoUrl,
    posterUrl: heroData?.posterUrl,
    isSanityVideo,
    hasPosterOnly,
    hasAnyMedia
  });

  // Notify parent about render state
  useEffect(() => {
    onRenderChange?.(Boolean(hasAnyMedia));
  }, [hasAnyMedia, onRenderChange]);

  // Don't render anything if no media is available
  if (!hasAnyMedia) {
    return null;
  }

  return (
    <div id="hero" className={`relative w-screen overflow-hidden max-h-[75vh] landscape:max-h-[75vh] ${className}`}>
      {/* Background Video/Image */}
      <div className="relative w-full">
        {isSanityVideo ? (
          // Show Sanity video - either embedded (iframe) or direct video file
          isEmbeddable ? (
            // Embedded video (Vimeo/YouTube) - wrapped to match video stretch
            <div 
              className="w-screen block landscape:max-h-[75vh] relative overflow-hidden"
              style={{
                aspectRatio: '16/9',
                minHeight: '400px',
                maxHeight: '75vh',
                margin: 0,
                padding: 0
              }}
            >
              <iframe
                ref={iframeRef}
                id={`hero-video-${heroData.videoType}-${actualSlug}`}
                src={embedUrl || heroData.videoUrl}
                className="absolute top-1/2 left-1/2"
                style={{
                  width: '100vw',
                  height: '56.25vw',
                  minHeight: '100%',
                  transform: 'translate(-50%, -50%)',
                  border: 'none',
                  pointerEvents: 'auto'
                }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={heroData.title || 'Hero video'}
              />
            </div>
          ) : (
            // Direct video file
            <video
              ref={setVideoRef}
              src={heroData.videoUrl}
              poster={heroData?.posterUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full block landscape:max-h-[75vh]"
              style={{
                aspectRatio: '16/9',
                minHeight: '400px',
                maxHeight: '75vh',
                margin: 0,
                padding: 0,
                objectFit: 'cover'
              }}
              onError={handleVideoError}
            />
          )
        ) : hasPosterOnly ? (
          // Show Sanity poster image
          <img
            src={heroData.posterUrl}
            alt={heroData.title || 'Hero image'}
            className="w-full block landscape:max-h-[75vh]"
            style={{
              aspectRatio: '16/9',
              minHeight: '400px',
              maxHeight: '75vh',
              margin: 0,
              padding: 0,
              objectFit: 'cover'
            }}
          />
        ) : (
          // Show nothing when no Sanity media
          <div 
            className="w-full bg-transparent landscape:max-h-[75vh]"
            style={{
              aspectRatio: '16/9',
              minHeight: '400px',
              maxHeight: '75vh',
              margin: 0,
              padding: 0
            }}
          />
        )}
        
        {/* Hero Content Overlay */}
        {(heroData?.title || heroData?.subtitle) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="text-center text-white">
              {heroData.title && (
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {heroData.title}
                </h1>
              )}
              {heroData.subtitle && (
                <p className="text-lg md:text-xl opacity-90">
                  {heroData.subtitle}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Sound Toggle Button - Show for both direct video files and embedded videos */}
        {isSanityVideo && (
          <div className="absolute bottom-2 left-0 right-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-start">
                <button
                  onClick={toggleSound}
                  className="p-2 cursor-pointer"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? (
                    // Muted icon
                    <Image 
                      src="/muted.svg" 
                      alt="Muted" 
                      width={28} 
                      height={28}
                    />
                  ) : (
                    // Playing icon
                    <Image 
                      src="/playing.svg" 
                      alt="Playing" 
                      width={28} 
                      height={28}
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
