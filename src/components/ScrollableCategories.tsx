'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollableCategoriesProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
  layout?: 'scroll' | 'rows';
}

const ScrollableCategories = ({
  categories,
  activeCategory,
  onCategoryChange,
  className = '',
  layout = 'rows'
}: ScrollableCategoriesProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    setShowArrows(scrollWidth > clientWidth);
  };

  useEffect(() => {
    const effectiveLayout = isMobile ? 'scroll' : layout;
    if (effectiveLayout === 'scroll') {
      checkScrollability();
    }
    
    const handleResize = () => {
      const currentEffectiveLayout = window.innerWidth < 768 ? 'scroll' : layout;
      if (currentEffectiveLayout === 'scroll') {
        checkScrollability();
      }
    };
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [categories, isMobile, layout]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    checkScrollability();
  };

  // Determine which layout to use: mobile always uses scroll, desktop uses layout prop (default: rows)
  const effectiveLayout = isMobile ? 'scroll' : layout;

  // Rows layout (desktop default, no scroll)
  if (effectiveLayout === 'rows') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`relative ${className}`}
      >
        <div className="flex flex-wrap gap-4 md:gap-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`heading_h3 transition-all duration-300 cursor-pointer whitespace-nowrap ${
                activeCategory === category
                  ? 'active-filter'
                  : 'hover-filter'
              }`}
              style={{ 
                color: '#000000',
                fontSize: isMobile ? '20px' : undefined
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  // Scroll layout (with horizontal scroll)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`relative ${className}`}
    >
      {/* Left Arrow */}
      {showArrows && canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Right Arrow */}
      {showArrows && canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Categories Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`heading_h3 transition-all duration-300 cursor-pointer whitespace-nowrap flex-shrink-0 ${
              activeCategory === category
                ? 'active-filter'
                : 'hover-filter'
            }`}
            style={{ 
              color: '#000000',
              fontSize: isMobile ? '20px' : undefined
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Fade Effects */}
      {showArrows && (
        <>
          {/* Left Fade */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
          )}
          
          {/* Right Fade */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          )}
        </>
      )}
    </motion.div>
  );
};

export default ScrollableCategories;
