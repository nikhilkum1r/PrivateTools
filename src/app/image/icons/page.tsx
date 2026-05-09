import { Metadata } from "next";
import dynamic from "next/dynamic";

const IconsLandingClient = dynamic(() => import("./IconsLandingClient"), {
  ssr: true, // We want the skeleton to render, but the interactivity to hydrate
});

export const metadata: Metadata = {
  title: "Free Icon Generator & Favicon Creator Online | SafeTools",
  description: "Create favicons, app icons, and PWA assets online for free. Generate ICO and PNG icons instantly with browser-based privacy-first processing.",
  keywords: [
    "icon generator", "favicon creator", "free favicon generator", "app icon maker", 
    "website icon generator", "PWA icon generator", "Android icon generator", 
    "iOS app icon creator", "browser favicon tool", "SVG icon generator", 
    "favicon from image", "online icon creator", "create app icons", 
    "website branding icons", "privacy first icon generator"
  ],
  openGraph: {
    title: "Free Icon Generator & Favicon Creator | SafeTools",
    description: "Professional-grade icon generation for Web, iOS, Android, and PWAs. 100% private, browser-based processing.",
    type: "website",
    url: "https://safetools.space/image/icons",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Icon Generator & Favicon Creator Online | SafeTools",
    description: "Create favicons, app icons, and PWA assets online for free. Generate ICO and PNG icons instantly with browser-based privacy-first processing.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/image/icons" },
};

const PAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "SafeTools Icon Studio",
      "description": "Professional app icon and favicon generator for web, iOS, and Android platforms.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "url": "https://safetools.space/image/icons",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://safetools.space" },
        { "@type": "ListItem", "position": 2, "name": "Image Tools", "item": "https://safetools.space/image" },
        { "@type": "ListItem", "position": 3, "name": "Icon Studio", "item": "https://safetools.space/image/icons" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is the icon generator free?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. The SafeTools Icon Studio is completely free to use with no account required." }
        },
        {
          "@type": "Question",
          "name": "Are my images uploaded to servers?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. All processing happens locally in your browser using the Canvas API and WebAssembly. Your images never leave your device." }
        },
        {
          "@type": "Question",
          "name": "Can I generate Android and iOS icons?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. The tool generates full asset bundles for both Android (including adaptive icons) and iOS (Apple Touch icons)." }
        },
        {
          "@type": "Question",
          "name": "Does the tool support SVG icons?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. SVG export and input are fully supported for scalable branding." }
        },
        {
          "@type": "Question",
          "name": "Can I generate PWA icons?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Progressive Web App icons and manifest-ready assets are included in the bundle." }
        }
      ]
    }
  ]
};

export default function IconStudioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_SCHEMA) }}
      />
      <IconsLandingClient pageSchema={PAGE_SCHEMA} />
    </>
  );
}
