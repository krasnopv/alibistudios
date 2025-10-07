'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ThumbnailSection from '@/components/ThumbnailSection';
import OurServices from '@/components/OurServices';
import Awards from '@/components/Awards';
import Films from '@/components/Films';
import Team from '@/components/Team';

interface Page {
  _id: string;
  title: string;
  slug: string;
}

export default function Home() {
  const [pageData, setPageData] = useState<Page | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch('/api/pages/slug/home');
        const data = await response.json();
        setPageData(data);
      } catch (error) {
        console.error('Error fetching page data:', error);
        setPageData(null);
      }
    };

    fetchPageData();
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <main className="w-full flex flex-col items-center">
        <Hero pageSlug="home" />
        <ThumbnailSection />
        <OurServices />
        <Team />
        <Films />
        <Awards />
        
        {/* Dynamic Page Title Section */}
        {pageData?.title && (
          <section className="w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="row">
                <div className="mb-16">
                  <h1 className="display_h1 brand-color text-center">
                    {pageData.title}
                  </h1>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
