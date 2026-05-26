"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import {
  Download, Trash2, Loader2, ArrowRight,
  FileStack, CheckCircle2,
  ImageIcon, Search,
  Settings2, DownloadCloud,
  Undo2, Sliders,
  X, RefreshCw, ChevronRight, ChevronDown, Info,
  Percent, Scaling, Plus, Shield, Globe, Cpu, HardDrive, Lock,
  Sparkles, Wand2, Zap, GripVertical, Check, Undo
} from "lucide-react";
import Head from "next/head";
import { processImage } from "@/lib/image-processor";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import JSZip from "jszip";
import { toast } from "sonner";
import { ExportManager } from "@/lib/export-manager";
import { usePersistedState } from "@/hooks/usePersistedState";
import { FAQ } from "@/components/shared/FAQ";

import { Footer } from "@/components/shared/Footer";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { SuggestedTools } from "@/components/shared/SuggestedTools";
import { Monitor, Layers, ShieldCheck, Gauge, Activity } from "lucide-react";
import { useTranslations } from "next-intl";

// Modular Components
import { CompressorHero } from "./components/CompressorHero";
import { CompressorSettings } from "./components/CompressorSettings";
import { CompressorQueue } from "./components/CompressorQueue";
import { CompressorLandingExtras } from "./components/CompressorLandingExtras";
import { CompressorComparisonDialog } from "./components/CompressorComparisonDialog";
import { AdUnit } from "@/components/shared/AdUnit";


const CATEGORIZED_FORMATS = {
  "Regular Use": ["original", "webp", "jpeg", "png", "pdf", "svg", "heic"],
  "Web Standard": ["webp", "jpeg", "jpg", "png", "gif", "svg", "ico", "cur", "bmp", "apng", "jfif", "pjpeg", "pjp"],
  "Modern & Next-Gen": ["avif", "heic", "heif", "jxl", "flif", "apng", "mng"],
  "Professional Print": ["pdf", "tiff", "tif", "eps", "ai", "psd", "psb", "indd", "indt"]
};

const STUDIO_STYLES = `
  @keyframes background-animate {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .background-animate {
    background-size: 200% 200%;
    animation: background-animate 3s linear infinite;
  }
`;

interface CompressionFile {
  id: string;
  file: File;
  previewUrl: string;
  status: "idle" | "processing" | "completed" | "error";
  progress: number;
  outputSize?: number;
  outputUrl?: string;
  outputBlob?: Blob;
}

interface CompressorStudioClientProps {
  defaultFormat?: string;
  isEmbed?: boolean;
}

