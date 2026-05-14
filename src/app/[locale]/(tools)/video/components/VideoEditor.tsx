"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sliders, Trash2, Camera, FileVideo, Play, Scissors, RefreshCw, 
  RotateCw, Maximize, EyeOff, Sparkles, CheckCircle2, History,
  DownloadCloud, ShieldCheck, Loader2, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExportManager } from "@/lib/export-manager";

interface VideoEditorProps {
  t: any;
  videoFile: File;
  previewUrl: string | null;
  outputUrl: string | null;
  isLoaded: boolean;
  isProcessing: boolean;
  progress: number;
  logs: string[];
  crf: number;
  setCrf: (v: number) => void;
  preset: string;
  setPreset: (v: string) => void;
  outputFormat: string;
  setOutputFormat: (v: string) => void;
  mute: boolean;
  setMute: (v: boolean) => void;
  resolution: string;
  setResolution: (v: string) => void;
  rotation: string;
  setRotation: (v: string) => void;
  speed: string;
  setSpeed: (v: string) => void;
  privacyBlur: boolean;
  setPrivacyBlur: (v: boolean) => void;
  blurRegions: any[];
  setBlurRegions: (v: any[]) => void;
  trimStart: number;
  setTrimStart: (v: number) => void;
  trimEnd: number;
  setTrimEnd: (v: number) => void;
  duration: number;
  currentTime: number;
  setCurrentTime: (v: number) => void;
  snapshots: any[];
  processVideo: () => void;
  takeSnapshot: () => void;
  resetTool: () => void;
  isDrawing: boolean;
  setIsDrawing: (v: boolean) => void;
  startPos: { x: number, y: number };
  setStartPos: (v: { x: number, y: number }) => void;
  currentPos: { x: number, y: number };
  setCurrentPos: (v: { x: number, y: number }) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export function VideoEditor({
  t, videoFile, previewUrl, outputUrl, isLoaded, isProcessing, progress, logs,
  crf, setCrf, preset, setPreset, outputFormat, setOutputFormat, mute, setMute,
  resolution, setResolution, rotation, setRotation, speed, setSpeed,
  privacyBlur, setPrivacyBlur, blurRegions, setBlurRegions, trimStart, setTrimStart,
  trimEnd, setTrimEnd, duration, currentTime, setCurrentTime, snapshots,
  processVideo, takeSnapshot, resetTool, isDrawing, setIsDrawing, startPos,
  setStartPos, currentPos, setCurrentPos, videoRef
}: VideoEditorProps) {

  const CircularProgress = ({ value }: { value: number }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    return (
      <div className="relative flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-foreground/5" />
          <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="text-primary transition-all duration-500 ease-out shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold tabular-nums tracking-tight">{value}%</span>
          <span className="text-[10px] font-bold tracking-wider text-muted-foreground/50">{t("messages.rendering")}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Left Sidebar - Studio Controls */}
      <aside className="flex w-full lg:w-[300px] border-b lg:border-b-0 lg:border-r border-border glass-card flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
          <div className="flex flex-col gap-1">
            <h3 className="text-[10px] font-bold tracking-[0.4em] text-primary flex items-center gap-3"><Sliders className="w-4 h-4" /> {t("sidebar.inspector")}</h3>
            <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-wider mt-1">{t("sidebar.engine")}</p>
          </div>
          <div className="px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">{t("workspace.mounted")}</div>
        </div>

        <ScrollArea className="flex-grow min-h-0">
          <Tabs defaultValue="render" className="w-full">
            <TabsList className="w-full h-10 bg-muted/40 border-b border-border rounded-none p-0">
              <TabsTrigger value="render" className="flex-1 h-full rounded-none data-[state=active]:bg-primary/5 data-[state=active]:text-primary border-r border-border font-bold text-[10px] uppercase tracking-wider">{t("sidebar.tabs.pipeline")}</TabsTrigger>
              <TabsTrigger value="filters" className="flex-1 h-full rounded-none data-[state=active]:bg-primary/5 data-[state=active]:text-primary border-r border-border font-bold text-[10px] uppercase tracking-wider">{t("sidebar.tabs.filters")}</TabsTrigger>
              <TabsTrigger value="timeline" className="flex-1 h-full rounded-none data-[state=active]:bg-primary/5 data-[state=active]:text-primary font-bold text-[10px] uppercase tracking-wider">{t("sidebar.tabs.timeline")}</TabsTrigger>
            </TabsList>

            <div className="p-8 pb-12">
              <TabsContent value="render" className="m-0 space-y-5">
                <div className="space-y-5">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center justify-between">
                    <span>{t("sidebar.quality")}</span>
                    <span className="text-primary tabular-nums">{crf}</span>
                  </Label>
                  <Slider value={[crf ?? 28]} min={0} max={51} step={1} onValueChange={(v) => setCrf(Array.isArray(v) ? v[0] : v)} className="py-2" />
                  <div className="flex justify-between text-[8px] font-bold text-muted-foreground/40 tracking-wider">
                    <span>{t("sidebar.qualityRange.high")}</span>
                    <span>{t("sidebar.qualityRange.low")}</span>
                  </div>
                </div>

                <div className="space-y-5">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("sidebar.preset")}</Label>
                  <Select value={preset} onValueChange={(v) => v && setPreset(v)}>
                    <SelectTrigger className="h-10 rounded-2xl bg-muted/10 border-border font-bold text-[10px] uppercase tracking-wider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {["ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow"].map(p => (
                        <SelectItem key={p} value={p} className="font-bold text-[10px] uppercase py-3">{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-[8px] font-medium text-muted-foreground/40 uppercase tracking-wider leading-relaxed">{t("sidebar.presetHint")}</p>
                </div>

                <div className="space-y-5">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("sidebar.protocol")}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {["mp4", "webm", "mkv", "avi"].map(fmt => (
                      <Button key={fmt} variant={outputFormat === fmt ? "default" : "ghost"} className={cn("rounded-2xl text-[10px] font-bold h-12 uppercase tracking-wider border border-border", outputFormat === fmt ? "bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]" : "text-muted-foreground/50 hover:bg-secondary/50")} onClick={() => setOutputFormat(fmt)}>{fmt}</Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("sidebar.resolution")}</Label>
                  <Select value={resolution} onValueChange={(v) => v && setResolution(v)}>
                    <SelectTrigger className="h-10 rounded-2xl bg-muted/10 border-border font-bold text-[10px] uppercase tracking-wider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="original" className="font-bold text-[10px] uppercase py-3">{t("sidebar.resolutions.original")}</SelectItem>
                      <SelectItem value="1080p" className="font-bold text-[10px] uppercase py-3">{t("sidebar.resolutions.1080p")}</SelectItem>
                      <SelectItem value="720p" className="font-bold text-[10px] uppercase py-3">{t("sidebar.resolutions.720p")}</SelectItem>
                      <SelectItem value="480p" className="font-bold text-[10px] uppercase py-3">{t("sidebar.resolutions.480p")}</SelectItem>
                      <SelectItem value="360p" className="font-bold text-[10px] uppercase py-3">{t("sidebar.resolutions.360p")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-5 rounded-3xl bg-secondary/30 border border-border">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-bold text-muted-foreground/80 tracking-wider">{t("sidebar.mute")}</Label>
                    <p className="text-[8px] font-medium text-muted-foreground/40 uppercase tracking-wider">{t("sidebar.muteHint")}</p>
                  </div>
                  <Switch checked={mute} onCheckedChange={setMute} className="data-[state=checked]:bg-primary" />
                </div>
              </TabsContent>

              <TabsContent value="filters" className="m-0 space-y-5">
                <div className="flex items-center justify-between p-6 rounded-xl bg-primary/5 border border-primary/20 shadow-xl shadow-primary/[0.02] group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <EyeOff className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-foreground/80 tracking-wider">{t("sidebar.blur")}</Label>
                      <p className="text-[8px] font-medium text-muted-foreground/50 uppercase tracking-wider">{t("sidebar.blurHint")}</p>
                    </div>
                  </div>
                  <Switch checked={privacyBlur} onCheckedChange={setPrivacyBlur} className="data-[state=checked]:bg-primary" />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("sidebar.zones")}</h4>
                    <div className="px-2 py-0.5 rounded-full border border-primary/20 text-primary text-[9px] font-bold">{blurRegions.length} {t("sidebar.regions")}</div>
                  </div>

                  <ScrollArea className="h-[200px] rounded-3xl bg-secondary/30 border border-border p-4">
                    <div className="space-y-3">
                      {blurRegions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[160px] text-center space-y-3 opacity-30">
                          <Sparkles className="w-8 h-8" />
                          <p className="text-[9px] font-semibold uppercase tracking-wider leading-relaxed">{t("sidebar.dragHint")}</p>
                        </div>
                      ) : (
                        blurRegions.map((reg, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/10 border border-border group hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                                #{i + 1}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-muted-foreground/80">{t("sidebar.region_area")} {Math.round(reg.w)}x{Math.round(reg.h)}%</span>
                                <span className="text-[8px] text-muted-foreground/40 uppercase font-bold tracking-wider">{t("sidebar.region_offset")} {Math.round(reg.x)}:{Math.round(reg.y)}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-xl opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-red-500 transition-all" onClick={() => setBlurRegions(blurRegions.filter((_, idx) => idx !== i))}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>

                  {blurRegions.length > 0 && (
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-border bg-secondary/30 text-[9px] font-semibold uppercase tracking-wider hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all" onClick={() => setBlurRegions([])}>
                      {t("sidebar.resetZones")}
                    </Button>
                  )}
                </div>

                <div className="space-y-5">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("sidebar.rotation")}</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { val: "0", icon: Maximize },
                      { val: "90", icon: RotateCw },
                      { val: "180", icon: RotateCw },
                      { val: "270", icon: RotateCw }
                    ].map((r, i) => (
                      <Button key={r.val} variant={rotation === r.val ? "default" : "ghost"} className={cn("rounded-xl h-12 flex flex-col items-center justify-center gap-1", rotation === r.val ? "bg-primary text-primary-foreground" : "text-muted-foreground/40 border border-border")} onClick={() => setRotation(r.val)}>
                        <r.icon className={cn("w-4 h-4", r.val === "180" && "rotate-180", r.val === "270" && "-rotate-90")} />
                        <span className="text-[8px] font-bold">{r.val}°</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("sidebar.velocity")}</Label>
                  <Select value={speed} onValueChange={(v) => v && setSpeed(v)}>
                    <SelectTrigger className="h-10 rounded-2xl bg-muted/10 border-border font-bold text-[10px] uppercase tracking-wider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="0.5" className="font-bold text-[10px] uppercase py-3">{t("sidebar.velocities.v0_5")}</SelectItem>
                      <SelectItem value="1.0" className="font-bold text-[10px] uppercase py-3">{t("sidebar.velocities.v1_0")}</SelectItem>
                      <SelectItem value="1.5" className="font-bold text-[10px] uppercase py-3">{t("sidebar.velocities.v1_5")}</SelectItem>
                      <SelectItem value="2.0" className="font-bold text-[10px] uppercase py-3">{t("sidebar.velocities.v2_0")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="m-0 space-y-5">
                <div className="p-6 rounded-2xl bg-secondary/30 border border-border space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <Scissors className="w-5 h-5" />
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider">{t("sidebar.trim")}</h4>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                        <span>{t("sidebar.segmentStart")}</span>
                        <span className="text-primary">{trimStart.toFixed(2)}s</span>
                      </div>
                      <Slider value={[trimStart]} min={0} max={trimEnd} step={0.1} onValueChange={(v) => setTrimStart(Array.isArray(v) ? v[0] : v)} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                        <span>{t("sidebar.segmentEnd")}</span>
                        <span className="text-primary">{trimEnd.toFixed(2)}s</span>
                      </div>
                      <Slider value={[trimEnd]} min={trimStart} max={duration} step={0.1} onValueChange={(v) => setTrimEnd(Array.isArray(v) ? v[0] : v)} />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-border">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-wider">{t("sidebar.runtime")}</span>
                      <span className="text-xs font-bold tabular-nums text-primary">{(trimEnd - trimStart).toFixed(2)}s</span>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground/40 hover:text-foreground" onClick={() => { setTrimStart(0); setTrimEnd(duration); }}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>

        <div className="p-8 border-t border-border bg-muted/40 shrink-0">
          <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg gap-4 shadow-lg shadow-primary/20 group active:scale-95 transition-all disabled:grayscale disabled:opacity-50" onClick={processVideo} disabled={isProcessing || !isLoaded}>
            {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Zap className="w-7 h-7 group-hover:scale-125 transition-transform" />}
            {isProcessing ? t("sidebar.rendering") : t("sidebar.export")}
          </Button>
        </div>
      </aside>

      {/* Center - Laboratory Preview */}
      <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[500px] lg:min-h-0">
        <header className="p-8 flex items-center justify-between bg-muted/40 backdrop-blur-3xl border-b border-border relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <FileVideo className="w-8 h-8 text-primary relative z-10" />
            </div>
            <div>
              <h2 className="font-bold text-xl tracking-tight uppercase truncate max-w-[200px] md:max-w-xl">{videoFile.name}</h2>
              <div className="flex items-center gap-4 mt-1">
                <div className="px-4 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-semibold uppercase tracking-wider">{t("workspace.mounted")}</div>
                <span className="text-[10px] text-muted-foreground/40 font-semibold uppercase tracking-wider tabular-nums">{((videoFile.size) / 1024 / 1024).toFixed(2)} MB • {(duration ?? 0).toFixed(1)}s</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-2xl hover:bg-secondary/50 text-muted-foreground/50 hover:text-foreground transition-all shadow-xl" onClick={takeSnapshot} title={t("workspace.capture")}>
              <Camera className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-2xl hover:bg-red-500/10 text-muted-foreground/50 hover:text-red-500 transition-all shadow-xl" onClick={resetTool}>
              <Trash2 className="w-6 h-6" />
            </Button>
          </div>
        </header>

        <div className="flex-grow relative flex items-center justify-center p-8 lg:p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div key="processing" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="z-10">
                <CircularProgress value={progress} />
              </motion.div>
            ) : (
              <motion.div key="preview" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative group max-w-full lg:max-w-6xl mx-auto">
                <div
                  className="relative shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] border border-border rounded-none overflow-hidden bg-muted/40 group-hover:border-primary/30 transition-all duration-1000 ring-1 ring-white/5 cursor-crosshair w-fit mx-auto"
                  onMouseDown={(e) => {
                    const container = e.currentTarget;
                    const rect = container.getBoundingClientRect();
                    setIsDrawing(true);
                    setStartPos({
                      x: ((e.clientX - rect.left) / rect.width) * 100,
                      y: ((e.clientY - rect.top) / rect.height) * 100
                    });
                    setCurrentPos({
                      x: ((e.clientX - rect.left) / rect.width) * 100,
                      y: ((e.clientY - rect.top) / rect.height) * 100
                    });
                  }}
                  onMouseMove={(e) => {
                    if (!isDrawing) return;
                    const container = e.currentTarget;
                    const rect = container.getBoundingClientRect();
                    setCurrentPos({
                      x: ((e.clientX - rect.left) / rect.width) * 100,
                      y: ((e.clientY - rect.top) / rect.height) * 100
                    });
                  }}
                  onMouseUp={() => {
                    if (!isDrawing) return;
                    setIsDrawing(false);
                    const x = Math.min(startPos.x, currentPos.x);
                    const y = Math.min(startPos.y, currentPos.y);
                    const w = Math.abs(currentPos.x - startPos.x);
                    const h = Math.abs(currentPos.y - startPos.y);
                    if (w > 0.5 && h > 0.5) {
                      setBlurRegions([...blurRegions, { x, y, w, h }]);
                    }
                  }}
                >
                  <video
                    ref={videoRef}
                    src={outputUrl || previewUrl || undefined}
                    className="max-w-full max-h-[70vh] block pointer-events-none"
                    onTimeUpdate={(e) => setCurrentTime((e.target as any).currentTime)}
                  />

                  <svg className="absolute inset-0 w-full h-full pointer-events-none select-none">
                    {blurRegions.map((reg, i) => (
                      <rect
                        key={i}
                        x={`${reg.x}%`}
                        y={`${reg.y}%`}
                        width={`${reg.w}%`}
                        height={`${reg.h}%`}
                        className="fill-primary/20 stroke-primary stroke-2 stroke-dasharray-4 animate-pulse"
                        style={{ backdropFilter: "blur(20px)" }}
                      />
                    ))}
                    {isDrawing && (
                      <rect
                        x={`${Math.min(startPos.x, currentPos.x)}%`}
                        y={`${Math.min(startPos.y, currentPos.y)}%`}
                        width={`${Math.abs(currentPos.x - startPos.x)}%`}
                        height={`${Math.abs(currentPos.y - startPos.y)}%`}
                        className="fill-white/10 stroke-white/40 stroke-1 border-dashed"
                      />
                    )}
                  </svg>

                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl bg-muted/80 backdrop-blur-3xl border border-border flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                    <Button variant="ghost" size="icon" className="text-muted-foreground/60 hover:text-foreground" onClick={() => { if (videoRef.current?.paused) { videoRef.current.play().catch(() => { }); } else { videoRef.current?.pause(); } }}>
                      <Play className="w-5 h-5" />
                    </Button>
                    <div className="h-4 w-px bg-secondary" />
                    <span className="text-[10px] font-semibold tabular-nums text-primary">
                      {Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-none -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Thread Monitor */}
        <div className="absolute bottom-8 left-8 z-30">
          <div className="p-4 rounded-2xl bg-muted/60 backdrop-blur-3xl border border-border w-64 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-semibold uppercase tracking-wider text-primary">{t("workspace.engineFeed")}</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
                <div className="w-1 h-1 rounded-full bg-primary/20" />
              </div>
            </div>
            <div className="h-11 overflow-y-auto scrollbar-hide font-mono text-[8px] text-muted-foreground/50 space-y-1">
              {logs.slice(-3).map((log, i) => <div key={i} className="truncate tracking-tight opacity-60">{">"} {log}</div>)}
            </div>
          </div>
        </div>
      </section>

      {/* Right Sidebar - Gallery & History */}
      <aside className="flex w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-border glass-card shrink-0 flex-col relative z-10 shadow-2xl h-[500px] lg:h-full">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
          <div className="flex flex-col gap-1">
            <h3 className="text-[10px] font-bold tracking-[0.4em] text-primary flex items-center gap-3"><History className="w-4 h-4" /> {t("workspace.history")}</h3>
            <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-wider leading-none mt-1">{t("workspace.historyDesc")}</p>
          </div>
        </div>

        <ScrollArea className="flex-grow min-h-0">
          <div className="p-8 space-y-5 pb-12">
            {outputUrl && (
              <div className="space-y-4">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500 flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4" /> {t("workspace.success")}
                </Label>
                <Card className="p-6 bg-muted/10 border-emerald-500/20 hover:border-emerald-500/40 transition-all group flex flex-col gap-3 rounded-xl shadow-2xl shadow-emerald-500/5">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-110 transition-transform">
                      <FileVideo className="w-7 h-7" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <p className="text-xs font-bold truncate tracking-tight">export_{outputFormat}.{outputFormat}</p>
                      <div className="flex gap-2">
                        <div className="px-2 py-0 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-bold uppercase">PRO</div>
                        <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-wider">{outputFormat.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-foreground font-semibold uppercase tracking-wider text-[10px] shadow-xl shadow-emerald-600/20 gap-3 active:scale-95 transition-all"
                    onClick={() => ExportManager.downloadFromUrl(outputUrl, `studio-export-${Date.now()}.${outputFormat}`)}
                  >
                    <DownloadCloud className="w-5 h-5" /> {t("workspace.exportAsset")}
                  </Button>
                </Card>
              </div>
            )}

            {snapshots.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{t("workspace.precisionFrames")}</Label>
                  <div className="px-2 py-0.5 rounded-full border border-border text-[9px] font-bold text-muted-foreground/40">{snapshots.length} {t("workspace.units")}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {snapshots.map((snap, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative aspect-video rounded-2xl overflow-hidden border border-border bg-black hover:border-primary/40 transition-all cursor-pointer shadow-xl"
                      onClick={() => ExportManager.downloadFromUrl(snap.url, `frame-${snap.time.toFixed(1)}.jpg`)}
                    >
                      <img src={snap.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <DownloadCloud className="w-6 h-6 text-foreground drop-shadow-2xl" />
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-muted/60 backdrop-blur-md text-[8px] font-bold text-primary border border-border tracking-wider">{snap.time.toFixed(1)}S</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {!outputUrl && snapshots.length === 0 && (
              <div className="py-32 text-center space-y-6 opacity-10">
                <div className="w-12 h-12 rounded-2xl bg-secondary/50 border border-dashed border-border flex items-center justify-center mx-auto animate-pulse">
                  <History className="w-8 h-8" />
                </div>
                <p className="text-[11px] font-bold tracking-[0.4em]">{t("workspace.sessionIdle")}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-8 border-t border-border bg-muted/40 shrink-0">
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold tracking-[0.4em] text-foreground/15">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> {t("workspace.guard")}
          </div>
        </div>
      </aside>
    </>
  );
}
