'use client';

interface TextSectionProps {
  title?: string;
  copy?: unknown[];
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

          {/* Content - Basic text rendering for now */}
          {copy && copy.length > 0 && (
            <div>
              <h6 className="display_h6">
                {copy.map((block: unknown, index: number) => {
                  const blockObj = block as { _type?: string; children?: Array<{ text?: string }> };
                  if (blockObj._type === 'block' && blockObj.children) {
                    return blockObj.children.map((child: { text?: string }, childIndex: number) => (
                      <span key={`${index}-${childIndex}`}>
                        {child.text}
                        {childIndex < blockObj.children!.length - 1 && <br />}
                      </span>
                    ));
                  }
                  return null;
                })}
              </h6>
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
