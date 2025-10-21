'use client';

import Link from 'next/link';

const Team = () => {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Title */}
          <div className="mb-4">
            <h1 className="display_h1 brand-color">
              Our Team
            </h1>
          </div>

          {/* Content */}
          <div>
            <h6 className="display_h6">
              Alibi&apos;s multidisciplinary studios are powered by multicultural teams of seasoned industry veterans with decades of experience. Independent and adaptable, we tailor our pipeline and team to fit the unique needs of every project. Whether collaborating as partners or taking the lead on full productions, our scalable resources and deep expertise deliver exceptional results for clients worldwide.{' '}
              <Link href="/team" className="text-black hover:underline">
                →
              </Link>
            </h6>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
