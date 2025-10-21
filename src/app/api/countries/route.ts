import { client } from '@/lib/sanity';

export async function GET() {
  try {
    const query = `*[_type == "country"] | order(order asc, name asc) {
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

    const countries = await client.fetch(query);
    
    return Response.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return Response.json({ error: 'Failed to fetch countries' }, { status: 500 });
  }
}
