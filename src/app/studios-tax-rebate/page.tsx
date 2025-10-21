import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function StudiosTaxRebate() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className="w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-br from-blue-900 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                UP TO 40% TAX REBATE
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Do not hesitate to contact us, we will help you with the Tax Rebate schemes.
              </p>
              <p className="text-lg md:text-xl mb-12 opacity-80">
                TAKE ADVANTAGE OF TAX RELIEFS IN FRANCE AND IN THE UK
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                  Maximize your production budget by leveraging tax relief opportunities in France and in the UK!
                </h2>
                <p className="text-lg mb-6">
                  Whether you&apos;re working on a film or a series, both countries offer attractive incentives to support international or VFX-heavy productions.
                </p>
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <h3 className="text-xl font-bold mb-2">France&apos;s TRIP</h3>
                    <p className="text-sm">Tax Rebate for International Productions</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <h3 className="text-xl font-bold mb-2">UK&apos;s AVEC</h3>
                    <p className="text-sm">Audio Visual Expenditure Credit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section className="w-full py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
                NEED SOME SUPPORT WITH TAX RELIEF SCHEMES?
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Our team at Alibi is here to help you with the tax rebate incentives from both the UK and France.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                We have worked on multiple productions which benefited from tax rebates – some examples below:
              </p>
              <p className="text-sm text-gray-600 mb-8">
                A list of projects, which benefited from the schemes, can be found on CNC&apos;s website and British Film Commission website.
              </p>
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-lg font-semibold text-blue-900 mb-4">
                  Don&apos;t hesitate to contact our team at contact@alibi.com!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* France TRIP Section */}
        <section className="w-full py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
                FRANCE: TAX REBATE FOR INTERNATIONAL PRODUCTIONS (TRIP)
              </h2>
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <p className="text-lg text-gray-700 mb-6">
                  The <strong>TRIP</strong> (Tax Rebate for International Productions) is a financial incentive granted by Film France – CNC (French National Center for Cinema, TV, and the Moving Image) to French production service companies. It offers:
                </p>
                <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-2">
                  <li><strong>30% rebate</strong> on qualifying expenditures in France</li>
                  <li><strong>40% rebate</strong> if French VFX expenses exceed €2M</li>
                </ul>
                <p className="text-lg text-gray-700 mb-6">
                  It is capped at €30 million per project, which means €100M in eligible expenditures.
                </p>
                <p className="text-lg text-gray-700 mb-8">
                  In 2022, 101 projects benefited from TRIP—don&apos;t miss this opportunity!
                </p>

                <h3 className="text-2xl font-bold mb-4 text-gray-900">Eligible expenses include:</h3>
                <ul className="list-disc list-inside text-lg text-gray-700 mb-8 space-y-2">
                  <li>Salaries and wages paid to French or EU writers, actors (up to the minimum set in collective bargaining agreements), direction and production staff (wages and incidentals) including the related social contributions;</li>
                  <li>Expenditures incurred to specialized companies for technical goods and services;</li>
                  <li>Transportation, travel and catering expenditures;</li>
                  <li>Depreciation expenses</li>
                </ul>

                <h3 className="text-2xl font-bold mb-4 text-gray-900">Qualifying requirements:</h3>
                <ul className="list-disc list-inside text-lg text-gray-700 mb-8 space-y-2">
                  <li>The project must be a fictional audiovisual work (live action or animation, feature film, short film, TV special, single or several episodes of a series, or a whole season); documentaries are not eligible;</li>
                  <li>The project must shoot at least 5 days in France for live action production;</li>
                  <li>At least of €250 000 or 50% of their total production expenses must be spent on French qualifying expenditures;</li>
                  <li>The production must pass a cultural test specific to each genre (live action or animation), including elements related to the French culture, heritage, and territory;</li>
                  <li>The production must hire a French production services company to apply.</li>
                </ul>

                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold mb-4 text-blue-900">VFX-related 10% Bonus</h3>
                  <p className="text-lg text-blue-800 mb-4">
                    Projects with over €2M in VFX-related French expenditure qualify for a 40% rebate on all eligible expenses, including live-action costs.
                  </p>
                  <p className="text-lg text-blue-800 mb-4">
                    The VFX-related expenditure must be carried out by a service provider established in France and related to digital processing of shots allowing the addition of characters, decorative elements or objects participating in the action, or modifying the rendering of the scene, or the camera point of view.
                  </p>
                  <p className="text-lg text-blue-800">
                    VFX-only projects with no filming in France are eligible for the TRIP if they respect two conditions:
                  </p>
                  <ul className="list-disc list-inside text-lg text-blue-800 mt-4 space-y-2">
                    <li>At least 15% of the shots, or on average one and a half shots per minute, are digitally processed (on the whole film);</li>
                    <li>More than 50% of the French spend is for VFX/post-production</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900">How to apply?</h3>
                <p className="text-lg text-gray-700 mb-4">
                  The TRIP is selectively granted by the CNC to French production services companies who are in charge of shooting in France in compliance with a contract entered into with a non-French production company.
                </p>
                <p className="text-lg text-gray-700 mb-4">
                  The French production services company that you choose has to be in charge of:
                </p>
                <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-2">
                  <li>supplying the artistic and technical means for making the feature film or TV project concerned;</li>
                  <li>managing the material operations for its making, and monitoring its proper execution.</li>
                </ul>
                <p className="text-lg text-gray-700 mb-6">
                  The French production services company will receive the TRIP through their yearly tax return.
                </p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>For detailed information about Tax Rebate for International Productions (TRIP), visit Film France website here.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* UK AVEC Section */}
        <section className="w-full py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
                UK: AUDIO VISUAL EXPENDITURE CREDIT (AVEC) & FILM TAX RELIEF
              </h2>
              <div className="bg-gray-50 rounded-lg p-8">
                <p className="text-lg text-gray-700 mb-6">
                  Since 2024, the UK Government has introduced the Audio Visual Expenditure Credit (AVEC), modernizing the tax relief system for film and TV productions. Further new measures confirmed by the Government will make the reliefs even more competitive, taking effect from April, 1st 2025 in respect of expenditure incurred on or after January, 1st 2025. The AVEC offers:
                </p>
                <ul className="list-disc list-inside text-lg text-gray-700 mb-8 space-y-2">
                  <li><strong>25.5% net tax relief</strong> for live-action feature films & high-end TV</li>
                  <li><strong>29.25% net tax relief</strong> for animated films, animated TV & children&apos;s TV</li>
                  <li><strong>39.75% net tax relief</strong> for UK Independent Film Tax Credit (IFTC)</li>
                  <li><strong>5% uplift for UK VFX costs from April 2025 (29.25% total)</strong></li>
                </ul>

                <h3 className="text-2xl font-bold mb-4 text-gray-900">Eligible expenses include:</h3>
                <ul className="list-disc list-inside text-lg text-gray-700 mb-8 space-y-2">
                  <li>Production crew salaries & wages</li>
                  <li>Set construction & on-location costs</li>
                  <li>Pre-production, principal photography, VFX & Post-production</li>
                  <li>UK-based goods & services</li>
                  <li>Above-the-line costs, including actors and directors, irrespective of nationality</li>
                </ul>

                <h3 className="text-2xl font-bold mb-4 text-gray-900">Transition rules to new incentives:</h3>
                <ul className="list-disc list-inside text-lg text-gray-700 mb-8 space-y-2">
                  <li>AVEC applies to accounting periods ending on or after 1 January 2024;</li>
                  <li>Productions starting before 1 April 2025 can continue under the existing relief system until 31 March 2027;</li>
                  <li>Existing tax relief ends for productions starting on or after 1 April 2025.</li>
                </ul>

                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold mb-4 text-blue-900">From April 2025:</h3>
                  <ul className="list-disc list-inside text-lg text-blue-800 space-y-2">
                    <li>UK Independent Film Tax Credit (IFTC) at 39.75%, for films under £15M</li>
                    <li>UK VFX costs receive a 5% increase in relief (29.25%) and are no longer subject to the 80% cap</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900">Qualifying requirements:</h3>
                <ul className="list-disc list-inside text-lg text-gray-700 mb-8 space-y-2">
                  <li>Theatrical release intention for films</li>
                  <li>Minimum UK expenditure: At least 10% of total core expenditure</li>
                  <li>TV minimum spend: £1M per broadcast hour</li>
                  <li>British certification: Pass the Cultural Test or qualify as an official UK co-production</li>
                  <li>80% cap remains, except for qualifying UK VFX costs (from April 2025)</li>
                </ul>

                <h3 className="text-2xl font-bold mb-4 text-gray-900">How to apply?</h3>
                <ul className="list-disc list-inside text-lg text-gray-700 mb-6 space-y-2">
                  <li>Apply for British certification via BFI.</li>
                  <li>Submit claims to HMRC.</li>
                </ul>
                <p className="text-lg text-gray-700 mb-6">
                  Turnaround time: BFI ~10-12 weeks, HMRC ~6 weeks.
                </p>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>For detailed information about UK Tax Reliefs, visit British Film Commission website here.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 bg-blue-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Ready to Maximize Your Production Budget?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Contact our team to learn more about how we can help you take advantage of tax relief opportunities in France and the UK.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:contact@alibi.com" 
                  className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
                >
                  Get in Touch
                </a>
                <a 
                  href="/contact" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors"
                >
                  Contact Form
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
