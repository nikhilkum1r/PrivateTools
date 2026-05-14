"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function TestimonialsSection() {
   const hp = useTranslations("home");

   return (
      <section className="py-24">
         <div className="container mx-auto px-6">
            <div className="text-center space-y-4 mb-14">
               <h2 className="text-5xl font-extrabold tracking-tight font-heading">
                  {hp.rich("testimonials.title", { 
                     span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                     br: () => <br /> 
                  })}
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               {Array.isArray(hp.raw("testimonials.items")) && (hp.raw("testimonials.items") as Array<{ quote: string; name: string; role: string }>).map((t, i) => (
                  <div key={i} className="p-10 rounded-3xl glass-card border border-border/50 space-y-8 relative group h-full">
                     <div className="text-primary opacity-20 group-hover:opacity-100 transition-opacity absolute top-10 right-10">
                        <Sparkles className="w-8 h-8" />
                     </div>
                     <p className="text-lg font-medium leading-relaxed opacity-80">"{t.quote}"</p>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm" />
                        <div>
                           <div className="font-bold tracking-tight text-sm font-heading">{t.name}</div>
                           <div className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">{t.role}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
