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
  description: string;
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
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to mock data
        setServices([
          {
            _id: '1',
            title: 'VFX Services',
            description: 'Professional visual effects for film and television. Our team of experienced artists creates stunning visual effects that bring your creative vision to life.',
            imageUrl: '/api/placeholder/600/400',
            imageAlt: 'VFX Services',
            tags: [
              { _id: '1', name: 'Film', color: '#FF0066' },
              { _id: '2', name: 'Television', color: '#3B82F6' },
              { _id: '3', name: 'Commercial', color: '#10B981' }
            ]
          },
          {
            _id: '2',
            title: 'Animation',
            description: 'High-quality animation services for all media. From 2D to 3D animation, we deliver exceptional results that captivate audiences.',
            imageUrl: '/api/placeholder/600/400',
            imageAlt: 'Animation Services',
            tags: [
              { _id: '4', name: '2D Animation', color: '#F59E0B' },
              { _id: '5', name: '3D Animation', color: '#8B5CF6' },
              { _id: '6', name: 'Motion Graphics', color: '#EF4444' }
            ]
          },
          {
            _id: '3',
            title: 'Immersive Experiences',
            description: 'Cutting-edge immersive and VR experiences. We create virtual worlds that engage and inspire users through innovative technology.',
            imageUrl: '/api/placeholder/600/400',
            imageAlt: 'Immersive Experiences',
            tags: [
              { _id: '7', name: 'VR', color: '#06B6D4' },
              { _id: '8', name: 'AR', color: '#84CC16' },
              { _id: '9', name: 'Interactive', color: '#F97316' }
            ]
          }
        ]);
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
