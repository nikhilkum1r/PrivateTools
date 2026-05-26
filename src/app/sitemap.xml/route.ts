import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { locales } from '@/config/locales';
import { 
  SUPPORTED_CONVERSION_SLUGS, 
  SUPPORTED_COMPRESSION_FORMATS,
  SUPPORTED_VIDEO_SLUGS,
  SUPPORTED_DEVTOOLS_SLUGS
} from '@/config/seo-routes';

export const dynamic = 'force-static';

const baseUrl = 'https://www.safetools.space';

function formatDate(dateInput: Date | string) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const finalDate = isNaN(date.getTime()) ? new Date() : date;
  return finalDate.toISOString().split('.')[0] + '+00:00';
}

const getPriority = (route: string) => {
  if (route === '') return '1.00';
  if (route === '/tools') return '0.90';
  
  const segments = route.split('/').filter(Boolean);
  if (segments.length > 1) {
    return '0.51'; // All specific tools and sub-pages get 0.51
  }
  
  if (['image', 'pdf', 'video', 'audio'].includes(segments[0])) return '0.80';
  if (['devtools', 'privacy', 'document', 'security'].includes(segments[0])) return '0.70';
  if (['about', 'faq', 'blog'].includes(segments[0])) return '0.60';
  
  return '0.51';
};

export async function GET() {
  try {
    // 1. Gather all core routes
    const routes = [
      '',
      '/tools',
      '/image',
      '/image/compress',
      '/image/convert',
      '/image/remove-background',
      '/image/ocr',
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
      '/pricing',
      '/changelog',
      '/contact',
    ];

    // 2. Add dynamic SEO routes
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

    // 3. Add blog post routes dynamically
    let blogPosts: { slug: string; date: string }[] = [];
    try {
      const blogJsonPath = path.join(process.cwd(), 'src/i18n/messages/en/blog.json');
      const blogData = JSON.parse(await fs.readFile(blogJsonPath, 'utf-8'));
      blogPosts = blogData.blog.posts || [];
    } catch (err) {
      console.error('Failed to read blog posts for sitemap:', err);
    }

    for (const post of blogPosts) {
      routes.push(`/blog/${post.slug}`);
    }

    // 4. Construct XML string exactly in the requested format
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

    const currentDateFormatted = formatDate(new Date());

    let isFirst = true;

    for (const route of routes) {
      for (const locale of locales) {
        const locUrl = `${baseUrl}/${locale}${route}`;
        
        const blogPost = blogPosts.find(p => `/blog/${p.slug}` === route);
        const lastMod = blogPost ? formatDate(blogPost.date) : currentDateFormatted;
        
        const priority = getPriority(route);

        if (isFirst) {
          xml += `  <url>
<loc>${locUrl}</loc>
<lastmod>${lastMod}</lastmod>
<priority>${priority}</priority>
</url>`;
          isFirst = false;
        } else {
          xml += ` <url>
<loc>${locUrl}</loc>
<lastmod>${lastMod}</lastmod>
<priority>${priority}</priority>
</url>`;
        }
      }
    }

    xml += `\n</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
