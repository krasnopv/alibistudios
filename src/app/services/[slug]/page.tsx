'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import PageLoader from '@/components/PageLoader';
import ScrollableCategories from '@/components/ScrollableCategories';
import ServicesGrid from '@/components/ServicesGrid';
import GetInTouch from '@/components/GetInTouch';
import BlockContent from '@sanity/block-content-to-react';
import { serializers } from '@/lib/serializers';

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
  subtitle: string | unknown;
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
  const [isMuted, setIsMuted] = useState(true);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

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

  const toggleSound = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Helper function to get embed URL for YouTube/Vimeo
  const getEmbedUrl = (url: string, type: 'youtube' | 'vimeo'): string => {
    if (type === 'youtube') {
      // Handle YouTube URLs
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (type === 'vimeo') {
      // Handle Vimeo URLs
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
    return url;
  };

  // Render a single reel video
  const renderReel = (reel: Reel, index: number) => {
    // Debug: log reel data
    console.log('Reel data:', reel);
    
    const videoContent = () => {
      if (reel.type === 'upload' && reel.videoFileUrl) {
        // Uploaded video - use HTML5 video player
        return (
          <div className="relative w-full aspect-video bg-black">
            <video
              src={reel.videoFileUrl}
              controls
              className="w-full h-full object-contain"
              poster={reel.thumbnailUrl}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      } else if ((reel.type === 'youtube' || reel.type === 'vimeo') && reel.url) {
        // YouTube or Vimeo - use iframe embed
        const embedUrl = getEmbedUrl(reel.url, reel.type);
        return (
          <div className="relative w-full aspect-video bg-black">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              title={reel.thumbnailCaption || `Video ${index + 1}`}
            />
          </div>
        );
      }
      return null;
    };

    const hasCaption = reel.thumbnailCaption && String(reel.thumbnailCaption).trim() !== '';
    
    return (
      <div key={index} className="w-full">
        {videoContent()}
        {hasCaption && (
          <div className="mt-4">
            <p 
              className="text-[20px] font-[400] leading-[150%] tracking-[0%] brand-color"
              style={{ fontFamily: 'Plus Jakarta Sans' }}
            >
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
              
              {/* Sound Toggle Button - Only show for videos */}
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
                <h6 className="display_h6 text-center">
                  {renderRichText(service.subtitle)}
                </h6>
              </div>

              {/* Reels Section */}
              {service.reels && service.reels.length > 0 && (
                <div className="mb-16 pt-0 lg:pt-32 pb-0 lg:pb-32">
                  <div className="grid grid-cols-1 gap-16 lg:gap-48">
                    {service.reels.map((reel, index) => renderReel(reel, index))}
                  </div>
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
