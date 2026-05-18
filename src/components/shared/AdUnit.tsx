"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface AdUnitProps {
  /** AdSense Slot ID */
  slot?: string;
  /** Ad format */
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical" | "autorelaxed";
  /** Ad Layout (for in-article) */
  layout?: "in-article" | string;
  /** Ad Layout Key (for in-feed) */
  layoutKey?: string;
  /** Whether the ad is responsive */
  responsive?: "true" | "false";
  /** Optional className for the wrapper */
  className?: string;
  /** Optional style for the wrapper */
  style?: React.CSSProperties;
  /** Type of ad unit for preset slot selection */
  type?: "content" | "sidebar" | "banner" | "faq" | "in-article" | "in-feed" | "multiplex" | "safe" | "horizontal" | "vertical";
}

// Slot IDs by type
const SLOT_MAP: Record<string, string> = {
  content:      "9267827998",
  sidebar:      "9129290255",
  banner:       "7808469727",
  faq:          "9267827998",
  safe:         "9267827998",
  horizontal:   "7808469727",
  vertical:     "9129290255",
  "in-article": "2752890109",
  "in-feed":    "6033659568",
  multiplex:    "1439808433",
};

/**
 * AdUnit — Google AdSense ad placement component.
 *
 * Key design decisions:
 * - Uses `data-adsbygoogle-status` attribute to guard against double-push.
 * - Waits for the container to have a non-zero width before calling push().
 * - Uses ResizeObserver to detect when the container becomes visible/sized.
 * - Only pushes once per mount (adPushed ref).
 * - In dev, sets data-adtest="on" so live quota isn't consumed.
 */
export function AdUnit({
  slot,
  format = "auto",
  layout,
  layoutKey,
  responsive = "true",
  className,
  style,
  type = "content",
}: AdUnitProps) {
  const t = useTranslations("common");
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLElement | null>(null);
  const adPushed = useRef(false);

  // Resolve slot/format/layout from type presets
  const finalSlot   = slot ?? SLOT_MAP[type] ?? SLOT_MAP.content;
  const finalFormat = type === "in-article" ? "fluid"
                    : type === "in-feed"    ? "fluid"
                    : type === "multiplex"  ? "autorelaxed"
                    : format;
  const finalLayout    = layout    ?? (type === "in-article" ? "in-article" : undefined);
  const finalLayoutKey = layoutKey ?? (type === "in-feed"    ? "-fb+5w+4e-db+86" : undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const container = containerRef.current;
    if (!container) return;

    const tryPushAd = () => {
      // Guard: only push once
      if (adPushed.current) return;

      const ins = container.querySelector<HTMLElement>("ins.adsbygoogle");
      if (!ins) return;

      // Guard: AdSense already processed this slot
      if (ins.getAttribute("data-adsbygoogle-status")) {
        adPushed.current = true;
        return;
      }

      // Guard: container must have real width (prevents "no slot size" error)
      const w = container.getBoundingClientRect().width || container.offsetWidth;
      if (w < 50) return;

      try {
        // Ensure the adsbygoogle array exists so we can push to it (standard AdSense async queueing)
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
        adPushed.current = true;
      } catch (err: any) {
        // Only log non-"No slot size" errors — that one is dev-only noise
        if (!err?.message?.includes("No slot size")) {
          console.error("[AdUnit] push error:", err);
        }
      }
    };

    // ResizeObserver fires when container gets a real width (handles lazy reveal, SSR hydration)
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => tryPushAd());
      ro.observe(container);
    }

    // IntersectionObserver fires when scrolled into view
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => { if (entries[0]?.isIntersecting) tryPushAd(); },
        { rootMargin: "300px" }
      );
      io.observe(container);
    }

    // Also try immediately (for already-visible ads above the fold)
    // Small delay to let the AdSense script finish loading
    const timer = setTimeout(tryPushAd, 500);

    return () => {
      clearTimeout(timer);
      ro?.disconnect();
      io?.disconnect();
    };
  }, [mounted]);

  // Determine minimum height for CLS prevention
  const minH = finalFormat === "fluid" || type === "in-article" || type === "in-feed"
    ? "auto"
    : type === "sidebar" ? "600px" : "280px";

  return (
    <div
      ref={containerRef}
      className={cn(
        "ad-container my-6 w-full flex flex-col items-center justify-center overflow-hidden",
        "rounded-xl border border-border/20",
        className
      )}
      style={{ minHeight: minH, ...style }}
      aria-label="Advertisement"
      role="complementary"
    >
      {/* Label */}
      <div className="w-full text-[9px] font-medium uppercase tracking-wider text-muted-foreground/25 py-1.5 px-4 flex items-center gap-2">
        <div className="h-px flex-grow bg-border/15" />
        <span>{t("advertisement")}</span>
        <div className="h-px flex-grow bg-border/15" />
      </div>

      {/* Ad slot — only rendered client-side */}
      {mounted && (
        <ins
          ref={insRef as any}
          className="adsbygoogle"
          style={{
            display: "block",
            width: "100%",
            minHeight: type === "sidebar" ? "600px" : "250px",
            textAlign: "center",
          }}
          data-ad-client="ca-pub-4227099386151379"
          data-ad-slot={finalSlot}
          data-ad-format={finalFormat}
          {...(finalLayout    ? { "data-ad-layout": finalLayout }       : {})}
          {...(finalLayoutKey ? { "data-ad-layout-key": finalLayoutKey } : {})}
          data-full-width-responsive={responsive}
          {...(process.env.NODE_ENV === "development" ? { "data-adtest": "on" } : {})}
          suppressHydrationWarning
        />
      )}
    </div>
  );
}
