"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Search, 
  ImageIcon, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Video, 
  Lock, 
  FileSearch, 
  Languages, 
  QrCode, 
  Type,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Filter,
  Grid,
  Cpu,
  Layout,
  Code,
  Layers,
  Wand2,
  ScanText,
  FileDigit,
  Trash2,
  HardDrive,
  Command
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { tools, CATEGORIES } from "@/lib/tools-data";

export default function ToolsClient() {
  const t = useTranslations("toolsHub");
  const t_tools = useTranslations("tools");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Map of categories to icons and colors
  const catConfig: Record<string, { icon: any, color: string, glow: string }> = {
    "All": { icon: Grid, color: "text-primary", glow: "from-primary/20 to-transparent" },
    "Creative": { icon: Sparkles, color: "text-purple-500", glow: "from-purple-500/20 to-transparent" },
    "Documents": { icon: FileText, color: "text-emerald-500", glow: "from-emerald-500/20 to-transparent" },
    "Media": { icon: Video, color: "text-rose-500", glow: "from-rose-500/20 to-transparent" },
    "Security": { icon: ShieldCheck, color: "text-amber-500", glow: "from-amber-500/20 to-transparent" },
    "Dev": { icon: Code, color: "text-slate-500", glow: "from-slate-500/20 to-transparent" }
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = 
      t_tools(`data.${tool.href}.title`).toLowerCase().includes(search.toLowerCase()) || 
      t_tools(`data.${tool.href}.desc`).toLowerCase().includes(search.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = activeCategory === "All" || tool.cat === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group by category for the grid view
  const groupedTools = CATEGORIES.slice(1).map(catName => ({
    name: catName,
    tools: filteredTools.filter(t => t.cat === catName)
  })).filter(group => group.tools.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-48 pb-20 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full" />
          </div>

          <div className="container mx-auto px-6 relative z-10 text-center space-y-16">
             <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="space-y-8"
             >
                <div className="flex justify-center">
                  <Badge variant="outline" className="py-2.5 px-8 rounded-full border-primary/20 bg-primary/5 text-primary font-bold uppercase tracking-[0.2em] text-[10px] shadow-sm backdrop-blur-md">
                    <Zap className="w-3 h-3 mr-2 inline-block animate-pulse" />
                    {t("hero.badge")}
                  </Badge>
                </div>
                <h1 className="text-7xl md:text-[10rem] font-black tracking-[-0.04em] uppercase font-heading leading-[0.85] text-foreground">
                  {t.rich("hero.title", {
                    span: (chunks: React.ReactNode) => <span className="text-primary italic drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.35)]">{chunks}</span>,
                    br: () => <br />
                  })}
                </h1>
                
                {/* Enhanced Search Interface */}
                <div className="max-w-3xl mx-auto relative group pt-10">
                   <div className="absolute -inset-2 bg-gradient-to-r from-primary/50 via-blue-500/50 to-purple-600/50 rounded-[36px] blur-xl opacity-0 group-hover:opacity-40 transition-all duration-1000 group-focus-within:opacity-50" />
                   <div className="relative flex items-center">
                      <div className="absolute left-8 text-muted-foreground group-focus-within:text-primary transition-colors">
                        <Search className="w-6 h-6" />
                      </div>
                      <Input 
                        placeholder={t("hero.search")} 
                        className="h-24 pl-20 pr-12 rounded-[32px] bg-card/80 border-border/50 shadow-2xl text-2xl font-medium focus-visible:ring-primary/20 focus-visible:border-primary/30 backdrop-blur-xl transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <div className="absolute right-8 px-4 py-2 rounded-xl bg-secondary/80 text-[11px] font-black text-muted-foreground border border-border/50 uppercase tracking-[0.15em] pointer-events-none hidden md:flex items-center gap-2">
                        <Command className="w-3 h-3" /> K
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        </section>

        {/* CATEGORY NAV - Sticky */}
        <div className="sticky top-[80px] z-40 bg-background/80 backdrop-blur-xl border-y border-border/50 shadow-sm">
          <div className="container mx-auto px-6 overflow-x-auto no-scrollbar py-4">
            <div className="flex items-center justify-center gap-3 min-w-max">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-500 font-bold text-sm tracking-tight border",
                    activeCategory === cat 
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105" 
                      : "bg-secondary/20 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  {catConfig[cat] && React.createElement(catConfig[cat].icon, { className: "w-4 h-4" })}
                  {t_tools(`categories.${cat}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TOOLS DIRECTORY */}
        <section className="py-24 pb-40">
           <div className="container mx-auto px-6 max-w-7xl">
              <div className="space-y-48">
                 <AnimatePresence mode="popLayout">
                   {groupedTools.map((group, ci) => (
                     <motion.div 
                       key={group.name} 
                       layout
                       initial={{ opacity: 0, y: 40 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true, margin: "-50px" }}
                       transition={{ duration: 0.6, delay: ci * 0.1 }}
                       className="space-y-20"
                     >
                        {/* Category Header */}
                        <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-border/50 pb-16 relative">
                           <div className="absolute -left-20 top-0 w-1 h-full bg-gradient-to-b from-primary to-transparent opacity-30" />
                           <div className="flex items-start gap-10">
                              <div className={cn(
                                "w-24 h-24 rounded-[40px] flex items-center justify-center shadow-2xl border bg-background relative overflow-hidden group/cat",
                                catConfig[group.name]?.color
                              )}>
                                 <div className={cn("absolute inset-0 opacity-20 blur-2xl group-hover/cat:opacity-40 transition-opacity bg-gradient-to-br", catConfig[group.name]?.glow)} />
                                 {React.createElement(catConfig[group.name]?.icon || Grid, { className: "w-12 h-12 relative z-10" })}
                              </div>
                              <div className="space-y-4">
                                 <h2 className="text-6xl font-black font-heading tracking-[-0.05em] uppercase text-foreground leading-none">
                                   {t_tools(`categories.${group.name}`)}
                                 </h2>
                                 <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed">
                                   {t(`categories.${group.name.toLowerCase()}.subtitle`)}
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                             <div className="text-right">
                               <div className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                                 {group.tools.length} Tools Ready
                               </div>
                               <div className="flex gap-1.5 justify-end">
                                 {[1,2,3,4,5].map(i => (
                                   <div key={i} className={cn("w-2 h-2 rounded-full", i <= (group.tools.length / 5) ? "bg-primary" : "bg-border")} />
                                 ))}
                               </div>
                             </div>
                           </div>
                        </div>

                        {/* Tools Sub-Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                           {group.tools.map((tool, ti) => (
                             <Link key={tool.href} href={tool.href}>
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  whileHover={{ y: -12, scale: 1.02 }}
                                  viewport={{ once: true }}
                                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                  className="group p-12 rounded-[56px] bg-secondary/10 border border-border/40 hover:bg-card hover:border-primary/30 transition-all shadow-sm hover:shadow-3xl hover:shadow-primary/5 h-full flex flex-col relative overflow-hidden backdrop-blur-sm"
                                >
                                   {/* Decorative Background Icon */}
                                   <div className="absolute -top-10 -right-10 p-12 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-1000 -rotate-12 group-hover:rotate-6 group-hover:scale-150 text-primary">
                                      {React.createElement(tool.icon, { className: "w-48 h-48" })}
                                   </div>
                                   
                                   {/* Tool Info */}
                                   <div className="space-y-8 relative z-10 flex-grow">
                                      <div className={cn(
                                        "w-16 h-16 rounded-[24px] flex items-center justify-center bg-background border border-border group-hover:border-primary/40 group-hover:text-primary transition-all duration-500 shadow-xl shadow-black/5",
                                        catConfig[group.name]?.color
                                      )}>
                                        {React.createElement(tool.icon, { className: "w-7 h-7" })}
                                      </div>
                                      <div className="space-y-4">
                                        <h3 className="text-3xl font-black font-heading group-hover:text-primary transition-colors tracking-tight leading-none uppercase">
                                          {t_tools(`data.${tool.href}.title`)}
                                        </h3>
                                        <p className="text-muted-foreground/80 text-base font-medium leading-relaxed line-clamp-3">
                                          {t_tools(`data.${tool.href}.desc`)}
                                        </p>
                                      </div>
                                   </div>
                                   
                                   {/* Action Footer */}
                                   <div className="pt-12 relative z-10 flex items-center justify-between mt-auto">
                                      <div className="flex items-center gap-3 text-primary text-[11px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-x-[-15px] group-hover:translate-x-0 transition-all duration-700">
                                         Launch Tool <ArrowRight className="w-5 h-5 animate-pulse" />
                                      </div>
                                      <div className="w-12 h-12 rounded-[20px] bg-secondary/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-45 transition-all duration-700 shadow-lg">
                                        <ChevronRight className="w-6 h-6" />
                                      </div>
                                   </div>
                                </motion.div>
                             </Link>
                           ))}
                        </div>
                     </motion.div>
                   ))}
                 </AnimatePresence>
              </div>

              {/* EMPTY STATE */}
              <AnimatePresence>
                {groupedTools.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-60 space-y-12"
                  >
                     <div className="w-40 h-40 rounded-[48px] bg-secondary/20 border border-border border-dashed flex items-center justify-center mx-auto text-muted-foreground relative">
                        <Search className="w-16 h-16" />
                        <div className="absolute inset-0 rounded-[48px] border-4 border-primary/20 animate-ping opacity-20" />
                     </div>
                     <div className="space-y-6 max-w-2xl mx-auto">
                        <h3 className="text-5xl font-black font-heading tracking-tight text-foreground uppercase leading-tight">
                          {t("noResults.title", { search })}
                        </h3>
                        <p className="text-muted-foreground text-xl font-medium leading-relaxed">
                          {t("noResults.subtitle")}
                        </p>
                     </div>
                     <div className="pt-10">
                        <Link href="/feedback">
                           <Button size="lg" className="h-20 px-16 rounded-3xl bg-primary hover:bg-primary/90 font-black tracking-[0.2em] text-xs shadow-2xl shadow-primary/40 uppercase group">
                             {t("noResults.button")}
                             <Sparkles className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform" />
                           </Button>
                        </Link>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </section>

        {/* ECOSYSTEM CTA */}
        <section className="py-60 relative overflow-hidden bg-background">
           <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent" />
           <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-6xl mx-auto rounded-[100px] bg-card border border-border/50 p-24 md:p-40 text-center space-y-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 <div className="space-y-10">
                    <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto text-primary shadow-inner">
                       <Sparkles className="w-12 h-12" />
                    </div>
                    <h2 className="text-7xl md:text-9xl font-black tracking-[-0.05em] uppercase font-heading leading-tight italic text-foreground">
                      {t("cta.title")}
                    </h2>
                    <p className="text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
                      {t("cta.description")}
                    </p>
                 </div>
                 <div className="pt-12 flex justify-center">
                    <Link href="/contact">
                       <Button size="lg" className="h-24 px-20 rounded-[40px] bg-primary hover:bg-primary/90 font-black tracking-[0.3em] text-sm group shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.4)] uppercase">
                          {t("cta.button")} 
                          <ArrowRight className="ml-4 w-7 h-7 group-hover:translate-x-3 transition-transform duration-700" />
                       </Button>
                    </Link>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Helper icons for dynamic mapping
const RefreshCw = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);
