'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';

interface Trophy {
  _id: string;
  name: string;
  year: number;
  category: string;
  imageUrl: string;
  imageAlt: string;
}

interface DirectorWork {
  _id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  year: number;
}

interface Director {
  _id: string;
  name: string;
  bio: string | unknown; // Can be string or rich text object
  trophies?: Trophy[]; // Optional - can be null or undefined
  works: DirectorWork[];
}

export default function Directors() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const response = await fetch('/api/directors');
        const data = await response.json();
        console.log('Directors fetched:', data.length, 'directors');
        console.log('Directors data:', data);
        setDirectors(data);
      } catch (error) {
        console.error('Error fetching directors:', error);
        // Fallback to mock data
        setDirectors([
          {
            _id: '1',
            name: 'John Director',
            bio: 'Award-winning director with over 20 years of experience in film and television. Known for innovative storytelling and visual excellence.',
            trophies: [
              { _id: '1', name: 'Oscar', year: 2023, category: 'Best Director', imageUrl: '/api/placeholder/60/60', imageAlt: 'Oscar' },
              { _id: '2', name: 'Emmy', year: 2022, category: 'Outstanding Director', imageUrl: '/api/placeholder/60/60', imageAlt: 'Emmy' },
              { _id: '3', name: 'Golden Globe', year: 2021, category: 'Best Director', imageUrl: '/api/placeholder/60/60', imageAlt: 'Golden Globe' }
            ],
            works: [
              { _id: '1', title: 'The Great Film', subtitle: 'Feature Film', imageUrl: '/api/placeholder/300/200', imageAlt: 'The Great Film', year: 2023 },
              { _id: '2', title: 'Epic Series', subtitle: 'TV Series', imageUrl: '/api/placeholder/300/200', imageAlt: 'Epic Series', year: 2022 },
              { _id: '3', title: 'Short Story', subtitle: 'Short Film', imageUrl: '/api/placeholder/300/200', imageAlt: 'Short Story', year: 2021 }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectors();
  }, []);

  // Function to render rich text objects with proper paragraph structure
  const renderRichText = (content: unknown): React.ReactNode => {
    if (typeof content === 'string') {
      return <p>{content}</p>;
    }
    
    if (Array.isArray(content)) {
      return content.map((block, index) => {
        if (block && typeof block === 'object' && '_type' in block && block._type === 'block' && 'children' in block && Array.isArray(block.children)) {
          const text = block.children
            .map((child: unknown) => {
              if (child && typeof child === 'object' && 'text' in child) {
                return String(child.text || '');
              }
              return '';
            })
            .join('');
          
          return <p key={index}>{text}</p>;
        }
        return null;
      });
    }
    
    if (content && typeof content === 'object' && 'children' in content && Array.isArray(content.children)) {
      return content.children.map((child: unknown, index) => {
        if (child && typeof child === 'object' && 'text' in child) {
          return <p key={index}>{String(child.text || '')}</p>;
        }
        return null;
      });
    }
    
    return <p>{String(content || '')}</p>;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className="w-full flex flex-col items-center">
        {/* Hero with directors video */}
        <Hero 
          pageSlug="directors" 
          className="mb-8"
        />
        
        {/* Directors content */}
        <section className="w-full py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="row">
              {/* Header */}
              <div className="mb-16">
                <h1 className="display_h1 text-center">
                  Directing Tomorrow&apos;s Visual World
                </h1>
              </div>

              {/* Directors List */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF0066]"></div>
                </div>
              ) : (
                <div className="space-y-20">
                  {directors.map((director) => (
                    <div key={director._id} className="border-b border-gray-200 last:border-b-0 pb-20">
                      {/* Director Name */}
                      <div className="mb-12">
                        <h2 className="heading_h1 text-center">
                          {director.name}
                        </h2>
                      </div>

                      {/* Bio Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                        {/* Left Column - Biography */}
                        <div className="lg:col-span-1">
                          <div 
                            className="text-[20px] font-[400] leading-[150%] tracking-[0%]"
                            style={{ fontFamily: 'Plus Jakarta Sans' }}
                          >
                            {renderRichText(director.bio)}
                          </div>
                        </div>

                        {/* Right Column - Trophies Grid */}
                        <div className="lg:col-span-2">
                          {director.trophies && director.trophies.length > 0 ? (
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                              {director.trophies.map((trophy) => (
                                <div key={trophy._id} className="text-center">
                                  <div className="w-16 h-16 mx-auto mb-2 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                    <img
                                      src={trophy.imageUrl}
                                      alt={trophy.imageAlt}
                                      className="w-12 h-12 object-contain"
                                    />
                                  </div>
                                  <div className="text-xs text-gray-600">{trophy.name}</div>
                                  <div className="text-xs text-gray-500">{trophy.year}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 py-8">
                              <p>No awards available</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Director's Works */}
                      <div>
                        <h3 className="text-2xl font-semibold mb-8 text-center" style={{ fontFamily: 'Plus Jakarta Sans' }}>
                          Director&apos;s Works
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {director.works.map((work) => (
                            <div key={work._id} className="group cursor-pointer">
                              <div className="relative h-64 overflow-hidden rounded-lg mb-4">
                                <img
                                  src={work.imageUrl}
                                  alt={work.imageAlt}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <span className="text-white text-lg font-semibold">View</span>
                                </div>
                              </div>
                              <div className="text-center">
                                <h4 className="text-lg font-semibold text-black mb-1">{work.title}</h4>
                                <p className="text-sm text-gray-600 mb-1">{work.subtitle}</p>
                                <p className="text-xs text-gray-500">{work.year}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
