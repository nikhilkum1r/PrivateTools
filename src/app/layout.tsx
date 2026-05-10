import type { Metadata, Viewport } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Load only the weights actually used to reduce font payload
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["700", "800"],
  preload: true,
  fallback: ["sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
  preload: false, // Only used in code/dev tools, not critical path
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  title: {
    default: "SafeTools.space | 150+ Privacy-First Online File Tools",
    template: "%s | SafeTools"
  },
  description: "Convert, compress, edit, encrypt, and manage files securely in your browser. No uploads, no tracking, no server storage. Fast privacy-first online tools built for everyone.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://safetools.space"),
  authors: [{ name: "SafeTools", url: "https://safetools.space" }],
  publisher: "SafeTools",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.webp", type: "image/webp", sizes: "16x16" },
      { url: "/favicon-32x32.webp", type: "image/webp", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.webp", sizes: "180x180", type: "image/webp" },
    ],
    other: [
      { url: "/android-chrome-192x192.webp", sizes: "192x192", type: "image/webp", rel: "android-chrome" },
      { url: "/android-chrome-512x512.webp", sizes: "512x512", type: "image/webp", rel: "android-chrome" },
    ],
  },
  keywords: [
    "privacy-first tools", "local file conversion", "browser-based tools", "no upload file processing",
    "pdf tools", "image compressor", "video converter", "secure vault", "file shredder", 
    "metadata cleaner", "offline web apps", "free online tools", "safe tools", "zero server storage"
  ],
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SafeTools",
  },
  openGraph: {
    title: "SafeTools - Free Privacy-First File Tools for PDF, Image, Video & Document Editing",
    description: "SafeTools offers free privacy-first file tools for PDF, image, video, audio, and document editing. Convert, compress, merge, resize, and optimize files directly in your browser with zero uploads or tracking.",
    url: "https://safetools.space",
    siteName: "SafeTools",
    type: "website",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "SafeTools - Premium Privacy-First File Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SafeTools - Free Privacy-First File Tools for PDF, Image, Video & Document Editing",
    description: "SafeTools offers free privacy-first file tools for PDF, image, video, audio, and document editing. Convert, compress, merge, resize, and optimize files directly in your browser with zero uploads or tracking.",
    images: ["/og-image.webp"],
  },
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "ca-pub-4227099386151379",
  },
  other: {
    "google-adsense-account": "ca-pub-4227099386151379",
  },
};

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
};

import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "sonner";
import CommandPalette from "@/components/shared/CommandPalette";
import { RetentionProvider } from "@/components/shared/RetentionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} h-full antialiased`} suppressHydrationWarning>

      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4227099386151379"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <div className="noise-overlay" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <RetentionProvider>
            <CommandPalette />
            {children}
          </RetentionProvider>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
