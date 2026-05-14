"use client";

import React from "react";
import { ShieldCheck, Cpu, HardDrive, ArrowRightLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export const LocalProcessingGuide = () => {
  const t = useTranslations("home");
  
  const icons = [ShieldCheck, Cpu, HardDrive];
  const steps = t.raw("guide.steps");

  if (!Array.isArray(steps)) {
    return null;
  }

  return (
    <section className="py-20 rounded-2xl surface-elevated overflow-hidden relative cv-auto" aria-labelledby="processing-guide-heading">
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
        <ShieldCheck className="w-48 h-48 text-primary" />
      </div>

      <div className="max-w-4xl mx-auto px-6 space-y-10 relative z-10">
        <div className="text-center space-y-3">
          <h2 id="processing-guide-heading" className="section-header text-2xl md:text-3xl">
            {t("guide.title")}
          </h2>
          <p className="section-subheader text-base mx-auto">
            {t("guide.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step: any, i: number) => (
            <div key={i} className="space-y-3.5 p-6 rounded-xl bg-secondary/5 border border-border/40 hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center">
                {React.createElement(icons[i % icons.length], { className: "w-5 h-5 text-primary" })}
              </div>
              <h3 className="card-title text-base text-foreground">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
          <div className="flex items-center gap-5">
            <div className="flex -space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/15 flex items-center justify-center text-red-500 font-semibold text-[9px] uppercase tracking-wider">{t("guide.cloud")}</div>
              <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center text-white"><ArrowRightLeft className="w-4 h-4" /></div>
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-500 font-semibold text-[9px] uppercase tracking-wider">{t("guide.safeTools")}</div>
            </div>
            <div className="space-y-0.5">
              <p className="font-semibold text-xs text-foreground tracking-wider uppercase">{t("guide.architecturalAdvantage")}</p>
              <p className="text-xs text-muted-foreground">{t("guide.vulnerabilityEliminated")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
