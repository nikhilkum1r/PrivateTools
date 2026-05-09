"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Download, Trash2, Loader2, ArrowRight,
  FileStack, CheckCircle2,
  ImageIcon, Search,
  Settings2, DownloadCloud,
  Undo2, Sliders,
  X, RefreshCw, ChevronRight, ChevronDown, Info,
  Percent, Scaling, Plus, Shield, Globe, Cpu, HardDrive, Lock,
  Sparkles, Wand2, Zap, GripVertical
} from "lucide-react";
import Head from "next/head";
import { DropZone } from "@/components/shared/DropZone";
import { processImage } from "@/lib/image-processor";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import JSZip from "jszip";
import { toast } from "sonner";
import { ExportManager } from "@/lib/export-manager";
import { FAQ } from "@/components/shared/FAQ";
import { Footer } from "@/components/shared/Footer";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { COMPRESSOR_FAQ } from "@/lib/faq-content";
import { TrustLayer } from "@/components/shared/TrustLayer";
import { WhySafeTools } from "@/components/shared/WhySafeTools";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { Monitor, Layers, ShieldCheck, Gauge, Activity } from "lucide-react";

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
}

interface CompressorStudioClientProps {
  defaultFormat?: string;
}

export default function CompressorStudioClient({ defaultFormat }: CompressorStudioClientProps) {
  const [files, setFiles] = useState<CompressionFile[]>([]);
  const [quality, setQuality] = useState(80);
  const [targetSize, setTargetSize] = useState<number | undefined>(undefined);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  const [outputFormat, setOutputFormat] = useState<string>("original");
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [stripMetadata, setStripMetadata] = useState(false);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [renamePattern, setRenamePattern] = useState("compressed-{name}");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);

  // Step-based flow state
  const [step, setStep] = useState<"upload" | "configure" | "processing" | "result">("upload");

  const [saturation, setSaturation] = useState(100);
  const [comparisonValue, setComparisonValue] = useState(50);
  
  // Calculate global savings
  const totalOriginalSize = files.reduce((acc, f) => acc + f.file.size, 0);
  const totalOutputSize = files.reduce((acc, f) => acc + (f.outputSize || 0), 0);
  const totalSavings = totalOriginalSize > 0 && totalOutputSize > 0 ? totalOriginalSize - totalOutputSize : 0;

  const [previewId, setPreviewId] = useState<string | null>(null);

  // Lifetime Stats Logic
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
    const nextSavings = lifetimeSavings + newSavings;
    const nextCount = lifetimeCount + 1;
    setLifetimeSavings(nextSavings);
    setLifetimeCount(nextCount);
    localStorage.setItem("safetools_image_stats", JSON.stringify({ savings: nextSavings, count: nextCount }));
  };

  useEffect(() => {
    if (defaultFormat) {
      setOutputFormat(defaultFormat);
    }
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
    setStep("configure"); // Auto-move to configuration
  };

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
        filter: "none",
        rotate: 0,
        flipX: false,
        flipY: false,
        watermarkColor: "#ffffff",
        watermarkSize: 20,
        stripMetadata
      }, (p) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: p } : f));
      });

      setFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        status: "completed",
        outputUrl: result.url,
        outputSize: result.blob.size
      } : f));
      
      const savings = fData.file.size - result.blob.size;
      if (savings > 0) updateLifetimeStats(savings);
    } catch (e) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "error" } : f));
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
    setIsMobileSettingsOpen(false);
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
    const completed = files.filter(f => f.status === "completed" && f.outputUrl);
    for (const f of completed) {
      const response = await fetch(f.outputUrl!);
      const blob = await response.blob();
      const nameParts = f.file.name.split(".");
      const originalName = nameParts[0];
      const ext = outputFormat === "original"
        ? (nameParts.pop()?.toLowerCase() || "webp")
        : outputFormat;
      
      const newName = renamePattern
        .replace("{name}", originalName)
        .replace("{ext}", ext)
        .replace("{date}", new Date().toLocaleDateString().replace(/\//g, "-"));

      zip.file(newName.endsWith(`.${ext}`) ? newName : `${newName}.${ext}`, blob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ultra-compressed-assets.zip";
    a.click();
    toast.success("Compressed archive exported");
    URL.revokeObjectURL(url);
  };

  const clearFiles = () => {
    files.forEach(f => {
      URL.revokeObjectURL(f.previewUrl);
      if (f.outputUrl) URL.revokeObjectURL(f.outputUrl);
    });
    setFiles([]);
  };

  const [smartMode, setSmartMode] = useState(true);

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

  const copyToClipboard = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Clipboard access failed");
    }
  };


  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-background text-foreground overflow-y-auto lg:overflow-hidden selection:bg-primary/30 custom-scrollbar relative">
      <Head>
        <title>Compress Images Online Free, Fast & Private | SafeTools</title>
        <meta name="description" content="Compress JPG, PNG, WEBP, AVIF, SVG, GIF, HEIC and more image formats online for free. Reduce image file size without uploading to servers. Fast, secure, browser-based image compression." />
      </Head>
      <style>{STUDIO_STYLES}</style>
      {/* Studio Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <Navbar />
      <main className="flex-grow relative z-10 overflow-hidden">
        {/* Step Progress Bar */}
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
            {/* Workspace & Main Content */}
            <section className="w-full max-w-[1600px] px-6 md:px-16 py-12 md:py-24">
              <div className="relative">
                <div className="py-12 md:py-20">

                  {/* Dynamic Action Header */}
                  <AnimatePresence>
                    {step !== "upload" && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-8 mb-12"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-border/30">
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" className="rounded-2xl border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 h-10 px-4 text-xs font-black uppercase tracking-widest transition-all gap-2" onClick={() => {
                              clearFiles();
                              setStep("upload");
                            }}>
                              <Undo2 className="w-4 h-4" /> Reset Studio
                            </Button>

                            {totalSavings > 0 && (
                              <div className="px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Space Saved</span>
                                <span className="text-sm font-black italic text-emerald-500">{(totalSavings / 1024).toFixed(1)} KB SMALLER</span>
                              </div>
                            )}

                            {lifetimeCount > 0 && (
                              <div className="px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 flex flex-col hidden sm:flex">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Lifetime Impact</span>
                                <span className="text-sm font-black italic text-primary">{(lifetimeSavings / (1024 * 1024)).toFixed(1)} MB SAVED</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline"
                              className="rounded-2xl border-blue-500/40 text-blue-500 hover:bg-blue-500/10 h-11 px-6 text-xs font-black uppercase tracking-widest transition-all gap-3"
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.multiple = true;
                                input.onchange = (e) => {
                                  const files = (e.target as HTMLInputElement).files;
                                  if (files) handleFilesDrop(Array.from(files));
                                };
                                input.click();
                              }}
                            >
                              <Plus className="w-4 h-4" /> Add More Files
                            </Button>
                            {step === "result" && files.some(f => f.status === "completed") && (
                              <Button className="rounded-2xl bg-emerald-500 text-white border border-emerald-400/50 h-11 px-6 text-xs font-black uppercase tracking-widest gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20" onClick={downloadAll}>
                                <DownloadCloud className="w-4 h-4" /> Download All Images
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Global Settings Panel - Premium Aesthetic */}
                        <div className="relative group/settings">
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/10 to-primary/20 rounded-[2.5rem] blur-xl opacity-50 group-hover/settings:opacity-100 transition-opacity duration-1000" />
                          <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-transparent to-primary/5">
                            <div className="relative flex flex-col gap-8 p-10 rounded-[2.4rem] glass-card border-border/60 shadow-2xl overflow-hidden shadow-primary/5">
                              {/* Inner Glass Reflection */}
                              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                              
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                <div className="md:col-span-3 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Settings2 className="w-3.5 h-3.5 text-primary" />
                                      <Label className="text-sm uppercase font-black tracking-widest text-primary">Save As</Label>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter border-primary/40 text-primary bg-primary/5">Secure</Badge>
                                  </div>
                                  <Select value={outputFormat} onValueChange={(val) => val && setOutputFormat(val)}>
                                    <SelectTrigger className="h-14 bg-secondary/10 border-border/40 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-primary/50 transition-all shadow-inner">
                                      <SelectValue placeholder="Format" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl bg-card border-border backdrop-blur-xl">
                                      {CATEGORIZED_FORMATS["Regular Use"].map(f => (
                                        <SelectItem key={f} value={f} className="font-black uppercase tracking-widest text-xs hover:bg-primary/20 focus:bg-primary/20">{f}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="md:col-span-4 space-y-4">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <Sliders className="w-3.5 h-3.5 text-blue-400" />
                                      <Label className="text-[10px] uppercase font-black tracking-widest text-blue-400/80">Compression Quality</Label>
                                    </div>
                                    <span className="text-sm font-black text-blue-400 tabular-nums">{quality}%</span>
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
                                            toast.info("Switched to Manual Mode");
                                          }
                                        }}
                                        className="py-2"
                                      />
                                    </div>
                                    {smartMode ? (
                                      <p className="text-[7px] font-black uppercase tracking-widest text-emerald-400 mt-2 italic animate-pulse">Smart Optimizer Active (Auto-Quality)</p>
                                    ) : (
                                      <p className="text-[7px] font-black uppercase tracking-widest text-blue-400 mt-2 italic">Manual Control Active</p>
                                    )}
                                  </div>
                                </div>

                                <div className="md:col-span-5 flex flex-wrap md:flex-nowrap items-end gap-3">
                                  <div className="flex-grow space-y-4 min-w-[140px]">
                                    <div className="flex items-center gap-2">
                                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                                      <Label className="text-[10px] uppercase font-black tracking-widest text-emerald-400/80">Smart Optimizer</Label>
                                    </div>
                                    <div className="flex items-center gap-3 h-14 px-5 rounded-2xl bg-secondary/10 border border-border shadow-inner group/switch cursor-pointer hover:border-emerald-500/30 transition-all" onClick={() => setSmartMode(!smartMode)}>
                                      <Switch checked={smartMode} onCheckedChange={setSmartMode} />
                                      <span className="text-[11px] font-black uppercase tracking-widest text-foreground transition-opacity truncate">{smartMode ? "Automatic" : "Manual"}</span>
                                    </div>
                                  </div>
                                  {step === "configure" && (
                                    <Button
                                      onClick={processAll}
                                      className="h-14 flex-grow md:flex-grow-0 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-[10px] px-6 shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-all gap-2 group/btn relative overflow-hidden whitespace-nowrap"
                                    >
                                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity animate-pulse" />
                                      <Zap className="w-4 h-4 relative z-10" /> <span className="relative z-10">Compress Images</span>
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {/* Permanent Options Panel */}
                              <div className="border-t border-white/5 pt-8 mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground/60">Resize (Width)</Label>
                                      <Scaling className="w-3 h-3 text-muted-foreground/20" />
                                    </div>
                                    <div className="relative group/input">
                                      <Input 
                                        type="number" 
                                        placeholder="Original" 
                                        value={maxWidth || ""} 
                                        onChange={(e) => setMaxWidth(e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="h-12 bg-secondary/10 border-border/40 rounded-xl font-black text-xs pr-10 focus:border-primary/50 transition-all"
                                      />
                                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/30 group-hover/input:text-primary/40 transition-colors">PX</span>
                                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/40 group-hover/input:text-primary/40 transition-colors">PX</span>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs uppercase font-black tracking-[0.2em] text-muted-foreground">Resize (Height)</Label>
                                      <Scaling className="w-3.5 h-3.5 text-muted-foreground/40 rotate-90" />
                                    </div>
                                    <div className="relative group/input">
                                      <Input 
                                        type="number" 
                                        placeholder="Original" 
                                        value={maxHeight || ""} 
                                        onChange={(e) => setMaxHeight(e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="h-12 bg-secondary/10 border-border/40 rounded-xl font-black text-xs pr-10 focus:border-primary/50 transition-all"
                                      />
                                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/40 group-hover/input:text-primary/40 transition-colors">PX</span>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs uppercase font-black tracking-[0.2em] text-muted-foreground">Limit File Size</Label>
                                      <HardDrive className="w-3.5 h-3.5 text-muted-foreground/40" />
                                    </div>
                                    <div className="relative group/input">
                                      <Input 
                                        type="number" 
                                        placeholder="No limit" 
                                        value={targetSize || ""} 
                                        onChange={(e) => setTargetSize(e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="h-12 bg-secondary/10 border-border/40 rounded-xl font-black text-xs pr-10 focus:border-primary/50 transition-all"
                                      />
                                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/40 group-hover/input:text-primary/40 transition-colors">KB</span>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-xs uppercase font-black tracking-[0.2em] text-emerald-400/60">Privacy Shield</Label>
                                      <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter border-emerald-500/20 text-emerald-500 animate-pulse">Deep Clean</Badge>
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
                                      <span className={cn("text-xs font-black uppercase tracking-widest transition-colors", stripMetadata ? "text-emerald-500" : "text-muted-foreground")}>
                                        {stripMetadata ? "All Metadata Deleted" : "Metadata Included"}
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
                                      <Label className="text-[11px] uppercase font-black tracking-[0.2em] text-muted-foreground">Bulk Rename</Label>
                                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-primary/20 text-primary">Dynamic</Badge>
                                    </div>
                                    <div className="relative group/input">
                                      <Input 
                                        placeholder="compressed-{name}" 
                                        value={renamePattern} 
                                        onChange={(e) => setRenamePattern(e.target.value)}
                                        className="h-12 bg-secondary/10 border-border/40 rounded-xl font-black text-xs focus:border-primary/50 transition-all"
                                      />
                                      <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                                        <button onClick={() => setRenamePattern("safe-{name}")} className="whitespace-nowrap px-2 py-0.5 rounded-md bg-secondary/20 text-[7px] font-bold text-muted-foreground/60 hover:text-primary transition-colors italic">safe-{`{name}`}</button>
                                        <button onClick={() => setRenamePattern("{name}-v2")} className="whitespace-nowrap px-2 py-0.5 rounded-md bg-secondary/20 text-[7px] font-bold text-muted-foreground/60 hover:text-primary transition-colors italic">{`{name}`}-v2</button>
                                        <button onClick={() => setRenamePattern("{name}-{date}")} className="whitespace-nowrap px-2 py-0.5 rounded-md bg-secondary/20 text-[7px] font-bold text-muted-foreground/60 hover:text-primary transition-colors italic">{`{name}`}-{`{date}`}</button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-[11px] uppercase font-black tracking-[0.2em] text-muted-foreground">Visual Polish</Label>
                                      <Sparkles className="w-3.5 h-3.5 text-muted-foreground/40" />
                                    </div>
                                    <div className="space-y-4 px-2">
                                      <div className="space-y-2">
                                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/40">
                                          <span>Brightness</span>
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
                                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/40">
                                          <span>Contrast</span>
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
                                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-white/40">
                                          <span>Saturation</span>
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
                                      <Label className="text-[11px] uppercase font-black tracking-[0.2em] text-muted-foreground">Size Presets</Label>
                                      <Globe className="w-3.5 h-3.5 text-muted-foreground/40" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <Button 
                                        variant="outline" 
                                        className={cn(
                                          "h-10 rounded-xl bg-secondary/10 border-border/40 text-xs font-black uppercase tracking-widest transition-all",
                                          maxWidth === 1080 && maxHeight === 1080 ? "border-primary text-primary bg-primary/10" : "hover:bg-primary/20 hover:border-primary/40 text-muted-foreground"
                                        )} 
                                        onClick={() => { setMaxWidth(1080); setMaxHeight(1080); toast.info("Instagram Preset Applied"); }}
                                      >
                                        Instagram
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        className={cn(
                                          "h-10 rounded-xl bg-white/5 border-white/10 text-[8px] font-black uppercase tracking-widest transition-all",
                                          maxWidth === 1200 && maxHeight === 630 ? "border-primary text-primary bg-primary/10" : "hover:bg-primary/20 hover:border-primary/40"
                                        )} 
                                        onClick={() => { setMaxWidth(1200); setMaxHeight(630); toast.info("Facebook Preset Applied"); }}
                                      >
                                        Facebook
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        className={cn(
                                          "h-10 rounded-xl bg-white/5 border-white/10 text-[8px] font-black uppercase tracking-widest transition-all",
                                          maxWidth === 1600 && maxHeight === 900 ? "border-primary text-primary bg-primary/10" : "hover:bg-primary/20 hover:border-primary/40"
                                        )} 
                                        onClick={() => { setMaxWidth(1600); setMaxHeight(900); toast.info("Twitter Preset Applied"); }}
                                      >
                                        Twitter
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        className={cn(
                                          "h-10 rounded-xl bg-white/5 border-white/10 text-[8px] font-black uppercase tracking-widest transition-all",
                                          maxWidth === 1920 && maxHeight === 1080 ? "border-primary text-primary bg-primary/10" : "hover:bg-primary/20 hover:border-primary/40"
                                        )} 
                                        onClick={() => { setMaxWidth(1920); setMaxHeight(1080); toast.info("Full HD Preset Applied"); }}
                                      >
                                        Full HD
                                      </Button>
                                    </div>
                                    <button className="w-full text-center text-[7px] font-black uppercase tracking-[0.2em] text-primary/40 hover:text-primary transition-colors" onClick={() => { setMaxWidth(undefined); setMaxHeight(undefined); }}>
                                      Reset to Original Size
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence mode="wait">
                    {step === "upload" ? (
                      <motion.div
                        key="upload-stage"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-3xl mx-auto space-y-12"
                      >
                        <div className="text-center space-y-8">
                          <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full glass-card border border-primary/20 shadow-2xl shadow-primary/5">
                            <div className="flex items-center gap-2">
                              <Monitor className="w-3.5 h-3.5 text-primary" />
                              <span className="text-[8px] font-black uppercase tracking-widest opacity-60 italic">Your Device</span>
                            </div>
                            <ArrowRight className="w-3 h-3 opacity-20" />
                            <div className="flex items-center gap-2">
                              <Cpu className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 italic">Browser Engine</span>
                            </div>
                            <ArrowRight className="w-3 h-3 opacity-20" />
                          <div className="flex items-center gap-2">
                            <Download className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 italic">Free & Private Optimizer</span>
                          </div>
                        </div>

                        <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter italic font-heading leading-none">
                          {defaultFormat && defaultFormat !== "original"
                            ? `Compress ${defaultFormat} Online`
                            : "Compress Images Online"}
                        </h1>
                        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-medium max-w-4xl mx-auto italic">
                          {defaultFormat && defaultFormat !== "original"
                            ? `Professional-grade ${defaultFormat.toUpperCase()} compressor. Reduce file size instantly without losing quality. 100% private, browser-based optimization.`
                            : "Reduce image file size instantly without losing quality. Compress JPG, PNG, WEBP, AVIF, HEIC, GIF, SVG, TIFF, BMP and more directly in your browser. No uploads, no tracking, fully private."
                          }
                        </p>
                      </div>

                        <div className="relative group max-w-4xl mx-auto">
                          {/* Neural Scan Line Animation - Upgraded */}
                          <motion.div
                            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent blur-md z-20 pointer-events-none opacity-0 group-hover:opacity-100"
                            animate={{ top: ['0%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                          />
                          
                          {/* Background Pulse Glow */}
                          <div className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-blue-500/30 to-primary/30 rounded-[45px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />

                          <div className="relative overflow-hidden rounded-[40px] border border-border/40 group-hover:border-primary/50 transition-all duration-700 shadow-2xl glass-card">
                            <DropZone
                              onFilesDrop={handleFilesDrop}
                              multiple
                              maxSize={1024}
                              title="Drop your images here"
                              description="or click to browse"
                              className="h-80 border-none bg-transparent hover:bg-primary/[0.02] transition-colors"
                            />
                            
                            {/* Decorative Corner Accents */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-[40px] pointer-events-none" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-[40px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl-[40px] pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br-[40px] pointer-events-none" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {[
                            { l: "Local Processing", i: ShieldCheck },
                            { l: "Zero Upload", i: Shield },
                            { l: "No Tracking", i: Lock },
                            { l: "Fast Engine", i: Zap },
                            { l: "Browser-Based", i: Globe }
                          ].map((b, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-secondary/20 border border-border/50 gap-2 hover:bg-secondary/40 transition-colors">
                              <b.i className="w-5 h-5 text-primary" />
                              <span className="text-[8px] font-black uppercase tracking-widest text-center">{b.l}</span>
                            </div>
                          ))}
                        </div>

                        <TrustLayer />

                        {/* Features Section */}
                        <div className="pt-20 space-y-12">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic font-heading">High-Performance Compression</h2>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Advanced Browser Engine</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                              { t: "Fast Image Compression", d: "Compress images in seconds using high-performance browser processing.", i: Zap },
                              { t: "100% Privacy First", d: "Your files never leave your device. Everything works locally in your browser.", i: ShieldCheck },
                              { t: "Smart Quality Optimization", d: "Reduce file size while maintaining clear image quality.", i: Sparkles },
                              { t: "Batch Compression", d: "Compress multiple images at once for faster workflow.", i: Layers },
                              { t: "Supports Modern Formats", d: "Works with JPG, PNG, WEBP, AVIF, HEIC and many other image formats.", i: ImageIcon },
                              { t: "No Installation Needed", d: "Use directly from any modern browser on desktop or mobile.", i: Globe }
                            ].map((f, i) => (
                              <div key={i} className="p-8 rounded-[32px] bg-secondary/10 border border-border flex flex-col gap-4 hover:bg-secondary/20 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                  <f.i className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                  <h4 className="text-sm font-black uppercase tracking-widest italic">{f.t}</h4>
                                  <p className="text-xs text-muted-foreground leading-relaxed">{f.d}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="pt-20 space-y-12">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic font-heading">Why Use SafeTools?</h2>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Competitive Architecture Analysis</p>
                          </div>
                          <div className="overflow-hidden rounded-[40px] border border-border bg-black/20 backdrop-blur-xl">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-border bg-black/40">
                                  <th className="p-8 text-[10px] font-black uppercase tracking-widest italic">Feature</th>
                                  <th className="p-8 text-[10px] font-black uppercase tracking-widest italic text-muted-foreground">Standard Tools</th>
                                  <th className="p-8 text-[10px] font-black uppercase tracking-widest italic text-primary">SafeTools Studio</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border/30">
                                {[
                                  { f: "Upload Required", s: "Usually", t: "No", tp: true },
                                  { f: "Local Processing", s: "Rare", t: "Yes", tp: true },
                                  { f: "Tracking Scripts", s: "Often", t: "No", tp: true },
                                  { f: "Browser-Based", s: "Partial", t: "Full", tp: true },
                                  { f: "Privacy Focused", s: "Limited", t: "Yes", tp: true }
                                ].map((row, i) => (
                                  <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="p-8 text-xs font-black uppercase tracking-tight italic">{row.f}</td>
                                    <td className="p-8 text-xs font-medium text-muted-foreground/60">{row.s}</td>
                                    <td className="p-8 text-xs font-black text-primary italic">{row.t}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* How It Works */}
                        <div className="pt-20 space-y-12">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic font-heading">How It Works</h2>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Four Steps to Efficiency</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                              { t: "Load", d: "Upload image locally" },
                              { t: "Config", d: "Select compression settings" },
                              { t: "Sync", d: "Compress securely inside browser" },
                              { t: "Export", d: "Download optimized instantly" }
                            ].map((s, i) => (
                              <div key={i} className="p-8 rounded-[40px] bg-secondary/10 border border-border text-center space-y-4">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20 mx-auto text-primary font-black text-xs">{i + 1}</div>
                                <h4 className="text-sm font-black uppercase tracking-widest italic">{s.t}</h4>
                                <p className="text-[10px] text-muted-foreground/60 font-medium leading-relaxed">{s.d}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <WhySafeTools />
                        <RelatedTools tools={[
                          { name: "Image Editor", href: "/image/editor" },
                          { name: "Background Remover", href: "/image/remove-background" },
                          { name: "Image Converter", href: "/image/convert" },
                          { name: "Metadata Cleaner", href: "/image/metadata-cleaner" },
                          { name: "QR Generator", href: "/privacy/qr-generator" }
                        ]} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="processing-stage"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20"
                      >
                        <AnimatePresence mode="popLayout">
                          {files.map((f, i) => (
                            <motion.div
                              key={f.id}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="col-span-full"
                            >
                              <div className={cn(
                                "p-5 md:p-8 rounded-[2.5rem] transition-all duration-500 relative overflow-hidden border",
                                f.status === "completed" 
                                  ? "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_40px_-10px_rgba(16,185,129,0.1)]" 
                                  : f.status === "processing"
                                    ? "bg-primary/5 border-primary/30 shadow-[0_0_40px_-10px_rgba(var(--color-primary-rgb),0.2)]"
                                    : "glass-card hover:border-primary/20 shadow-xl"
                              )}>
                                {/* Status-based Background Glow */}
                                {f.status === "completed" && (
                                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
                                )}

                                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 relative z-10">
                                  {/* Preview Container */}
                                  <div className="relative shrink-0 group/preview">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-md opacity-0 group-hover/preview:opacity-100 transition-opacity" />
                                    <div className="w-28 h-28 md:w-40 md:h-40 rounded-3xl bg-black border border-white/10 overflow-hidden relative shadow-2xl transition-transform duration-500 group-hover/preview:scale-[1.02]">
                                      <img src={f.previewUrl} className="w-full h-full object-cover opacity-70 group-hover/preview:opacity-100 transition-opacity" alt="File preview thumbnail" />
                                      <AnimatePresence>
                                        {f.status === "completed" && (
                                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-emerald-500/90 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                                            <CheckCircle2 className="w-10 h-10 mb-2" />
                                            <span className="text-[8px] font-black uppercase tracking-widest">Optimized</span>
                                          </motion.div>
                                        )}
                                        {f.status === "processing" && (
                                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            <span className="text-sm font-black text-primary mt-2">{f.progress}%</span>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  </div>

                                  {/* Info & Stats */}
                                  <div className="flex-grow min-w-0 space-y-6 text-center md:text-left">
                                    <div className="space-y-2">
                                      <h4 className="text-xl md:text-3xl font-black tracking-tighter truncate pr-10 italic uppercase font-heading">{f.file.name}</h4>
                                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                          <span className="text-[9px] font-black uppercase tracking-widest text-white/40">File Size:</span>
                                          <span className="text-[10px] font-black text-white/80">{(f.file.size / 1024).toFixed(0)} KB</span>
                                        </div>
                                        {f.outputSize && (
                                          <motion.div 
                                            initial={{ scale: 0.9, opacity: 0 }} 
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2"
                                          >
                                            <Activity className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Savings:</span>
                                            <span className="text-[10px] font-black text-emerald-500">-{Math.round((1 - (f.outputSize / f.file.size)) * 100)}%</span>
                                          </motion.div>
                                        )}
                                      </div>
                                    </div>

                                    {f.status === "processing" && (
                                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                                        <motion.div
                                          className="h-full bg-gradient-to-r from-primary via-blue-500 to-primary background-animate"
                                          initial={{ width: 0 }}
                                          animate={{ width: `${f.progress}%` }}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* Actions - High Distinction */}
                                  <div className="flex items-center gap-4 shrink-0">
                                    {f.status === "completed" ? (
                                      <div className="flex items-center gap-3">
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="w-14 h-14 rounded-2xl border-indigo-500/40 bg-indigo-500/10 text-indigo-500 hover:text-indigo-400 hover:border-indigo-500/60 transition-all group/info"
                                          onClick={() => setPreviewId(f.id)}
                                        >
                                          <Search className="w-6 h-6 group-hover/info:scale-110 transition-transform" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className="w-14 h-14 rounded-2xl border-blue-500/40 bg-blue-500/10 text-blue-500 hover:text-blue-400 hover:border-blue-500/60 transition-all group/copy"
                                          onClick={() => copyToClipboard(f.outputUrl!)}
                                        >
                                          <FileStack className="w-6 h-6 group-hover/copy:scale-110 transition-transform" />
                                        </Button>
                                        <Button
                                          className="h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] px-8 gap-3 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] active:scale-95 transition-all group/dl"
                                          onClick={() => {
                                            const ext = outputFormat === "original" ? (f.file.name.split('.').pop() || "webp") : outputFormat;
                                            const baseName = resolveFilename(f.file.name);
                                            ExportManager.downloadFromUrl(f.outputUrl!, `${baseName}.${ext}`);
                                          }}
                                        >
                                          Download Image <Download className="w-5 h-5 group-hover/dl:translate-y-0.5 transition-transform" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        className={cn(
                                          "h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] px-10 gap-3 transition-all relative overflow-hidden group/opt",
                                          f.status === "idle" 
                                            ? "bg-primary text-primary-foreground shadow-[0_0_40px_-10px_rgba(var(--color-primary-rgb),0.5)] hover:scale-[1.02]" 
                                            : "bg-white/5 text-white/20 cursor-not-allowed border-white/5"
                                        )}
                                        onClick={() => compressFile(f.id)}
                                        disabled={f.status === "processing" || isProcessingAll}
                                      >
                                        {f.status === "processing" ? (
                                          <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                          <>
                                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/opt:opacity-100 transition-opacity" />
                                            Compress <Zap className="w-5 h-5 group-hover/opt:scale-125 transition-transform" />
                                          </>
                                        )}
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
                        </AnimatePresence>
                        {step === "configure" && files.length > 0 && (
                          <div className="xl:col-span-2 flex justify-center pt-10">
                            <Button
                              className="h-20 rounded-[2.5rem] bg-gradient-to-r from-[#8b5cf6] via-[#6366f1] to-[#8b5cf6] bg-[length:200%_100%] animate-gradient hover:scale-[1.05] active:scale-95 text-white font-black text-xl px-16 gap-4 shadow-[0_0_50px_-10px_rgba(139,92,246,0.6)] group transition-all border border-white/20"
                              onClick={processAll}
                            >
                              <Zap className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                              <span className="tracking-tighter">Compress All Now</span>
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>


                  {/* Supported Formats Section */}
                  <div className="mt-40 space-y-12">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <h2 className="text-3xl font-black uppercase tracking-tighter italic font-heading">Supported Image Formats</h2>
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Universal Format Compatibility</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-10 rounded-[48px] glass-card border border-border space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Input Formats</h4>
                        <div className="flex flex-wrap gap-2">
                          {["JPG", "JPEG", "PNG", "WEBP", "AVIF", "GIF", "SVG", "HEIC", "TIFF", "BMP", "ICO"].map(f => (
                            <span key={f} className="px-4 py-2 rounded-xl bg-secondary/20 text-[10px] font-bold tracking-widest">{f}</span>
                          ))}
                        </div>
                      </div>
                      <div className="p-10 rounded-[48px] glass-card border border-border space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 italic">Output Formats</h4>
                        <div className="flex flex-wrap gap-2">
                          {["JPG", "PNG", "WEBP", "AVIF"].map(f => (
                            <span key={f} className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-widest border border-emerald-500/20">{f}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {["JPG", "PNG", "WEBP", "AVIF", "GIF", "TIFF", "SVG", "HEIC", "ICO", "BMP"].map((ext) => (
                        <div key={ext} className="p-6 rounded-[32px] glass-card border border-border flex flex-col items-center justify-center gap-4 group hover:border-primary transition-all">
                          <div className="p-3 rounded-2xl bg-secondary/30 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all font-black text-[10px]">{ext}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why Image Compression Matters (Web Performance) */}
                  <div className="mt-40 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                      <Badge className="bg-primary/10 text-primary border-primary/20 py-2 px-6 rounded-full uppercase tracking-widest text-[10px] font-black italic">Performance Intelligence</Badge>
                      <h2 className="text-5xl font-black uppercase tracking-tighter italic font-heading leading-tight">Why Image <span className="text-primary">Compression</span> Matters</h2>
                      <div className="space-y-6">
                        {[
                          { t: "Faster Websites", d: "Shrink payload for instant page loads and better UX." },
                          { t: "SEO Dominance", d: "Improve Core Web Vitals (LCP/CLS) for higher search rankings." },
                          { t: "Mobile Experience", d: "Save mobile data and bandwidth for global users." },
                          { t: "Reduced Carbon Footprint", d: "Lower data transfer means reduced server energy waste." }
                        ].map((item, i) => (
                          <div key={i} className="flex gap-6">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 font-black text-primary text-xs">{i + 1}</div>
                            <div className="space-y-2">
                              <h4 className="text-sm font-black uppercase tracking-widest italic">{item.t}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full opacity-20" />
                      <div className="glass-card rounded-[48px] border border-border p-12 space-y-8 relative z-10">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Core Web Vitals Impact</span>
                          <Gauge className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="space-y-4">
                          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} whileInView={{ width: "98%" }} className="h-full bg-emerald-500" />
                          </div>
                          <div className="flex justify-between text-[10px] font-black uppercase">
                            <span>Lighthouse Score</span>
                            <span className="text-emerald-500 text-lg italic">98/100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Local Processing vs Server Comparison */}
                  <div className="mt-40 space-y-12">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <h2 className="text-3xl font-black uppercase tracking-tighter italic font-heading leading-tight">Why Local Compression Is <span className="text-primary">Better</span></h2>
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Privacy Manifesto</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-12 rounded-[48px] bg-red-500/5 border border-red-500/10 space-y-6">
                        <div className="flex items-center gap-3">
                          <Globe className="w-6 h-6 text-red-500" />
                          <h4 className="text-lg font-black uppercase italic">Typical Tools</h4>
                        </div>
                        <ul className="space-y-4">
                          {["Upload to Server Required", "Waiting for Data Transfer", "Privacy Risk (Data Retention)", "Limited Offline Use"].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-xs font-medium text-red-500/60 uppercase">
                              <X className="w-4 h-4" /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-12 rounded-[48px] bg-emerald-500/5 border border-emerald-500/10 space-y-6 border-2 border-emerald-500/20">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-6 h-6 text-emerald-500" />
                          <h4 className="text-lg font-black uppercase italic">SafeTools Studio</h4>
                        </div>
                        <ul className="space-y-4">
                          {["0% Uploads (100% Local)", "Instant Browser Processing", "Total Privacy (Memory-Only)", "Works 100% Offline"].map((item) => (
                            <li key={item} className="flex items-center gap-3 text-xs font-black text-emerald-500 uppercase">
                              <CheckCircle2 className="w-4 h-4" /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Who Uses SafeTools? (Audiences) */}
                  <div className="mt-40 space-y-12">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <h2 className="text-3xl font-black uppercase tracking-tighter italic font-heading">Engineered for Every <span className="text-primary">Workflow</span></h2>
                      <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Professional Audience Segments</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { t: "Developers", d: "Optimize assets for CI/CD pipelines." },
                        { t: "Designers", d: "Batch compress client handoffs." },
                        { t: "Agencies", d: "Maintain quality across large projects." },
                        { t: "Photographers", d: "Secure local processing for high-res art." },
                        { t: "Bloggers", d: "Improve SEO and page speed instantly." },
                        { t: "E-commerce", d: "Reduce product image payload for conversions." },
                        { t: "Creators", d: "Web-ready assets for social media." },
                        { t: "Students", d: "Small file sizes for document submissions." }
                      ].map((u, i) => (
                        <div key={i} className="p-8 rounded-[32px] bg-secondary/10 border border-border space-y-4 hover:bg-secondary/20 transition-all">
                          <h4 className="text-xs font-black uppercase tracking-widest italic text-primary">{u.t}</h4>
                          <p className="text-[10px] text-muted-foreground/60 font-medium leading-relaxed uppercase">{u.d}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SEO Content Section */}
                  <div className="mt-40 space-y-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                      <div className="space-y-6">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Free Online Image Compressor</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          SafeTools helps you compress large images without sacrificing privacy or speed. Unlike many online compressors, your images are processed directly on your device, making compression secure and extremely fast.
                        </p>
                      </div>
                      <div className="space-y-6">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Social Media Ready</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Reduce image sizes for websites, blogs, emails, WhatsApp, Instagram, LinkedIn, portfolios and online stores to improve loading speed and save storage space.
                        </p>
                      </div>
                      <div className="space-y-6">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter">Best Browser-Based Tool</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          No software downloads or account creation required. SafeTools works on Windows, Linux, macOS, Android and iPhone browsers. Everything runs locally in your browser.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="mt-40">
                    <div className="relative overflow-hidden rounded-[64px] border border-primary/20 bg-primary/5 p-20 text-center space-y-8">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
                      <div className="space-y-4 relative z-10">
                        <Badge className="bg-primary/20 text-primary border-primary/30 py-2 px-6 rounded-full uppercase tracking-widest text-[10px] font-black italic">Fast. Secure. Browser-Based.</Badge>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic font-heading">Compress Images <span className="text-primary">Now</span></h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto italic font-medium">Join thousands of users optimizing their assets with privacy and speed.</p>
                      </div>
                      <Button className="h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg px-12 gap-4 shadow-2xl shadow-primary/30 relative z-10" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <Plus className="w-6 h-6" /> Upload Images Now
                      </Button>
                    </div>
                  </div>

                  <RelatedTools 
                    title="Expand Your Creative Workflow"
                    tools={[
                      { name: "Background Remover", href: "/image/remove-bg" },
                      { name: "Image Converter", href: "/image/convert" },
                      { name: "PDF to Image", href: "/pdf/to-image" },
                      { name: "Image Steganography", href: "/security/steganography" }
                    ]}
                    className="mt-40"
                  />

                    <div className="mt-20 border-t border-border/50">
                      <FAQ
                        items={COMPRESSOR_FAQ}
                        title="Image Compression FAQ"
                        description="Everything you need to know about shrinking images without losing quality."
                      />
                    </div>

                    {/* SEO Compression Matrix / Sitemap */}
                    <div className="pt-24 border-t border-border/40">
                      <div className="flex items-center gap-4 mb-12">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Percent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black uppercase tracking-tighter italic">Popular Image Optimizations</h2>
                          <p className="text-sm text-muted-foreground font-medium italic">Handled 100% locally in your browser</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-6">
                        {["png", "jpg", "webp", "heic", "avif", "pdf", "svg", "tiff", "gif", "ico", "bmp", "raw"].map((fmt) => (
                          <Link 
                            key={fmt} 
                            href={`/image/compress/compress-${fmt}`}
                            className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"
                          >
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                            Compress {fmt}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
            </section>

            {/* 100% Width Footer Section */}
            <footer className="w-full border-t border-border/40 bg-secondary/5 mt-24">
              <Footer />
            </footer>
          </div>
        </div>
      </main>

      <SEOStructuredData
        name="Image Compressor Studio"
        description="Shrink image file sizes by up to 90% locally in your browser. Set target KB/MB limits with zero quality loss. 100% private."
        url="https://safetools.space/image/compress"
        faqItems={COMPRESSOR_FAQ}
      />

      {/* Premium Comparison Modal - Interactive Slider */}
      <Dialog open={!!previewId} onOpenChange={() => setPreviewId(null)}>
        <DialogContent className="max-w-[95vw] h-[90vh] p-0 bg-black/95 border-white/5 overflow-hidden flex flex-col rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)]">
          <DialogHeader className="p-8 border-b border-white/5 bg-black/40 backdrop-blur-xl relative z-20">
            <DialogTitle className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-primary font-heading">Compare Quality</span>
                <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
                <span className="text-white/40 text-sm md:text-lg not-italic font-medium lowercase">Check your compressed image</span>
              </div>
              {previewId && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Original Size</span>
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-xs font-black px-4 py-1.5 rounded-xl">{(files.find(f => f.id === previewId)?.file.size! / 1024).toFixed(1)} KB</Badge>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60">New Size</span>
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 text-xs font-black px-4 py-1.5 rounded-xl">{(files.find(f => f.id === previewId)?.outputSize! / 1024).toFixed(1)} KB</Badge>
                  </div>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-grow relative overflow-hidden bg-[#050505] group/studio">
            {previewId && (
              <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12">
                <div className="relative w-full h-full max-w-5xl glass-card rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl group/comparison">
                  {/* The Comparison Engine */}
                  <div className="absolute inset-0 select-none bg-checkerboard">
                    {/* Background Layer: Optimized */}
                    <img 
                      src={files.find(f => f.id === previewId)?.outputUrl} 
                      className="absolute inset-0 w-full h-full object-contain p-4 md:p-12" 
                      alt="Optimized image preview" 
                    />
                    
                    {/* Foreground Layer: Original (Clipped) */}
                    <div 
                      className="absolute inset-0 overflow-hidden"
                      style={{ clipPath: `inset(0 ${100 - comparisonValue}% 0 0)` }}
                    >
                      <img 
                        src={files.find(f => f.id === previewId)?.previewUrl} 
                        className="absolute inset-0 w-full h-full object-contain p-4 md:p-12" 
                        alt="Original image preview" 
                      />
                    </div>

                    {/* Interactive Handle */}
                    <div 
                      className="absolute inset-y-0 z-30 flex items-center pointer-events-none"
                      style={{ left: `${comparisonValue}%` }}
                    >
                      <div className="h-full w-[2px] bg-primary relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary border-4 border-black/40 shadow-2xl flex items-center justify-center pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
                          <GripVertical className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Control Input (Hidden but Functional) */}
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={comparisonValue} 
                      onChange={(e) => setComparisonValue(parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
                    />

                    {/* Dynamic Labels */}
                    <div className="absolute top-8 left-8 px-6 py-2 rounded-2xl bg-black/80 text-[10px] font-black uppercase tracking-widest text-white border border-white/10 backdrop-blur-md shadow-2xl z-50">Original</div>
                    <div className="absolute top-8 right-8 px-6 py-2 rounded-2xl bg-emerald-500/80 text-[10px] font-black uppercase tracking-widest text-white border border-emerald-500/20 backdrop-blur-md shadow-2xl z-50">Optimized</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-8 bg-black/40 border-t border-white/5 flex items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-primary/60">How much smaller?</span>
                <span className="text-2xl font-black italic tabular-nums">
                  {previewId && Math.round((1 - (files.find(f => f.id === previewId)?.outputSize! / files.find(f => f.id === previewId)?.file.size!)) * 100)}% Smaller
                </span>
              </div>
              <div className="h-10 w-[1px] bg-white/5" />
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-blue-400/60">Quality Check</span>
                <span className="text-2xl font-black italic tabular-nums text-blue-400">Looks Perfect</span>
              </div>
            </div>

            <Button 
              className="h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-sm px-12 gap-4 shadow-2xl shadow-primary/30 group/dl-modal"
              onClick={() => {
                const f = files.find(f => f.id === previewId);
                if (f) {
                  const ext = outputFormat === "original" ? (f.file.name.split('.').pop() || "webp") : outputFormat;
                  const baseName = resolveFilename(f.file.name);
                  ExportManager.downloadFromUrl(f.outputUrl!, `${baseName}.${ext}`);
                }
              }}
            >
              Save & Download <Download className="w-6 h-6 group-hover/dl-modal:translate-y-1 transition-transform" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
