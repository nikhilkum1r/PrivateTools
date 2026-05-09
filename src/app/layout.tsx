import type { Metadata, Viewport } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SafeTools.space | 150+ Privacy-First Online File Tools That Run Locally",
  description: "Convert, compress, edit, encrypt, and manage files securely in your browser. No uploads, no tracking, no server storage. Fast privacy-first online tools built for everyone.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://safetools.space"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png", rel: "android-chrome" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png", rel: "android-chrome" },
    ],
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
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "SafeTools Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "SafeTools - Free Privacy-First File Tools for PDF, Image, Video & Document Editing",
    description: "SafeTools offers free privacy-first file tools for PDF, image, video, audio, and document editing. Convert, compress, merge, resize, and optimize files directly in your browser with zero uploads or tracking.",
    images: ["/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#8b5cf6",
};

import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "sonner";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} h-full antialiased`} suppressHydrationWarning>

      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <div className="noise-overlay" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
