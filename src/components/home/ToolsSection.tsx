"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Command, Cpu, ShieldCheck, Heart, Sparkles, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CATEGORIES, Category, Tool } from "@/lib/tools-data";

interface ToolsSectionProps {
   search: string;
   setSearch: (val: string) => void;
   activeCategory: Category;
   setActiveCategory: (cat: Category) => void;
   filteredTools: Tool[];
   favorites: string[];
   toggleFavorite: (href: string) => void;
   trackUsage: (href: string) => void;
}

export function ToolsSection({
   search,
   setSearch,
   activeCategory,
   setActiveCategory,
   filteredTools,
   favorites,
   toggleFavorite,
   trackUsage
}: ToolsSectionProps) {
   const common = useTranslations("common");
   const hp = useTranslations("home");
   const t_tools = useTranslations("tools");

   return (
      <section id="tools" data-google-ads-ignore="true" className="py-24 bg-secondary/80 backdrop-blur-sm border-y border-border">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
               <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight leading-[1.1] uppercase font-heading">
                  {hp.rich("toolsSection.title", { span: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>, br: () => <br /> })}
               </h2>

               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex items-center glass-card border border-border rounded-2xl p-2 pr-4 shadow-xl">
                     <div className="pl-6 text-muted-foreground"><Search className="w-6 h-6" /></div>
                     <Input
                        placeholder={hp("toolsSection.searchPlaceholder")}
                        className="bg-transparent border-none focus-visible:ring-0 text-xl h-16 font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                     />
                     <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary/80 backdrop-blur-sm rounded-xl text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                        <Command className="w-3 h-3" /> {common("keyboardShortcut")}
                     </div>
                  </div>
               </div>

               {/* PRIVACY COMMAND CENTER (Live Feed) */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                  <div className="md:col-span-2 p-8 rounded-2xl glass-card backdrop-blur-xl border border-border/50 text-left space-y-6 relative overflow-hidden group">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                           <div className="text-[10px] font-semibold uppercase tracking-wider opacity-60">{hp("privacyEngine.liveFeed.label")}</div>
                        </div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-primary font-heading">{hp("privacyEngine.liveFeed.verified")}</div>
                     </div>
                     <div className="space-y-3 font-mono text-[11px] leading-relaxed opacity-80">
                         {(() => {
                            try {
                               const logs = hp.raw("privacyEngine.liveFeed.logs");
                               if (!Array.isArray(logs)) return null;
                               return logs.map((log: any, li: number) => (
                                  <div key={li} className="flex gap-4">
                                     <span className="text-primary/40 shrink-0">[00:00:0{li}]</span>
                                     <span dangerouslySetInnerHTML={{ __html: String(log).replace("READY", `<span class='text-emerald-500'>${common("status.ready")}</span>`).replace("BLOCKED", `<span class='text-red-500'>${common("status.blocked")}</span>`).replace("SUCCESS", `<span class='text-emerald-500'>${common("status.success")}</span>`) }} />
                                  </div>
                               ));
                            } catch (e) {
                               return null;
                            }
                          })()}
                     </div>
                     <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <Cpu className="w-64 h-64" />
                     </div>
                  </div>
                  <div className="p-8 rounded-2xl bg-primary text-primary-foreground space-y-6 flex flex-col justify-between text-left relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-32 h-32" />
                     </div>
                     <div className="space-y-4">
                        <div className="text-3xl font-bold font-heading tracking-tight leading-none">
                           {hp("privacyEngine.sovereignty.title").split(' ').map((word, i) => i === 3 ? <React.Fragment key={i}><br />{word}</React.Fragment> : word + ' ')}
                        </div>
                        <p className="text-xs font-medium opacity-80 leading-relaxed">{hp("privacyEngine.sovereignty.description")}</p>
                     </div>
                     <Button variant="outline" className="w-full bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground font-semibold uppercase tracking-wider text-[10px] rounded-2xl">{hp("privacyEngine.sovereignty.button")}</Button>
                  </div>
               </div>

               <div className="flex flex-wrap items-center justify-center gap-2">
                  {CATEGORIES.map((cat) => (
                     <motion.button
                        key={cat}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                           "px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2",
                           activeCategory === cat ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "glass-card text-muted-foreground border border-border hover:bg-secondary/80 backdrop-blur-sm"
                        )}
                     >
                        {activeCategory === cat && <Sparkles className="w-3.5 h-3.5 animate-pulse" />}
                        {t_tools(`categories.${cat}`)}
                     </motion.button>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12 animate-fade-in">
                  {filteredTools.map((tool, i) => (
                     <ToolCard 
                        key={tool.href}
                        tool={tool} 
                        i={i} 
                        favorites={favorites} 
                        toggleFavorite={toggleFavorite} 
                        trackUsage={trackUsage}
                        t_tools={t_tools}
                     />
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}

function ToolCard({ tool, i, favorites, toggleFavorite, trackUsage, t_tools }: { 
   tool: Tool; 
   i: number; 
   favorites: string[]; 
   toggleFavorite: (href: string) => void; 
   trackUsage: (href: string) => void;
   t_tools: any;
}) {
   return (
      <div
         className="animate-fade-up"
         style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
      >
         <Card className="group h-full p-8 rounded-2xl glass-card border-border hover:border-primary/40 transition-all hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)] relative overflow-hidden text-left">
            <button
               onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFavorite(tool.href);
               }}
               aria-label="Toggle favorite"
               className="absolute top-8 right-8 z-20 w-10 h-10 rounded-xl bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm flex items-center justify-center hover:bg-pink-500/10 hover:text-pink-500 transition-all"
            >
               <Heart className={cn("w-5 h-5 transition-all", favorites.includes(tool.href) ? "fill-pink-500 text-pink-500" : "text-muted-foreground")} />
            </button>

            <Link href={tool.href} onClick={() => trackUsage(tool.href)}>
               <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg", tool.color)}>
                  <tool.icon className="w-7 h-7 text-foreground" />
               </div>
               <div className="space-y-4">
                  <div className="flex items-center gap-2">
                     <Badge variant="outline" className="text-[10px] uppercase font-semibold tracking-wider bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm border-border/50">{t_tools(`categories.${tool.cat}`)}</Badge>
                     {tool.cat === "Security" && (
                        <Badge className="text-[9px] uppercase font-semibold tracking-wider bg-emerald-500/10 text-emerald-500 border-emerald-500/20 border">E2E</Badge>
                     )}
                     {tool.cat === "Media" && (
                        <Badge className="text-[9px] uppercase font-semibold tracking-wider bg-violet-500/10 text-violet-400 border-violet-500/20 border">WASM</Badge>
                     )}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors font-heading">{t_tools(`data.${tool.href}.title`)}</h3>
                  <p className="text-muted-foreground font-medium leading-relaxed">{t_tools(`data.${tool.href}.desc`)}</p>
               </div>
               <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t_tools("openTool")}</span>
                  <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
               </div>
            </Link>
         </Card>
      </div>
   );
}
