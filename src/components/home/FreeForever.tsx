"use client";

import React from "react";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FreeForever() {
   const hp = useTranslations("home");

   return (
      <section id="pricing" className="py-24 relative overflow-hidden bg-background/50 backdrop-blur-sm">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-secondary/30 to-secondary/10 border border-border/50 p-12 md:p-20 text-center space-y-8 relative">
               <div className="absolute top-0 right-0 p-12 opacity-5">
                  <Rocket className="w-40 h-40" />
               </div>
               <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6">{hp("pricingSection.badge")}</Badge>
               <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight font-heading">
                  {hp.rich("pricingSection.title", { 
                     span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                     br: () => <br /> 
                  })}
               </h2>
               <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                  {hp("pricingSection.description")}
               </p>
               <div className="pt-8">
                  <Link href="/tools">
                     <Button className="h-16 px-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xl font-semibold uppercase tracking-wider shadow-lg shadow-primary/10">
                        {hp("pricingSection.button")}
                     </Button>
                  </Link>
               </div>
            </div>
         </div>
      </section>
   );
}
