"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scissors, Layers, Play, Smartphone, AlertCircle, Zap, Loader2, 
  FileText, Trash2, CheckCircle2, Settings2, FileDown, 
  Download, ShieldCheck, Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropZone } from "@/components/shared/DropZone";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { AdUnit } from "@/components/shared/AdUnit";

interface SplitPdfEditorProps {
  t: any;
  file: any;
  setFile: (v: any) => void;
  splitMode: "fixed" | "range";
  setSplitMode: (v: "fixed" | "range") => void;
  fixedInterval: number;
  setFixedInterval: (v: number) => void;
  customRanges: string;
  setCustomRanges: (v: string) => void;
  isProcessing: boolean;
  progress: number;
  rangeError: string | null;
  setRangeError: (v: string | null) => void;
  pageSelStart: number | null;
  setPageSelStart: (v: number | null) => void;
  isZipping: boolean;
  handleFileDrop: (files: File[]) => void;
  splitPdf: () => void;
  downloadAll: () => void;
  estimatedParts: number;
}

export function SplitPdfEditor({
  t, file, setFile, splitMode, setSplitMode, fixedInterval, setFixedInterval,
  customRanges, setCustomRanges, isProcessing, progress, rangeError, setRangeError,
  pageSelStart, setPageSelStart, isZipping, handleFileDrop, splitPdf, downloadAll,
  estimatedParts
}: SplitPdfEditorProps) {

  if (!file) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 md:p-12 relative z-10 w-full min-h-[500px]">
        {/* Dark Background Overlay for depth */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-0" />
        
        <div className="max-w-2xl w-full space-y-8 relative z-10">
          <div className="glass-card bg-black/20 border-border/50 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl">
            <></>
            <DropZone 
              onFilesDrop={handleFileDrop} 
              accept=".pdf" 
              multiple={false} 
              className="h-64 md:h-80 border-dashed border-blue-500/10 hover:border-blue-500/30 bg-white/5 rounded-3xl transition-all group" 
            />
          </div>
          <div className="flex justify-center">
             <p className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-[0.2em] flex items-center gap-2">
               <ShieldCheck className="w-3 h-3" /> Privacy-First Browser-Based Extraction
             </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col lg:flex-row w-full h-full min-h-[500px] relative">
      {/* Intense Background Overlay */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-0 pointer-events-none" />

      {/* Left Sidebar: Compact Control Panel */}
      <aside className="flex w-full lg:w-[300px] border-b lg:border-b-0 lg:border-r border-white/5 flex-col shrink-0 relative z-10 bg-black/20 backdrop-blur-2xl">
        <div className="p-4 border-b border-white/5 bg-white/5 space-y-1">
          <p className="text-[9px] font-bold text-blue-500/60 uppercase tracking-[0.2em] leading-none mb-1">{t("studio.source_ready")}</p>
          <h3 className="text-xs font-bold truncate text-foreground/90 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-blue-500/50" /> {file.file.name}
          </h3>
        </div>

        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-5">
            {/* Top Sidebar Ad - Premium Placement */}
            <div className="glass-card bg-white/[0.02] border border-white/5 p-2 rounded-xl shadow-inner overflow-hidden group mb-2">
              <></>
            </div>

            {/* Mode Toggle */}
            <div className="space-y-2">
              <Label className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest px-1">{t("studio.split_mode")}</Label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-black/40 rounded-xl border border-white/5">
                {(["fixed", "range"] as const).map(mode => (
                  <Button
                    key={mode}
                    size="sm"
                    variant={splitMode === mode ? "default" : "ghost"}
                    className={cn(
                      "rounded-lg text-[9px] font-black h-8 uppercase tracking-wider transition-all", 
                      splitMode === mode 
                        ? "bg-white/10 text-white shadow-xl shadow-white/5 border border-white/10" 
                        : "text-muted-foreground/50 hover:bg-white/5"
                    )}
                    onClick={() => setSplitMode(mode)}
                  >
                    {mode === "fixed" ? t("studio.by_interval") : t("studio.by_range")}
                  </Button>
                ))}
              </div>
            </div>

            {splitMode === "fixed" ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">{t("studio.pages_per_part")}</Label>
                  <span className="font-mono text-[10px] font-black text-blue-500/80">{fixedInterval}pg</span>
                </div>
                <Slider
                  value={[fixedInterval]}
                  min={1}
                  max={Math.max(2, file.pageCount)}
                  step={1}
                  onValueChange={v => setFixedInterval(Array.isArray(v) ? v[0] : v)}
                  className="py-1"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                    <p className="text-[7px] text-muted-foreground/40 font-bold uppercase tracking-widest mb-0.5">{t("studio.parts")}</p>
                    <p className="text-base font-black text-blue-500/70 tabular-nums">{estimatedParts}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                    <p className="text-[7px] text-muted-foreground/40 font-bold uppercase tracking-widest mb-0.5">{t("studio.per_part")}</p>
                    <p className="text-base font-black tabular-nums text-foreground/60">{fixedInterval}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Label className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest px-1">{t("studio.custom_ranges")}</Label>
                <div className="relative">
                  <Input
                    placeholder={t("studio.range_placeholder")}
                    value={customRanges}
                    onChange={e => { setCustomRanges(e.target.value); setRangeError(null); }}
                    className={cn(
                      "h-10 bg-black/40 border-white/5 rounded-xl px-3 font-mono text-xs focus:ring-blue-500/20 transition-all", 
                      rangeError && "border-red-500/30 bg-red-500/5"
                    )}
                  />
                  <Settings2 className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground/20 pointer-events-none" />
                </div>
                {rangeError && (
                  <p className="text-[9px] text-red-400/80 font-bold bg-red-500/5 p-2 rounded-lg border border-red-500/10">{rangeError}</p>
                )}
              </div>
            )}

            {/* Page Map: High Density */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">{t("studio.page_map")}</Label>
                <span className="text-[8px] font-bold text-muted-foreground/30">{file.pageCount} total</span>
              </div>
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto scrollbar-hide p-1">
                {Array.from({ length: Math.min(file.pageCount, 100) }).map((_, i) => {
                  const pageNum = i + 1;
                  const isInRange = splitMode === "range" && (() => {
                    try {
                      return customRanges.split(",").some(r => {
                        const [s, e] = r.trim().split("-").map(Number);
                        return pageNum >= (s || 0) && pageNum <= (e || s || 0);
                      });
                    } catch { return false; }
                  })();
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.15, zIndex: 20 }}
                      whileTap={{ scale: 0.9 }}
                      className={cn(
                        "w-5 h-7 rounded-sm border flex items-end justify-center pb-0.5 text-[7px] font-black transition-all cursor-pointer select-none shadow-sm",
                        isInRange
                          ? "bg-blue-600 border-blue-400/50 text-white shadow-lg shadow-blue-500/20"
                          : "bg-white/5 border-white/5 text-muted-foreground/40 hover:border-white/20 hover:text-white/60"
                      )}
                      onClick={() => {
                        if (splitMode !== "range") return;
                        if (pageSelStart === null) {
                          setPageSelStart(pageNum);
                        } else {
                          const start = Math.min(pageSelStart, pageNum);
                          const end = Math.max(pageSelStart, pageNum);
                          const existing = customRanges.trim();
                          setCustomRanges(existing ? `${existing}, ${start}-${end}` : `${start}-${end}`);
                          setPageSelStart(null);
                          setRangeError(null);
                        }
                      }}
                    >
                      {pageNum}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Premium Info Module */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3 text-blue-500/60" />
                <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-foreground/40">{t("studio.wasm_engine")}</h4>
              </div>
              <p className="text-[9px] text-muted-foreground/40 leading-relaxed font-medium">
                Local-only worker thread extraction. Privacy guaranteed.
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Action Bar */}
        <div className="p-4 border-t border-white/5 bg-black/40 shrink-0 space-y-3">
          {isProcessing && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-blue-500/60">{t("studio.processing")}</span>
                <span className="text-[10px] font-black text-blue-400 tabular-nums">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1 bg-white/5 overflow-hidden rounded-full" />
            </div>
          )}
          <Button
            className="w-full h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-black text-[10px] uppercase tracking-[0.2em] gap-3 active:scale-[0.98] transition-all disabled:opacity-30 group"
            onClick={splitPdf}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <Scissors className="w-4 h-4 text-blue-500 group-hover:rotate-12 transition-transform" />}
            {isProcessing ? t("studio.slicing") : t("studio.slice_document")}
          </Button>

          {/* Integrated Ad Support */}
          <div className="pt-2">
            <div className="glass-card bg-white/[0.02] border border-white/5 p-3 rounded-xl shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <></>
              <p className="text-[7px] font-bold text-muted-foreground/30 text-center uppercase tracking-widest mt-2 px-2 leading-tight">
                Privacy-friendly ads help us keep SafeTools free without selling data.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area: Spacious & Rewarding */}
      <section className="flex-grow flex flex-col min-w-0 bg-transparent relative z-10 overflow-hidden">
        {/* Slim Top Header Ad */}
        <div className="px-6 pt-4 shrink-0">
          <div className="glass-card bg-white/[0.01] border border-white/5 px-4 py-2 rounded-2xl flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-pulse" />
             <></>
          </div>
        </div>

        <ScrollArea className="flex-grow">
          <div className="p-6 md:p-12 max-w-6xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {file.status === "completed" && file.results.length > 0 ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="space-y-12"
                >
                  {/* High Impact Success Header */}
                  <div className="relative group">
                    <div className="absolute -inset-8 bg-emerald-500/10 blur-[80px] rounded-full opacity-50 animate-pulse" />
                    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white/[0.03] border border-white/10 p-8 md:p-10 rounded-[3rem] backdrop-blur-3xl shadow-2xl overflow-hidden">
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-ping" />
                          <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-2xl relative z-10">
                            <CheckCircle2 className="w-10 h-10" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-3xl font-black text-white tracking-tight">{t("studio.split_complete")}</h3>
                          <p className="text-base font-medium text-muted-foreground/60">Your PDF is ready. We created {file.results.length} files.</p>
                        </div>
                      </div>
                      
                      <Button
                        size="lg"
                        className="h-16 px-10 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_20px_50px_-10px_rgba(16,185,129,0.4)] gap-4 group transition-all relative z-10"
                        onClick={downloadAll}
                        disabled={isZipping}
                      >
                        {isZipping ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5 transition-transform group-hover:-translate-y-1" />}
                        {isZipping ? t("studio.zipping") : "Download All (ZIP)"}
                      </Button>
                    </div>
                  </div>

                  {/* Result Grid with Depth and In-Feed Ads */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {file.results.map((res: any, i: number) => {
                      // Inject an ad card every 8 items
                      const showAd = (i + 1) % 8 === 0;
                      return (
                        <React.Fragment key={i}>
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: i * 0.04 }}
                          >
                            <Card className="group p-5 bg-white/[0.02] border-white/5 hover:border-blue-500/20 hover:bg-white/[0.04] transition-all duration-500 rounded-[2rem] shadow-xl hover:shadow-2xl hover:shadow-blue-500/5 overflow-hidden relative">
                              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="flex items-center gap-5 relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500/80 shrink-0 group-hover:bg-blue-500 group-hover:text-black transition-all duration-500">
                                  <FileDown className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                  <p className="text-xs font-bold text-white/80 truncate leading-tight">{res.name}</p>
                                  <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">{t("studio.part_num", { num: i + 1 })}</p>
                                </div>
                              </div>
                              <div className="mt-6 flex justify-end">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-9 px-4 rounded-xl hover:bg-white/5 text-blue-500/60 hover:text-blue-400 transition-all font-bold text-[10px] uppercase tracking-widest gap-2"
                                  onClick={() => {
                                    const a = document.createElement("a");
                                    a.href = res.url;
                                    a.download = res.name;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                  }}
                                >
                                  Download <Download className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </Card>
                          </motion.div>
                          {showAd && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="xl:col-span-1"
                            >
                              <div className="glass-card bg-white/[0.01] border border-white/5 p-4 rounded-[2rem] h-full flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <></>
                                <p className="text-[7px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] mt-4">SafeTools Sponsor</p>
                              </div>
                            </motion.div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="pt-16 pb-8 text-center">
                    <div className="glass-card bg-white/[0.01] border border-white/5 p-12 rounded-[3rem] inline-block max-w-2xl mx-auto w-full relative group">
                      <></>
                      <p className="text-[9px] font-bold text-muted-foreground/20 uppercase tracking-[0.4em] mt-8">
                        End of fragments • Verified Secure Matrix
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-32 flex flex-col items-center text-center space-y-10"
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full group-hover:bg-blue-500/10 transition-colors duration-1000" />
                    <div className="relative w-32 h-44 md:w-40 md:h-56 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center gap-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:scale-[1.02]">
                      <FileText className="w-16 h-16 text-muted-foreground/10 group-hover:text-blue-500/20 transition-colors" />
                      <div className="w-16 h-1.5 bg-blue-500/10 rounded-full" />
                    </div>
                  </div>
                  
                  <div className="space-y-4 max-w-sm relative z-10">
                    <h3 className="text-xl font-black text-white/40 uppercase tracking-[0.3em]">Workspace Active</h3>
                    <p className="text-xs font-medium text-muted-foreground/30 leading-relaxed max-w-[280px] mx-auto">
                      Your configuration is ready. {t("studio.configure_mode")} on the left panel to begin extraction.
                    </p>
                  </div>

                  <div className="flex gap-3 flex-wrap justify-center opacity-10 grayscale pointer-events-none blur-[1px]">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="w-8 h-11 bg-white/5 border border-white/5 rounded-lg shadow-sm" />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Global Floating Footer */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <div className="glass-card bg-black/60 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-full shadow-2xl flex items-center gap-4">
             <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/50">
               <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/60" />
               <span>{t("studio.verified")}</span>
             </div>
             <div className="w-1 h-1 bg-white/10 rounded-full" />
             <div className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">
               Local Slicing Engine v2.4
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
