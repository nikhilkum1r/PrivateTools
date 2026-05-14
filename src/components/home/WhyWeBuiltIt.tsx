"use client";

import React from "react";
import { useTranslations } from "next-intl";

export function WhyWeBuiltIt() {
  const t = useTranslations("home.whyWeExist");
  return (
    <section className="py-40 relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-[900px]">
        <div className="glass-panel p-12 md:p-20 rounded-[3rem] space-y-12 relative z-10 border border-primary/20 bg-card/40 backdrop-blur-3xl shadow-2xl shadow-primary/5">
          <h2 className="text-3xl md:text-5xl font-bold font-heading">{t("title")}</h2>
          
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>{t("story")}</p>
            <p className="font-semibold text-foreground text-xl">{t("mission")}</p>
            <p>{t("solution")}</p>
            
            <ul className="space-y-3 pt-4">
              {t.raw("points").map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-foreground font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
