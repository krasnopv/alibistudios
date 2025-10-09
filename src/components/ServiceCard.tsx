'use client';

import { motion, MotionValue } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  image?: string; // image can be missing from CMS
  url: string;
  description?: string;
  index?: number;
  parallaxY?: MotionValue<number> | number;
}

const ServiceCard = ({ 
  title, 
  image, 
  url, 
  description, 
  index = 0,
  parallaxY
}: ServiceCardProps) => {
  const handleClick = () => {
    window.location.href = url;
  };

  return (
    <motion.div
      style={{ y: parallaxY }}
      className="group cursor-pointer service-card"
      onClick={handleClick}
    >
      {/* Service Image */}
      <div className="relative aspect-[1.8/1] overflow-hidden mb-6">
        {(() => {
          const resolvedSrc = image
            ? (image.startsWith('http') ? image : getAssetPath(image))
            : '/placeholder.jpeg';
          return (
            <img 
              src={resolvedSrc} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.jpeg';
              }}
            />
          );
        })()}
      </div>

      {/* Service Info */}
      <div className="flex flex-col">
        <div className="text-[#FF0066] text-base font-[300] leading-6">
          {title}
        </div>
        <div className="flex items-center mt-1">
          {description && (
            <div className="text-gray-600 text-sm font-[300] leading-5 mr-2">
              {description}
            </div>
          )}
          <ArrowRight className="text-black w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
