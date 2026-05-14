"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Zap, ShieldCheck, Sparkles, Layers, ImageIcon, Globe, 
  ArrowRight, Percent, Plus, Gauge, X, CheckCircle2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhySafeTools } from "@/components/shared/WhySafeTools";
import { SuggestedTools } from "@/components/shared/SuggestedTools";
import { FAQ } from "@/components/shared/FAQ";

interface CompressorLandingExtrasProps {
  t: any;
  hp: any;
  t_tools: any;
}

export function CompressorLandingExtras({ t, hp, t_tools }: CompressorLandingExtrasProps) {
  return (
    <div className="space-y-40">
      {/* Features Section */}
      <div className="pt-20 space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight font-heading">{t("landing.features.title")}</h2>
          <p className="text-xs font-bold tracking-wider text-muted-foreground/40">{t("landing.features.badge")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as any[]) : []).map((f, i) => {
            const icons = [Zap, ShieldCheck, Sparkles, Layers, ImageIcon, Globe];
            const Icon = icons[i] || Zap;
            return (
              <div key={i} className="p-8 rounded-2xl bg-secondary/10 border border-border flex flex-col gap-4 hover:bg-secondary/20 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider">{f.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="pt-20 space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight font-heading">{t("landing.manifesto.title")}</h2>
          <p className="text-xs font-bold tracking-wider text-muted-foreground/40">{t("landing.manifesto.subtitle")}</p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-border bg-black/20 backdrop-blur-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-black/40">
                <th className="p-8 text-[10px] font-semibold uppercase tracking-wider">{t("landing.manifesto.table.feature")}</th>
                <th className="p-8 text-[10px] font-semibold uppercase tracking-wider italic text-muted-foreground">{t("landing.manifesto.table.standard")}</th>
                <th className="p-8 text-[10px] font-semibold uppercase tracking-wider italic text-primary">{t("landing.manifesto.table.safeTools")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {(Array.isArray(t.raw("landing.manifesto.table.rows")) ? (t.raw("landing.manifesto.table.rows") as any[]) : []).map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-8 text-xs font-bold tracking-tight">{row.f}</td>
                  <td className="p-8 text-xs font-medium text-muted-foreground/60">{row.s}</td>
                  <td className="p-8 text-xs font-bold text-primary">{row.t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* How It Works */}
      <div className="pt-20 space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight font-heading">{t("landing.how_it_works.title")}</h2>
          <p className="text-xs font-bold tracking-wider text-muted-foreground/40">{t("landing.how_it_works.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(Array.isArray(t.raw("landing.how_it_works.steps")) ? (t.raw("landing.how_it_works.steps") as any[]) : []).map((s, i) => (
            <div key={i} className="p-8 rounded-3xl bg-secondary/10 border border-border text-center space-y-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20 mx-auto text-primary font-bold text-xs">{i + 1}</div>
              <h4 className="text-sm font-semibold uppercase tracking-wider">{s.title}</h4>
              <p className="text-[10px] text-muted-foreground/60 font-medium leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>

      <WhySafeTools />
      
      <SuggestedTools 
        title={hp("featuredCats.title")}
        tools={[
          // { name: t_tools("data./image/editor.title"), href: "/image/editor" },
          { name: t_tools("data./image/remove-background.title"), href: "/image/remove-background" },
          { name: t_tools("data./image/convert.title"), href: "/image/convert" },
          { name: t_tools("data./image/metadata-cleaner.title"), href: "/image/metadata-cleaner" },
          { name: t_tools("data./privacy/qr-generator.title"), href: "/privacy/qr-generator" }
        ]} 
      />

      {/* Supported Formats Section */}
      <div className="space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight font-heading">{t("landing.formats.title")}</h2>
          <p className="text-xs font-bold tracking-wider text-muted-foreground/40">{t("landing.formats.badge")}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 rounded-3xl glass-card border border-border space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">{t("landing.formats.input")}</h4>
            <div className="flex flex-wrap gap-2">
              {["JPG", "JPEG", "PNG", "WEBP", "AVIF", "GIF", "SVG", "HEIC", "TIFF", "BMP", "ICO"].map(f => (
                <span key={f} className="px-4 py-2 rounded-xl bg-secondary/20 text-[10px] font-bold tracking-wider">{f}</span>
              ))}
            </div>
          </div>
          <div className="p-10 rounded-3xl glass-card border border-border space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-500">{t("landing.formats.output")}</h4>
            <div className="flex flex-wrap gap-2">
              {["JPG", "PNG", "WEBP", "AVIF"].map(f => (
                <span key={f} className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-wider border border-emerald-500/20">{f}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["JPG", "PNG", "WEBP", "AVIF", "GIF", "TIFF", "SVG", "HEIC", "ICO", "BMP"].map((ext) => (
            <div key={ext} className="p-6 rounded-2xl glass-card border border-border flex flex-col items-center justify-center gap-4 group hover:border-primary transition-all">
              <div className="p-3 rounded-2xl bg-secondary/30 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all font-bold text-[10px]">{ext}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <Badge className="bg-primary/10 text-primary border-primary/20 py-2 px-6 rounded-full uppercase tracking-wider text-[10px] font-bold">{t("landing.performance.badge")}</Badge>
          <h2 className="text-5xl font-bold tracking-tight font-heading leading-tight">{t("landing.performance.title")}</h2>
          <div className="space-y-6">
            {(Array.isArray(t.raw("landing.performance.items")) ? (t.raw("landing.performance.items") as Array<{ t: string; d: string }>) : []).map((item, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 font-bold text-primary text-xs">{i + 1}</div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider">{item.t}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full opacity-20" />
          <div className="glass-card rounded-3xl border border-border p-12 space-y-8 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{t("landing.performance.vitals")}</span>
              <Gauge className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="space-y-4">
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <motion.div initial={{ opacity: 0, width: 0 }} whileInView={{ opacity: 1, width: "98%" }} className="h-full bg-emerald-500" />
              </div>
              <div className="flex justify-between text-[10px] font-bold">
                <span>{t("landing.features.vitals.label")}</span>
                <span className="text-emerald-500 text-lg">98/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Local vs Server Section */}
      <div className="space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight font-heading leading-tight">{t("landing.manifesto.title")}</h2>
          <p className="text-xs font-bold tracking-wider text-muted-foreground/40">{t("landing.manifesto.badge")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-12 rounded-3xl bg-red-500/5 border border-red-500/10 space-y-6">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-red-500" />
              <h4 className="text-lg font-bold">{t("landing.manifesto.typical.title")}</h4>
            </div>
            <ul className="space-y-4">
              {(Array.isArray(t.raw("landing.manifesto.typical.items")) ? (t.raw("landing.manifesto.typical.items") as string[]) : []).map((item) => (
                <li key={item} className="flex items-center gap-3 text-xs font-medium text-red-500/60 uppercase">
                  <X className="w-4 h-4" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-12 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 space-y-6 border-2 border-emerald-500/20">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              <h4 className="text-lg font-bold">{t("landing.manifesto.safetools.title")}</h4>
            </div>
            <ul className="space-y-4">
              {(Array.isArray(t.raw("landing.manifesto.safetools.items")) ? (t.raw("landing.manifesto.safetools.items") as string[]) : []).map((item) => (
                <li key={item} className="flex items-center gap-3 text-xs font-bold text-emerald-500 uppercase">
                  <CheckCircle2 className="w-4 h-4" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Audiences Section */}
      <div className="space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight font-heading">{t("landing.audiences.title")}</h2>
          <p className="text-xs font-bold tracking-wider text-muted-foreground/40">{t("landing.audiences.badge")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Array.isArray(t.raw("landing.audiences.items")) ? (t.raw("landing.audiences.items") as Array<{ title: string; description: string }>) : []).map((u, i) => (
            <div key={i} className="p-8 rounded-2xl bg-secondary/10 border border-border space-y-4 hover:bg-secondary/20 transition-all">
              <h4 className="text-xs font-semibold uppercase tracking-wider italic text-primary">{u.title}</h4>
              <p className="text-[10px] text-muted-foreground/60 font-medium leading-relaxed uppercase">{u.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {(Array.isArray(t.raw("seo.features")) ? (t.raw("seo.features") as Array<{ title: string; desc: string }>) : []).map((f, i) => (
            <div key={i} className="space-y-6">
              <h3 className="text-xl font-bold tracking-tight">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div>
        <div className="relative overflow-hidden rounded-[64px] border border-primary/20 bg-primary/5 p-20 text-center space-y-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
          <div className="space-y-4 relative z-10">
            <Badge className="bg-primary/20 text-primary border-primary/30 py-2 px-6 rounded-full uppercase tracking-wider text-[10px] font-bold">{t("cta.badge")}</Badge>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight font-heading">{t("cta.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto italic font-medium">{t("cta.description")}</p>
          </div>
          <Button className="h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-12 gap-4 shadow-2xl shadow-primary/30 relative z-10" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Plus className="w-6 h-6" /> {t("cta.button")}
          </Button>
        </div>
      </div>

      <SuggestedTools 
        title={hp("featuredCats.title")}
        tools={[
          { name: t_tools("data./image/remove-background.title"), href: "/image/remove-background" },
          { name: t_tools("data./image/convert.title"), href: "/image/convert" },
          { name: t_tools("data./pdf/to-image.title"), href: "/pdf/to-image" },
          { name: t_tools("data./security/steganography.title"), href: "/security/steganography" }
        ]}
      />

      <div className="mt-20 border-t border-border/50">
        <FAQ
          items={Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any) : []}
          title={t("landing.faq.title")}
          description={t("landing.faq.description")}
        />
      </div>

      {/* SEO Compression Matrix */}
      <div className="pt-24 border-t border-border/40">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Percent className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t("landing.popular.title")}</h2>
            <p className="text-sm text-muted-foreground font-medium">{t("landing.popular.subtitle")}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-6">
          {["png", "jpg", "webp", "heic", "avif", "pdf", "svg", "tiff", "gif", "ico", "bmp", "raw"].map((fmt) => (
            <Link 
              key={fmt} 
              href={`/image/compress/compress-${fmt}`}
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"
            >
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
              {t("landing.popular.compress", { fmt: fmt.toUpperCase() })}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
