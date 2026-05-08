"use client";

import React, { useState, useRef, useEffect } from "react";
import { fetchFile } from "@ffmpeg/util";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, Settings2, Trash2, CheckCircle2, Loader2,
  FileDown, ArrowRight, Zap, Scissors, Minimize2,
  Film, Play, Pause, Clock, AlertTriangle, 
  Terminal, Layers, Cpu, ShieldCheck, DownloadCloud,
  Maximize, VolumeX, FastForward, Gauge, Smartphone,
  Camera, History, Undo2, Redo2, Sparkles, RefreshCw,
  Check, X, FileVideo, Timer, Scaling, RotateCw,
  EyeOff, Sliders, Type
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExportManager } from "@/lib/export-manager";
import { FAQ } from "@/components/shared/FAQ";
import { Footer } from "@/components/shared/Footer";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { VIDEO_TOOLS_FAQ } from "@/lib/faq-content";
import { loadFFmpegInstance } from "@/lib/ffmpeg-loader";

export default function VideoStudioPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  
  // Studio Settings
  const [crf, setCrf] = useState(28);
  const [preset, setPreset] = useState("ultrafast");
  const [outputFormat, setOutputFormat] = useState("mp4");
  const [mute, setMute] = useState(false);
  const [resolution, setResolution] = useState("original");
  const [rotation, setRotation] = useState("0");
  const [speed, setSpeed] = useState("1.0");
  const [privacyBlur, setPrivacyBlur] = useState(false);
  const [blurRegions, setBlurRegions] = useState<{ x: number; y: number; w: number; h: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [snapshots, setSnapshots] = useState<{ url: string; time: number }[]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  const ffmpegRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    initEngine();
  }, []);

  const initEngine = async () => {
    try {
      const ffmpeg = await loadFFmpegInstance(
        (p) => setProgress(Math.round(p * 100)),
        (msg) => setLogs((prev) => [...prev.slice(-15), msg])
      );
      ffmpegRef.current = ffmpeg;
      setIsLoaded(true);
    } catch (e) {
      console.error("Engine Initialization Failed", e);
      toast.error("WASM Engine failed to boot. Check browser logs.");
    }
  };

  const handleFileDrop = (files: File[]) => {
    if (files[0]) {
      const file = files[0];
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setOutputUrl(null);
      setSnapshots([]);
      setLogs(["Engine Ready. Asset Mounted: " + file.name]);
      
      // Get duration
      const tempVideo = document.createElement("video");
      tempVideo.src = url;
      tempVideo.onloadedmetadata = () => {
        setDuration(tempVideo.duration);
        setTrimEnd(tempVideo.duration);
      };
    }
  };

  const processVideo = async () => {
    if (!videoFile || !isLoaded) return;
    setIsProcessing(true);
    setProgress(0);
    const ffmpeg = ffmpegRef.current;
    const inputExt = videoFile.name.substring(videoFile.name.lastIndexOf("."));
    const inputName = "input" + inputExt;
    const outputName = "out.mp4"; // Always output mp4 — most compatible

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

      const args: string[] = ["-y"];

      // Fast seek before -i (keyframe-accurate)
      if ((trimStart ?? 0) > 0) args.push("-ss", (trimStart ?? 0).toFixed(3));

      args.push("-i", inputName);

      // Duration limit
      if ((trimEnd ?? duration) < duration) {
        const dur = (trimEnd ?? duration) - (trimStart ?? 0);
        if (dur > 0) args.push("-t", dur.toFixed(3));
      }

      // ─── Build video filter chain ─────────────────────────────────────────
      const vFilters: string[] = [];
      if (resolution === "1080p") vFilters.push("scale=-2:1080");
      else if (resolution === "720p") vFilters.push("scale=-2:720");
      else if (resolution === "480p") vFilters.push("scale=-2:480");
      else if (resolution === "360p") vFilters.push("scale=-2:360");
      if (privacyBlur) vFilters.push("boxblur=60:30");
      if (rotation === "90") vFilters.push("transpose=1");
      else if (rotation === "180") vFilters.push("vflip,hflip");
      else if (rotation === "270") vFilters.push("transpose=2");
      if (speed !== "1.0") vFilters.push(`setpts=${(1 / parseFloat(speed)).toFixed(6)}*PTS`);

      const baseVf = vFilters.join(",");

      // ─── Apply filters ────────────────────────────────────────────────────
      if (blurRegions.length > 0) {
        // filter_complex path — requires explicit stream mapping
        let complex = "";
        let currentIn = "0:v";
        if (baseVf) {
          complex += `[0:v]${baseVf}[v_base];`;
          currentIn = "v_base";
        }
        blurRegions.forEach((reg, i) => {
          const rx = `round(iw*${(reg.x / 100).toFixed(6)})`;
          const ry = `round(ih*${(reg.y / 100).toFixed(6)})`;
          const rw = `round(iw*${(reg.w / 100).toFixed(6)})`;
          const rh = `round(ih*${(reg.h / 100).toFixed(6)})`;
          const isLast = i === blurRegions.length - 1;
          const out = isLast ? "v_final" : `v_out_${i}`;
          complex += `[${currentIn}]split[orig_${i}][forblur_${i}];`;
          complex += `[forblur_${i}]crop=${rw}:${rh}:${rx}:${ry},boxblur=60:30,scale=${rw}:${rh}[blurred_${i}];`;
          complex += `[orig_${i}][blurred_${i}]overlay=${rx}:${ry}[${out}]${isLast ? "" : ";"}`;
          currentIn = out;
        });
        args.push("-filter_complex", complex);
        args.push("-map", "[v_final]", "-map", "0:a:0"); // explicit mapping required with filter_complex
      } else if (baseVf) {
        // Simple -vf path — no explicit mapping needed (FFmpeg picks best streams)
        args.push("-vf", baseVf);
      }
      // No filters: FFmpeg auto-selects streams — no -map needed

      // ─── Video codec ──────────────────────────────────────────────────────
      args.push(
        "-c:v", "libx264",
        "-crf", (crf ?? 23).toString(),
        "-preset", preset || "ultrafast",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
      );

      // ─── Audio ────────────────────────────────────────────────────────────
      if (mute) {
        args.push("-an");
      } else {
        const s = parseFloat(speed);
        if (s !== 1.0) {
          // atempo only works in 0.5–2.0 range; cascade outside that
          const af = s <= 0.5
            ? `atempo=0.5,atempo=${(s / 0.5).toFixed(4)}`
            : s >= 2.0
              ? `atempo=2.0,atempo=${(s / 2.0).toFixed(4)}`
              : `atempo=${s}`;
          args.push("-af", af);
          args.push("-c:a", "aac", "-b:a", "128k");
        } else {
          // Speed=1: copy audio to avoid transcoding artifacts + failure
          args.push("-c:a", "copy");
        }
      }

      args.push(outputName);

      setLogs(prev => [...prev, `⚙ ffmpeg ${args.join(" ")}`]);
      await ffmpeg.exec(args);

      // Don't rely on exit code (varies across @ffmpeg/ffmpeg versions) — check bytes
      const data = await ffmpeg.readFile(outputName);
      const raw = data as Uint8Array;

      if (!raw || raw.length === 0) {
        throw new Error("Output is empty (0 bytes). Check the Engine Feed for FFmpeg errors.");
      }

      const safeBuffer = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength) as ArrayBuffer;
      const url = URL.createObjectURL(new Blob([safeBuffer], { type: "video/mp4" }));
      setOutputUrl(url);
      setLogs(prev => [...prev, `✓ SUCCESS: ${(raw.length / 1024 / 1024).toFixed(2)} MB`]);
      toast.success("Export complete!");

      try { await ffmpeg.deleteFile(inputName); } catch {}
      try { await ffmpeg.deleteFile(outputName); } catch {}
    } catch (e: any) {
      console.error("[Video Studio] Pipeline Error:", e);
      setLogs(prev => [...prev, `✗ ${e?.message || "Pipeline failed."}`]);
      toast.error(`Export failed: ${e?.message || "Check engine logs."}`);
    } finally {
      setIsProcessing(false);
    }
  };



  const takeSnapshot = async () => {
    if (!videoFile || !isLoaded) return;
    const ffmpeg = ffmpegRef.current;
    const inputName = "snap_" + videoFile.name;
    const outputName = `snap_${Date.now()}.jpg`;

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(videoFile));
      const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toFixed(3).padStart(6, '0');
        return `${h}:${m}:${s}`;
      };

      await ffmpeg.exec(["-y", "-ss", formatTime(currentTime), "-i", inputName, "-vframes", "1", "-q:v", "2", outputName]);
      const snapData = await ffmpeg.readFile(outputName);
      const rawSnap = snapData as Uint8Array;
      const snapBuffer = rawSnap.buffer.slice(rawSnap.byteOffset, rawSnap.byteOffset + rawSnap.byteLength) as ArrayBuffer;
      const url = URL.createObjectURL(new Blob([snapBuffer], { type: "image/jpeg" }));
      setSnapshots(prev => [{ url, time: currentTime }, ...prev]);
      toast.success("Frame Captured");
    } catch (e) {
      toast.error("Capture Failed");
    }
  };

  const CircularProgress = ({ value }: { value: number }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    return (
      <div className="relative flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
          <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="text-primary transition-all duration-500 ease-out shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black tabular-nums tracking-tighter italic">{value}%</span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Rendering</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-background text-foreground overflow-y-auto lg:overflow-hidden lg:overflow-hidden selection:bg-primary/30 custom-scrollbar">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-visible lg:overflow-hidden relative scrollbar-hide">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-blue-500/5 blur-[140px] rounded-full animate-pulse" />
        </div>

        {!videoFile ? (
          <div className="flex-grow flex items-center justify-center p-8 relative z-10">
            <div className="max-w-xl w-full space-y-6 text-center">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/20 flex items-center justify-center mx-auto shadow-2xl relative group">
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Video className="w-10 h-10 text-primary relative z-10" />
                </div>
                <div className="space-y-4">
                  <h1 className="text-2xl md:text-2xl font-black tracking-tighter uppercase italic leading-none">Video <br/><span className="text-primary">Studio Pro.</span></h1>
                  <p className="text-muted-foreground/60 text-xl font-medium max-w-md mx-auto leading-relaxed italic">Privacy-focused, high-performance localized video production laboratory.</p>
                </div>
              </div>
              <DropZone onFilesDrop={handleFileDrop} accept="video/*" multiple={false} className="h-64 border-dashed border-border bg-secondary/30 rounded-3xl hover:bg-secondary/70 hover:border-primary/40 transition-all group" />
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Studio Controls */}
            <aside className="flex w-full lg:w-[300px] border-b lg:border-b-0 lg:border-r border-border bg-card/40 backdrop-blur-3xl flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3"><Sliders className="w-4 h-4" /> Asset Inspector</h3>
                  <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">Industrial WASM Pipeline v4.5</p>
                </div>
                <Badge variant="outline" className="text-[10px] border-emerald-500/20 bg-emerald-500/5 text-emerald-500 px-4 py-1.5 rounded-full font-black italic shadow-[0_0_15px_rgba(16,185,129,0.1)]">ACTIVE ENGINE</Badge>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <Tabs defaultValue="render" className="w-full">
                  <TabsList className="w-full h-10 bg-muted/40 border-b border-border rounded-none p-0">
                    <TabsTrigger value="render" className="flex-1 h-full rounded-none data-[state=active]:bg-primary/5 data-[state=active]:text-primary border-r border-border font-black text-[10px] uppercase tracking-widest">Pipeline</TabsTrigger>
                    <TabsTrigger value="filters" className="flex-1 h-full rounded-none data-[state=active]:bg-primary/5 data-[state=active]:text-primary border-r border-border font-black text-[10px] uppercase tracking-widest">Filters</TabsTrigger>
                    <TabsTrigger value="timeline" className="flex-1 h-full rounded-none data-[state=active]:bg-primary/5 data-[state=active]:text-primary font-black text-[10px] uppercase tracking-widest">Timeline</TabsTrigger>
                  </TabsList>

                  <div className="p-8 pb-12">
                    <TabsContent value="render" className="m-0 space-y-5">
                      <div className="space-y-5">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 flex items-center justify-between">
                          <span>Quality Density (CRF)</span>
                          <span className="text-primary tabular-nums">{crf}</span>
                        </Label>
                        <Slider value={[crf ?? 28]} min={0} max={51} step={1} onValueChange={(v) => setCrf(Array.isArray(v) ? (v[0] ?? 28) : (v ?? 28))} className="py-2" />
                        <div className="flex justify-between text-[8px] font-black uppercase text-muted-foreground/40 tracking-widest">
                          <span>High Quality (0)</span>
                          <span>Max Compression (51)</span>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Render Preset</Label>
                        <Select value={preset} onValueChange={(v) => setPreset(v ?? "ultrafast")}>
                          <SelectTrigger className="h-10 rounded-2xl bg-white/[0.03] border-border font-black text-[10px] uppercase tracking-widest">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {["ultrafast", "superfast", "veryfast", "faster", "fast", "medium", "slow", "slower", "veryslow"].map(p => (
                              <SelectItem key={p} value={p} className="font-black text-[10px] uppercase py-3">{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-[8px] font-medium text-muted-foreground/40 uppercase tracking-widest leading-relaxed">Faster presets = larger files. Slower presets = better compression.</p>
                      </div>

                      <div className="space-y-5">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Target Protocol</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {["mp4", "webm", "mkv", "avi"].map(fmt => (
                            <Button key={fmt} variant={outputFormat === fmt ? "default" : "ghost"} className={cn("rounded-2xl text-[10px] font-black h-12 uppercase tracking-widest border border-border", outputFormat === fmt ? "bg-primary text-foreground shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]" : "text-muted-foreground/50 hover:bg-secondary/50")} onClick={() => setOutputFormat(fmt)}>{fmt}</Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-5">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Scale Resolution</Label>
                        <Select value={resolution} onValueChange={(v) => setResolution(v ?? "original")}>
                          <SelectTrigger className="h-10 rounded-2xl bg-white/[0.03] border-border font-black text-[10px] uppercase tracking-widest">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="original" className="font-black text-[10px] uppercase py-3">Native Matrix</SelectItem>
                            <SelectItem value="1080p" className="font-black text-[10px] uppercase py-3">HD 1080p</SelectItem>
                            <SelectItem value="720p" className="font-black text-[10px] uppercase py-3">HD 720p</SelectItem>
                            <SelectItem value="480p" className="font-black text-[10px] uppercase py-3">SD 480p</SelectItem>
                            <SelectItem value="360p" className="font-black text-[10px] uppercase py-3">Mobile 360p</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between p-5 rounded-3xl bg-secondary/30 border border-border">
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-wider">Mute Audio</Label>
                          <p className="text-[8px] font-medium text-muted-foreground/40 uppercase tracking-widest">Strip binary stream</p>
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
                            <Label className="text-[11px] font-black uppercase text-foreground/80 tracking-wider">Privacy Blur</Label>
                            <p className="text-[8px] font-medium text-muted-foreground/50 uppercase tracking-widest italic">Global Anonymization</p>
                          </div>
                        </div>
                        <Switch checked={privacyBlur} onCheckedChange={setPrivacyBlur} className="data-[state=checked]:bg-primary" />
                      </div>

                      {/* Region Manager */}
                      <div className="space-y-6">
                         <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Active Blur Zones</h4>
                            <Badge variant="outline" className="text-[9px] border-primary/20 text-primary font-black italic">{blurRegions.length} Regions</Badge>
                         </div>
                         
                         <ScrollArea className="h-[200px] rounded-3xl bg-secondary/30 border border-border p-4">
                            <div className="space-y-3">
                               {blurRegions.length === 0 ? (
                                  <div className="flex flex-col items-center justify-center h-[160px] text-center space-y-3 opacity-30">
                                     <Sparkles className="w-8 h-8" />
                                     <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">Drag on the video preview<br/>to create anonymization zones</p>
                                  </div>
                               ) : (
                                  blurRegions.map((reg, i) => (
                                     <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-border group hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-4">
                                           <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black italic">
                                              #{i+1}
                                           </div>
                                           <div className="flex flex-col">
                                              <span className="text-[9px] font-black uppercase text-muted-foreground/80">Area {Math.round(reg.w)}x{Math.round(reg.h)}%</span>
                                              <span className="text-[8px] text-muted-foreground/40 uppercase font-bold tracking-widest">Offset {Math.round(reg.x)}:{Math.round(reg.y)}</span>
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
                            <Button variant="outline" className="w-full h-12 rounded-2xl border-border bg-secondary/30 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all" onClick={() => setBlurRegions([])}>
                               RESET ALL ZONES
                            </Button>
                         )}
                      </div>

                      <div className="space-y-5">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Spatial Rotation</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { val: "0", icon: Maximize },
                            { val: "90", icon: RotateCw },
                            { val: "180", icon: RotateCw },
                            { val: "270", icon: RotateCw }
                          ].map((r, i) => (
                            <Button key={r.val} variant={rotation === r.val ? "default" : "ghost"} className={cn("rounded-xl h-12 flex flex-col items-center justify-center gap-1", rotation === r.val ? "bg-primary text-foreground" : "text-muted-foreground/40 border border-border")} onClick={() => setRotation(r.val)}>
                              <r.icon className={cn("w-4 h-4", r.val === "180" && "rotate-180", r.val === "270" && "-rotate-90")} />
                              <span className="text-[8px] font-black">{r.val}°</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-5">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Temporal Velocity</Label>
                        <Select value={speed} onValueChange={(v) => setSpeed(v ?? "1.0")}>
                          <SelectTrigger className="h-10 rounded-2xl bg-white/[0.03] border-border font-black text-[10px] uppercase tracking-widest">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="0.5" className="font-black text-[10px] uppercase py-3">0.5x (Slow Motion)</SelectItem>
                            <SelectItem value="1.0" className="font-black text-[10px] uppercase py-3">1.0x (Standard)</SelectItem>
                            <SelectItem value="1.5" className="font-black text-[10px] uppercase py-3">1.5x (Accelerated)</SelectItem>
                            <SelectItem value="2.0" className="font-black text-[10px] uppercase py-3">2.0x (Hyperlapse)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TabsContent>

                    <TabsContent value="timeline" className="m-0 space-y-5">
                      <div className="p-6 rounded-2xl bg-secondary/30 border border-border space-y-4">
                        <div className="flex items-center gap-3 text-primary">
                          <Scissors className="w-5 h-5" />
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Precision Trim</h4>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 italic">
                               <span>Segment Start</span>
                               <span className="text-primary">{(trimStart ?? 0).toFixed(2)}s</span>
                            </div>
                            <Slider value={[trimStart ?? 0]} min={0} max={trimEnd ?? duration} step={0.1} onValueChange={(v) => setTrimStart(Array.isArray(v) ? (v[0] ?? 0) : (v ?? 0))} />
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 italic">
                              <span>Segment End</span>
                              <span className="text-primary">{(trimEnd ?? duration).toFixed(2)}s</span>
                            </div>
                            <Slider value={[trimEnd ?? duration]} min={trimStart ?? 0} max={duration} step={0.1} onValueChange={(v) => setTrimEnd(Array.isArray(v) ? (v[0] ?? duration) : (v ?? duration))} />
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-border">
                           <div className="flex flex-col gap-1">
                             <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">Active Runtime</span>
                             <span className="text-xs font-black italic tabular-nums text-primary">{((trimEnd ?? duration) - (trimStart ?? 0)).toFixed(2)}s</span>
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
                <Button className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-foreground font-black text-xl gap-4 shadow-[0_20px_60px_rgba(var(--primary-rgb),0.3)] group active:scale-95 transition-all italic disabled:grayscale disabled:opacity-50" onClick={processVideo} disabled={isProcessing || !isLoaded}>
                  {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Zap className="w-7 h-7 group-hover:scale-125 transition-transform" />}
                  {isProcessing ? "Rendering Asset..." : "Export Pro Studio"}
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
                    <h2 className="font-black text-xl tracking-tighter uppercase italic truncate max-w-[200px] md:max-w-xl">{videoFile.name}</h2>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full font-black uppercase tracking-[0.2em] italic">SOURCE MOUNTED</Badge>
                      <span className="text-[10px] text-muted-foreground/40 uppercase font-black tracking-widest tabular-nums italic">{((videoFile.size) / 1024 / 1024).toFixed(2)} MB • {(duration ?? 0).toFixed(1)}s</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-2xl hover:bg-secondary/50 text-muted-foreground/50 hover:text-foreground transition-all shadow-xl" onClick={takeSnapshot} title="Capture Precise Frame">
                    <Camera className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-2xl hover:bg-red-500/10 text-muted-foreground/50 hover:text-red-500 transition-all shadow-xl" onClick={() => setVideoFile(null)}>
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
                        
                        {/* Interactive Blur Regions Overlay */}
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

                        {/* Custom Playback Overlay (since controls are disabled for drawing) */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl bg-muted/80 backdrop-blur-3xl border border-border flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
                           <Button variant="ghost" size="icon" className="text-muted-foreground/60 hover:text-foreground" onClick={() => { if (videoRef.current?.paused) { videoRef.current.play().catch(() => {}); } else { videoRef.current?.pause(); } }}>
                              <Play className="w-5 h-5" />
                           </Button>
                           <div className="h-4 w-px bg-secondary" />
                           <span className="text-[10px] font-black tabular-nums italic text-primary">
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
                       <span className="text-[8px] font-black uppercase tracking-widest text-primary italic">Engine Feed</span>
                       <div className="flex gap-1">
                          <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
                          <div className="w-1 h-1 rounded-full bg-primary/20" />
                       </div>
                    </div>
                    <div className="h-11 overflow-y-auto scrollbar-hide font-mono text-[8px] text-muted-foreground/50 space-y-1">
                       {logs.slice(-3).map((log, i) => <div key={i} className="truncate tracking-tight opacity-60 italic">{">"} {log}</div>)}
                    </div>
                 </div>
              </div>
            </section>

            {/* Right Sidebar - Gallery & History */}
            <aside className="flex w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-border bg-card/40 backdrop-blur-3xl shrink-0 flex-col relative z-10 shadow-2xl h-[500px] lg:h-full">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3"><History className="w-4 h-4" /> Render Output</h3>
                  <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none mt-1">Exported Asset History</p>
                </div>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-8 space-y-5 pb-12">
                  {outputUrl && (
                    <div className="space-y-4">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-emerald-500 flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4" /> Session Success
                      </Label>
                      <Card className="p-6 bg-white/[0.03] border-emerald-500/20 hover:border-emerald-500/40 transition-all group flex flex-col gap-3 rounded-xl shadow-2xl shadow-emerald-500/5">
                         <div className="flex items-center gap-5">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 group-hover:scale-110 transition-transform">
                               <FileVideo className="w-7 h-7" />
                            </div>
                            <div className="min-w-0 space-y-1">
                               <p className="text-xs font-black uppercase truncate tracking-tighter">export_{outputFormat}.{outputFormat}</p>
                               <div className="flex gap-2">
                                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/10 text-[8px] px-2 py-0">PRO</Badge>
                                  <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest italic">{outputFormat.toUpperCase()}</span>
                               </div>
                            </div>
                         </div>
                         <Button 
                            className="w-full h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-foreground font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-600/20 gap-3 active:scale-95 transition-all" 
                            onClick={() => ExportManager.downloadFromUrl(outputUrl, `studio-export-${Date.now()}.${outputFormat}`)}
                          >
                             <DownloadCloud className="w-5 h-5" /> Export Asset
                          </Button>
                      </Card>
                    </div>
                  )}

                  {snapshots.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-border pb-4">
                        <Label className="text-[10px] uppercase font-black tracking-widest opacity-40 italic">Precision Frames</Label>
                        <Badge variant="outline" className="text-[9px] font-black text-muted-foreground/40 border-border">{snapshots.length} UNITS</Badge>
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
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-muted/60 backdrop-blur-md text-[8px] font-black text-primary border border-border tracking-widest">{snap.time.toFixed(1)}S</div>
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
                       <p className="text-[11px] font-black uppercase tracking-[0.4em] italic">Session Idle</p>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-8 border-t border-border bg-muted/40 shrink-0">
                <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/15 italic">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> AES-256 Thread Guard
                </div>
              </div>
            </aside>
          </>
        )}
      </main>

      <SEOStructuredData 
        name="Video Studio Pro"
        description="Compress, convert, and anonymize video files locally in your browser. 100% private, zero server uploads, high-performance WASM engine."
        url="https://safetools.space/video"
        faqItems={VIDEO_TOOLS_FAQ}
      />
      <FAQ 
        items={VIDEO_TOOLS_FAQ}
        title="Video Studio FAQ"
        description="Technical insights and common questions about our private, browser-based video processing technology."
      />
      <Footer />
    </div>
  );
}

