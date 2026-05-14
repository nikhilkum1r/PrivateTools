"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal, Palette, BookOpen, ShieldCheck, Users } from "lucide-react";
import { useTranslations } from "next-intl";

export function UseCasesSection() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 relative">
         <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-20 items-center max-w-6xl mx-auto">
               <div className="flex-1 space-y-8">
                  <h2 className="text-5xl font-extrabold tracking-tight font-heading">
                     {hp.rich("useCases.title", { 
                        span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                        br: () => <br /> 
                     })}
                  </h2>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed">{hp("useCases.subtitle")}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {Array.isArray(hp.raw("useCases.items")) && (hp.raw("useCases.items") as Array<{ title: string; description: string }>).map((item, i) => {
                        const icons = [Terminal, Palette, BookOpen, ShieldCheck];
                        const Icon = icons[i % icons.length];
                        return (
                          <div key={i} className="p-6 rounded-3xl bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm border border-border/50 space-y-3">
                             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Icon className="w-5 h-5" /></div>
                             <h4 className="font-bold text-sm font-heading">{item.title}</h4>
                             <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                          </div>
                        );
                     })}
                  </div>
               </div>
               <div className="flex-1 relative">
                  <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-blue-500/10 to-transparent border border-primary/20 flex items-center justify-center overflow-hidden">
                     <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 opacity-10"
                     >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] border-[2px] border-dashed border-primary rounded-full" />
                     </motion.div>
                     <Users className="w-40 h-40 text-primary/40" />
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
