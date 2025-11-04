import Image from 'next/image';
import Header from '@/components/Header';

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center">
      <Header />
      <main className="w-full flex flex-col items-center no-hero">
        <div className="w-full container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <Image
              src="/Layer_1.svg"
              alt="Loading"
              width={1200}
              height={200}
              className="w-full h-auto animate-pulse"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

