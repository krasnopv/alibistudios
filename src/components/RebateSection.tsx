import { PortableText, PortableTextBlock } from '@portabletext/react';

interface RebateSectionProps {
  section: {
    _type: string;
    title?: string;
    points?: Array<{
      point: string;
      description?: string;
    }>;
    description?: PortableTextBlock[];
    content?: PortableTextBlock[];
  };
}

export default function RebateSection({ section }: RebateSectionProps) {
  // Debug logging
  console.log('RebateSection received:', section);
  
  const renderContent = () => {
    switch (section._type) {
      case 'eligibleExpenses':
        return (
          <div className="mb-16">
            {section.title && (
              <h1 className="display_h1 brand-color text-center">
                {section.title}
              </h1>
            )}
            {section.points && section.points.length > 0 && (
              <h6 className="display_h6 text-center">
                {section.points.map((point, index) => (
                  <span key={index}>
                    {point.point}
                    {point.description && (
                      <span className="block mt-1">
                        {point.description}
                      </span>
                    )}
                    {index < (section.points?.length || 0) - 1 && <br />}
                  </span>
                ))}
              </h6>
            )}
          </div>
        );

      case 'qualifyingRequirements':
        return (
          <div className="mb-16">
            {section.title && (
              <h1 className="display_h1 brand-color text-center">
                {section.title}
              </h1>
            )}
            {section.points && section.points.length > 0 && (
              <h6 className="display_h6 text-center">
                {section.points.map((point, index) => (
                  <span key={index}>
                    {point.point}
                    {point.description && (
                      <span className="block mt-1">
                        {point.description}
                      </span>
                    )}
                    {index < (section.points?.length || 0) - 1 && <br />}
                  </span>
                ))}
              </h6>
            )}
          </div>
        );

      case 'howToApply':
        return (
          <div className="mb-16">
            {section.title && (
              <h1 className="display_h1 brand-color text-center">
                {section.title}
              </h1>
            )}
            {section.description && (
              <div className="display_h6 text-center">
                <PortableText value={section.description} />
              </div>
            )}
          </div>
        );

      case 'customSection':
        return (
          <div className="mb-16">
            {section.title && (
              <h1 className="display_h1 brand-color text-center">
                {section.title}
              </h1>
            )}
            {section.content && (
              <div className="display_h6 text-center">
                <PortableText value={section.content} />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
}
