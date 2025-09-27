'use client';

import { getAssetPath } from '@/lib/assets';

/**
 * Hero Component - Reusable video background component
 * 
 * @param videoSrc - Video filename (e.g., 'clip.mp4', 'services-video.mp4')
 * @param className - Additional CSS classes
 * 
 * @example
 * // Default video
 * <Hero />
 * 
 * @example
 * // Custom video
 * <Hero videoSrc="portfolio-showreel.mp4" />
 * 
 * @example
 * // With custom styling
 * <Hero 
 *   videoSrc="services-video.mp4" 
 *   className="mb-8 rounded-lg" 
 * />
 */
interface HeroProps {
  videoSrc?: string;
  className?: string;
}

const Hero = ({ 
  videoSrc = 'clip.mp4', 
  className = '' 
}: HeroProps) => {
  const handleVideoError = () => {
    console.error('Video failed to load:', videoSrc);
  };

  return (
    <section className={`relative w-screen overflow-hidden ${className}`}>
      {/* Background Video */}
      <div className="relative w-full">
        <video
          src={getAssetPath(videoSrc)}
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
      </div>
    </section>
  );
};

export default Hero;
