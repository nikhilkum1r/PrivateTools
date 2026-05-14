"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  CloudOff, 
  Database,
  FileSearch,
  Scale,
  ShieldAlert
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { useTranslations } from "next-intl";

export default function PrivacyPolicyClient() {
  const t = useTranslations("privacy");
  
  const icons = [CloudOff, EyeOff, Database, Scale, ShieldAlert];
  const sections = Array.isArray(t.raw("sections")) ? (t.raw("sections") as Array<{ title: string; description: string }>) : [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content" className="flex-grow pt-32 pb-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-6">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6 rounded-full uppercase tracking-wider text-[10px] font-bold">
              {t("badge")}
            </Badge>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none">
              {t.rich("title", {
                guaranteed: (chunks: React.ReactNode) => <span className="text-emerald-500">{chunks}</span>
              })}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
              {t("lastUpdated")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="p-8 bg-secondary/30 border-border rounded-2xl flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    {React.createElement(icons[i % icons.length], { className: "w-8 h-8 text-emerald-500" })}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold tracking-tight">{section.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                      {section.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-center space-y-4">
            <h4 className="text-xl font-bold tracking-tight text-emerald-500">{t("audit.title")}</h4>
            <p className="text-sm font-medium text-emerald-500/80">
              {t("audit.description")}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
