"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export function FAQSection() {
   const hp = useTranslations("home");

   return (
      <section id="faq" className="py-28 relative">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-20">
               <div className="text-center space-y-6">
                  <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-semibold tracking-wider text-[10px]">{hp("faq.badge")}</Badge>
                  <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight font-heading">
                     {hp.rich("faq.title", { 
                        span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                        br: () => <br /> 
                     })}
                  </h2>
               </div>

               <div className="grid grid-cols-1 gap-6">
                  {Array.isArray(hp.raw("faq.items")) && (hp.raw("faq.items") as Array<{ q: string; a: string }>).map((faq, i) => (
                     <div key={i} className="p-10 glass-card backdrop-blur-xl border border-border/50 rounded-3xl space-y-4 hover:border-primary/20 transition-all group">
                        <h3 className="text-2xl font-bold tracking-tight flex items-center gap-6 font-heading">
                           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-sm shrink-0 shadow-lg group-hover:scale-110 transition-transform">Q</div>
                           {faq.q}
                        </h3>
                        <p className="text-muted-foreground font-medium leading-relaxed text-lg pl-18 opacity-80 group-hover:opacity-100 transition-opacity">
                           {faq.a}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}
