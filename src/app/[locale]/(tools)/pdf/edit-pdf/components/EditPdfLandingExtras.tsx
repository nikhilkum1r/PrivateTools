"use client";

import React from "react";
import {
  Type, Pencil, Highlighter, ImageIcon, Cpu, DownloadCloud,
  Zap, ShieldCheck, Monitor, Smartphone, FileText, Lock,
  CheckCircle2, Briefcase, Play, Settings2
} from "lucide-react";
import { FAQ } from "@/components/shared/FAQ";
import Link from "next/link";

export interface EditPdfLandingExtrasProps {
  t: any;
}

export function EditPdfLandingExtras({ t }: EditPdfLandingExtrasProps) {
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
            { title: t("landing.features.items.0"), icon: Type },
            { title: t("landing.features.items.1"), icon: Pencil },
            { title: t("landing.features.items.2"), icon: Highlighter },
            { title: t("landing.features.items.3"), icon: ImageIcon },
            { title: t("landing.features.items.4"), icon: Settings2 },
            { title: t("landing.features.items.5"), icon: Settings2 },
            { title: t("landing.features.items.6"), icon: Monitor },
            { title: t("landing.features.items.7"), icon: FileText },
            { title: t("landing.features.items.8"), icon: Settings2 },
            { title: t("landing.features.items.9"), icon: Smartphone }
          ].map((feat, i) => (
            <div key={i} className="p-4 rounded-2xl glass-card bg-secondary/30 border border-border flex flex-col items-center text-center gap-3">
              <feat.icon className="w-6 h-6 text-indigo-500" />
              <span className="text-sm font-bold leading-tight text-foreground">{feat.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Educational & Privacy */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><FileText className="text-indigo-500 w-6 h-6" /> {t("landing.what_is.title")}</h2>
          <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
            {t("landing.what_is.description")}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Lock className="text-emerald-500 w-6 h-6" /> {t("landing.privacy.title")}</h2>
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-400 font-medium">
            <ul className="space-y-2 list-disc pl-4 marker:text-emerald-500">
              {(Array.isArray(t.raw("landing.privacy.items")) ? (t.raw("landing.privacy.items") as string[]) : []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works & Tools Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6 p-8 rounded-[2rem] border border-border glass-card bg-secondary/30">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2"><Play className="w-5 h-5 text-indigo-500" /> {t("landing.how_it_works.title")}</h3>
          <ol className="space-y-4 list-decimal pl-5 text-muted-foreground font-medium marker:text-indigo-500 marker:font-bold">
            {(Array.isArray(t.raw("landing.how_it_works.steps")) ? (t.raw("landing.how_it_works.steps") as string[]) : []).map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-sm font-bold">
            {t("landing.how_it_works.note")}
          </div>
        </div>

        <div className="space-y-6 p-8 rounded-[2rem] border border-border glass-card bg-secondary/30">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2"><Pencil className="w-5 h-5 text-emerald-500" /> {t("landing.tools_overview.title")}</h3>
          <div className="space-y-3 text-muted-foreground font-medium">
            <p>{t("landing.tools_overview.subtitle")}</p>
            <ul className="space-y-2">
              {(Array.isArray(t.raw("landing.tools_overview.items")) ? (t.raw("landing.tools_overview.items") as string[]) : []).map((item, i) => (
                <li key={i} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases & Performance */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Briefcase className="w-6 h-6 text-indigo-500" /> {t("landing.use_cases.title")}</h2>
          <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border">
            <div className="grid grid-cols-2 gap-3">
              {(Array.isArray(t.raw("landing.use_cases.items")) ? (t.raw("landing.use_cases.items") as string[]) : []).map(use => (
                <div key={use} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> {use}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Zap className="w-6 h-6 text-emerald-500" /> {t("landing.performance.title")}</h2>
          <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
            <ul className="space-y-2 list-disc pl-4 marker:text-emerald-500">
              {(Array.isArray(t.raw("landing.performance.items")) ? (t.raw("landing.performance.items") as string[]) : []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Security & Offline */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><ShieldCheck className="text-emerald-500 w-6 h-6" /> {t("landing.secure.title")}</h2>
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-400 font-medium">
            {t("landing.secure.description")}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Smartphone className="text-indigo-500 w-6 h-6" /> {t("landing.offline.title")}</h2>
          <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
            {t("landing.offline.description")}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-foreground">{t("landing.comparison.title")}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse glass-card bg-secondary/30 rounded-3xl overflow-hidden border border-border shadow-sm">
            <thead>
              <tr className="bg-black/30">
                <th className="p-4 font-semibold uppercase tracking-wider text-xs border-b border-border text-foreground">{t("landing.comparison.headers.0")}</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs border-b border-border text-muted-foreground">{t("landing.comparison.headers.1")}</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-xs border-b border-border text-indigo-400 bg-indigo-500/5">{t("landing.comparison.headers.2")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm font-medium">
              {(Array.isArray(t.raw("landing.comparison.rows")) ? (t.raw("landing.comparison.rows") as string[][]) : []).map((row, i) => (
                <tr key={i}>
                  <td className="p-4 text-foreground">{row[0]}</td>
                  <td className="p-4 text-muted-foreground">{row[1]}</td>
                  <td className="p-4 text-indigo-400 bg-indigo-500/5 font-bold">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <FAQ items={t.raw("landing.faq.items") as any} />

      {/* Related Tools */}
      <section className="space-y-6 text-center border-t border-border pt-16">
        <h2 className="text-2xl font-bold text-foreground">{t("landing.related.title")}</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { name: "PDF Merge", href: "/pdf/merge-pdf" },
            { name: "PDF Split", href: "/pdf/split-pdf" },
            { name: "PDF Compress", href: "/pdf/compress-pdf" },
            { name: "PDF Unlock", href: "/pdf/unlock-pdf" },
            { name: "PDF Protect", href: "/pdf/protect-pdf" },
            { name: "PDF to Text", href: "/document/pdf-to-txt" }
          ].map(tool => (
            <Link key={tool.href} href={tool.href} className="px-5 py-2.5 rounded-full glass-card bg-secondary/30 hover:bg-indigo-600 hover:text-foreground border border-border hover:border-indigo-600 transition-colors font-bold text-sm text-foreground">
              {tool.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Privacy Manifesto */}
      <section className="text-center max-w-2xl mx-auto space-y-4 pb-12">
        <ShieldCheck className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
        <h3 className="text-xl font-semibold uppercase tracking-wider text-muted-foreground" dangerouslySetInnerHTML={{ __html: t.raw("landing.manifesto.title") }} />
        <p className="text-sm font-medium text-muted-foreground leading-relaxed">
          {t("landing.manifesto.description")}
        </p>
      </section>
    </div>
  );
}
