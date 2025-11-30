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
      <div className="relative aspect-[1.8/1] overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-700">
        {(() => {
          const resolvedSrc = image
            ? (image.startsWith('http') ? image : getAssetPath(image))
            : '/placeholder.jpeg';
          return (
            <>
              <img 
                src={resolvedSrc} 
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpeg';
                }}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </>
          );
        })()}
      </div>

      {/* Service Info */}
      <div className="flex flex-col">
        <div className="text-[#FF0066] text-base font-[300] leading-6 group-hover:underline">
          {title}
        </div>
        <div className="flex items-center mt-1">
          <ArrowRight className="text-black w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
