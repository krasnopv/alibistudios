'use client';

import { useMailto } from '@/hooks/useMailto';

interface GetInTouchProps {
  sectionId?: string;
  title?: string;
  description?: unknown[];
  buttonText?: string;
  email: string;
}

const GetInTouch = ({ sectionId, title, description, buttonText, email }: GetInTouchProps) => {
  const { handleMailtoClick, copied } = useMailto(email);

  const renderRichText = (content: unknown[]): React.ReactNode => {
    if (!content || content.length === 0) {
      return null;
    }

    return content.map((block: unknown, index: number) => {
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
    });
  };

  return (
    <section id={sectionId} className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          <div className="mb-16">
            {title && (
              <h1 className="display_h1 brand-color text-center">
                {title}
              </h1>
            )}
            {description && description.length > 0 && (
              <h6 className="display_h6 text-center">
                {renderRichText(description)}
              </h6>
            )}
            <div className="text-center mt-8">
              <h6 className="display_h6 brand-color">
                <a 
                  href={`mailto:${email}`}
                  onClick={handleMailtoClick}
                  className="hover:underline cursor-pointer"
                  title={copied ? 'Email copied to clipboard!' : `Click to copy ${email}`}
                >
                  {copied ? 'Email copied!' : (buttonText || 'Get in Touch')}
                </a> →
              </h6>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;

