"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Scale, 
  Gavel,
  ShieldCheck,
  Cpu,
  Database,
  CloudOff,
  AlertTriangle,
  History,
  Lock,
  ChevronRight,
  ShieldAlert,
  Fingerprint,
  Trash2,
  WifiOff,
  FileLock2,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useTranslations } from "next-intl";

export default function TermsClient() {
  const t = useTranslations("terms");
  
  const icons = [CloudOff, Database, Cpu, History, ShieldCheck, AlertTriangle];
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-red-500 to-rose-600"
  ];
  const sections = Array.isArray(t.raw("sections")) ? (t.raw("sections") as Array<{ title: string; description: string }>) : [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* CINEMATIC HERO */}
        <section className="relative pt-40 pb-32 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.1),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-10">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-purple-500/30 text-purple-500 font-semibold uppercase tracking-wider text-[10px]">{t("badge")}</Badge>
                <h1 className="text-6xl md:text-9xl font-extrabold tracking-tight uppercase font-heading leading-[0.85]">
                   {t.rich("title", {
                     covenant: (chunks: React.ReactNode) => <span className="text-purple-500">{chunks}</span>
                   })}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
                   {t("subtitle")}
                </p>
             </motion.div>
          </div>
        </section>

        {/* COVENANT SECTIONS GRID */}
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
                     className="p-10 rounded-3xl bg-secondary/5 border border-border/50 hover:bg-card hover:border-purple-500/30 transition-all group relative overflow-hidden"
                   >
                      <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                         {React.createElement(icons[i % icons.length], { className: "w-32 h-32" })}
                      </div>
                      
                      <div className={cn("w-14 h-14 rounded-[20px] bg-gradient-to-br flex items-center justify-center text-foreground shadow-xl mb-8 group-hover:scale-110 transition-transform", colors[i % colors.length])}>
                         {React.createElement(icons[i % icons.length], { className: "w-7 h-7" })}
                      </div>
                      <h3 className="text-2xl font-bold font-heading mb-4">{section.title}</h3>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed">{section.description}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* DATA TYPES RECAP */}
        <section className="py-32 bg-secondary/10">
           <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto space-y-16">
                 <div className="space-y-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase font-heading">{t("boundTitle")}</h2>
                    <p className="text-xl text-muted-foreground font-medium">{t("boundSubtitle")}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {(Array.isArray(t.raw("labels")) ? (t.raw("labels") as Array<{ label: string }>) : []).map((item, i) => {
                      const icons = [Scale, Gavel, Lock, ShieldAlert];
                      const Icon = icons[i % icons.length];
                      return (
                        <div key={i} className="aspect-square rounded-3xl bg-card border border-border flex flex-col items-center justify-center gap-4 hover:border-purple-500/30 transition-all group">
                           <Icon className="w-8 h-8 text-muted-foreground group-hover:text-purple-500 transition-colors" />
                           <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                        </div>
                      );
                    })}
                 </div>
              </div>
           </div>
        </section>

        {/* FINAL CLAUSE */}
        <section className="py-40">
           <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto rounded-[60px] bg-purple-600 p-20 text-foreground relative overflow-hidden text-center space-y-10 shadow-2xl shadow-purple-500/20">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                 <Scale className="w-20 h-20 mx-auto opacity-50" />
                 <h2 className="text-6xl md:text-8xl font-extrabold tracking-tight uppercase font-heading leading-none text-foreground">
                   {t.rich("cta.title", {
                     consultation: (chunks: React.ReactNode) => <span className="italic">{chunks}</span>
                   })}
                 </h2>
                 <p className="text-xl font-medium opacity-80 max-w-2xl mx-auto">{t("cta.subtitle")}</p>
                 <div className="pt-6 flex flex-wrap justify-center gap-4">
                    <Button size="lg" className="h-20 px-12 rounded-3xl bg-white text-purple-600 hover:bg-white/90 font-bold tracking-wider text-sm group">
                       {t("cta.contactButton")} <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" size="lg" className="h-20 px-12 rounded-3xl border-white/20 text-foreground hover:bg-white/10 font-bold tracking-wider text-sm">
                       {t("cta.archiveButton")}
                    </Button>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
