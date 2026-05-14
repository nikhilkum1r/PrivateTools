"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface AdUnitProps {
  /**
   * The AdSense Slot ID
   */
  slot?: string;
  /**
   * Ad format: 'auto', 'fluid', 'rectangle', 'autorelaxed', etc.
   */
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical" | "autorelaxed";
  /**
   * Ad Layout (for in-article)
   */
  layout?: "in-article" | string;
  /**
   * Ad Layout Key (for in-feed)
   */
  layoutKey?: string;
  /**
   * Whether the ad is responsive
   */
  responsive?: "true" | "false";
  /**
   * Optional className for the wrapper
   */
  className?: string;
  /**
   * Optional style for the wrapper
   */
  style?: React.CSSProperties;
  /**
   * Type of ad unit for labelling/analytics
   */
  type?: "content" | "sidebar" | "banner" | "faq" | "in-article" | "in-feed" | "multiplex";
}

/**
 * AdUnit component for manual Google AdSense placement.
 * Optimized for Core Web Vitals (CLS) by providing a minimum height.
 * Compliant with the "Allow ads only in specific sections" policy.
 */
export function AdUnit({
  slot = "1351344373", // Default Display Ad Slot
  format = "auto",
  layout,
  layoutKey,
  responsive = "true",
  className,
  style,
  type = "content"
}: AdUnitProps) {
  const [mounted, setMounted] = React.useState(false);
  const adRef = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("common");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Automatically set attributes based on type if not explicitly provided
  let finalSlot = slot;
  let finalFormat = format;
  let finalLayout = layout;
  let finalLayoutKey = layoutKey;

  if (type === "in-article") {
    finalSlot = "2752890109";
    finalFormat = "fluid";
    finalLayout = "in-article";
  } else if (type === "in-feed") {
    finalSlot = "6033659568";
    finalFormat = "fluid";
    finalLayoutKey = "-fb+5w+4e-db+86";
  } else if (type === "multiplex") {
    finalSlot = "1439808433";
    finalFormat = "autorelaxed";
  }

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const container = containerRef.current;
    if (!container) return;

    const adsbygoogle = (window as any).adsbygoogle || [];

    const initAd = () => {
      if (adRef.current) return;

      const ins = container.querySelector("ins");
      if (!ins) return;

      const isVisible = () => {
        const style = window.getComputedStyle(container);
        const rect = container.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.opacity !== "0" &&
          rect.width > 0 &&
          rect.height > 0
        );
      };

      if (isVisible() && container.offsetWidth >= 32) {
        try {
          // Double check adRef again inside the try block
          if (adRef.current) return;
          adsbygoogle.push({});
          adRef.current = true;
          return true;
        } catch (e) {
          console.warn("AdSense push failed:", e);
        }
      }
      return false;
    };

    // Use ResizeObserver to detect when the container actually has dimensions
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width >= 32 && !adRef.current) {
          initAd();
        }
      }
    });

    // Use IntersectionObserver for lazy loading
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !adRef.current) {
            // Check immediately, then rely on ResizeObserver if not ready
            if (!initAd()) {
              resizeObserver.observe(container);
            }
          }
        });
      },
      { rootMargin: "200px" }
    );

    intersectionObserver.observe(container);

    return () => {
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [mounted]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "ad-container my-6 w-full flex flex-col items-center justify-center overflow-hidden",
        "rounded-xl border border-border/20",
        className
      )}
      style={{ 
        minHeight: finalFormat === "fluid" ? "auto" : "280px", 
        ...style 
      }}
      aria-label={`Advertisement ${finalSlot}`}
      role="complementary"
    >
      <div className="w-full text-[9px] font-medium uppercase tracking-wider text-muted-foreground/25 py-1.5 px-4 flex items-center gap-2">
        <div className="h-px flex-grow bg-border/15" />
        <span>{t("advertisement")}</span>
        <div className="h-px flex-grow bg-border/15" />
      </div>
      
      {mounted && (
        <ins
          className="adsbygoogle"
          style={{ 
            display: "inline-block", 
            width: "100%",
            minWidth: type === "sidebar" ? "300px" : "250px",
            minHeight: type === "sidebar" ? "600px" : "280px",
            textAlign: "center",
            ...style 
          }}
          data-ad-client="ca-pub-4227099386151379"
          data-ad-slot={finalSlot}
          data-ad-format={finalFormat}
          data-ad-layout={finalLayout}
          data-ad-layout-key={finalLayoutKey}
          data-full-width-responsive={responsive}
          suppressHydrationWarning
        />
      )}
    </div>
  );
}
