'use client';

import ServiceCard from './ServiceCard';

const ThumbnailSection = () => {
  const services = [
    {
      title: 'VFX',
      image: '/api/placeholder/668/372',
      url: '/services/vfx',
      description: 'Visual Effects'
    },
    {
      title: 'Immersive',
      image: '/api/placeholder/668/372',
      url: '/services/immersive',
      description: 'Immersive Experiences'
    },
    {
      title: 'Film & Episodic',
      image: '/api/placeholder/668/372',
      url: '/services/film',
      description: 'Film & Episodic Content'
    },
    {
      title: 'Animation',
      image: '/api/placeholder/668/372',
      url: '/services/animation',
      description: 'Animation Services'
    },
    {
      title: 'Media & Generative Art',
      image: '/api/placeholder/668/372',
      url: '/services/media',
      description: 'Media & Generative Art'
    }
  ];

  return (
    <section id="services" className="w-full py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Title */}
          <div className="text-center mb-16">
          <h2 style={{
            color: '#000',
            fontFamily: 'Plus Jakarta Sans',
            fontSize: '40px',
            fontStyle: 'normal',
            fontWeight: 250,
            lineHeight: '120%'
          }}>
            An elite group of award-winning artists<br />all under one &apos;Virtual Roof&apos;
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              image={service.image}
              url={service.url}
              description={service.description}
              index={index}
            />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default ThumbnailSection;
