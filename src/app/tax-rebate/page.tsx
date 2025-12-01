'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TextSection from '@/components/TextSection';
import CTASection from '@/components/CTASection';
import ThumbnailSection from '@/components/ThumbnailSection';
import Films from '@/components/Films';
import Awards from '@/components/Awards';
import RebateSection from '@/components/RebateSection';
import ScrollableCategories from '@/components/ScrollableCategories';
import GetInTouch from '@/components/GetInTouch';
import { PortableText, PortableTextBlock } from '@portabletext/react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import BlockContent from '@sanity/block-content-to-react';
import { serializers } from '@/lib/serializers';

interface Page {
  _id: string;
  title: string;
  subTitle?: unknown[];
  slug: string;
  description?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  content?: Array<{
    _type: string;
    sectionId?: string;
    title?: string | unknown[];
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
    enabled?: boolean;
    subtitle?: string;
  }>;
}

interface Rebate {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  intro?: {
    title?: string;
    description?: PortableTextBlock[];
    imageUrl?: string;
    imageAlt?: string;
  };
  sections?: Array<{
    _type: string;
    title?: string;
    imageUrl?: string;
    imageAlt?: string;
    points?: Array<{
      point: string;
      description?: string;
    }>;
    description?: PortableTextBlock[];
    content?: PortableTextBlock[];
  }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  order?: number;
}

