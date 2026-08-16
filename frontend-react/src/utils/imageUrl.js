/**
 * Formats backend media asset paths into valid proxied URL paths.
 * 
 * Handles relative paths ('faces/...', 'events/...', 'uploads/...'),
 * absolute paths ('/uploads/...'), and external URLs ('http...', 'blob:...').
 */
export const formatImageUrl = (path) => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const clean = path.startsWith('/') ? path.slice(1) : path;
  if (clean.startsWith('uploads/')) {
    return `/${clean}`;
  }
  return `/uploads/${clean}`;
};
