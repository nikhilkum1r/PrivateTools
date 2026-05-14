"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

export function DeveloperSection() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 bg-background relative overflow-hidden">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
               <div className="space-y-8 text-left">
                  <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-semibold tracking-wider text-[10px]">{hp("devSection.badge")}</Badge>
                  <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight font-heading">
                     {hp.rich("devSection.title", { 
                        span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, 
                        br: () => <br /> 
                     })}
                  </h2>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                     {hp("devSection.description")}
                  </p>
                  <div className="grid grid-cols-2 gap-8">
                     <div>
                        <div className="text-4xl font-extrabold tracking-tight text-foreground font-heading">0ms</div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{hp("devSection.stats.latency")}</div>
                     </div>
                     <div>
                        <div className="text-4xl font-extrabold tracking-tight text-foreground font-heading">100%</div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">{hp("devSection.stats.engine")}</div>
                     </div>
                  </div>
               </div>

               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative glass-card rounded-3xl border border-border overflow-hidden shadow-2xl">
                     <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm">
                        <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-500/20" />
                           <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                           <div className="w-3 h-3 rounded-full bg-green-500/20" />
                        </div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider opacity-40">safe-tools-engine.ts</div>
                     </div>
                     <div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto text-left">
                        <div className="flex gap-4">
                           <span className="opacity-30">01</span>
                           <span className="text-blue-400">import</span> <span className="text-foreground">{`{ WorkerPool }`}</span> <span className="text-blue-400">from</span> <span className="text-emerald-400">"@safetools/core"</span>;
                        </div>
                        <div className="flex gap-4">
                           <span className="opacity-30">02</span>
                           <span></span>
                        </div>
                        <div className="flex gap-4">
                           <span className="opacity-30">03</span>
                           <span className="text-blue-400">const</span> <span className="text-yellow-400">engine</span> <span className="text-foreground">=</span> <span className="text-blue-400">new</span> <span className="text-yellow-400">WorkerPool</span>({`{`}
                        </div>
                        <div className="flex gap-4">
                           <span className="opacity-30">04</span>
                           <span className="pl-4 text-foreground">strategy:</span> <span className="text-emerald-400">"local-only"</span>,
                        </div>
                        <div className="flex gap-4">
                           <span className="opacity-30">05</span>
                           <span className="pl-4 text-foreground">sandbox:</span> <span className="text-blue-400">true</span>,
                        </div>
                        <div className="flex gap-4">
                           <span className="opacity-30">06</span>
                           <span className="text-foreground">{`});`}</span>
                        </div>
                        <div className="flex gap-4">
                           <span className="opacity-30">07</span>
                           <span></span>
                        </div>
                        <div className="flex gap-4">
                           <span className="opacity-30">08</span>
                           <span className="text-blue-400">const</span> <span className="text-yellow-400">result</span> <span className="text-foreground">=</span> <span className="text-blue-400">await</span> <span className="text-yellow-400">engine</span>.<span className="text-yellow-400">process</span>(file);
                        </div>
                        <div className="flex gap-4">
                           <span className="opacity-30">09</span>
                           <span className="text-pink-400">{hp("devSection.codeComment")}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
