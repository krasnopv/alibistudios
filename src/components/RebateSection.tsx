import { PortableText, PortableTextBlock } from '@portabletext/react';

interface RebateSectionProps {
  section: {
    _type: string;
    title?: string;
    imageUrl?: string;
    imageAlt?: string;
    points?: Array<{
      point?: string;
      requirement?: string;
      description?: string;
    }>;
    description?: PortableTextBlock[];
    content?: PortableTextBlock[];
  };
}

export default function RebateSection({ section }: RebateSectionProps) {
  const renderContent = () => {
    switch (section._type) {
      case 'eligibleExpenses':
        return (
          <div>
            {section.title && (
              <div className="mb-8">
                <h1 className="heading_h1">
                  {section.title}
                </h1>
              </div>
            )}
              {section.points && section.points.length > 0 && (
                <div 
                  className="text-[20px] font-[400] leading-[150%] tracking-[0%]"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}
                >
                  <ul className="list-disc list-inside mb-4 space-y-2">
                    {section.points.map((point, index) => (
                      <li key={index} className="mb-2">
                        {point.point || point.requirement}
                        {point.description && (
                          <div className="mt-2 text-gray-600">
                            {point.description}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        );

      case 'qualifyingRequirements':
        return (
          <div>
            {section.title && (
              <div className="mb-8">
                <h1 className="heading_h1">
                  {section.title}
                </h1>
              </div>
            )}
              {section.points && section.points.length > 0 && (
                <div 
                  className="text-[20px] font-[400] leading-[150%] tracking-[0%]"
                  style={{ fontFamily: 'Plus Jakarta Sans' }}
                >
                  <ul className="list-disc list-inside mb-4 space-y-2">
                    {section.points.map((point, index) => (
                      <li key={index} className="mb-2">
                        {point.point || point.requirement}
                        {point.description && (
                          <div className="mt-2 text-gray-600">
                            {point.description}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        );

      case 'howToApply':
        return (
          <div>
            {section.title && (
              <div className="mb-8">
                <h1 className="heading_h1">
                  {section.title}
                </h1>
              </div>
            )}
            {section.description && (
              <div 
                className="text-[20px] font-[400] leading-[150%] tracking-[0%]"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                <PortableText value={section.description} />
              </div>
            )}
          </div>
        );

      case 'customSection':
        return (
          <div>
            {section.title && (
              <div className="mb-8">
                <h1 className="heading_h1">
                  {section.title}
                </h1>
              </div>
            )}
            {section.content && (
              <div 
                className="text-[20px] font-[400] leading-[150%] tracking-[0%]"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
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
