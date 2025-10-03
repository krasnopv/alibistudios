'use client';

import { motion, MotionValue } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  image: string;
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
        <img 
          src={image.startsWith('http') ? image : getAssetPath(image)} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-2xl font-bold mb-2">{title}</div>
            {description && (
              <div className="text-sm opacity-90">{description}</div>
            )}
          </div>
        </div>
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
