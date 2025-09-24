import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Awards from '@/components/Awards';
import Films from '@/components/Films';
import Team from '@/components/Team';
import Locations from '@/components/Locations';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className="w-[1440px] flex flex-col items-center">
        <Hero />
        <Services />
        <Awards />
        <Films />
        <Team />
        <Locations />
      </main>
      <Footer />
    </div>
  );
}
