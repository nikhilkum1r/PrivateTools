"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export function ModernWorkflow() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 bg-secondary/80 backdrop-blur-sm relative cv-auto">
         <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-20 max-w-6xl mx-auto">
               <div className="flex-1 space-y-8">
                  <h2 className="text-5xl font-extrabold tracking-tight font-heading">
                     {hp.rich("workflow.title", { 
                        span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                        br: () => <br /> 
                     })}
                  </h2>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed">{hp("workflow.subtitle")}</p>
                  <div className="space-y-6">
                     {Array.isArray(hp.raw("workflow.items")) && (hp.raw("workflow.items") as Array<{ title: string; description: string }>).map((item, i) => (
                        <div key={i} className="flex gap-4">
                           <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                           </div>
                           <div>
                              <div className="font-bold tracking-tight font-heading">{item.title}</div>
                              <div className="text-muted-foreground text-sm font-medium">{item.description}</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="flex-1 w-full max-w-xl">
                  <div className="relative aspect-video rounded-3xl border border-border/50 overflow-hidden shadow-2xl group">
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                           animate={{ scale: [1, 1.05, 1] }}
                           transition={{ duration: 4, repeat: Infinity }}
                           className="p-8 rounded-full bg-primary/10 backdrop-blur-xl border border-primary/30"
                        >
                           <Zap className="w-12 h-12 text-primary" />
                        </motion.div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
