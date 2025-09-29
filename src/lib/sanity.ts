import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity client configuration
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true, // Use CDN for faster loading
  apiVersion: '2023-05-03', // Use production API version
  // Use production API endpoints for server deployment
  ...(process.env.SERVER_DEPLOY === 'true' && {
    apiHost: 'https://srer6l4b.api.sanity.io',
    cdnHost: 'https://cdn.sanity.io'
  })
})

// Image URL builder for optimized images
const builder = imageUrlBuilder(client)

export const urlFor = (source: unknown) => {
  // @ts-expect-error - Sanity image builder requires specific type
  return builder.image(source)
}

// GROQ queries for fetching data
export const queries = {
  // Get all films with category data
  films: `*[_type == "film"] | order(order asc, _createdAt desc) {
    _id,
    title,
    description,
    year,
    order,
    image,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    "imageRef": image.asset->_ref,
    category->{
      _id,
      name,
      slug,
      description,
      color
    }
  }`,

  // Get all categories
  categories: `*[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    color
  }`,

  // Get categories that have films
  categoriesWithFilms: `*[_type == "category" && count(*[_type == "film" && references(^._id)]) > 0] | order(name asc) {
    _id,
    name,
    slug,
    description,
    color
  }`,

  // Get all awards
  awards: `*[_type == "award"] | order(order asc, year desc) {
    _id,
    name,
    year,
    category,
    description,
    count,
    "imageUrl": icon.asset->url,
    "imageAlt": icon.alt
  }`,

  // Get all services
  services: `*[_type == "service"] | order(order asc) {
    _id,
    title,
    description,
    url,
    image,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    tags[]->{
      _id,
      name,
      color
    },
    showOnHomepage,
    homepageOrder
  }`,

  // Get services for homepage
  homepageServices: `*[_type == "service" && defined(showOnHomepage) && showOnHomepage == true] | order(homepageOrder asc, order asc) {
    _id,
    title,
    description,
    url,
    image,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt,
    tags[]->{
      _id,
      name,
      color
    }
  }`,

  // Get all addresses
  addresses: `*[_type == "address"] | order(order asc) {
    _id,
    city,
    address,
    country
  }`,

  // Get all team members
  teamMembers: `*[_type == "teamMember"] | order(order asc) {
    _id,
    name,
    role,
    bio,
    image,
    "imageUrl": image.asset->url,
    "imageAlt": image.alt
  }`,

  // Get page by slug
  pageBySlug: (slug: string) => `*[_type == "page" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    description,
    heroVideo,
    heroVideoPoster,
    heroTitle,
    heroSubtitle,
    content,
    seoImage,
    publishedAt,
    isPublished,
    "videoUrl": heroVideo.asset->url,
    "posterUrl": heroVideoPoster.asset->url,
    "seoImageUrl": seoImage.asset->url
  }`,

      // Get all published pages
      pages: `*[_type == "page" && isPublished == true] | order(publishedAt desc) {
        _id,
        title,
        slug,
        description,
        publishedAt,
        "seoImageUrl": seoImage.asset->url
      }`,

      // Get all directors
      directors: `*[_type == "director"] | order(order asc, _createdAt asc) {
        _id,
        name,
        bio,
        trophies[]->{
          _id,
          name,
          year,
          category,
          "imageUrl": icon.asset->url,
          "imageAlt": icon.alt
        },
        works[]->{
          _id,
          title,
          subtitle,
          year,
          url,
          "imageUrl": image.asset->url,
          "imageAlt": image.alt
        }
      }`,

      // Get all team members
      team: `*[_type == "teamMember"] | order(order asc, _createdAt asc) {
        _id,
        fullName,
        role,
        industries,
        locations,
        service,
        socialMedia[]{
          platform,
          url,
          icon
        },
        bioTitle,
        bio,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      }`
    }
