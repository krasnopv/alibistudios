'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import PageLoader from '@/components/PageLoader';
import ScrollableCategories from '@/components/ScrollableCategories';
import ServicesGrid from '@/components/ServicesGrid';
import GetInTouch from '@/components/GetInTouch';
import BlockContent from '@sanity/block-content-to-react';
import { serializers } from '@/lib/serializers';
import { getEmbedUrl } from '@/lib/videoUtils';
import { useEmbeddedVideoPlayer } from '@/hooks/useEmbeddedVideoPlayer';

interface SubService {
  _id: string;
  title: string;
  slug: string;
}

interface Reel {
  type: 'youtube' | 'vimeo' | 'upload';
  url?: string;
  videoFileUrl?: string;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  thumbnailCaption?: string;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  subtitle?: unknown[];
  description: string | unknown;
  url?: string;
  features?: string[];
  heroVideo?: {
    _id: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  heroVideoUrl?: string;
  heroVideoLink?: {
    type: 'vimeo' | 'youtube' | 'custom';
    url: string;
  };
  videoType?: 'vimeo' | 'youtube' | 'custom';
  isEmbeddable?: boolean;
  heroImage?: {
    _id: string;
    asset: {
      _ref: string;
      _type: string;
    };
    alt?: string;
  };
  heroImageUrl?: string;
  heroImageAlt?: string;
  imageUrl?: string;
  imageAlt?: string;
  reels?: Reel[];
  projects?: {
    _id: string;
    title: string;
    subtitle: string;
    slug: string;
    imageUrl: string;
    imageAlt: string;
    imageSmall?: string;
    imageMedium?: string;
    imageLarge?: string;
    subServices?: SubService[];
  }[];
  subServices?: SubService[];
}


const ServicePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const serviceSlug = params.slug;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [reelLoadingStates, setReelLoadingStates] = useState<Record<number, boolean>>({});

  // Use embedded video player hook for YouTube/Vimeo
  const { setMuted: setPlayerMuted, isReady: isPlayerReady } = useEmbeddedVideoPlayer({
    iframeRef,
    videoType: service?.videoType,
    videoUrl: service?.heroVideoLink?.url
  });

