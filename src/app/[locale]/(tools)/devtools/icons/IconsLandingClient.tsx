"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FAQ } from "@/components/shared/FAQ";
import { SuggestedTools } from "@/components/shared/SuggestedTools";
import { AdUnit } from "@/components/shared/AdUnit";
import { 
  Sparkles,
  ShieldCheck,
  Zap,
  Globe,
  Smartphone,
  Layout,
  Layers,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Shield,
  MonitorSmartphone,
  Cpu,
  Monitor
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const IconStudioClient = dynamic(() => import("./IconStudioClient"), {
  ssr: false,
});

import { useTranslations } from "next-intl";

interface IconsLandingClientProps {
  pageSchema: any;
}

export default function IconsLandingClient({ pageSchema }: IconsLandingClientProps) {
  const t = useTranslations("iconStudio");
  const common = useTranslations("common");

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      
      <main id="main-content" className="flex-grow">
        {/* PREMIUM VIBRANT BACKGROUND BLOBS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-500/20 blur-[100px] rounded-full animate-bounce-slow" />
          <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] bg-purple-500/10 blur-[80px] rounded-full" />
        </div>

        {/* PREMIUM MINIMAL HERO */}
        <section className="pt-32 pb-16 px-4 container mx-auto text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary-muted)_0%,_transparent_70%)] opacity-20 pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {t("landing.hero.badge")}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase leading-[0.85]">
              {t.rich("landing.hero.title", {
                br: (chunks: any) => <br />,
                highlight: (chunks: any) => <span className="text-primary">{chunks}</span>
              })}
            </h1>
            
            <p className="text-xl font-bold text-muted-foreground/60 max-w-2xl mx-auto italic leading-relaxed">
              {t.rich("landing.hero.description", {
                br: (chunks: any) => <br />,
                highlight: (chunks: any) => <span className="text-primary/80">{chunks}</span>
              })}
            </p>
            <div className="pt-8">
              <AdUnit slot="7890123456" className="max-w-2xl mx-auto" />
            </div>
          </motion.div>
        </section>

        {/* THE TOOL - CENTERED & PROMINENT */}
        <section id="studio" className="pb-32">
          <div className="container mx-auto">
             <IconStudioClient hideNavbar={true} />
          </div>
        </section>

        {/* INTRODUCTION SECTION */}
        <section className="py-24 px-4 border-y border-border bg-card/30">
          <div className="container mx-auto max-w-4xl space-y-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("landing.intro.title")}</h2>
              <p className="text-lg font-medium text-muted-foreground/80 italic leading-relaxed">
                {t("landing.intro.description")}
              </p>
              <p className="text-sm font-bold text-primary/60 uppercase tracking-wider">
                {t("landing.intro.security")}
              </p>
            </motion.div>
            <AdUnit slot="8901234567" className="mt-12" />
          </div>
        </section>

        {/* DETAILED FEATURES GRID */}
        <section className="py-24 px-4 container mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {(Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as any[]) : []).map((feature, i) => {
              const icons = [Globe, Smartphone, Rocket, Shield];
              const Icon = icons[i % icons.length];
              return (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 rounded-[3rem] bg-card border border-border space-y-6 group hover:border-primary/30 transition-all shadow-xl"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground/70 font-medium leading-relaxed">
                    {feature.content}
                  </p>
                  <ul className="grid grid-cols-2 gap-3 pt-4">
                    {feature.list.map((item: string) => (
                      <li key={item} className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* TECHNICAL SPECIFICATIONS */}
        <section className="py-24 bg-card/50 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                 <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("landing.specs.title")}</h2>
                 <p className="text-lg font-medium text-muted-foreground/70 italic leading-relaxed">
                    {t("landing.specs.description")}
                 </p>
                 <div className="flex flex-wrap gap-2">
                    {[16, 32, 48, 64, 96, 128, 192, 256, 512].map(s => (
                      <Badge key={s} variant="outline" className="px-4 py-1.5 rounded-xl border-border bg-background text-xs font-mono font-bold">{s}x{s}</Badge>
                    ))}
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 rounded-3xl bg-background border border-border space-y-4 shadow-xl">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">{t("landing.specs.inputFormats")}</h4>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9px] font-semibold uppercase tracking-wider opacity-60">
                    <li>.PNG / .JPG</li>
                    <li>.WEBP / .SVG</li>
                    <li>.AVIF / .GIF</li>
                    <li>.BMP / .TIFF</li>
                    <li>.ICO / .EPS</li>
                    <li>.AI / .PDF</li>
                  </ul>
                </div>
                <div className="p-8 rounded-3xl bg-background border border-border space-y-4 shadow-xl">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-500">{t("landing.specs.outputAssets")}</h4>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9px] font-semibold uppercase tracking-wider opacity-60">
                    <li>.ICO / .PNG</li>
                    <li>.SVG / .WEBP</li>
                    <li>.JPG / .JPEG</li>
                    <li>.GIF / .BMP</li>
                    <li>.TIFF / .TIF</li>
                    <li>.AVIF / .ICNS</li>
                    <li>.XPM / .EPS</li>
                    <li>.AI / .PDF</li>
                    <li>.CDR / .DXF</li>
                    <li>.XML / .PSD</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRANDING VALUE SECTION */}
        <section className="py-24 px-4 container mx-auto text-center max-w-4xl space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("landing.seo_value.title")}</h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
          </div>
          <p className="text-xl font-bold text-muted-foreground/60 italic leading-relaxed">
            {t("landing.seo_value.description")}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
            {(Array.isArray(t.raw("landing.seo_value.items")) ? (t.raw("landing.seo_value.items") as any[]) : []).map((item, i) => {
              const icons = [ShieldCheck, Layers, Zap, Globe];
              const Icon = icons[i % icons.length];
              return (
                <div key={item.l} className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center border border-border mx-auto">
                     <Icon className="w-6 h-6 text-primary/60" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{item.l}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* COMPREHENSIVE ICON FORMATS GUIDE (SEO POWERHOUSE) */}
        <section className="py-32 px-4 container mx-auto">
          <div className="max-w-5xl mx-auto space-y-20">
            <div className="text-center space-y-6">
              <Badge variant="outline" className="px-6 py-2 rounded-full border-primary/20 text-primary font-bold tracking-wider italic bg-primary/5">{t("landing.tech_guide.badge")}</Badge>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                {t.rich("landing.tech_guide.title", { br: (chunks: any) => <br /> })}
              </h2>
              <p className="text-xl font-bold text-muted-foreground/60 max-w-2xl mx-auto">
                {t("landing.tech_guide.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* BROWSER FAVICONS */}
              <div className="p-10 rounded-[3rem] bg-card/50 border border-border space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Globe className="w-24 h-24 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight">{t("landing.tech_guide.browser.title")}</h3>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t("landing.tech_guide.browser.subtitle")}</p>
                </div>
                <div className="space-y-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                        {(Array.isArray(t.raw("landing.tech_guide.browser.headers")) ? (t.raw("landing.tech_guide.browser.headers") as string[]) : []).map(h => (
                          <th key={h} className="pb-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-[11px] font-bold">
                      {(Array.isArray(t.raw("landing.tech_guide.browser.rows")) ? (t.raw("landing.tech_guide.browser.rows") as any[]) : []).map((row, i) => (
                        <tr key={i} className="border-b border-border/20 last:border-0">
                          <td className="py-4 text-foreground">{row.f}</td>
                          <td className="py-4 text-primary/80 font-mono">{row.e}</td>
                          <td className="py-4 text-muted-foreground/60">{row.u}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MOBILE APP ICONS */}
              <div className="p-10 rounded-[3rem] bg-card/50 border border-border space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Smartphone className="w-24 h-24 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight">{t("landing.tech_guide.mobile.title")}</h3>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-500">{t("landing.tech_guide.mobile.subtitle")}</p>
                </div>
                <div className="space-y-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                        {(Array.isArray(t.raw("landing.tech_guide.mobile.headers")) ? (t.raw("landing.tech_guide.mobile.headers") as string[]) : []).map(h => (
                          <th key={h} className="pb-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-[11px] font-bold">
                      {(Array.isArray(t.raw("landing.tech_guide.mobile.rows")) ? (t.raw("landing.tech_guide.mobile.rows") as any[]) : []).map((row, i) => (
                        <tr key={i} className="border-b border-border/20 last:border-0">
                          <td className="py-4 text-foreground">{row.t}</td>
                          <td className="py-4 text-blue-500/80 font-mono">{row.d}</td>
                          <td className="py-4 text-muted-foreground/60">{row.p}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* BEST FORMAT RECOMMENDATIONS */}
            <div className="p-12 rounded-[4rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 shadow-3xl">
              <div className="grid md:grid-cols-3 gap-12">
                <div className="space-y-4">
                   <h4 className="text-lg font-bold tracking-tight">{t("landing.tech_guide.recs.title")}</h4>
                   <p className="text-sm font-medium text-muted-foreground/60 leading-relaxed">
                      {t("landing.tech_guide.recs.description")}
                   </p>
                </div>
                <div className="md:col-span-2 grid sm:grid-cols-2 gap-8">
                   {(Array.isArray(t.raw("landing.tech_guide.recs.items")) ? (t.raw("landing.tech_guide.recs.items") as any[]) : []).map(rec => (
                     <div key={rec.u} className="flex gap-4">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                           <CheckCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{rec.u}</p>
                           <p className="text-sm font-bold">{rec.f}</p>
                           <p className="text-[10px] font-bold text-muted-foreground/40">{rec.d}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* SEO KEYWORD HUB */}
            <div className="text-center space-y-8 pt-20 border-t border-border">
              <h3 className="text-xs font-bold tracking-[0.4em] text-muted-foreground/40">{t("landing.tech_guide.index.title")}</h3>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10px] font-semibold uppercase tracking-wider opacity-20">
                {(Array.isArray(t.raw("landing.tech_guide.index.keywords")) ? (t.raw("landing.tech_guide.index.keywords") as string[]) : []).map(k => (
                  <span key={k}>{k}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <FAQ 
          items={t.raw("landing.faq.items") as any[]}
          title={t("landing.faq.title")}
          className="py-32 border-t border-border"
        />

        {/* RELATED TOOLS */}
        <SuggestedTools 
          tools={[
            // { name: common("tools.imageEditor"), href: "/image/editor" },
            { name: common("tools.imageCompressor"), href: "/image/compress" },
            { name: common("tools.formatConverter"), href: "/image/convert" },
            { name: common("tools.backgroundRemover"), href: "/image/remove-background" },
            { name: common("tools.colorLab"), href: "/image/colors" }
          ]}
        />

        {/* FINAL CTA */}
        <AdUnit slot="9012345678" className="container mx-auto py-12" />
        <section className="py-40 px-4 text-center bg-gradient-to-b from-transparent to-primary/5">
           <div className="max-w-3xl mx-auto space-y-10">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">{t("landing.cta.title")}</h2>
              <p className="text-xl font-bold text-muted-foreground/60 italic leading-relaxed">
                {t("landing.cta.description")}
              </p>
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wider gap-4 italic group">
                {t("landing.cta.button")}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
