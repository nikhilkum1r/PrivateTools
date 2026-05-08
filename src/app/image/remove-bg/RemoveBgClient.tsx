"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ShieldCheck, Trash2,
  CheckCircle2, AlertCircle, RefreshCcw, ImageIcon,
  Download, Copy, Maximize2, Layers,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { FAQ } from "@/components/shared/FAQ";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { REMOVE_BG_FAQ } from "@/lib/faq-content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
type Status = "idle" | "processing" | "done" | "error";

// ── Helper: file → base64 DataURL ─────────────────────────────────────────────
function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function RemoveBgClient() {
  const [file, setFile]                   = useState<File | null>(null);
  const [imagePreview, setImagePreview]   = useState<string | null>(null);
  const [status, setStatus]               = useState<Status>("idle");
  const [progress, setProgress]           = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [result, setResult]               = useState<Blob | null>(null);
  const [resultPreview, setResultPreview] = useState<string | null>(null);
  const [bgColor, setBgColor]             = useState("transparent");
  const [customBgPreview, setCustomBgPreview] = useState<string | null>(null);
  const [exportFormat, setExportFormat]   = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");
  const [showOriginal, setShowOriginal]   = useState(false);
  const [processTime, setProcessTime]     = useState<number | null>(null);
  const [startTime, setStartTime]         = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [aspectRatio, setAspectRatio]     = useState<"original" | "1:1" | "4:5" | "9:16">("original");
  const [hasShadow, setHasShadow]         = useState(false);

  const workerRef = useRef<Worker | null>(null);

  const bgPresets = [
    { name: "Transparent", value: "transparent" },
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Studio Blue", value: "#3b82f6" },
    { name: "Soft Gray", value: "#f3f4f6" },
    { name: "Corporate", value: "#1e293b" },
  ];

  // ── Worker lifecycle (mount once) ─────────────────────────────────────────────
  useEffect(() => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;

    worker.addEventListener("message", (event: MessageEvent) => {
      const { type, pct, key, buffer, mimeType, error } = event.data;

      switch (type) {
        case "status": {
          setProgressLabel(event.data.message ?? "Processing…");
          break;
        }
        case "progress": {
          const label = key?.includes("fetch") ? "Downloading model…" : "Removing background…";
          setProgressLabel(label);
          setProgress(pct ?? 0);
          break;
        }
        case "result": {
          const blob = new Blob([buffer], { type: mimeType ?? "image/png" });
          const url  = URL.createObjectURL(blob);
          setResult(blob);
          setResultPreview(url);
          setStatus("done");
          setProgress(100);
          if (startTimeRef.current) setProcessTime(Date.now() - startTimeRef.current);
          toast.success("Background removed successfully!");
          break;
        }
        case "error": {
          console.error("[RemoveBg Worker]:", error);
          toast.error("AI Error: " + (error ?? "Unknown error"));
          setStatus("error");
          break;
        }
      }
    });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // ── Final Export with Background, Format, Ratio & Shadow ──────────────────────
  const getExportBlob = async (): Promise<Blob> => {
    if (!resultPreview || !result) return result!;
    
    // If it's a transparent PNG/WEBP, no custom changes, no ratio, no shadow -> return original result
    if (bgColor === "transparent" && !customBgPreview && exportFormat !== "image/jpeg" && aspectRatio === "original" && !hasShadow) return result;

    const img = await new Promise<HTMLImageElement>((resolve) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.src = resultPreview;
    });

    const canvas = document.createElement("canvas");
    let targetWidth = img.width;
    let targetHeight = img.height;

    // Handle Aspect Ratios
    if (aspectRatio !== "original") {
      const [rw, rh] = aspectRatio.split(":").map(Number);
      const targetRatio = rw / rh;
      const currentRatio = img.width / img.height;

      if (currentRatio > targetRatio) {
        // Image is wider than target ratio -> add height (pad top/bottom)
        targetHeight = img.width / targetRatio;
      } else {
        // Image is taller than target ratio -> add width (pad sides)
        targetWidth = img.height * targetRatio;
      }
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d")!;

    // JPEG doesn't support transparency - force white background if transparent
    const effectiveBgColor = (exportFormat === "image/jpeg" && bgColor === "transparent" && !customBgPreview) 
      ? "#ffffff" 
      : bgColor;

    // 1. Draw Background
    if (customBgPreview) {
      const bgImg = await new Promise<HTMLImageElement>((resolve) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.src = customBgPreview;
      });

      const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
      const x = (canvas.width - bgImg.width * scale) / 2;
      const y = (canvas.height - bgImg.height * scale) / 2;
      ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
    } else if (effectiveBgColor !== "transparent") {
      ctx.fillStyle = effectiveBgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Draw Shadow (if enabled)
    const imgX = (canvas.width - img.width) / 2;
    const imgY = (canvas.height - img.height) / 2;

    if (hasShadow) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = Math.max(canvas.width, canvas.height) * 0.02; // Scaled shadow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = ctx.shadowBlur / 2;
    }

    // 3. Draw the subject on top
    ctx.drawImage(img, imgX, imgY);

    return new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b!), exportFormat, 0.95);
    });
  };

  const handleExport = async () => {
    const finalBlob = await getExportBlob();
    const url = URL.createObjectURL(finalBlob);
    const a = document.createElement("a");
    const ext = exportFormat === "image/jpeg" ? "jpg" : (exportFormat === "image/webp" ? "webp" : "png");
    
    a.href = url;
    a.download = file?.name.replace(/\.[^/.]+$/, "") + `_studio.${ext}`;
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

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    
    // Explicitly reject SVGs as the AI model only supports raster images
    if (f.type === "image/svg+xml") {
      toast.error("SVG files are not supported. Please use PNG, JPG, or WEBP.");
      return;
    }

    if (!f.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (resultPreview) URL.revokeObjectURL(resultPreview);
    if (customBgPreview) URL.revokeObjectURL(customBgPreview);

    const preview = URL.createObjectURL(f);
    setFile(f);
    setImagePreview(preview);
    setStatus("idle");
    setResult(null);
    setResultPreview(null);
    setProgress(0);
    setProgressLabel("");
    setBgColor("transparent");
    setCustomBgPreview(null);
  }, [imagePreview, resultPreview, customBgPreview]);

  const handleCopy = async () => {
    try {
      const blob = await getExportBlob();
      const pngBlob = exportFormat === "image/png" ? blob : await (async () => {
        const canvas = document.createElement("canvas");
        const img = await new Promise<HTMLImageElement>((res) => {
          const el = new Image();
          el.onload = () => res(el);
          el.src = URL.createObjectURL(blob);
        });
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d")?.drawImage(img, 0, 0);
        const b = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
        URL.revokeObjectURL(img.src);
        return b;
      })();

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngBlob })
      ]);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Copy failed: Most browsers only support copying PNGs.");
    }
  };

  const handleStart = useCallback(async () => {
    if (!file) return;
    if (file.type === "image/svg+xml") {
      toast.error("SVGs are not supported.");
      return;
    }
    setStatus("processing");
    setProgress(0);
    setProgressLabel("Reading image…");
    setStartTime(Date.now());
    startTimeRef.current = Date.now();
    setProcessTime(null);

    try {
      const dataURL = await fileToDataURL(file);
      workerRef.current?.postMessage({ type: "process", imageDataURL: dataURL });
    } catch (err: any) {
      toast.error("Failed to read image: " + err.message);
      setStatus("error");
    }
  }, [file]);

  const handleReset = useCallback(() => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (resultPreview) URL.revokeObjectURL(resultPreview);
    if (customBgPreview) URL.revokeObjectURL(customBgPreview);
    setFile(null);
    setImagePreview(null);
    setResult(null);
    setResultPreview(null);
    setStatus("idle");
    setProgress(0);
    setProgressLabel("");
    setBgColor("transparent");
    setCustomBgPreview(null);
  }, [imagePreview, resultPreview, customBgPreview]);

  const isWorking = status === "processing";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/6 blur-[160px] rounded-full" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-600/6 blur-[160px] rounded-full" />
      </div>

      <main className="flex-grow container mx-auto px-4 py-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-xl shadow-indigo-500/10 mx-auto">
              <Sparkles className="w-8 h-8 text-indigo-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              AI Background Remover
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base font-medium leading-relaxed">
              Professional-grade background removal powered by a state-of-the-art AI model —
              runs <strong>100% in your browser</strong>. Zero uploads. Zero privacy risk.
            </p>
            <div className="flex justify-center">
              <PrivacyBadge />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="max-w-2xl mx-auto w-full"
              >
                <DropZone
                  onFilesDrop={handleDrop}
                  accept="image/*"
                  multiple={false}
                  className="aspect-video"
                />
              </motion.div>
            ) : (
              <motion.div
                key="workspace"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Preview */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="relative group overflow-hidden border-border/60 bg-secondary/10">
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className="bg-background/80 backdrop-blur-md border border-border/60 text-[10px] text-foreground/80 px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest">
                            Original
                          </Badge>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8"
                          onClick={handleReset}
                          disabled={isWorking}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                        <div className="aspect-square flex items-center justify-center p-4">
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Original"
                              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                            />
                          )}
                        </div>
                      </Card>

                      <Card
                        className={cn(
                          "relative overflow-hidden border-border/60 min-h-[320px] flex flex-col transition-all duration-500",
                          status === "done" && "border-emerald-500/30 shadow-2xl shadow-emerald-500/5"
                        )}
                      >
                        {status === "idle" && (
                          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-indigo-500/10 border-2 border-dashed border-indigo-500/30 flex items-center justify-center animate-pulse">
                              <Sparkles className="w-9 h-9 text-indigo-500/60" />
                            </div>
                            <div className="space-y-1.5">
                              <h3 className="font-bold text-lg">Ready for magic?</h3>
                              <Button
                                size="lg"
                                onClick={handleStart}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-12 px-8 rounded-xl shadow-xl shadow-indigo-500/20"
                              >
                                Remove Background
                              </Button>
                            </div>
                          </div>
                        )}

                        {isWorking && (
                          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center gap-8 relative overflow-hidden">
                            {/* Magic Sparkle Overlay */}
                            <div className="absolute inset-0 pointer-events-none z-10">
                              {[...Array(6)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ 
                                    opacity: [0, 1, 0], 
                                    scale: [0.5, 1.2, 0.5],
                                    x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                                    y: [Math.random() * 200 - 100, Math.random() * 200 - 100]
                                  }}
                                  transition={{ 
                                    duration: 2 + Math.random() * 2, 
                                    repeat: Infinity, 
                                    delay: i * 0.4 
                                  }}
                                  className="absolute"
                                  style={{
                                    left: `${20 + Math.random() * 60}%`,
                                    top: `${20 + Math.random() * 60}%`,
                                  }}
                                >
                                  <Sparkles className="w-6 h-6 text-indigo-400 blur-[1px]" />
                                </motion.div>
                              ))}
                            </div>

                            <div className="relative z-20">
                              <div className="w-24 h-24 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
                              <Sparkles className="w-8 h-8 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                            </div>
                            
                            <div className="w-full max-w-xs space-y-3 z-20">
                              <p className="font-black uppercase tracking-widest text-xs text-indigo-400 animate-pulse">{progressLabel || "Processing…"}</p>
                              <Progress value={progress} className="h-1.5 bg-indigo-500/10" />
                              <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Neural Engine Active</p>
                            </div>

                            {imagePreview && (
                              <img 
                                src={imagePreview} 
                                alt="Processing" 
                                className="absolute inset-0 w-full h-full object-contain opacity-20 grayscale blur-sm pointer-events-none"
                              />
                            )}
                          </div>
                        )}

                        {status === "done" && resultPreview && (
                          <div className="flex-grow flex flex-col relative">
                            <div className="absolute top-3 left-3 z-10 flex gap-2">
                              <Badge className="bg-emerald-500 text-white border-none shadow-lg text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Result
                              </Badge>
                              <button
                                onMouseDown={() => setShowOriginal(true)}
                                onMouseUp={() => setShowOriginal(false)}
                                onMouseLeave={() => setShowOriginal(false)}
                                onTouchStart={() => setShowOriginal(true)}
                                onTouchEnd={() => setShowOriginal(false)}
                                className="bg-background/80 backdrop-blur-md border border-border/60 text-[10px] text-foreground/80 px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest flex items-center gap-1 hover:bg-background transition-colors cursor-pointer select-none"
                              >
                                <Layers className="w-3 h-3" />
                                Hold to Compare
                              </button>
                            </div>

                            <div className="absolute top-3 right-3 z-10 flex gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopy}
                                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-md border-border/60 hover:bg-background shadow-lg"
                                title="Copy to Clipboard"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </Button>
                            </div>

                            <div
                              className="flex-grow flex items-center justify-center p-4 transition-all duration-500 overflow-hidden relative"
                              style={{
                                backgroundColor: customBgPreview ? "transparent" : (bgColor === "transparent" ? undefined : bgColor),
                                backgroundImage: customBgPreview 
                                  ? `url(${customBgPreview})`
                                  : (bgColor === "transparent" 
                                    ? "linear-gradient(45deg, #2a2a2a 25%, transparent 25%), linear-gradient(-45deg, #2a2a2a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2a2a2a 75%), linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)"
                                    : "none"),
                                backgroundSize: customBgPreview ? "cover" : "20px 20px",
                                backgroundPosition: customBgPreview ? "center" : "0 0, 0 10px, 10px -10px, -10px 0px",
                                aspectRatio: aspectRatio === "original" ? undefined : aspectRatio.replace(":", "/"),
                              }}
                            >
                              <AnimatePresence mode="wait">
                                {showOriginal ? (
                                  <motion.img
                                    key="original-overlay"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    src={imagePreview!}
                                    alt="Original"
                                    className="max-w-full max-h-full object-contain"
                                  />
                                ) : (
                                  <motion.img
                                    key={resultPreview + bgColor + customBgPreview + hasShadow}
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    src={resultPreview}
                                    alt="Result"
                                    className={cn(
                                      "max-w-full max-h-full object-contain",
                                      hasShadow ? "drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]" : "drop-shadow-2xl"
                                    )}
                                  />
                                )}
                              </AnimatePresence>
                              
                              {/* Premium Scan Line (Reading Line) */}
                              {status === "done" && !showOriginal && (
                                <motion.div 
                                  initial={{ top: "0%", opacity: 0 }}
                                  animate={{ 
                                    top: ["0%", "100%", "0%"],
                                    opacity: [0, 1, 1, 0]
                                  }}
                                  transition={{ 
                                    duration: 4, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                  }}
                                  className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)] z-20 pointer-events-none"
                                />
                              )}
                            </div>

                            {/* Telemetry Footer */}
                            {processTime && (
                              <div className="px-4 py-2 bg-secondary/20 border-t border-border/40 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                <div className="flex gap-4">
                                  <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> {processTime}ms</span>
                                  <span className="flex items-center gap-1.5"><Maximize2 className="w-3 h-3" /> {file?.name.split('.').pop()?.toUpperCase()}</span>
                                </div>
                                <div className="flex gap-1.5 items-center">
                                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> LOCAL SECURE
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {status === "error" && (
                          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center gap-5">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                            <Button variant="outline" size="sm" onClick={handleStart}>Retry</Button>
                          </div>
                        )}
                      </Card>
                    </div>
                  </div>

                  {/* Right Column: Controls */}
                  <div className="lg:col-span-4 space-y-6">
                    <Card className="p-6 border-border/60 bg-secondary/10 space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 flex items-center gap-3">
                          <Sparkles className="w-4 h-4 text-primary" /> Studio Matrix
                        </h3>
                        
                        <div className="space-y-4">
                          <p className="text-xs font-black uppercase tracking-widest text-foreground/80">Background Matrix</p>
                          <div className="grid grid-cols-4 gap-3">
                            {bgPresets.map((preset) => (
                              <button
                                key={preset.name}
                                onClick={() => {
                                  setBgColor(preset.value);
                                  setCustomBgPreview(null);
                                }}
                                className={cn(
                                  "aspect-square rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden",
                                  bgColor === preset.value && !customBgPreview ? "border-primary scale-105 shadow-lg" : "border-transparent hover:border-border"
                                )}
                                title={preset.name}
                              >
                                {preset.value === "transparent" ? (
                                  <div 
                                    className="w-full h-full opacity-50 flex items-center justify-center relative"
                                    style={{
                                      backgroundImage: "linear-gradient(45deg, #2a2a2a 25%, transparent 25%), linear-gradient(-45deg, #2a2a2a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2a2a2a 75%), linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)",
                                      backgroundSize: "10px 10px",
                                      backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px"
                                    }}
                                  >
                                    <div className="w-full h-[2px] bg-red-500/80 rotate-45 absolute shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                  </div>
                                ) : (
                                  <div className="w-full h-full" style={{ backgroundColor: preset.value }} />
                                )}
                              </button>
                            ))}
                            
                            {/* Custom Color */}
                            <div className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary transition-all flex items-center justify-center relative group overflow-hidden">
                              <input 
                                type="color" 
                                value={bgColor === "transparent" || customBgPreview ? "#ffffff" : bgColor} 
                                onChange={(e) => {
                                  setBgColor(e.target.value);
                                  setCustomBgPreview(null);
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                              <div className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: (!customBgPreview && bgColor !== "transparent") ? bgColor : "#fff" }} />
                            </div>

                            {/* Custom Image Upload */}
                            <div className={cn(
                              "aspect-square rounded-xl border-2 transition-all flex items-center justify-center relative group overflow-hidden",
                              customBgPreview ? "border-primary scale-105 shadow-lg" : "border-dashed border-border hover:border-primary"
                            )}>
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleCustomBgUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              />
                              {customBgPreview ? (
                                <img src={customBgPreview} alt="Custom BG" className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ratio Matrix */}
                      <div className="space-y-4 pt-4 border-t border-border/40">
                        <p className="text-xs font-black uppercase tracking-widest text-foreground/80">Social Canvas</p>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { id: "original", label: "Auto" },
                            { id: "1:1", label: "Square" },
                            { id: "4:5", label: "Portrait" },
                            { id: "9:16", label: "Story" },
                          ].map((r) => (
                            <button
                              key={r.id}
                              onClick={() => setAspectRatio(r.id as any)}
                              className={cn(
                                "py-2 px-1 text-[9px] font-black rounded-lg border transition-all",
                                aspectRatio === r.id 
                                  ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/5" 
                                  : "border-border/40 text-muted-foreground hover:border-border"
                              )}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Effects Matrix */}
                      <div className="space-y-4 pt-4 border-t border-border/40">
                        <p className="text-xs font-black uppercase tracking-widest text-foreground/80">Scene Realism</p>
                        <button
                          onClick={() => setHasShadow(!hasShadow)}
                          className={cn(
                            "w-full py-3 px-4 rounded-xl border flex items-center justify-between transition-all group",
                            hasShadow 
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/5" 
                              : "border-border/40 text-muted-foreground hover:border-border"
                          )}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className={cn("w-4 h-4", hasShadow ? "text-emerald-500" : "text-muted-foreground")} /> 
                            Drop Shadow
                          </span>
                          <div className={cn(
                            "w-10 h-5 rounded-full relative transition-colors duration-300",
                            hasShadow ? "bg-emerald-500" : "bg-secondary"
                          )}>
                            <div className={cn(
                              "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
                              hasShadow ? "left-6" : "left-1"
                            )} />
                          </div>
                        </button>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-border/40">
                        <p className="text-xs font-black uppercase tracking-widest text-foreground/80">Export Format</p>
                        <div className="flex gap-2 p-1 bg-background/50 rounded-xl border border-border/40">
                          {[
                            { id: "image/png", label: "PNG" },
                            { id: "image/jpeg", label: "JPG" },
                            { id: "image/webp", label: "WEBP" },
                          ].map((fmt) => (
                            <button
                              key={fmt.id}
                              onClick={() => setExportFormat(fmt.id as any)}
                              className={cn(
                                "flex-1 py-2 text-[10px] font-black rounded-lg transition-all",
                                exportFormat === fmt.id 
                                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                                  : "text-muted-foreground hover:bg-secondary/50"
                              )}
                            >
                              {fmt.label}
                            </button>
                          ))}
                        </div>
                        {exportFormat === "image/jpeg" && bgColor === "transparent" && !customBgPreview && (
                          <p className="text-[9px] text-amber-500 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> JPG defaults to White BG
                          </p>
                        )}
                      </div>

                      <div className="space-y-4 pt-4 border-t border-border/40">
                        <Button 
                          className="w-full h-12 bg-primary hover:bg-primary/90 text-foreground font-black text-lg gap-3 shadow-xl shadow-primary/20 italic"
                          disabled={status !== "done"}
                          onClick={handleExport}
                        >
                          <Download className="w-5 h-5" /> EXPORT FINAL
                        </Button>
                        <p className="text-[9px] text-center text-muted-foreground/40 font-black uppercase tracking-[0.2em]">
                          {customBgPreview ? "Custom Scene Composition" : (bgColor === "transparent" ? "Transparency Preserved" : `Matrix Applied: ${bgColor}`)}
                        </p>
                      </div>
                    </Card>

                    <Card className="p-6 border-border/60 bg-secondary/5 space-y-4">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Local-First Guard</h4>
                      </div>
                      <p className="text-[10px] text-muted-foreground/60 leading-relaxed font-medium">
                        Model: isnet_quint8 (17MB)<br/>
                        Env: Secure Browser Context<br/>
                        Status: Active
                      </p>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Feature cards ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
            {[
              {
                icon: ShieldCheck,
                title: "Pure Privacy",
                desc: "Your photos never leave your device. The AI model runs directly in your browser memory.",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10 border-emerald-500/20",
              },
              {
                icon: Sparkles,
                title: "ONNX AI Engine",
                desc: "State-of-the-art image segmentation model delivering studio-grade edge precision on any device.",
                color: "text-indigo-400",
                bg: "bg-indigo-500/10 border-indigo-500/20",
              },
              {
                icon: ImageIcon,
                title: "Crystal Edges",
                desc: "Full-resolution alpha-channel PNG output. Preserves fine hair, fur, and translucent details.",
                color: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/20",
              },
            ].map((card, i) => (
              <Card
                key={i}
                className="p-6 bg-secondary/10 border-border/50 flex flex-col items-center text-center gap-4 hover:border-border/80 transition-colors"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", card.bg)}>
                  <card.icon className={cn("w-6 h-6", card.color)} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold">{card.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </main>

      <SEOStructuredData
        name="AI Background Remover"
        description="Professional-grade AI background removal with custom colors and transparent PNG export."
        url="https://safetools.space/image/remove-bg"
        faqItems={REMOVE_BG_FAQ}
      />

      <FAQ items={REMOVE_BG_FAQ} title="Background Remover FAQ" />
      <Footer />
    </div>
  );
}
