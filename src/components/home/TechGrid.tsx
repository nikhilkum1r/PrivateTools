"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Sparkles, Video, ImageIcon, ScanText, Layers, Palette, FileSearch } from "lucide-react";
import { useTranslations } from "next-intl";

export function TechGrid() {
   const hp = useTranslations("home");

   return (
      <section className="py-24 glass-card border-y border-border relative overflow-hidden">
         <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-12">
               {Array.isArray(hp.raw("techMarquee.items")) && (hp.raw("techMarquee.items") as Array<{ name: string; desc: string }>).map((tech, i) => {
                  const techIcons = [Cpu, Sparkles, Video, ImageIcon, ScanText, Layers, Palette, FileSearch];
                  const Icon = techIcons[i % techIcons.length];
                  return (
                     <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="flex flex-col items-center text-center space-y-3 group"
                     >
                        <div className="w-12 h-12 rounded-2xl bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                           <Icon className="w-6 h-6" />
                        </div>
                        <div>
                           <div className="text-2xl section-header">{tech.name}</div>
                           <div className="text-[10px] font-semibold uppercase tracking-wider text-primary/40 group-hover:text-primary transition-colors">{tech.desc}</div>
                        </div>
                     </motion.div>
                  );
               })}
            </div>
         </div>
      </section>
   );
}
