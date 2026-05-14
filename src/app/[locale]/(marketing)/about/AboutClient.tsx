"use client";

import React from "react";
import Script from "next/script";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Zap, 
  Lock, 
  Database,
  CloudOff,
  UserCheck,
  ChevronRight,
  Fingerprint,
  Award,
  BookOpen,
  Verified,
  ShieldAlert,
  List
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AboutClient() {
  const t = useTranslations("about");
  const common = useTranslations("common");

  const tocItems = [
    { name: t("toc.manifesto"), id: "manifesto" },
    { name: t("toc.trust"), id: "trust" },
    { name: t("toc.pillars"), id: "pillars" },
    { name: t("toc.tech"), id: "tech" }
  ];

  const pillars = [
    {
      icon: CloudOff,
      title: t("pillars.zeroServer.title"),
      desc: t("pillars.zeroServer.description"),
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Database,
      title: t("pillars.noPersistence.title"),
      desc: t("pillars.noPersistence.description"),
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      icon: Fingerprint,
      title: t("pillars.identityProtection.title"),
      desc: t("pillars.identityProtection.description"),
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    }
  ];

  const technologiesRaw = t.raw("engine.items");
  const technologies = Array.isArray(technologiesRaw) ? (technologiesRaw as Array<{ name: string; desc: string }>) : [];

  const trustSignalsRaw = t.raw("trustSignals");
  const trustSignals = Array.isArray(trustSignalsRaw) ? [
    { icon: Award, ...(trustSignalsRaw[0] as any) },
    { icon: Verified, ...(trustSignalsRaw[1] as any) },
    { icon: BookOpen, ...(trustSignalsRaw[2] as any) },
    { icon: ShieldAlert, ...(trustSignalsRaw[3] as any) }
  ] : [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-y-auto lg:overflow-hidden selection:bg-blue-500/30">
      <Navbar />

      <main id="main-content" className="flex-grow pt-32">
        <div className="container mx-auto px-8 mb-12">
           <Breadcrumbs items={[{ label: common("about"), href: "/about" }]} />
        </div>

        {/* Hero Section */}
        <section id="manifesto" className="relative pb-8 px-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 py-2 px-6 rounded-full uppercase tracking-wider text-[10px] font-bold">
                {t("manifesto.badge")}
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-8xl font-extrabold tracking-tight leading-none uppercase"
            >
              {t.rich("manifesto.title", {
                span: (chunks: React.ReactNode) => <span className="text-blue-500">{chunks}</span>
              })}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed"
            >
              {t("manifesto.description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="pt-6"
            >
              <Link 
                href="/philosophy" 
                className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-bold uppercase tracking-widest text-[10px] transition-colors group"
              >
                Read Our Full Philosophy <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Table of Contents - Mobile Sticky/Floating Desktop */}
        <nav className="sticky top-20 z-50 flex justify-center py-4 px-4 bg-muted/40 backdrop-blur-3xl border-y border-border pointer-events-auto">
           <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth">
              <div className="hidden md:flex items-center gap-2 text-muted-foreground/50 text-[10px] font-semibold uppercase tracking-wider mr-4">
                 <List className="w-3.5 h-3.5" /> {common("contents")}
              </div>
              {tocItems.map(item => (
                <a 
                  key={item.id} 
                  href={`#${item.id}`} 
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-primary transition-colors whitespace-nowrap px-4 py-2 rounded-full border border-transparent hover:border-border"
                >
                  {item.name}
                </a>
              ))}
           </div>
        </nav>

        {/* E-E-A-T Signals */}
        <section id="trust" className="container mx-auto px-4 py-32 border-b border-border bg-white/[0.01]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustSignals.map((signal, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-blue-400">
                  <signal.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{signal.label}</p>
                  <p className="text-sm font-bold">{signal.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pillars Section */}
        <section id="pillars" className="py-32 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
              >
                <Card className="p-8 bg-secondary/30 border-border h-full rounded-2xl hover:bg-secondary/50 transition-all group relative overflow-hidden">
                  <div className={`w-11 h-11 rounded-2xl ${pillar.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <pillar.icon className={`w-8 h-8 ${pillar.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Deep Dive */}
        <section id="tech" className="py-32 px-4 relative">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6 rounded-full uppercase tracking-wider text-[10px] font-bold">
                {t("engine.badge")}
              </Badge>
              <h2 className="text-5xl font-bold tracking-tight leading-none uppercase">
                {t.rich("engine.title", {
                  span: (chunks: React.ReactNode) => <span className="opacity-40">{chunks}</span>
                })}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                {t("engine.description")}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {technologies.map(tech => (
                  <div key={tech.name} className="p-6 rounded-2xl bg-white/[0.03] border border-border space-y-1">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500">{tech.name}</div>
                    <p className="text-[10px] text-muted-foreground/60 font-medium">{tech.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
               <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full" />
               <Card className="relative p-10 bg-muted/40 border-border backdrop-blur-3xl rounded-3xl shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Zap className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold uppercase tracking-wider text-[10px] opacity-40">{t("metrics.title")}</h4>
                      <p className="text-sm font-bold">{t("metrics.subtitle")}</p>
                    </div>
                  </div>
                  <div className="space-y-8">
                     {(Array.isArray(t.raw("metrics.items")) ? (t.raw("metrics.items") as Array<{ label: string; value: string }>) : []).map((stat, i) => (
                       <div key={stat.label} className="space-y-3">
                         <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider opacity-60">
                           <span>{stat.label}</span>
                           <span>{stat.value}</span>
                         </div>
                         <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: "100%" }}
                              transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                              className={`h-full ${["bg-emerald-500", "bg-blue-500", "bg-purple-500"][i % 3]}`} 
                            />
                         </div>
                       </div>
                     ))}
                  </div>
               </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6 bg-gradient-to-br from-blue-600 to-blue-800 p-16 rounded-3xl shadow-2xl shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150">
              <ShieldCheck className="w-32 h-32" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none uppercase">{t("cta.title")}</h2>
              <p className="text-foreground/80 text-xl font-medium max-w-xl mx-auto">
                {t("cta.description")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-8">
                <Link href="/" className={cn(buttonVariants({ size: "lg" }), "h-14 px-10 rounded-2xl bg-white text-blue-600 hover:bg-white/90 font-bold text-xl gap-3 uppercase")}>
                  {common("getStarted")} <ChevronRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Structured Data */}
      <Script
        id="about-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": t("seo.title"),
            "description": t("seo.description"),
            "publisher": {
              "@type": "Organization",
              "name": "SafeTools",
              "logo": "https://safetools.space/logo.png"
            },
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": t("pillars.zeroServer.title"),
                  "description": t("pillars.zeroServer.description")
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": t("pillars.identityProtection.title"),
                  "description": t("pillars.identityProtection.description")
                }
              ]
            }
          })
        }}
      />
    </div>
  );
}
