'use client';

import { useEffect, useState } from 'react';
import ServiceAccordion from '@/components/ServiceAccordion';

interface SubService {
  _id: string;
  title: string;
  slug: string;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string | unknown;
  imageUrl: string;
  imageAlt: string;
  subServices: SubService[];
  showInServices?: boolean;
}

const OurServices = () => {
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
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id="services" className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Title */}
          <div className="mb-4">
            <h1 className="display_h1 brand-color">
              Our Services
            </h1>
          </div>

          {/* Content */}
          <div className="mb-8">
            <h6 className="display_h6">
              From traditional VFX to real-time and AI content & pipelines to Immersive gaming and interactive experiences, Alibi embraces the latest in virtual production stages, immersive LED volumes, forced-perspective media architecture. →
            </h6>
          </div>

          {/* Services Accordion */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0066]"></div>
            </div>
          ) : (
            <ServiceAccordion services={services.filter(service => service.showInServices !== false)} />
          )}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
