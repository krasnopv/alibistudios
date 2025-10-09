'use client';

import { useEffect, useState } from 'react';
import ServicesGrid from './ServicesGrid';
// Removed urlFor import to avoid CORS issues

interface GridItem {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  subtitle?: string;
  url?: string;
  imageUrl: string;
  imageAlt: string;
  image?: unknown;
  tags?: Array<{ _id: string; name: string; color?: string }>;
  featured?: boolean;
  [key: string]: unknown; // Allow additional properties for different schema types
}

interface ThumbnailSectionProps {
  schemaType?: string;
  filters?: {
    featured?: boolean;
    limit?: number;
  };
}

const ThumbnailSection = ({ schemaType = 'service', filters }: ThumbnailSectionProps) => {
  const [items, setItems] = useState<GridItem[]>([]);
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
        
        if (!response.ok) {
          console.error(`API request failed: ${response.status} ${response.statusText}`);
          throw new Error(`API request failed: ${response.status}`);
        }
        
        // Handle redirects (Next.js sometimes redirects /api/endpoint to /api/endpoint/)
        if (response.redirected) {
          console.log(`API redirected from ${apiUrl} to ${response.url}`);
        }
        
        const data = await response.json();
        
        console.log(`Fetching ${schemaType} from ${apiUrl}`);
        console.log(`${schemaType} API response:`, data);
        console.log(`Data length:`, data?.length || 0);
        
        // Transform data to common format for different schema types
        let transformedData: GridItem[] = [];
        
        if (data && Array.isArray(data)) {
          transformedData = data.map((item: unknown) => {
            const itemObj = item as Record<string, unknown>;
            // Handle description field - it might be rich text array or string
            let description = '';
            if (Array.isArray(itemObj.description)) {
              // Extract text from rich text blocks
              description = itemObj.description
                .map((block: any) => {
                  if (block.children) {
                    return block.children.map((child: any) => child.text || '').join('');
                  }
                  return '';
                })
                .join(' ');
            } else if (typeof itemObj.description === 'string') {
              description = itemObj.description;
            }
            
            // Common transformation for all schema types
            const transformed: GridItem = {
              _id: String(itemObj._id || ''),
              title: String(itemObj.title || itemObj.name || itemObj.fullName || 'Untitled'),
              slug: String(itemObj.slug || itemObj._id || ''),
              description: description || String(itemObj.subtitle || itemObj.role || ''),
              imageUrl: String(itemObj.imageUrl || '/api/placeholder/207/307'),
              imageAlt: String(itemObj.imageAlt || itemObj.title || 'Image'),
              featured: Boolean(itemObj.featured),
              ...itemObj // Include all original properties
            };
            
            return transformed;
          });
        }
        
        console.log(`Transformed ${schemaType} data:`, transformedData);
        console.log(`Transformed data length:`, transformedData.length);
        
        // Apply filters if provided
        let filteredData = transformedData;
        if (filters) {
          if (filters.featured) {
            filteredData = transformedData.filter((item: GridItem) => item.featured === true);
          }
          if (filters.limit && filters.limit > 0) {
            filteredData = filteredData.slice(0, filters.limit);
          }
        }
        
        // Only set items if we have data, otherwise show empty array
        if (filteredData && filteredData.length > 0) {
          setItems(filteredData);
        } else {
          console.log(`No ${schemaType} found, hiding section`);
          setItems([]);
        }
      } catch (error) {
        console.error(`Error fetching ${schemaType}:`, error);
        setItems([]);
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

  // If no items are available, don't render the section
  if (items.length === 0) {
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

        {/* Grid */}
        <ServicesGrid gridData={items} schemaUrl={schemaType} />
        </div>
      </div>
    </section>
  );
};

export default ThumbnailSection;
