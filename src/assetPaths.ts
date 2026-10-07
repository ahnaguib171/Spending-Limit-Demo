/** Prefix for files in `public/assets`, honoring Vite `base` (e.g. GitHub Pages). */
function joinBasePath(segment: string): string {
  const base = import.meta.env.BASE_URL
  if (base === './' || base === '.') return `./${segment}`.replace(/\/+/g, '/')
  const normalized = base.endsWith('/') ? base : `${base}/`
  return `${normalized}${segment}`.replace(/\/+/g, '/').replace(/\/$/, '')
}

export const assetPathPrefix = joinBasePath('assets')
