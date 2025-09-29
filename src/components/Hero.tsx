'use client';

import { useEffect, useState } from 'react';
import { getAssetPath } from '@/lib/assets';
import { client, queries } from '@/lib/sanity';

interface HeroVideo {
  videoUrl: string;
  posterUrl?: string;
  title?: string;
  subtitle?: string;
}

interface HeroProps {
  pageSlug?: string;
  fallbackVideo?: string;
  className?: string;
}

const Hero = ({ 
  pageSlug = 'home',
  fallbackVideo = 'clip.mp4',
  className = '' 
}: HeroProps) => {
  const [heroData, setHeroData] = useState<HeroVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        // Try to fetch page data from Sanity
        const isLocalDev = process.env.NODE_ENV === 'development';
        
        if (isLocalDev) {
          // Use API route for local development
          const response = await fetch(`/api/pages/${pageSlug}`);
          if (response.ok) {
            const pageData = await response.json();
            // Set heroData even if no video (to show poster or placeholder)
            setHeroData({
              videoUrl: pageData.videoUrl || '',
              posterUrl: pageData.posterUrl,
              title: pageData.heroTitle,
              subtitle: pageData.heroSubtitle
            });
          }
        } else {
          // Use direct Sanity call for production
          const pageData = await client.fetch(`*[_type == "page" && slug.current == "${pageSlug}"][0] {
            heroVideo,
            heroVideoPoster,
            heroTitle,
            heroSubtitle,
            "videoUrl": heroVideo.asset->url,
            "posterUrl": heroVideoPoster.asset->url
          }`);
          
          if (pageData) {
            // Set heroData even if no video (to show poster or placeholder)
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
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, [pageSlug]);

  const handleVideoError = () => {
    console.error('Video failed to load');
  };

  // Determine what to show based on Sanity data
  const isSanityVideo = heroData?.videoUrl;
  const hasPosterOnly = !isSanityVideo && heroData?.posterUrl;
  const hasNoSanityMedia = !isSanityVideo && !heroData?.posterUrl;
  
  // Only use fallback video if there's no Sanity data at all
  const videoSrc = isSanityVideo ? heroData.videoUrl : (hasNoSanityMedia ? fallbackVideo : null);

  return (
    <section className={`relative w-screen overflow-hidden ${className}`}>
      {/* Background Video/Image */}
      <div className="relative w-full">
        {hasPosterOnly ? (
          // Show only poster image when no video is available
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
        ) : videoSrc ? (
          // Show video (with or without poster)
          <video
            src={isSanityVideo ? videoSrc : getAssetPath(videoSrc)}
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
        ) : (
          // Show placeholder when no media is available
          <div 
            className="w-full bg-gray-200 flex items-center justify-center"
            style={{
              aspectRatio: '16/9',
              minHeight: '400px',
              margin: 0,
              padding: 0
            }}
          >
            <div className="text-gray-500 text-center">
              <div className="text-4xl mb-2">🎬</div>
              <div className="text-lg">No hero media available</div>
            </div>
          </div>
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
