'use client';

import { motion } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';

interface ServiceCardProps {
  title: string;
  image: string;
  url: string;
  description?: string;
  index?: number;
}

const ServiceCard = ({ 
  title, 
  image, 
  url, 
  description, 
  index = 0 
}: ServiceCardProps) => {
  const handleClick = () => {
    window.location.href = url;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group cursor-pointer service-card"
      onClick={handleClick}
    >
      {/* Service Image */}
      <div className="relative h-[372px] overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <div className="text-4xl text-gray-500">🎬</div>
        </div>
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
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[#FF0066] text-base font-[300] leading-6">
            {title}
          </span>
          <span className="text-black text-base font-[300] leading-6 ml-2">
            &nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span className="text-black text-xl font-[400] leading-[30px]">
            →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
