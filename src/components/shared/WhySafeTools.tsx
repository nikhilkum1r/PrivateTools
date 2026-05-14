"use client";

import React from "react";
import { Shield, Zap, Globe, Lock, Smartphone, CloudOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdUnit } from "@/components/shared/AdUnit";

export const WhySafeTools = () => {
  const t = useTranslations("home");
  
  const icons = [Smartphone, CloudOff, Shield, Zap, Lock, Globe];
  const items = t.raw("whySafeTools.items");
  
  if (!Array.isArray(items)) {
    return null;
  }

  return (
    <section className="py-20 space-y-14 cv-auto" aria-labelledby="why-safetools-heading">
      <div className="text-center space-y-4 max-w-3xl mx-auto px-6">
        <h2 id="why-safetools-heading" className="section-header text-3xl md:text-5xl">
          {t.rich("whySafeTools.title", {
            span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>,
            br: () => <br />
          })}
        </h2>
        <p className="section-subheader text-base mx-auto">
          {t("whySafeTools.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 container mx-auto px-6">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="p-7 rounded-2xl surface-elevated hover:border-primary/20 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
              {React.createElement(icons[i % icons.length], { className: "w-5 h-5 text-primary" })}
            </div>
            <h3 className="card-title text-base mb-2.5 text-foreground">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Link href="/tools">
          <Button size="lg" className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/15 hover:shadow-primary/25 group transition-all">
            {t("hero.getStarted")} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Ad Placement: Feature Context (Allowed) */}
      <div className="container mx-auto px-6 pt-6">
        <AdUnit type="in-article" />
      </div>
    </section>
  );
};
