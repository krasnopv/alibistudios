'use client';

import Link from 'next/link';

const OurServices = () => {
  return (
    <section id="our_services" className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Title */}
          <div className="mb-4">
            <h1 className="display_h1 brand-color">
              Our Services
            </h1>
          </div>

          {/* Content */}
          <div>
            <h6 className="display_h6">
              From traditional VFX to real-time and AI content & pipelines to Immersive gaming and interactive experiences, Alibi embraces the latest in virtual production stages, immersive LED volumes, forced-perspective media architecture.{' '}
              <Link href="/services" className="text-black hover:underline">
                →
              </Link>
            </h6>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurServices;
