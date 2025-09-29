'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import VideoOverlay from '@/components/VideoOverlay';

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
  url?: string; // External URL for video
}

interface Director {
  _id: string;
  name: string;
  bio: string | unknown; // Can be string or rich text object
  trophies?: Trophy[]; // Optional - can be null or undefined
  works?: DirectorWork[]; // Optional - can be null or undefined
}

export default function Directors() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
                    <div key={director._id} className="pb-20">
                      {/* Director Name */}
                      <div className="mb-12">
                        <h2 className="heading_h1 text-center">
                          {director.name}
                        </h2>
                      </div>

                      {/* Bio Section */}
                      <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {/* Left Column - Biography */}
                        <div className="service-card">
                          <div 
                            className="text-[20px] font-[400] leading-[150%] tracking-[0%]"
                            style={{ fontFamily: 'Plus Jakarta Sans' }}
                          >
                            {renderRichText(director.bio)}
                          </div>
                        </div>

                        {/* Right Column - Trophies Grid */}
                        <div className="service-card trophies">
                          {director.trophies && director.trophies.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {director.trophies.map((trophy) => (
                                <div key={trophy._id} className="w-full">
                                  <img
                                    src={trophy.imageUrl}
                                    alt={trophy.imageAlt}
                                    className="w-full h-auto object-contain"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Director's Works */}
                      {director.works && director.works.length > 0 && (
                        <div>
                          <div className="grid md:grid-cols-2 gap-8">
                            {director.works.map((work) => (
                              <div 
                                key={work._id} 
                                className="group cursor-pointer service-card"
                                onClick={() => {
                                  console.log('Work clicked:', work);
                                  console.log('Work URL:', work.url);
                                  if (work.url) {
                                    setSelectedVideo(work.url);
                                  } else {
                                    console.log('No URL found for work:', work.title);
                                  }
                                }}
                              >
                                {/* Work Image */}
                                <div className="relative h-[372px] overflow-hidden mb-6">
                                  <img
                                    src={work.imageUrl}
                                    alt={work.imageAlt}
                                    className="w-full h-full object-cover"
                                  />
                                  {/* Play Icon - Only show if URL exists */}
                                  {work.url && (
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                                      <img
                                        src="/play.svg"
                                        alt="Play video"
                                        className="w-[43px] h-[50px]"
                                      />
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-white text-center">
                                      <div className="text-2xl font-bold mb-2">{work.title}</div>
                                      {work.subtitle && (
                                        <div className="text-sm opacity-90">{work.subtitle}</div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Work Info */}
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-[#FF0066] text-base font-[300] leading-6">
                                      {work.title}
                                    </div>
                                    {work.subtitle && (
                                      <div className="text-[#000000] text-base font-[300] leading-6 mt-1">
                                        {work.subtitle}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      
      {/* Video Overlay */}
      <VideoOverlay 
        videoUrl={selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
      />
    </div>
  );
}
