'use client';

import { useEffect, useState } from 'react';
import { PortableText, PortableTextBlock } from '@portabletext/react';
import ServiceAccordion from '@/components/ServiceAccordion';

const portableTextListClasses =
  '[&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-4 [&_ol]:space-y-2 [&_p]:mb-4 [&_p:last-child]:mb-0';

/** Sanity "Class" field — strips leading dot, allows safe class names only */
function normalizeSectionClass(value?: string): string | undefined {
  if (!value?.trim()) return undefined;
  const name = value.trim().replace(/^\./, '');
  if (!/^[\w-]+$/.test(name)) return undefined;
  return name;
}

function CopyContent({ copy, sectionClass }: { copy: PortableTextBlock[]; sectionClass?: string }) {
  const isServicesList = sectionClass === 'services-list';
  const baseClasses = isServicesList
    ? '[&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside [&_p]:!m-0 [&_li]:!m-0 [&_ul]:!mb-0 [&_ol]:!mb-0'
    : portableTextListClasses;
  const copyClassName = [baseClasses, sectionClass].filter(Boolean).join(' ');
  return (
    <div className={copyClassName}>
      <PortableText value={copy} />
    </div>
  );
}

interface SubService {
  _id: string;
  title: string;
  slug: string;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string | unknown;
  imageUrl: string;
  imageAlt: string;
  subServices: SubService[];
  showInServices?: boolean;
}

interface TextSectionProps {
  sectionId?: string;
  title?: string;
  copy?: PortableTextBlock[];
  /** Sanity "Class" field, e.g. ".services-list" */
  sectionClass?: string;
  url?: {
    type: 'none' | 'internal' | 'external';
    internalPage?: { 
      _id: string;
      slug: string;
    };
    externalUrl?: string;
  };
}

const TextSection = ({ sectionId, title, copy, sectionClass, url }: TextSectionProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const isOurServicesSection = sectionId === 'services';
  const isOurTeamSection = sectionId === 'our-team';
  const copyClassName = normalizeSectionClass(sectionClass);
  const hasUrlLink = Boolean(
    (url?.type === 'internal' && url.internalPage) ||
    (url?.type === 'external' && url.externalUrl)
  );

  useEffect(() => {
    if (isOurServicesSection) {
      const fetchServices = async () => {
        try {
          const response = await fetch('/api/services');
          const data = await response.json();
          setServices(data);
        } catch (error) {
          console.error('Error fetching services:', error);
          setServices([]);
        } finally {
          setLoading(false);
        }
      };

      fetchServices();
    } else {
      setLoading(false);
    }
  }, [isOurServicesSection]);

  return (
    <section id={sectionId} className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Content - Basic text rendering with arrow at the end */}
          {isOurTeamSection && hasUrlLink && url ? (
            url.type === 'internal' && url.internalPage ? (
              <a 
                href={`/${url.internalPage.slug}`}
                className="block cursor-pointer group"
              >
                {/* Title */}
                {title && (
                  <div className="mb-4">
                    <h1 className="display_h1 brand-color group-hover:text-[#FF0066] transition-colors duration-200">
                      {title}
                    </h1>
                  </div>
                )}
                {copy && copy.length > 0 && (
                  <div className={isOurServicesSection ? "mb-8" : ""}>
                    <div className="display_h6">
                      <CopyContent copy={copy} sectionClass={copyClassName} />
                      {' '}
                      <span className="text-black group-hover:text-[#FF0066] group-hover:underline transition-colors duration-200">Meet our Team →</span>
                    </div>
                  </div>
                )}
              </a>
            ) : (
              <a 
                href={url.externalUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="block cursor-pointer group"
              >
                {/* Title */}
                {title && (
                  <div className="mb-4">
                    <h1 className="display_h1 brand-color group-hover:text-[#FF0066] transition-colors duration-200">
                      {title}
                    </h1>
                  </div>
                )}
                {copy && copy.length > 0 && (
                  <div className={isOurServicesSection ? "mb-8" : ""}>
                    <div className="display_h6">
                      <CopyContent copy={copy} sectionClass={copyClassName} />
                      {' '}
                      <span className="text-black group-hover:text-[#FF0066] group-hover:underline transition-colors duration-200">Meet our Team →</span>
                    </div>
                  </div>
                )}
              </a>
            )
          ) : (
            <>
              {/* Title */}
              {title && (
                <div className="mb-4">
                  <h1 className="display_h1 brand-color">
                    {title}
                  </h1>
                </div>
              )}
              {copy && copy.length > 0 && (
                <div className={isOurServicesSection ? "mb-8" : ""}>
                  <div className="display_h6">
                    <CopyContent copy={copy} sectionClass={copyClassName} />
                    {hasUrlLink && !isOurServicesSection && !isOurTeamSection && url && (
                      url.type === 'internal' && url.internalPage ? (
                        <a 
                          href={`/${url.internalPage.slug}`}
                          className="text-black hover:underline"
                        >
                          {' →'}
                        </a>
                      ) : (
                        <a 
                          href={url.externalUrl!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black hover:underline"
                        >
                          {' →'}
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Services Accordion - Only for services section */}
          {isOurServicesSection && (
            <>
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0066]"></div>
                </div>
              ) : (
                <ServiceAccordion services={services.filter(service => service.showInServices !== false)} />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TextSection;
