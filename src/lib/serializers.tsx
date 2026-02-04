import React from 'react';

export const serializers = {
  marks: {
    // @sanity/block-content-to-react passes { children, mark } where mark contains href
    link: ({ children, mark }: { children: React.ReactNode; mark?: { href?: string } }) => {
      // Handle cases where mark might be undefined or href might be missing
      const href = mark?.href;
      
      // If no valid href, just return children without link
      if (!href || href === '#') {
        return <>{children}</>;
      }
      
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    block: ({ children }: { children: React.ReactNode }) => (
      <p className="mb-4 last:mb-0">{children}</p>
    ),
  },
};