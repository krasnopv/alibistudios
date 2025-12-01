import { client } from '@/lib/sanity';

export async function GET() {
  try {
    const query = `*[_type == "studio"] | order(order asc, _createdAt asc) {
      _id,
      title,
      studioName,
      name,
      description[],
      image {
        asset->{
          _id,
          url
        },
        alt
      },
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      logo {
        asset->{
          _id,
          url
        },
        alt
      },
      "logoUrl": logo.asset->url,
      "logoAlt": logo.alt,
      order
    }`;

    const studios = await client.fetch(query);
    return Response.json(studios);
  } catch (error) {
    console.error('Error fetching studios:', error);
    return Response.json({ error: 'Failed to fetch studios' }, { status: 500 });
  }
}

