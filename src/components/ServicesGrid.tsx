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
  imageSmall?: string;
  imageMedium?: string;
  imageLarge?: string;
  image?: unknown;
}

interface ServicesGridProps {
  gridData: GridItem[];
  schemaUrl: string;
  gridCols?: string;
  className?: string;
  enableParallax?: boolean;
}

const ServicesGrid = ({ 
  gridData, 
  schemaUrl,
  gridCols = "md:grid-cols-2",
  className = "",
  enableParallax = false
}: ServicesGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'laptop' | 'desktop' | 'large'>('desktop');
  const [baseHeight, setBaseHeight] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"]
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width >= 768 && width <= 1023) {
        setScreenSize('tablet');
      } else if (width >= 1024 && width <= 1279) {
        setScreenSize('laptop');
      } else if (width >= 1280 && width <= 1535) {
        setScreenSize('desktop');
      } else if (width >= 1536) {
        setScreenSize('large');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
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

  // Create parallax transforms for up to 30 items with step -100
  const parallax1 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -100 : 0]);
  const parallax2 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -200 : 0]);
  const parallax3 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -300 : 0]);
  const parallax4 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -400 : 0]);
  const parallax5 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -500 : 0]);
  const parallax6 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -600 : 0]);
  const parallax7 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -700 : 0]);
  const parallax8 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -800 : 0]);
  const parallax9 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -900 : 0]);
  const parallax10 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -1000 : 0]);
  const parallax11 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -1100 : 0]);
  const parallax12 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -1200 : 0]);
  const parallax13 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -1300 : 0]);
  const parallax14 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -1400 : 0]);
  const parallax15 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -1500 : 0]);
  const parallax16 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -1600 : 0]);
  const parallax17 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -1700 : 0]);
  const parallax18 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -1800 : 0]);
  const parallax19 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -1900 : 0]);
  const parallax20 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -2000 : 0]);
  const parallax21 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -2100 : 0]);
  const parallax22 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -2200 : 0]);
  const parallax23 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -2300 : 0]);
  const parallax24 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -2400 : 0]);
  const parallax25 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -2500 : 0]);
  const parallax26 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -2600 : 0]);
  const parallax27 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -2700 : 0]);
  const parallax28 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -2800 : 0]);
  const parallax29 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -2900 : 0]);
  const parallax30 = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -3000 : 0]);
  
  const parallaxTransforms = [0, parallax1, parallax2, parallax3, parallax4, parallax5, parallax6, parallax7, parallax8, parallax9, parallax10, parallax11, parallax12, parallax13, parallax14, parallax15, parallax16, parallax17, parallax18, parallax19, parallax20, parallax21, parallax22, parallax23, parallax24, parallax25, parallax26, parallax27, parallax28, parallax29, parallax30];
  
  // Helper function to get optimal image size
  const getOptimalImage = (item: GridItem, containerWidth: number = 600) => {
    if (containerWidth <= 300) {
      return item.imageSmall || item.imageUrl;
    } else if (containerWidth <= 600) {
      return item.imageMedium || item.imageUrl;
    } else {
      return item.imageLarge || item.imageUrl;
    }
  };
  
  // Calculate dynamic height based on parallax movement
  const maxParallax = useTransform(scrollYProgress, [0, 1], [0, enableParallax && !isMobile ? -900 : 0]);
  
  // Get parallax multiplier based on screen size
  const getParallaxMultiplier = () => {
    if (!enableParallax) return 0;
    
    switch (screenSize) {
      case 'mobile': return 0;      // < 768px
      case 'tablet': return 1.5;     // 768px - 1023px
      case 'laptop': return 1.5;   // 1024px - 1279px
      case 'desktop': return 1.5;    // 1280px - 1535px
      case 'large': return -1;     // 1536px+
      default: return 0;
    }
  };
  
  const parallaxMultiplier = getParallaxMultiplier();
  
  // const dynamicHeight = 'auto';
  const dynamicHeightTransform = useTransform(maxParallax, (value) => {
    return baseHeight > 0 ? `${baseHeight + value * parallaxMultiplier}px` : 'auto';
  });
  
  const dynamicHeight = enableParallax ? dynamicHeightTransform : 'auto';

  return (
    <motion.div 
      ref={containerRef} 
      className={`grid ${gridCols} gap-8 ${className}`} 
      style={{ height: isMobile ? 'auto' : dynamicHeight }}
    >
      {gridData.map((item, index) => {
        // Get optimal image size based on container width
        const containerWidth = isMobile ? 300 : 600;
        const imageUrl = getOptimalImage(item, containerWidth);
        const url = item.slug ? `/${schemaUrl}/${item.slug}` : `/${schemaUrl}/${item.title.toLowerCase().replace(/\s+/g, '-')}`;
        
        // Handle description/subtitle that might be a Sanity Portable Text object
        const getDescription = (desc: unknown) => {
          if (typeof desc === 'string') return desc;
          if (Array.isArray(desc)) {
            // Extract text from Sanity Portable Text blocks
            return desc
              .map((block: { _type?: string; children?: Array<{ text?: string }> }) => {
                if (block._type === 'block' && block.children) {
                  return block.children.map((child: { text?: string }) => child.text || '').join('');
                }
                return '';
              })
              .join(' ')
              .trim();
          }
          return '';
        };
        
        const description = getDescription(item.description || item.subtitle);
        
        return (
          <ServiceCard
            key={item._id}
            title={item.title}
            image={imageUrl}
            url={url}
            description={description}
            index={index}
            parallaxY={parallaxTransforms[index] || 0}
          />
        );
      })}
    </motion.div>
  );
};

export default ServicesGrid;