import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Log dataset info for debugging
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    console.log('Fetching options from dataset:', dataset, 'project:', projectId);

    // First, check if any option documents exist at all
    const allOptions = await client.fetch(`
      *[_type == "option"] {
        _id,
        title,
        value,
        _createdAt,
        _updatedAt
      }
    `);

    console.log('Total options found:', allOptions?.length || 0);
    console.log('Raw options data:', JSON.stringify(allOptions, null, 2));

    // Also try fetching by title to see if it exists
    const contactEmailOption = await client.fetch(`
      *[_type == "option" && title == "Contact Email"][0] {
        _id,
        title,
        value
      }
    `);

    console.log('Contact Email option directly:', JSON.stringify(contactEmailOption, null, 2));

    // Convert array to object for easier lookup: { "Contact Email": "email@example.com", ... }
    const optionsMap: Record<string, string> = {};
    if (Array.isArray(allOptions) && allOptions.length > 0) {
      allOptions.forEach((option: { title: string; value: string }) => {
        if (option.title && option.value) {
          optionsMap[option.title] = option.value;
        }
      });
    }

    console.log('Options map:', JSON.stringify(optionsMap, null, 2));
    console.log('Contact Email value:', optionsMap['Contact Email']);

    // Return both the map and debug info in development
    const response: Record<string, string | { dataset: string; projectId: string; totalFound: number; contactEmailDirect: typeof contactEmailOption }> = { ...optionsMap };
    if (process.env.NODE_ENV === 'development') {
      response._debug = {
        dataset: dataset ?? '',
        projectId: projectId ?? '',
        totalFound: allOptions?.length || 0,
        contactEmailDirect: contactEmailOption,
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching options:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch options',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
