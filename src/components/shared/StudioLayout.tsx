"use client";

import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { AdUnit } from "@/components/shared/AdUnit";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ShieldCheck, Lock, Search, Zap, Cpu } from "lucide-react";

interface StudioLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  heroIcon: React.ElementType;
  badge: string;
  breadcrumbs: { label: string; href: string }[];
  trustTitle: string;
  trustDesc: string;
  trustColor?: "blue" | "emerald" | "orange" | "indigo" | "amber";
  footerExtras?: React.ReactNode;
}

export function StudioLayout({
  children,
  title,
  description,
  heroIcon: Icon,
  badge,
  breadcrumbs,
  trustTitle,
  trustDesc,
  trustColor = "blue",
  footerExtras
}: StudioLayoutProps) {
  const common = useTranslations("common");
  const trust = useTranslations("trust.points");

  const colorConfig = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-500",
      card: "bg-blue-500/5",
      glow: "rgba(59,130,246,0.1)",
      selection: "selection:bg-blue-500/30"
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-500",
      card: "bg-emerald-500/5",
      glow: "rgba(16,185,129,0.1)",
      selection: "selection:bg-emerald-500/30"
    },
    orange: {
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      text: "text-orange-500",
      card: "bg-orange-500/5",
      glow: "rgba(249,115,22,0.1)",
      selection: "selection:bg-orange-500/30"
    },
    indigo: {
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      text: "text-indigo-500",
      card: "bg-indigo-500/5",
      glow: "rgba(99,102,241,0.1)",
      selection: "selection:bg-indigo-500/30"
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-500",
      card: "bg-amber-500/5",
      glow: "rgba(245,158,11,0.1)",
      selection: "selection:bg-amber-500/30"
    }
  };

  const c = colorConfig[trustColor];

  return (
    <div className={cn("flex flex-col min-h-screen bg-background text-foreground", c.selection)}>
      <Navbar />

      {/* Aesthetic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className={cn("absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]")} />
      </div>

      <main id="main-content" className="flex-grow relative z-10">
        {/* HERO SECTION */}
        <section data-google-ads-ignore="true" className="pt-24 pb-12 px-4 container mx-auto text-center max-w-4xl space-y-8">
          <Breadcrumbs 
            items={breadcrumbs} 
            className="justify-center"
          />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div 
              className={cn("w-20 h-20 mx-auto rounded-3xl flex items-center justify-center relative border", c.bg, c.border)}
              style={{ boxShadow: `0_0_50px_${c.glow}` }}
            >
              <Icon className={cn("w-10 h-10", c.text)} />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-foreground">
                {title}
              </h1>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto leading-tight">
                {description}
              </p>
              <p className={cn("text-sm font-medium inline-block px-4 py-2 rounded-full border", c.bg, c.border, c.text)}>
                {badge}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                { icon: ShieldCheck, text: trust("processedLocally") },
                { icon: Lock, text: trust("noUploads") },
                { icon: Search, text: trust("noTracking") },
                { icon: Zap, text: common("speed") },
                { icon: Cpu, text: common("security") }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card bg-secondary/30 border border-border">
                  <badge.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* INTERACTIVE STUDIO */}
        <section className="container mx-auto px-4 pb-16 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-start">
            {/* Main Tool Container */}
            <div className="w-full lg:max-w-4xl order-1">
              <div className="relative">
                {children}
              </div>

              <div className="lg:hidden mt-8">
                <AdUnit type="banner" />
              </div>
            </div>

            {/* Sidebar Ad for Desktop */}
            <div className="hidden lg:block w-80 sticky top-24 order-2">
              <div className="space-y-6">
                <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 mb-4 text-center">{common("advertisement") || "ADVERTISEMENT"}</h4>
                  <AdUnit type="sidebar" format="vertical" style={{ minHeight: "600px" }} />
                </div>
                
                {/* Trust Points in Sidebar */}
                <div className={cn("p-6 rounded-3xl border space-y-4", c.card, c.border)}>
                  <h4 className={cn("text-xs font-bold uppercase tracking-wider", c.text)}>{trustTitle}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{trustDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {footerExtras}
      </main>
      
      <Footer />
    </div>
  );
}
