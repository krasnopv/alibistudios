'use client';

import { useRef, useState, useEffect } from 'react';
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
  order?: number;
}

interface ServicesGridProps {
  gridData: GridItem[];
  schemaUrl: string;
  gridCols?: string;
  className?: string;
  enableParallax?: boolean;
  referrerServiceSlug?: string;
}

const ServicesGrid = ({ 
  gridData, 
  schemaUrl,
  gridCols = "md:grid-cols-2",
  className = "",
  enableParallax = false,
  referrerServiceSlug
}: ServicesGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
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
  
  // Disable parallax on mobile
  const isParallaxEnabled = enableParallax && !isMobile;

  // Sort items by display order field if available
  const sortedData = [...gridData].sort((a, b) => {
    // If both have order, sort by order (lower numbers first)
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    // If only a has order, it comes first
    if (a.order !== undefined) return -1;
    // If only b has order, it comes first
    if (b.order !== undefined) return 1;
    // If neither has order, maintain original order
    return 0;
  });

  return (
    <div 
      id="services-grid"
      ref={containerRef} 
      className={`grid ${gridCols} gap-8 relative ${className}`}
    >
      {sortedData.map((item, index) => {
        // Get optimal image size based on container width
        const containerWidth = isMobile ? 300 : 600;
        const imageUrl = getOptimalImage(item, containerWidth);
        let url = item.slug ? `/${schemaUrl}/${item.slug}` : `/${schemaUrl}/${item.title.toLowerCase().replace(/\s+/g, '-')}`;
        
        // Add referrer service slug as query parameter if provided
        if (referrerServiceSlug) {
          url += `?from=${referrerServiceSlug}`;
        }
        
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
            enableParallax={isParallaxEnabled}
          />
        );
      })}
    </div>
  );
};

export default ServicesGrid;