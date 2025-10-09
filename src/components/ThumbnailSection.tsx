'use client';

import { useEffect, useState } from 'react';
import ServicesGrid from './ServicesGrid';
// Removed urlFor import to avoid CORS issues

interface ServiceTag {
  _id: string;
  name: string;
  color?: string;
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  url?: string;
  imageUrl: string;
  imageAlt: string;
  image: unknown;
  tags?: ServiceTag[];
  featured?: boolean;
}

interface ThumbnailSectionProps {
  schemaType?: string;
  filters?: {
    featured?: boolean;
    limit?: number;
  };
}

const ThumbnailSection = ({ schemaType = 'service', filters }: ThumbnailSectionProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiUrl = '/api/homepage-services'; // Default to services
        
        // Determine API endpoint based on schema type
        switch (schemaType) {
          case 'service':
            apiUrl = '/api/homepage-services';
            break;
          case 'project':
            apiUrl = '/api/projects';
            break;
          case 'teamMember':
            apiUrl = '/api/team';
            break;
          case 'film':
            apiUrl = '/api/films';
            break;
          case 'award':
            apiUrl = '/api/awards';
            break;
          default:
            apiUrl = '/api/homepage-services';
        }
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        console.log(`${schemaType} API response:`, data);
        
        // Apply filters if provided
        let filteredData = data;
        if (filters) {
          if (filters.featured) {
            filteredData = data.filter((item: Service) => item.featured === true);
          }
          if (filters.limit && filters.limit > 0) {
            filteredData = filteredData.slice(0, filters.limit);
          }
        }
        
        // Only set services if we have data, otherwise show empty array
        if (filteredData && filteredData.length > 0) {
          setServices(filteredData);
        } else {
          console.log(`No ${schemaType} found, hiding section`);
          setServices([]);
        }
      } catch (error) {
        console.error(`Error fetching ${schemaType}:`, error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schemaType, filters]);

  if (loading) {
    return (
      <section id="services" className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="row">
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0066]"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no services are available, don't render the section
  if (services.length === 0) {
    return null;
  }

  return (
    <section id="services" className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Title */}
            {/* <div className="text-center mb-16">
            <h6 className="display_h6">
              An elite group of award-winning artists<br />all under one &apos;Virtual Roof&apos;
            </h6>
          </div> */}

        {/* Services Grid */}
        <ServicesGrid gridData={services} schemaUrl={schemaType} />
        </div>
      </div>
    </section>
  );
};

export default ThumbnailSection;
