'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TextSection from '@/components/TextSection';
import CTASection from '@/components/CTASection';
import ThumbnailSection from '@/components/ThumbnailSection';
import Films from '@/components/Films';
import Awards from '@/components/Awards';
import RebateSection from '@/components/RebateSection';
import { PortableText, PortableTextBlock } from '@portabletext/react';
import { useState, useEffect } from 'react';

interface Page {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  content?: Array<{
    _type: string;
    sectionId?: string;
    title?: string | unknown[];
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
  };
  sections?: Array<{
    _type: string;
    title?: string;
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

export default function StudiosTaxRebate() {
  const [hasHeroContent, setHasHeroContent] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [pageData, setPageData] = useState<Page | null>(null);
  const [rebates, setRebates] = useState<Rebate[]>([]);

  // Fetch page data from Sanity
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await fetch('/api/pages/studios-tax-rebate');
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

  // Track which section is currently in view for active state highlighting
  useEffect(() => {
    if (rebates.length === 0) return;
    
    const sections = rebates.map(rebate => rebate.slug.current);
    
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
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
          pageSlug="studios-tax-rebate" 
          className="mb-8"
          onRenderChange={setHasHeroContent}
        />

        {/* Support Section */}
        <section id="support" className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                {/* <h1 className="display_h1 brand-color text-center">
                  NEED SOME SUPPORT WITH TAX RELIEF SCHEMES?
                </h1> */}
                <h6 className="display_h6 text-center">
                  Our team at Alibi is here to help you with the tax rebate incentives from both the UK and France.<br />
                  We have worked on multiple productions which benefited from tax rebates – some examples below:<br />
                  A list of projects, which benefited from the schemes, can be found on CNC&apos;s website and British Film Commission website.
                </h6>
                <div className="text-center mt-8">
                  <h6 className="display_h6 brand-color">
                    Don&apos;t hesitate to contact our team
                  </h6>
                  <div className="mt-4">
                    <button 
                      onClick={() => {
                        const footer = document.querySelector('footer');
                        if (footer) {
                          footer.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="inline-block bg-[#FF0066] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#E6005C] transition-colors cursor-pointer"
                    >
                      Contact us →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section id="introduction" className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  Maximize your production budget by leveraging tax relief opportunities in France and in the UK!
                </h1>
                <h6 className="display_h6 text-center">
                  Whether you&apos;re working on a film or a series, both countries offer attractive incentives to support international or VFX-heavy productions.
                </h6>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Rebates Content */}
        {rebates.map((rebate) => (
          <section key={rebate._id} id={rebate.slug.current} className="w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="row">
                <div className="mb-16">
                  <h1 className="display_h1 brand-color text-center">
                    {rebate.title}
                  </h1>
                  {rebate.intro?.description && (
                    <div className="display_h6 text-center">
                      <div className="prose prose-gray max-w-none">
                        <PortableText value={rebate.intro.description} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Render all sections for this rebate */}
            {rebate.sections?.map((section, index) => (
              <section key={index} className="w-full">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="row">
                    <RebateSection section={section} />
                  </div>
                </div>
              </section>
            ))}
          </section>
        ))}



        {/* CTA Section */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  Ready to Maximize Your Production Budget?
                </h1>
                <h6 className="display_h6 text-center">
                  Contact our team to learn more about how we can help you take advantage of tax relief opportunities in France and the UK.
                </h6>
                <div className="text-center mt-8">
                  <h6 className="display_h6 brand-color">
                    <a href="mailto:contact@alibi.com" className="hover:underline">Get in Touch</a> | <button 
                      onClick={() => {
                        const footer = document.querySelector('footer');
                        if (footer) {
                          footer.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="hover:underline cursor-pointer bg-transparent border-none p-0 text-inherit"
                    >Contact Form</button> →
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </section>

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
                        <h1 className="display_h1 brand-color text-center">
                          {pageData.title}
                        </h1>
                      </div>
                    </div>
                  </div>
                </section>
              ) : null;
            
            default:
              return null;
          }
        })}
        </main>
        
        {/* Right-side Navigation */}
        <nav className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 sm:right-6 lg:right-8">
          <div className="flex flex-col space-y-3">
            {rebates.map((rebate) => (
              <a 
                key={rebate._id}
                href={`#${rebate.slug.current}`}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-colors shadow-lg hover:shadow-xl aspect-square ${
                  activeSection === rebate.slug.current
                    ? 'bg-[#FF0066] text-white' 
                    : 'bg-white text-[#FF0066] hover:bg-gray-50'
                }`}
                title={rebate.title}
              >
                {rebate.slug.current.toUpperCase()}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
