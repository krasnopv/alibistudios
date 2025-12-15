# Sanity SEO Integration Guide

This guide explains how to use Sanity-managed SEO metadata in your Next.js application.

## Setup

### 1. Sanity Project Setup

1. Copy `sanity-schemas/seo-schema.js` to your Sanity project's schemas directory
2. Import and add the schema to your Sanity configuration:

```javascript
// sanity.config.js or schemas/index.js
import { seoSchema } from './schemas/seo-schema.js';

export default {
  // ... other config
  schema: {
    types: [
      // ... other schemas
      seoSchema,
    ]
  }
}
```

3. Create SEO entries in Sanity Studio for each page you want to manage

### 2. Environment Variables

Ensure your `.env.local` file has the Sanity configuration:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

## Usage Examples

### Basic Usage in Page Component

```typescript
// src/app/projects/[slug]/page.tsx
import { generateSEOWithSanity } from '@/lib/sanity-seo';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const pagePath = `/projects/${slug}`;
  
  return generateSEOWithSanity(pagePath);
}

export default async function ProjectPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // ... your page content
}
```

### Usage with Overrides

You can override specific SEO fields while still using Sanity data:

```typescript
import { generateSEOWithSanity } from '@/lib/sanity-seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pagePath = `/projects/${slug}`;
  
  // Override specific fields if needed
  return generateSEOWithSanity(pagePath, {
    title: 'Custom Title Override', // This will override Sanity title
    // Other fields from Sanity will still be used
  });
}
```

### Homepage Example

```typescript
// src/app/page.tsx
import { generateSEOWithSanity } from '@/lib/sanity-seo';

export async function generateMetadata() {
  return generateSEOWithSanity('home'); // or '/' or ''
}
```

### Service Page Example

```typescript
// src/app/services/[slug]/page.tsx
import { generateSEOWithSanity } from '@/lib/sanity-seo';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const pagePath = `/services/${slug}`;
  
  return generateSEOWithSanity(pagePath);
}
```

### Using Structured Data

If you need to add structured data (JSON-LD) to your page:

```typescript
// src/app/projects/[slug]/page.tsx
import { fetchStructuredDataFromSanity } from '@/lib/sanity-seo';

export default async function ProjectPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const pagePath = `/projects/${slug}`;
  const structuredData = await fetchStructuredDataFromSanity(pagePath);

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      {/* Your page content */}
    </>
  );
}
```

### Manual Fetch (Advanced)

If you need more control, you can fetch SEO data manually:

```typescript
import { fetchSEOFromSanity } from '@/lib/sanity-seo';
import { generateSEO } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pagePath = `/projects/${slug}`;
  
  const sanityData = await fetchSEOFromSanity(pagePath);
  
  // Custom processing if needed
  if (sanityData) {
    // Process Sanity data as needed
    return generateSEO({
      title: sanityData.title,
      description: sanityData.description,
      // ... other fields
    });
  }
  
  // Fallback to defaults
  return generateSEO();
}
```

## Page Path Format

The `pagePath` parameter should match the `pagePath` field in your Sanity SEO entries:

- **Homepage**: `"home"` or `"/"` or `""`
- **Dynamic routes**: Use the actual slug value
  - Route: `/projects/[slug]` → Path: `/projects/my-project`
  - Route: `/services/[slug]` → Path: `/services/animation`
- **Static routes**: Use the full path
  - `/directors`
  - `/team`
  - `/tax-rebate`

## Fallback Behavior

If no SEO data is found in Sanity for a given path, the system will:
1. Use default values from `src/lib/seo.ts`
2. Log a warning to the console (in development)
3. Continue functioning normally with defaults

## Best Practices

1. **Create SEO entries in Sanity** before deploying pages that need custom SEO
2. **Use consistent page paths** matching your Next.js route structure
3. **Test in development** to ensure paths match correctly
4. **Set up defaults** in `src/lib/seo.ts` as fallback for pages without Sanity entries
5. **Use overrides sparingly** - prefer managing SEO in Sanity for easier content updates

## Troubleshooting

### SEO data not loading

1. Check that the `pagePath` in your code matches the `pagePath` in Sanity
2. Verify Sanity environment variables are set correctly
3. Check browser console for fetch errors
4. Verify the SEO entry exists in Sanity Studio

### Image not displaying

1. Ensure the image is uploaded to Sanity
2. Check that the image reference is correct
3. Verify image URL is being built correctly (check console logs)

### Type errors

1. Ensure TypeScript types are imported correctly
2. Check that `sanity-seo.ts` exports are being used correctly
3. Verify Next.js Metadata type compatibility

