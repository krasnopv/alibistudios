'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
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
    subServices?: SubService[];
  }[];
  subServices?: SubService[];
}

interface Page {
  _id: string;
  title: string;
  slug: string;
}

const ServicePage = () => {
  const params = useParams();
  const serviceSlug = params.slug;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [pageData, setPageData] = useState<Page | null>(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch service
        const serviceResponse = await fetch(`/api/services/slug/${serviceSlug}`);
        const serviceData = await serviceResponse.json();
        setService(serviceData);

        // Fetch page data
        const pageResponse = await fetch('/api/pages/slug/services');
        const pageData = await pageResponse.json();
        setPageData(pageData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setService(null);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    };

    if (serviceSlug) {
      fetchData();
    }
  }, [serviceSlug]);

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
          <section className="relative w-screen overflow-hidden max-h-[75vh] landscape:max-h-[75vh]">
            <div className="relative w-full">
              {/* Priority 1: Hero Video */}
              {service.heroVideoUrl ? (
                <video
                  autoPlay
                  muted
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
            </div>
          </section>
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
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServicePage;
