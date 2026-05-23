import type { Metadata, Viewport } from "next";

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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.safetools.space";

  return {
    title: {
      default: t('seo.title') || "SafeTools  Privacy-First Online File Tools",
      template: "%s | SafeTools"
    },
    description: t('seo.description') || "Convert, compress, edit, encrypt, and manage files securely in your browser. No uploads, no tracking, no server storage.",
    manifest: "/manifest.json",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: Object.fromEntries(locales.map(l => [l, `${baseUrl}/${l}`])),
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
        "url": "https://www.safetools.space",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.safetools.space/android-chrome-512x512.webp",
          "width": 512,
          "height": 512
        },
        "sameAs": [],
        "description": "Privacy-first online file tools. Convert, compress, edit, encrypt, and manage files securely in your browser with zero uploads."
      },
      {
        "@type": "WebSite",
        "name": "SafeTools",
        "url": `https://www.safetools.space/${locale}`,
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `https://www.safetools.space/${locale}/tools?q={search_term_string}`
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
      </head>
      <body className="min-h-full flex flex-col font-sans bg-transparent" suppressHydrationWarning>
        <div className="noise-overlay" aria-hidden="true" />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg">
          Skip to content
        </a>
        {/* AdSense script — deferred until first user interaction to avoid third-party cookie penalties */}
        <script
          id="adsense-loader"
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var loaded=false;
  function loadAds(){
    if(loaded)return;loaded=true;
    var s=document.createElement('script');
    s.id='adsense-script';
    s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4227099386151379';
    s.crossOrigin='anonymous';
    s.async=true;
    document.head.appendChild(s);
    ['scroll','click','touchstart','keydown'].forEach(function(e){
      window.removeEventListener(e,loadAds,{passive:true});
    });
  }
  ['scroll','click','touchstart','keydown'].forEach(function(e){
    window.addEventListener(e,loadAds,{passive:true});
  });
})();`
          }}
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
        <script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}
