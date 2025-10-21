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
  const renderContent = () => {
    switch (section._type) {
      case 'eligibleExpenses':
        return (
          <div className="mb-8">
            {section.title && (
              <h3 className="text-xl font-semibold mb-4 text-[#FF0066]">
                {section.title}
              </h3>
            )}
            {section.points && section.points.length > 0 && (
              <ul className="list-disc list-inside space-y-2">
                {section.points.map((point, index) => (
                  <li key={index} className="text-gray-700">
                    <strong>{point.point}</strong>
                    {point.description && (
                      <span className="block text-sm text-gray-600 mt-1">
                        {point.description}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case 'qualifyingRequirements':
        return (
          <div className="mb-8">
            {section.title && (
              <h3 className="text-xl font-semibold mb-4 text-[#FF0066]">
                {section.title}
              </h3>
            )}
            {section.points && section.points.length > 0 && (
              <ul className="list-disc list-inside space-y-2">
                {section.points.map((point, index) => (
                  <li key={index} className="text-gray-700">
                    <strong>{point.point}</strong>
                    {point.description && (
                      <span className="block text-sm text-gray-600 mt-1">
                        {point.description}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case 'howToApply':
        return (
          <div className="mb-8">
            {section.title && (
              <h3 className="text-xl font-semibold mb-4 text-[#FF0066]">
                {section.title}
              </h3>
            )}
            {section.description && (
              <div className="prose prose-gray max-w-none">
                <PortableText value={section.description} />
              </div>
            )}
          </div>
        );

      case 'customSection':
        return (
          <div className="mb-8">
            {section.title && (
              <h3 className="text-xl font-semibold mb-4 text-[#FF0066]">
                {section.title}
              </h3>
            )}
            {section.content && (
              <div className="prose prose-gray max-w-none">
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
