"use client";

import React from "react";
import { 
  Scissors, FileDown, Layers, Cpu, Smartphone, Database, 
  Zap, Monitor, ShieldCheck, Play, FileText, Lock, 
  CheckCircle2, Briefcase, Fingerprint 
} from "lucide-react";
import Link from "next/link";
import { FAQ } from "@/components/shared/FAQ";

interface SplitPdfLandingExtrasProps {
  t: any;
}

export function SplitPdfLandingExtras({ t }: SplitPdfLandingExtrasProps) {
  return (
    <div className="container mx-auto px-4 max-w-5xl py-12 space-y-20">
      
      {/* Main Features */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground" dangerouslySetInnerHTML={{ __html: t.raw("landing.features.title") }} />
          <p className="text-muted-foreground font-medium">{t("landing.features.subtitle")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { title: (Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as string[]) : [])[0], icon: Scissors },
            { title: (Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as string[]) : [])[1], icon: FileDown },
            { title: (Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as string[]) : [])[2], icon: Layers },
            { title: (Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as string[]) : [])[3], icon: Cpu },
            { title: (Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as string[]) : [])[4], icon: Smartphone },
            { title: (Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as string[]) : [])[5], icon: Database },
            { title: (Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as string[]) : [])[6], icon: Zap },
            { title: (Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as string[]) : [])[7], icon: Monitor },
            { title: (Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as string[]) : [])[8], icon: ShieldCheck },
            { title: (Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as string[]) : [])[9], icon: Play }
          ].map((feature, i) => (
            <div key={i} className="p-4 rounded-2xl glass-card bg-secondary/30 border border-border flex flex-col items-center text-center gap-3">
              <feature.icon className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-bold leading-tight text-foreground">{feature.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Educational & Privacy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><FileText className="text-blue-500 w-6 h-6" /> {t("landing.what_is.title")}</h2>
          <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
            {t("landing.what_is.description")}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Lock className="text-emerald-500 w-6 h-6" /> {t("landing.privacy.title")}</h2>
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-500 font-medium">
            <ul className="space-y-2 list-disc pl-4 marker:text-emerald-500">
              {(Array.isArray(t.raw("landing.privacy.items")) ? (t.raw("landing.privacy.items") as any[]) : []).map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Splitting Modes */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Scissors className="text-blue-500 w-6 h-6" /> {t("landing.options.title")}</h2>
          <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border">
            <div className="grid grid-cols-2 gap-3">
              {(Array.isArray(t.raw("landing.options.items")) ? (t.raw("landing.options.items") as any[]) : []).map((use: string) => (
                <div key={use} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {use}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Layers className="text-emerald-500 w-6 h-6" /> {t("landing.organization.title")}</h2>
          <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
            {t("landing.organization.description")}
          </div>
        </div>
      </section>

      {/* How It Works & Performance */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 p-8 rounded-[2rem] border border-border glass-card bg-secondary/30">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2"><Play className="w-5 h-5 text-blue-500" /> {t("landing.how_it_works.title")}</h3>
          <ol className="space-y-4 list-decimal pl-5 text-muted-foreground font-medium marker:text-blue-500 marker:font-bold">
            {(Array.isArray(t.raw("landing.how_it_works.items")) ? (t.raw("landing.how_it_works.items") as any[]) : []).map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500 text-sm font-bold">
            {t("landing.how_it_works.note")}
          </div>
        </div>

        <div className="space-y-6 p-8 rounded-[2rem] border border-border glass-card bg-secondary/30">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-500" /> {t("landing.performance.title")}</h3>
          <div className="space-y-3 text-muted-foreground font-medium">
            <p>{t("landing.performance.subtitle")}</p>
            <ul className="space-y-2">
              {(Array.isArray(t.raw("landing.performance.items")) ? (t.raw("landing.performance.items") as any[]) : []).map((item: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases & Security */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Briefcase className="w-6 h-6 text-blue-500" /> {t("landing.use_cases.title")}</h2>
          <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border">
            <div className="grid grid-cols-2 gap-3">
              {(Array.isArray(t.raw("landing.use_cases.items")) ? (t.raw("landing.use_cases.items") as any[]) : []).map((use: string) => (
                <div key={use} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {use}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><ShieldCheck className="text-emerald-500 w-6 h-6" /> {t("landing.security.title")}</h2>
          <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
            {t("landing.security.description")}
          </div>
        </div>
      </section>

      {/* Works Offline */}
      <section className="p-8 rounded-[2rem] border border-border glass-card bg-secondary/30 space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Smartphone className="w-6 h-6 text-blue-500" /> {t("landing.offline.title")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {(Array.isArray(t.raw("landing.offline.items")) ? (t.raw("landing.offline.items") as any[]) : []).map((feat: string) => (
            <div key={feat} className="p-4 rounded-xl border border-border bg-black/30">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{feat}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-foreground">{t("landing.comparison.title")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse glass-card bg-secondary/30 rounded-3xl overflow-hidden border border-border shadow-sm">
            <thead>
              <tr className="bg-black/30">
                {(Array.isArray(t.raw("landing.comparison.headers")) ? (t.raw("landing.comparison.headers") as any[]) : []).map((h: string, idx: number) => (
                  <th key={idx} className={`p-4 font-semibold uppercase tracking-wider text-xs border-b border-border ${idx === 2 ? 'text-blue-500 bg-blue-500/5' : (idx === 1 ? 'text-muted-foreground' : 'text-foreground')}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm font-medium">
              {(Array.isArray(t.raw("landing.comparison.rows")) ? (t.raw("landing.comparison.rows") as any[]) : []).map((row: string[], idx: number) => (
                <tr key={idx}>
                  <td className="p-4 text-foreground">{row[0]}</td>
                  <td className="p-4 text-muted-foreground">{row[1]}</td>
                  <td className="p-4 text-blue-500 bg-blue-500/5 font-bold">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <FAQ items={t.raw("landing.faq.items")} />

      {/* Related Tools */}
      <section className="space-y-6 text-center border-t border-border pt-16">
        <h2 className="text-2xl font-bold text-foreground">{t("landing.related.title")}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {(Array.isArray(t.raw("landing.related.items")) ? (t.raw("landing.related.items") as any[]) : []).map((tool: { name: string, href: string }) => (
            <Link key={tool.href} href={tool.href} className="px-5 py-2.5 rounded-full glass-card bg-secondary/30 hover:bg-blue-600 hover:text-white border border-border hover:border-blue-600 transition-colors font-bold text-sm text-foreground">
              {tool.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Privacy Manifesto */}
      <section className="text-center max-w-2xl mx-auto space-y-4 pb-12">
        <Fingerprint className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
        <h3 className="text-xl font-semibold uppercase tracking-wider text-muted-foreground" dangerouslySetInnerHTML={{ __html: t.raw("landing.manifesto.title") }} />
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
          {t("landing.manifesto.description")}
        </p>
      </section>
    </div>
  );
}
