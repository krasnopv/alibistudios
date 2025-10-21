import { PortableText, PortableTextBlock } from '@portabletext/react';

interface RebateSectionProps {
  section: {
    _type: string;
    title?: string;
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
          <div className="mb-16">
            {section.title && (
              <h1 className="heading_h1">
                {section.title}
              </h1>
            )}
            {section.points && section.points.length > 0 && (
              <div 
                className="text-[20px] font-[400] leading-[150%] tracking-[0%]"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                {section.points.map((point, index) => (
                  <div key={index} className="mb-4">
                    <div>{point.point || point.requirement}</div>
                    {point.description && (
                      <div className="mt-2 text-gray-600">
                        {point.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'qualifyingRequirements':
        return (
          <div className="mb-16">
            {section.title && (
              <h1 className="heading_h1">
                {section.title}
              </h1>
            )}
            {section.points && section.points.length > 0 && (
              <div 
                className="text-[20px] font-[400] leading-[150%] tracking-[0%]"
                style={{ fontFamily: 'Plus Jakarta Sans' }}
              >
                {section.points.map((point, index) => (
                  <div key={index} className="mb-4">
                    <div>{point.point || point.requirement}</div>
                    {point.description && (
                      <div className="mt-2 text-gray-600">
                        {point.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'howToApply':
        return (
          <div className="mb-16">
            {section.title && (
              <h1 className="heading_h1">
                {section.title}
              </h1>
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
          <div className="mb-16">
            {section.title && (
              <h1 className="heading_h1">
                {section.title}
              </h1>
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
