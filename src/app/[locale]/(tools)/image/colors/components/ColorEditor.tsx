"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, Pipette, Loader2, RefreshCw, 
  FileDown, Copy, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { DropZone } from "@/components/shared/DropZone";
import { cn } from "@/lib/utils";

interface ColorSwatch {
  hex: string;
  rgb: string;
  hsl: string;
  isDark: boolean;
  type: "dominant" | "vibrant" | "muted" | "accent";
}

interface ColorEditorProps {
  t: any;
  common: any;
  file: File | null;
  preview: string | null;
  colors: ColorSwatch[];
  isProcessing: boolean;
  sampleRate: number;
  setSampleRate: (v: number) => void;
  mood: string;
  extractPalette: () => void;
  resetTool: () => void;
  exportFormat: "css" | "scss" | "json";
  setExportFormat: (v: "css" | "scss" | "json") => void;
  exportPalette: () => void;
  copyToClipboard: (text: string) => void;
  handleFilesDrop: (files: File[]) => void;
  showHarmony: string | null;
  setShowHarmony: (v: string | null) => void;
  getHarmonyColors: (hex: string) => any[];
  getContrastRatio: (hex: string) => any;
  imageRef: React.RefObject<HTMLImageElement | null>;
  toolSectionRef: React.RefObject<HTMLDivElement | null>;
}

