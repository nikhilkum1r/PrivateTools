"use client";

import React from "react";
import { ImageIcon, FileText, Binary, ShieldAlert, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeaturedCategories() {
   const hp = useTranslations("home");

   return (
      <section id="features" className="py-40">
         <div className="container mx-auto px-6">
            <div className="text-center space-y-6 mb-20">
               <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight font-heading">
                  {hp.rich("featuredCats.title", { 
                     span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                     br: () => <br /> 
                  })}
               </h2>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{hp("featuredCats.subtitle")}</p>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.isArray(hp.raw("featuredCats.items")) && (hp.raw("featuredCats.items") as Array<{ title: string; description: string; points: string[] }>).map((cat, i) => {
                   const icons = [ImageIcon, FileText, Binary, ShieldAlert, Terminal];
                   const Icon = icons[i % icons.length];
                   return (
                     <div key={i} className="p-10 rounded-[2.5rem] glass-card border border-border/50 hover:border-primary/30 transition-all group relative overflow-hidden text-left">
                        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform text-primary">
                           <Icon className="w-32 h-32" />
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                           <Icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold font-heading mb-4">{cat.title}</h3>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8">{cat.description}</p>
                        <div className="space-y-3">
                           {cat.points.map((point, pi) => (
                             <div key={pi} className="flex items-center gap-3 text-xs font-medium">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                {point}
                             </div>
                           ))}
                        </div>
                     </div>
                   );
                })}
             </div>
         </div>
      </section>
   );
}
