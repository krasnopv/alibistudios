'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServiceAccordion from '@/components/ServiceAccordion';

interface ServiceTag {
  _id: string;
  name: string;
  color?: string;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string | unknown; // Can be string or rich text object
  imageUrl: string;
  imageAlt: string;
  tags: ServiceTag[];
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        console.log('Services fetched:', data.length, 'services');
        console.log('Services data:', data);
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
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className="w-full flex flex-col items-center">
        {/* Hero with services video */}
        <Hero 
          pageSlug="services" 
          className="mb-8"
        />
        
        {/* Services content */}
        <section className="w-full py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              {/* Header */}
              <div className="mb-16">
                <h1 className="display_h1 text-center">
                  All under one &apos;Virtual Roof&apos;
                </h1>
              </div>

              {/* Services Accordion */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0066]"></div>
                </div>
              ) : (
                <ServiceAccordion services={services} />
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
