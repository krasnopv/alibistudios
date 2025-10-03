'use client';

import { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import ServiceCard from './ServiceCard';

interface GridItem {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  subtitle?: string;
  url?: string;
  imageUrl: string;
  imageAlt: string;
  image?: unknown;
}

interface ServicesGridProps {
  gridData: GridItem[];
  schemaUrl: string;
  gridCols?: string;
  className?: string;
}

const ServicesGrid = ({ 
  gridData, 
  schemaUrl,
  gridCols = "md:grid-cols-2",
  className = ""
}: ServicesGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [baseHeight, setBaseHeight] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"]
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate base height when component mounts
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const gridItems = container.querySelectorAll('.service-card');
      if (gridItems.length > 0) {
        const lastItem = gridItems[gridItems.length - 1] as HTMLElement;
        const containerRect = container.getBoundingClientRect();
        const lastItemRect = lastItem.getBoundingClientRect();
        const relativeBottom = lastItemRect.bottom - containerRect.top;
        setBaseHeight(relativeBottom);
      }
    }
  }, [gridData.length]);

  // Create parallax transforms for all items except the first (disabled on mobile)
  const parallax1 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : -100]);
  const parallax2 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : -200]);
  const parallax3 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : -300]);
  const parallax4 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : -400]);
  const parallax5 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : -500]);
  const parallax6 = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : -600]);
  
  const parallaxTransforms = [0, parallax1, parallax2, parallax3, parallax4, parallax5, parallax6];
  
  // Calculate dynamic height based on parallax movement
  const maxParallax = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 0 : -900]);
  const dynamicHeight = 'auto';
  // const dynamicHeight = useTransform(maxParallax, (value) => {
  //   return baseHeight > 0 ? `${baseHeight - value / 2}px` : 'auto';
  // });

  return (
    <motion.div 
      ref={containerRef} 
      className={`grid ${gridCols} gap-8 ${className}`} 
      style={{ height: isMobile ? 'auto' : dynamicHeight }}
    >
      {gridData.map((item, index) => {
        const imageUrl = item.imageUrl;
        const url = item.slug ? `/${schemaUrl}/${item.slug}` : `/${schemaUrl}/${item.title.toLowerCase().replace(/\s+/g, '-')}`;
        
        return (
          <ServiceCard
            key={item._id}
            title={item.title}
            image={imageUrl}
            url={url}
            description={item.description || item.subtitle}
            index={index}
            parallaxY={parallaxTransforms[index] || 0}
          />
        );
      })}
    </motion.div>
  );
};

export default ServicesGrid;