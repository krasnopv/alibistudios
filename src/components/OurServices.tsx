'use client';

const OurServices = () => {
  return (
    <section id="our_services" className="w-full py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Title */}
          <div className="mb-4">
            <h1 style={{
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 250,
              fontStyle: 'normal',
              fontSize: '64px',
              lineHeight: '120%',
              letterSpacing: '0%',
              verticalAlign: 'middle',
              color: '#FF0066'
            }}>
              Our Services
            </h1>
          </div>

          {/* Content */}
          <div>
            <p style={{
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 250,
              fontStyle: 'normal',
              fontSize: '40px',
              lineHeight: '120%',
              letterSpacing: '0%',
              verticalAlign: 'middle',
              color: '#000000'
            }}>
              From traditional VFX to real-time and AI content & pipelines to Immersive gaming and interactive experiences, Alibi embraces the latest in virtual production stages, immersive LED volumes, forced-perspective media architecture. →
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServices;
