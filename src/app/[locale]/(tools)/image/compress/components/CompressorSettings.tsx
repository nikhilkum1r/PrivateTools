"use client";

import React from "react";
import { motion } from "framer-motion";
import { Settings2, Sliders, Shield, Zap, Scaling, HardDrive, Sparkles, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CompressorSettingsProps {
  t: any;
  outputFormat: string;
  setOutputFormat: (val: string) => void;
  quality: number;
  setQuality: (val: number) => void;
  smartMode: boolean;
  setSmartMode: (val: boolean) => void;
  maxWidth: number | undefined;
  setMaxWidth: (val: number | undefined) => void;
  maxHeight: number | undefined;
  setMaxHeight: (val: number | undefined) => void;
  targetSize: number | undefined;
  setTargetSize: (val: number | undefined) => void;
  stripMetadata: boolean;
  setStripMetadata: (val: boolean) => void;
  renamePattern: string;
  setRenamePattern: (val: string) => void;
  brightness: number;
  setBrightness: (val: number) => void;
  contrast: number;
  setContrast: (val: number) => void;
  saturation: number;
  setSaturation: (val: number) => void;
  processAll: () => void;
  step: string;
  CATEGORIZED_FORMATS: any;
  toast: any;
}

export function CompressorSettings({
  t,
  outputFormat,
  setOutputFormat,
  quality,
  setQuality,
  smartMode,
  setSmartMode,
  maxWidth,
  setMaxWidth,
  maxHeight,
  setMaxHeight,
  targetSize,
  setTargetSize,
  stripMetadata,
  setStripMetadata,
  renamePattern,
  setRenamePattern,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation,
  processAll,
  step,
  CATEGORIZED_FORMATS,
  toast
}: CompressorSettingsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group/settings mb-12"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/10 to-primary/20 rounded-[2.5rem] blur-xl opacity-50 group-hover/settings:opacity-100 transition-opacity duration-1000" />
      <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-transparent to-primary/5">
        <div className="relative flex flex-col gap-8 p-10 rounded-[2.4rem] glass-card border-border/60 shadow-2xl overflow-hidden shadow-primary/5">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5 text-primary" />
                  <Label className="text-sm font-semibold uppercase tracking-wider text-primary">{t("settings.saveAs")}</Label>
                </div>
                <Badge variant="outline" className="text-[10px] font-bold tracking-tight border-primary/40 text-primary bg-primary/5">{t("settings.secure")}</Badge>
              </div>
              <Select value={outputFormat} onValueChange={(val) => val && setOutputFormat(val)}>
                <SelectTrigger className="h-14 bg-secondary/10 border-border/40 rounded-2xl font-semibold uppercase tracking-wider text-xs hover:border-primary/50 transition-all shadow-inner">
                  <SelectValue placeholder={t("settings.saveAs")} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl bg-card border-border backdrop-blur-xl">
                  {CATEGORIZED_FORMATS["Regular Use"].map((f: string) => (
                    <SelectItem key={f} value={f} className="font-semibold uppercase tracking-wider text-xs hover:bg-primary/20 focus:bg-primary/20">{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-4 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-blue-400/80">{t("settings.quality")}</Label>
                </div>
                <span className="text-sm font-bold text-blue-400 tabular-nums">{quality}%</span>
              </div>
              <div>
                <div className={cn("transition-all duration-500", smartMode ? "opacity-50 grayscale" : "opacity-100")}>
                  <Slider
                    value={[quality]}
                    min={1} max={100} step={1}
                    onValueChange={(v) => {
                      const val = Array.isArray(v) ? v[0] : v;
                      setQuality(val);
                      if (smartMode) {
                        setSmartMode(false);
                        toast.info(t("toast.manualMode"));
                      }
                    }}
                    className="py-2"
                  />
                </div>
                {smartMode ? (
                  <p className="text-[7px] font-semibold uppercase tracking-wider text-emerald-400 mt-2 italic animate-pulse">{t("settings.smartActive")}</p>
                ) : (
                  <p className="text-[7px] font-semibold uppercase tracking-wider text-blue-400 mt-2">{t("settings.manualActive")}</p>
                )}
              </div>
            </div>

            <div className="md:col-span-5 flex flex-wrap md:flex-nowrap items-end gap-3">
              <div className="flex-grow space-y-4 min-w-[140px]">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80">{t("settings.smartOptimizer")}</Label>
                </div>
                <div className="flex items-center gap-3 h-14 px-5 rounded-2xl bg-secondary/10 border border-border shadow-inner group/switch cursor-pointer hover:border-emerald-500/30 transition-all" onClick={() => setSmartMode(!smartMode)}>
                  <Switch checked={smartMode} onCheckedChange={setSmartMode} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground transition-opacity truncate">{smartMode ? t("settings.automatic") : t("settings.manual")}</span>
                </div>
              </div>
              {step === "configure" && (
                <Button
                  onClick={processAll}
                  className="h-14 flex-grow md:flex-grow-0 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wider text-[10px] px-6 shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-all gap-2 group/btn relative overflow-hidden whitespace-nowrap"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity animate-pulse" />
                  <Zap className="w-4 h-4 relative z-10" /> <span className="relative z-10">{t("queue.compress_all")}</span>
                </Button>
              )}
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("settings.width")}</Label>
                  <Scaling className="w-3 h-3 text-muted-foreground/20" />
                </div>
                <div className="relative group/input">
                  <Input 
                    type="number" 
                    placeholder={t("settings.original")} 
                    value={maxWidth || ""} 
                    onChange={(e) => setMaxWidth(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="h-12 bg-secondary/10 border-border/40 rounded-xl font-bold text-xs pr-10 focus:border-primary/50 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/30 group-hover/input:text-primary/40 transition-colors">{t("settings.units.px")}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("settings.height")}</Label>
                  <Scaling className="w-3.5 h-3.5 text-muted-foreground/40 rotate-90" />
                </div>
                <div className="relative group/input">
                  <Input 
                    type="number" 
                    placeholder={t("settings.original")} 
                    value={maxHeight || ""} 
                    onChange={(e) => setMaxHeight(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="h-12 bg-secondary/10 border-border/40 rounded-xl font-bold text-xs pr-10 focus:border-primary/50 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40 group-hover/input:text-primary/40 transition-colors">{t("settings.units.px")}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("settings.target_size")}</Label>
                  <HardDrive className="w-3.5 h-3.5 text-muted-foreground/40" />
                </div>
                <div className="relative group/input">
                  <Input 
                    type="number" 
                    placeholder={t("settings.noLimit")} 
                    value={targetSize || ""} 
                    onChange={(e) => setTargetSize(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="h-12 bg-secondary/10 border-border/40 rounded-xl font-bold text-xs pr-10 focus:border-primary/50 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40 group-hover/input:text-primary/40 transition-colors">{t("settings.units.kb")}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-emerald-400/60">{t("settings.privacyShield")}</Label>
                  <Badge variant="outline" className="text-[10px] font-bold tracking-tight border-emerald-500/20 text-emerald-500 animate-pulse">{t("settings.deepClean")}</Badge>
                </div>
                <div 
                  className={cn(
                    "h-14 flex items-center justify-between px-6 rounded-2xl border transition-all cursor-pointer group/metadata select-none",
                    stripMetadata 
                      ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]" 
                      : "bg-secondary/10 border-border/40 opacity-80 hover:opacity-100"
                  )}
                  onClick={() => setStripMetadata(!stripMetadata)}
                >
                  <span className={cn("text-xs font-semibold uppercase tracking-wider transition-colors", stripMetadata ? "text-emerald-500" : "text-muted-foreground")}>
                    {stripMetadata ? t("settings.metadataDeleted") : t("settings.metadataIncluded")}
                  </span>
                  <Switch 
                    checked={stripMetadata} 
                    onCheckedChange={setStripMetadata}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("settings.bulkRename")}</Label>
                  <Badge variant="outline" className="text-[9px] font-bold tracking-tight border-primary/20 text-primary">{t("settings.dynamic")}</Badge>
                </div>
                <div className="relative group/input">
                  <Input 
                    placeholder="compressed-{name}" 
                    value={renamePattern} 
                    onChange={(e) => setRenamePattern(e.target.value)}
                    className="h-12 bg-secondary/10 border-border/40 rounded-xl font-bold text-xs focus:border-primary/50 transition-all"
                  />
                  <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    <button onClick={() => setRenamePattern("safe-{name}")} className="whitespace-nowrap px-2 py-0.5 rounded-md bg-secondary/20 text-[7px] font-bold text-muted-foreground/60 hover:text-primary transition-colors">safe-{`{name}`}</button>
                    <button onClick={() => setRenamePattern("{name}-v2")} className="whitespace-nowrap px-2 py-0.5 rounded-md bg-secondary/20 text-[7px] font-bold text-muted-foreground/60 hover:text-primary transition-colors">{`{name}`}-v2</button>
                    <button onClick={() => setRenamePattern("{name}-{date}")} className="whitespace-nowrap px-2 py-0.5 rounded-md bg-secondary/20 text-[7px] font-bold text-muted-foreground/60 hover:text-primary transition-colors">{`{name}`}-{`{date}`}</button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("settings.visualPolish")}</Label>
                  <Sparkles className="w-3.5 h-3.5 text-muted-foreground/40" />
                </div>
                <div className="space-y-4 px-2">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] font-semibold uppercase tracking-wider text-white/40">
                      <span>{t("settings.brightness")}</span>
                      <span>{brightness}%</span>
                    </div>
                    <Slider 
                      value={[brightness]} 
                      min={50} max={150} step={1} 
                      onValueChange={(v) => {
                        const val = Array.isArray(v) ? v[0] : v;
                        setBrightness(val);
                      }} 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] font-semibold uppercase tracking-wider text-white/40">
                      <span>{t("settings.contrast")}</span>
                      <span>{contrast}%</span>
                    </div>
                    <Slider 
                      value={[contrast]} 
                      min={50} max={150} step={1} 
                      onValueChange={(v) => {
                        const val = Array.isArray(v) ? v[0] : v;
                        setContrast(val);
                      }} 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[8px] font-semibold uppercase tracking-wider text-white/40">
                      <span>{t("settings.saturation")}</span>
                      <span>{saturation}%</span>
                    </div>
                    <Slider 
                      value={[saturation]} 
                      min={0} max={200} step={1} 
                      onValueChange={(v) => {
                        const val = Array.isArray(v) ? v[0] : v;
                        setSaturation(val);
                      }} 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("settings.sizePresets")}</Label>
                  <Globe className="w-3.5 h-3.5 text-muted-foreground/40" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className={cn(
                      "h-10 rounded-xl bg-secondary/10 border-border/40 text-xs font-semibold uppercase tracking-wider transition-all",
                      maxWidth === 1080 && maxHeight === 1080 ? "border-primary text-primary bg-primary/10" : "hover:bg-primary/20 hover:border-primary/40 text-muted-foreground"
                    )} 
                    onClick={() => { setMaxWidth(1080); setMaxHeight(1080); toast.info(t("toast.presetInstagram")); }}
                  >
                    {t("settings.presets.instagram")}
                  </Button>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "h-10 rounded-xl bg-white/5 border-white/10 text-[8px] font-semibold uppercase tracking-wider transition-all",
                      maxWidth === 1200 && maxHeight === 630 ? "border-primary text-primary bg-primary/10" : "hover:bg-primary/20 hover:border-primary/40"
                    )} 
                    onClick={() => { setMaxWidth(1200); setMaxHeight(630); toast.info(t("toast.presetFacebook")); }}
                  >
                    {t("settings.presets.facebook")}
                  </Button>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "h-10 rounded-xl bg-white/5 border-white/10 text-[8px] font-semibold uppercase tracking-wider transition-all",
                      maxWidth === 1600 && maxHeight === 900 ? "border-primary text-primary bg-primary/10" : "hover:bg-primary/20 hover:border-primary/40"
                    )} 
                    onClick={() => { setMaxWidth(1600); setMaxHeight(900); toast.info(t("toast.presetTwitter")); }}
                  >
                    {t("settings.presets.twitter")}
                  </Button>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "h-10 rounded-xl bg-white/5 border-white/10 text-[8px] font-semibold uppercase tracking-wider transition-all",
                      maxWidth === 1920 && maxHeight === 1080 ? "border-primary text-primary bg-primary/10" : "hover:bg-primary/20 hover:border-primary/40"
                    )} 
                    onClick={() => { setMaxWidth(1920); setMaxHeight(1080); toast.info(t("toast.presetFullHD")); }}
                  >
                    {t("settings.presets.fullhd")}
                  </Button>
                </div>
                <button className="w-full text-center text-[7px] font-semibold uppercase tracking-wider text-primary/40 hover:text-primary transition-colors" onClick={() => { setMaxWidth(undefined); setMaxHeight(undefined); }}>
                  {t("settings.resetOriginalSize")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
