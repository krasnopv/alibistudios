'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import PageLoader from '@/components/PageLoader';
import GetInTouch from '@/components/GetInTouch';
import { PortableText, PortableTextBlock } from '@portabletext/react';
import { getAssetPath } from '@/lib/assets';

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

        {/* Studios Content - 50/50 Grid Layout */}
        <section className="w-full">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="row">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
                {studios.map((studio) => (
                  <div key={studio._id}>
                    {/* Mobile/Tablet Layout - Image above, content below */}
                    <div className="lg:hidden">
                      {/* Image */}
                      {studio.imageUrl && (
                        <div className="relative w-full aspect-[4/3] max-h-[360px] overflow-hidden">
                          <Image
                            src={studio.imageUrl}
                            alt={studio.imageAlt || studio.studioName || studio.name || studio.title || 'Studio image'}
                            fill
                            className="object-cover"
                            sizes="100vw"
                          />
                          {/* White Logo Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center z-30">
                            <Image
                              src={getAssetPath('logo_white.svg')}
                              alt="Alibi Studios"
                              width={93}
                              height={35}
                              className="w-[30%] h-auto"
                            />
                          </div>
                        </div>
                      )}
                      {/* Content below image */}
                      <div className="w-full p-6 bg-[#ffffff]">
                        <h2 className="display_h6 !mb-6">
                      {studio.studioName || studio.name || studio.title}
                    </h2>
                          {studio.description && studio.description.length > 0 && (
                            <div 
                            className="text-[16px] md:text-[18px] font-[400] leading-[150%] tracking-[0%]"
                              style={{ fontFamily: 'Plus Jakarta Sans' }}
                            >
                            <div className="prose max-w-none">
                                <PortableText value={studio.description} />
                              </div>
                            </div>
                          )}
                        </div>
                    </div>

                    {/* Desktop Layout - Overlay with hover effect */}
                    <div className="hidden lg:block group relative w-full aspect-[4/3] max-h-[360px] overflow-hidden cursor-pointer">
                      {/* Content Layer - Title and Description */}
                      <div className="absolute inset-0 z-10 flex flex-col justify-start p-6 bg-[#ffffff] overflow-auto">
                        <h2 className="display_h6 !mb-6">
                          {studio.studioName || studio.name || studio.title}
                        </h2>
                        {studio.description && studio.description.length > 0 && (
                          <div 
                            className="text-[16px] md:text-[18px] font-[400] leading-[150%] tracking-[0%]"
                            style={{ fontFamily: 'Plus Jakarta Sans' }}
                          >
                            <div className="prose max-w-none">
                              <PortableText value={studio.description} />
                            </div>
                            </div>
                          )}
                        </div>

                      {/* Image Layer - Covers content, disappears on hover */}
                          {studio.imageUrl && (
                        <div className="absolute inset-0 z-20 group-hover:opacity-0 transition-opacity duration-300">
                              <Image
                                src={studio.imageUrl}
                                alt={studio.imageAlt || studio.studioName || studio.name || studio.title || 'Studio image'}
                                fill
                                className="object-cover"
                            sizes="50vw"
                              />
                          {/* White Logo Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center z-30">
                            <Image
                              src={getAssetPath('logo_white.svg')}
                              alt="Alibi Studios"
                              width={93}
                              height={35}
                              className="w-[30%] h-auto"
                            />
                              </div>
                            </div>
                          )}
                        </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Get in Touch Section */}
        <GetInTouch />
      </main>
    </div>
  );
}

