import { Metadata } from "next";
import Script from "next/script";

interface FAQItem {
  question: string;
  answer: string;
}

interface SEOStructuredDataProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  faqItems?: FAQItem[];
  breadcrumbs?: { name: string; item: string }[];
}

export default function SEOStructuredData({ name, description, url, image, faqItems, breadcrumbs }: SEOStructuredDataProps) {
  const schemas: any[] = [
    {
      "@context": "https://schema.org",
      "@type": ["WebApplication", "SoftwareApplication"],
      "name": name,
      "description": description,
      "url": url,
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "image": image || "https://safetools.space/android-chrome-512x512.webp",
      "permissions": "None (Client-side only)",
      "browserRequirements": "Requires JavaScript and WebAssembly",
      "softwareVersion": "1.0.0",
      "publisher": {
        "@type": "Organization",
        "name": "SafeTools",
        "url": "https://safetools.space",
        "logo": {
          "@type": "ImageObject",
          "url": "https://safetools.space/android-chrome-512x512.webp"
        }
      }
    }
  ];

  if (faqItems && faqItems.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    });
  }

  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb: { name: string; item: string }, i: number) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": crumb.name,
        "item": crumb.item
      }))
    });
  }

  return (
    <Script
      id={`structured-data-${(name || 'default').toLowerCase().replace(/\s+/g, '-')}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.length === 1 ? schemas[0] : { "@context": "https://schema.org", "@graph": schemas }) }}
    />
  );
}

