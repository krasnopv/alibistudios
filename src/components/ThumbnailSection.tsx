'use client';

import { useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';
// Removed urlFor import to avoid CORS issues

interface ServiceTag {
  _id: string;
  name: string;
  color?: string;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  url?: string;
  imageUrl: string;
  imageAlt: string;
  image: unknown;
  tags?: ServiceTag[];
}

const ThumbnailSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/homepage-services');
        const data = await response.json();
        
        console.log('Homepage services API response:', data);
        
        // Only set services if we have data, otherwise show empty array
        if (data && data.length > 0) {
          setServices(data);
        } else {
          console.log('No services found for homepage, hiding section');
          setServices([]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="w-full">
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

  // If no services are available, don't render the section
  if (services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Title */}
          <div className="text-center mb-16">
          <h6 className="display_h6">
            An elite group of award-winning artists<br />all under one &apos;Virtual Roof&apos;
          </h6>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const imageUrl = service.imageUrl;
            return (
              <ServiceCard
                key={service._id}
                title={service.title}
                image={imageUrl}
                url={service.slug ? `/services/${service.slug}` : `/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}
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
