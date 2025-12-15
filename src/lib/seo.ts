import { Metadata } from 'next';
import { client, queries } from './sanity';

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
  robots?: {
    index?: boolean;
    follow?: boolean;
    noindex?: boolean;
    nofollow?: boolean;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    creator?: string;
    site?: string;
  };
}

interface SanitySEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImageUrl?: string;
  ogImageAlt?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  robots?: {
    index?: boolean;
    follow?: boolean;
    noindex?: boolean;
    nofollow?: boolean;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    creator?: string;
    site?: string;
  };
}

/**
 * Fetches SEO metadata from Sanity for a given page path.
 * Falls back to 'home' entry if no specific entry exists.
 * @param pagePath - The page path/slug (e.g., 'home', '/projects/my-project', '/services/animation')
 * @returns SEO data from Sanity or null if not found
 */
export async function fetchSEOFromSanity(pagePath: string): Promise<SanitySEOData | null> {
  try {
    // Try to fetch SEO for the specific page path
    let seoData = await client.fetch(queries.seoByPath(pagePath), { pagePath });
    
    // If not found and not already 'home', fallback to 'home'
    if (!seoData && pagePath !== 'home') {
      seoData = await client.fetch(queries.seoByPath('home'), { pagePath: 'home' });
    }
    
    return seoData;
  } catch (error) {
    console.error('Error fetching SEO from Sanity:', error);
    // Try fallback to 'home' on error
    if (pagePath !== 'home') {
      try {
        return await client.fetch(queries.seoByPath('home'), { pagePath: 'home' });
      } catch (fallbackError) {
        console.error('Error fetching fallback SEO from Sanity:', fallbackError);
        return null;
      }
    }
    return null;
  }
}

/**
 * Merges Sanity SEO data with hardcoded defaults.
 * Sanity data takes precedence, but missing fields use defaults.
 */
function mergeSEOData(sanityData: SanitySEOData | null, defaults: SEOProps): SEOProps {
  if (!sanityData) {
    return defaults;
  }

  return {
    title: sanityData.title || defaults.title,
    description: sanityData.description || defaults.description,
    keywords: sanityData.keywords || defaults.keywords,
    image: sanityData.ogImageUrl || defaults.image,
    url: sanityData.url || defaults.url,
    type: sanityData.type || defaults.type,
    publishedTime: sanityData.publishedTime || defaults.publishedTime,
    modifiedTime: sanityData.modifiedTime || defaults.modifiedTime,
    author: sanityData.author || defaults.author,
    section: sanityData.section || defaults.section,
    tags: sanityData.tags || defaults.tags,
    robots: sanityData.robots || defaults.robots,
    twitter: sanityData.twitter || defaults.twitter,
  };
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
  tags,
  robots,
  twitter
}: SEOProps = {}): Metadata {
  const fullTitle = title.includes('Alibi Studios') ? title : `${title} | Alibi Studios`;
  
  // Determine robots settings
  const robotsIndex = robots?.noindex ? false : (robots?.index ?? true);
  const robotsFollow = robots?.nofollow ? false : (robots?.follow ?? true);
  
  // Determine Twitter card settings
  const twitterCard = twitter?.card || 'summary_large_image';
  const twitterCreator = twitter?.creator || '@alibistudios';
  const twitterSite = twitter?.site || '@alibistudios';
  
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
      card: twitterCard,
      title: fullTitle,
      description,
      images: [image],
      creator: twitterCreator,
      site: twitterSite,
    },
    robots: {
      index: robotsIndex,
      follow: robotsFollow,
      googleBot: {
        index: robotsIndex,
        follow: robotsFollow,
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

/**
 * Helper function to generate metadata for a page using Sanity SEO data.
 * This can be used in generateMetadata functions in Next.js pages.
 * @param pagePath - The page path/slug (e.g., 'home', '/projects/my-project')
 * @param hardcodedDefaults - Optional hardcoded defaults to use when Sanity data is missing
 * @returns Metadata object for Next.js
 */
export async function generateMetadataFromSanity(
  pagePath: string,
  hardcodedDefaults?: Partial<SEOProps>
): Promise<Metadata> {
  // Default hardcoded values
  const defaults: SEOProps = {
    title: 'Alibi Studios - VFX & Creative Studio',
    description: 'A group of award-winning studios, directors, artists & technologists all under one "Virtual Roof"',
    keywords: ['VFX', 'Visual Effects', 'Animation', 'Film Production', 'Immersive Experiences', 'Creative Studio', 'Award Winning', 'Global Studios'],
    image: '/og-image.jpg',
    url: 'https://alibistudios.co',
    type: 'website',
    author: 'Alibi Studios',
    ...hardcodedDefaults,
  };

  // Fetch SEO from Sanity (with fallback to 'home')
  const sanityData = await fetchSEOFromSanity(pagePath);
  
  // Merge Sanity data with defaults
  const mergedData = mergeSEOData(sanityData, defaults);
  
  // Generate and return metadata
  return generateSEO(mergedData);
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
