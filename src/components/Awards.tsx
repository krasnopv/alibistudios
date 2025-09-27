'use client';

import { motion } from 'framer-motion';

const Awards = () => {
  const awards = [
    { name: 'OSCARS', count: 'x 2', icon: '🏆' },
    { name: 'Visual Effects Society Awards', count: 'x 2', icon: '🎬' },
    { name: 'Emmys', count: 'x 2', icon: '📺' },
    { name: 'BAFTA', count: '', icon: '🎭' },
    { name: 'Rose d\'Or', count: 'x 2', icon: '🌹' },
    { name: 'Royal Television Society', count: 'x 2', icon: '📡' },
    { name: 'Creative Circle Awards', count: 'x 2', icon: '🎨' },
    { name: 'British Arrows', count: '2023', icon: '🏹' },
    { name: 'Clio', count: '2023', icon: '🏅' },
    { name: 'LIA', count: '2022', icon: '💡' },
    { name: 'NYX Game Award', count: '', icon: '🎮' },
    { name: 'Webby', count: '', icon: '🌐' }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-[64px] font-[200] leading-[76.8px] text-[#FF0066] mb-4">
            Awards & Recognition
          </h2>
          <p className="text-[40px] font-[200] leading-[48px] text-black">
            Personal Achievements and contributions
          </p>
        </motion.div>

        {/* Awards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {awards.map((award, index) => (
            <motion.div
              key={award.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              {/* Award Icon */}
              <div className="h-[119px] bg-[#F8F9FA] opacity-60 flex items-center justify-center mb-4 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-4xl">{award.icon}</div>
              </div>
              
              {/* Award Info */}
              <div className="text-center">
                <div className="text-sm font-[400] leading-[21px] text-black">
                  {award.name} {award.count}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;
