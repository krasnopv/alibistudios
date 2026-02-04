import { NextResponse } from 'next/server';
import { client, queries } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

// Fallback when no menu document exists in the dataset (e.g. staging before menu is set up)
const DEFAULT_MENU = {
  title: 'Menu',
  items: [
    { _key: 'home', label: 'Home', linkType: 'page' as const, page: { slug: 'home' } },
    { _key: 'services', label: 'Services', linkType: 'page' as const, page: { slug: 'services' } },
    { _key: 'contact', label: 'Contact', linkType: 'page' as const, page: { slug: 'contact' } },
  ],
};

export async function GET() {
  try {
    const menu = await client.fetch(queries.menu);
    // Use Sanity menu if present and has items; otherwise fallback so sidebar always shows something
    const payload = menu?.items?.length ? menu : DEFAULT_MENU;
    return NextResponse.json(payload);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(DEFAULT_MENU);
  }
}


