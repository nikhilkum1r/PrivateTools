import { Metadata } from "next";
import Script from "next/script";

interface SEOStructuredDataProps {
  name: string;
  description: string;
  url: string;
  image?: string;
}

export default function SEOStructuredData({ name, description, url, image }: SEOStructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
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
    "image": image || "https://safetools.space/android-chrome-512x512.png",
    "permissions": "None (Client-side only)",
    "browserRequirements": "Requires JavaScript and WebAssembly",
    "softwareVersion": "1.0.0"
  };

  return (
    <Script
      id={`structured-data-${name.toLowerCase().replace(/\s+/g, '-')}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
