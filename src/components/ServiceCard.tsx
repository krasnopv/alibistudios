'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  image?: string; // image can be missing from CMS
  url: string;
  description?: string;
  index?: number;
  enableParallax?: boolean;
}

const ServiceCard = ({ 
  title, 
  image, 
  url, 
  description, 
  index = 0,
  enableParallax = false
}: ServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Track individual card's position in viewport
  // "start end" = when top of element reaches bottom of viewport
  // "end start" = when bottom of element reaches top of viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "start start"]
  });
  
  // Transform parallax effect based on item position
  // Odd items (index 0, 2, 4...): parallax from +75% to 0% (normal)
  // Even items (index 1, 3, 5...): parallax from +100% to +50%
  // First item (index 0): no parallax
  // On mobile: all items stay at normal position (0%)
  const isEvenItem = index % 2 === 1; // 2nd, 4th, 6th items (indexes 1, 3, 5)
  const isFirstItem = index === 0;
  const startOffset = isEvenItem ? "100%" : "75%";
  const endOffset = isEvenItem ? "50%" : "0%";
  
  // Disable parallax on mobile or for first item - all items at normal position
  const shouldApplyParallax = enableParallax && !isMobile && !isFirstItem;
  const parallaxY = useTransform(
    scrollYProgress, 
    [0, 1], 
    shouldApplyParallax ? [startOffset, endOffset] : ["0%", "0%"]
  );

  const handleClick = () => {
    window.location.href = url;
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ y: parallaxY, position: 'relative' }}
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



