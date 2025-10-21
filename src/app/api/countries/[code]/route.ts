import { client } from '@/lib/sanity';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    
    const query = `*[_type == "country" && code == $code][0] {
      _id,
      name,
      code,
      slug,
      description,
      sections[] {
        _type,
        title,
        description,
        points[] {
          point,
          requirement,
          step,
          expense,
          description
        },
        content
      },
      contactInfo {
        email,
        phone,
        website
      },
      featured,
      order
    }`;

    const country = await client.fetch(query, { code });
    
    if (!country) {
      return Response.json({ error: 'Country not found' }, { status: 404 });
    }
    
    return Response.json(country);
  } catch (error) {
    console.error('Error fetching country:', error);
    return Response.json({ error: 'Failed to fetch country' }, { status: 500 });
  }
}
