'use client';

import { useEffect, useState } from 'react';

interface HeroVideo {
  videoUrl: string;
  posterUrl?: string;
  title?: string;
  subtitle?: string;
}

interface HeroProps {
  pageSlug?: string;
  className?: string;
}

const Hero = ({ 
  pageSlug = 'home',
  className = '' 
}: HeroProps) => {
  // Handle root slug - convert '/' to 'home'
  const actualSlug = pageSlug === '/' ? 'home' : pageSlug;
  const [heroData, setHeroData] = useState<HeroVideo | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // Try to fetch page data from Sanity
        const isLocalDev = process.env.NODE_ENV === 'development';
        
        if (isLocalDev) {
          // Use API route for local development
          const response = await fetch(`/api/pages/${actualSlug}`);
          if (response.ok) {
            const pageData = await response.json();
            // Always set heroData if we have a page, even without video
            setHeroData({
              videoUrl: pageData.videoUrl || '',
              posterUrl: pageData.posterUrl,
              title: pageData.heroTitle,
              subtitle: pageData.heroSubtitle
            });
          }
        } else {
          // For production, also use API route to avoid CORS issues
          const response = await fetch(`/api/pages/${actualSlug}`);
          if (response.ok) {
            const pageData = await response.json();
            setHeroData({
              videoUrl: pageData.videoUrl || '',
              posterUrl: pageData.posterUrl,
              title: pageData.heroTitle,
              subtitle: pageData.heroSubtitle
            });
          }
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      }
    };

    fetchHeroData();
  }, [actualSlug]);

  const handleVideoError = () => {
    console.error('Video failed to load');
  };

  // Determine what to show based on Sanity data only
  const isSanityVideo = heroData?.videoUrl;
  const hasPosterOnly = !isSanityVideo && heroData?.posterUrl;

  return (
    <section className={`relative w-screen overflow-hidden ${className}`}>
      {/* Background Video/Image */}
      <div className="relative w-full">
        {isSanityVideo ? (
          // Show Sanity video
          <video
            src={heroData.videoUrl}
            poster={heroData?.posterUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full block"
            style={{
              aspectRatio: '16/9',
              minHeight: '400px',
              margin: 0,
              padding: 0,
              objectFit: 'cover'
            }}
            onError={handleVideoError}
          />
        ) : hasPosterOnly ? (
          // Show Sanity poster image
          <img
            src={heroData.posterUrl}
            alt={heroData.title || 'Hero image'}
            className="w-full block"
            style={{
              aspectRatio: '16/9',
              minHeight: '400px',
              margin: 0,
              padding: 0,
              objectFit: 'cover'
            }}
          />
        ) : (
          // Show nothing when no Sanity media
          <div 
            className="w-full bg-transparent"
            style={{
              aspectRatio: '16/9',
              minHeight: '400px',
              margin: 0,
              padding: 0
            }}
          />
        )}
        
        {/* Hero Content Overlay */}
        {(heroData?.title || heroData?.subtitle) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="text-center text-white px-4">
              {heroData.title && (
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {heroData.title}
                </h1>
              )}
              {heroData.subtitle && (
                <p className="text-lg md:text-xl opacity-90">
                  {heroData.subtitle}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
