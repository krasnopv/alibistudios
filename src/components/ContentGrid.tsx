'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ScrollableCategories from './ScrollableCategories';

interface ContentItem {
  id: string | number;
  title: string;
  image: string;
  description?: string;
  url?: string;
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
}

const ContentGrid = ({
  title,
  subtitle,
  categories,
  items,
  defaultCategory = 'All',
  onItemClick,
  className = ''
}: ContentGridProps) => {
  const [activeFilter, setActiveFilter] = useState(defaultCategory);

  const filteredItems = activeFilter === 'All' 
    ? items 
    : items.filter(item => {
      // Handle both single category and multiple services
      if (typeof item.category === 'string') {
        return item.category === activeFilter;
      }
      // For team members with services array, check if any service matches
      if (item.services && Array.isArray(item.services)) {
        const hasMatchingService = item.services.some(service => service.title === activeFilter);
        console.log(`Item ${item.title}: services=${JSON.stringify(item.services.map(s => s.title))}, activeFilter=${activeFilter}, matches=${hasMatchingService}`);
        return hasMatchingService;
      }
      return false;
    });

  const handleItemClick = (item: ContentItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else if (item.url) {
      window.location.href = item.url;
    }
  };

  return (
    <section className={`w-full py-20 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h1 className="display_h1">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 md:gap-5 xl:gap-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="contents"
              >
                {filteredItems.map((item, index) => (
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
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <div className="text-2xl text-gray-500">🎬</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="text-lg font-bold">{item.title}</div>
                          {item.description && (
                            <div className="text-sm opacity-90 mt-1">{item.description}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentGrid;
