import React from 'react';

export const serializers = {
  marks: {
    link: ({ children, mark }: { children: React.ReactNode; mark: { href: string } }) => {
      const { href } = mark;
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