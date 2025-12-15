import { Metadata } from 'next';
import { generateSEO, SEOProps } from './seo';
import { client, urlFor } from './sanity';

/**
 * Interface for SEO data fetched from Sanity
 */
export interface SanitySEOData {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: {
    asset?: {
      _ref?: string;
      url?: string;
    };
    alt?: string;
  };
  ogImageUrl?: string;
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
    card?: string;
    creator?: string;
    site?: string;
  };
  structuredData?: {
    type?: string;
    name?: string;
    description?: string;
    logo?: string;
    sameAs?: string[];
  };
}

/**
 * Fetches SEO metadata from Sanity based on page path
 * @param pagePath - The page path/slug (e.g., "/projects/my-project", "home", "/services/animation")
 * @returns SEO data from Sanity or null if not found
 */
export async function fetchSEOFromSanity(pagePath: string): Promise<SanitySEOData | null> {
  try {
    // Normalize page path: remove leading/trailing slashes and handle "home" case
    const normalizedPath = pagePath === '/' || pagePath === 'home' || pagePath === '' 
      ? 'home' 
      : pagePath.replace(/^\/+|\/+$/g, '');

    const seoData = await client.fetch<SanitySEOData | null>(
      `*[_type == "seoMetadata" && pagePath == $path][0] {
        title,
        description,
        keywords,
        ogImage {
          asset->{
            _ref,
            url
          },
          alt
        },
        "ogImageUrl": ogImage.asset->url,
        url,
        type,
        publishedTime,
        modifiedTime,
        author,
        section,
        tags,
        robots {
          index,
          follow,
          noindex,
          nofollow
        },
        twitter {
          card,
          creator,
          site
        },
        structuredData {
          type,
          name,
          description,
          logo,
          sameAs
        }
      }`,
      { path: normalizedPath }
    );

    return seoData || null;
  } catch (error) {
    console.error(`Error fetching SEO data for path "${pagePath}":`, error);
    return null;
  }
}

/**
 * Converts Sanity SEO data to SEOProps format
 * @param sanityData - SEO data from Sanity
 * @returns SEOProps object compatible with generateSEO
 */
function convertSanityToSEOProps(sanityData: SanitySEOData): Partial<SEOProps> {
  const props: Partial<SEOProps> = {};

  if (sanityData.title) props.title = sanityData.title;
  if (sanityData.description) props.description = sanityData.description;
  if (sanityData.keywords) props.keywords = sanityData.keywords;
  if (sanityData.url) props.url = sanityData.url;
  if (sanityData.type) props.type = sanityData.type as 'website' | 'article' | 'profile';
  if (sanityData.publishedTime) props.publishedTime = sanityData.publishedTime;
  if (sanityData.modifiedTime) props.modifiedTime = sanityData.modifiedTime;
  if (sanityData.author) props.author = sanityData.author;
  if (sanityData.section) props.section = sanityData.section;
  if (sanityData.tags) props.tags = sanityData.tags;

  // Handle image - prioritize direct URL, fallback to urlFor builder
  if (sanityData.ogImageUrl) {
    props.image = sanityData.ogImageUrl;
  } else if (sanityData.ogImage) {
    if (sanityData.ogImage.asset?.url) {
      props.image = sanityData.ogImage.asset.url;
    } else if (sanityData.ogImage.asset?._ref) {
      // Build image URL from Sanity reference using urlFor
      try {
        props.image = urlFor(sanityData.ogImage).width(1200).height(630).url() || undefined;
      } catch (error) {
        console.warn('Error building image URL from Sanity reference:', error);
      }
    }
  }

  return props;
}

/**
 * Generates SEO metadata using Sanity data, with fallback to defaults
 * @param pagePath - The page path/slug to fetch SEO data for
 * @param overrides - Optional overrides for SEO props (takes precedence over Sanity data)
 * @returns Next.js Metadata object
 */
export async function generateSEOWithSanity(
  pagePath: string,
  overrides?: Partial<SEOProps>
): Promise<Metadata> {
  // Fetch SEO data from Sanity
  const sanityData = await fetchSEOFromSanity(pagePath);

  // Convert Sanity data to SEOProps format
  const sanityProps = sanityData ? convertSanityToSEOProps(sanityData) : {};

  // Merge: Sanity data < overrides (overrides take precedence)
  const mergedProps: Partial<SEOProps> = {
    ...sanityProps,
    ...overrides,
  };

  // Use favicon as default ogImage if no image is provided from Sanity or overrides
  if (!mergedProps.image) {
    mergedProps.image = '/icon.png';
  }

  // Generate metadata using merged props
  const metadata = generateSEO(mergedProps as SEOProps);

  // Apply robots settings from Sanity if available
  let updatedMetadata = metadata;
  if (sanityData?.robots) {
    const robots = sanityData.robots;
    updatedMetadata = {
      ...updatedMetadata,
      robots: {
        index: robots.noindex ? false : (robots.index ?? true),
        follow: robots.nofollow ? false : (robots.follow ?? true),
        googleBot: {
          index: robots.noindex ? false : (robots.index ?? true),
          follow: robots.nofollow ? false : (robots.follow ?? true),
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  }

  // Apply Twitter settings from Sanity if available
  if (sanityData?.twitter && updatedMetadata.twitter) {
    const twitterUpdates: Partial<typeof updatedMetadata.twitter> = {};
    
    if (sanityData.twitter.card) {
      twitterUpdates.card = sanityData.twitter.card as 'summary' | 'summary_large_image' | 'app' | 'player';
    }
    if (sanityData.twitter.creator) {
      twitterUpdates.creator = sanityData.twitter.creator;
    }
    if (sanityData.twitter.site) {
      twitterUpdates.site = sanityData.twitter.site;
    }

    if (Object.keys(twitterUpdates).length > 0) {
      updatedMetadata = {
        ...updatedMetadata,
        twitter: {
          ...updatedMetadata.twitter,
          ...twitterUpdates,
        },
      };
    }
  }

  return updatedMetadata;
}

/**
 * Fetches structured data from Sanity SEO entry
 * @param pagePath - The page path/slug to fetch structured data for
 * @returns Structured data object or null
 */
export async function fetchStructuredDataFromSanity(pagePath: string): Promise<Record<string, unknown> | null> {
  const sanityData = await fetchSEOFromSanity(pagePath);
  
  if (!sanityData?.structuredData) {
    return null;
  }

  const { structuredData } = sanityData;
  
  return {
    '@context': 'https://schema.org',
    '@type': structuredData.type || 'Organization',
    ...(structuredData.name && { name: structuredData.name }),
    ...(structuredData.description && { description: structuredData.description }),
    ...(structuredData.logo && { logo: structuredData.logo }),
    ...(structuredData.sameAs && structuredData.sameAs.length > 0 && { sameAs: structuredData.sameAs }),
  };
}

