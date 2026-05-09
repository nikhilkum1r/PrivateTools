import { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "SafeTools.space | 150+ Privacy-First Online File Tools That Run Locally",
  description: "Convert, compress, edit, encrypt, and manage files securely in your browser. No uploads, no tracking, no server storage. Fast privacy-first online tools built for everyone.",
  keywords: ["privacy-first tools", "local file conversion", "secure pdf tools", "browser-based image editor", "no upload file tools", "private file processing", "wasm utilities"],
  openGraph: {
    title: "SafeTools.space | 150+ Privacy-First Online File Tools",
    description: "Convert, compress, edit, encrypt, and manage files securely in your browser. No uploads, no tracking, no server storage.",
    type: "website",
    url: "https://safetools.space",
  },
};

const HOMEPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://safetools.space/#organization",
      "name": "SafeTools",
      "url": "https://safetools.space",
      "logo": {
        "@type": "ImageObject",
        "url": "https://safetools.space/android-chrome-512x512.png"
      },
      "description": "SafeTools provides 150+ free, privacy-first browser-based file utilities for PDF, image, video, audio, and document editing.",
      "foundingDate": "2024",
      "sameAs": ["https://safetools.space"]
    },
    {
      "@type": "WebSite",
      "@id": "https://safetools.space/#website",
      "url": "https://safetools.space",
      "name": "SafeTools",
      "publisher": { "@id": "https://safetools.space/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://safetools.space/?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Are SafeTools completely free to use?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every tool on SafeTools is 100% free with no account required. There are no hidden fees, subscriptions, or usage limits." }
        },
        {
          "@type": "Question",
          "name": "Do my files get uploaded to a server?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. All processing happens locally in your browser using WebAssembly (WASM) engines. Your files never leave your device and are never uploaded to any server." }
        },
        {
          "@type": "Question",
          "name": "What file formats does SafeTools support?",
          "acceptedAnswer": { "@type": "Answer", "text": "SafeTools supports 150+ formats including PDF, DOCX, PPTX, XLSX, HEIC, WebP, AVIF, SVG, MP4, MP3, WAV, and many more. Every tool specifies its supported formats clearly." }
        },
        {
          "@type": "Question",
          "name": "Is SafeTools safe for sensitive documents?",
          "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. Because all processing is done locally with no server uploads, your sensitive documents — medical records, financial files, legal contracts — are processed with complete privacy. The Secure Vault also offers AES-256 GCM client-side encryption." }
        },
        {
          "@type": "Question",
          "name": "Do I need to install any software?",
          "acceptedAnswer": { "@type": "Answer", "text": "No installation needed. SafeTools runs entirely in modern browsers like Chrome, Firefox, Safari, and Edge. No plugins, no extensions, no downloads required." }
        }
      ]
    }
  ]
};

export default function RootPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOMEPAGE_SCHEMA) }}
      />
      <HomePageClient />
    </>
  );
}
