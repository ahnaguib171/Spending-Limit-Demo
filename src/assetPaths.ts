/** Prefix for files in `public/assets`, honoring Vite `base` (e.g. GitHub Pages). */
export const assetPathPrefix = `${import.meta.env.BASE_URL}assets`.replace(/\/+/g, '/').replace(/\/$/, '');
