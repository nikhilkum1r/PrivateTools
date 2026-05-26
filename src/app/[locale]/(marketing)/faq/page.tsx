import FaqClient from "./FaqClient";
import { Metadata } from "next";
import { locales } from "@/config/locales";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
  title: "Frequently Asked Questions | SafeTools Knowledge Base",
  description: "Get answers to common questions about SafeTools. Learn about our zero-server privacy architecture, local-first processing, and technical security standards.",
  keywords: "privacy tools faq, zero server architecture, local processing help, safetools security, browser based conversion faq",
  openGraph: {
    title: "Frequently Asked Questions | SafeTools Knowledge Base",
    description: "Get answers to common questions about SafeTools. Learn about our zero-server privacy architecture, local-first processing, and technical security standards.",
    type: "website",
    url: `https://safetools.space/${locale}/faq`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | SafeTools Knowledge Base",
    description: "Get answers to common questions about SafeTools. Learn about our zero-server privacy architecture, local-first processing, and technical security standards.",
    images: ["/og-image.webp"],
  },
  alternates: { 
      canonical: `/${locale}/faq`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}/faq`]))
    },
};
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Does SafeTools ever see my files?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Never. SafeTools is built on a 'Zero-Server' architecture. All file processing happens locally in your browser's RAM using WebAssembly and JavaScript. Your files never leave your machine, are never uploaded to any server, and are automatically cleared from memory when you close the tab."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use SafeTools while offline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. SafeTools is a Progressive Web App (PWA). Once the page and its assets are loaded, you can disconnect from the internet and continue using most tools. The processing logic, WASM modules, and AI models are all cached locally in your browser."
        }
      },
      {
        "@type": "Question",
        "name": "Is SafeTools really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, SafeTools is 100% free to use with no hidden fees, no account required, and no usage limits. We sustain the service through non-intrusive advertising. There are no premium tiers that lock features behind paywalls."
        }
      },
      {
        "@type": "Question",
        "name": "What file formats does SafeTools support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SafeTools supports over 150 file formats including: Images (JPEG, PNG, WebP, AVIF, HEIC, SVG, TIFF, BMP, GIF, PSD, RAW formats), Documents (PDF, DOCX, XLSX, PPTX, CSV, TXT), Media (MP4, MOV, AVI, MP3, WAV, FLAC), and specialized formats like DDS, TGA, DICOM, and DNG."
        }
      },
      {
        "@type": "Question",
        "name": "How does PDF compression work in SafeTools?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SafeTools compresses PDFs entirely in your browser using WebAssembly-compiled qpdf and pdf-lib libraries. It recompresses embedded images, removes redundant metadata, and linearizes the document structure. You can reduce file sizes by up to 80% without noticeable quality loss. No file is ever sent to a server."
        }
      },
      {
        "@type": "Question",
        "name": "How does the AI background removal work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Background removal uses an ONNX neural network model that runs entirely in your browser via WebAssembly and the ONNX Runtime. The AI model is downloaded once and cached locally. It segments the foreground from the background using a U-Net architecture, producing professional-quality cutouts without any server processing."
        }
      },
      {
        "@type": "Question",
        "name": "What browsers are supported?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SafeTools works on all modern browsers: Google Chrome (v90+), Mozilla Firefox (v88+), Microsoft Edge (v90+), Safari (v14+), and their mobile equivalents on Android and iOS. WebAssembly support is required for some tools like PDF compression and AI-powered features."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data encrypted?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For tools like Secure Vault, SafeTools uses AES-256 GCM encryption via the Web Crypto API built into your browser. Encryption keys are derived from your password using PBKDF2 with 100,000 iterations. The encrypted data never leaves your machine — all cryptographic operations happen locally."
        }
      },
      {
        "@type": "Question",
        "name": "How does OCR (text extraction from images) work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "SafeTools uses Tesseract.js, a WebAssembly port of the industry-standard Tesseract OCR engine. It supports over 100 languages and runs entirely in your browser. The text recognition happens locally — your images are never sent to any cloud service for processing."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use SafeTools for business or commercial purposes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. SafeTools is free for personal and commercial use. Since all processing happens locally in your browser, it is particularly suitable for businesses handling sensitive documents — there are no data processing agreements needed because no data ever reaches our servers."
        }
      },
      {
        "@type": "Question",
        "name": "What is steganography and how does SafeTools implement it?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Steganography is the practice of hiding secret messages within ordinary-looking files. SafeTools implements LSB (Least Significant Bit) steganography, embedding text data into the pixel values of images. The changes are invisible to the human eye. Both encoding and decoding happen entirely in your browser."
        }
      },
      {
        "@type": "Question",
        "name": "How do I report a bug or request a feature?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can report bugs or request features through our Contact page at safetools.space/contact. You can also open issues on our GitHub repository. We actively review all submissions and prioritize based on community impact."
        }
      },
      {
        "@type": "Question",
        "name": "Does SafeTools comply with GDPR?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Since SafeTools processes all files locally in your browser and never collects, stores, or transmits your file data to any server, it inherently complies with GDPR data minimization principles. We only use cookies for essential functionality and advertising. Our full privacy policy details all data practices."
        }
      },
      {
        "@type": "Question",
        "name": "Why does SafeTools show ads?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ads are how we keep SafeTools completely free for everyone. We use Google AdSense with strict placement guidelines — ads never interfere with tool functionality, are clearly labeled, and are never placed inside the file processing areas. We chose ads over subscriptions so that privacy tools remain accessible to everyone regardless of budget."
        }
      },
      {
        "@type": "Question",
        "name": "How does the metadata cleaner remove EXIF data?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Metadata Cleaner uses the ExifReader library to parse and identify all metadata embedded in your files — including GPS coordinates, camera settings, timestamps, software information, and thumbnails. It then reconstructs the file without this metadata. All processing happens locally in your browser, ensuring your location and device information is never exposed to any server."
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <FaqClient />
    </>
  );
}
