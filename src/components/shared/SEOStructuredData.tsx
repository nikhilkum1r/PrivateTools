import { Metadata } from "next";
import Script from "next/script";

interface FAQItem {
  q: string;
  a: string;
}

interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

interface SEOStructuredDataProps {
  name: string;
  description: string;
  url: string;
  image?: string;
  faqItems?: FAQItem[];
  breadcrumbs?: { name: string; item: string }[];
  howToSteps?: HowToStep[];
  browserRequirements?: string;
}

export default function SEOStructuredData({ name, description, url, image, faqItems, breadcrumbs, howToSteps, browserRequirements }: SEOStructuredDataProps) {
  const schemas: any[] = [
    {
      "@context": "https://schema.org",
      "@type": ["WebApplication", "SoftwareApplication"],
      "name": name,
      "description": description,
      "url": url,
      "applicationCategory": "BrowserApplication",
      "operatingSystem": "Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "image": image || "https://safetools.space/android-chrome-512x512.webp",
      "permissions": "None (Client-side only)",
      "browserRequirements": browserRequirements || "Requires modern browser with JavaScript and WebAssembly",
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

  if (Array.isArray(faqItems) && faqItems.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.a
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

  if (howToSteps && Array.isArray(howToSteps) && howToSteps.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `How to use ${name}`,
      "description": description,
      "step": howToSteps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.name,
        "text": step.text,
        ...(step.url && { "url": step.url }),
        ...(step.image && { "image": step.image })
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

