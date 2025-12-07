'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import ScrollableCategories from './ScrollableCategories';

interface ContentItem {
  id: string | number;
  title: string;
  image: string;
  description?: string;
  subtitle?: string;
  locations?: string[];
  url?: string;
  slug?: string;
  category?: string;
  services?: {
    _id: string;
    title: string;
  }[];
}

interface ContentGridProps {
  title: string;
  subtitle?: string;
  categories: string[];
  items: ContentItem[];
  defaultCategory?: string;
  onItemClick?: (item: ContentItem) => void;
  className?: string;
  showMemberInfo?: boolean;
  schemaUrl?: string;
  enablePagination?: boolean;
  paginationMode?: 'pages' | 'loadMore';
  itemsPerPageDesktop?: number;
  itemsPerPageTablet?: number;
  itemsPerPageMobile?: number;
  hideLoadMore?: boolean;
}

const ContentGrid = ({
  title,
  subtitle,
  categories,
  items,
  defaultCategory = 'All',
  onItemClick,
  className = '',
  showMemberInfo = false,
  schemaUrl,
  enablePagination = false,
  paginationMode = 'pages',
  itemsPerPageDesktop = 24,
  itemsPerPageTablet = 12,
  itemsPerPageMobile = 6,
  hideLoadMore = false
}: ContentGridProps) => {
  const [activeFilter, setActiveFilter] = useState(defaultCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsToShow, setItemsToShow] = useState(itemsPerPageDesktop);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageDesktop);

  // Detect screen size and update items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width >= 1024) {
          // Desktop (lg and above)
          setItemsPerPage(itemsPerPageDesktop);
        } else if (width >= 768) {
          // Tablet (md to lg)
          setItemsPerPage(itemsPerPageTablet);
        } else {
          // Mobile (below md)
          setItemsPerPage(itemsPerPageMobile);
        }
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, [itemsPerPageDesktop, itemsPerPageTablet, itemsPerPageMobile]);

  // Initialize itemsToShow based on screen size and pagination mode
  useEffect(() => {
    if (paginationMode === 'loadMore') {
      setItemsToShow(itemsPerPage);
    }
  }, [paginationMode, itemsPerPage]);

  // Reset to page 1 or initial items when filter changes
  useEffect(() => {
    setCurrentPage(1);
    if (paginationMode === 'loadMore') {
      setItemsToShow(itemsPerPage);
    }
  }, [activeFilter, paginationMode, itemsPerPage]);

  const filteredItems = activeFilter === 'All' 
    ? items 
    : items.filter(item => {
      // For team members with services array, check if any service matches (prioritize this)
      if (item.services && Array.isArray(item.services)) {
        const hasMatchingService = item.services.some(service => service.title === activeFilter);
        console.log(`Item ${item.title}: services=${JSON.stringify(item.services.map(s => s.title))}, activeFilter=${activeFilter}, matches=${hasMatchingService}`);
        return hasMatchingService;
      }
      // Handle single category as fallback
      if (typeof item.category === 'string') {
        return item.category === activeFilter;
      }
      return false;
    });

  // Calculate pagination
  const totalPages = enablePagination ? Math.ceil(filteredItems.length / itemsPerPage) : 1;
  const startIndex = enablePagination ? (currentPage - 1) * itemsPerPage : 0;
  const endIndex = enablePagination 
    ? (paginationMode === 'loadMore' ? itemsToShow : startIndex + itemsPerPage)
    : filteredItems.length;
  const paginatedItems = enablePagination ? filteredItems.slice(0, endIndex) : filteredItems;
  
  const hasMoreItems = paginationMode === 'loadMore' && itemsToShow < filteredItems.length;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top of grid when page changes
    const gridElement = document.getElementById('content-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLoadMore = () => {
    setItemsToShow(prev => prev + itemsPerPage);
  };

  const handleItemClick = (item: ContentItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else if (item.url) {
      window.location.href = item.url;
    } else if (item.slug && schemaUrl) {
      // Construct URL from slug and schemaUrl, similar to ServicesGrid
      const url = `/${schemaUrl}/${item.slug}`;
      window.location.href = url;
    } else if (item.slug && !schemaUrl) {
      // Fallback: try to construct URL from slug only
      const url = `/${item.slug}`;
      window.location.href = url;
    }
  };

  return (
    // <section className={`w-full ${className}`}>
    //   <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h1 className="display_h1 brand-color">
              {title}
            </h1>
            {subtitle && (
              <p style={{
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 250,
                fontStyle: 'normal',
                fontSize: '40px',
                lineHeight: '120%',
                letterSpacing: '0%',
                verticalAlign: 'middle',
                color: '#000000'
              }}>
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Scrollable Categories */}
          <div className="mb-12">
            <ScrollableCategories
              categories={categories}
              activeCategory={activeFilter}
              onCategoryChange={setActiveFilter}
            />
          </div>

          {/* Content Grid */}
          <div id="content-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5 xl:gap-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeFilter}-${currentPage}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="contents"
              >
                {paginatedItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02, ease: "easeInOut" }}
                    className="group cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="relative h-[307px] overflow-hidden">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <div className="text-2xl text-gray-500">🎬</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Team Member Information - Only show if showMemberInfo is true */}
                    {showMemberInfo && (
                      <div className="mt-4 text-left">
                        <div className="text-lg font-semibold text-black mb-1 group-hover:underline group-hover:text-[#FF0066] transition-colors">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-600 mb-1">
                          {item.description}
                          {item.subtitle && (
                            <span> - {item.subtitle}</span>
                          )}
                        </div>
                        {item.locations && (
                          <div className="text-sm text-gray-500">
                            {item.locations.join(' / ')}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {enablePagination && (
            paginationMode === 'loadMore' ? (
              hasMoreItems && !hideLoadMore && (
                <div className="mt-12 flex items-center justify-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-3 text-white hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ backgroundColor: '#FF0066' }}
                    aria-label="Load more items"
                  >
                    Load more
                  </button>
                </div>
              )
            ) : totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'text-white hover:opacity-90'
                  }`}
                  style={currentPage !== 1 ? { backgroundColor: '#FF0066' } : {}}
                  aria-label="Previous page"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = 
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!showPage) {
                      // Show ellipsis
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 transition-colors ${
                          currentPage === page
                            ? 'text-white'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                        }`}
                        style={currentPage === page ? { backgroundColor: '#FF0066' } : {}}
                        aria-label={`Go to page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'text-white hover:opacity-90'
                  }`}
                  style={currentPage !== totalPages ? { backgroundColor: '#FF0066' } : {}}
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )
          )}
        </div>
    //   </div>
    // </section>
  );
};

export default ContentGrid;
