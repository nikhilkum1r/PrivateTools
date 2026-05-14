"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  Cookie, 
  ShieldCheck, 
  EyeOff, 
  Database, 
  Trash2, 
  Lock, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Ghost
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CookiesClient() {
  const t = useTranslations("cookies");

  const sections = [
    {
      title: t("sections.0.title"),
      icon: Ghost,
      content: t("sections.0.content"),
      color: "from-slate-400 to-slate-600"
    },
    {
      title: t("sections.1.title"),
      icon: Database,
      content: t("sections.1.content"),
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: t("sections.2.title"),
      icon: EyeOff,
      content: t("sections.2.content"),
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* HERO */}
        <section className="relative pt-40 pb-32 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.1),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-10">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-amber-500/30 text-amber-500 font-semibold uppercase tracking-wider text-[10px]">
                  {t("hero.badge")}
                </Badge>
                <h1 
                  className="text-6xl md:text-9xl font-extrabold tracking-tight uppercase font-heading leading-[0.85]"
                  dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }}
                />
                <p 
                  className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t.raw("hero.subtitle") }}
                />
             </motion.div>
          </div>
        </section>

        {/* POLICY GRID */}
        <section className="py-32">
           <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {sections.map((section, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="p-10 rounded-3xl bg-secondary/5 border border-border/50 hover:bg-card hover:border-amber-500/30 transition-all group relative overflow-hidden"
                   >
                      <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                         <section.icon className="w-32 h-32" />
                      </div>
                      
                      <div className={cn("w-14 h-14 rounded-[20px] bg-gradient-to-br flex items-center justify-center text-foreground shadow-xl mb-8 group-hover:scale-110 transition-transform", section.color)}>
                         <section.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold font-heading mb-4">{section.title}</h3>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed">{section.content}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* STATS SECTION */}
        <section className="py-32 bg-secondary/10 border-y border-border/50">
           <div className="container mx-auto px-6 max-w-5xl text-center space-y-12">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase font-heading">{t("metrics.title")}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 {[
                   { label: t("metrics.items.0.label"), val: t("metrics.items.0.val") },
                   { label: t("metrics.items.1.label"), val: t("metrics.items.1.val") },
                   { label: t("metrics.items.2.label"), val: t("metrics.items.2.val") },
                   { label: t("metrics.items.3.label"), val: t("metrics.items.3.val") }
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="text-4xl md:text-5xl font-bold text-amber-500 tracking-tight">{stat.val}</div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{stat.label}</div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* FINAL CLAUSE */}
        <section className="py-40">
           <div className="container mx-auto px-6 text-center space-y-10">
              <div className="max-w-4xl mx-auto p-16 rounded-[60px] bg-amber-500 text-foreground relative overflow-hidden shadow-2xl shadow-amber-500/20">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                 <Cookie className="w-20 h-20 mx-auto opacity-50 mb-6" />
                 <h2 
                   className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase font-heading leading-none"
                   dangerouslySetInnerHTML={{ __html: t.raw("final.title") }}
                 />
                 <p className="text-xl font-medium opacity-80 max-w-2xl mx-auto pt-4">
                   {t("final.subtitle")}
                 </p>
                 <div className="pt-10 flex justify-center gap-4">
                    <Link href="/">
                       <Button size="lg" className="h-20 px-12 rounded-2xl bg-white text-amber-600 hover:bg-white/90 font-bold tracking-wider text-sm group">
                          {t("final.button")} <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                       </Button>
                    </Link>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
