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

  useEffect(() => {
    const fetchAwards = async () => {
      try {
        const response = await fetch('/api/awards');
        const data = await response.json();
        setAwards(data);
      } catch (error) {
        console.error('Error fetching awards:', error);
        // Fallback to mock data
        setAwards([
          { _id: '1', name: 'OSCARS', count: 'x 2', year: 2024, category: 'oscars' },
          { _id: '2', name: 'Visual Effects Society Awards', count: 'x 2', year: 2024, category: 'ves' },
          { _id: '3', name: 'Emmys', count: 'x 2', year: 2024, category: 'emmys' },
          { _id: '4', name: 'BAFTA', count: '', year: 2024, category: 'bafta' },
          { _id: '5', name: 'Rose d\'Or', count: 'x 2', year: 2024, category: 'rose-dor' },
          { _id: '6', name: 'Royal Television Society', count: 'x 2', year: 2024, category: 'rts' },
          { _id: '7', name: 'Creative Circle Awards', count: 'x 2', year: 2024, category: 'creative-circle' },
          { _id: '8', name: 'British Arrows', count: '2023', year: 2023, category: 'british-arrows' },
          { _id: '9', name: 'Clio', count: '2023', year: 2023, category: 'clio' },
          { _id: '10', name: 'LIA', count: '2022', year: 2022, category: 'lia' },
          { _id: '11', name: 'NYX Game Award', count: '', year: 2024, category: 'nyx' },
          { _id: '12', name: 'Webby', count: '', year: 2024, category: 'webby' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);


  return (
    <section className="w-full py-20">
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
              Awards & Recognition
            </h1>
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
              Personal Achievements and contributions
            </p>
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
                className=""
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awards;
