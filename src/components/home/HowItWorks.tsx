"use client";

import React from "react";
import { Zap, UploadCloud, Cpu, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export function HowItWorks() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm border-y border-border relative overflow-hidden">
         <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
            < Zap className="w-64 h-64" />
         </div>
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-4 mb-14">
               <Badge className="bg-primary/10 text-primary border-primary/20 py-2 px-6 rounded-full font-semibold uppercase tracking-wider text-[10px]">{hp("howItWorks.badge")}</Badge>
               <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight font-heading">
                  {hp.rich("howItWorks.title", { 
                     span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                     br: () => <br /> 
                  })}
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
               {Array.isArray(hp.raw("howItWorks.steps")) && (hp.raw("howItWorks.steps") as Array<{ step: string; title: string; description: string }>).map((item, i) => {
                  const icons = [UploadCloud, Cpu, Download];
                  const Icon = icons[i % icons.length];
                  return (
                     <div key={i} className="relative group p-10 rounded-3xl glass-card border border-border/50 hover:border-primary/40 transition-all shadow-xl">
                        <div className="absolute -top-6 -left-6 w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl shadow-xl rotate-[-12deg] group-hover:rotate-0 transition-transform">{item.step}</div>
                        <div className="space-y-4 pt-4">
                           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4"><Icon className="w-6 h-6" /></div>
                           <h3 className="text-2xl font-bold font-heading">{item.title}</h3>
                           <p className="text-muted-foreground font-medium leading-relaxed">{item.description}</p>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      </section>
   );
}
