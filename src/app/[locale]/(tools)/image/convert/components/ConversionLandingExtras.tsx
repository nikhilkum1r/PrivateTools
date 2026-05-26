"use client";

import React from "react";
import { ArrowRight, FileStack } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/components/shared/FAQ";
import { SuggestedTools } from "@/components/shared/SuggestedTools";
import { AdUnit } from "@/components/shared/AdUnit";

interface ConversionLandingExtrasProps {
  t: any;
  common: any;
}

export function ConversionLandingExtras({ t, common }: ConversionLandingExtrasProps) {
  return (
    <div className="mt-40 space-y-12 pb-24">
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight font-heading">{t("landing.footer.formats")}</h2>
        <p className="text-xs font-bold tracking-wider text-muted-foreground/40">{t("landing.footer.compatibility")}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-10 rounded-3xl glass-card border border-border space-y-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">{t("landing.footer.input")}</h4>
          <div className="flex flex-wrap gap-2">
            {["JPG", "JPEG", "PNG", "WEBP", "AVIF", "HEIC", "GIF", "SVG", "TIFF", "BMP", "ICO"].map(f => (
              <span key={f} className="px-4 py-2 rounded-xl bg-secondary/20 text-[10px] font-bold tracking-wider">{f}</span>
            ))}
          </div>
        </div>
        <div className="p-10 rounded-3xl glass-card border border-border space-y-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-500">{t("landing.footer.output")}</h4>
          <div className="flex flex-wrap gap-2">
            {["JPG", "PNG", "WEBP", "AVIF", "BMP"].map(f => (
              <span key={f} className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-wider border border-emerald-500/20">{f}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
        <div className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">{t("landing.footer.freeTitle")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("landing.footer.freeDesc")}
          </p>
        </div>
        <div className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">{t("landing.footer.optimizedTitle")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("landing.footer.optimizedDesc")}
          </p>
        </div>
        <div className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">{t("landing.footer.precisionTitle")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("landing.footer.precisionDesc")}
          </p>
        </div>
      </div>

      <></>

      {/* SEO Conversion Matrix / Sitemap */}
      <div className="pt-24 border-t border-border/40">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <FileStack className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t("landing.footer.popularTitle")}</h2>
            <p className="text-sm text-muted-foreground font-medium">{t("landing.footer.popularSubtitle")}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-6">
          {["png-to-webp", "jpg-to-png", "webp-to-jpg", "heic-to-png", "avif-to-webp", "pdf-to-png", "svg-to-png", "tiff-to-pdf", "raw-to-jpg", "png-to-ico", "jpg-to-pdf", "png-to-svg"].map((slug) => (
            <Link 
              key={slug} 
              href={`/image/convert/${slug}`}
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"
            >
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
              {slug.replace(/-/g, " ")}
            </Link>
          ))}
        </div>
        
        <div className="mt-12 p-8 rounded-3xl bg-secondary/10 border border-border/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-lg font-bold tracking-tight">{t("landing.footer.moreFormats")}</h3>
            <p className="text-xs text-muted-foreground font-medium">{t("landing.footer.moreDesc")}</p>
          </div>
          <Button variant="outline" className="rounded-2xl border-border/60 font-semibold uppercase tracking-wider text-xs h-12 px-8" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {t("landing.footer.start")}
          </Button>
        </div>
      </div>

      <div className="pt-24 border-t border-border/40">
        <FAQ
          items={t.raw("landing.faq.items")}
          title={common("faq.title")}
          description={common("faq.description")}
        />
      </div>

      <SuggestedTools 
        title={common("relatedTools")}
        tools={[
          { name: common("tools.imageCompressor"), href: "/image/compress" },
          { name: common("tools.backgroundRemover"), href: "/image/remove-background" },
          { name: common("tools.pdfToImage"), href: "/pdf/to-image" },
          { name: common("tools.steganography"), href: "/security/steganography" }
        ]}
        className="pt-24 border-t border-border/40"
      />
    </div>
  );
}
