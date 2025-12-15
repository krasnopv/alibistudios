# SEO Metadata Schema for Sanity.io

This schema provides comprehensive SEO metadata management for pages in your Sanity project.

## Schema Options

### 1. Full Schema (`seoSchema`)
- **Best for**: Complete SEO control with all metadata options
- **Features**: 
  - Complete Open Graph support
  - Twitter Card configuration
  - Robots settings
  - Structured data (JSON-LD)
  - Article-specific fields (publishedTime, modifiedTime, author, section, tags)

### 2. Simple Schema (`seoSchemaSimple`)
- **Best for**: Quick setup with essential SEO fields only
- **Features**:
  - Basic title, description, keywords
  - Open Graph image
  - Canonical URL

## Usage in Sanity Project

### Installation

1. Copy the schema file (`seo-schema.js`) to your Sanity project's schemas directory
2. Import and add to your schema configuration:

```javascript
// In your sanity.config.js or schema/index.js
import { seoSchema, seoSchemaSimple } from './schemas/seo-schema.js';

export default {
  // ... other config
  schema: {
    types: [
      // ... other schemas
      seoSchema, // or seoSchemaSimple
    ]
  }
}
```

### Content Structure

#### Full Schema Example

```javascript
{
  pagePath: "/projects/my-awesome-project",
  title: "My Awesome Project | Alibi Studios",
  description: "An award-winning VFX project showcasing cutting-edge visual effects...",
  keywords: ["VFX", "Visual Effects", "Animation", "Film Production"],
  ogImage: {
    asset: { _ref: "image-abc123..." },
    alt: "My Awesome Project - Visual Effects Showcase"
  },
  url: "https://alibistudios.co/projects/my-awesome-project",
  type: "article",
  publishedTime: "2025-01-15T10:00:00Z",
  modifiedTime: "2025-01-20T14:30:00Z",
  author: "John Director",
  section: "VFX",
  tags: ["VFX", "Award Winning", "Commercial"],
  robots: {
    index: true,
    follow: true,
    noindex: false,
    nofollow: false
  },
  twitter: {
    card: "summary_large_image",
    creator: "@alibistudios",
    site: "@alibistudios"
  },
  structuredData: {
    type: "Article",
    name: "My Awesome Project",
    description: "Award-winning VFX project...",
    logo: "https://alibistudios.co/logo.png",
    sameAs: [
      "https://twitter.com/alibistudios",
      "https://linkedin.com/company/alibistudios"
    ]
  }
}
```

#### Simple Schema Example

```javascript
{
  pagePath: "/services/animation",
  title: "Animation Services",
  description: "Professional animation services for film and commercial production",
  keywords: ["Animation", "2D", "3D", "Motion Graphics"],
  ogImage: {
    asset: { _ref: "image-xyz789..." },
    alt: "Animation Services"
  },
  url: "https://alibistudios.co/services/animation"
}
```

## Page Path Format

The `pagePath` field should match the route structure in your Next.js application:

- **Homepage**: `"home"` or `"/"`
- **Dynamic routes**: `"/projects/[slug]"` → use actual slug like `"/projects/my-project"`
- **Nested routes**: `"/services/animation"` or `"/directors/john-doe"`
- **Query params**: Exclude query parameters, use base path only

## Integration with Next.js

After setting up the schema in Sanity, use the provided utilities in this project:

1. **Fetch SEO data**: Use `fetchSEOFromSanity(pagePath)` from `src/lib/sanity-seo.ts`
2. **Generate metadata**: Use `generateSEOWithSanity(pagePath, overrides)` which automatically fetches from Sanity and merges with defaults

Example usage in a Next.js page:

```typescript
import { generateSEOWithSanity } from '@/lib/sanity-seo';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const pagePath = `/projects/${params.slug}`;
  return generateSEOWithSanity(pagePath);
}
```

## Field Descriptions

### Required Fields
- **pagePath**: Unique identifier for the page route
- **title**: Page title (will be appended with "| Alibi Studios" if not included)
- **description**: Meta description (max 160 characters recommended)
- **url**: Full canonical URL

### Optional Fields
- **keywords**: Array of SEO keywords
- **ogImage**: Social media sharing image (1200x630px recommended)
- **type**: Open Graph type (website/article/profile)
- **publishedTime/modifiedTime**: For article-type content
- **author/section/tags**: Article metadata
- **robots**: Search engine indexing control
- **twitter**: Twitter Card customization
- **structuredData**: JSON-LD structured data for rich snippets

## Best Practices

1. **Page Paths**: Use consistent path format matching your Next.js routes
2. **Descriptions**: Keep meta descriptions between 150-160 characters
3. **Titles**: Include brand name or let the system append it automatically
4. **Images**: Use high-quality images (1200x630px) for Open Graph
5. **Keywords**: Focus on 5-10 relevant keywords per page
6. **URLs**: Always use full canonical URLs including protocol and domain

## Default Values

If a field is not set in Sanity, the system will use defaults from `src/lib/seo.ts`:
- Default title: "Alibi Studios - VFX & Creative Studio"
- Default description: "A group of award-winning studios..."
- Default image: "/og-image.jpg"
- Default URL: "https://alibistudios.co"
- Default type: "website"
- Default author: "Alibi Studios"

