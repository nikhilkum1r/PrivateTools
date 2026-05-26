"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Undo2, Trash2, Plus, DownloadCloud, Settings2, 
  HardDrive, ChevronDown, Search, Scaling, 
  Activity, CheckCircle2, Loader2, ArrowRight, 
  Percent, FileStack, Download, Zap, Share2
} from "lucide-react";
import { ExportManager } from "@/lib/export-manager";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AdUnit } from "@/components/shared/AdUnit";

interface ConversionEditorProps {
  t: any;
  common: any;
  files: any[];
  settings: any;
  updateSettings: (s: any) => void;
  clearFiles: () => void;
  removeFile: (id: string) => void;
  convertFile: (id: string) => void;
  convertAll: () => void;
  downloadAll: () => void;
  downloadSingle: (id: string) => void;
  copyToClipboard: (url: string) => void;
  handleFilesDrop: (files: File[]) => void;
  step: string;
  setStep: (s: any) => void;
  totalSavings: number;
  lifetimeSavings: number;
  lifetimeCount: number;
  isProcessingAll: boolean;
  CATEGORIZED_FORMATS: Record<string, string[]>;
}

export function ConversionEditor({
  t, common, files, settings, updateSettings, clearFiles, removeFile,
  convertFile, convertAll, downloadAll, downloadSingle, copyToClipboard,
  handleFilesDrop, step, setStep, totalSavings, lifetimeSavings, lifetimeCount,
  isProcessingAll, CATEGORIZED_FORMATS
}: ConversionEditorProps) {
  return (
    <motion.div
      key="workspace"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-12 space-y-12"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-border/50">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 rounded-2xl hover:bg-secondary transition-all"
            onClick={() => { clearFiles(); setStep("upload"); }}
          >
            <Undo2 className="w-6 h-6" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">{t("workspace.title")}</h2>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase text-[10px] font-bold px-4 py-1 rounded-full tracking-wider">
                {t("workspace.assets", { count: files.length })}
              </Badge>
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/40 mt-1">{t("workspace.telemetry")}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pr-6 border-r border-border/50">
            {totalSavings > 0 && (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">{t("workspace.savings")}</span>
                <span className="text-sm font-bold text-emerald-500">{t("workspace.smaller", { size: (totalSavings / 1024).toFixed(1) + " KB" })}</span>
              </div>
            )}

            {lifetimeCount > 0 && (
              <div className="px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 flex flex-col hidden sm:flex">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t("workspace.impact")}</span>
                <span className="text-sm font-bold text-primary">{t("workspace.saved", { size: (lifetimeSavings / (1024 * 1024)).toFixed(1) + " MB" })}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {files.length > 0 && (
              <Button 
                variant="ghost" 
                className="rounded-2xl text-rose-500 hover:bg-rose-500/10 h-11 px-6 text-xs font-semibold uppercase tracking-wider gap-3 transition-all"
                onClick={clearFiles}
              >
                <Trash2 className="w-4 h-4" /> {t("workspace.clear")}
              </Button>
            )}
            <Button className="rounded-2xl bg-secondary/20 text-foreground border border-border/50 h-11 px-6 text-xs font-semibold uppercase tracking-wider gap-3 hover:bg-secondary/40 hover:scale-105 active:scale-95 transition-all shadow-xl" onClick={() => document.getElementById('append-files')?.click()}>
              <Plus className="w-4 h-4" /> {t("workspace.addMore")}
              <input 
                id="append-files" 
                type="file" 
                multiple 
                hidden 
                accept="image/*,.heic,.heif,.tiff,.psd,.svg"
                onChange={(e) => e.target.files && handleFilesDrop(Array.from(e.target.files))} 
              />
            </Button>
            {step === "result" && files.some(f => f.status === "completed") && (
              <Button className="rounded-2xl bg-emerald-500 text-white border border-emerald-400/50 h-11 px-6 text-xs font-semibold uppercase tracking-wider gap-3 hover:bg-emerald-600 transition-all shadow-xl btn-emerald-glow hover:scale-105 active:scale-95" onClick={downloadAll}>
                <DownloadCloud className="w-4 h-4" /> {t("workspace.exportAll")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Global Settings Panel */}
      <div className="relative group/settings">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/10 to-primary/20 rounded-[2.5rem] blur-xl opacity-50 group-hover/settings:opacity-100 transition-opacity duration-1000" />
        <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-transparent to-primary/5">
          <div className="relative flex flex-col gap-8 p-10 rounded-[2.4rem] glass-card border-border/60 shadow-2xl overflow-hidden shadow-primary/5">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <Label className="text-sm font-semibold uppercase tracking-wider text-primary">{t("config.title")}</Label>
                </div>
                <div className="space-y-4">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("config.format")}</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }), "w-full h-14 rounded-2xl bg-secondary/10 border-border/40 px-6 hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden relative shadow-inner")}>
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <HardDrive className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-semibold uppercase tracking-wider flex-grow text-left">{settings.format?.toUpperCase() || t("config.selectFormat")}</span>
                          <ChevronDown className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[min(460px,95vw)] p-0 bg-popover/95 backdrop-blur-xl border-border rounded-[2rem] shadow-2xl overflow-hidden" align="start">
                      <div className="p-6 border-b border-border bg-secondary/30">
                        <div className="relative group">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                          <Input placeholder={t("config.search")} className="h-12 pl-12 bg-muted/40 border-border rounded-xl text-xs font-semibold uppercase tracking-wider focus:border-primary/50 transition-all shadow-inner" />
                        </div>
                      </div>
                      <ScrollArea className="h-[400px]">
                        <div className="p-6 space-y-6">
                          {Object.entries(CATEGORIZED_FORMATS).map(([cat, fmts]) => (
                            <div key={cat} className="space-y-4">
                              <div className="flex items-center gap-3 px-2">
                                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/60">{t(`categories.${cat}`)}</p>
                                <div className="h-[1px] flex-grow bg-secondary/50" />
                              </div>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {fmts.map(f => (
                                  <button
                                    key={f}
                                    className={cn(
                                      "flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all active:scale-95",
                                      settings.format === f 
                                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                        : "bg-secondary/30 border-border text-muted-foreground hover:bg-secondary hover:border-primary/30 hover:text-foreground"
                                    )}
                                    onClick={() => updateSettings({ format: f as any })}
                                  >
                                    <span className="text-[10px] font-bold tracking-wider uppercase">{f}</span>
                                    {settings.format === f && <CheckCircle2 className="w-3.5 h-3.5" />}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="md:col-span-4 space-y-4">
                 <div className="flex items-center justify-between">
                   <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("config.quality")}</Label>
                   <span className="text-xs font-bold text-primary">{settings.quality}%</span>
                 </div>
                <Slider 
                  value={[settings.quality]} 
                  min={10} max={100} step={1} 
                  onValueChange={(v) => updateSettings({ quality: Array.isArray(v) ? v[0] : v })}
                  className="py-4"
                />
              </div>

               <div className="md:col-span-4 grid grid-cols-2 gap-4">
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("config.resizeW")}</Label>
                     <Scaling className="w-3.5 h-3.5 text-muted-foreground/40" />
                   </div>
                   <div className="relative group/input">
                     <Input 
                       type="number" 
                       placeholder={t("config.auto")} 
                       value={settings.maxWidth || ""} 
                       onChange={(e) => updateSettings({ maxWidth: parseInt(e.target.value) || undefined })}
                       className="h-12 bg-secondary/10 border-border/40 rounded-xl font-bold text-xs pr-10 focus:border-primary/50 transition-all"
                     />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40">{t("config.px")}</span>
                   </div>
                 </div>
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("config.resizeH")}</Label>
                     <Scaling className="w-3.5 h-3.5 text-muted-foreground/40 rotate-90" />
                   </div>
                   <div className="relative group/input">
                     <Input 
                       type="number" 
                       placeholder={t("config.auto")} 
                       value={settings.maxHeight || ""} 
                       onChange={(e) => updateSettings({ maxHeight: parseInt(e.target.value) || undefined })}
                       className="h-12 bg-secondary/10 border-border/40 rounded-xl font-bold text-xs pr-10 focus:border-primary/50 transition-all"
                     />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40">{t("config.px")}</span>
                   </div>
                 </div>
               </div>

               <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border/40">
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/5 border border-border/40">
                   <div className="flex flex-col">
                     <Label className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t("config.metadata")}</Label>
                     <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-wider">{t("config.strip")}</span>
                   </div>
                   <Switch checked={true} disabled />
                 </div>
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/5 border border-border/40">
                   <div className="flex flex-col">
                     <Label className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t("config.wasm")}</Label>
                     <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-wider">{t("config.accelerated")}</span>
                   </div>
                   <div className="w-8 h-4 rounded-full bg-emerald-500/20 flex items-center justify-end px-1 border border-emerald-500/30">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   </div>
                 </div>
                 <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/5 border border-border/40">
                   <div className="flex flex-col">
                     <Label className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t("config.targetSize")}</Label>
                     <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-wider">{settings.targetSize ? t("config.limit", { size: settings.targetSize }) : t("config.optimized")}</span>
                   </div>
                   <Switch checked={!!settings.targetSize} onCheckedChange={(c) => updateSettings({ targetSize: c ? 500 : undefined })} />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <></>

      {/* Files Display */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-6">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <h3 className="text-[10px] font-bold tracking-[0.4em] text-muted-foreground/60">{t("queue.title")}</h3>
        </div>
        
        {files.map((f, i) => (
          <motion.div
            key={f.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative group/file"
          >
            <div className={cn(
              "relative overflow-hidden rounded-[2.5rem] border transition-all duration-700",
              f.status === "completed" ? "bg-emerald-500/[0.03] border-emerald-500/30 shadow-2xl shadow-emerald-500/5" : "bg-secondary/10 border-border/40 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
            )}>
              <div className="flex flex-col md:flex-row items-center p-6 gap-8">
                <div className="w-48 h-48 rounded-[2rem] overflow-hidden bg-black/20 border border-white/5 shrink-0 relative group/preview">
                  <img src={f.previewUrl} className="w-full h-full object-cover" alt="" />
                  <AnimatePresence>
                    {f.status === "completed" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-emerald-500/80 backdrop-blur-md flex flex-col items-center justify-center text-white">
                        <CheckCircle2 className="w-10 h-10 mb-2" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">{t("queue.converted")}</span>
                      </motion.div>
                    )}
                    {f.status === "processing" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-sm font-bold text-primary mt-2">{f.progress}%</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-grow min-w-0 space-y-6 text-center md:text-left">
                  <div className="space-y-2">
                    <h4 className="text-xl md:text-3xl font-extrabold tracking-tight truncate pr-10 italic uppercase font-heading">{f.file.name}</h4>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-white/40">{t("queue.in")}</span>
                        <span className="text-[10px] font-bold text-white/80">{(f.file.size / 1024).toFixed(1)} KB</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-muted-foreground/20" />
                      <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-primary/60">{t("queue.out")}</span>
                        <span className="text-[10px] font-bold text-primary">{settings.format?.toUpperCase()}</span>
                      </div>
                      {f.status === "completed" && f.outputSize && (
                        <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                          <Percent className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px] font-bold text-emerald-500">
                            {t("queue.smaller", { percent: Math.max(0, ((f.file.size - f.outputSize) / f.file.size * 100)).toFixed(0) })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {f.status === "completed" ? (
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-14 h-14 rounded-2xl border-blue-500/40 bg-blue-500/10 text-blue-500 hover:text-blue-400 hover:border-blue-500/60 transition-all group/copy"
                        onClick={() => copyToClipboard(f.processedUrl!)}
                        title="Copy Image"
                      >
                        <FileStack className="w-6 h-6 group-hover/copy:scale-110 transition-transform" />
                      </Button>
                      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-14 h-14 rounded-2xl border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-500 hover:text-fuchsia-400 hover:border-fuchsia-500/60 transition-all group/share hidden sm:flex"
                          onClick={async () => {
                            if (f.processedUrl) {
                              try {
                                const response = await fetch(f.processedUrl);
                                const blob = await response.blob();
                                const ext = settings.format?.toLowerCase() || 'webp';
                                const baseName = f.file.name.split('.').slice(0, -1).join('.') || 'converted';
                                ExportManager.shareFile(blob, `${baseName}.${ext}`, `Converted ${baseName}.${ext}`);
                              } catch (e) {
                                console.error('Share fetch failed:', e);
                              }
                            }
                          }}
                          title="Share File"
                        >
                          <Share2 className="w-6 h-6 group-hover/share:scale-110 transition-transform" />
                        </Button>
                      )}
                      <Button
                        className="h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold uppercase tracking-wider text-[11px] px-8 gap-3 shadow-xl active:scale-95 transition-all group/dl"
                        onClick={() => downloadSingle(f.id)}
                      >
                        {t("queue.download")} <Download className="w-5 h-5 group-hover/dl:translate-y-0.5 transition-transform" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className={cn(
                        "h-14 rounded-2xl font-semibold uppercase tracking-wider text-[11px] px-10 gap-3 transition-all relative overflow-hidden group/opt hover:scale-105 active:scale-95",
                        f.status === "idle" ? "bg-sky-500 text-white shadow-xl btn-sky-glow border-sky-400/50" : "bg-white/5 text-white/20 cursor-not-allowed border-white/5"
                      )}
                      onClick={() => convertFile(f.id)}
                      disabled={f.status === "processing" || isProcessingAll}
                    >
                      {f.status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t("queue.convert")} <Zap className="w-5 h-5 group-hover/opt:scale-125 transition-transform" /></>}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-14 h-14 rounded-2xl text-rose-500/20 hover:text-rose-500 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/40 transition-all"
                    onClick={() => removeFile(f.id)}
                  >
                    <Trash2 className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {step !== "processing" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center pt-12">
          <Button 
            className="h-24 rounded-[3rem] bg-gradient-to-r from-primary via-blue-600 to-primary background-animate text-primary-foreground font-semibold uppercase tracking-wider text-2xl px-24 gap-8 shadow-2xl btn-primary-glow group relative overflow-hidden active:scale-95 transition-all animate-glow border-t border-white/20"
            onClick={convertAll}
            disabled={isProcessingAll || files.every(f => f.status === "completed")}
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <div className="flex items-center gap-6 relative z-10">
              <Zap className="w-10 h-10 group-hover:rotate-12 group-hover:scale-125 transition-all drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              <span className="tracking-tight">{t("queue.convert")} {common("all")}</span>
            </div>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
