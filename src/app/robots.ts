import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/status/'],
    },
    sitemap: 'https://www.safetools.space/sitemap.xml',
  };
}
