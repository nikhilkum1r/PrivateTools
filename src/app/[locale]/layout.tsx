import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { locales, rtlLocales } from "@/config/locales";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "sonner";
import CommandPalette from "@/components/shared/CommandPalette";
import { RetentionProvider } from "@/components/shared/RetentionProvider";
import PWAPrompt from "@/components/shared/PWAPrompt";

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
  weight: ["600", "700", "800"],
  preload: true,
  fallback: ["sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
  preload: false,
  fallback: ["ui-monospace", "monospace"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: {
      default: t('seo.title') || "SafeTools  Privacy-First Online File Tools",
      template: "%s | SafeTools"
    },
    description: t('seo.description') || "Convert, compress, edit, encrypt, and manage files securely in your browser. No uploads, no tracking, no server storage.",
    manifest: "/manifest.json",
    metadataBase: new URL("https://safetools.space"),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map(l => [l, `/${l}`])),
      types: {
        'application/rss+xml': [{ url: '/rss.xml', title: 'SafeTools Journal' }],
      },
    },
    other: {
      "google-adsense-account": "ca-pub-4227099386151379"
    },
    openGraph: {
      type: "website",
      siteName: "SafeTools",
      images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/og-image.webp"],
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#818cf8" },
  ],
  width: "device-width",
  initialScale: 1,
};

import { GlobalVideoBackground } from "@/components/shared/GlobalVideoBackground";

import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();
  const isRTL = rtlLocales.includes(locale);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "SafeTools",
        "url": "https://safetools.space",
        "logo": {
          "@type": "ImageObject",
          "url": "https://safetools.space/android-chrome-512x512.webp",
          "width": 512,
          "height": 512
        },
        "sameAs": [],
        "description": "Privacy-first online file tools. Convert, compress, edit, encrypt, and manage files securely in your browser with zero uploads."
      },
      {
        "@type": "WebSite",
        "name": "SafeTools",
        "url": `https://safetools.space/${locale}`,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `https://safetools.space/${locale}/tools?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} h-full antialiased bg-background text-foreground`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-transparent" suppressHydrationWarning>
        <div className="noise-overlay" aria-hidden="true" />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg">
          Skip to content
        </a>
        {/* AdSense script — loaded after interactive to avoid blocking render */}
        <Script
          id="adsense-script"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4227099386151379"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          async
        />
        <ThemeProvider defaultTheme="dark">
          <NextIntlClientProvider messages={messages} locale={locale}>
            <GlobalVideoBackground />
            <RetentionProvider>
              <ErrorBoundary>
                <CommandPalette />
                {children}
              </ErrorBoundary>
            </RetentionProvider>
            <Toaster
              richColors
              position="bottom-right"
              toastOptions={{
                className: "!rounded-xl !border-border !shadow-lg",
              }}
            />
          </NextIntlClientProvider>
        </ThemeProvider>
        <Script
          id="org-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <PWAPrompt />
      </body>
    </html>
  );
}
