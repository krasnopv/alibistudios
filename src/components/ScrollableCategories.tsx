'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollableCategoriesProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
  layout?: 'scroll' | 'rows';
  disableMobileDropdown?: boolean;
  dropdownPlaceholder?: string;
  showPlaceholderWhenClosed?: boolean;
}

const ScrollableCategories = ({
  categories,
  activeCategory,
  onCategoryChange,
  className = '',
  disableMobileDropdown = false,
  dropdownPlaceholder,
  showPlaceholderWhenClosed = false
}: ScrollableCategoriesProps) => {
  const rowsContainerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const previousStateRef = useRef<boolean | null>(null);
  const [useDropdown, setUseDropdown] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  // Determine if dropdown should be used based on height (or always on mobile)
  useEffect(() => {
    const calculateDropdown = () => {
      // Always use dropdown on mobile unless disabled
      if (isMobile && !disableMobileDropdown) {
        if (previousStateRef.current !== true) {
          previousStateRef.current = true;
          setUseDropdown(true);
        }
        return;
      }
      
      // If mobile dropdown is disabled, skip dropdown logic on mobile
      if (isMobile && disableMobileDropdown) {
        if (previousStateRef.current !== false) {
          previousStateRef.current = false;
          setUseDropdown(false);
        }
        return;
      }

      // Wait for the container to be rendered and fully laid out
      if (!rowsContainerRef.current) {
        if (previousStateRef.current !== false) {
          previousStateRef.current = false;
          setUseDropdown(false);
        }
        return;
      }

      const container = rowsContainerRef.current;
      
      // Wait for container to have actual dimensions
      if (container.offsetHeight === 0 && container.offsetWidth === 0) {
        // Container not yet laid out, try again
        requestAnimationFrame(() => {
          setTimeout(calculateDropdown, 50);
        });
        return;
      }
      
      // Get all buttons to ensure they're rendered
      const buttons = container.querySelectorAll('button');
      if (buttons.length === 0) {
        if (previousStateRef.current !== false) {
          previousStateRef.current = false;
          setUseDropdown(false);
        }
        return;
      }
      
      // Measure the actual rendered container height
      // Use offsetHeight for more accurate measurement (excludes scroll)
      const actualHeight = container.offsetHeight;
      
      // Get the first button to measure item height
      const firstButton = buttons[0] as HTMLElement;
      const firstButtonRect = firstButton.getBoundingClientRect();
      const buttonHeight = firstButtonRect.height;
      
      // If button height is 0, buttons aren't fully rendered yet
      if (buttonHeight === 0) {
        requestAnimationFrame(() => {
          setTimeout(calculateDropdown, 50);
        });
        return;
      }
      
      // Get gap size from computed style (gap-4 = 1rem = 16px)
      const gapSize = 16; // gap-4 = 1rem = 16px
      
      // Calculate threshold: 3 rows + 2 gaps between rows
      // Add a small buffer (1px) to prevent flickering at exact threshold
      const thresholdHeight = (3 * buttonHeight) + (2 * gapSize) + 1;
      
      // Use dropdown if actual height STRICTLY exceeds threshold (more than 3 rows + 2 gaps)
      const shouldUseDropdown = actualHeight > thresholdHeight;
      
      // Only update state if it changed to prevent unnecessary re-renders and blinking
      if (previousStateRef.current !== shouldUseDropdown) {
        previousStateRef.current = shouldUseDropdown;
        setUseDropdown(shouldUseDropdown);
      }
    };

    // Wait for next frame to ensure DOM is fully rendered
    let timeoutId: NodeJS.Timeout | null = null;
    let observerTimeoutId: NodeJS.Timeout | null = null;
    let debounceTimeout: NodeJS.Timeout | null = null;
    let observedContainer: HTMLDivElement | null = null;
    
    const handleResize = () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      if (timeoutId) clearTimeout(timeoutId);
      // Longer debounce to prevent rapid recalculations
      debounceTimeout = setTimeout(() => {
        timeoutId = setTimeout(calculateDropdown, 150);
      }, 200);
    };
    
    const rafId = requestAnimationFrame(() => {
      // Wait for layout to stabilize before first calculation
      timeoutId = setTimeout(calculateDropdown, 200);
      
      // Set up ResizeObserver to detect when container size changes
      observerTimeoutId = setTimeout(() => {
        observedContainer = rowsContainerRef.current;
        if (observedContainer) {
          // Clean up existing observer if any
          if (resizeObserverRef.current && observedContainer) {
            resizeObserverRef.current.unobserve(observedContainer);
          }
          
          resizeObserverRef.current = new ResizeObserver(() => {
            handleResize();
          });
          resizeObserverRef.current.observe(observedContainer);
        }
      }, 300);
      
      window.addEventListener('resize', handleResize);
    });
    
    return () => {
      cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      if (observerTimeoutId) clearTimeout(observerTimeoutId);
      if (debounceTimeout) clearTimeout(debounceTimeout);
      window.removeEventListener('resize', handleResize);
      if (resizeObserverRef.current && observedContainer) {
        resizeObserverRef.current.unobserve(observedContainer);
        resizeObserverRef.current = null;
      }
      previousStateRef.current = null;
    };
  }, [categories, isMobile, disableMobileDropdown]);


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

  // Show dropdown if height exceeds 3 rows + 2 gaps, otherwise show plain rows layout
  if (useDropdown) {
    // Dropdown layout
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
              color: '#000000'
            }}
          >
            {isDropdownOpen 
              ? activeCategory 
              : (showPlaceholderWhenClosed && dropdownPlaceholder ? dropdownPlaceholder : activeCategory)}
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
                    color: '#000000'
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

  // Plain rows layout (when height <= 3 rows + 2 gaps)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`relative ${className}`}
    >
      <div ref={rowsContainerRef} className="filter flex flex-wrap gap-4">
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
              color: '#000000'
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ScrollableCategories;
