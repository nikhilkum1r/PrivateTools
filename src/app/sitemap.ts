import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://safetools.space'
  const lastModified = new Date()

  const routes = [
    '',
    '/about',
    '/privacy-policy',
    '/terms',
    '/image',
    '/image/compress',
    '/image/convert',
    '/image/editor',
    '/image/to-pptx',
    '/image/favicon',
    '/image/colors',
    '/pdf',
    '/pdf/merge',
    '/pdf/split',
    '/pdf/convert',
    '/pdf/unlock',
    '/pdf/lock',
    '/video',
    '/audio',
    '/privacy',
    '/privacy/metadata',
    '/privacy/vault',
    '/privacy/secure-note',
    '/privacy/password-checker',
    '/privacy/shredder',
    '/security',
    '/steganography',
    '/qr',
    '/devtools',
    '/bulk-rename',
    '/document',
    '/document/master',
    '/document/word-to-pdf',
    '/document/pdf-to-txt',
    '/document/text-tools',
    '/ai',
    '/image/ocr',
    '/devtools/data-converter',
    '/devtools/base64',
    '/document/text-tools/case-converter',
    '/document/text-tools/word-counter',
  ]

  // Add dynamic image compression routes
  const formats = ["png", "jpeg", "webp", "avif", "heic", "svg", "tiff", "gif"];
  formats.forEach(fmt => {
    routes.push(`/image/compress/compress-${fmt}`);
  });

  // Add top image conversion pairs
  const featured = ["png", "jpeg", "webp", "avif", "pdf", "heic"];
  for (const from of featured) {
    for (const to of featured) {
      if (from !== to) {
        routes.push(`/image/convert/${from}-to-${to}`);
      }
    }
  }

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : route.split('/').length <= 2 ? 0.9 : 0.8,
  }))
}
