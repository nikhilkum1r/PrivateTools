import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  // Cache WASM, fonts, and static assets aggressively
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
  turbopack: {},
  allowedDevOrigins: ["10.156.92.85"],

  // ─── Image Optimization ──────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentDispositionType: "inline",
  },

  // ─── Compiler Options ────────────────────────────────────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
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
    ];
  },

  // ─── HTTP Headers ────────────────────────────────────────────────────────
  async headers() {
    return [
      // Global security + SEO headers
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
          {
            key: "X-Robots-Tag",
            value:
              "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
      // Immutable cache for hashed Next.js static assets (JS, CSS, fonts)
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
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

export default withPWA(nextConfig);
