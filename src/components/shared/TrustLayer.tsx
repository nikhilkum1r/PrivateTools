"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Lock, EyeOff, WifiOff } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export const TrustLayer = () => {
  const t = useTranslations("trust");
  
  const trustPoints = [
    { label: t("points.processedLocally"), icon: CheckCircle2, color: "text-emerald-500" },
    { label: t("points.noUploads"), icon: ShieldCheck, color: "text-blue-500" },
    { label: t("points.noTracking"), icon: EyeOff, color: "text-purple-500" },
    { label: t("points.privacyFirst"), icon: Lock, color: "text-amber-500" },
    { label: t("points.worksOffline"), icon: WifiOff, color: "text-rose-500" },
  ];

  return (
    <section className="w-full py-8 md:py-12 border-y border-border/50 bg-secondary/5 backdrop-blur-sm overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-16 gap-y-6 md:gap-y-10 opacity-[0.92]">
          {trustPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 group cursor-default"
            >
              <div className={`p-2.5 rounded-2xl bg-background/50 border border-border group-hover:border-primary/50 group-hover:bg-background/80 transition-all duration-300 ${point.color} shadow-sm`}>
                <point.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground group-hover:text-foreground transition-colors whitespace-nowrap">
                {point.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
