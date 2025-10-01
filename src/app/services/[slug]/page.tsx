'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import BlockContent from '@sanity/block-content-to-react';
import { serializers } from '@/lib/serializers';

interface Service {
  _id: string;
  title: string;
  slug: string;
  subtitle: string | unknown;
  description: string | unknown;
  subtitleHtml?: string;
  descriptionHtml?: string;
  url?: string;
  features?: string[];
  imageUrl?: string;
  imageAlt?: string;
  projects?: {
    _id: string;
    title: string;
    subtitle: string;
    slug: string;
    imageUrl: string;
    imageAlt: string;
  }[];
}

const ServicePage = () => {
  const params = useParams();
  const serviceSlug = params.slug;
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

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
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/slug/${serviceSlug}`);
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error('Error fetching service:', error);
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    if (serviceSlug) {
      fetchService();
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
            <h1 className="display_h1">Service not found</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className="w-full flex flex-col items-center">
        {/* Hero */}
        <Hero pageSlug="services" />
        
        {/* Service Content */}
        <section className="w-full py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              {/* Header */}
              <div className="mb-16">
                <h1 className="display_h1 text-center mb-6">
                  {service.title}
                </h1>
                <div className="display_h6 text-center">
                  {service.subtitleHtml ? renderRichText(service.subtitleHtml) : renderRichText(service.subtitle)}
                </div>
              </div>

              {/* Service Grid - Chess Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {service.projects && service.projects.map((project, index) => {
                  const isEven = index % 2 === 0;
                  const colSpan = 'md:col-span-1';
                  const order = isEven ? 'md:order-1' : 'md:order-2';
                  
                  return (
                    <div key={project._id} className={`${colSpan} ${order}`}>
                      <Link href={`/projects/${project.slug}`} className="service-card cursor-pointer block">
                        <div className="aspect-[4/3] mb-4">
                          <img
                            src={project.imageUrl}
                            alt={project.imageAlt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="body_gerular mb-2">
                          {project.title}
                        </h3>
                        <p className="body_regular">
                          {project.subtitle} <span className="text-xl">→</span>
                        </p>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServicePage;
