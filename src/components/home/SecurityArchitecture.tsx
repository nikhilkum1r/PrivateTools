"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function SecurityArchitecture() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm">
         <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center space-y-8">
               <h2 className="text-5xl font-extrabold tracking-tight font-heading">
                  {hp.rich("securityArchitecture.title", { 
                     span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                     br: () => <br /> 
                  })}
               </h2>
               <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                  {hp("securityArchitecture.subtitle")}
               </p>
               <div className="flex justify-center">
                  <Button variant="outline" className="rounded-full px-8 h-14 border-primary/30 text-primary font-semibold uppercase tracking-wider group">
                     {hp("securityArchitecture.button")}
                     <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
               </div>
            </div>
         </div>
      </section>
   );
}
