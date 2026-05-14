import { MetadataRoute } from 'next';
import { locales } from '@/config/locales';
import { SUPPORTED_CONVERSION_SLUGS, SUPPORTED_COMPRESSION_FORMATS } from '@/config/seo-routes';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://safetools.space';
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
    '/pdf',
    '/pdf/merge-pdf',
    '/pdf/split-pdf',
    '/pdf/compress-pdf',
    '/pdf/protect-pdf',
    '/pdf/unlock-pdf',
    '/video',
    '/document',
    '/document/word-to-pdf',
    '/document/pdf-to-txt',
    '/document/text-tools/case-converter',
    '/document/text-tools/word-counter',
    '/audio',
    '/privacy',
    '/privacy/password-generator',
    '/privacy/secure-notes',
    '/security',
    '/security/file-shredder',
    '/security/metadata-cleaner',
    '/security/steganography',
    '/security/vault',
    '/devtools',
    '/devtools/base64',
    '/devtools/icons',
    '/devtools/data-converter',
    '/qr',
    '/about',
    '/blog',
    '/faq',
  ];

  for (const slug of SUPPORTED_CONVERSION_SLUGS) {
    routes.push(`/image/convert/${slug}`);
  }

  for (const fmt of SUPPORTED_COMPRESSION_FORMATS) {
    routes.push(`/image/compress/compress-${fmt}`);
  }

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    const alternatesLanguages: Record<string, string> = {};
    for (const altLocale of locales) {
      alternatesLanguages[altLocale] = `${baseUrl}/${altLocale}${route}`;
    }

    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: alternatesLanguages
        }
      });
    }
  }

  return sitemapEntries;
}
