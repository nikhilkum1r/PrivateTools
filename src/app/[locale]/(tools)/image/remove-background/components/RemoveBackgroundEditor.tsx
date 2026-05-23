"use client";

import React from "react";
import { 
  ImageIcon, 
  CheckCircle2, 
  Trash2, 
  Eraser, 
  Paintbrush, 
  X, 
  Sparkles, 
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ToolHealth } from "@/components/shared/ToolHealth";
import { cn } from "@/lib/utils";

interface ProcessedResult {
  file: File;
  preview: string;
  resultBlob: Blob | null;
  resultPreview: string | null;
  maskBlob: Blob | null;
  status: "idle" | "processing" | "done" | "error";
  progress: number;
}

interface RemoveBackgroundEditorProps {
  t: any;
  batch: ProcessedResult[];
  activeIndex: number;
  setActiveIndex: (idx: number) => void;
  onDrop: (files: File[]) => void;
  onStart: () => void;
  onReset: () => void;
  isBrushMode: boolean;
  setIsBrushMode: (val: boolean) => void;
  brushMode: "erase" | "restore";
  setBrushMode: (mode: "erase" | "restore") => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  brushCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  startDrawing: (e: any) => void;
  draw: (e: any) => void;
  stopDrawing: () => void;
  saveMask: () => void;
  sliderPos: number;
  setSliderPos: (pos: number) => void;
  hasShadow: boolean;
  bgColor: string;
  customBgPreview: string | null;
  aspectRatio: string;
  progressLabel: string;
  processTime: number | null;
  engine: "onnx" | "tfjs";
}

