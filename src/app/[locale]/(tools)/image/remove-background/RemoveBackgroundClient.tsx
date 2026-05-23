"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ExportManager } from "@/lib/export-manager";
import { usePersistedState } from "@/hooks/usePersistedState";

import { AdUnit } from "@/components/shared/AdUnit";

// Modular Components
import { RemoveBackgroundHero } from "./components/RemoveBackgroundHero";
import { RemoveBackgroundEditor } from "./components/RemoveBackgroundEditor";
import { RemoveBackgroundSettings } from "./components/RemoveBackgroundSettings";
import { RemoveBackgroundLandingExtras } from "./components/RemoveBackgroundLandingExtras";

type Status = "idle" | "processing" | "done" | "error";

interface ProcessedResult {
  file: File;
  preview: string;
  resultBlob: Blob | null;
  resultPreview: string | null;
  maskBlob: Blob | null;
  status: Status;
  progress: number;
}

interface RemoveBackgroundClientProps {
  isEmbed?: boolean;
}

export default function RemoveBackgroundClient({ isEmbed }: RemoveBackgroundClientProps = {}) {
  const t = useTranslations("backgroundRemover");
  const common = useTranslations("common");

  const [batch, setBatch] = useState<ProcessedResult[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [status, setStatus] = useState<Status>("idle");
  const [progressLabel, setProgressLabel] = useState("");
  const [bgColor, setBgColor] = useState("transparent");
  const [customBgPreview, setCustomBgPreview] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = usePersistedState<"image/png" | "image/jpeg" | "image/webp">("bg:exportFormat", "image/png");
  const [sliderPos, setSliderPos] = useState(50);
  const [aspectRatio, setAspectRatio] = usePersistedState<"original" | "1:1" | "4:5" | "9:16">("bg:aspectRatio", "original");
  const [hasShadow, setHasShadow] = usePersistedState("bg:hasShadow", false);
  const [autoTrim, setAutoTrim] = usePersistedState("bg:autoTrim", false);
  const [processTime, setProcessTime] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Brush / Magic Eraser State
  const [isBrushMode, setIsBrushMode] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [brushMode, setBrushMode] = useState<"erase" | "restore">("erase");
  const brushCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [engine, setEngine] = usePersistedState<"onnx" | "tfjs">("bg:engine", "onnx");
  const workerRef = useRef<Worker | null>(null);
  const [mounted, setMounted] = useState(false);

  const bgPresets = [
    { name: t("bgPresets.transparent"), value: "transparent" },
    { name: t("bgPresets.white"), value: "#ffffff" },
    { name: t("bgPresets.black"), value: "#000000" },
    { name: t("bgPresets.blue"), value: "#3b82f6" },
    { name: t("bgPresets.gray"), value: "#f3f4f6" },
    { name: t("bgPresets.corporate"), value: "#1e293b" },
  ];

  useEffect(() => {
    setMounted(true);
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;

    worker.addEventListener("message", (event: MessageEvent) => {
      const { type, pct, key, buffer, mimeType, error, message } = event.data;

      setBatch(prev => {
        const next = [...prev];
        const currentIdx = next.findIndex(item => item.status === "processing");
        if (currentIdx === -1) return prev;

        switch (type) {
          case "status":
            setProgressLabel(message ?? t("worker.processing"));
            break;
          case "progress":
            next[currentIdx].progress = pct ?? 0;
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
              toast.success(t("tools.allProcessed"));
            }
            break;
          case "error":
            next[currentIdx].status = "error";
            toast.error(`${common("error")} ${next[currentIdx].file.name}: ${error}`);
            break;
        }
        return next;
      });
    });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [t, common]);

  async function processItem(index: number, currentBatch: ProcessedResult[]) {
    const item = currentBatch[index];
    if (!item || !workerRef.current) return;
    
    setBatch(prev => {
      const next = [...prev];
      next[index].status = "processing";
      return next;
    });
    
    setStatus("processing");
    setActiveIndex(index);
    setProgressLabel(t("worker.processing_file", { name: item.file.name }));
    startTimeRef.current = Date.now();
    
    try {
      workerRef.current?.postMessage({ 
        type: "process", 
        imageDataURL: item.preview,
        loadingLabel: t("worker.loading"),
        removingLabel: t("worker.removing"),
        engine: engine
      });
    } catch (err: any) {
      toast.error(t("tools.errorPreparing"));
    }
  }

  const handleDrop = useCallback((files: File[]) => {
    const validFiles = files.filter(f => {
      if (f.type === "image/svg+xml") {
        toast.error(t("worker.error_svg", { name: f.name }));
        return false;
      }
      const isImage = f.type.startsWith("image/") || /\.(heic|heif|webp|avif|tiff)$/i.test(f.name);
      if (!isImage) {
        toast.error(t("worker.error_invalid", { name: f.name }));
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

    setBatch((prev: ProcessedResult[]) => [...prev, ...newItems]);
    if (activeIndex === -1) setActiveIndex(0);
  }, [activeIndex, t]);

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
    setBgColor("transparent");
    setCustomBgPreview(null);
    setSliderPos(50);
  }, [batch]);

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (customBgPreview) URL.revokeObjectURL(customBgPreview);
    const url = URL.createObjectURL(f);
    setCustomBgPreview(url);
    setBgColor("custom-image");
  };

  const getExportBlob = async (index: number = activeIndex): Promise<Blob> => {
    const item = batch[index];
    if (!item?.resultPreview || !item?.resultBlob) return null as any;

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Failed to load result preview."));
      el.src = item.resultPreview!;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    if (item.maskBlob) {
      const maskImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("Failed to load mask image."));
        el.src = URL.createObjectURL(item.maskBlob!);
      });
      ctx.globalCompositeOperation = "destination-in";
      ctx.drawImage(maskImg, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    }

    let sourceCanvas = canvas;

    if (autoTrim) {
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const l = pixels.data.length;
      let top = null, left = null, right = null, bottom = null;
      let x, y;

      for (let i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) {
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

    const effectiveBgColor = (exportFormat === "image/jpeg" && bgColor === "transparent" && !customBgPreview) 
      ? "#ffffff" 
      : bgColor;

    if (customBgPreview) {
      const bgImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("Failed to load custom background image."));
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

    if (hasShadow) {
      fCtx.shadowColor = "rgba(0, 0, 0, 0.4)";
      fCtx.shadowBlur = Math.max(targetWidth, targetHeight) * 0.02;
      fCtx.shadowOffsetX = 0;
      fCtx.shadowOffsetY = fCtx.shadowBlur / 2;
    }

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
    const ext = exportFormat === "image/jpeg" ? "jpg" : (exportFormat === "image/webp" ? "webp" : "png");
    ExportManager.downloadFile(finalBlob, item.file.name.replace(/\.[^/.]+$/, "") + `_studio.${ext}`);
  };

  const handleCopy = async () => {
    try {
      const blob = await getExportBlob();
      const canvas = document.createElement("canvas");
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const el = new Image();
        el.onload = () => res(el);
        el.onerror = () => rej(new Error("Failed to load blob for copying."));
        el.src = URL.createObjectURL(blob);
      });
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
      const pngBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
      URL.revokeObjectURL(img.src);
      await navigator.clipboard.write([new ClipboardItem({ "image/png": pngBlob })]);
      toast.success(t("tools.copySuccess"));
    } catch (err) {
      toast.error(t("tools.copyFailed"));
    }
  };

  const startDrawing = (e: any) => {
    if (!isBrushMode) return;
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: any) => {
    if (!isDrawing || !brushCanvasRef.current) return;
    const canvas = brushCanvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const x = (("touches" in e) ? e.touches[0].clientX : (e as React.MouseEvent).clientX) - rect.left;
    const y = (("touches" in e) ? e.touches[0].clientY : (e as React.MouseEvent).clientY) - rect.top;
    
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
    const blob = await new Promise<Blob>((res) => brushCanvasRef.current!.toBlob((b: Blob | null) => res(b!), "image/png"));
    setBatch(prev => {
      const next = [...prev];
      next[activeIndex].maskBlob = blob;
      return next;
    });
    setIsBrushMode(false);
    toast.success(t("tools.maskUpdated"));
  };

  const isWorking = status === "processing";

  return (
    <div className={`flex flex-col ${isEmbed ? 'h-full bg-transparent' : 'min-h-screen bg-background'} text-foreground selection:bg-primary/30 custom-scrollbar`}>
      {!isEmbed && <Navbar />}
      <main className="flex-grow flex flex-col relative z-10">
        {!mounted ? (
          <div className="flex-grow flex items-center justify-center p-24">
             <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 animate-spin rounded-full" />
          </div>
        ) : (
          <>
            {!isEmbed && <RemoveBackgroundHero t={t} onUpload={handleDrop} />}
            
            {!isEmbed && (
              <div className="container mx-auto px-4 mb-8">
                 <AdUnit type="banner" />
              </div>
            )}

            {(batch.length > 0 || isEmbed) && (
              <div className={`flex flex-col lg:flex-row flex-grow overflow-hidden ${isEmbed ? '' : 'border-t border-border bg-black/20'}`}>
                {batch.length === 0 && isEmbed ? (
                  <div className="flex-grow flex items-center justify-center p-8">
                    <RemoveBackgroundHero t={t} onUpload={handleDrop} />
                  </div>
                ) : (
                  <>
                    <RemoveBackgroundEditor 
                      t={t}
                      batch={batch}
                      activeIndex={activeIndex}
                      setActiveIndex={setActiveIndex}
                      onDrop={handleDrop}
                      onStart={handleStart}
                      onReset={handleReset}
                      isBrushMode={isBrushMode}
                      setIsBrushMode={setIsBrushMode}
                      brushMode={brushMode}
                      setBrushMode={setBrushMode}
                      brushSize={brushSize}
                      setBrushSize={setBrushSize}
                      brushCanvasRef={brushCanvasRef}
                      startDrawing={startDrawing}
                      draw={draw}
                      stopDrawing={stopDrawing}
                      saveMask={saveMask}
                      sliderPos={sliderPos}
                      setSliderPos={setSliderPos}
                      hasShadow={hasShadow}
                      bgColor={bgColor}
                      customBgPreview={customBgPreview}
                      aspectRatio={aspectRatio}
                      progressLabel={progressLabel}
                      processTime={processTime}
                      engine={engine}
                    />
                    <RemoveBackgroundSettings 
                      t={t}
                      bgPresets={bgPresets}
                      bgColor={bgColor}
                      setBgColor={setBgColor}
                      customBgPreview={customBgPreview}
                      handleCustomBgUpload={handleCustomBgUpload}
                      setCustomBgPreview={setCustomBgPreview}
                      aspectRatio={aspectRatio}
                      setAspectRatio={setAspectRatio}
                      exportFormat={exportFormat}
                      setExportFormat={setExportFormat}
                      autoTrim={autoTrim}
                      setAutoTrim={setAutoTrim}
                      hasShadow={hasShadow}
                      setHasShadow={setHasShadow}
                      isWorking={isWorking}
                      handleExport={() => handleExport()}
                      handleCopy={handleCopy}
                      status={batch[activeIndex]?.status}
                      engine={engine}
                      setEngine={setEngine}
                    />
                  </>
                )}
              </div>
            )}

            {!isEmbed && (
              <>
                <div className="container mx-auto px-4 py-20">
                   <AdUnit type="multiplex" />
                </div>
                <RemoveBackgroundLandingExtras t={t} common={common} />
              </>
            )}
          </>
        )}
      </main>
      {!isEmbed && <Footer />}
    </div>
  );
}
