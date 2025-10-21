import { client } from '@/lib/sanity';

export async function GET() {
  try {
    const query = `*[_type == "countries"] | order(title asc) {
      _id,
      title,
      slug,
      code,
      intro {
        title,
        description
      },
      sections[] {
        _type,
        title,
        points[] {
          point,
          description
        },
        steps[] {
          step,
          description
        },
        content
      }
    }`;

    const countries = await client.fetch(query);
    
    return Response.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error);
    return Response.json({ error: 'Failed to fetch countries' }, { status: 500 });
  }
}
