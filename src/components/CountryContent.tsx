import { Country, CountrySection } from '@/types/country';
import { PortableText } from '@portabletext/react';

interface CountryContentProps {
  country: Country;
}

export default function CountryContent({ country }: CountryContentProps) {
  const renderSection = (section: CountrySection, index: number) => {
    switch (section._type) {
      case 'introSection':
        return (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <p className="text-gray-700 leading-relaxed">{section.description}</p>
          </div>
        );

      case 'eligibleExpensesSection':
      case 'qualifyingRequirementsSection':
      case 'howToApplySection':
        return (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <ul className="list-disc list-inside space-y-2">
              {section.points?.map((point, pointIndex) => (
                <li key={pointIndex} className="text-gray-700">
                  <span className="font-medium">
                    {point.point || point.requirement || point.step || point.expense}
                  </span>
                  {point.description && (
                    <span className="text-gray-600"> - {point.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'customContentSection':
        return (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
            {section.description && (
              <p className="text-gray-700 leading-relaxed mb-4">{section.description}</p>
            )}
            {section.content && (
              <div className="prose max-w-none">
                <PortableText value={section.content} />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{country.name}</h1>
        {country.description && (
          <p className="text-xl text-gray-600">{country.description}</p>
        )}
      </div>

      <div className="space-y-8">
        {country.sections.map((section, index) => renderSection(section, index))}
      </div>

      {country.contactInfo && (
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-2">
            {country.contactInfo.email && (
              <p className="text-gray-700">
                <span className="font-medium">Email:</span>{' '}
                <a href={`mailto:${country.contactInfo.email}`} className="text-blue-600 hover:underline">
                  {country.contactInfo.email}
                </a>
              </p>
            )}
            {country.contactInfo.phone && (
              <p className="text-gray-700">
                <span className="font-medium">Phone:</span>{' '}
                <a href={`tel:${country.contactInfo.phone}`} className="text-blue-600 hover:underline">
                  {country.contactInfo.phone}
                </a>
              </p>
            )}
            {country.contactInfo.website && (
              <p className="text-gray-700">
                <span className="font-medium">Website:</span>{' '}
                <a href={country.contactInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {country.contactInfo.website}
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
