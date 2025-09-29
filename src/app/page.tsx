import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ThumbnailSection from '@/components/ThumbnailSection';
import OurServices from '@/components/OurServices';
import Awards from '@/components/Awards';
import Films from '@/components/Films';
import Team from '@/components/Team';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <main className="w-full flex flex-col items-center">
        <Hero pageSlug="home" />
        <ThumbnailSection />
        <OurServices />
        <Team />
        <Films />
        <Awards />
      </main>
        </div>
      );
    }
