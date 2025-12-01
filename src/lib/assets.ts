// Asset path utility for GitHub Pages compatibility
export const getAssetPath = (path: string): string => {
  // For GitHub Pages, use relative paths
  if (process.env.NEXT_PUBLIC_GITHUB_ACTIONS === 'true') {
    return path.startsWith('./') ? path : `./${path}`;
  }
  // For local development, use absolute paths
  return path.startsWith('/') ? path : `/${path}`;
};
