'use client';

import { useState, useEffect } from 'react';

interface Country {
  _id: string;
  title: string;
  slug: string;
  code: string;
  intro: {
    title: string;
    description: BlockContent[];
  };
  sections: Array<{
    _type: string;
    title: string;
    points?: Array<{
      point: string;
      description?: string;
    }>;
    steps?: Array<{
      step: string;
      description?: string;
    }>;
    content?: BlockContent[];
  }>;
}

interface BlockContent {
  _type: string;
  style?: string;
  children?: Array<{
    text: string;
  }>;
}

interface CountriesContentProps {
  countries: Country[];
}

export default function CountriesContent({ countries }: CountriesContentProps) {
  const [activeCountry, setActiveCountry] = useState<string>('');

  useEffect(() => {
    // Set initial active country to first one
    if (countries.length > 0) {
      setActiveCountry(countries[0].slug);
    }
  }, [countries]);

  const renderBlockContent = (content: BlockContent[]) => {
    if (!content) return null;
    
    return content.map((block, index) => {
      if (block._type === 'block') {
        const style = block.style || 'normal';
        const text = block.children?.map((child) => child.text).join('') || '';
        
        switch (style) {
          case 'h1':
            return <h1 key={index} className="text-3xl font-bold mb-4">{text}</h1>;
          case 'h2':
            return <h2 key={index} className="text-2xl font-bold mb-3">{text}</h2>;
          case 'h3':
            return <h3 key={index} className="text-xl font-bold mb-2">{text}</h3>;
          case 'h4':
            return <h4 key={index} className="text-lg font-bold mb-2">{text}</h4>;
          case 'h5':
            return <h5 key={index} className="text-base font-bold mb-2">{text}</h5>;
          case 'h6':
            return <h6 key={index} className="text-sm font-bold mb-2">{text}</h6>;
          default:
            return <p key={index} className="mb-4">{text}</p>;
        }
      }
      return null;
    });
  };

  const renderSection = (section: Country['sections'][0], index: number) => {
    switch (section._type) {
      case 'eligibleExpenses':
        return (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-[#FF0066]">{section.title}</h3>
            <ul className="list-disc list-inside space-y-2">
              {section.points?.map((point, pointIndex: number) => (
                <li key={pointIndex} className="flex flex-col">
                  <span className="font-medium">{point.point}</span>
                  {point.description && (
                    <span className="text-gray-600 text-sm ml-4">{point.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'qualifyingRequirements':
        return (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-[#FF0066]">{section.title}</h3>
            <ul className="list-disc list-inside space-y-2">
              {section.points?.map((point, pointIndex: number) => (
                <li key={pointIndex} className="flex flex-col">
                  <span className="font-medium">{point.point}</span>
                  {point.description && (
                    <span className="text-gray-600 text-sm ml-4">{point.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'howToApply':
        return (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-[#FF0066]">{section.title}</h3>
            <ol className="list-decimal list-inside space-y-2">
              {section.steps?.map((step, stepIndex: number) => (
                <li key={stepIndex} className="flex flex-col">
                  <span className="font-medium">{step.step}</span>
                  {step.description && (
                    <span className="text-gray-600 text-sm ml-4">{step.description}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        );

      case 'customSection':
        return (
          <div key={index} className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-[#FF0066]">{section.title}</h3>
            <div className="prose max-w-none">
              {section.content && renderBlockContent(section.content)}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentCountry = countries.find(country => country.slug === activeCountry);

  if (!countries.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No countries data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Country Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-4">
          {countries.map((country) => (
            <button
              key={country._id}
              onClick={() => setActiveCountry(country.slug)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeCountry === country.slug
                  ? 'bg-[#FF0066] text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {country.title}
            </button>
          ))}
        </div>
      </div>

      {/* Country Content */}
      {currentCountry && (
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          {currentCountry.intro && (
            <div className="mb-12">
              {currentCountry.intro.title && (
                <h2 className="text-3xl font-bold mb-6 text-center">{currentCountry.intro.title}</h2>
              )}
              {currentCountry.intro.description && (
                <div className="prose max-w-none text-center">
                  {renderBlockContent(currentCountry.intro.description)}
                </div>
              )}
            </div>
          )}

          {/* Sections */}
          {currentCountry.sections && (
            <div className="space-y-8">
              {currentCountry.sections.map((section, index) => renderSection(section, index))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
