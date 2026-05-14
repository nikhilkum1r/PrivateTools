"use client";

import React from "react";
import { useTranslations } from "next-intl";

export function CommunityStats() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm border-y border-border">
         <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="space-y-4 text-center md:text-left">
                  <h2 className="text-4xl font-extrabold tracking-tight font-heading">
                     {hp.rich("communityStats.title", { 
                        span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                        br: () => <br /> 
                     })}
                  </h2>
                  <p className="text-muted-foreground font-medium max-w-md">{hp("communityStats.subtitle")}</p>
               </div>
               <div className="grid grid-cols-2 gap-12">
                  <div className="text-center">
                     <div className="text-5xl font-extrabold tracking-tight font-heading">{hp("communityStats.processedCount")}</div>
                     <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{hp("communityStats.processed")}</div>
                  </div>
                  <div className="text-center">
                     <div className="text-5xl font-extrabold tracking-tight font-heading">{hp("communityStats.usersCount")}</div>
                     <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{hp("communityStats.users")}</div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
