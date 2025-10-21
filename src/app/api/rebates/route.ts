import { client } from '@/lib/sanity';

export async function GET() {
  try {
    const query = `*[_type == "rebate"] | order(order asc, _createdAt asc) {
      _id,
      title,
      slug,
      intro,
      sections[] {
        _type,
        title,
        points[] {
          point,
          description
        },
        description,
        content,
        steps[] {
          step,
          description
        }
      },
      seo,
      order
    }`;

    const rebates = await client.fetch(query);
    return Response.json(rebates);
  } catch (error) {
    console.error('Error fetching rebates:', error);
    return Response.json({ error: 'Failed to fetch rebates' }, { status: 500 });
  }
}
