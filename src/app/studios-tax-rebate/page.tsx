'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import TextSection from '@/components/TextSection';
import CTASection from '@/components/CTASection';
import ThumbnailSection from '@/components/ThumbnailSection';
import Films from '@/components/Films';
import Awards from '@/components/Awards';
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

export default function StudiosTaxRebate() {
  const [hasHeroContent, setHasHeroContent] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showNavigation, setShowNavigation] = useState<boolean>(false);
  const [pageData, setPageData] = useState<Page | null>(null);

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

  // Track which section is currently in view and show/hide navigation
  useEffect(() => {
    const sections = ['fr', 'uk'];
    const heroSection = document.getElementById('hero');
    const supportSection = document.getElementById('support');
    const introductionSection = document.getElementById('introduction');
    
    console.log('Navigation elements found:', {
      hero: !!heroSection,
      support: !!supportSection,
      introduction: !!introductionSection
    });
    
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

    const navigationObserver = new IntersectionObserver(
      (entries) => {
        const heroVisible = entries.find(entry => entry.target === heroSection)?.isIntersecting || false;
        const supportVisible = entries.find(entry => entry.target === supportSection)?.isIntersecting || false;
        const introductionVisible = entries.find(entry => entry.target === introductionSection)?.isIntersecting || false;
        
        console.log('Navigation visibility check:', {
          heroVisible,
          supportVisible,
          introductionVisible,
          shouldHide: heroVisible || supportVisible || introductionVisible
        });
        
        // Hide navigation when Hero, first section, or introduction (with buttons) are in view
        // If Hero doesn't exist (no media), only check support and introduction
        const shouldHideNavigation = (heroSection ? heroVisible : false) || supportVisible || introductionVisible;
        setShowNavigation(!shouldHideNavigation);
      },
      {
        rootMargin: '0px 0px -50% 0px', // Trigger when section is 50% from bottom
        threshold: 0.1
      }
    );

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        sectionObserver.observe(element);
      }
    });

    // Observe all sections that should hide navigation when visible
    [heroSection, supportSection, introductionSection].forEach(element => {
      if (element) {
        navigationObserver.observe(element);
      }
    });

    return () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          sectionObserver.unobserve(element);
        }
      });
      [heroSection, supportSection, introductionSection].forEach(element => {
        if (element) {
          navigationObserver.unobserve(element);
        }
      });
    };
  }, []);

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
                    <a 
                      href="/contact" 
                      className="inline-block bg-[#FF0066] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#E6005C] transition-colors"
                    >
                      Contact us →
                    </a>
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
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-8">
                  <a 
                    href="#fr" 
                    className="inline-block bg-[#FF0066] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#E6005C] transition-colors"
                  >
                    France&apos;s TRIP
                  </a>
                  <a 
                    href="#uk" 
                    className="inline-block bg-[#FF0066] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#E6005C] transition-colors"
                  >
                    UK&apos;s AVEC
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* France TRIP Section */}
        <section id="fr" className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  FRANCE: TAX REBATE FOR INTERNATIONAL PRODUCTIONS (TRIP)
                </h1>
                <h6 className="display_h6 text-center">
                  The <strong>TRIP</strong> (Tax Rebate for International Productions) is a financial incentive granted by Film France – CNC (French National Center for Cinema, TV, and the Moving Image) to French production service companies. It offers:<br />
                  <strong>30% rebate</strong> on qualifying expenditures in France<br />
                  <strong>40% rebate</strong> if French VFX expenses exceed €2M<br />
                  It is capped at €30 million per project, which means €100M in eligible expenditures.<br />
                  In 2022, 101 projects benefited from TRIP—don&apos;t miss this opportunity!
                </h6>
              </div>
            </div>
          </div>
        </section>

        {/* France TRIP Details */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  Eligible expenses include:
                </h1>
                <h6 className="display_h6 text-center">
                  Salaries and wages paid to French or EU writers, actors (up to the minimum set in collective bargaining agreements), direction and production staff (wages and incidentals) including the related social contributions;<br />
                  Expenditures incurred to specialized companies for technical goods and services;<br />
                  Transportation, travel and catering expenditures;<br />
                  Depreciation expenses
                </h6>
              </div>
            </div>
          </div>
        </section>

        {/* France TRIP Requirements */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  Qualifying requirements:
                </h1>
                <h6 className="display_h6 text-center">
                  The project must be a fictional audiovisual work (live action or animation, feature film, short film, TV special, single or several episodes of a series, or a whole season); documentaries are not eligible;<br />
                  The project must shoot at least 5 days in France for live action production;<br />
                  At least of €250 000 or 50% of their total production expenses must be spent on French qualifying expenditures;<br />
                  The production must pass a cultural test specific to each genre (live action or animation), including elements related to the French culture, heritage, and territory;<br />
                  The production must hire a French production services company to apply.
                </h6>
              </div>
            </div>
          </div>
        </section>

        {/* VFX Bonus Section */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  VFX-related 10% Bonus
                </h1>
                <h6 className="display_h6 text-center">
                  Projects with over €2M in VFX-related French expenditure qualify for a 40% rebate on all eligible expenses, including live-action costs.<br />
                  The VFX-related expenditure must be carried out by a service provider established in France and related to digital processing of shots allowing the addition of characters, decorative elements or objects participating in the action, or modifying the rendering of the scene, or the camera point of view.<br />
                  VFX-only projects with no filming in France are eligible for the TRIP if they respect two conditions:<br />
                  At least 15% of the shots, or on average one and a half shots per minute, are digitally processed (on the whole film);<br />
                  More than 50% of the French spend is for VFX/post-production
                </h6>
              </div>
            </div>
          </div>
        </section>

        {/* How to Apply - France */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  How to apply?
                </h1>
                <h6 className="display_h6 text-center">
                  The TRIP is selectively granted by the CNC to French production services companies who are in charge of shooting in France in compliance with a contract entered into with a non-French production company.<br />
                  The French production services company that you choose has to be in charge of:<br />
                  supplying the artistic and technical means for making the feature film or TV project concerned;<br />
                  managing the material operations for its making, and monitoring its proper execution.<br />
                  The French production services company will receive the TRIP through their yearly tax return.<br />
                  <strong>For detailed information about Tax Rebate for International Productions (TRIP), visit Film France website here.</strong>
                </h6>
              </div>
            </div>
          </div>
        </section>

        {/* UK AVEC Section */}
        <section id="uk" className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  UK: AUDIO VISUAL EXPENDITURE CREDIT (AVEC) & FILM TAX RELIEF
                </h1>
                <h6 className="display_h6 text-center">
                  Since 2024, the UK Government has introduced the Audio Visual Expenditure Credit (AVEC), modernizing the tax relief system for film and TV productions. Further new measures confirmed by the Government will make the reliefs even more competitive, taking effect from April, 1st 2025 in respect of expenditure incurred on or after January, 1st 2025. The AVEC offers:<br />
                  <strong>25.5% net tax relief</strong> for live-action feature films & high-end TV<br />
                  <strong>29.25% net tax relief</strong> for animated films, animated TV & children&apos;s TV<br />
                  <strong>39.75% net tax relief</strong> for UK Independent Film Tax Credit (IFTC)<br />
                  <strong>5% uplift for UK VFX costs from April 2025 (29.25% total)</strong>
                </h6>
              </div>
            </div>
          </div>
        </section>

        {/* UK Eligible Expenses */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  Eligible expenses include:
                </h1>
                <h6 className="display_h6 text-center">
                  Production crew salaries & wages<br />
                  Set construction & on-location costs<br />
                  Pre-production, principal photography, VFX & Post-production<br />
                  UK-based goods & services<br />
                  Above-the-line costs, including actors and directors, irrespective of nationality
                </h6>
              </div>
            </div>
          </div>
        </section>

        {/* UK Transition Rules */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  Transition rules to new incentives:
                </h1>
                <h6 className="display_h6 text-center">
                  AVEC applies to accounting periods ending on or after 1 January 2024;<br />
                  Productions starting before 1 April 2025 can continue under the existing relief system until 31 March 2027;<br />
                  Existing tax relief ends for productions starting on or after 1 April 2025.
                </h6>
              </div>
            </div>
          </div>
        </section>

        {/* UK From April 2025 */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  From April 2025:
                </h1>
                <h6 className="display_h6 text-center">
                  UK Independent Film Tax Credit (IFTC) at 39.75%, for films under £15M<br />
                  UK VFX costs receive a 5% increase in relief (29.25%) and are no longer subject to the 80% cap
                </h6>
              </div>
            </div>
          </div>
        </section>

        {/* UK Qualifying Requirements */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  Qualifying requirements:
                </h1>
                <h6 className="display_h6 text-center">
                  Theatrical release intention for films<br />
                  Minimum UK expenditure: At least 10% of total core expenditure<br />
                  TV minimum spend: £1M per broadcast hour<br />
                  British certification: Pass the Cultural Test or qualify as an official UK co-production<br />
                  80% cap remains, except for qualifying UK VFX costs (from April 2025)
                </h6>
              </div>
            </div>
          </div>
        </section>

        {/* How to Apply - UK */}
        <section className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              <div className="mb-16">
                <h1 className="display_h1 brand-color text-center">
                  How to apply?
                </h1>
                <h6 className="display_h6 text-center">
                  Apply for British certification via BFI.<br />
                  Submit claims to HMRC.<br />
                  Turnaround time: BFI ~10-12 weeks, HMRC ~6 weeks.<br />
                  <strong>For detailed information about UK Tax Reliefs, visit British Film Commission website here.</strong>
                </h6>
              </div>
            </div>
          </div>
        </section>

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
                    <a href="mailto:contact@alibi.com" className="hover:underline">Get in Touch</a> | <a href="/contact" className="hover:underline">Contact Form</a> →
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
        <nav className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 transition-opacity duration-300 ${showNavigation ? 'opacity-100' : 'opacity-0 pointer-events-none'} sm:right-6 lg:right-8`}>
          <div className="flex flex-col space-y-3">
            <a 
              href="#fr" 
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-colors shadow-lg hover:shadow-xl aspect-square ${
                activeSection === 'fr' 
                  ? 'bg-[#FF0066] text-white' 
                  : 'bg-white text-[#FF0066] hover:bg-gray-50'
              }`}
              title="France TRIP"
            >
              FR
            </a>
            <a 
              href="#uk" 
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-colors shadow-lg hover:shadow-xl aspect-square ${
                activeSection === 'uk' 
                  ? 'bg-[#FF0066] text-white' 
                  : 'bg-white text-[#FF0066] hover:bg-gray-50'
              }`}
              title="UK AVEC"
            >
              UK
            </a>
          </div>
        </nav>
      </div>
      <Footer />
    </div>
  );
}
