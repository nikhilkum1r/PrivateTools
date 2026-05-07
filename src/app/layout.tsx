import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SafeTools — Free Privacy-First File Tools",
  description: "150+ free browser-based file tools for PDF, image, video & audio. Zero uploads, zero tracking — your files never leave your device.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://safetools.space"),
  alternates: {
    canonical: "https://safetools.space",
  },
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
    title: "SafeTools — Free Privacy-First File Tools",
    description: "150+ free browser-based file tools for PDF, image, video & audio. Zero uploads, zero tracking — your files never leave your device.",
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
    title: "SafeTools — Free Privacy-First File Tools",
    description: "150+ free browser-based file tools for PDF, image, video & audio. Zero uploads, zero tracking.",
    images: ["/android-chrome-512x512.png"],
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
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VWQJXZLMTH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VWQJXZLMTH');
          `}
        </Script>

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
