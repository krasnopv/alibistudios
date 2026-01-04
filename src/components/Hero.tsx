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
  dataSource?: 'page' | 'service'; // 'page' for pages API, 'service' for services API
}

const Hero = ({ 
  pageSlug = 'home',
  className = '',
  onRenderChange,
  dataSource = 'page' // Default to 'page' for backward compatibility
}: HeroProps) => {
  // Handle root slug - convert '/' to 'home'
  const actualSlug = pageSlug === '/' ? 'home' : pageSlug;
  const [heroData, setHeroData] = useState<HeroVideo | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [useFullWidth, setUseFullWidth] = useState(false);

  // Use embedded video player hook for YouTube/Vimeo
  const { setMuted: setPlayerMuted, isReady: isPlayerReady } = useEmbeddedVideoPlayer({
    iframeRef,
    videoType: heroData?.videoType,
    videoUrl: heroData?.originalUrl
  });

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // Determine API endpoint based on dataSource
        const apiEndpoint = dataSource === 'service' 
          ? `/api/services/slug/${actualSlug}`
          : `/api/pages/${actualSlug}`;
        
        const response = await fetch(apiEndpoint);
        if (response.ok) {
          const apiData = await response.json();
          console.log('Hero data for', actualSlug, 'dataSource:', dataSource, ':', apiData);
          console.log('Poster URL check - apiData.posterUrl:', apiData.posterUrl, 'apiData.heroImageUrl:', apiData.heroImageUrl);
          
          // Normalize data mapping for both page and service responses
          // Page API: videoUrl, posterUrl (Hero Video Poster), heroTitle, heroSubtitle
          // Service API: heroVideoUrl, heroImageUrl (Hero Image), title (no subtitle)
          const videoData = {
            videoUrl: dataSource === 'page' 
              ? (apiData.videoUrl || null)
              : (apiData.heroVideoUrl || null),
            originalUrl: (apiData.isEmbeddable && apiData.heroVideoLink?.url) 
              ? apiData.heroVideoLink.url 
              : null,
            // For pages: use posterUrl (Hero Video Poster) or imageUrl as fallback, for services: use heroImageUrl (Hero Image)
            posterUrl: dataSource === 'page' 
              ? (apiData.posterUrl || apiData.imageUrl || null)
              : (apiData.heroImageUrl || null),
            title: dataSource === 'page' 
              ? (apiData.heroTitle || null)
              : (apiData.title || null),
            subtitle: dataSource === 'page' 
              ? (apiData.heroSubtitle || null)
              : undefined, // Services don't have subtitle
            videoType: apiData.videoType || null,
            isEmbeddable: apiData.isEmbeddable || false
          };
          
          setHeroData(videoData);
          console.log('Video data set - posterUrl:', videoData.posterUrl);
          
          // Reset loading state when new video data is fetched
          // Only show loading for actual videos, not poster images
          setIsLoading(!!videoData.videoUrl);
          
          // Generate initial embed URL if it's embeddable
          if (videoData.isEmbeddable && videoData.videoType && videoData.originalUrl) {
            setEmbedUrl(getEmbedUrl(videoData.originalUrl, videoData.videoType, true));
          } else if (videoData.videoUrl) {
            setEmbedUrl(videoData.videoUrl);
          } else {
            // No video, so not loading
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      }
    };

    fetchHeroData();
  }, [actualSlug, dataSource]);

  const handleVideoError = () => {
    console.error('Video failed to load');
    startFadeOut();
  };

  const handleVideoLoaded = () => {
    // Wait 1 second after video loads before starting fade-out
    setTimeout(() => {
      startFadeOut();
    }, 1000);
  };

  const handleIframeLoaded = () => {
    // Check iframe dimensions and compare with screen width
    if (iframeRef.current) {
      // Calculate the width that would be used by the viewport-height-based approach
      // 177.77777778vh = viewport height * (16/9) = viewport height * 1.7777777778
      const calculatedWidth = window.innerHeight * (16 / 9);
      const screenWidth = window.innerWidth;
      
      // If calculated width is smaller than screen width, use full width mode
      // This ensures the iframe covers the full width without gaps
      const shouldUseFullWidth = calculatedWidth < screenWidth;
      setUseFullWidth(shouldUseFullWidth);
    }
    
    // For iframes, wait a bit longer to ensure video is actually ready, then wait 1 second before fade-out
    setTimeout(() => {
      startFadeOut();
    }, 1500); // 500ms for iframe + 1000ms delay
  };

  const startFadeOut = () => {
    setIsFadingOut(true);
    // Remove preloader after fade-out animation completes (1 second)
    setTimeout(() => {
      setIsLoading(false);
      setIsFadingOut(false);
    }, 1000);
  };

  // Determine what to show based on Sanity data only
  const isSanityVideo = heroData?.videoUrl;
  const isEmbeddable = heroData?.isEmbeddable === true;
  const hasPosterOnly = !isSanityVideo && heroData?.posterUrl;
  const hasAnyMedia = isSanityVideo || hasPosterOnly;
  
  // Fallback timeout to hide preloader if load events don't fire
  useEffect(() => {
    if (isLoading && isSanityVideo && !isFadingOut) {
      const timeout = setTimeout(() => {
        console.log('Preloader timeout - hiding after 5 seconds');
        startFadeOut();
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading, isSanityVideo, isFadingOut]);

  // Recalculate full width mode on window resize and when iframe loads
  useEffect(() => {
    if (!isEmbeddable || !iframeRef.current) return;

    const checkWidth = () => {
      // Calculate the width that would result from viewport-height-based approach
      const calculatedWidth = window.innerHeight * (16 / 9);
      const screenWidth = window.innerWidth;
      
      // If calculated width is smaller than screen width, use full width mode
      const shouldUseFullWidth = calculatedWidth < screenWidth;
      setUseFullWidth(shouldUseFullWidth);
    };

    // Check on mount and resize
    checkWidth();
    window.addEventListener('resize', checkWidth);
    
    return () => {
      window.removeEventListener('resize', checkWidth);
    };
  }, [isEmbeddable, isSanityVideo]);
  
  console.log('Hero render for', actualSlug, ':', {
    videoUrl: heroData?.videoUrl,
    posterUrl: heroData?.posterUrl,
    isSanityVideo,
    hasPosterOnly,
    hasAnyMedia,
    isLoading
  });

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
      {/* Preloader - Use Hero Video Poster (pages) or Hero Image (services) if available, otherwise Layer_1.svg */}
      {isLoading && isSanityVideo && (
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-[1000ms] ease-out`}
          style={{ 
            zIndex: 50, 
            backgroundColor: '#F8F9FA',
            opacity: isFadingOut ? 0 : 1
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            {heroData?.posterUrl ? (
              // Use Hero Video Poster (pages) or Hero Image (services) from Sanity
              <img
                src={heroData.posterUrl}
                alt={heroData.title || 'Loading'}
                className="w-full h-full object-cover"
                style={{
                  aspectRatio: '16/9',
                  minHeight: '400px',
                  maxHeight: '75vh',
                  objectFit: 'cover'
                }}
                onError={() => {
                  console.error('Preloader poster image failed to load:', heroData.posterUrl);
                }}
              />
            ) : (
              // Fallback to Layer_1.svg if no poster/image available
              <Image
                src="/Layer_1.svg"
                alt="Loading"
                width={1200}
                height={200}
                className={`w-full h-auto opacity-90 ${isFadingOut ? '' : 'animate-pulse'}`}
                priority
              />
            )}
          </div>
        </div>
      )}
      
      {/* Background Video/Image */}
      <div className="relative w-full">
        {isSanityVideo ? (
          // Show Sanity video - either embedded (iframe) or direct video file
          isEmbeddable ? (
            // Embedded video (Vimeo/YouTube) - fullwidth and fullheight to match video element
            <div 
              className="w-full block landscape:max-h-[75vh] relative overflow-hidden"
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
                style={useFullWidth ? {
                  // Full width mode: width 100%, height calculated to maintain 16:9 and cover parent
                  width: '100%',
                  height: '56.25vw', // 16:9 aspect ratio (9/16 = 0.5625)
                  minHeight: '100%',
                  transform: 'translate(-50%, -50%)',
                  border: 'none',
                  pointerEvents: 'auto',
                  margin: 0,
                  padding: 0
                } : {
                  // Original solution: viewport height based
                  width: '177.77777778vh', // 16:9 aspect ratio based on viewport height
                  height: '100vh',
                  minWidth: '100%',
                  minHeight: '100%',
                  transform: 'translate(-50%, -50%)',
                  border: 'none',
                  pointerEvents: 'auto',
                  margin: 0,
                  padding: 0
                }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={heroData.title || 'Hero video'}
                onLoad={handleIframeLoaded}
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
              onLoadedData={handleVideoLoaded}
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
        {/* {(heroData?.title || heroData?.subtitle) && (
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
        )} */}
        
        {/* Sound Toggle Button - Show for both direct video files and embedded videos, but hide on homepage */}
        {isSanityVideo && actualSlug !== 'home' && (
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