export default function TaxRebate() {
  const [hasHeroContent, setHasHeroContent] = useState<boolean | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [pageData, setPageData] = useState<Page | null>(null);
  const [rebates, setRebates] = useState<Rebate[]>([]);

  // Fetch page data from Sanity
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch('/api/pages/slug/tax-rebate');
        if (response.ok) {
          const data = await response.json();
          setPageData(data);
        }
      } catch (error) {
        console.error('Error fetching page data:', error);
      }
    };

    fetchPageData();
  }, []);

  // Fetch rebates data from Sanity
  useEffect(() => {
    const fetchRebates = async () => {
      try {
        const response = await fetch('/api/rebates');
        if (response.ok) {
          const data = await response.json();
          setRebates(data);
        }
      } catch (error) {
        console.error('Error fetching rebates:', error);
      }
    };

    fetchRebates();
  }, []);

  // Set initial active category when rebates are loaded
  useEffect(() => {
    if (rebates.length > 0 && activeCategory === '') {
      setActiveCategory(rebates[0].slug.current);
    }
  }, [rebates, activeCategory]);

  // Track which rebate section is currently in view for active state highlighting
  useEffect(() => {
    if (rebates.length === 0) return;
    
    const sections = rebates.map(rebate => rebate.slug.current);
    
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -20% 0px', // Trigger when section is 20% from top and bottom
        threshold: 0.1
      }
    );

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        sectionObserver.observe(element);
      }
    });

    return () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          sectionObserver.unobserve(element);
        }
        });
      };
    }, [rebates]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <div className="w-full flex">
        <main className={`flex-1 flex flex-col items-center ${hasHeroContent === false ? 'no-hero' : ''}`}>
        {/* Hero Section */}
        <Hero 
          pageSlug="tax-rebate" 
          className="mb-8"
          onRenderChange={setHasHeroContent}
        />

        {/* Page Title Section */}
        {pageData?.title && (
          <section className="w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="row">
                <div className="mb-16">
                  <h1 className="display_h1 brand-color text-center mb-6">
                    {pageData.title}
                  </h1>
                  {pageData.subTitle && Array.isArray(pageData.subTitle) && pageData.subTitle.length > 0 ? (
                    <h6 className="display_h6 text-center">
                      <BlockContent blocks={pageData.subTitle} serializers={serializers} />
                    </h6>
                  ) : (
                    <h6 className="display_h6 text-center">
                      Alibi is here to help you with the tax rebate incentives in France and the UK.
                    </h6>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Rebates Navigation */}
        {rebates.length > 0 && (
          <section className="w-full sticky top-14 z-40 bg-[#F8F9FA]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="row">
                <div className="pt-4 pb-4">
                  <ScrollableCategories
                    categories={rebates.map(rebate => rebate.title)}
                    activeCategory={rebates.find(r => r.slug.current === activeCategory)?.title || rebates[0]?.title || ''}
                    onCategoryChange={(category) => {
                      const selectedRebate = rebates.find(r => r.title === category);
                      if (selectedRebate) {
                        const element = document.getElementById(selectedRebate.slug.current);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          setActiveCategory(selectedRebate.slug.current);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Rebates Content */}
        {rebates.map((rebate) => (
          <section key={rebate._id} id={rebate.slug.current} className="w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="row border-t-2 border-b border-black pt-8 pb-8" style={{ borderColor: '#000000' }}>
                <div className="mb-16 w-full">
                  <h1 className="display_h6 brand-color text-center mb-8">
                    {rebate.intro?.title || rebate.title}
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:items-stretch items-start">
                    {/* Description on left (desktop), Description on top (mobile) */}
                    <div className="order-1">
                      {rebate.intro?.description && (
                        <div 
                          className="text-[20px] font-[400] leading-[150%] tracking-[0%]"
                          style={{ fontFamily: 'Plus Jakarta Sans' }}
                        >
                          <div className="prose prose-gray max-w-none">
                            <PortableText value={rebate.intro.description} />
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Image on right (desktop), Image below (mobile) */}
                    {rebate.intro?.imageUrl && (
                      <div className="order-2 flex items-start md:items-stretch justify-center self-stretch h-full">
                        <div 
                          className="relative w-full aspect-square md:h-full md:[aspect-ratio:unset]"
                        >
                          <Image
                            src={rebate.intro.imageUrl}
                            alt={rebate.intro.imageAlt || rebate.intro?.title || rebate.title || 'Introduction image'}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Render all sections for this rebate in chess format */}
            {rebate.sections?.map((section, sectionIndex) => {
              // Chess format: first section (index 0) = Image-Content, second (index 1) = Content-Image, etc.
              const isEven = sectionIndex % 2 === 0;
              // Even index (0, 2, 4...): Image | Content
              // Odd index (1, 3, 5...): Content | Image
              // Don't add bottom border for "How to apply" sections
              const shouldShowBottomBorder = section._type !== 'howToApply';

              return (
                <section key={sectionIndex} className="w-full">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`row ${shouldShowBottomBorder ? 'border-b' : ''}`} style={shouldShowBottomBorder ? { borderColor: '#000000' } : {}}>
                      <div className="mb-16 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                          {isEven ? (
                            <>
                              {/* Image on left (desktop), Image on top (mobile) */}
                              {section.imageUrl && (
                                <div className="order-1 flex items-center justify-center self-stretch">
                                  <div className="relative w-[25%] aspect-square">
                                    <Image
                                      src={section.imageUrl}
                                      alt={section.imageAlt || section.title || 'Section image'}
                                      fill
                                      className="object-contain"
                                      sizes="(max-width: 768px) 100vw, 12.5vw"
                                    />
                                  </div>
                                </div>
                              )}
                              {/* Content on right (desktop), Content below (mobile) */}
                              <div className={section.imageUrl ? "order-2" : "order-1 md:col-span-2"}>
                                <RebateSection section={section} />
                              </div>
                            </>
                          ) : (
                            <>
                              {/* Content on left (desktop), Content on top (mobile) */}
                              <div className={section.imageUrl ? "order-2 md:order-1" : "order-1 md:col-span-2"}>
                                <RebateSection section={section} />
                              </div>
                              {/* Image on right (desktop), Image below (mobile) */}
                              {section.imageUrl && (
                                <div className="order-1 md:order-2 flex items-center justify-center self-stretch">
                                  <div className="relative w-[25%] aspect-square">
                                    <Image
                                      src={section.imageUrl}
                                      alt={section.imageAlt || section.title || 'Section image'}
                                      fill
                                      className="object-contain"
                                      sizes="(max-width: 768px) 100vw, 12.5vw"
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </section>
        ))}

        {/* Dynamic Content Sections from Sanity */}
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
                        <h1 className="display_h1 brand-color text-center mb-6">
                          {pageData.title}
                        </h1>
                        {pageData.subTitle && Array.isArray(pageData.subTitle) && pageData.subTitle.length > 0 && (
                          <h6 className="display_h6 text-center">
                            <BlockContent blocks={pageData.subTitle} serializers={serializers} />
                          </h6>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              ) : null;
            
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
        })}
        
        {/* Show GetInTouch with placeholder if no getInTouchSection in content */}
        {pageData?.content && !pageData.content.some(section => section._type === 'getInTouchSection') && (
          <GetInTouch />
        )}
        </main>
      </div>
    </div>
  );
}


