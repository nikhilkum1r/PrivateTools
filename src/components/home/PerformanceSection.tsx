"use client";

import React from "react";
import { Zap, Globe, Smartphone, Database, Cpu, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export function PerformanceSection() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm">
         <div className="container mx-auto px-6">
            <div className="text-center space-y-4 mb-14">
               <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary font-semibold uppercase tracking-wider text-primary">{hp("performance.badge")}</Badge>
               <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight font-heading">
                  {hp.rich("performance.title", { 
                     span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                     br: () => <br /> 
                  })}
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
               {Array.isArray(hp.raw("performance.items")) && (hp.raw("performance.items") as Array<{ title: string; description: string }>).map((advantage, i) => {
                  const icons = [Zap, Globe, Smartphone, Database, Cpu, Rocket];
                  const Icon = icons[i % icons.length];
                  return (
                     <div key={i} className="p-8 glass-card border border-border rounded-3xl space-y-4 hover:border-primary/30 transition-all group">
                        <div className="w-12 h-12 rounded-xl bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                           <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">{advantage.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{advantage.description}</p>
                     </div>
                  );
               })}
            </div>
         </div>
      </section>
   );
}
