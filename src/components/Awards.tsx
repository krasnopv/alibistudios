'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Award {
  _id: string;
  name: string;
  year: number;
  category: string;
  description?: string;
  count: string;
  imageUrl?: string;
  imageAlt?: string;
}

const Awards = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAward, setActiveAward] = useState<string | null>(null);

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const response = await fetch('/api/awards');
        const data = await response.json();
        setAwards(data);
      } catch (error) {
        console.error('Error fetching awards:', error);
        setAwards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  if (loading) {
    return (
      <section className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="row">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0066]"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
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
            <h1 className="display_h1 brand-color">
              Awards & Recognition
            </h1>
            <h6 className="display_h6">
              Personal Achievements and contributions
            </h6>
          </motion.div>

          {/* Awards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={award._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => setActiveAward(activeAward === award._id ? null : award._id)}
              >
                {/* Award Icon */}
                <div className="h-[119px] bg-[#F8F9FA] opacity-60 flex items-center justify-center mb-4">
                  {award.imageUrl ? (
                    <img 
                      src={award.imageUrl} 
                      alt={award.imageAlt || award.name}
                      className="w-20 h-20 object-contain"
                    />
                  ) : (
                    <div className="text-4xl text-gray-400">🏆</div>
                  )}
                </div>
                
                {/* Award Info - Hidden by default, shown on hover/click */}
                <div className={`text-center transition-opacity duration-300 ${
                  activeAward === award._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <div className="text-xs font-[400] leading-[18px] text-gray-600 mb-1">
                    {award.name}
                  </div>
                  <div className="text-sm font-[400] leading-[21px] text-black">
                    {award.count}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awards;
