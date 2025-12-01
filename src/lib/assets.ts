// Asset path utility
export const getAssetPath = (path: string): string => {
  // Use absolute paths
  return path.startsWith('/') ? path : `/${path}`;
};
