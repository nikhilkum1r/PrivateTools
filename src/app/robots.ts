import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/login/',
        '/api/',
        '/temp/',
        '/_next/',
        '/static/',
      ],
    },
    sitemap: 'https://safetools.space/sitemap.xml',
  }
}
