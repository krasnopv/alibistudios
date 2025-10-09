interface CTASectionProps {
  title?: unknown[];
}

export default function CTASection({ title }: CTASectionProps) {
  const defaultTitle = "An elite group of award-winning artists\nall under one 'Virtual Roof'";
  
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 lg:py-6">
        <div className="row">
          <div className="text-center">
            <h6 className="display_h6">
              {title && title.length > 0 ? (
                title.map((block: unknown, index: number) => {
                  const blockObj = block as { _type?: string; children?: Array<{ text?: string; marks?: string[] }> };
                  if (blockObj._type === 'block' && blockObj.children) {
                    return blockObj.children.map((child: { text?: string; marks?: string[] }, childIndex: number) => {
                      let text = child.text || '';
                      
                      // Apply text formatting based on marks
                      if (child.marks && child.marks.length > 0) {
                        child.marks.forEach(mark => {
                          switch (mark) {
                            case 'strong':
                              text = `<strong>${text}</strong>`;
                              break;
                            case 'em':
                              text = `<em>${text}</em>`;
                              break;
                            case 'underline':
                              text = `<u>${text}</u>`;
                              break;
                            case 'code':
                              text = `<code>${text}</code>`;
                              break;
                          }
                        });
                      }
                      
                      return (
                        <span 
                          key={`${index}-${childIndex}`}
                          dangerouslySetInnerHTML={{ __html: text }}
                        />
                      );
                    });
                  }
                  return null;
                })
              ) : (
                defaultTitle.split('\n').map((line, index) => (
                  <span key={index}>
                    {line}
                    {index < defaultTitle.split('\n').length - 1 && <br />}
                  </span>
                ))
              )}
            </h6>
          </div>
        </div>
      </div>
    </section>
  );
}
