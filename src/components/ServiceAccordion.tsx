'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ServiceTag {
  _id: string;
  name: string;
  color?: string;
}

interface Service {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  tags: ServiceTag[];
}

interface ServiceAccordionProps {
  services: Service[];
}

const ServiceAccordion = ({ services }: ServiceAccordionProps) => {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const toggleService = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {services.map((service) => (
        <div key={service._id} className="border-b border-gray-200 last:border-b-0">
          {/* Service Header (Always Visible) */}
          <button
            onClick={() => toggleService(service._id)}
            className="w-full text-left py-8 px-0 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <h3 
                className="text-[40px] font-[250] leading-[120%] tracking-[0%]"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                {service.title}
              </h3>
              <div className="flex-shrink-0 ml-4">
                {expandedService === service._id ? (
                  <ChevronUp className="w-6 h-6 text-gray-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-600" />
                )}
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
                <div className="pb-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Description and Tags (1/3) */}
                    <div className="lg:col-span-1">
                      <div 
                        className="text-[20px] font-[400] leading-[150%] tracking-[0%] mb-6"
                        style={{ fontFamily: 'Plus Jakarta Sans' }}
                      >
                        {service.description}
                      </div>
                      
                      {/* Tags */}
                      {service.tags && service.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {service.tags.map((tag) => (
                            <span
                              key={tag._id}
                              className="inline-flex items-center px-4 py-1 rounded-full text-[16px] font-[300] leading-[150%] tracking-[0%]"
                              style={{ 
                                fontFamily: 'Plus Jakarta Sans',
                                backgroundColor: tag.color || '#F3F4F6',
                                color: '#374151'
                              }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Column - Service Image (2/3) */}
                    <div className="lg:col-span-2">
                      <div className="relative w-full h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
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
