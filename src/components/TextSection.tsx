'use client';

import { useEffect, useState } from 'react';
import ServiceAccordion from '@/components/ServiceAccordion';

interface SubService {
  _id: string;
  title: string;
  slug: string;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string | unknown;
  imageUrl: string;
  imageAlt: string;
  subServices: SubService[];
  showInServices?: boolean;
}

interface TextSectionProps {
  sectionId?: string;
  title?: string;
  copy?: unknown[];
  url?: {
    type: 'internal' | 'external';
    internalPage?: { 
      _id: string;
      slug: string;
    };
    externalUrl?: string;
  };
}

const TextSection = ({ sectionId, title, copy, url }: TextSectionProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const isOurServicesSection = sectionId === 'services';

  useEffect(() => {
    if (isOurServicesSection) {
      const fetchServices = async () => {
        try {
          const response = await fetch('/api/services');
          const data = await response.json();
          setServices(data);
        } catch (error) {
          console.error('Error fetching services:', error);
          setServices([]);
        } finally {
          setLoading(false);
        }
      };

      fetchServices();
    } else {
      setLoading(false);
    }
  }, [isOurServicesSection]);

  return (
    <section id={sectionId} className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Title */}
          {title && (
            <div className="mb-4">
              <h1 className="display_h1 brand-color">
                {title}
              </h1>
            </div>
          )}

          {/* Content - Basic text rendering with arrow at the end */}
          {copy && copy.length > 0 && (
            <div className={isOurServicesSection ? "mb-8" : ""}>
              <h6 className="display_h6">
                {copy.map((block: unknown, index: number) => {
                  const blockObj = block as { _type?: string; children?: Array<{ text?: string }> };
                  if (blockObj._type === 'block' && blockObj.children) {
                    return blockObj.children.map((child: { text?: string }, childIndex: number) => (
                      <span key={`${index}-${childIndex}`}>
                        {child.text}
                        {childIndex < blockObj.children!.length - 1 && <br />}
                      </span>
                    ));
                  }
                  return null;
                })}
                {url && !isOurServicesSection && (
                  url.type === 'internal' && url.internalPage ? (
                    <a 
                      href={`/${url.internalPage.slug}`}
                      className="text-black hover:underline"
                    >
                      →
                    </a>
                  ) : url.type === 'external' && url.externalUrl ? (
                    <a 
                      href={url.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:underline"
                    >
                      →
                    </a>
                  ) : (
                    ' →'
                  )
                )}
              </h6>
            </div>
          )}

          {/* Services Accordion - Only for services section */}
          {isOurServicesSection && (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0066]"></div>
                </div>
              ) : (
                <ServiceAccordion services={services.filter(service => service.showInServices !== false)} />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TextSection;
