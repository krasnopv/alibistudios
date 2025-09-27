// Asset path utility for GitHub Pages compatibility
export const getAssetPath = (path: string): string => {
  // For GitHub Pages, use relative paths
  if (process.env.NODE_ENV === 'production' && process.env.GITHUB_ACTIONS === 'true') {
    return path.startsWith('./') ? path : `./${path}`;
  }
  // For local development, use absolute paths
  return path.startsWith('/') ? path : `/${path}`;
};
