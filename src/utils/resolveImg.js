export default function resolveImg(path) {
  if (!path) return null;
  // If it's already an imported module (likely a string that is not a leading /images/), return as-is
  if (typeof path !== 'string') return path;
  // If path looks like '/images/xxx.png' or 'images/xxx.png', extract filename and let Vite resolve
  const m = path.match(/([^/]+\.(png|jpe?g|webp|svg|gif))$/i);
  if (m) {
    const filename = m[1];
    try {
      // resolve relative to src/images using import.meta.url so vite includes asset
      return new URL(`../images/${filename}`, import.meta.url).href;
    } catch (e) {
      return path; // fallback to the original path
    }
  }
  return path;
}
