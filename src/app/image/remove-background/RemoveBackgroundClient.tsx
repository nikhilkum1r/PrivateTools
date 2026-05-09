"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ShieldCheck, Trash2,
  CheckCircle2, AlertCircle, RefreshCcw, ImageIcon,
  Download, Copy, Maximize2,
  Cpu, Database, Monitor, Briefcase, Lock, Fingerprint, Search, Zap, Smartphone, Play, FileDown, FileText, Settings2, WifiOff, Scissors,
  List, Layers, Eraser, Paintbrush, Undo, Redo, MousePointer2, ChevronLeft, ChevronRight, X, CheckCircle
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FAQ } from "@/components/shared/FAQ";
import { DropZone } from "@/components/shared/DropZone";
import { TrustLayer } from "@/components/shared/TrustLayer";
import { ToolHealth } from "@/components/shared/ToolHealth";
import { WhySafeTools } from "@/components/shared/WhySafeTools";
import { LocalProcessingGuide } from "@/components/shared/LocalProcessingGuide";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
type Status = "idle" | "processing" | "done" | "error";

interface ProcessedResult {
  file: File;
  preview: string;
  resultBlob: Blob | null;
  resultPreview: string | null;
  maskBlob: Blob | null; // For manual edits
  status: Status;
  progress: number;
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

export default function RemoveBackgroundClient() {
  const [batch, setBatch]                 = useState<ProcessedResult[]>([]);
  const [activeIndex, setActiveIndex]     = useState<number>(-1);
  const [status, setStatus]               = useState<Status>("idle");
  const [globalProgress, setGlobalProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [bgColor, setBgColor]             = useState("transparent");
  const [customBgPreview, setCustomBgPreview] = useState<string | null>(null);
  const [exportFormat, setExportFormat]   = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [sliderPos, setSliderPos]         = useState(50);
  const [aspectRatio, setAspectRatio]     = useState<"original" | "1:1" | "4:5" | "9:16">("original");
  const [hasShadow, setHasShadow]         = useState(false);
  const [autoTrim, setAutoTrim]           = useState(false);
  const [processTime, setProcessTime]     = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Brush / Magic Eraser State
  const [isBrushMode, setIsBrushMode]     = useState(false);
  const [brushSize, setBrushSize]         = useState(20);
  const [brushMode, setBrushMode]         = useState<"erase" | "restore">("erase");
  const brushCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing]         = useState(false);

  const workerRef = useRef<Worker | null>(null);

  const bgPresets = [
    { name: "Transparent", value: "transparent" },
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Studio Blue", value: "#3b82f6" },
    { name: "Soft Gray", value: "#f3f4f6" },
    { name: "Corporate", value: "#1e293b" },
  ];

  useEffect(() => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;

    worker.addEventListener("message", (event: MessageEvent) => {
      const { type, pct, key, buffer, mimeType, error } = event.data;

      setBatch(prev => {
        const next = [...prev];
        const currentIdx = next.findIndex(item => item.status === "processing");
        if (currentIdx === -1) return prev;

        switch (type) {
          case "status":
            setProgressLabel(event.data.message ?? "Processing…");
            break;
          case "progress":
            next[currentIdx].progress = pct ?? 0;
            setGlobalProgress(pct ?? 0);
            break;
          case "result":
            const blob = new Blob([buffer], { type: mimeType ?? "image/png" });
            const url = URL.createObjectURL(blob);
            if (startTimeRef.current) setProcessTime(Date.now() - startTimeRef.current);
            next[currentIdx].resultBlob = blob;
            next[currentIdx].resultPreview = url;
            next[currentIdx].status = "done";
            next[currentIdx].progress = 100;
            
            const nextPendingIdx = next.findIndex((item, i) => i > currentIdx && item.status === "idle");
            if (nextPendingIdx !== -1) {
              setTimeout(() => processItem(nextPendingIdx, next), 100);
            } else {
              setStatus("done");
              toast.success("All images processed!");
            }
            break;
          case "error":
            next[currentIdx].status = "error";
            toast.error(`Error processing ${next[currentIdx].file.name}: ${error}`);
            break;
        }
        return next;
      });
    });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const processItem = async (index: number, currentBatch: ProcessedResult[]) => {
    const item = currentBatch[index];
    if (!item || !workerRef.current) return;
    
    setBatch(prev => {
      const next = [...prev];
      next[index].status = "processing";
      return next;
    });
    
    setStatus("processing");
    setActiveIndex(index);
    setProgressLabel(`Processing ${item.file.name}...`);
    startTimeRef.current = Date.now();
    
    try {
      const url = URL.createObjectURL(item.file);
      workerRef.current.postMessage({ type: "process", imageDataURL: url });
      // We don't revoke here because the worker needs to fetch it. 
      // The library or a later cleanup should handle it, or we can revoke in the worker.
    } catch (err: any) {
      toast.error("Failed to prepare image");
    }
  };

  const getExportBlob = async (index: number = activeIndex): Promise<Blob> => {
    const item = batch[index];
    if (!item?.resultPreview || !item?.resultBlob) return null as any;

    const img = await new Promise<HTMLImageElement>((resolve) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.src = item.resultPreview!;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    // Apply manual mask if exists
    if (item.maskBlob) {
      const maskImg = await new Promise<HTMLImageElement>((resolve) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.src = URL.createObjectURL(item.maskBlob!);
      });
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(maskImg, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    }

    let sourceCanvas = canvas;

    // 1. Auto-Trim Edges
    if (autoTrim) {
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const l = pixels.data.length;
      let top = null, left = null, right = null, bottom = null;
      let x, y;

      for (let i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) { // Alpha channel
          x = (i / 4) % canvas.width;
          y = Math.floor((i / 4) / canvas.width);
          if (top === null) top = y;
          if (left === null) left = x;
          else if (x < left) left = x;
          if (right === null) right = x;
          else if (right < x) right = x;
          if (bottom === null) bottom = y;
          else if (bottom < y) bottom = y;
        }
      }

      if (top !== null && left !== null && right !== null && bottom !== null) {
        const trimWidth = right - left + 1;
        const trimHeight = bottom - top + 1;
        const trimmed = document.createElement("canvas");
        trimmed.width = trimWidth;
        trimmed.height = trimHeight;
        trimmed.getContext("2d")!.drawImage(canvas, left, top, trimWidth, trimHeight, 0, 0, trimWidth, trimHeight);
        sourceCanvas = trimmed;
      }
    }

    // 2. Aspect Ratio & Canvas Size
    let targetWidth = sourceCanvas.width;
    let targetHeight = sourceCanvas.height;

    if (aspectRatio !== "original") {
      const [rw, rh] = aspectRatio.split(":").map(Number);
      const targetRatio = rw / rh;
      const currentRatio = sourceCanvas.width / sourceCanvas.height;
      if (currentRatio > targetRatio) {
        targetHeight = sourceCanvas.width / targetRatio;
      } else {
        targetWidth = sourceCanvas.height * targetRatio;
      }
    }

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = targetWidth;
    finalCanvas.height = targetHeight;
    const fCtx = finalCanvas.getContext("2d")!;

    // 3. Background Color / Custom Image
    const effectiveBgColor = (exportFormat === "image/jpeg" && bgColor === "transparent" && !customBgPreview) 
      ? "#ffffff" 
      : bgColor;

    if (customBgPreview) {
      const bgImg = await new Promise<HTMLImageElement>((resolve) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.src = customBgPreview;
      });
      const scale = Math.max(finalCanvas.width / bgImg.width, finalCanvas.height / bgImg.height);
      const x = (finalCanvas.width - bgImg.width * scale) / 2;
      const y = (finalCanvas.height - bgImg.height * scale) / 2;
      fCtx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
    } else if (effectiveBgColor !== "transparent") {
      fCtx.fillStyle = effectiveBgColor;
      fCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    }

    // 4. Drop Shadow
    if (hasShadow) {
      fCtx.shadowColor = "rgba(0, 0, 0, 0.4)";
      fCtx.shadowBlur = Math.max(targetWidth, targetHeight) * 0.02;
      fCtx.shadowOffsetX = 0;
      fCtx.shadowOffsetY = fCtx.shadowBlur / 2;
    }

    // 5. Draw Subject Centered
    const dx = (targetWidth - sourceCanvas.width) / 2;
    const dy = (targetHeight - sourceCanvas.height) / 2;
    fCtx.drawImage(sourceCanvas, dx, dy);

    return new Promise((resolve) => {
      finalCanvas.toBlob((b) => resolve(b!), exportFormat, 0.95);
    });
  };

  const handleExport = async (index: number = activeIndex) => {
    const item = batch[index];
    if (!item) return;
    const finalBlob = await getExportBlob(index);
    const url = URL.createObjectURL(finalBlob);
    const a = document.createElement("a");
    const ext = exportFormat === "image/jpeg" ? "jpg" : (exportFormat === "image/webp" ? "webp" : "png");
    a.href = url;
    a.download = item.file.name.replace(/\.[^/.]+$/, "") + `_studio.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (customBgPreview) URL.revokeObjectURL(customBgPreview);
    const url = URL.createObjectURL(f);
    setCustomBgPreview(url);
    setBgColor("custom-image");
  };

  const handleDrop = useCallback((files: File[]) => {
    const validFiles = files.filter(f => {
      if (f.type === "image/svg+xml") {
        toast.error(`SVG files are not supported (${f.name})`);
        return false;
      }
      if (!f.type.startsWith("image/")) {
        toast.error(`Invalid file type (${f.name})`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newItems: ProcessedResult[] = validFiles.map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      resultBlob: null,
      resultPreview: null,
      maskBlob: null,
      status: "idle",
      progress: 0,
    }));

    setBatch(prev => [...prev, ...newItems]);
    if (activeIndex === -1) setActiveIndex(0);
  }, [activeIndex]);

  const handleCopy = async () => {
    try {
      const blob = await getExportBlob();
      const canvas = document.createElement("canvas");
      const img = await new Promise<HTMLImageElement>((res) => {
        const el = new Image();
        el.onload = () => res(el);
        el.src = URL.createObjectURL(blob);
      });
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
      const pngBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
      URL.revokeObjectURL(img.src);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Copy failed: Most browsers only support copying PNGs.");
    }
  };

  const handleStart = useCallback(async () => {
    if (batch.length === 0 || status === "processing") return;
    const firstIdle = batch.findIndex(item => item.status === "idle");
    if (firstIdle !== -1) {
      processItem(firstIdle, batch);
    }
  }, [batch, status]);

  const handleReset = useCallback(() => {
    batch.forEach(item => {
      URL.revokeObjectURL(item.preview);
      if (item.resultPreview) URL.revokeObjectURL(item.resultPreview);
    });
    setBatch([]);
    setActiveIndex(-1);
    setStatus("idle");
    setGlobalProgress(0);
    setBgColor("transparent");
    setCustomBgPreview(null);
    setSliderPos(50);
  }, [batch]);

  // ── Brush Logic ─────────────────────────────────────────────────────────────
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isBrushMode) return;
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !brushCanvasRef.current) return;
    const canvas = brushCanvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const x = (("touches" in e) ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = (("touches" in e) ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;
    
    // Scale coordinates to internal canvas resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = brushMode === "erase" ? "destination-out" : "source-over";
    
    ctx.lineTo(x * scaleX, y * scaleY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x * scaleX, y * scaleY);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (!brushCanvasRef.current) return;
    const ctx = brushCanvasRef.current.getContext("2d")!;
    ctx.beginPath();
  };

  const saveMask = async () => {
    if (!brushCanvasRef.current || activeIndex === -1) return;
    const blob = await new Promise<Blob>((res) => brushCanvasRef.current!.toBlob((b) => res(b!), "image/png"));
    setBatch(prev => {
      const next = [...prev];
      next[activeIndex].maskBlob = blob;
      return next;
    });
    setIsBrushMode(false);
    toast.success("Mask updated!");
  };

  const isWorking = status === "processing";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 custom-scrollbar">
      <Navbar />

      <main className="flex-grow flex flex-col relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-24 pb-8 px-4 container mx-auto text-center max-w-4xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(34,197,94,0.15)]">
              <Sparkles className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-foreground">
                Remove Image Backgrounds
              </h1>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto leading-tight">
                Remove backgrounds from images instantly using browser-based privacy-first processing with zero uploads and local AI tools.
              </p>
              <p className="text-sm font-medium text-emerald-500 bg-emerald-500/10 inline-block px-4 py-2 rounded-full border border-emerald-500/20">
                Professional AI-powered subject segmentation — 100% Secure.
              </p>
            </div>
          </motion.div>
        </section>

        <TrustLayer />

        {/* INTERACTIVE STUDIO AREA */}
        <section className="flex-grow flex flex-col lg:flex-row overflow-hidden relative border-t border-border bg-black/20 min-h-[600px]">
          {batch.length === 0 ? (
            <div className="flex-grow flex items-center justify-center p-8 relative z-10 w-full">
              <div className="max-w-xl w-full space-y-5 text-center">
                <div className="space-y-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <Sparkles className="w-9 h-9 text-emerald-500" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-foreground">
                      AI <span className="text-emerald-500">Segmenter.</span>
                    </h2>
                    <p className="text-muted-foreground text-lg font-medium max-w-md mx-auto leading-relaxed">
                      Pure local segmentation. Zero cloud uploads. 100% Secure.
                    </p>
                  </div>
                </div>
                <DropZone onFilesDrop={handleDrop} accept="image/*" multiple={true} title=" " className="h-56 border-dashed border-border bg-black/20 rounded-2xl hover:bg-black/40 hover:border-emerald-500/30 transition-all" />
              </div>
            </div>
          ) : (
            <>
              {/* Left Sidebar - Batch Navigation */}
              <aside className="w-full lg:w-[100px] bg-black/40 border-r border-border flex lg:flex-col overflow-x-auto lg:overflow-y-auto p-3 gap-3 shrink-0 custom-scrollbar">
                   {batch.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                          "w-16 h-16 lg:w-full aspect-square rounded-xl border-2 transition-all flex-shrink-0 relative overflow-hidden group",
                          activeIndex === idx ? "border-emerald-500 shadow-lg shadow-emerald-500/20" : "border-transparent hover:border-border/60"
                        )}
                      >
                         <img src={item.preview} className="w-full h-full object-cover" alt="Batch item preview" />
                         {item.status === "processing" && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                               <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 animate-spin rounded-full" />
                            </div>
                         )}
                         {item.status === "done" && (
                            <div className="absolute top-1 right-1">
                               <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-black/50" />
                            </div>
                         )}
                      </button>
                   ))}
                   <div className="w-16 h-16 lg:w-full aspect-square rounded-xl border-2 border-dashed border-border/40 hover:border-emerald-500/40 transition-all flex items-center justify-center flex-shrink-0 relative">
                      <input type="file" accept="image/*" multiple onChange={(e) => handleDrop(Array.from(e.target.files || []))} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                   </div>
                </aside>

                {/* Center Column - Preview Area */}
                <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[400px] lg:min-h-0 h-full max-h-full border-b lg:border-b-0 lg:border-r border-border">
                   <header className="p-4 md:p-6 flex items-center justify-between border-b border-border relative z-20 gap-4 bg-black/10 backdrop-blur-xl shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                        <ImageIcon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-black text-base md:text-lg tracking-tighter uppercase italic truncate text-foreground">{batch[activeIndex]?.file.name}</h2>
                        <div className="flex items-center gap-3 mt-0.5">
                          <Badge className="text-[8px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 py-0.5 rounded-full font-black uppercase">
                            {batch[activeIndex]?.status === "done" ? "Subject Segmented" : "Pending Analysis"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       {batch[activeIndex]?.status === "done" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={cn("h-9 rounded-lg gap-2 text-[10px] font-black uppercase tracking-widest transition-all", isBrushMode ? "bg-emerald-500 text-white border-emerald-500" : "glass-card hover:bg-emerald-500/10")}
                            onClick={() => setIsBrushMode(!isBrushMode)}
                          >
                            <Eraser className="w-3.5 h-3.5" /> {isBrushMode ? "Close Magic Eraser" : "Magic Eraser"}
                          </Button>
                       )}
                       <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all shrink-0" onClick={handleReset}>
                        <Trash2 className="w-4.5 h-4.5" />
                      </Button>
                    </div>
                  </header>

                  <div className="flex-grow relative flex items-center justify-center p-6 lg:p-10 overflow-hidden bg-black/20">
                    <div 
                      className={cn(
                        "relative aspect-square w-full max-w-lg glass-card rounded-2xl border border-border shadow-2xl flex items-center justify-center overflow-hidden group",
                        batch[activeIndex]?.status === "done" && "border-emerald-500/30 shadow-emerald-500/5"
                      )}
                      style={{
                        backgroundColor: customBgPreview ? "transparent" : (bgColor === "transparent" ? undefined : bgColor),
                        backgroundImage: customBgPreview 
                          ? `url(${customBgPreview})`
                          : (bgColor === "transparent" 
                            ? "linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)"
                            : "none"),
                        backgroundSize: customBgPreview ? "cover" : "20px 20px",
                        backgroundPosition: customBgPreview ? "center" : "0 0, 0 10px, 10px -10px, -10px 0px",
                        aspectRatio: aspectRatio === "original" ? undefined : aspectRatio.replace(":", "/"),
                      }}
                    >
                      {/* Magic Eraser UI */}
                      {isBrushMode && batch[activeIndex]?.resultPreview && (
                         <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 glass-card bg-black/80 p-2 rounded-2xl border border-white/10">
                               <button onClick={() => setBrushMode("erase")} className={cn("p-2 rounded-lg transition-all", brushMode === "erase" ? "bg-emerald-500 text-white" : "text-muted-foreground hover:text-white")} title="Eraser Tool">
                                  <Eraser className="w-5 h-5" />
                               </button>
                               <button onClick={() => setBrushMode("restore")} className={cn("p-2 rounded-lg transition-all", brushMode === "restore" ? "bg-emerald-500 text-white" : "text-muted-foreground hover:text-white")} title="Restore Tool">
                                  <Paintbrush className="w-5 h-5" />
                               </button>
                               <div className="w-[1px] h-6 bg-white/10 mx-1" />
                               <div className="px-3 flex flex-col gap-1">
                                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Brush Size</span>
                                  <input type="range" min="5" max="100" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-24 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full" />
                               </div>
                               <div className="w-[1px] h-6 bg-white/10 mx-1" />
                               <button onClick={saveMask} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg">Save Edits</button>
                               <button onClick={() => setIsBrushMode(false)} className="p-2 text-muted-foreground hover:text-red-400"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="relative w-full h-full flex items-center justify-center cursor-crosshair">
                               <img src={batch[activeIndex]?.preview} className="max-w-full max-h-full object-contain opacity-30" alt="Source image for erasing" />
                               <canvas 
                                 ref={brushCanvasRef}
                                 onMouseDown={startDrawing}
                                 onMouseMove={draw}
                                 onMouseUp={stopDrawing}
                                 onMouseLeave={stopDrawing}
                                 onTouchStart={startDrawing}
                                 onTouchMove={draw}
                                 onTouchEnd={stopDrawing}
                                 className="absolute max-w-full max-h-full object-contain pointer-events-auto"
                               />
                            </div>
                         </div>
                      )}

                      {(batch[activeIndex]?.status === "idle" || batch[activeIndex]?.status === "processing") && batch[activeIndex]?.preview && (
                        <div className="relative group h-full w-full flex items-center justify-center" onClick={batch[activeIndex]?.status === "idle" ? handleStart : undefined}>
                            <img 
                             src={batch[activeIndex]?.preview} 
                             className={cn(
                               "max-w-full max-h-full object-contain rounded-lg shadow-xl transition-all", 
                               batch[activeIndex]?.status === "idle" ? "group-hover:scale-[1.02] cursor-pointer" : "opacity-40 blur-[2px] grayscale-[0.5]"
                             )} 
                             alt="Original image for background removal"
                           />
                           
                           {batch[activeIndex]?.status === "idle" && (
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end justify-center pb-8 cursor-pointer rounded-lg group-hover:from-black/70 transition-all">
                                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-black gap-2 shadow-2xl hover:scale-105 transition-transform">
                                  <Sparkles className="w-4 h-4" /> Remove Background
                                </Button>
                             </div>
                           )}
                           
                           {batch[activeIndex]?.status === "processing" && (
                             <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-lg">
                                <div className="relative">
                                   <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin shadow-[0_0_30px_rgba(34,197,94,0.3)]" />
                                   <Sparkles className="w-8 h-8 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <div className="w-48 space-y-3 glass-card p-4 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md">
                                   <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 text-center animate-pulse">
                                     {progressLabel || "Processing..."}
                                   </p>
                                   <Progress value={batch[activeIndex]?.progress} className="h-1 bg-white/10 [&>div]:bg-emerald-500" />
                                </div>
                             </div>
                           )}
                        </div>
                      )}

                      {batch[activeIndex]?.status === "done" && batch[activeIndex]?.resultPreview && (
                        <div className="w-full h-full flex items-center justify-center relative overflow-hidden group">
                           {/* Labels */}
                           <div className="absolute top-4 left-4 z-10 glass-card bg-black/50 px-3 py-1 rounded-full text-[10px] font-black uppercase text-white/80 tracking-widest border border-white/10 pointer-events-none transition-opacity duration-300" style={{ opacity: sliderPos > 20 ? 1 : 0 }}>Before</div>
                           <div className="absolute top-4 right-4 z-10 glass-card bg-emerald-500/50 px-3 py-1 rounded-full text-[10px] font-black uppercase text-white tracking-widest border border-emerald-500/20 pointer-events-none transition-opacity duration-300" style={{ opacity: sliderPos < 80 ? 1 : 0 }}>After</div>

                           {/* Bottom Layer: Processed Image */}
                           <img 
                             src={batch[activeIndex]?.resultPreview!} 
                             className={cn("absolute max-w-full max-h-full object-contain pointer-events-none select-none", hasShadow && "drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]")} 
                             alt="Processed image with background removed"
                           />
                           
                           {/* Top Layer: Original Image (Clipped) */}
                           <img 
                             src={batch[activeIndex]?.preview!} 
                             className="absolute max-w-full max-h-full object-contain pointer-events-none select-none" 
                             style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                             alt="Original image for comparison"
                           />
                           
                           {/* Slider Visual Handle */}
                           <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-ew-resize z-20 pointer-events-none" style={{ left: `calc(${sliderPos}% - 2px)` }}>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                 <div className="flex gap-0.5">
                                   <div className="w-0.5 h-3 bg-emerald-500/40 rounded-full" />
                                   <div className="w-0.5 h-3 bg-emerald-500/40 rounded-full" />
                                   <div className="w-0.5 h-3 bg-emerald-500/40 rounded-full" />
                                 </div>
                              </div>
                           </div>

                           {/* Invisible Interaction Layer */}
                           <input 
                             type="range" 
                             min="0" 
                             max="100" 
                             value={sliderPos} 
                             onChange={(e) => setSliderPos(Number(e.target.value))} 
                             className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30 m-0 p-0" 
                           />
                        </div>
                      )}
                    </div>
                  </div>

                  <footer className="p-4 bg-black/30 border-t border-border flex flex-col md:flex-row items-center justify-between shrink-0 gap-4">
                    <ToolHealth status={batch[activeIndex]?.status} className="bg-transparent border-none p-0 shadow-none" />
                    <div className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest flex items-center gap-4">
                       <span>{processTime ? `${processTime}ms` : "---"} latency</span>
                       <span className="opacity-40">|</span>
                       <span>AI Node: isnet_quint8</span>
                    </div>
                  </footer>
                </section>

                {/* Right Sidebar - Controls Area */}
                <aside className="w-full lg:w-[360px] flex flex-col shrink-0 bg-black/10 relative z-10">
                   <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 flex items-center gap-3">
                        <Settings2 className="w-4 h-4" /> Creative Matrix
                      </h3>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">AI Node: isnet_quint8</p>
                    </div>
                  </div>

                  <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    
                    {/* Background Presets */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                        Scene Background <span>Preserve Alpha</span>
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        {bgPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => { setBgColor(preset.value); setCustomBgPreview(null); }}
                            className={cn(
                              "aspect-square rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden",
                              bgColor === preset.value && !customBgPreview ? "border-emerald-500 scale-105 shadow-lg shadow-emerald-500/20" : "border-transparent hover:border-border"
                            )}
                            title={preset.name}
                          >
                            {preset.value === "transparent" ? (
                              <div className="w-full h-full bg-[#1e293b] relative opacity-50 flex items-center justify-center" style={{ backgroundImage: "linear-gradient(45deg, #0f172a 25%, transparent 25%), linear-gradient(-45deg, #0f172a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0f172a 75%), linear-gradient(-45deg, transparent 75%, #0f172a 75%)", backgroundSize: "10px 10px", backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px" }}>
                                <div className="w-full h-[1px] bg-red-500 rotate-45" />
                              </div>
                            ) : (
                              <div className="w-full h-full" style={{ backgroundColor: preset.value }} />
                            )}
                          </button>
                        ))}
                        <div className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-emerald-500 transition-all flex items-center justify-center relative overflow-hidden group">
                           <input 
                             type="color" 
                             value={bgColor === "transparent" || customBgPreview ? "#ffffff" : bgColor} 
                             onChange={(e) => { setBgColor(e.target.value); setCustomBgPreview(null); }} 
                             className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20" 
                           />
                           <div 
                             className="w-6 h-6 rounded-full border border-border pointer-events-none flex items-center justify-center shadow-inner" 
                             style={{ backgroundColor: (!customBgPreview && bgColor !== "transparent") ? bgColor : "#fff" }}
                           />
                        </div>
                        <div className={cn("aspect-square rounded-xl border-2 transition-all flex items-center justify-center relative overflow-hidden group", customBgPreview ? "border-emerald-500" : "border-dashed border-border hover:border-emerald-500")}>
                           <input 
                             type="file" 
                             accept="image/*" 
                             onChange={handleCustomBgUpload} 
                             className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20" 
                           />
                           {customBgPreview ? (
                             <img src={customBgPreview} className="w-full h-full object-cover pointer-events-none" alt="Custom background preview" />
                           ) : (
                             <ImageIcon className="w-5 h-5 text-muted-foreground pointer-events-none" />
                           )}
                        </div>
                      </div>
                    </div>

                    {/* Social Canvas */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Social Resizer</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: "original", label: "Auto" },
                          { id: "1:1", label: "1:1" },
                          { id: "4:5", label: "4:5" },
                          { id: "9:16", label: "9:16" },
                        ].map((r) => (
                          <button key={r.id} onClick={() => setAspectRatio(r.id as any)} className={cn("py-2 px-1 text-[9px] font-black rounded-lg border transition-all uppercase tracking-tighter", aspectRatio === r.id ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : "border-border/40 text-muted-foreground hover:border-border")}>
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Scene Effects & Tweaks */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scene Realism</p>
                      <button onClick={() => setHasShadow(!hasShadow)} className={cn("w-full py-3 px-4 rounded-xl border flex items-center justify-between transition-all", hasShadow ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10" : "border-border/40 text-muted-foreground hover:border-border")}>
                        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-4 h-4" /> Soft Drop Shadow</span>
                        <div className={cn("w-8 h-4 rounded-full relative transition-colors", hasShadow ? "bg-emerald-500" : "bg-black/40")}>
                           <div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all", hasShadow ? "left-4.5" : "left-0.5")} />
                        </div>
                      </button>
                      <button onClick={() => setAutoTrim(!autoTrim)} className={cn("w-full py-3 px-4 rounded-xl border flex items-center justify-between transition-all", autoTrim ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10" : "border-border/40 text-muted-foreground hover:border-border")}>
                        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Scissors className="w-4 h-4" /> Auto-Trim Edges</span>
                        <div className={cn("w-8 h-4 rounded-full relative transition-colors", autoTrim ? "bg-emerald-500" : "bg-black/40")}>
                           <div className={cn("absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all", autoTrim ? "left-4.5" : "left-0.5")} />
                        </div>
                      </button>
                    </div>

                    {/* Export Matrix */}
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Format Selection</p>
                      <div className="grid grid-cols-3 gap-2 p-1 bg-black/20 border border-border rounded-xl">
                        {(["image/png", "image/jpeg", "image/webp"] as const).map((fmt) => (
                          <button key={fmt} onClick={() => setExportFormat(fmt)} className={cn("py-2 text-[10px] font-black rounded-lg transition-all uppercase", exportFormat === fmt ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "text-muted-foreground hover:text-foreground")}>
                            {fmt.split("/")[1]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-border bg-black/20 space-y-3 shrink-0">
                    <Button 
                      className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm gap-3 shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all italic" 
                      disabled={batch[activeIndex]?.status !== "done"}
                      onClick={() => handleExport()}
                    >
                      <Download className="w-5 h-5" /> Export Fragment
                    </Button>
                    <button onClick={handleCopy} disabled={batch[activeIndex]?.status !== "done"} className="w-full h-10 rounded-xl bg-secondary/50 hover:bg-secondary border border-border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                      <Copy className="w-3.5 h-3.5" /> Copy Image
                    </button>
                  </div>
                </aside>
              </>
            )}
        </section>

        {/* EDUCATIONAL & SEO CONTENT */}
        <div className="container mx-auto px-4 max-w-5xl py-12 space-y-20">
          
          {/* Main Features Grid */}
          <section className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black tracking-tight text-foreground uppercase italic">Background Removal Features</h2>
              <p className="text-muted-foreground font-medium text-lg">Professional tools for zero-server image segmentation.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { title: "AI-Powered", icon: Sparkles },
                { title: "Local Processing", icon: Cpu },
                { title: "Alpha PNG Export", icon: FileDown },
                { title: "Drag & Drop", icon: Monitor },
                { title: "High-Res Support", icon: Maximize2 },
                { title: "Instant Preview", icon: Play },
                { title: "Batch Support", icon: Database },
                { title: "Offline Capable", icon: WifiOff },
                { title: "Edge Detection", icon: Search },
                { title: "Mobile Ready", icon: Smartphone }
              ].map((feat, i) => (
                <div key={i} className="p-5 rounded-2xl glass-card bg-secondary/30 border border-border flex flex-col items-center text-center gap-3 group hover:border-emerald-500/30 transition-all">
                  <feat.icon className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-tight text-foreground">{feat.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Core Education Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-foreground flex items-center gap-3 uppercase italic">
                <FileText className="text-emerald-500 w-8 h-8" /> What Is Background Removal?
              </h2>
              <p className="text-xl leading-relaxed text-muted-foreground font-medium">
                Background removal isolates subjects from images by separating foreground elements from the background for transparent or replacement-ready outputs. Our AI engine detects the "saliency" of the main subject and generates an alpha mask in real-time.
              </p>
            </div>
            <div className="p-8 rounded-[2rem] glass-card bg-emerald-500/5 border border-emerald-500/20 space-y-6">
              <h3 className="text-xl font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                 <ShieldCheck className="w-6 h-6" /> Privacy Advantage
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                Most online tools upload your private photos to their servers. SafeTools processes everything locally. Your images never leave your computer.
              </p>
              <div className="flex gap-2">
                 {["Zero Upload", "100% Private", "No Account"].map(t => (
                    <Badge key={t} variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 uppercase font-black text-[10px]">{t}</Badge>
                 ))}
              </div>
            </div>
          </section>

          {/* AI Processing Details */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-foreground uppercase tracking-widest italic">AI-Powered Background Detection</h2>
              <p className="text-muted-foreground font-medium">Neural subject segmentation directly in your browser.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Edge Precision", desc: "Fine-tuned masks for hair, fur, and complex boundaries.", icon: Search },
                { title: "Object Isolation", desc: "Automatic identification of people, products, and animals.", icon: Layers },
                { title: "Fast Inference", desc: "Optimized ONNX models running on your local CPU/GPU.", icon: Zap }
              ].map((card, i) => (
                <div key={i} className="p-8 rounded-3xl glass-card bg-secondary/30 border border-border space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black uppercase text-foreground">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Supported Formats */}
          <section className="p-12 rounded-[3rem] glass-card bg-secondary/30 border border-border relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <ImageIcon className="w-64 h-64" />
             </div>
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">Supported Image Formats</h2>
                   <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                      SafeTools supports all modern raster formats for background removal. High-resolution input is processed efficiently using local hardware acceleration.
                   </p>
                   <div className="flex flex-wrap gap-4">
                      {["PNG", "JPG / JPEG", "WEBP", "BMP"].map(f => (
                         <div key={f} className="px-4 py-2 rounded-xl bg-black/40 border border-border font-black text-sm uppercase text-foreground">{f}</div>
                      ))}
                   </div>
                </div>
                <div className="space-y-6 bg-black/20 p-8 rounded-2xl border border-border">
                   <h3 className="text-xl font-black uppercase tracking-widest text-emerald-500">Export Options</h3>
                   <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-sm font-bold text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Transparent Alpha PNG</li>
                      <li className="flex items-center gap-3 text-sm font-bold text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Optimized WEBP with Alpha</li>
                      <li className="flex items-center gap-3 text-sm font-bold text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> JPG with Custom BG Colors</li>
                   </ul>
                </div>
             </div>
          </section>

          {/* How it Works */}
          <section className="space-y-12">
             <h2 className="text-3xl font-black text-center text-foreground uppercase italic">How Background Removal Works</h2>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { step: "01", title: "Upload locally", desc: "Drop your image into the secure studio." },
                  { step: "02", title: "Detect subject", desc: "AI automatically isolates the foreground." },
                  { step: "03", title: "Remove background", desc: "Background is stripped in memory." },
                  { step: "04", title: "Download", desc: "Export your transparent PNG instantly." }
                ].map((s, i) => (
                  <div key={i} className="relative p-8 rounded-3xl glass-card bg-secondary/30 border border-border space-y-4">
                    <span className="text-4xl font-black text-emerald-500/20 absolute top-4 right-6">{s.step}</span>
                    <h3 className="text-lg font-black uppercase text-foreground relative z-10">{s.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium relative z-10">{s.desc}</p>
                  </div>
                ))}
             </div>
             <p className="text-center text-emerald-500 font-black text-sm uppercase tracking-widest italic animate-pulse">
                Image processing happens entirely inside your browser.
             </p>
          </section>

          {/* Use Cases */}
          <section className="space-y-8">
             <h2 className="text-2xl font-black text-foreground uppercase tracking-widest text-center italic">Common Use Cases</h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Product photography", "E-commerce listings", "Social media content", "Profile photos",
                  "Graphic design", "Marketing materials", "Passport photos", "Content creation"
                ].map(use => (
                  <div key={use} className="p-4 rounded-xl border border-border bg-secondary/20 text-center font-bold text-xs uppercase tracking-tight text-muted-foreground hover:text-foreground hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all cursor-default">
                    {use}
                  </div>
                ))}
             </div>
          </section>

          {/* Comparison Table */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-center text-foreground uppercase italic tracking-widest">SafeTools vs Cloud Tools</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse glass-card bg-secondary/30 rounded-[2rem] overflow-hidden border border-border shadow-sm">
                <thead>
                  <tr className="bg-black/30">
                    <th className="p-5 font-black uppercase tracking-widest text-[10px] border-b border-border text-foreground">Feature</th>
                    <th className="p-5 font-black uppercase tracking-widest text-[10px] border-b border-border text-muted-foreground text-center">Traditional AI Tools</th>
                    <th className="p-5 font-black uppercase tracking-widest text-[10px] border-b border-border text-emerald-500 bg-emerald-500/5 text-center">SafeTools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm font-medium">
                  <tr>
                    <td className="p-5 text-foreground font-black text-xs uppercase tracking-wider">Upload Required</td>
                    <td className="p-5 text-muted-foreground text-center">Usually</td>
                    <td className="p-5 text-emerald-500 bg-emerald-500/5 font-black text-center italic">NO</td>
                  </tr>
                  <tr>
                    <td className="p-5 text-foreground font-black text-xs uppercase tracking-wider">Local Processing</td>
                    <td className="p-5 text-muted-foreground text-center">Rare</td>
                    <td className="p-5 text-emerald-500 bg-emerald-500/5 font-black text-center italic">YES</td>
                  </tr>
                  <tr>
                    <td className="p-5 text-foreground font-black text-xs uppercase tracking-wider">Tracking Scripts</td>
                    <td className="p-5 text-muted-foreground text-center">Often</td>
                    <td className="p-5 text-emerald-500 bg-emerald-500/5 font-black text-center italic">NO</td>
                  </tr>
                  <tr>
                    <td className="p-5 text-foreground font-black text-xs uppercase tracking-wider">Browser-Based AI</td>
                    <td className="p-5 text-muted-foreground text-center">Partial</td>
                    <td className="p-5 text-emerald-500 bg-emerald-500/5 font-black text-center italic">FULL</td>
                  </tr>
                  <tr>
                    <td className="p-5 text-foreground font-black text-xs uppercase tracking-wider">Privacy Focused</td>
                    <td className="p-5 text-muted-foreground text-center">Limited</td>
                    <td className="p-5 text-emerald-500 bg-emerald-500/5 font-black text-center italic">YES</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Pro Tips Section */}
          <section className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black tracking-tight text-foreground uppercase italic">Pro Tips for Perfect Results</h2>
              <p className="text-muted-foreground font-medium text-lg">Maximize the precision of our browser-based AI engine.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { 
                  title: "Contrast is Key", 
                  desc: "Ensure the subject has a distinct color difference from the background for the sharpest edge detection.",
                  icon: Zap
                },
                { 
                  title: "Avoid Motion Blur", 
                  desc: "Crisp, clear photos allow the neural network to identify fine details like hair and fabric textures.",
                  icon: Maximize2
                },
                { 
                  title: "Good Lighting", 
                  desc: "Well-lit subjects help the AI distinguish between foreground shadows and background elements.",
                  icon: Sparkles
                },
                { 
                  title: "Centered Subjects", 
                  desc: "While the AI is powerful, keeping the main subject central helps the saliency detection algorithm.",
                  icon: Search
                }
              ].map((tip, i) => (
                <div key={i} className="p-6 rounded-2xl border border-border bg-secondary/10 flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <tip.icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-black uppercase text-sm text-foreground">{tip.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Specifications Section */}
          <section className="p-12 rounded-[3rem] glass-card bg-black/40 border border-border">
            <div className="max-w-3xl mx-auto space-y-10">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">Technical Specifications</h2>
                <p className="text-muted-foreground font-medium">Under the hood of the SafeTools AI Studio.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-black uppercase text-emerald-500 flex items-center gap-2">
                    <Cpu className="w-5 h-5" /> Neural Engine
                  </h3>
                  <ul className="space-y-2 text-sm font-medium text-muted-foreground">
                    <li className="flex justify-between border-b border-border/40 pb-2"><span>Model</span> <span className="text-foreground">RMBG-1.4 (Isnet)</span></li>
                    <li className="flex justify-between border-b border-border/40 pb-2"><span>Inference</span> <span className="text-foreground">ONNX Runtime WASM</span></li>
                    <li className="flex justify-between border-b border-border/40 pb-2"><span>Quantization</span> <span className="text-foreground">Int8 Optimized</span></li>
                    <li className="flex justify-between pb-2"><span>Model Size</span> <span className="text-foreground">17.6 MB</span></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-black uppercase text-emerald-500 flex items-center gap-2">
                    <Monitor className="w-5 h-5" /> Browser Requirements
                  </h3>
                  <ul className="space-y-2 text-sm font-medium text-muted-foreground">
                    <li className="flex justify-between border-b border-border/40 pb-2"><span>Memory</span> <span className="text-foreground">4GB+ Recommended</span></li>
                    <li className="flex justify-between border-b border-border/40 pb-2"><span>Engine</span> <span className="text-foreground">Chromium / WebKit / Gecko</span></li>
                    <li className="flex justify-between border-b border-border/40 pb-2"><span>Hardware Accel.</span> <span className="text-foreground">WebGL / WebGPU</span></li>
                    <li className="flex justify-between pb-2"><span>Privacy Grade</span> <span className="text-foreground">Local Isolated Context</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <FAQ 
            items={[
              { question: "Are images uploaded to servers?", answer: "No. Background removal happens locally inside your browser." },
              { question: "Can I export transparent PNG files?", answer: "Yes. Transparent PNG export is fully supported." },
              { question: "Does this tool work offline?", answer: "Yes. Offline support can be enabled through PWA functionality once the AI model is cached." },
              { question: "Can SafeTools access my images?", answer: "No. Images remain locally processed and are never stored or transmitted." },
              { question: "Does AI background removal support high-resolution images?", answer: "Yes. Performance depends on your device's memory and browser capabilities." }
            ]}
          />

          <WhySafeTools />
          
          <LocalProcessingGuide />

          {/* Related Tools */}
          <RelatedTools 
            tools={[
              { name: "Image Compressor", href: "/image/compress" },
              { name: "Image Converter", href: "/image/convert" },
              { name: "Ultimate Editor", href: "/image/editor" },
              { name: "Image to PPTX", href: "/image/to-pptx" },
              { name: "App Icon Studio", href: "/image/icons" },
              { name: "QR Generator", href: "/tools/qr-generator" },
              { name: "Metadata Cleaner", href: "/security/metadata-cleaner" }
            ]}
          />

          {/* Privacy Manifesto */}
          <section className="text-center max-w-2xl mx-auto space-y-6 pb-12">
            <Fingerprint className="w-12 h-12 mx-auto text-emerald-500 opacity-50" />
            <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground italic">Privacy-First Creative Tools</h3>
            <p className="text-lg font-medium text-muted-foreground leading-relaxed italic">
              "SafeTools develops browser-based creative tools designed for privacy, speed, and secure local image processing. Fast, privacy-first image tools designed for secure browser-based creative workflows."
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
