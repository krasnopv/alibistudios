'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PageLoader from '@/components/PageLoader';
import { PortableText, PortableTextBlock } from '@portabletext/react';

interface Studio {
  _id: string;
  title: string;
  studioName?: string;
  name?: string;
  description: PortableTextBlock[];
  imageUrl?: string;
  imageAlt?: string;
  order?: number;
}

interface Page {
  _id: string;
  title: string;
  slug: string;
}

export default function Studios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<Page | null>(null);
  const [hasHeroContent, setHasHeroContent] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch studios
        const studiosResponse = await fetch('/api/studios');
        const studiosData = await studiosResponse.json();
        setStudios(studiosData);

        // Fetch page data
        const pageResponse = await fetch('/api/pages/slug/studios');
        const pageData = await pageResponse.json();
        setPageData(pageData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setStudios([]);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className={`w-full flex flex-col items-center ${hasHeroContent === false ? 'no-hero' : ''}`}>
        {/* Hero Section */}
        <Hero 
          pageSlug="studios" 
          className="mb-8"
          onRenderChange={setHasHeroContent}
        />

        {/* Page Title Section */}
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

        {/* Studios Content - Alternating Layout */}
        {studios.map((studio, index) => {
          const isEven = index % 2 === 0;
          // Even index (0, 2, 4...): Description | Image
          // Odd index (1, 3, 5...): Image | Description

          return (
            <section key={studio._id} className="w-full mb-16">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="row">
                  {/* Studio Name */}
                  <div className="mb-8">
                    <h2 className="display_h6 text-center">
                      {studio.studioName || studio.name || studio.title}
                    </h2>
                  </div>

                  {/* Alternating Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {isEven ? (
                      <>
                        {/* Description on left (desktop), Image on top (mobile) */}
                        <div className="order-2 md:order-1">
                          {studio.description && studio.description.length > 0 && (
                            <div 
                              className="text-[20px] font-[400] leading-[150%] tracking-[0%]"
                              style={{ fontFamily: 'Plus Jakarta Sans' }}
                            >
                              <div className="prose prose-gray max-w-none">
                                <PortableText value={studio.description} />
                              </div>
                            </div>
                          )}
                        </div>
                        {/* Image on right (desktop), Image on top (mobile) */}
                        <div className="order-1 md:order-2">
                          {studio.imageUrl && (
                            <div className="relative w-full h-full min-h-[400px]">
                              <Image
                                src={studio.imageUrl}
                                alt={studio.imageAlt || studio.studioName || studio.name || studio.title || 'Studio image'}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Image on left (desktop), Image on top (mobile) */}
                        <div className="order-1">
                          {studio.imageUrl && (
                            <div className="relative w-full h-full min-h-[400px]">
                              <Image
                                src={studio.imageUrl}
                                alt={studio.imageAlt || studio.studioName || studio.name || studio.title || 'Studio image'}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </div>
                          )}
                        </div>
                        {/* Description on right (desktop), Description below (mobile) */}
                        <div className="order-2">
                          {studio.description && studio.description.length > 0 && (
                            <div 
                              className="text-[20px] font-[400] leading-[150%] tracking-[0%]"
                              style={{ fontFamily: 'Plus Jakarta Sans' }}
                            >
                              <div className="prose prose-gray max-w-none">
                                <PortableText value={studio.description} />
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

