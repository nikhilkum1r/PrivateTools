"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  ArrowRight,
  History,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/lib/utils";

const versionIcons: Record<number, any> = {
  0: Sparkles,
  1: Cpu,
  2: ShieldCheck
};

export default function ChangelogClient() {
  const t = useTranslations("changelog");

  const changelogData = t.raw("data") as Array<{
    date: string;
    version: string;
    title: string;
    desc: string;
    highlights: Array<{ type: string; text: string }>;
    color: string;
  }>;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-secondary),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary font-semibold uppercase tracking-wider text-[10px]">{t("hero.badge")}</Badge>
                <h1 
                  className="text-6xl md:text-9xl font-extrabold tracking-tight uppercase font-heading leading-none"
                  dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }}
                />
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                   {t("hero.subtitle")}
                </p>
             </motion.div>
          </div>
        </section>

        {/* TIMELINE SECTION */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-5xl">
              <div className="relative space-y-32">
                 {/* The Line */}
                 <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border/50 -translate-x-1/2 hidden md:block" />

                 {changelogData.map((item, i) => (
                   <div key={i} className="relative">
                      {/* Date Marker (Desktop) */}
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 -top-12 px-6 py-2 rounded-full bg-secondary border border-border items-center gap-2 z-20">
                         <Clock className="w-3 h-3 text-muted-foreground" />
                         <span className="text-[10px] font-semibold uppercase tracking-wider">{item.date}</span>
                      </div>

                      <div className={cn(
                         "flex flex-col md:flex-row items-center gap-12 lg:gap-24",
                         i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      )}>
                         {/* Content */}
                         <motion.div 
                           initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           viewport={{ once: true }}
                           className="flex-1 space-y-8"
                         >
                            <div className="space-y-4">
                               <div className="flex items-center gap-3">
                                  <Badge className={cn("text-foreground font-bold", i === 0 ? "bg-primary" : i === 1 ? "bg-purple-500" : "bg-emerald-500")}>{item.version}</Badge>
                                  <span className="md:hidden text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{item.date}</span>
                               </div>
                               <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-heading leading-tight">{item.title}</h2>
                               <p className="text-lg text-muted-foreground font-medium">{item.desc}</p>
                            </div>

                            <div className="space-y-3">
                               {item.highlights.map((h, hi) => (
                                 <div key={hi} className="flex items-start gap-4 group">
                                    <Badge variant="outline" className={cn(
                                       "mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm shrink-0",
                                       h.type === "New" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" :
                                       h.type === "Improved" ? "border-blue-500/30 bg-blue-500/10 text-blue-500" :
                                       "border-orange-500/30 bg-orange-500/10 text-orange-500"
                                    )}>
                                       {h.type}
                                    </Badge>
                                    <span className="text-sm font-bold text-foreground/80 group-hover:text-foreground transition-colors">{h.text}</span>
                                 </div>
                               ))}
                            </div>
                         </motion.div>

                         {/* Visual / Badge Placeholder */}
                         <motion.div 
                           initial={{ opacity: 0, scale: 0.8 }}
                           whileInView={{ opacity: 1, scale: 1 }}
                           viewport={{ once: true }}
                           className="flex-1 w-full"
                         >
                            <div className="aspect-video rounded-3xl bg-secondary/20 border border-border flex items-center justify-center relative overflow-hidden group shadow-2xl">
                               <div className={cn("absolute inset-0 opacity-10 blur-[80px] rounded-full", i === 0 ? "bg-primary" : i === 1 ? "bg-purple-500" : "bg-emerald-500")} />
                               <div className="relative z-10 flex flex-col items-center gap-4">
                                  <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center text-foreground shadow-xl group-hover:scale-110 transition-transform", i === 0 ? "bg-primary" : i === 1 ? "bg-purple-500" : "bg-emerald-500")}>
                                     {React.createElement(versionIcons[i] || ShieldCheck, { className: "w-10 h-10" })}
                                  </div>
                                  <div className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{t("timeline.visual")}</div>
                               </div>
                            </div>
                         </motion.div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* FEEDBACK / CTA */}
        <section className="py-40 border-t border-border/50">
           <div className="container mx-auto px-6 text-center space-y-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary border border-border">
                 <History className="w-4 h-4 text-primary" />
                 <span className="text-[10px] font-semibold uppercase tracking-wider">{t("timeline.moreUpdates")}</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase font-heading" dangerouslySetInnerHTML={{ __html: t.raw("cta.title") }} />
              <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">{t("cta.subtitle")}</p>
              <div className="pt-6 flex flex-wrap justify-center gap-6">
                 <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 font-bold tracking-wider text-sm group">
                    {t("cta.github")} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Button>
                 <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-border hover:bg-secondary font-bold tracking-wider text-sm">
                    {t("cta.follow")}
                 </Button>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
