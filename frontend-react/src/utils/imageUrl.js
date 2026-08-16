/**
 * Formats backend media asset paths into direct media URLs.
 * 
 * Handles relative paths ('faces/...', 'events/...', 'uploads/...'),
 * absolute paths ('/uploads/...'), and external URLs ('http...', 'blob:...').
 */
const BACKEND_BASE_URL = 'http://localhost:5001';

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

  // Strip leading slashes
  const clean = path.startsWith('/') ? path.slice(1) : path;
  if (clean.startsWith('uploads/')) {
    return `${BACKEND_BASE_URL}/${clean}`;
  }
  return `${BACKEND_BASE_URL}/uploads/${clean}`;
};
