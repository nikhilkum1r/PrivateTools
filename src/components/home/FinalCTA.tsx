"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
   const hp = useTranslations("home");

   return (
      <section className="py-28 relative overflow-hidden bg-primary text-primary-foreground">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--primary-rgb),0.2),transparent_50%)]" />
         <div className="container mx-auto px-6 relative z-10 text-center space-y-12">
            <h2 className="text-6xl md:text-8xl font-extrabold tracking-tight font-heading">
               {hp.rich("finalCta.title", { 
                  span: (chunks: React.ReactNode) => <span className="opacity-60">{chunks}</span>, 
                  br: () => <br /> 
               })}
            </h2>
            <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto opacity-80">
               {hp("finalCta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link href="/tools">
                  <Button className="h-16 px-12 rounded-2xl bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-xl font-semibold uppercase tracking-wider shadow-2xl">
                     {hp("finalCta.launch")}
                  </Button>
               </Link>
               <Link href="/tools">
                  <Button variant="outline" className="h-16 px-12 rounded-2xl border-primary-foreground/20 hover:bg-primary-foreground/10 text-xl font-semibold uppercase tracking-wider backdrop-blur-xl">
                     {hp("finalCta.allTools")}
                  </Button>
               </Link>
            </div>
         </div>
      </section>
   );
}
