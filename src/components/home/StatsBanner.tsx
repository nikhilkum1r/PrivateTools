"use client";

import React from "react";
import { useTranslations } from "next-intl";

export function StatsBanner() {
   const hp = useTranslations("home");

   return (
      <section className="py-16 bg-primary text-primary-foreground overflow-hidden relative">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--color-primary-rgb),0.1),transparent_70%)]" />
         <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-around gap-12 text-center">
               {Array.isArray(hp.raw("statsBanner")) && (hp.raw("statsBanner") as Array<{ val: string; label: string }>).map((stat, i) => (
                  <div key={i} className="space-y-1">
                     <div className="text-6xl font-extrabold tracking-tight font-heading">{stat.val}</div>
                     <div className="text-xs font-semibold uppercase tracking-wider opacity-60">{stat.label}</div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
