import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login/'], // Just in case these are added later
    },
    sitemap: 'https://safetools.space/sitemap.xml',
  }
}
