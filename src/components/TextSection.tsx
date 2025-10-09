'use client';

import { PortableText } from '@portabletext/react';
import { serializers } from '@/lib/serializers';

interface TextSectionProps {
  title?: string;
  copy?: any[];
  url?: {
    type: 'internal' | 'external';
    internalPage?: { _ref: string };
    externalUrl?: string;
  };
}

const TextSection = ({ title, copy, url }: TextSectionProps) => {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Title */}
          {title && (
            <div className="mb-4">
              <h1 className="display_h1 brand-color">
                {title}
              </h1>
            </div>
          )}

          {/* Content */}
          {copy && copy.length > 0 && (
            <div>
              <PortableText value={copy} components={serializers} />
            </div>
          )}

          {/* URL Link */}
          {url && (
            <div className="mt-8">
              {url.type === 'internal' && url.internalPage ? (
                <a 
                  href={`/pages/${url.internalPage._ref}`}
                  className="inline-flex items-center text-[#FF0066] hover:underline"
                >
                  Learn More →
                </a>
              ) : url.type === 'external' && url.externalUrl ? (
                <a 
                  href={url.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#FF0066] hover:underline"
                >
                  Learn More →
                </a>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TextSection;
