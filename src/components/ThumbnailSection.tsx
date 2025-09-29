'use client';

import { useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';
import { urlFor } from '@/lib/sanity';

interface Service {
  _id: string;
  title: string;
  description: string;
  url?: string;
  imageUrl: string;
  imageAlt: string;
  image: unknown;
}

const ThumbnailSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to mock data
        setServices([
          {
            _id: '1',
            title: 'VFX',
            description: 'Visual Effects',
            url: '/services/vfx',
            imageUrl: '/api/placeholder/668/372',
            imageAlt: 'VFX',
            image: null
          },
          {
            _id: '2',
            title: 'Immersive',
            description: 'Immersive Experiences',
            url: '/services/immersive',
            imageUrl: '/api/placeholder/668/372',
            imageAlt: 'Immersive',
            image: null
          },
          {
            _id: '3',
            title: 'Film & Episodic',
            description: 'Film & Episodic Content',
            url: '/services/film-episodic',
            imageUrl: '/api/placeholder/668/372',
            imageAlt: 'Film & Episodic',
            image: null
          },
          {
            _id: '4',
            title: 'Animation',
            description: 'Animation Services',
            url: '/services/animation',
            imageUrl: '/api/placeholder/668/372',
            imageAlt: 'Animation',
            image: null
          },
          {
            _id: '5',
            title: 'Media & Generative Art',
            description: 'Media & Generative Art',
            url: '/services/media-generative-art',
            imageUrl: '/api/placeholder/668/372',
            imageAlt: 'Media & Generative Art',
            image: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="w-full py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="row">
            <div className="text-center">
              <div className="text-2xl">Loading services...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
          {services.map((service, index) => {
            const imageUrl = service.image ? urlFor(service.image).width(668).height(372).url() : service.imageUrl;
            return (
              <ServiceCard
                key={service._id}
                title={service.title}
                image={imageUrl}
                url={service.url || `/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                description={service.description}
                index={index}
              />
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
};

export default ThumbnailSection;
