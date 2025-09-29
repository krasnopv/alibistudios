import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className="w-[1440px] flex flex-col items-center">
        {/* Hero with portfolio video */}
        <Hero 
          pageSlug="portfolio" 
          className="mb-8"
        />
        
        {/* Portfolio content */}
        <div className="w-full px-4 py-20">
          <h1 className="text-4xl font-bold text-center mb-8">Our Portfolio</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Project 1</h3>
                <p className="text-gray-600">Description of the project and our involvement.</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Project 2</h3>
                <p className="text-gray-600">Description of the project and our involvement.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
