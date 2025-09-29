'use client';

const Team = () => {
  return (
    <section className="w-full py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="row">
          {/* Title */}
          <div className="mb-4">
            <h1 className="display_h1">
              Our Team
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
              Alibi&apos;s multidisciplinary studios are powered by multicultural teams of seasoned industry veterans with decades of experience. Independent and adaptable, we tailor our pipeline and team to fit the unique needs of every project. Whether collaborating as partners or taking the lead on full productions, our scalable resources and deep expertise deliver exceptional results for clients worldwide. →
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;
