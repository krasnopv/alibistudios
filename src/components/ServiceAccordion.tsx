'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubService {
  _id: string;
  title: string;
  slug: string;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string | unknown; // Can be string or rich text object
  imageUrl: string;
  imageAlt: string;
  subServices: SubService[];
  showInServices?: boolean;
}

interface ServiceAccordionProps {
  services: Service[];
}

const ServiceAccordion = ({ services }: ServiceAccordionProps) => {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  console.log('ServiceAccordion rendering with', services.length, 'services');

  // Function to render rich text objects with proper paragraph structure
  const renderRichText = (content: unknown): React.ReactNode => {
    if (typeof content === 'string') {
      return <p>{content}</p>;
    }
    
    if (Array.isArray(content)) {
      return content.map((block, index) => {
        if (block && typeof block === 'object' && '_type' in block && block._type === 'block' && 'children' in block && Array.isArray(block.children)) {
          const text = block.children
            .map((child: unknown) => {
              if (child && typeof child === 'object' && 'text' in child) {
                return String(child.text || '');
              }
              return '';
            })
            .join('');
          
          return <p key={index}>{text}</p>;
        }
        return null;
      });
    }
    
    if (content && typeof content === 'object' && 'children' in content && Array.isArray(content.children)) {
      return content.children.map((child: unknown, index) => {
        if (child && typeof child === 'object' && 'text' in child) {
          return <p key={index}>{String(child.text || '')}</p>;
        }
        return null;
      });
    }
    
    return <p>{String(content || '')}</p>;
  };

  const toggleService = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  // Scroll to expanded content when it opens
  useEffect(() => {
    if (expandedService) {
      // Wait for animation to start and content to render
      const timer = setTimeout(() => {
        const contentElement = contentRefs.current[expandedService];
        if (contentElement) {
          contentElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 150); // Wait for animation to start

      return () => clearTimeout(timer);
    }
  }, [expandedService]);

  return (
    <div className="w-full pt-8">
      {services.map((service) => (
        <div key={service._id} className="last:border-b-0">
          {/* Service Header (Always Visible) */}
          <button
            onClick={() => toggleService(service._id)}
            className="group w-full text-left py-4 px-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <h1 className="heading_h1 !group-hover:text-[#FF0066] group-hover:underline transition-colors duration-200">
                {service.title}
              </h1>
              <div className="flex-shrink-0 ml-4">
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-2xl text-gray-600 font-light">
                    {expandedService === service._id ? '-' : '+'}
                  </span>
                </div>
              </div>
            </div>
          </button>

          {/* Service Content (Expandable) */}
          <AnimatePresence>
            {expandedService === service._id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div 
                  ref={(el) => {
                    contentRefs.current[service._id] = el;
                  }}
                  className="pb-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Description and Tags (1/3) */}
                    <div className="lg:col-span-1">
                      <div 
                        className="text-[20px] font-[400] leading-[150%] tracking-[0%] mb-6"
                        style={{ fontFamily: 'Plus Jakarta Sans' }}
                      >
                        {renderRichText(service.description)}
                      </div>
                      
                      {/* Sub Services */}
                      {service.subServices && service.subServices.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {service.subServices.map((subService) => (
                            <a
                              key={subService._id}
                              href={`/services/${service.slug}?filter=${encodeURIComponent(subService.title)}`}
                              className="inline-flex items-center px-4 py-1 rounded-full text-[16px] font-[300] leading-[150%] tracking-[0%] hover:bg-[#FF0066] hover:text-white transition-colors duration-200"
                              style={{ 
                                fontFamily: 'Plus Jakarta Sans',
                                backgroundColor: '#ffffff',
                                color: '#374151'
                              }}
                            >
                              {subService.title}
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Learn More Link */}
                      {service.slug && service.slug.trim() !== '' && (
                      <a 
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center text-[#FF0066] hover:underline transition-colors duration-200"
                        style={{ fontFamily: 'Plus Jakarta Sans' }}
                      >
                        Learn more →
                      </a>
                      )}
                    </div>

                    {/* Right Column - Service Image (2/3) */}
                    <div className="lg:col-span-2">
                      <div className="relative w-full h-[400px] lg:h-[500px] overflow-hidden">
                        <img
                          src={service.imageUrl}
                          alt={service.imageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default ServiceAccordion;
