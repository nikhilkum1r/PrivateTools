"use client";

import React from "react";
import { 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ImageIcon, 
  Globe,
  CheckCircle2,
  X,
  Plus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FAQ } from "@/components/shared/FAQ";
import { SuggestedTools } from "@/components/shared/SuggestedTools";

interface IconLandingExtrasProps {
  t: any;
  hp: any;
  t_tools: any;
}

export function IconLandingExtras({ t, hp, t_tools }: IconLandingExtrasProps) {
  return (
    <div className="space-y-40 py-20">
      {/* Features Section */}
      <div className="space-y-12">
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

      {/* Comparison Section */}
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

      {/* CTA Section */}
      <div className="mt-40">
        <div className="relative overflow-hidden rounded-[64px] border border-primary/20 bg-primary/5 p-20 text-center space-y-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
          <div className="space-y-4 relative z-10">
            <Badge className="bg-primary/20 text-primary border-primary/30 py-2 px-6 rounded-full uppercase tracking-wider text-[10px] font-bold">{t("landing.cta.badge")}</Badge>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight font-heading">{t("landing.cta.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto italic font-medium">{t("landing.cta.description")}</p>
          </div>
          <Button className="h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-12 gap-4 shadow-2xl shadow-primary/30 relative z-10" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Plus className="w-6 h-6" /> {t("landing.cta.button")}
          </Button>
        </div>
      </div>

      <SuggestedTools 
        title={hp("featuredCats.title")}
        tools={[
          { name: t_tools("data./image/compress.title"), href: "/image/compress" },
          { name: t_tools("data./image/convert.title"), href: "/image/convert" },
          { name: t_tools("data./pdf/to-image.title"), href: "/pdf/to-image" },
          { name: t_tools("data./image/remove-background.title"), href: "/image/remove-background" }
        ]}
      />

      <div className="mt-20 border-t border-border/50">
        <FAQ
          items={Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any) : []}
          title={t("landing.faq.title")}
        />
      </div>
    </div>
  );
}
