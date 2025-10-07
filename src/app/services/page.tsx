'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
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
  description: string | unknown; // Can be string or rich text object
  imageUrl: string;
  imageAlt: string;
  subServices: SubService[];
}

interface Page {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesResponse = await fetch('/api/services');
        const servicesData = await servicesResponse.json();
        console.log('Services fetched:', servicesData.length, 'services');
        setServices(servicesData);

        // Fetch page data
        const pageResponse = await fetch('/api/pages/slug/services');
        const pageData = await pageResponse.json();
        console.log('Page data:', pageData);
        setPage(pageData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setServices([]);
        setPage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              {/* Header */}
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  {page?.title || 'All under one \'Virtual Roof\''}
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
