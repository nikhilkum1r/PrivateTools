"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, 
  Search,
  CheckCircle2,
  FileCode,
  Globe,
  Smartphone,
  Apple,
  Grid,
  Palette,
  Copy,
  Code2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdUnit } from "@/components/shared/AdUnit";
import { toast } from "sonner";

interface GeneratedIcon {
  name: string;
  url: string;
  size: number;
  width?: number;
  height?: number;
  platform: 'web' | 'android' | 'ios' | 'pwa' | 'social' | 'all';
  scale?: string;
}

interface IconResultGridProps {
  t: any;
  results: GeneratedIcon[];
  activePlatform: 'all' | 'web' | 'android' | 'ios' | 'social';
  setActivePlatform: (platform: any) => void;
  downloadAll: (items?: GeneratedIcon[]) => void;
}

export function IconResultGrid({
  t,
  results,
  activePlatform,
  setActivePlatform,
  downloadAll
}: IconResultGridProps) {
  const [activeFormat, setActiveFormat] = React.useState('all');

  const filteredResults = results.filter(r => {
    const platformMatch = activePlatform === 'all' || r.platform === activePlatform;
    
    let formatMatch = activeFormat === 'all';
    if (activeFormat === 'images') {
      formatMatch = !r.name.toLowerCase().endsWith('.xml');
    } else if (activeFormat !== 'all') {
      formatMatch = r.name.toLowerCase().endsWith(`.${activeFormat.toLowerCase()}`);
    }
    
    return platformMatch && formatMatch;
  });

  return (
    <div className="w-full flex flex-col gap-8 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-border/30">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold tracking-tight uppercase font-heading">{t("results.title")}</h3>
          <p className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">{t("results.subtitle")}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 p-1 bg-secondary/20 rounded-2xl border border-border/40">
              {[
                { id: 'all', i: Grid, l: 'All Platforms' },
                { id: 'web', i: Globe, l: 'Web' },
                { id: 'ios', i: Apple, l: 'iOS' },
                { id: 'android', i: Smartphone, l: 'Android' },
                { id: 'social', i: Palette, l: 'Social' }
              ].map(p => (
                <Button
                  key={p.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-xl text-[8px] font-bold uppercase tracking-widest px-4 h-8 transition-all",
                    activePlatform === p.id ? "bg-primary text-white shadow-lg" : "hover:bg-primary/10 text-muted-foreground"
                  )}
                  onClick={() => setActivePlatform(p.id as any)}
                >
                  <p.i className="w-3 h-3 mr-2" /> {p.l}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2 p-1 bg-secondary/10 rounded-2xl border border-border/20 self-end">
              {['all', 'images', 'png', 'ico', 'svg', 'webp', 'xml'].map(f => (
                <Button
                  key={f}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "rounded-xl text-[7px] font-black uppercase tracking-[0.2em] px-3 h-6 transition-all",
                    activeFormat === f ? "bg-foreground text-background" : "hover:bg-foreground/5 text-muted-foreground/60"
                  )}
                  onClick={() => setActiveFormat(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
          
          <Button 
            className="h-12 rounded-2xl bg-emerald-500 text-white font-bold uppercase tracking-widest text-[10px] px-8 gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 group/dl-all"
            onClick={() => {
              // If filters are active, only download filtered results
              const itemsToDownload = (activePlatform !== 'all' || activeFormat !== 'all') ? filteredResults : results;
              downloadAll(itemsToDownload);
            }}
          >
            <Download className="w-4 h-4 group-hover/dl-all:translate-y-1 transition-transform" /> 
            {(activePlatform !== 'all' || activeFormat !== 'all') 
              ? `Download ${filteredResults.length} Filtered` 
              : t("results.download_all")}
          </Button>
        </div>
      </div>

      <AdUnit slot="2345678901" className="w-full" />

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredResults.map((icon, i) => (
            <motion.div
              key={`Icon-${i}-${icon.name}-${icon.platform}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative"
            >
              <div className="aspect-square rounded-[2rem] glass-card border border-border/40 overflow-hidden flex items-center justify-center p-6 hover:border-primary/50 transition-all duration-500 shadow-xl shadow-primary/5 group-hover:shadow-primary/10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <img 
                  src={icon.url} 
                  alt={icon.name} 
                  className={cn(
                    "w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110",
                    icon.size < 32 && "image-pixelated"
                  )} 
                />
                
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] font-bold tracking-widest uppercase">
                    {icon.width}x{icon.height || icon.width}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-10 h-10 rounded-xl bg-white/5 border-white/10 text-white hover:bg-primary hover:border-primary transition-all"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = icon.url;
                      link.download = icon.name;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast.success(t("toasts.exported"));
                    }}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 space-y-1 px-2">
                <p className="text-[10px] font-bold tracking-tight truncate uppercase italic text-muted-foreground/60">{icon.name}</p>
                <div className="flex items-center justify-between">
                   <span className="text-[8px] font-bold text-primary tracking-widest uppercase">{icon.platform}</span>
                   {icon.scale && <span className="text-[8px] font-bold text-muted-foreground/40">{icon.scale}</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