export default function CompressorStudioClient({ defaultFormat, isEmbed }: CompressorStudioClientProps) {
  const [files, setFiles] = useState<CompressionFile[]>([]);
  const [quality, setQuality] = usePersistedState("image:quality", 80);
  const [targetSize, setTargetSize] = useState<number | undefined>(undefined);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  const [outputFormat, setOutputFormat] = usePersistedState("image:outputFormat", "original");
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [stripMetadata, setStripMetadata] = usePersistedState("image:stripMetadata", false);
  const [renamePattern, setRenamePattern] = useState("compressed-{name}");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [comparisonValue, setComparisonValue] = useState(50);
  const [step, setStep] = useState<"upload" | "configure" | "processing" | "result">("upload");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [smartMode, setSmartMode] = usePersistedState("image:smartMode", true);

  const t = useTranslations("compressor");
  const hp = useTranslations("home");
  const t_tools = useTranslations("tools");

  // Lifetime Stats
  const [lifetimeSavings, setLifetimeSavings] = useState(0);
  const [lifetimeCount, setLifetimeCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("safetools_image_stats");
    if (saved) {
      const data = JSON.parse(saved);
      setLifetimeSavings(data.savings || 0);
      setLifetimeCount(data.count || 0);
    }
  }, []);

  const updateLifetimeStats = (newSavings: number) => {
    setLifetimeSavings(prev => prev + newSavings);
    setLifetimeCount(prev => prev + 1);
    const saved = localStorage.getItem("safetools_image_stats");
    const data = saved ? JSON.parse(saved) : { savings: 0, count: 0 };
    localStorage.setItem("safetools_image_stats", JSON.stringify({ 
      savings: data.savings + newSavings, 
      count: data.count + 1 
    }));
  };

  useEffect(() => {
    if (defaultFormat) setOutputFormat(defaultFormat);
  }, [defaultFormat]);

  const handleFilesDrop = (newFiles: File[]) => {
    const processed = newFiles.map(f => ({
      id: Math.random().toString(36).substring(7),
      file: f,
      previewUrl: URL.createObjectURL(f),
      status: "idle" as const,
      progress: 0
    }));
    setFiles(prev => [...prev, ...processed]);
    setStep("configure");
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            const ext = file.type.split('/')[1] || 'png';
            const namedFile = new File([file], `pasted-image-${Date.now()}.${ext}`, { type: file.type });
            pastedFiles.push(namedFile);
          }
        }
      }
      if (pastedFiles.length > 0) {
        handleFilesDrop(pastedFiles);
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const compressFile = async (id: string) => {
    const fData = files.find(f => f.id === id);
    if (!fData) return;

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "processing", progress: 10 } : f));

    const effectiveFormat = outputFormat === "original"
      ? (fData.file.name.split('.').pop()?.toLowerCase() || "webp")
      : outputFormat;

    try {
      const result = await processImage(fData.file, {
        quality,
        targetSize: targetSize ? targetSize * 1024 : undefined,
        maxWidth,
        maxHeight,
        format: effectiveFormat as any,
        brightness,
        contrast,
        saturation,
        stripMetadata
      }, (p) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: p } : f));
      });

      setFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        status: "completed",
        outputUrl: result.url,
        outputSize: result.blob.size,
        outputBlob: result.blob
      } : f));
      
      const savings = fData.file.size - result.blob.size;
      if (savings > 0) updateLifetimeStats(savings);
    } catch (e) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "error" } : f));
      toast.error(t("toast.error"));
    }
  };

  const processAll = async () => {
    setIsProcessingAll(true);
    setStep("processing");
    const batchSize = 3;
    const idleFiles = files.filter(f => f.status !== "completed");

    for (let i = 0; i < idleFiles.length; i += batchSize) {
      const batch = idleFiles.slice(i, i + batchSize);
      await Promise.all(batch.map(f => compressFile(f.id)));
    }
    setIsProcessingAll(false);
    setStep("result");
  };

  const resolveFilename = (originalName: string) => {
    if (!renamePattern) return originalName;
    const nameWithoutExt = originalName.split('.').slice(0, -1).join('.') || originalName;
    const date = new Date().toISOString().split('T')[0];
    return renamePattern
      .replace(/{name}/g, nameWithoutExt)
      .replace(/{date}/g, date);
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    const completed = files.filter(f => f.status === "completed" && f.outputBlob);
    for (const f of completed) {
      const blob = f.outputBlob!;
      const ext = outputFormat === "original" ? (f.file.name.split('.').pop() || "webp") : outputFormat;
      const baseName = resolveFilename(f.file.name);
      zip.file(`${baseName}.${ext}`, blob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    await ExportManager.downloadFile(content, "safetools-compressed.zip", {
      messages: {
        exportSuccess: t("toast.exported")
      }
    });
  };

  const clearFiles = () => {
    files.forEach(f => {
      URL.revokeObjectURL(f.previewUrl);
      if (f.outputUrl) URL.revokeObjectURL(f.outputUrl);
    });
    setFiles([]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.previewUrl);
        if (file.outputUrl) URL.revokeObjectURL(file.outputUrl);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const copyToClipboard = async (id: string) => {
    const f = files.find(file => file.id === id);
    if (!f?.outputBlob) return;
    
    try {
      await ExportManager.copyImage(f.outputBlob, {
        messages: {
          copySuccess: t("toast.copied"),
          copyFailed: t("toast.clipboardFailed")
        }
      });
    } catch (err) {
      toast.error(t("toast.clipboardFailed"));
    }
  };

  const totalOriginalSize = files.reduce((acc, f) => acc + f.file.size, 0);
  const totalOutputSize = files.reduce((acc, f) => acc + (f.outputSize || 0), 0);
  const totalSavings = totalOriginalSize > 0 && totalOutputSize > 0 ? totalOriginalSize - totalOutputSize : 0;

  return (
    <div className={`flex flex-col ${isEmbed ? 'h-full bg-transparent' : 'min-h-screen lg:h-screen bg-background'} text-foreground overflow-y-auto lg:overflow-hidden selection:bg-primary/30 custom-scrollbar relative`}>
      <Head>
        <title>{t("hero.title")}</title>
        <meta name="description" content={t("hero.description")} />
      </Head>

      <style>{STUDIO_STYLES}</style>
      
      {!isEmbed && (
        <>
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
          <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          <Navbar />
        </>
      )}

      <main id="main-content" className="flex-grow relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 z-50 bg-secondary/20">
          <motion.div
            className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
            initial={{ width: "25%" }}
            animate={{
              width: step === "upload" ? "25%" : step === "configure" ? "50%" : step === "processing" ? "75%" : "100%"
            }}
          />
        </div>

        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="w-full flex flex-col items-center">
            <section className={`w-full max-w-[1600px] px-6 md:px-16 ${isEmbed ? 'py-4' : 'py-12 md:py-24'}`}>
              <div className="relative">
                <div className={isEmbed ? 'py-2' : 'py-12 md:py-20'}>
                  <AnimatePresence mode="wait">
                    {step === "upload" ? (
                      <>
                        <CompressorHero
                          t={t}
                          defaultFormat={defaultFormat}
                          onFilesDrop={handleFilesDrop}
                        />
                        {!isEmbed && (
                          <div className="max-w-7xl mx-auto px-6 mt-12">
                            <></>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col gap-8">
                        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-border/30">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" className="rounded-2xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 h-10 px-4 text-xs font-semibold uppercase tracking-wider transition-all gap-2" onClick={() => {
                              clearFiles();
                              setStep("upload");
                            }}>
                              <Undo2 className="w-4 h-4" /> {t("header.reset")}
                            </Button>

                            {totalSavings > 0 && (
                              <div className="px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">{t("header.space_saved")}</span>
                                <span className="text-sm font-bold text-emerald-500">{t("header.smaller", { size: (totalSavings / 1024).toFixed(1) + " KB" })}</span>
                              </div>
                            )}

                            {lifetimeCount > 0 && !isEmbed && (
                              <div className="px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 flex flex-col hidden sm:flex">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t("header.lifetime_impact")}</span>
                                <span className="text-sm font-bold text-primary">{t("header.saved", { size: (lifetimeSavings / (1024 * 1024)).toFixed(1) + " MB" })}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline"
                              className="rounded-2xl border-blue-500/40 text-blue-500 hover:bg-blue-500/10 h-11 px-6 text-xs font-semibold uppercase tracking-wider transition-all gap-3"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.multiple = true;
                                input.accept = 'image/*,.heic,.heif,.webp,.avif,.tiff,.tif,.svg';
                                input.onchange = (e) => {
                                  const files = (e.target as HTMLInputElement).files;
                                  if (files) handleFilesDrop(Array.from(files));
                                };
                                input.click();
                              }}
                            >
                              <Plus className="w-4 h-4" /> {t("header.add_more")}
                            </Button>
                            {step === "result" && files.some(f => f.status === "completed") && (
                              <Button className="rounded-2xl bg-emerald-500 text-white border border-emerald-400/50 h-11 px-6 text-xs font-semibold uppercase tracking-wider gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20" onClick={downloadAll}>
                                <DownloadCloud className="w-4 h-4" /> {t("header.download_all")}
                              </Button>
                            )}
                          </div>
                        </div>

                        <CompressorSettings
                          t={t}
                          outputFormat={outputFormat}
                          setOutputFormat={setOutputFormat}
                          quality={quality}
                          setQuality={setQuality}
                          smartMode={smartMode}
                          setSmartMode={setSmartMode}
                          maxWidth={maxWidth}
                          setMaxWidth={setMaxWidth}
                          maxHeight={maxHeight}
                          setMaxHeight={setMaxHeight}
                          targetSize={targetSize}
                          setTargetSize={setTargetSize}
                          stripMetadata={stripMetadata}
                          setStripMetadata={setStripMetadata}
                          renamePattern={renamePattern}
                          setRenamePattern={setRenamePattern}
                          brightness={brightness}
                          setBrightness={setBrightness}
                          contrast={contrast}
                          setContrast={setContrast}
                          saturation={saturation}
                          setSaturation={setSaturation}
                          processAll={processAll}
                          step={step}
                          CATEGORIZED_FORMATS={CATEGORIZED_FORMATS}
                          toast={toast}
                        />
                        
                        {!isEmbed && (
                          <div className="py-8">
                            <></>
                          </div>
                        )}
                        
                        <CompressorQueue
                          t={t}
                          files={files}
                          compressFile={compressFile}
                          removeFile={removeFile}
                          copyToClipboard={copyToClipboard}
                          resolveFilename={resolveFilename}
                          setPreviewId={setPreviewId}
                          isProcessingAll={isProcessingAll}
                          outputFormat={outputFormat}
                          ExportManager={ExportManager}
                          processAll={processAll}
                          step={step}
                        />
                      </div>
                    )}
                  </AnimatePresence>

                  {step === "upload" && !isEmbed && (
                    <CompressorLandingExtras
                      t={t}
                      hp={hp}
                      t_tools={t_tools}
                    />
                  )}
                </div>
              </div>
            </section>

            {!isEmbed && (
              <footer className="w-full border-t border-border/40 bg-secondary/5 mt-24">
                <Footer />
              </footer>
            )}
          </div>
        </div>
      </main>

      {!isEmbed && (
        <SEOStructuredData
          name={t("seo.title")}
          description={t("seo.description")}
          url="https://safetools.space/image/compress"
          faqItems={Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any) : []}
        />
      )}

      <CompressorComparisonDialog
        t={t}
        previewId={previewId}
        setPreviewId={setPreviewId}
        files={files}
        comparisonValue={comparisonValue}
        setComparisonValue={setComparisonValue}
        outputFormat={outputFormat}
        resolveFilename={resolveFilename}
        ExportManager={ExportManager}
      />
    </div>
  );
}
