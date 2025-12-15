import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateSEO({
  title = 'Alibi Studios - VFX & Creative Studio',
  description = 'A group of award-winning studios, directors, artists & technologists all under one "Virtual Roof"',
  keywords = ['VFX', 'Visual Effects', 'Animation', 'Film Production', 'Immersive Experiences', 'Creative Studio', 'Award Winning', 'Global Studios'],
  image = '/og-image.jpg',
  url = 'https://alibistudios.co',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Alibi Studios',
  section,
  tags
}: SEOProps = {}): Metadata {
  const fullTitle = title.includes('Alibi Studios') ? title : `${title} | Alibi Studios`;
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: 'Alibi Studios',
    publisher: 'Alibi Studios',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'Alibi Studios',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
      publishedTime,
      modifiedTime,
      authors: [author],
      section,
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@alibistudios',
      site: '@alibistudios',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
    icons: {
      icon: [
        { url: '/icon.png', sizes: 'any' },
      ],
      apple: [
        { url: '/icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}

export function generateStructuredData({
  type = 'Organization',
  name = 'Alibi',
  description = 'Professional web development and digital solutions',
  url = 'https://alibi.com',
  logo = 'https://alibi.com/logo.png',
  sameAs = [
    'https://twitter.com/alibi',
    'https://linkedin.com/company/alibi',
    'https://github.com/alibi'
  ],
  contactPoint = {
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
    email: 'hello@alibi.com'
  }
}: Record<string, unknown> = {}) {
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url,
    logo,
    sameAs,
    contactPoint
  };

  return baseStructuredData;
}
