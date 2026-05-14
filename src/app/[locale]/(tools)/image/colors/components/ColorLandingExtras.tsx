"use client";

import React from "react";
import { 
  Layout, Cpu, Smartphone, Palette, 
  Search, ShieldCheck, CheckCircle2, 
  Check, FileDown
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FAQ } from "@/components/shared/FAQ";
import { SuggestedTools } from "@/components/shared/SuggestedTools";
import { AdUnit } from "@/components/shared/AdUnit";
import { cn } from "@/lib/utils";

interface ColorLandingExtrasProps {
  t: any;
  common: any;
  copyToClipboard: (text: string) => void;
}

export function ColorLandingExtras({ t, common, copyToClipboard }: ColorLandingExtrasProps) {
  return (
    <div className="space-y-32">
      {/* DESIGNER SECTION */}
      <section className="px-6 py-24 md:py-32 border-t border-border/40 bg-muted/20">
         <div className="max-w-7xl mx-auto space-y-20">
            <div className="flex flex-col items-center text-center space-y-6">
               <h2 className="text-3xl md:text-6xl font-bold tracking-tight font-heading">{t("personas.title")}</h2>
               <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto italic font-medium">{t("personas.subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {(Array.isArray(t.raw("personas.items")) ? (t.raw("personas.items") as Array<{ title: string; points: string[] }>) : []).map((s, i) => {
                 const personaIcons = [Layout, Cpu, Smartphone];
                 const Icon = personaIcons[i % personaIcons.length];
                 return (
                   <Card key={i} className="p-10 rounded-3xl glass-card border-border/40 flex flex-col gap-8 hover:bg-primary/[0.01] transition-all">
                      <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center text-primary">
                         <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight">{s.title}</h3>
                      <ul className="space-y-4">
                         {s.points.map((p, pi) => (
                           <li key={pi} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-primary" /> {p}
                           </li>
                         ))}
                      </ul>
                   </Card>
                 );
               })}
            </div>
         </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
         <AdUnit type="multiplex" />
      </div>

      {/* LONG-FORM SEO CONTENT */}
      <section className="px-6 py-24 md:py-40">
         <div className="max-w-5xl mx-auto space-y-32">
            {/* How to Section */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-heading leading-none">{t("educational.howTo.title")}</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {t("educational.howTo.description")}
                  </p>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {t("educational.howTo.description2")}
                  </p>
                  <div className="space-y-4 pt-4">
                     {(Array.isArray(t.raw("educational.howTo.steps")) ? (t.raw("educational.howTo.steps") as string[]) : []).map((step, si) => (
                       <div key={si} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/40">
                          <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">{si + 1}</span>
                          <span className="font-semibold uppercase tracking-wider text-xs">{step}</span>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-blue-500/10 to-primary/5 p-1">
                  <div className="w-full h-full rounded-[39px] glass-card border border-border/40 flex items-center justify-center p-12 text-center relative overflow-hidden">
                     <Palette className="w-32 h-32 text-primary/20 absolute -top-10 -right-10 rotate-12" />
                     <Search className="w-24 h-24 text-blue-500/10 absolute -bottom-10 -left-10 -rotate-12" />
                     <div className="space-y-6 relative z-10">
                        <h4 className="text-2xl font-bold tracking-tight">{t("educational.howTo.precisionTitle")}</h4>
                        <p className="text-sm text-muted-foreground italic font-medium leading-relaxed">{t("educational.howTo.precisionDesc")}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Educational Section */}
            <div className="space-y-16">
               <div className="flex flex-col items-center text-center space-y-4">
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-heading">{t("educational.formats.title")}</h2>
                  <p className="text-muted-foreground max-w-2xl italic font-medium">{t("educational.formats.subtitle")}</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(Array.isArray(t.raw("educational.formats.items")) ? (t.raw("educational.formats.items") as Array<{ title: string; desc: string }>) : []).map((fmt, i) => {
                    const formatExamples = ["#2563EB", "rgb(37, 99, 235)", "hsl(221, 83%, 53%)", "cmyk(84, 58, 0, 8)"];
                    return (
                      <Card key={i} className="p-10 rounded-3xl glass-card border-border/40 space-y-6">
                         <h3 className="text-2xl font-bold tracking-tight italic text-primary">{fmt.title}</h3>
                         <p className="text-muted-foreground leading-relaxed font-medium">{fmt.desc}</p>
                         <div className="p-4 rounded-xl bg-secondary/50 border border-border/40 flex items-center justify-between">
                            <code className="text-xs font-bold font-mono tracking-wider">{formatExamples[i]}</code>
                            <button onClick={() => copyToClipboard(formatExamples[i])} className="text-[10px] font-semibold uppercase tracking-wider text-primary/40 hover:text-primary transition-colors">{common("export.copy")}</button>
                         </div>
                      </Card>
                    );
                  })}
               </div>
            </div>

             {/* Accessibility Section */}
            <div className="p-16 rounded-[60px] bg-emerald-500/5 border border-emerald-500/10 flex flex-col md:flex-row items-center gap-16">
               <div className="flex-1 space-y-8">
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-heading leading-none">{t("educational.accessibility.title")}</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {t("educational.accessibility.description")}
                  </p>
                  <div className="flex flex-wrap gap-3">
                     {(Array.isArray(t.raw("educational.accessibility.labels")) ? (t.raw("educational.accessibility.labels") as string[]) : []).map((use, i) => (
                       <Badge key={i} variant="outline" className="px-4 py-2 rounded-full border-emerald-500/20 text-emerald-500 font-semibold uppercase tracking-wider text-[10px]">{use}</Badge>
                     ))}
                  </div>
               </div>
               <div className="w-full md:w-[350px] space-y-4">
                  <div className="p-8 rounded-3xl bg-black/40 border border-white/5 space-y-6 shadow-2xl">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">{t("educational.accessibility.aaPassed")}</span>
                        <span className="text-2xl font-bold">4.5:1</span>
                     </div>
                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[70%]" />
                     </div>
                     <p className="text-[10px] text-muted-foreground/40 font-bold leading-relaxed italic uppercase tracking-wider text-center">{t("educational.accessibility.standard")}</p>
                  </div>
               </div>
            </div>

             {/* Gradient Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
               <div className="md:col-span-7 space-y-8">
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-heading leading-none">{t("educational.gradients.title")}</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {t("educational.gradients.description")}
                  </p>
                  <div className="p-8 rounded-3xl glass-card border border-border/40 font-mono text-xs overflow-x-auto">
                     <p className="text-blue-400">background: <span className="text-emerald-400">linear-gradient</span>(135deg, <span className="text-primary">#2563EB</span>, <span className="text-blue-600">#7C3AED</span>);</p>
                  </div>
               </div>
               <div className="md:col-span-5 h-[400px] rounded-[50px] bg-gradient-to-br from-primary via-blue-600 to-emerald-500 shadow-2xl shadow-primary/20 animate-pulse relative overflow-hidden group" />
            </div>

            {/* Tailwind Section */}
            <div className="space-y-12">
               <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border/40 pb-12">
                  <div className="space-y-4">
                     <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-heading leading-none">{t("tailwind.title")}</h2>
                     <p className="text-muted-foreground text-lg italic font-medium">{t("tailwind.subtitle")}</p>
                  </div>
                  <Badge className="bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/20 px-6 py-2 rounded-full font-semibold uppercase tracking-wider">{t("tailwind.badge")}</Badge>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <p className="text-sm text-muted-foreground font-medium leading-relaxed">{t("tailwind.description")}</p>
                     <ul className="space-y-3">
                        {(Array.isArray(t.raw("tailwind.items")) ? (t.raw("tailwind.items") as string[]) : []).map((p, i) => (
                          <li key={i} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-primary">
                             <Check className="w-4 h-4" /> {p}
                          </li>
                        ))}
                     </ul>
                  </div>
                  <div className="p-8 rounded-3xl glass-card border border-border/40 font-mono text-[10px] space-y-1">
                     <p className="text-muted-foreground/40">// tailwind.config.js</p>
                     <p className="text-blue-400">colors: {'{'}</p>
                     <p className="pl-4 text-emerald-400">primary: <span className="text-primary">"#2563EB"</span>,</p>
                     <p className="pl-4 text-emerald-400">secondary: <span className="text-blue-600">"#7C3AED"</span></p>
                     <p className="text-blue-400">{'}'}</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* COMPARISON SECTION */}
      <section className="px-6 py-24 md:py-32 bg-secondary/10 border-y border-border/40 relative overflow-hidden">
         <div className="max-w-7xl mx-auto space-y-20">
            <div className="flex flex-col items-center text-center space-y-4">
               <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-heading">{t("comparison.title")}</h2>
               <p className="text-muted-foreground italic font-medium">{t("comparison.subtitle")}</p>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="border-b border-border/40">
                        {(Array.isArray(t.raw("comparison.header")) ? (t.raw("comparison.header") as string[]) : []).map((h, hi) => (
                          <th key={hi} className={cn("py-6 px-4 text-sm font-semibold uppercase tracking-wider", hi === 1 ? "text-primary" : hi === 2 ? "text-muted-foreground/40" : "")}>{h}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody>
                     {(Array.isArray(t.raw("comparison.rows")) ? (t.raw("comparison.rows") as string[][]) : []).map((row, i) => (
                       <tr key={i} className="border-b border-border/20 hover:bg-white/[0.02] transition-colors">
                          <td className="py-6 px-4 text-xs font-semibold uppercase tracking-wider">{row[0]}</td>
                          <td className="py-6 px-4 text-xs font-bold text-emerald-500">{row[1]}</td>
                          <td className="py-6 px-4 text-xs font-medium text-muted-foreground/40">{row[2]}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="px-6 py-24 md:py-32">
         <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {(Array.isArray(t.raw("useCases.items")) ? (t.raw("useCases.items") as Array<{ title: string; desc: string }>) : []).map((uc, i) => (
               <div key={i} className="space-y-4 group">
                  <h4 className="text-sm font-bold uppercase tracking-tight group-hover:text-primary transition-colors">{uc.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{uc.desc}</p>
               </div>
            ))}
         </div>
      </section>

      <div className="px-6 pb-24">
        <div className="max-w-5xl mx-auto pb-24">
          <AdUnit type="banner" />
        </div>

        <FAQ
          items={t.raw("faq.items")}
          title={common("faq.title")}
          description={common("faq.description")}
        />

        <SuggestedTools 
          title={common("relatedTools")}
          tools={[
            { name: common("tools.imageCompressor"), href: "/image/compress" },
            { name: common("tools.backgroundRemover"), href: "/image/remove-background" },
            { name: common("tools.formatConverter"), href: "/image/convert" },
            { name: common("tools.steganography"), href: "/security/steganography" }
          ]}
          className="pt-24 border-t border-border/40"
        />
      </div>
    </div>
  );
}
