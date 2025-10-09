import BlockContent from '@sanity/block-content-to-react';
import { serializers } from '@/lib/serializers';

interface CTASectionProps {
  title?: unknown[];
}

export default function CTASection({ title }: CTASectionProps) {
  const defaultTitle = "An elite group of award-winning artists\nall under one 'Virtual Roof'";
  
  const renderRichText = (title: unknown[] | undefined) => {
    // Handle rich text array
    if (title && Array.isArray(title) && title.length > 0) {
      return <BlockContent blocks={title} serializers={serializers} />;
    }
    
    // Fallback to default title with line breaks
    return defaultTitle.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < defaultTitle.split('\n').length - 1 && <br />}
      </span>
    ));
  };
  
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 lg:py-6">
        <div className="row">
          <div className="text-center">
            <h6 className="display_h6">
              {renderRichText(title)}
            </h6>
          </div>
        </div>
      </div>
    </section>
  );
}
