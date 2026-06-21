'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { scrollToHashFromLocation } from '@/lib/hashScroll';

/** Scrolls to `location.hash` after route changes and while async page content loads. */
export default function HashScrollHandler() {
  const pathname = usePathname();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    cleanupRef.current?.();
    cleanupRef.current = scrollToHashFromLocation();

    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [pathname]);

  useEffect(() => {
    const handleHashChange = () => {
      cleanupRef.current?.();
      cleanupRef.current = scrollToHashFromLocation({ samePage: true });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return null;
}
