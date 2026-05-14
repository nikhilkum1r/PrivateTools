"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export function Manifesto() {
   const hp = useTranslations("home");

   return (
      <section className="py-28 relative">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-12">
               <Badge className="bg-primary/10 text-primary border-primary/20 py-2 px-6 rounded-full font-semibold uppercase tracking-wider text-[10px]">{hp("manifesto.badge")}</Badge>
               <h2 className="text-6xl md:text-9xl font-extrabold tracking-tight font-heading leading-[0.8]">
                  {hp.rich("manifesto.title", { 
                     span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                     br: () => <br /> 
                  })}
               </h2>
               <p className="text-2xl md:text-4xl font-medium tracking-tight leading-tight opacity-80 max-w-4xl mx-auto">{hp("manifesto.description")}</p>
            </div>
         </div>
      </section>
   );
}
