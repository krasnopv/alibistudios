'use client';

const Hero = () => {
  const handleVideoError = () => {
    console.error('Iframe video failed to load');
  };

  return (
    <section className="relative w-screen overflow-hidden">
      {/* Background Video */}
      <div className="relative w-full">
        <video
          src="/clip.mp4"
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
