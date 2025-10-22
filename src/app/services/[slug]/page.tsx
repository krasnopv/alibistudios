'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import ScrollableCategories from '@/components/ScrollableCategories';
import ServicesGrid from '@/components/ServicesGrid';
import BlockContent from '@sanity/block-content-to-react';
import { serializers } from '@/lib/serializers';

interface SubService {
  _id: string;
  title: string;
  slug: string;
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
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
        <Header />
        <main className="w-full flex flex-col items-center">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0066]"></div>
          </div>
        </main>
      </div>
    );
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
                <button
                  onClick={toggleSound}
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 bg-white/20 hover:bg-white/40 text-black p-3 rounded-full transition-colors duration-200 cursor-pointer"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted ? (
                    // Muted icon (speaker with X)
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <line x1="23" y1="9" x2="17" y2="15"></line>
                      <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                  ) : (
                    // Unmuted icon (speaker)
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                  )}
                </button>
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

              {/* Categories Filter */}
              {service.subServices && service.subServices.length > 0 && (
                <div className="mb-12">
                  <ScrollableCategories
                    categories={['All', ...service.subServices.map(sub => sub.title)]}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                  />
                </div>
              )}

              {/* Projects Grid */}
              {service.projects && service.projects.length > 0 && (
                <ServicesGrid 
                  gridData={service.projects.filter(project => {
                    if (activeCategory === 'All') return true;
                    // Check if project has the selected subService
                    return project.subServices?.some(sub => sub.title === activeCategory);
                  })}
                  schemaUrl="projects"
                  gridCols="md:grid-cols-2"
                />
              )}
              
              {/* Debug info - remove this after fixing */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-gray-100 rounded">
                  <h3 className="font-bold mb-2">Debug Info:</h3>
                  <p><strong>Service subServices:</strong> {service.subServices?.length || 0}</p>
                  <p><strong>Service subServices titles:</strong> {service.subServices?.map(s => s.title).join(', ') || 'None'}</p>
                  <p><strong>Active category:</strong> {activeCategory}</p>
                  <p><strong>Total projects:</strong> {service.projects?.length || 0}</p>
                  <p><strong>Filtered projects:</strong> {service.projects?.filter(project => {
                    if (activeCategory === 'All') return true;
                    return project.subServices?.some(sub => sub.title === activeCategory);
                  }).length || 0}</p>
                  {service.projects?.slice(0, 2).map((project, index) => (
                    <div key={index} className="mt-2">
                      <p><strong>Project {index + 1} subServices:</strong> {project.subServices?.map(s => s.title).join(', ') || 'None'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServicePage;
