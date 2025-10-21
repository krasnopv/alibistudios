'use client';

interface TextSectionProps {
  sectionId?: string;
  title?: string;
  copy?: unknown[];
  url?: {
    type: 'internal' | 'external';
    internalPage?: { 
      _id: string;
      slug: string;
    };
    externalUrl?: string;
  };
}

const TextSection = ({ sectionId, title, copy, url }: TextSectionProps) => {
  return (
    <section id={sectionId} className="w-full">
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

          {/* Content - Basic text rendering with arrow at the end */}
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
                {url && (
                  url.type === 'internal' && url.internalPage ? (
                    <a 
                      href={`/${url.internalPage.slug}`}
                      className="text-black hover:underline"
                    >
                      →
                    </a>
                  ) : url.type === 'external' && url.externalUrl ? (
                    <a 
                      href={url.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:underline"
                    >
                      →
                    </a>
                  ) : (
                    ' →'
                  )
                )}
              </h6>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TextSection;
