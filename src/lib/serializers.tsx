import React from 'react';

export const serializers = {
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => {
      // Handle cases where value might be undefined or href might be missing
      const href = value?.href || '#';
      
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