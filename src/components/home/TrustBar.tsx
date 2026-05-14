"use client";

import React from "react";
import { useTranslations } from "next-intl";

export function TrustBar() {
   const hp = useTranslations("home");

   return (
      <section className="py-12 border-b border-border glass-card backdrop-blur-xl relative z-20">
         <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
               {Array.isArray(hp.raw("trustBar")) && (hp.raw("trustBar") as Array<{ name: string; desc: string }>).map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                     <div className="text-lg font-bold tracking-tight font-heading">{item.name}</div>
                     <div className="text-[10px] font-medium uppercase tracking-wider text-primary/50">{item.desc}</div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