  const renderRichText = (content: string | unknown) => {
    // Handle null/undefined
    if (!content) {
      return null;
    }
    
    // Handle string content (including raw HTML)
    if (typeof content === 'string') {
      // Check if it's HTML content
      if (content.includes('<') && content.includes('>')) {
        return (
          <div 
            key={`html-${serviceSlug}`} 
            className="mb-4 last:mb-0"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      }
      // Regular text content
      return content.split('\n').map((paragraph, index) => (
        <p key={`paragraph-${index}-${serviceSlug}`} className="mb-4 last:mb-0">
          {paragraph}
        </p>
      ));
    }
    
    // Handle Sanity Portable Text with HTML blocks
    if (Array.isArray(content)) {
      return content.map((block, index) => {
        // Handle HTML blocks
        if (block._type === 'htmlBlock' && block.html) {
          return (
            <div 
              key={`html-block-${index}-${serviceSlug}`} 
              className="mb-4 last:mb-0"
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          );
        }
        return null;
      }).filter(Boolean).length > 0 ? (
        content.map((block, index) => {
          if (block._type === 'htmlBlock' && block.html) {
            return (
              <div 
                key={`html-block-${index}-${serviceSlug}`} 
                className="mb-4 last:mb-0"
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            );
          }
          return null;
        }).filter(Boolean)
      ) : (
        <BlockContent blocks={content} serializers={serializers} />
      );
    }
    
    // Fallback for other data types
    return (
      <p key={`fallback-${serviceSlug}`} className="mb-4 last:mb-0">
        {String(content)}
      </p>
    );
  };

  const toggleSound = async () => {
    if (videoRef) {
      // Direct video file
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    } else if (service?.isEmbeddable && isPlayerReady) {
      // Embedded video - use player API to control mute without reloading
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      await setPlayerMuted(newMuted);
    }
  };

  // Helper function to get embed URL for YouTube/Vimeo (for reels)
  const getReelEmbedUrl = (url: string, type: 'youtube' | 'vimeo', autoplay: boolean = false): string => {
    if (type === 'youtube') {
      // Handle YouTube URLs
      let videoId = '';
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      
      if (videoId) {
        const autoplayParam = autoplay ? '&autoplay=1' : '';
        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1${autoplayParam}`;
      }
    } else if (type === 'vimeo') {
      // Handle Vimeo URLs
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        const autoplayParam = autoplay ? '?autoplay=1' : '';
        return `https://player.vimeo.com/video/${videoId}${autoplayParam}`;
      }
    }
    return url;
  };

  // Handle thumbnail click to start video
  const handleThumbnailClick = (reelIndex: number, reel: Reel) => {
    // Hide thumbnail
    setReelLoadingStates(prev => ({
      ...prev,
      [reelIndex]: false
    }));
    
    // Update iframe src to include autoplay
    if ((reel.type === 'youtube' || reel.type === 'vimeo') && reel.url) {
      const iframe = document.getElementById(`reel-${reelIndex}`) as HTMLIFrameElement;
      if (iframe) {
        const newEmbedUrl = getReelEmbedUrl(reel.url, reel.type, true);
        iframe.src = newEmbedUrl;
      }
    }
  };

  // Initialize loading state for reels when service data is loaded
  useEffect(() => {
    if (service?.reels) {
      const initialLoadingStates: Record<number, boolean> = {};
      service.reels.forEach((reel, index) => {
        if ((reel.type === 'youtube' || reel.type === 'vimeo') && reel.thumbnailUrl) {
          initialLoadingStates[index] = true;
        }
      });
      setReelLoadingStates(initialLoadingStates);
    }
  }, [service?.reels]);

  // Reset thumbnail when switching reels
  useEffect(() => {
    if (service?.reels && service.reels[activeReelIndex]) {
      const reel = service.reels[activeReelIndex];
      // Show thumbnail for the new active reel
      if (reel.thumbnailUrl) {
        setReelLoadingStates(prev => ({
          ...prev,
          [activeReelIndex]: true
        }));
        
        // Reset iframe src to remove autoplay for YouTube/Vimeo
        if ((reel.type === 'youtube' || reel.type === 'vimeo') && reel.url) {
          const iframe = document.getElementById(`reel-${activeReelIndex}`) as HTMLIFrameElement;
          if (iframe) {
            const newEmbedUrl = getReelEmbedUrl(reel.url, reel.type, false);
            iframe.src = newEmbedUrl;
          }
        }
        
        // Pause and reset uploaded videos when switching
        if (reel.type === 'upload') {
          const video = document.getElementById(`reel-video-${activeReelIndex}`) as HTMLVideoElement;
          if (video) {
            video.pause();
            video.currentTime = 0;
          }
        }
      }
    }
  }, [activeReelIndex, service?.reels]);

  // Render a single reel video
  const renderReel = (reel: Reel, index: number) => {
    // Debug: log reel data
    console.log('Reel data:', reel);
    
    const videoContent = () => {
      if (reel.type === 'upload' && reel.videoFileUrl) {
        // Uploaded video - use HTML5 video player
        const showThumbnail = reelLoadingStates[index] !== false;
        const videoId = `reel-video-${index}`;
        return (
          <div className="relative w-full aspect-video bg-black" id={`reel-container-${index}`}>
            <video
              id={videoId}
              src={reel.videoFileUrl}
              controls
              className="w-full h-full object-contain"
              poster={reel.thumbnailUrl}
              onPlay={() => {
                // Hide thumbnail when video starts playing
                setReelLoadingStates(prev => ({
                  ...prev,
                  [index]: false
                }));
              }}
              onEnded={() => {
                // Show thumbnail again when video ends
                if (reel.thumbnailUrl) {
                  setReelLoadingStates(prev => ({
                    ...prev,
                    [index]: true
                  }));
                }
              }}
            >
              Your browser does not support the video tag.
            </video>
            {/* Thumbnail Overlay - Show until video starts or when video ends */}
            {showThumbnail && reel.thumbnailUrl && (
              <div 
                className="absolute inset-0 bg-black cursor-pointer z-10"
                onClick={() => {
                  const video = document.getElementById(videoId) as HTMLVideoElement;
                  if (video) {
                    video.muted = false; // Ensure sound is on
                    video.play();
                  }
                }}
              >
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.thumbnailAlt || 'Video thumbnail'}
                  className="w-full h-full object-cover"
                />
                {/* White play triangle overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="play-button-triangle"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: 'clamp(32px, 5vw, 64px) solid white',
                      borderTop: 'clamp(20px, 3vw, 40px) solid transparent',
                      borderBottom: 'clamp(20px, 3vw, 40px) solid transparent',
                      marginLeft: 'clamp(8px, 1.2vw, 16px)',
                      filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      } else if ((reel.type === 'youtube' || reel.type === 'vimeo') && reel.url) {
        // YouTube or Vimeo - use iframe embed with thumbnail preview
        const embedUrl = getReelEmbedUrl(reel.url, reel.type, false); // No autoplay initially
        const showThumbnail = reelLoadingStates[index] !== false; // Default to true if not set
        const reelId = `reel-${index}`;
        
        return (
          <div className="relative w-full aspect-video bg-black">
            <iframe
              id={reelId}
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              title={reel.thumbnailCaption || `Video ${index + 1}`}
            />
            {/* Thumbnail Overlay - Show until clicked, with play button */}
            {showThumbnail && reel.thumbnailUrl && (
              <div 
                className="absolute inset-0 bg-black cursor-pointer z-10"
                onClick={() => handleThumbnailClick(index, reel)}
              >
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.thumbnailAlt || 'Video thumbnail'}
                  className="w-full h-full object-cover"
                />
                {/* White play triangle overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="play-button-triangle"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: 'clamp(32px, 5vw, 64px) solid white',
                      borderTop: 'clamp(20px, 3vw, 40px) solid transparent',
                      borderBottom: 'clamp(20px, 3vw, 40px) solid transparent',
                      marginLeft: 'clamp(8px, 1.2vw, 16px)',
                      filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      }
      return null;
    };

    return (
      <div key={index} className="w-full">
        {videoContent()}
        {reel.thumbnailCaption && String(reel.thumbnailCaption).trim() !== '' && (
          <div className="mt-4">
            <p className="text-left" style={{ color: '#FF0066', fontFamily: 'Plus Jakarta Sans', fontSize: '16px' }}>
              {reel.thumbnailCaption}
            </p>
          </div>
        )}
      </div>
    );
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch service
        const serviceResponse = await fetch(`/api/services/slug/${serviceSlug}`);
        const serviceData = await serviceResponse.json();
        setService(serviceData);
        
        // Generate initial embed URL if it's embeddable
        if (serviceData.isEmbeddable && serviceData.videoType && serviceData.heroVideoLink?.url) {
          setEmbedUrl(getEmbedUrl(serviceData.heroVideoLink.url, serviceData.videoType, true));
        } else if (serviceData.heroVideoUrl) {
          setEmbedUrl(serviceData.heroVideoUrl);
        }
        
        // Reset active reel index when service changes (no selection initially)
        setActiveReelIndex(-1);
      } catch (error) {
        console.error('Error fetching data:', error);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    if (serviceSlug) {
      fetchData();
    }
  }, [serviceSlug]);

  // Handle URL filter parameter
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam && service?.subServices) {
      // Check if the filter parameter matches any sub-service title
      const matchingSubService = service.subServices.find(sub => sub.title === filterParam);
      if (matchingSubService) {
        setActiveCategory(filterParam);
      }
    }
  }, [searchParams, service]);

  if (loading) {
    return <PageLoader />;
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
        <Header />
        <main className="w-full flex flex-col items-center">
          <div className="flex justify-center items-center py-20">
            <h1 className="display_h1 brand-color">Service not found</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className="w-full flex flex-col items-center">
        {/* Hero with video/image priority logic */}
        {service && (
          <div id="hero" className="relative w-screen overflow-hidden max-h-[75vh] landscape:max-h-[75vh]">
            <div className="relative w-full">
              {/* Priority 1: Hero Video */}
              {service.heroVideoUrl ? (
                service.isEmbeddable ? (
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
                      id={`service-video-${service.videoType}-${serviceSlug}`}
                      src={embedUrl || service.heroVideoUrl}
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
                      title={service.title}
                    />
                  </div>
                ) : (
                  // Direct video file
                  <video
                    ref={setVideoRef}
                    autoPlay
                    muted={isMuted}
                    loop
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
                  >
                    <source src={service.heroVideoUrl} type="video/mp4" />
                    {/* Fallback to hero image if video fails */}
                    <img
                      src={service.heroImageUrl || service.imageUrl}
                      alt={service.heroImageAlt || service.imageAlt || service.title}
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
                  </video>
                )
              ) : service.heroImageUrl ? (
                /* Priority 2: Hero Image */
                <img
                  src={service.heroImageUrl}
                  alt={service.heroImageAlt || service.title}
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
              ) : service.imageUrl ? (
                /* Priority 3: Fallback to regular image */
                <img
                  src={service.imageUrl}
                  alt={service.imageAlt || service.title}
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
                /* Priority 4: Placeholder if no media available */
                <div 
                  className="w-full flex items-center justify-center bg-gray-200"
                  style={{
                    aspectRatio: '16/9',
                    minHeight: '400px',
                    maxHeight: '75vh',
                    margin: 0,
                    padding: 0
                  }}
                >
                  <p className="text-gray-500 text-lg">No media available</p>
                </div>
              )}
              
              {/* Sound Toggle Button - Show for both direct video files and embedded videos */}
              {service.heroVideoUrl && (
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
        )}
        
        {/* Service Content */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              {/* Header */}
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center mb-6">
                  {service.title}
                </h1>
                {/* Subtitle - always show under title */}
                {service.subtitle && Array.isArray(service.subtitle) && service.subtitle.length > 0 && (
                  <h6 className="display_h6 text-center">
                    <BlockContent blocks={service.subtitle} serializers={serializers} />
                  </h6>
                )}
              </div>

              {/* Reels Section */}
              {service.reels && service.reels.length > 0 && (
                <div className="mb-16 pt-0 lg:pt-32 pb-0 lg:pb-32">
                  {/* Reels Filter */}
                  <div className="mb-12">
                    <ScrollableCategories
                      categories={service.reels.map((reel, index) => 
                        reel.thumbnailCaption && String(reel.thumbnailCaption).trim() !== '' 
                          ? reel.thumbnailCaption 
                          : `Reel ${index + 1}`
                      )}
                      activeCategory={
                        activeReelIndex >= 0 && service.reels[activeReelIndex]
                          ? (service.reels[activeReelIndex].thumbnailCaption && 
                             String(service.reels[activeReelIndex].thumbnailCaption).trim() !== ''
                              ? service.reels[activeReelIndex].thumbnailCaption!
                              : `Reel ${activeReelIndex + 1}`)
                          : ''
                      }
                      onCategoryChange={(category) => {
                        if (!service.reels) return;
                        const reelIndex = service.reels.findIndex((reel, index) => {
                          const reelLabel = reel.thumbnailCaption && String(reel.thumbnailCaption).trim() !== ''
                            ? reel.thumbnailCaption
                            : `Reel ${index + 1}`;
                          return reelLabel === category;
                        });
                        if (reelIndex !== -1) {
                          setActiveReelIndex(reelIndex);
                        }
                      }}
                      dropdownPlaceholder="Our Reels"
                      showPlaceholderWhenClosed={activeReelIndex < 0}
                    />
                  </div>
                  {/* Single Reel Display */}
                  {service.reels && service.reels.length > 0 && (() => {
                    // Show first reel by default if no reel is selected, otherwise show selected reel
                    const reelIndexToShow = activeReelIndex >= 0 ? activeReelIndex : 0;
                    const reelToShow = service.reels[reelIndexToShow];
                    
                    return reelToShow ? (
                      <div className="grid grid-cols-1 gap-16 lg:gap-48">
                        {renderReel(reelToShow, reelIndexToShow)}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Categories Filter */}
              {service.projects && service.projects.length > 0 && (() => {
                // Get all subServices used by projects (for filtering)
                const projectSubServiceTitles = new Set(
                  service.projects
                    .filter(project => project != null)
                  .flatMap(project => project.subServices || [])
                    .map(sub => sub.title)
                  );
                
                // Use service.subServices in Sanity order, filtered to only those used by projects
                const orderedSubServices = (service.subServices || [])
                  .filter(sub => projectSubServiceTitles.has(sub.title));
                
                return orderedSubServices.length > 0 ? (
                <div className="mb-12">
                  <ScrollableCategories
                      categories={['All', ...orderedSubServices.map(sub => sub.title)]}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                  />
                </div>
                ) : null;
              })()}

              {/* Projects Grid */}
              {service.projects && service.projects.length > 0 && (
                <ServicesGrid 
                  gridData={service.projects
                    .filter(project => project != null) // Filter out null projects
                    .filter(project => {
                    if (activeCategory === 'All') return true;
                    // Check if project has the selected subService
                    return project.subServices?.some(sub => sub.title === activeCategory);
                  })}
                  schemaUrl="projects"
                  gridCols="md:grid-cols-2"
                  referrerServiceSlug={params.slug as string}
                  enableParallax={true}
                  className="mb-8 md:mb-[60px]"
                />
              )}
            </div>
          </div>
        </section>
        
        {/* Get in Touch Section */}
        <GetInTouch />
      </main>
    </div>
  );
};

export default ServicePage;
