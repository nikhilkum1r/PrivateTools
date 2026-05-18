import { MetadataRoute } from 'next';
import { locales } from '@/config/locales';
import { 
  SUPPORTED_CONVERSION_SLUGS, 
  SUPPORTED_COMPRESSION_FORMATS,
  SUPPORTED_VIDEO_SLUGS,
  SUPPORTED_DEVTOOLS_SLUGS
} from '@/config/seo-routes';

const baseUrl = 'https://safetools.space';

/**
 * Industry Standard: Generate separate sitemaps per locale.
 * This prevents a single massive XML file and improves crawl efficiency.
 */
export async function generateSitemaps() {
  return locales.map((locale) => ({ id: locale }));
}

export default function sitemap({ id }: { id: string }): MetadataRoute.Sitemap {
  // If id is provided, generate sitemap for that specific locale
  // Otherwise default to the first locale (Next.js handling)
  const locale = id || locales[0];
  
  const routes = [
    '',
    '/tools',
    '/image',
    '/image/compress',
    '/image/convert',
    '/image/remove-background',
    '/image/ocr',
    '/image/editor',
    '/image/colors',
    '/image/to-pptx',
    '/pdf',
    '/pdf/merge-pdf',
    '/pdf/split-pdf',
    '/pdf/compress-pdf',
    '/pdf/protect-pdf',
    '/pdf/unlock-pdf',
    '/pdf/edit-pdf',
    '/video',
    '/document',
    '/document/word-to-pdf',
    '/document/pdf-to-txt',
    '/document/master',
    '/document/text-tools/case-converter',
    '/document/text-tools/word-counter',
    '/audio',
    '/privacy',
    '/privacy/password-generator',
    '/privacy/password-checker',
    '/privacy/privacy-scanner',
    '/privacy/secure-notes',
    '/security',
    '/security/file-shredder',
    '/security/metadata-cleaner',
    '/security/steganography',
    '/security/vault',
    '/devtools',
    '/devtools/icons',
    '/devtools/data-converter',
    '/qr',
    '/about',
    '/blog',
    '/faq',
  ];

  // Add dynamic SEO routes
  for (const slug of SUPPORTED_CONVERSION_SLUGS) {
    routes.push(`/image/convert/${slug}`);
  }

  for (const fmt of SUPPORTED_COMPRESSION_FORMATS) {
    routes.push(`/image/compress/compress-${fmt}`);
  }

  for (const slug of SUPPORTED_VIDEO_SLUGS) {
    routes.push(`/video/${slug}`);
  }

  for (const slug of SUPPORTED_DEVTOOLS_SLUGS) {
    routes.push(`/devtools/${slug}`);
  }

  const getPriority = (route: string) => {
    if (route === '') return 1.0;
    if (route === '/tools') return 0.9;
    if (route.startsWith('/image/') || route.startsWith('/pdf/') || route.startsWith('/video/')) return 0.8;
    if (route.startsWith('/devtools/') || route.startsWith('/privacy/') || route.startsWith('/document/')) return 0.7;
    if (['/about', '/faq', '/blog'].includes(route)) return 0.6;
    return 0.5;
  };

  return routes.map((route) => {
    const alternatesLanguages: Record<string, string> = {};
    for (const altLocale of locales) {
      alternatesLanguages[altLocale] = `${baseUrl}/${altLocale}${route}`;
    }

    return {
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: getPriority(route),
      alternates: {
        languages: alternatesLanguages
      }
    };
  });
}
