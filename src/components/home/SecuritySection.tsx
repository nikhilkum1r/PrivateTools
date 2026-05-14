"use client";

import React from "react";
import { ShieldCheck, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

export function SecuritySection() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 bg-foreground text-background relative overflow-hidden">
         <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full opacity-100" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(var(--background-rgb), 0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[160px] rounded-full" />
         </div>

         <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-5xl mx-auto">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                     <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none font-heading">
                        {hp.rich("security.title", { 
                           span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                           br: () => <br /> 
                        })}
                     </h2>
                     <p className="text-xl text-background/70 leading-relaxed font-medium">
                        {hp("security.subtitle")}
                     </p>
                     <div className="space-y-4 pt-4">
                        {Array.isArray(hp.raw("security.items")) && (hp.raw("security.items") as string[]).map((item, i) => (
                           <div key={i} className="flex items-center gap-3 font-bold text-lg">
                              <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                              {item}
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="relative">
                     <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
                     <div className="relative bg-background/5 border border-background/10 p-12 rounded-3xl backdrop-blur-xl shadow-2xl space-y-8">
                        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-lg shadow-primary/15"><Shield className="w-10 h-10" /></div>
                        <div className="space-y-4">
                           <h3 className="text-3xl font-extrabold tracking-tight font-heading">{hp("security.zeroTrust.title")}</h3>
                           <p className="text-lg text-background/60 leading-relaxed">
                              {hp("security.zeroTrust.description")}
                           </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 rounded-2xl bg-background/5 border border-background/5 text-center">
                              <div className="text-2xl font-bold text-primary">AES-256</div>
                              <div className="text-[10px] uppercase font-semibold tracking-wider text-background/40">{hp("security.zeroTrust.encryption")}</div>
                           </div>
                           <div className="p-4 rounded-2xl bg-background/5 border border-background/5 text-center">
                              <div className="text-2xl font-bold text-primary">TLS 1.3</div>
                              <div className="text-[10px] uppercase font-semibold tracking-wider text-background/40">{hp("security.zeroTrust.protocol")}</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
