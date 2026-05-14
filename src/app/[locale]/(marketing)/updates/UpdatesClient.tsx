"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Rocket, 
  ArrowRight,
  Clock,
  Tag,
  Share2,
  Bookmark,
  Bell,
  Star,
  Trophy,
  Code
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function UpdatesClient() {
  const t = useTranslations("site");
  const [filter, setFilter] = useState("all");

  const updates = [
    {
      date: t("updates.feed.items.v2.date"),
      version: "v2.4.0",
      title: t("updates.feed.items.v2.title"),
      desc: t("updates.feed.items.v2.desc"),
      category: "Feature",
      icon: Rocket,
      color: "text-blue-500 bg-blue-500/10"
    },
    {
      date: t("updates.feed.items.security.date"),
      version: "v2.3.8",
      title: t("updates.feed.items.security.title"),
      desc: t("updates.feed.items.security.desc"),
      category: "Security",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-500/10"
    },
    {
      date: t("updates.feed.items.wasm.date"),
      version: "v2.3.5",
      title: t("updates.feed.items.wasm.title"),
      desc: t("updates.feed.items.wasm.desc"),
      category: "Performance",
      icon: Cpu,
      color: "text-purple-500 bg-purple-500/10"
    }
  ];

  const filteredUpdates = filter === "all" ? updates : updates.filter(u => u.category.toLowerCase() === filter);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* HERO */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-secondary),transparent_50%)] opacity-30" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary font-semibold uppercase tracking-wider text-[10px]">{t("updates.hero.badge")}</Badge>
                <h1 className="text-6xl md:text-9xl font-extrabold tracking-tight uppercase font-heading leading-tight" dangerouslySetInnerHTML={{ __html: t.raw("updates.hero.title") }} />
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">{t("updates.hero.subtitle")}</p>
             </motion.div>
          </div>
        </section>

        {/* CONTROLS */}
        <section className="py-12 border-y border-border sticky top-16 bg-background/80 backdrop-blur-xl z-30">
           <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4 p-1.5 rounded-2xl bg-secondary/30 border border-border">
                 {["all", "feature", "security", "performance"].map((cat) => (
                   <button
                     key={cat}
                     onClick={() => setFilter(cat)}
                     className={cn(
                       "px-6 py-2.5 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all",
                       filter === cat 
                         ? "bg-primary text-background shadow-lg" 
                         : "text-muted-foreground hover:text-foreground"
                     )}
                   >
                      {t(`updates.filters.${cat}`)}
                   </button>
                 ))}
              </div>

              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-3 text-primary">
                    <Bell className="w-5 h-5 animate-bounce" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">{t("updates.controls.subscribe")}</span>
                 </div>
                 <div className="h-10 w-px bg-border" />
                 <Button variant="outline" className="h-12 px-6 rounded-xl border-border hover:bg-background font-bold tracking-wider text-[9px] gap-2">
                    <Share2 className="w-4 h-4" /> {t("updates.controls.share")}
                 </Button>
              </div>
           </div>
        </section>

        {/* FEED */}
        <section className="py-32">
           <div className="container mx-auto px-6 max-w-4xl">
              <div className="relative space-y-24">
                 {/* Center Line */}
                 <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/20 to-transparent -translate-x-1/2 opacity-20" />

                 {filteredUpdates.map((item, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className={cn(
                       "relative flex flex-col md:flex-row items-center gap-12",
                       i % 2 === 0 ? "md:flex-row-reverse" : ""
                     )}
                   >
                      {/* Timeline Dot */}
                      <div className="absolute left-0 md:left-1/2 w-12 h-12 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center -translate-x-1/2 z-10 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
                         <div className="w-3 h-3 rounded-full bg-primary" />
                      </div>

                      {/* Content Card */}
                      <div className="w-full md:w-1/2 pl-12 md:pl-0">
                         <div className={cn(
                           "p-10 rounded-3xl bg-card border border-border/50 shadow-2xl group relative overflow-hidden",
                           i % 2 === 0 ? "md:mr-12" : "md:ml-12"
                         )}>
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                               <item.icon className="w-32 h-32" />
                            </div>

                            <div className="space-y-6 relative z-10">
                               <div className="flex items-center justify-between">
                                  <Badge className={cn("rounded-full px-4 py-1.5 font-semibold uppercase tracking-wider text-[8px]", item.color)}>
                                     {item.category}
                                  </Badge>
                                  <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider">{item.date}</span>
                               </div>
                               
                               <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                     <h3 className="text-3xl font-bold font-heading tracking-tight">{item.title}</h3>
                                     <span className="text-xs font-bold text-primary/40">{item.version}</span>
                                  </div>
                                  <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                               </div>

                               <div className="pt-4 flex items-center justify-between border-t border-border/50">
                                  <Button variant="link" className="p-0 h-auto text-[10px] font-semibold uppercase tracking-wider text-primary gap-2">
                                     {t("updates.feed.readMore")} <ArrowRight className="w-3 h-3" />
                                  </Button>
                                  <div className="flex items-center gap-2">
                                     <button className="p-2 hover:bg-secondary rounded-lg transition-colors"><Bookmark className="w-4 h-4 text-muted-foreground/40" /></button>
                                     <button className="p-2 hover:bg-secondary rounded-lg transition-colors"><Share2 className="w-4 h-4 text-muted-foreground/40" /></button>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Mirror Section (Hidden on mobile) */}
                      <div className="hidden md:block w-1/2" />
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* MILESTONES */}
        <section className="py-40 bg-secondary/10">
           <div className="container mx-auto px-6 max-w-5xl">
              <div className="text-center space-y-20">
                 <div className="space-y-6">
                    <Trophy className="w-16 h-16 mx-auto text-primary" />
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase font-heading">{t("updates.milestones.title")}</h2>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">{t("updates.milestones.subtitle")}</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                      { icon: Star, label: t("updates.milestones.items.users.label"), value: t("updates.milestones.items.users.value") },
                      { icon: Code, label: t("updates.milestones.items.tools.label"), value: t("updates.milestones.items.tools.value") },
                      { icon: ShieldCheck, label: t("updates.milestones.items.privacy.label"), value: t("updates.milestones.items.privacy.value") }
                    ].map((m, i) => (
                      <div key={i} className="p-10 rounded-3xl bg-background border border-border shadow-xl space-y-4">
                         <m.icon className="w-10 h-10 mx-auto text-primary/40" />
                         <div className="space-y-1">
                            <h4 className="text-4xl font-bold font-heading tracking-tight">{m.value}</h4>
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{m.label}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
