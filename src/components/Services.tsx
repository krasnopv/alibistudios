'use client';

import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      title: 'VFX',
      image: '/api/placeholder/668/372',
      description: 'Visual Effects'
    },
    {
      title: 'Immersive',
      image: '/api/placeholder/668/372',
      description: 'Immersive Experiences'
    },
    {
      title: 'Film & Episodic',
      image: '/api/placeholder/668/372',
      description: 'Film & Episodic Content'
    },
    {
      title: 'Animation',
      image: '/api/placeholder/668/372',
      description: 'Animation Services'
    },
    {
      title: 'Media & Generative Art',
      image: '/api/placeholder/668/372',
      description: 'Media & Generative Art'
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto">
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              {/* Service Image */}
              <div className="relative h-[372px] overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-4xl text-gray-500">🎬</div>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold mb-2">{service.title}</div>
                    <div className="text-sm opacity-90">{service.description}</div>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[#FF0066] text-base font-[300] leading-6">
                    {service.title}
                  </span>
                  <span className="text-black text-base font-[300] leading-6 ml-2">
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  <span className="text-black text-xl font-[400] leading-[30px]">
                    →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;