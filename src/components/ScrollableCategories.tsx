'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

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
  const rowsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [useDropdown, setUseDropdown] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate rows and determine if dropdown should be used
  useEffect(() => {
    const calculateRows = () => {
      // Only calculate for desktop rows layout, not mobile
      if (isMobile || layout !== 'rows') {
        setUseDropdown(false);
        return;
      }

      // Use a temporary container to measure
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.visibility = 'hidden';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.className = 'flex flex-wrap gap-4 md:gap-8';
      
      // Get parent width if available, otherwise use a reasonable default
      const parentWidth = rowsContainerRef.current?.parentElement?.clientWidth || window.innerWidth - 64; // Account for padding
      tempContainer.style.width = `${parentWidth}px`;
      
      document.body.appendChild(tempContainer);

      // Create temporary buttons to measure
      categories.forEach((category) => {
        const button = document.createElement('button');
        button.className = 'heading_h3 whitespace-nowrap';
        button.style.color = '#000000';
        button.textContent = category;
        tempContainer.appendChild(button);
      });

      // Force layout calculation
      tempContainer.offsetHeight;

      // Measure height
      const height = tempContainer.offsetHeight;
      const firstButton = tempContainer.querySelector('button');
      const lineHeight = firstButton ? parseFloat(getComputedStyle(firstButton).lineHeight) || 40 : 40;
      const rows = Math.ceil(height / lineHeight);

      document.body.removeChild(tempContainer);
      setUseDropdown(rows >= 3);
    };

    // Delay to ensure DOM is rendered
    const timeoutId = setTimeout(calculateRows, 100);
    window.addEventListener('resize', calculateRows);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', calculateRows);
    };
  }, [categories, isMobile, layout]);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Determine which layout to use: mobile always uses scroll, desktop uses layout prop (default: rows)
  const effectiveLayout = isMobile ? 'scroll' : layout;

  // Rows layout (desktop default, no scroll)
  if (effectiveLayout === 'rows') {
    // Show dropdown if 3+ rows
    if (useDropdown) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={`relative ${className}`}
        >
          <div className="relative dropdown-container">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="heading_h3 transition-all duration-300 cursor-pointer flex items-center gap-2"
              style={{ 
                color: '#000000',
                fontSize: isMobile ? '20px' : undefined
              }}
            >
              {activeCategory}
              <ChevronDown 
                className={`w-5 h-5 transition-transform duration-300 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-lg z-50 min-w-[200px] max-h-[400px] overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      onCategoryChange(category);
                      setIsDropdownOpen(false);
                    }}
                    className={`heading_h3 transition-all duration-300 cursor-pointer whitespace-nowrap w-full text-left px-4 py-2 hover:bg-gray-100 ${
                      activeCategory === category
                        ? 'active-filter bg-gray-50'
                        : ''
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
            )}
          </div>
        </motion.div>
      );
    }

    // Regular rows layout (1-2 rows)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`relative ${className}`}
      >
        <div ref={rowsContainerRef} className="flex flex-wrap gap-4 md:gap-8">
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
