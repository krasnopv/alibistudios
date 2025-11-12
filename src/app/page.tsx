'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ThumbnailSection from '@/components/ThumbnailSection';
import CTASection from '@/components/CTASection';
import TextSection from '@/components/TextSection';
import OurServices from '@/components/OurServices';
import Awards from '@/components/Awards';
import Films from '@/components/Films';
import Team from '@/components/Team';

interface Page {
  _id: string;
  title: string;
  slug: string;
  content?: Array<{
    _type: string;
    sectionId?: string;
    title?: string | unknown[];
    subtitle?: string;
    enabled?: boolean;
    copy?: unknown[];
    url?: {
      type: 'internal' | 'external';
      internalPage?: { 
        _id: string;
        slug: string;
      };
      externalUrl?: string;
    };
    schemaType?: string;
    filters?: {
      featured?: boolean;
      limit?: number;
    };
  }>;
}

export default function Home() {
  const [pageData, setPageData] = useState<Page | null>(null);
  const [hasHeroContent, setHasHeroContent] = useState<boolean | null>(null);

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
      <main className={`w-full flex flex-col items-center ${hasHeroContent === false ? 'no-hero' : ''}`}>
        <Hero pageSlug="home" onRenderChange={setHasHeroContent} />
        
        {/* Dynamic Content Sections */}
        {pageData?.content && pageData.content.map((section, index) => {
          switch (section._type) {
            case 'ctaSection':
              return <CTASection key={index} sectionId={section.sectionId} title={Array.isArray(section.title) ? section.title : undefined} />;
            
            case 'gridSection':
              return <ThumbnailSection key={index} sectionId={section.sectionId} schemaType={section.schemaType} filters={section.filters} />;
            
            case 'textSection':
              return <TextSection key={index} sectionId={section.sectionId} title={typeof section.title === 'string' ? section.title : undefined} copy={section.copy} url={section.url} />;
            
            case 'filmsSection':
              return section.enabled ? <Films key={index} sectionId={section.sectionId} title={typeof section.title === 'string' ? section.title : undefined} subtitle={section.subtitle} /> : null;
            
            case 'awardsSection':
              return section.enabled ? <Awards key={index} sectionId={section.sectionId} title={typeof section.title === 'string' ? section.title : undefined} subtitle={section.subtitle} /> : null;
            
            case 'pageTitleSection':
              return section.enabled && pageData.title ? (
                <section key={index} id={section.sectionId} className="w-full">
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
              ) : null;
            
            case 'ourServicesSection':
              return section.enabled !== false ? <OurServices key={index} /> : null;
            
            default:
              return null;
          }
        })}
        
        {/* Fallback static content if no dynamic content */}
        {/* {(!pageData?.content || pageData.content.length === 0) && (
          <>
            <CTASection />
            <ThumbnailSection />
            <OurServices />
            <Team />
            <Films />
            <Awards />
          </>
        )} */}
      </main>
    </div>
  );
}
