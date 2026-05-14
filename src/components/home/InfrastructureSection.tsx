"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, ShieldCheck, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export function InfrastructureSection() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 relative overflow-hidden cv-auto">
         <h2 className="sr-only">Technical Infrastructure</h2>
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
               {Array.isArray(hp.raw("infra")) && (hp.raw("infra") as Array<{ title: string; description: string }>).map((item, i) => {
                  const icons = [Cpu, ShieldCheck, Zap];
                  const Icon = icons[i % icons.length];
                  return (
                    <motion.div
                       key={i}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: i * 0.1 }}
                       className="p-8 rounded-2xl glass-card border border-border/50 hover:border-primary/30 transition-all group"
                    >
                       <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <Icon className="w-7 h-7 text-primary" />
                       </div>
                       <h3 className="text-xl font-bold tracking-tight mb-4 font-heading">{item.title}</h3>
                       <p className="text-muted-foreground font-medium leading-relaxed">{item.description}</p>
                    </motion.div>
                  );
               })}
            </div>
         </div>
      </section>
   );
}