export function ColorEditor({
  t, common, file, preview, colors, isProcessing, sampleRate, setSampleRate,
  mood, extractPalette, resetTool, exportFormat, setExportFormat,
  exportPalette, copyToClipboard, handleFilesDrop, showHarmony, setShowHarmony,
  getHarmonyColors, getContrastRatio, imageRef, toolSectionRef
}: ColorEditorProps) {
  return (
    <section ref={toolSectionRef} id="tool" className="px-6 py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight font-heading">{t("tool.title")}</h2>
          <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">{t("tool.engine")}</p>
        </div>

        <div className="relative group max-w-5xl mx-auto">
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent blur-md z-20 pointer-events-none"
                animate={{ top: ['0%', '100%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />
            )}
          </AnimatePresence>

          {!file ? (
            <div className="relative overflow-hidden rounded-3xl border border-border/40 hover:border-primary/50 transition-all duration-700 shadow-2xl glass-card">
              <DropZone
                onFilesDrop={handleFilesDrop}
                multiple={false}
                accept="image/*"
                title={t("tool.dropzoneTitle")}
                description={t("tool.dropzoneDesc")}
                className="h-80 border-none bg-transparent hover:bg-primary/[0.02] transition-colors"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-6">
                <Card className="p-1 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-primary/5 overflow-hidden">
                  <div className="relative aspect-square rounded-[31px] overflow-hidden bg-muted/40 group">
                    <img 
                      ref={imageRef}
                      src={preview!} 
                      crossOrigin="anonymous"
                      onLoad={extractPalette}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      alt="Source for color extraction" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Button variant="ghost" className="rounded-2xl text-red-500 hover:bg-red-500/10" onClick={resetTool}>
                          <Trash2 className="w-8 h-8" />
                       </Button>
                    </div>
                  </div>
                </Card>

                 <Card className="p-8 rounded-2xl glass-card border-border/40 space-y-8">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{t("tool.precision")}</Label>
                        <p className="text-xs font-mono font-bold text-primary">{sampleRate}{common("units.px")}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <Label className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{t("tool.mood")}</Label>
                        <p className="text-xs font-bold text-emerald-500 uppercase">{mood}</p>
                      </div>
                   </div>
                   
                   <Slider 
                      value={[sampleRate]} 
                      min={1} max={50} step={1} 
                      onValueChange={(v) => setSampleRate(Array.isArray(v) ? v[0] : v)}
                      className="py-2"
                   />

                   <div className="grid grid-cols-1 gap-3">
                      <Button 
                        variant="outline"
                        className="h-14 rounded-2xl border-border bg-secondary/50 font-semibold uppercase tracking-wider text-xs gap-3 hover:bg-secondary transition-all"
                        onClick={extractPalette}
                        disabled={isProcessing}
                      >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                        {t("tool.regenerate")}
                      </Button>
                   </div>
                </Card>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <header className="flex flex-col gap-6 p-8 rounded-2xl glass-card border border-border/40">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <h3 className="text-xl font-bold tracking-tight">{t("tool.paletteTitle")}</h3>
                      <p className="text-[10px] text-muted-foreground/40 font-semibold uppercase tracking-wider">{colors.length} {t("tool.swatches")}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex p-1 bg-secondary/50 border border-border rounded-xl">
                        {(["css", "scss", "json"] as const).map(fmt => (
                          <button 
                            key={fmt} 
                            onClick={() => setExportFormat(fmt)} 
                            className={cn(
                              "px-4 h-9 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all relative overflow-hidden", 
                              exportFormat === fmt 
                                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-105 z-10" 
                                : "text-muted-foreground/50 hover:text-emerald-500 hover:bg-emerald-500/5"
                            )}
                          >
                            {fmt}
                            {exportFormat === fmt && (
                              <motion.div 
                                layoutId="activeExportTab"
                                className="absolute inset-0 bg-emerald-600 opacity-20 blur-lg"
                                initial={false}
                              />
                            )}
                          </button>
                        ))}
                      </div>
                      <Button variant="outline" className="h-11 px-6 rounded-xl border-border bg-secondary/50 text-foreground font-bold gap-2 hover:bg-secondary transition-all text-xs" onClick={exportPalette}>
                        <FileDown className="w-4 h-4" /> {t("tool.export")}
                      </Button>
                    </div>
                  </div>

                  <div className="flex h-12 w-full rounded-2xl overflow-hidden shadow-inner bg-secondary/20 border border-border/40">
                     {colors.map((c, i) => (
                       <motion.div 
                         key={c.hex}
                         className="h-full flex-grow cursor-pointer group relative"
                         style={{ backgroundColor: c.hex }}
                         initial={{ flexGrow: 0 }}
                         animate={{ flexGrow: 1 }}
                         onClick={() => copyToClipboard(c.hex)}
                       >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/20 flex items-center justify-center transition-opacity">
                             <Copy className={cn("w-4 h-4", c.isDark ? "text-white" : "text-black")} />
                          </div>
                       </motion.div>
                     ))}
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <AnimatePresence mode="popLayout">
                      {colors.map((c, i) => (
                        <motion.div
                          key={c.hex}
                          layout
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Card 
                            className="group p-5 rounded-[24px] glass-card border border-border/40 flex flex-col gap-4 hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden"
                            onClick={() => copyToClipboard(c.hex)}
                          >
                             <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl border-4 border-border/50 shadow-2xl shrink-0 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden" style={{ backgroundColor: c.hex }}>
                                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                                      <Copy className={cn("w-6 h-6", c.isDark ? "text-foreground" : "text-black")} />
                                   </div>
                                </div>
                                <div className="flex-grow min-w-0 space-y-1">
                                   <div className="flex items-center justify-between">
                                      <p className="font-bold text-xl tracking-tight uppercase">{c.hex}</p>
                                      <Badge className={cn(
                                        "text-[8px] font-bold border-none px-2 h-5 uppercase tracking-wider rounded-full",
                                       c.type === "dominant" ? "bg-primary text-primary-foreground" :
                                        c.type === "vibrant" ? "bg-blue-600 text-white" :
                                        c.type === "muted" ? "bg-secondary text-muted-foreground/60" :
                                        "bg-orange-600 text-white"
                                      )}>{t(`tool.types.${c.type}`)}</Badge>
                                   </div>
                                   <div className="flex gap-2 opacity-30 text-[8px] font-semibold uppercase tracking-wider">
                                      <span>{c.rgb}</span>
                                      <span>{c.hsl}</span>
                                   </div>
                                   {(() => { const cr = getContrastRatio(c.hex); return (
                                      <div className="flex gap-1.5 pt-1">
                                        <span className={cn("px-2 py-0.5 rounded-md text-[8px] font-bold", cr.passAAA ? "bg-emerald-500/20 text-emerald-400" : cr.passAA ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400")}>
                                          {t("contrast.title")} {cr.passAAA ? "AAA" : cr.passAA ? "AA" : t("contrast.fail")}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md text-[8px] font-bold bg-secondary/50 text-muted-foreground/50">{t("contrast.white")}: {cr.onWhite}</span>
                                        <span className="px-2 py-0.5 rounded-md text-[8px] font-bold bg-muted/40 text-muted-foreground/50">{t("contrast.black")}: {cr.onBlack}</span>
                                      </div>
                                   ); })()}
                                </div>
                             </div>
                             
                             <div className="flex gap-2 pt-3 border-t border-border/20">
                                <button onClick={(e) => { e.stopPropagation(); copyToClipboard(c.hex); }} className="flex-1 text-[9px] font-semibold uppercase tracking-wider py-2 rounded-lg bg-secondary/30 hover:bg-primary/20 hover:text-primary transition-all">{t("tool.hex")}</button>
                                <button onClick={(e) => { e.stopPropagation(); copyToClipboard(c.rgb); }} className="flex-1 text-[9px] font-semibold uppercase tracking-wider py-2 rounded-lg bg-secondary/30 hover:bg-primary/20 hover:text-primary transition-all">{t("tool.rgb")}</button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setShowHarmony(showHarmony === c.hex ? null : c.hex); }} 
                                  className={cn(
                                    "flex-1 text-[9px] font-semibold uppercase tracking-wider py-2 rounded-lg transition-all",
                                    showHarmony === c.hex ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-secondary/30 hover:bg-emerald-500/20 hover:text-emerald-500"
                                  )}
                                >
                                  {t("tool.harmony")}
                                </button>
                             </div>

                             {showHarmony === c.hex && (
                               <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 pt-1">
                                 {getHarmonyColors(c.hex).map(h => (
                                   <div key={h.label} className="flex-1 text-center space-y-1" onClick={(e) => { e.stopPropagation(); copyToClipboard(h.hex); }}>
                                     <div className="w-full h-8 rounded-lg border border-border/40 cursor-pointer hover:scale-105 transition-transform" style={{ backgroundColor: h.hex }} />
                                     <p className="text-[6px] font-semibold uppercase tracking-wider opacity-30">{h.label}</p>
                                   </div>
                                 ))}
                               </motion.div>
                             )}
                          </Card>
                        </motion.div>
                      ))}
                   </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
