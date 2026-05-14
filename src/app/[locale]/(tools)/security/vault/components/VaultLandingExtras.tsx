"use client";

import React from "react";
import { 
  ShieldCheck, Lock, HardDrive, Key, FileText, History, 
  Globe, Share2, Code2, Info, ArrowRight, CheckCircle2, 
  ShieldAlert, Shield, Smartphone 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface VaultLandingExtrasProps {
  t: any;
}

export function VaultLandingExtras({ t }: VaultLandingExtrasProps) {
  return (
    <>
      {/* Features Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">{t("landing.features.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("landing.features.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as any[]) : []).map((feat: any, i: number) => {
            const icons: any = { HardDrive, Key, FileText, Lock, History, Globe, Share2, Code2 };
            const Icon = icons[feat.i] || Info;
            return (
              <div key={i} className="glass-card p-6 rounded-3xl border-border bg-card/50 hover:bg-card transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-4 group-hover:border-[#22C55E]/50 transition-all">
                  <Icon className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{feat.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security Architecture Deep Dive */}
      <section className="space-y-12 py-20 bg-card/30 rounded-3xl border border-border px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-blue-500 text-white">{t("landing.architecture.badge")}</Badge>
            <h2 className="text-4xl font-bold">{t("landing.architecture.title")}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t("landing.architecture.description")}
            </p>
            <div className="space-y-6">
              {(Array.isArray(t.raw("landing.architecture.items")) ? (t.raw("landing.architecture.items") as any[]) : []).map((item: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#22C55E]/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{item.t}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#3B82F6]/20 to-[#22C55E]/20 flex items-center justify-center border border-border shadow-2xl overflow-hidden group">
              <Code2 className="w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_70%)]" />
            </div>
            <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-3xl border-border bg-card shadow-2xl">
              <div className="text-3xl font-bold text-[#22C55E]">100%</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center">{t("landing.architecture.localCrypto")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">{t("landing.useCases.title")}</h2>
          <p className="text-muted-foreground">{t("landing.useCases.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Array.isArray(t.raw("landing.useCases.items")) ? (t.raw("landing.useCases.items") as any[]) : []).map((use: any, i: number) => {
            const icons: any = { Key, History, Shield, Code2, FileText, Lock };
            const Icon = icons[use.i] || Info;
            return (
              <div key={i} className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 hover:border-foreground/20 transition-colors">
                <Icon className={cn("w-6 h-6", use.c)} />
                <span className="font-bold text-sm text-foreground">{use.t}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Threat Protection Section */}
      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 lg:order-1">
           <div className="p-8 rounded-3xl bg-gradient-to-br from-card to-background border border-border relative overflow-hidden group">
              <ShieldAlert className="w-64 h-64 absolute -right-16 -bottom-16 text-red-500/5 group-hover:scale-110 transition-transform duration-700" />
              <h3 className="text-2xl font-bold mb-6">{t("landing.threats.title")}</h3>
              <div className="space-y-4">
                {(Array.isArray(t.raw("landing.threats.items")) ? (t.raw("landing.threats.items") as any[]) : []).map((threat: string, i: number) => (
                  <div key={i} className="flex gap-3 items-center p-3 rounded-xl bg-background/50 border border-border">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    <span className="text-xs font-medium text-muted-foreground">{threat}</span>
                  </div>
                ))}
              </div>
           </div>
        </div>
        <div className="space-y-6 order-1 lg:order-2">
          <h2 className="text-3xl font-bold">{t("landing.threats.risk.title")}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {t("landing.threats.risk.desc")}
          </p>
          <Button variant="outline" className="rounded-xl border-border hover:bg-card font-bold gap-2">
            {t("landing.threats.risk.button")} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">{t("landing.comparison.title")}</h2>
          <p className="text-muted-foreground">{t("landing.comparison.subtitle")}</p>
        </div>
        <div className="glass-card rounded-3xl border-border bg-card/50 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="p-6 text-left text-xs uppercase tracking-wider text-muted-foreground">{t("landing.comparison.headers.0")}</th>
                <th className="p-6 text-center text-xs uppercase tracking-wider text-muted-foreground">{t("landing.comparison.headers.1")}</th>
                <th className="p-6 text-center text-xs uppercase tracking-wider text-[#22C55E]">{t("landing.comparison.headers.2")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(Array.isArray(t.raw("landing.comparison.rows")) ? (t.raw("landing.comparison.rows") as any[]) : []).map((row: any, i: number) => (
                <tr key={i} className="hover:bg-foreground/5 transition-colors">
                  <td className="p-6 text-sm font-bold text-foreground">{row.feat}</td>
                  <td className="p-6 text-center text-muted-foreground">
                    {typeof row.trad === "boolean" ? (row.trad ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <ShieldAlert className="w-5 h-5 text-red-500 mx-auto" />) : row.trad}
                  </td>
                  <td className="p-6 text-center text-[#22C55E] bg-green-500/5">
                    {typeof row.safe === "boolean" ? (row.safe ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <ShieldAlert className="w-5 h-5 text-red-500 mx-auto" />) : row.safe}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Enterprise Security Section */}
      <section className="grid lg:grid-cols-2 gap-12 items-center bg-blue-500/5 rounded-3xl p-8 md:p-16 border border-blue-500/10">
        <div className="space-y-6">
          <Badge className="bg-blue-600 text-white font-semibold uppercase tracking-wider text-[10px]">{t("landing.enterprise.badge")}</Badge>
          <h2 className="text-4xl font-bold">{t("landing.enterprise.title")}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {t("landing.enterprise.description")}
          </p>
          <ul className="space-y-4">
            {(Array.isArray(t.raw("landing.enterprise.items")) ? (t.raw("landing.enterprise.items") as any[]) : []).map((point: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative glass-card p-8 rounded-3xl border-border bg-card shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("landing.enterprise.audit.label")}</span>
              <Badge variant="outline" className="text-blue-400 border-blue-400/20">{t("landing.enterprise.audit.status")}</Badge>
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full bg-border rounded-full" />
              <div className="h-2 w-3/4 bg-border rounded-full" />
              <div className="h-2 w-5/6 bg-border rounded-full" />
              <div className="h-2 w-1/2 bg-border rounded-full" />
            </div>
            <div className="flex items-center gap-3 pt-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xs font-bold">{t("landing.enterprise.audit.validated")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Technical Specifications */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">{t("landing.specs.title")}</h2>
          <p className="text-muted-foreground">{t("landing.specs.subtitle")}</p>
        </div>
        <div className="max-w-3xl mx-auto glass-card rounded-3xl border-border bg-card/30 overflow-hidden shadow-xl">
          <div className="grid grid-cols-2 gap-px bg-border">
            {(Array.isArray(t.raw("landing.specs.items")) ? (t.raw("landing.specs.items") as any[]) : []).map((spec: any, i: number) => (
              <div key={i} className="bg-card p-6 flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{spec.l}</span>
                <span className="text-sm font-mono font-bold text-foreground">{spec.v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offline & PWA */}
      <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-card to-background border border-border relative overflow-hidden group text-center lg:text-left">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Smartphone className="w-64 h-64 rotate-12" />
        </div>
        <div className="max-w-2xl space-y-6 relative z-10">
          <Badge className="bg-[#22C55E] text-white mx-auto lg:mx-0">{t("landing.offline.badge")}</Badge>
          <h2 className="text-4xl font-bold text-foreground">{t("landing.offline.title")}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("landing.offline.description")}
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">{t("landing.offline.badges.noNetwork")}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">{t("landing.offline.badges.secureRuntime")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security Tips */}
      <section className="space-y-12">
        <h2 className="text-3xl font-bold text-center">{t("landing.bestPractices.title")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {(Array.isArray(t.raw("landing.bestPractices.items")) ? (t.raw("landing.bestPractices.items") as any[]) : []).map((tip: any, i: number) => (
            <div key={i} className="p-6 rounded-3xl bg-card/50 border border-border space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
              </div>
              <h4 className="font-bold text-foreground">{tip.t}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{tip.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Commitment Section */}
      <section className="py-16 border-y border-border">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/10 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6 text-[#22C55E]" />
          </div>
          <h2 className="text-3xl font-bold">{t("landing.commitment.title")}</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("landing.commitment.description")}
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">{t("landing.faq.title")}</h2>
          <p className="text-muted-foreground">{t("landing.faq.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {(Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any[]) : []).map((faq: any, i: number) => (
            <div key={i} className="p-6 rounded-3xl bg-card border border-border space-y-3">
              <h4 className="font-bold text-lg text-foreground">{faq.q}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Manifesto */}
      <section className="text-center py-20 px-6 rounded-[50px] bg-card border border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_70%)]" />
        <div className="max-w-2xl mx-auto space-y-8 relative z-10">
          <div className="w-20 h-20 rounded-[30px] bg-gradient-to-br from-[#22C55E] to-[#3B82F6] flex items-center justify-center mx-auto shadow-2xl">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold">{t("landing.manifesto.title")}</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("landing.manifesto.description")}
          </p>
          <div className="pt-8">
            <Link href="/privacy">
              <Button className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-lg gap-3">
                {t("landing.manifesto.button")} <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
