"use client";

import React from "react";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { tools } from "@/lib/tools-data";
import dynamic from "next/dynamic";
import { prefetchWasm } from "@/lib/wasm-prefetcher";

const TrustLayer = dynamic(() => import("@/components/shared/TrustLayer").then(mod => mod.TrustLayer), {
   ssr: false,
   loading: () => <div className="h-24 animate-pulse bg-secondary/20 rounded-3xl mx-6" />
});

interface HeroSectionProps {
   mounted: boolean;
   isDark: boolean;
   favorites: string[];
   recentTools: string[];
}

export function MainHero({
   mounted,
   isDark,
   favorites,
   recentTools
}: HeroSectionProps) {
   const common = useTranslations("common");
   const hp = useTranslations("home");
   const t_tools = useTranslations("tools");
   const router = useRouter();

   React.useEffect(() => {
      if (mounted) {
         // Prefetch critical WASM modules for better experience
         prefetchWasm('ffmpeg');
         prefetchWasm('pdf');
      }
   }, [mounted]);

   return (
      <section className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center pt-32 pb-32 lg:pt-48 lg:pb-48 bg-transparent">
         <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center max-w-[900px] mx-auto gap-12 md:gap-24">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="space-y-8 md:space-y-12 flex flex-col items-center"
               >

                  <div className="relative w-full">
                     <div className="absolute -inset-x-20 -top-20 -bottom-20 bg-primary/10 blur-[100px] rounded-full opacity-50 pointer-events-none" />
                     <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-[-0.04em] leading-[1.05] text-foreground font-heading">
                        {hp.rich("hero.title", {
                           span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>,
                           studio: (chunks: React.ReactNode) => (
                              <span className="text-transparent bg-clip-text [-webkit-background-clip:text] bg-gradient-to-r from-indigo-500 to-violet-500 dark:from-primary dark:to-violet-400 inline-block">
                                 {chunks}
                              </span>
                           ),
                           br: () => <br />
                        })}
                     </h1>
                  </div>
                  <p className="text-xl md:text-[1.25rem] text-foreground/82 max-w-[720px] leading-[1.8] font-medium mx-auto">
                     {hp("hero.description")}
                  </p>

                  <div className="flex flex-wrap justify-center items-center gap-5 pt-12">
                     <Button 
                        size="lg"
                        className="h-16 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-base uppercase tracking-wider shadow-xl shadow-indigo-500/20 group transition-all duration-300 hover:scale-[1.02]"
                        onClick={() => router.push("/tools")}
                     >
                        {hp("hero.getStarted")} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </Button>
                     <Link 
                        href="/philosophy" 
                        className="inline-flex items-center justify-center whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 h-16 px-10 rounded-2xl border border-border bg-secondary/30 dark:bg-secondary/10 backdrop-blur-xl text-foreground font-bold text-sm hover:bg-secondary/50 transition-all duration-500 hover:scale-[1.02]"
                     >
                        {hp("hero.browseAll")}
                     </Link>
                  </div>

                  <div className="pt-16 md:pt-24 w-full">
                     <TrustLayer />
                  </div>

                  {/* RETENTION BAR (Recently Used & Favorites) */}
                  <AnimatePresence>
                     {mounted && (favorites.length > 0 || recentTools.length > 0) && (
                        <motion.div
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="pt-12 flex flex-wrap justify-center items-center gap-8 border-t border-border/50"
                        >
                           {recentTools.length > 0 && (
                              <div className="flex items-center gap-4">
                                 <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> {hp("hero.recent")}
                                 </div>
                                 <div className="flex gap-2">
                                    {recentTools.map(href => {
                                       const tool = tools.find(t => t.href === href);
                                       if (!tool) return null;
                                       return (
                                          <Link key={href} href={href} className="px-3 py-1.5 rounded-lg glass-card border border-border hover:border-primary/30 transition-all flex items-center gap-2 group">
                                             <div className={cn("w-5 h-5 rounded bg-gradient-to-br flex items-center justify-center text-foreground text-[8px]", tool.color)}>
                                                <tool.icon className="w-2.5 h-2.5" />
                                             </div>
                                             <span className="text-[10px] font-semibold group-hover:text-primary transition-colors">{t_tools(`data.${tool.href}.title`)}</span>
                                          </Link>
                                       );
                                    })}
                                 </div>
                              </div>
                           )}

                           {favorites.length > 0 && (
                              <div className="flex items-center gap-4">
                                 <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> {hp("hero.favorites")}
                                 </div>
                                 <div className="flex gap-2">
                                    {favorites.map(href => {
                                       const tool = tools.find(t => t.href === href);
                                       if (!tool) return null;
                                       return (
                                          <Link key={href} href={href} className="px-3 py-1.5 rounded-lg glass-card border border-border hover:border-primary/30 transition-all flex items-center gap-2 group">
                                             <div className={cn("w-5 h-5 rounded bg-gradient-to-br flex items-center justify-center text-foreground text-[8px]", tool.color)}>
                                                <tool.icon className="w-2.5 h-2.5" />
                                             </div>
                                             <span className="text-[10px] font-semibold group-hover:text-primary transition-colors">{t_tools(`data.${tool.href}.title`)}</span>
                                          </Link>
                                       );
                                    })}
                                 </div>
                              </div>
                           )}
                        </motion.div>
                     )}
                  </AnimatePresence>
               </motion.div>


            </div>
         </div>
      </section>
   );
}
