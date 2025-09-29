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
            if (pageData.heroVideo) {
              setHeroData({
                videoUrl: pageData.heroVideo.asset?.url || '',
                posterUrl: pageData.heroVideoPoster?.asset?.url,
                title: pageData.heroTitle,
                subtitle: pageData.heroSubtitle
              });
            }
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
          
          if (pageData?.videoUrl) {
            setHeroData({
              videoUrl: pageData.videoUrl,
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

  // Use Sanity video if available, otherwise fallback to local video
  const videoSrc = heroData?.videoUrl || fallbackVideo;
  const isSanityVideo = heroData?.videoUrl;

  return (
    <section className={`relative w-screen overflow-hidden ${className}`}>
      {/* Background Video */}
      <div className="relative w-full">
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
