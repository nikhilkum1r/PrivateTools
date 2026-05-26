"use client";

import React from "react";
import { 
  FileSearch, 
  Languages, 
  ShieldCheck, 
  WifiOff, 
  Cpu, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Plus,
  Type,
  FileDigit,
  Layout,
  Clock,
  Search,
  HardDrive,
  Users,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WhySafeTools } from "@/components/shared/WhySafeTools";
import { SuggestedTools } from "@/components/shared/SuggestedTools";
import { FAQ } from "@/components/shared/FAQ";
import { AdUnit } from "@/components/shared/AdUnit";

import { cn } from "@/lib/utils";

interface OCRLandingExtrasProps {
  t: any;
  hp: any;
  t_tools: any;
}

export function OCRLandingExtras({ t, hp, t_tools }: OCRLandingExtrasProps) {
  return (
    <div className="space-y-40 py-20 overflow-hidden">
      {/* Dynamic Features Grid */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { i: FileSearch, t: t("landing.features.extraction.title"), d: t("landing.features.extraction.description"), c: "bg-blue-500/10 text-blue-500", shadow: "group-hover:shadow-blue-500/20" },
            { i: Languages, t: t("landing.features.multilingual.title"), d: t("landing.features.multilingual.description"), c: "bg-purple-500/10 text-purple-500", shadow: "group-hover:shadow-purple-500/20" },
            { i: ShieldCheck, t: t("landing.features.secure.title"), d: t("landing.features.secure.description"), c: "bg-emerald-500/10 text-emerald-500", shadow: "group-hover:shadow-emerald-500/20" },
            { i: WifiOff, t: t("landing.features.offline.title"), d: t("landing.features.offline.description"), c: "bg-amber-500/10 text-amber-500", shadow: "group-hover:shadow-amber-500/20" }
          ].map((f, i) => (
            <div key={i} className={cn("p-8 rounded-[2.5rem] bg-secondary/5 border border-border/40 space-y-4 hover:bg-secondary/10 transition-all group hover:shadow-2xl", f.shadow)}>
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", f.c)}>
                <f.i className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-widest">{f.t}</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase tracking-wider">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-6 mb-20">
          <Badge variant="outline" className="rounded-full bg-primary/10 border-primary/20 text-primary uppercase text-[10px] font-bold tracking-widest px-6 py-2">
            {t("landing.useCases.badge")}
          </Badge>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight font-heading" dangerouslySetInnerHTML={{ __html: t.raw("landing.useCases.title") }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Array.isArray(t.raw("landing.useCases.items")) ? (t.raw("landing.useCases.items") as any[]) : []).slice(0, 3).map((item, i) => {
            const icons = [GraduationCap, Briefcase, Users];
            const Icon = icons[i] || GraduationCap;
            return (
              <div key={i} className="relative p-10 rounded-[3rem] bg-card border border-border/40 overflow-hidden group shadow-xl hover:shadow-primary/5 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:w-40 group-hover:h-40" />
                <Icon className="w-10 h-10 text-primary mb-8 group-hover:scale-110 transition-transform" />
                <div className="space-y-3 relative z-10">
                  <h4 className="text-xl font-bold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl">
        <></>
      </div>

      {/* Trust & Local Processing Manifesto */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="relative rounded-[4rem] bg-secondary/5 border border-border/40 p-12 md:p-24 overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
             <Cpu className="w-64 h-64 text-primary" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold font-heading leading-tight italic" dangerouslySetInnerHTML={{ __html: t.raw("landing.manifesto.title") }} />
                <p className="text-muted-foreground text-lg italic">{t("landing.manifesto.description")}</p>
              </div>
              <div className="space-y-4">
                {(Array.isArray(t.raw("landing.manifesto.points")) ? (t.raw("landing.manifesto.points") as string[]) : []).map((p, i) => (
                  <div key={i} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-red-500/5 rounded-3xl p-10 space-y-6 border border-red-500/10">
              <h4 className="text-lg font-bold text-red-500 uppercase tracking-widest">{t("landing.manifesto.others.title")}</h4>
              <div className="space-y-4">
                {(Array.isArray(t.raw("landing.manifesto.others.points")) ? (t.raw("landing.manifesto.others.points") as string[]) : []).map((p, i) => (
                  <div key={i} className="flex items-center gap-4 text-xs font-medium text-red-500/60 uppercase tracking-wider">
                    <X className="w-4 h-4" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhySafeTools />

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
          items={t.raw("landing.faq.items")}
          title={t("landing.faq.title")}
          description={t("landing.faq.description")}
        />
      </div>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-40">
        <div className="relative rounded-[5rem] bg-primary p-12 md:p-24 text-center text-primary-foreground overflow-hidden shadow-2xl shadow-primary/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] opacity-10" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight font-heading italic" dangerouslySetInnerHTML={{ __html: t.raw("landing.cta.title") }} />
            <p className="text-xl md:text-2xl font-medium opacity-80 max-w-2xl mx-auto italic">{t("landing.cta.description")}</p>
            <Button className="h-20 px-12 rounded-[2.5rem] bg-white text-primary hover:bg-blue-50 font-extrabold text-xl shadow-2xl transition-all hover:scale-105 active:scale-95" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Plus className="mr-3 w-6 h-6" /> {t("landing.cta.button")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
