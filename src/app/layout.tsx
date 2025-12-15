import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { generateMetadataFromSanity } from "@/lib/seo";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "700"],
  display: "swap",
});

// Generate metadata from Sanity, falling back to 'home' entry
export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataFromSanity('home');
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} antialiased bg-[#F8F9FA]`}
      >
        {children}
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
