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

    const initAd = () => {
      if (adRef.current) return true;

      const ins = container.querySelector("ins.adsbygoogle");
      if (!ins) return false;

      // Check if the AdSense script has loaded and defined adsbygoogle
      if (typeof (window as any).adsbygoogle === "undefined") return false;

      const isVisible = () => {
        const computedStyle = window.getComputedStyle(container);
        const rect = container.getBoundingClientRect();
        return (
          computedStyle.display !== "none" &&
          computedStyle.visibility !== "hidden" &&
          computedStyle.opacity !== "0" &&
          rect.width > 0 &&
          rect.height > 0
        );
      };

      if (isVisible() && container.offsetWidth >= 32) {
        try {
          if (adRef.current) return true;
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          adRef.current = true;
          return true;
        } catch (e) {
          // AdSense push failed — will retry
        }
      }
      return false;
    };

    // Retry logic: wait for AdSense script to be ready
    let retryCount = 0;
    const maxRetries = 20;
    const retryInterval = setInterval(() => {
      retryCount++;
      if (initAd() || retryCount >= maxRetries) {
        clearInterval(retryInterval);
      }
    }, 500);

    // Also use IntersectionObserver for lazy loading
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !adRef.current) {
            initAd();
          }
        });
      },
      { rootMargin: "200px" }
    );

    intersectionObserver.observe(container);

    return () => {
      clearInterval(retryInterval);
      intersectionObserver.disconnect();
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
            display: "block", 
            width: "100%",
            minHeight: type === "sidebar" ? "600px" : "250px",
            textAlign: "center" as const,
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