export function RemoveBackgroundEditor({
  t,
  batch,
  activeIndex,
  setActiveIndex,
  onDrop,
  onStart,
  onReset,
  isBrushMode,
  setIsBrushMode,
  brushMode,
  setBrushMode,
  brushSize,
  setBrushSize,
  brushCanvasRef,
  startDrawing,
  draw,
  stopDrawing,
  saveMask,
  sliderPos,
  setSliderPos,
  hasShadow,
  bgColor,
  customBgPreview,
  aspectRatio,
  progressLabel,
  processTime,
  engine
}: RemoveBackgroundEditorProps) {
  const activeItem = batch[activeIndex];

  return (
    <div className="flex-grow flex flex-col lg:flex-row overflow-hidden relative min-h-[600px]">
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
          <input type="file" accept="image/*" multiple onChange={(e) => onDrop(Array.from(e.target.files || []))} className="absolute inset-0 opacity-0 cursor-pointer" />
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
              <h2 className="font-black text-base md:text-lg tracking-tighter uppercase italic truncate text-foreground">{activeItem?.file.name}</h2>
              <div className="flex items-center gap-3 mt-0.5">
                <Badge className="text-[8px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                  {activeItem?.status === "done" ? t("status.segmented") : t("status.pending")}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeItem?.status === "done" && (
              <Button 
                variant="outline" 
                size="sm" 
                className={cn("h-9 rounded-lg gap-2 text-[10px] font-black uppercase tracking-widest transition-all", isBrushMode ? "bg-emerald-500 text-white border-emerald-500" : "glass-card hover:bg-emerald-500/10")}
                onClick={() => setIsBrushMode(!isBrushMode)}
              >
                <Eraser className="w-3.5 h-3.5" /> {isBrushMode ? t("tools.closeMagicEraser") : t("tools.magicEraser")}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all shrink-0" onClick={onReset}>
              <Trash2 className="w-4.5 h-4.5" />
            </Button>
          </div>
        </header>

        <div className="flex-grow relative flex items-center justify-center p-6 lg:p-10 overflow-hidden bg-black/20">
          <div 
            className={cn(
              "relative aspect-square w-full max-w-lg glass-card rounded-2xl border border-border shadow-2xl flex items-center justify-center overflow-hidden group",
              activeItem?.status === "done" && "border-emerald-500/30 shadow-emerald-500/5"
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
            {isBrushMode && activeItem?.resultPreview && (
              <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 glass-card bg-black/80 p-2 rounded-2xl border border-white/10">
                  <button onClick={() => setBrushMode("erase")} className={cn("p-2 rounded-lg transition-all", brushMode === "erase" ? "bg-emerald-500 text-white" : "text-muted-foreground hover:text-white")} title={t("tools.eraserTool")}>
                    <Eraser className="w-5 h-5" />
                  </button>
                  <button onClick={() => setBrushMode("restore")} className={cn("p-2 rounded-lg transition-all", brushMode === "restore" ? "bg-emerald-500 text-white" : "text-muted-foreground hover:text-white")} title={t("tools.restoreTool")}>
                    <Paintbrush className="w-5 h-5" />
                  </button>
                  <div className="w-[1px] h-6 bg-white/10 mx-1" />
                  <div className="px-3 flex flex-col gap-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">{t("tools.brushSize")}</span>
                    <input type="range" min="5" max="100" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-24 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full" />
                  </div>
                  <div className="w-[1px] h-6 bg-white/10 mx-1" />
                  <button onClick={saveMask} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg">{t("tools.saveEdits")}</button>
                  <button onClick={() => setIsBrushMode(false)} className="p-2 text-muted-foreground hover:text-red-400"><X className="w-5 h-5" /></button>
                </div>
                <div className="relative w-full h-full flex items-center justify-center cursor-crosshair">
                  <img src={activeItem?.preview} className="max-w-full max-h-full object-contain opacity-30" alt="Source image for erasing" />
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

            {(activeItem?.status === "idle" || activeItem?.status === "processing") && activeItem?.preview && (
              <div className="relative group h-full w-full flex items-center justify-center" onClick={activeItem?.status === "idle" ? onStart : undefined}>
                <img 
                  src={activeItem?.preview} 
                  className={cn(
                    "max-w-full max-h-full object-contain rounded-lg shadow-xl transition-all", 
                    activeItem?.status === "idle" ? "group-hover:scale-[1.02] cursor-pointer" : "opacity-40 blur-[2px] grayscale-[0.5]"
                  )} 
                  alt="Original image for background removal"
                />
                
                {activeItem?.status === "idle" && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end justify-center pb-8 cursor-pointer rounded-lg group-hover:from-black/70 transition-all">
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase italic gap-2 shadow-2xl hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" /> {t("tools.removeBackground")}
                    </Button>
                  </div>
                )}
                
                {activeItem?.status === "processing" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 rounded-lg">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin shadow-[0_0_30px_rgba(34,197,94,0.3)]" />
                      <Sparkles className="w-8 h-8 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="w-48 space-y-3 glass-card p-4 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md">
                      <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400 text-center animate-pulse">
                        {progressLabel || t("worker.processing")}
                      </p>
                      <Progress value={activeItem?.progress} className="h-1 bg-white/10 [&>div]:bg-emerald-500" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeItem?.status === "done" && activeItem?.resultPreview && (
              <div className="w-full h-full flex items-center justify-center relative overflow-hidden group">
                <div className="absolute top-4 left-4 z-10 glass-card bg-black/50 px-3 py-1 rounded-full text-[10px] font-black uppercase text-white/80 tracking-widest border border-white/10 pointer-events-none transition-opacity duration-300" style={{ opacity: sliderPos > 20 ? 1 : 0 }}>{t("comparison.before")}</div>
                <div className="absolute top-4 right-4 z-10 glass-card bg-emerald-500/50 px-3 py-1 rounded-full text-[10px] font-black uppercase text-white tracking-widest border border-emerald-500/20 pointer-events-none transition-opacity duration-300" style={{ opacity: sliderPos < 80 ? 1 : 0 }}>{t("comparison.after")}</div>

                <img 
                  src={activeItem?.resultPreview || ""} 
                  className={cn("absolute max-w-full max-h-full object-contain pointer-events-none select-none", hasShadow && "drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]")} 
                  alt="Processed image with background removed"
                />
                
                <img 
                  src={activeItem?.preview || ""} 
                  className="absolute max-w-full max-h-full object-contain pointer-events-none select-none" 
                  style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                  alt="Original image for comparison"
                />
                
                <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-ew-resize z-20 pointer-events-none" style={{ left: `calc(${sliderPos}% - 2px)` }}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-3 bg-emerald-500/40 rounded-full" />
                      <div className="w-0.5 h-3 bg-emerald-500/40 rounded-full" />
                      <div className="w-0.5 h-3 bg-emerald-500/40 rounded-full" />
                    </div>
                  </div>
                </div>

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
          <ToolHealth status={activeItem?.status} className="bg-transparent border-none p-0 shadow-none" />
          <div className="text-[9px] font-black uppercase text-muted-foreground/60 tracking-widest flex items-center gap-4">
             <span>{processTime ? t("worker.latency", { time: processTime }) : "--- ms"}</span>
             <span className="opacity-40">|</span>
             <span className={cn("px-2 py-0.5 rounded-full border border-white/5", engine === "onnx" ? "text-emerald-400" : "text-amber-400")}>
               {engine === "onnx" ? "ONNX: ISNET_FP16" : "TF.JS: BODYPIX_LITE"}
             </span>
          </div>
        </footer>
      </section>
    </div>
  );
}
