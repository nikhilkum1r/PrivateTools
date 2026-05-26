import type { NextConfig } from "next";
const createNextIntlPlugin = require('next-intl/plugin');

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: "/offline.html",
  },
  // Cache WASM, fonts, static assets, and AI models aggressively
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-font-assets",
        expiration: { maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-image-assets",
        expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-image",
        expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-js-assets",
        expiration: { maxEntries: 48, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-style-assets",
        expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-data",
        expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\.(?:wasm)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "wasm-assets",
        expiration: { maxEntries: 8, maxAgeSeconds: 30 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\.(?:onnx|bin|ort)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "ai-model-assets",
        expiration: { maxEntries: 5, maxAgeSeconds: 90 * 24 * 60 * 60 },
      },
    },
    {
      urlPattern: /\/api\/.+$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-routes",
        expiration: { maxEntries: 32, maxAgeSeconds: 5 * 60 },
        networkTimeoutSeconds: 5,
      },
    },
    {
      urlPattern: ({ url }: { url: URL }) => {
        const isSameOrigin = self.origin === url.origin;
        if (!isSameOrigin) return false;
        const pathname = url.pathname;
        return !pathname.startsWith("/api/");
      },
      handler: "NetworkFirst",
      options: {
        cacheName: "others",
        expiration: { maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.156.92.85"],

  // ─── Image Optimization ──────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentDispositionType: "inline",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // ─── Compiler Options ────────────────────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },


  // ─── Experimental ────────────────────────────────────────────────────────
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-accordion",
      "@base-ui/react",
      "sonner",
      "clsx",
      "tailwind-merge"
    ],
  },
  transpilePackages: ["@imgly/background-removal", "onnxruntime-web"],

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-web': require.resolve('onnxruntime-web'),
    };
    return config;
  },

  // ─── Redirects ──────────────────────────────────────────────────────────
  async redirects() {
    return [
      { source: "/pdf/compress", destination: "/pdf/compress-pdf", permanent: true },
      { source: "/pdf/merge", destination: "/pdf/merge-pdf", permanent: true },
      { source: "/pdf/split", destination: "/pdf/split-pdf", permanent: true },
      { source: "/pdf/unlock", destination: "/pdf/unlock-pdf", permanent: true },
      { source: "/pdf/lock", destination: "/pdf/protect-pdf", permanent: true },
      { source: "/privacy/secure-note", destination: "/privacy/secure-notes", permanent: true },
      { source: "/steganography", destination: "/security/steganography", permanent: true },
      { source: "/privacy/vault", destination: "/security/vault", permanent: true },
      { source: "/privacy/metadata", destination: "/security/metadata-cleaner", permanent: true },
      { source: "/privacy/shredder", destination: "/security/file-shredder", permanent: true },
      { source: "/privacy/password-checker", destination: "/privacy/password-generator", permanent: true },
      { source: "/devtools/color", destination: "/image/colors", permanent: true },
      // Deleted marketing pages → consolidated destinations
      { source: "/:locale/ads", destination: "/:locale/about", permanent: true },
      { source: "/:locale/philosophy", destination: "/:locale/about", permanent: true },
      { source: "/:locale/developers", destination: "/:locale/about", permanent: true },
      { source: "/:locale/features", destination: "/:locale/tools", permanent: true },
      { source: "/:locale/feedback", destination: "/:locale/contact", permanent: true },
      { source: "/:locale/updates", destination: "/:locale/changelog", permanent: true },
    ];
  },

  // ─── HTTP Headers ────────────────────────────────────────────────────────
  async headers() {
    return [
      // Global security + SEO headers
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          {
            key: "X-Robots-Tag",
            value:
              "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Content-Security-Policy",
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.googleadservices.com https://*.googletagservices.com https://*.google-analytics.com https://*.adtrafficquality.google https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https: https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.googleadservices.com https://*.google-analytics.com https://*.adtrafficquality.google; font-src 'self' https://fonts.gstatic.com; connect-src 'self' blob: https: https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.google-analytics.com https://*.googleadservices.com https://stats.g.doubleclick.net https://*.adtrafficquality.google https://*.projectnaptha.com https://unpkg.com https://cdn.jsdelivr.net; frame-src 'self' https://*.doubleclick.net https://*.google.com https://*.googlesyndication.com https://*.adtrafficquality.google; worker-src 'self' blob: https://unpkg.com https://cdn.jsdelivr.net; child-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;`,
          },
        ],
      },
      // Static assets cache control - disabled in development by Next.js automatically
      // but we remove the manual override to prevent browser lock-in.
      // Cache for public static files (images, icons, manifests)
      {
        source: "/:path*\\.:ext(png|jpg|jpeg|webp|avif|gif|svg|ico|woff2|woff|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      // Cache WASM blobs for 90 days
      {
        source: "/:path*\\.:ext(wasm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=7776000, immutable",
          },
        ],
      },
      // Cache manifest + site.webmanifest
      {
        source: "/:file(manifest\\.json|site\\.webmanifest)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=3600",
          },
        ],
      },
    ];
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withBundleAnalyzer(withPWA(withNextIntl(nextConfig)));
