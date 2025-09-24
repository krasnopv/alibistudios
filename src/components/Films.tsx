'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const Films = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = [
    'All',
    'Blockbuster & Franchise Hits',
    'Superheros & Fantasy Epics',
    'Critically Acclaimed',
    'Notable'
  ];

  const films = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Film ${i + 1}`,
    image: `/api/placeholder/207/307`
  }));

  return (
    <section className="py-20 bg-[#F8F9FA]">
      <div className="w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-[64px] font-[200] leading-[76.8px] text-[#FF0066] mb-4">
            Films Led or contributed to by Alibi members
          </h2>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-8 mb-12"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-[28px] font-[400] leading-[33.6px] transition-colors duration-300 ${
                activeFilter === filter
                  ? 'text-black border-b-2 border-[#FF0066] pb-2'
                  : 'text-black hover:text-[#FF0066]'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Films Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {films.map((film, index) => (
            <motion.div
              key={film.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative h-[307px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-2xl text-gray-500">🎬</div>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-lg font-bold">{film.title}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Films;
