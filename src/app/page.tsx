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
import GetInTouch from '@/components/GetInTouch';
import BlockContent from '@sanity/block-content-to-react';
import { serializers } from '@/lib/serializers';

interface Page {
  _id: string;
  title: string;
  subtitle?: unknown[];
  slug: string;
  content?: Array<{
    _type: string;
    sectionId?: string;
    title?: string | unknown[];
    subtitle?: string;
    enabled?: boolean;
    hide?: boolean;
    copy?: unknown[];
    description?: unknown[];
    buttonText?: string;
    email?: string;
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
        {pageData?.content && (() => {
          // Filter out hidden sections
          const visibleContent = pageData.content.filter(section => !section.hide);
          
          // Find the index of the first CTA section in visible content
          const firstCTASectionIndex = visibleContent.findIndex(s => s._type === 'ctaSection');
          
          return visibleContent.map((section, index) => {
            switch (section._type) {
              case 'ctaSection':
                const isFirstCTA = index === firstCTASectionIndex;
                return <CTASection key={index} sectionId={section.sectionId} title={Array.isArray(section.title) ? section.title : undefined} className={isFirstCTA ? 'mb-24' : ''} />;
            
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
                        <h1 className="display_h1 brand-color text-center mb-6">
                          {pageData.title}
                        </h1>
                        {pageData.subtitle && Array.isArray(pageData.subtitle) && pageData.subtitle.length > 0 && (
                          <h6 className="display_h6 text-center">
                            <BlockContent blocks={pageData.subtitle} serializers={serializers} />
                          </h6>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              ) : null;
            
            case 'ourServicesSection':
              return section.enabled !== false ? <OurServices key={index} /> : null;
            
            case 'getInTouchSection':
              return (
                <GetInTouch 
                  key={index} 
                  sectionId={section.sectionId}
                  title={typeof section.title === 'string' ? section.title : undefined}
                  description={section.description}
                  buttonText={section.buttonText}
                  email={section.email}
                />
              );
            
              default:
                return null;
            }
          });
        })()}
        
        {/* Show GetInTouch with placeholder if no getInTouchSection in content */}
        {pageData?.content && !pageData.content.some(section => section._type === 'getInTouchSection' && !section.hide) && (
          <GetInTouch />
        )}
        
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
