import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

export default function Services() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className="w-[1440px] flex flex-col items-center">
        {/* Hero with different video */}
        <Hero 
          pageSlug="services" 
          className="mb-8"
        />
        
        {/* Services content */}
        <div className="w-full px-4 py-20">
          <h1 className="text-4xl font-bold text-center mb-8">Our Services</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">VFX Services</h3>
              <p className="text-gray-600">Professional visual effects for film and television.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Animation</h3>
              <p className="text-gray-600">High-quality animation services for all media.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Immersive Experiences</h3>
              <p className="text-gray-600">Cutting-edge immersive and VR experiences.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
