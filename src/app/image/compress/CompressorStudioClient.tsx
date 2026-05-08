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
  Percent, Scaling, Plus, Shield, Globe, Cpu, HardDrive,
  Sparkles, Wand2, Zap
} from "lucide-react";
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

const CATEGORIZED_FORMATS = {
  "Regular Use": ["original", "webp", "jpeg", "png", "pdf", "svg", "heic"],
  "Web Standard": ["webp", "jpeg", "jpg", "png", "gif", "svg", "ico", "cur", "bmp", "apng", "jfif", "pjpeg", "pjp"],
  "Modern & Next-Gen": ["avif", "heic", "heif", "jxl", "flif", "apng", "mng"],
  "Professional Print": ["pdf", "tiff", "tif", "eps", "ai", "psd", "psb", "indd", "indt"]
};

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
  const [outputFormat, setOutputFormat] = useState<string>("original");
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);

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
        format: effectiveFormat as any,
        rotate: 0,
        flipX: false,
        flipY: false,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        filter: "none",
        watermarkColor: "#ffffff",
        watermarkSize: 20
      }, (p) => {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: p } : f));
      });

      setFiles(prev => prev.map(f => f.id === id ? { 
        ...f, 
        status: "completed", 
        outputUrl: result.url, 
        outputSize: result.blob.size 
      } : f));
    } catch (e) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "error" } : f));
    }
  };

  const processAll = async () => {
    setIsProcessingAll(true);
    const batchSize = 3;
    const idleFiles = files.filter(f => f.status !== "completed");
    
    for (let i = 0; i < idleFiles.length; i += batchSize) {
      const batch = idleFiles.slice(i, i + batchSize);
      await Promise.all(batch.map(f => compressFile(f.id)));
    }
    setIsProcessingAll(false);
    setIsMobileSettingsOpen(false);
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    const completed = files.filter(f => f.status === "completed" && f.outputUrl);
    for (const f of completed) {
      const response = await fetch(f.outputUrl!);
      const blob = await response.blob();
      const ext = outputFormat === "original" 
        ? (f.file.name.split('.').pop()?.toLowerCase() || "webp")
        : outputFormat;
      zip.file(`compressed-${f.file.name.split(".")[0]}.${ext}`, blob);
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

  const renderSettings = () => (
    <div className="flex flex-col flex-grow min-h-0">
      <ScrollArea className="flex-grow min-h-0">
        <div className="p-4 space-y-4">
          {/* Strategy Module */}
          <div className="space-y-6">
             <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Percent className="w-4 h-4 text-primary" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Compression Strategy</h4>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                className={cn(
                  "h-11 rounded-2xl border-border flex flex-col items-center justify-center gap-1 transition-all",
                  quality < 100 ? "bg-primary/20 border-primary/50 text-foreground shadow-lg" : "bg-secondary/30 text-muted-foreground/60"
                )}
                onClick={() => setQuality(75)}
              >
                <span className="text-[10px] font-black uppercase italic">Lossy</span>
                <span className="text-[7px] font-bold opacity-40 uppercase">Shrink</span>
              </Button>
              <Button 
                variant="outline" 
                className={cn(
                  "h-11 rounded-2xl border-border flex flex-col items-center justify-center gap-1 transition-all",
                  quality === 100 && !maxWidth ? "bg-primary/20 border-primary/50 text-foreground shadow-lg" : "bg-secondary/30 text-muted-foreground/60"
                )}
                onClick={() => {
                  setQuality(100);
                  setMaxWidth(undefined);
                }}
              >
                <span className="text-[10px] font-black uppercase italic">Lossless</span>
                <span className="text-[7px] font-bold opacity-40 uppercase">Perfect</span>
              </Button>
              <Button 
                variant="outline" 
                className={cn(
                  "h-11 rounded-2xl border-border flex flex-col items-center justify-center gap-1 transition-all",
                  quality === 100 && maxWidth ? "bg-primary/20 border-primary/50 text-foreground shadow-lg" : "bg-secondary/30 text-muted-foreground/60"
                )}
                onClick={() => {
                  setQuality(100);
                  // If we want to 'increase' we should probably set a high maxWidth if not already set
                  if (!maxWidth) setMaxWidth(2000); 
                }}
              >
                <span className="text-[10px] font-black uppercase italic">Upscale</span>
                <span className="text-[7px] font-bold opacity-40 uppercase">Enlarge</span>
              </Button>
            </div>
          </div>

          {/* Strength Module */}
          <div className="space-y-6 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Compression Strength</Label>
                <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest italic">Quality vs Size Tradeoff</p>
              </div>
              <span className="text-sm font-black text-primary tabular-nums">{quality}%</span>
            </div>
            <Slider 
              value={[quality]} 
              min={1} max={100} step={1} 
              onValueChange={(v) => setQuality(Array.isArray(v) ? v[0] : v)}
              className="py-2"
            />
            <div className="flex justify-between text-[8px] text-muted-foreground/40 font-black uppercase tracking-widest">
              <span>Ultra Small</span>
              <span>High Fidelity</span>
            </div>
          </div>

          {/* Format & Requirements */}
          <div className="space-y-5 pt-4 border-t border-border">
            <div className="space-y-4">
              <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Target Format</Label>
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="outline" className="w-full h-10 rounded-lg bg-secondary/30 border-border px-3 hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden shadow-2xl relative text-foreground">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-8 h-8 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                        <HardDrive className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-col items-start text-left flex-grow">
                        <span className="text-[8px] opacity-30 tracking-[0.3em] uppercase font-black">Active Pipeline</span>
                        <span className="text-sm font-black uppercase tracking-widest">{outputFormat || "Select Format"}</span>
                      </div>
                      <ChevronDown className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Button>
                } />
                <DropdownMenuContent className="w-[300px] p-0 bg-card border-border rounded-2xl shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] overflow-hidden backdrop-blur-3xl" align="start">
                  <div className="p-4 border-b border-border bg-secondary/30">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="Filter Formats..." 
                        className="h-12 pl-12 bg-muted/40 border-border rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-primary/50 transition-all shadow-inner text-foreground"
                        onChange={(e) => {
                          const search = e.target.value.toLowerCase();
                          const items = document.querySelectorAll('.format-item');
                          items.forEach((item: any) => {
                            const val = item.getAttribute('data-value') || '';
                            item.style.display = val.includes(search) ? 'flex' : 'none';
                          });
                        }}
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-[360px]">
                    <div className="p-4 space-y-4">
                      {Object.entries(CATEGORIZED_FORMATS).map(([cat, fmts]) => (
                        <div key={cat} className="space-y-4">
                          <div className="flex items-center gap-3 px-2">
                            <div className="h-[1px] flex-grow bg-secondary/50" />
                            <p className="text-[9px] uppercase font-black tracking-[0.3em] text-primary/60">{cat}</p>
                            <div className="h-[1px] flex-grow bg-secondary/50" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {fmts.map(f => (
                              <button
                                key={f}
                                data-value={f.toLowerCase()}
                                className={cn(
                                  "format-item flex items-center justify-between px-3 py-2 rounded-lg border transition-all active:scale-95 group",
                                  outputFormat === f 
                                    ? "bg-primary border-primary shadow-lg shadow-primary/20 text-foreground" 
                                    : "bg-secondary/30 border-border text-muted-foreground/70 hover:bg-secondary/50 hover:border-primary/30 hover:text-foreground"
                                )}
                                onClick={() => setOutputFormat(f as any)}
                              >
                                <span className="text-[10px] font-black tracking-widest uppercase">{f}</span>
                                {outputFormat === f && <CheckCircle2 className="w-4 h-4" />}
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Strict Size Requirement</Label>
                  <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest italic">Force output under specific limit</p>
                </div>
                <Switch checked={!!targetSize} onCheckedChange={(c) => setTargetSize(c ? 100 : undefined)} />
              </div>
              <AnimatePresence>
                {targetSize !== undefined && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex gap-2">
                    <Input 
                      type="number" 
                      value={targetSize} 
                      onChange={(e) => setTargetSize(parseInt(e.target.value) || 0)}
                      className="bg-secondary/50 border-border rounded-lg h-9 font-mono text-center text-foreground"
                    />
                    <Badge variant="outline" className="rounded-xl shrink-0 px-4 text-muted-foreground/60">KB</Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Advanced Optimization Module */}
          <div className="space-y-6 pt-4 border-t border-border pb-10">
             <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                <HardDrive className="w-4 h-4 text-blue-500" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">Engine Overrides</h4>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-foreground font-black uppercase tracking-tighter">Chroma Subsampling</span>
                  <p className="text-[8px] text-muted-foreground/40 uppercase font-bold tracking-widest">Optimized 4:2:0 Quantization</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
              </div>

              <div className="space-y-2">
                <Label className="text-[8px] uppercase opacity-50 text-muted-foreground/60 tracking-widest font-black">Maximum Width (px)</Label>
                <div className="relative group">
                  <Input 
                    placeholder="Scale Original" 
                    type="number" 
                    value={maxWidth || ""} 
                    onChange={(e) => setMaxWidth(parseInt(e.target.value) || undefined)}
                    className="bg-secondary/50 border-border rounded-lg h-9 pl-10 focus:border-primary/50 transition-all shadow-inner text-foreground font-bold"
                  />
                  <Scaling className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="p-6 border-t border-border bg-card">
        <Button 
          className="w-full h-9 rounded-lg bg-primary hover:bg-primary/90 text-foreground font-black text-lg gap-3 shadow-2xl shadow-primary/30 group active:scale-95 transition-all"
          onClick={processAll}
          disabled={files.length === 0 || isProcessingAll}
        >
          {isProcessingAll ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 group-hover:scale-125 transition-transform" />}
          Start Optimization
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-background text-foreground overflow-y-auto lg:overflow-hidden lg:overflow-hidden selection:bg-primary/30 custom-scrollbar">
      <Navbar />
      <main className="flex-grow flex flex-col lg:flex-row overflow-visible lg:overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[140px] rounded-full animate-pulse" />
          <div 
            className="absolute inset-0 opacity-[0.4] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} 
          />
        </div>

        <div className="flex-grow flex flex-col lg:flex-row relative z-10 overflow-hidden">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex w-[300px] h-full max-h-full studio-sidebar shrink-0 shrink-0 flex-col relative shadow-2xl">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                  <Wand2 className="w-3.5 h-3.5" /> Compression Lab
                </h3>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Multi-Engine Optimization</p>
              </div>
              <Badge variant="outline" className="text-[9px] border-border bg-secondary/50 text-muted-foreground/70 uppercase font-black px-3 py-1 rounded-full">Pro</Badge>
            </div>
            {renderSettings()}
          </aside>

          {/* Workspace */}
          <section className="flex-grow flex flex-col min-w-0 bg-transparent">
            <header className="px-4 py-3 flex items-center justify-between studio-header">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center border border-border shadow-2xl group relative overflow-hidden">
                  <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Scaling className="w-6 h-6 md:w-8 md:h-8 text-foreground relative z-10" />
                </div>
                <div>
                  <h2 className="font-black text-lg md:text-2xl tracking-tighter uppercase italic">
                    {defaultFormat ? `${defaultFormat.toUpperCase()} Optimizer` : "Image Compressor"}
                  </h2>
                  <div className="flex items-center gap-3">
                    <Badge className="text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-0.5 rounded-full font-black uppercase tracking-widest">
                       {targetSize ? `Target: Under ${targetSize}KB` : "Requirement: Global Optimization"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-40">{files.length} Assets in Queue</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <AnimatePresence>
                  {files.some(f => f.status === "completed") && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                      <Button variant="outline" className="rounded-2xl border-primary/20 bg-primary/10 text-primary h-12 md:h-10 px-6 text-xs font-black uppercase tracking-widest gap-3 hover:bg-primary hover:text-foreground transition-all shadow-lg shadow-primary/20" onClick={downloadAll}>
                        <DownloadCloud className="w-5 h-5" /> <span className="hidden sm:inline">Export Bundle</span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <Button variant="ghost" className="rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 h-12 md:h-10 px-6 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all" onClick={clearFiles}>
                  Flush Memory
                </Button>

                {/* Mobile Settings Toggle */}
                <Sheet open={isMobileSettingsOpen} onOpenChange={setIsMobileSettingsOpen}>
                  <SheetTrigger 
                    render={
                      <Button variant="outline" size="icon" className="lg:hidden rounded-2xl border-border bg-secondary/50 h-12 w-12 md:h-10 md:w-14" />
                    }
                  >
                    <Settings2 className="w-5 h-5" />
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:w-[320px] p-0 bg-card border-border rounded-l-xl">
                    <SheetHeader className="px-4 py-3 border-b border-border">
                      <SheetTitle className="text-foreground flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter">
                        <Wand2 className="w-6 h-6 text-primary" /> Optimizer Engine
                      </SheetTitle>
                    </SheetHeader>
                    {renderSettings()}
                  </SheetContent>
                </Sheet>
              </div>
            </header>

            <div className="flex-grow relative overflow-y-auto lg:overflow-hidden studio-workspace">
              <ScrollArea className="h-full">
                <div className="p-4 md:p-5">
                  {files.length === 0 ? (
                    <>
                      <div className="max-w-sm mx-auto mt-8 md:mt-12 pb-8">
                        <DropZone 
                          onFilesDrop={handleFilesDrop} 
                          multiple 
                          maxSize={1024} 
                          title=" "
                          description=" "
                          className="h-48 border-2 border-dashed border-border hover:border-primary/50 bg-secondary/30 rounded-2xl transition-all" 
                        />
                      </div>

                      {/* SEO FAQ SECTION */}
                      {defaultFormat && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-12 space-y-4 text-left"
                        >
                          <div className="space-y-6">
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic">Deep Optimization: <span className="text-primary">{defaultFormat.toUpperCase()}</span></h3>
                            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                              Minimize or **increase** your digital footprint with surgical precision. Our local-first engine utilizes advanced quantization for shrinking assets by up to 90%, or high-fidelity interpolation for **Upscaling and resolution boosting**, ensuring your assets meet any size requirement.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { 
                                title: "100% Private", 
                                desc: "Standard compressors upload your assets to cloud servers. We process everything in your browser's RAM, ensuring absolute data sovereignty.",
                                icon: Shield 
                              },
                              { 
                                title: "Parallel Optimization", 
                                desc: "Shrink entire asset libraries simultaneously using our multi-threaded WASM engine, optimized for high-speed local processing.",
                                icon: Zap 
                              },
                              { 
                                title: "Visual Lossless", 
                                desc: "Our algorithms are tuned to maintain professional-grade clarity while stripping away unnecessary data overhead.",
                                icon: Percent 
                              },
                              { 
                                title: "Native Speed", 
                                desc: "By leveraging WebAssembly, we provide the performance of a desktop application directly in your local hardware environment.",
                                icon: Cpu 
                              }
                            ].map((item, i) => (
                              <div key={i} className="p-8 rounded-2xl bg-secondary/30 border border-border space-y-6 hover:bg-secondary/50 hover:border-primary/20 transition-all group shadow-xl">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                                  <item.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h4 className="text-lg font-black uppercase tracking-tight">{item.title}</h4>
                                <p className="text-sm text-muted-foreground/60 leading-relaxed font-medium">{item.desc}</p>
                              </div>
                            ))}
                          </div>

                          {/* SEO Link Cloud */}
                          <div className="space-y-6 pt-8 border-t border-border">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <h3 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                                <Globe className="w-7 h-7 text-primary" /> Universal Optimization Hub
                              </h3>
                              <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest">
                                Global Reach
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              {[
                                "png", "jpeg", "webp", "avif", "heic", "svg", "tiff", "gif", "bmp", "ico"
                              ].map((fmt) => (
                                <Link 
                                  key={fmt}
                                  href={`/image/compress/compress-${fmt}`}
                                  className="px-6 py-3 rounded-2xl bg-secondary/30 border border-border text-xs font-black uppercase tracking-widest hover:bg-primary/20 hover:border-primary/40 hover:text-foreground transition-all shadow-xl"
                                >
                                  Optimize {fmt.toUpperCase()}
                                </Link>
                              ))}
                            </div>

                            <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-background to-blue-500/10 border border-border space-y-5 shadow-2xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150">
                                 <HardDrive className="w-32 h-32" />
                              </div>
                              <div className="flex items-center gap-3 relative z-10">
                                <div className="w-11 h-11 rounded-3xl bg-card border border-border flex items-center justify-center shadow-2xl">
                                  <Percent className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Engine Quantization</h3>
                                  <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">WASM Multi-threaded Enabled</p>
                                </div>
                              </div>
                              <p className="text-sm md:text-lg text-muted-foreground/80 leading-relaxed font-medium relative z-10">
                                Our compression architecture represents the pinnacle of modern media engineering. By leveraging high-performance **C++ and Rust** binaries compiled to **WebAssembly (WASM)**, we bypass the traditional network bottleneck, enabling instant processing of multi-gigabyte asset libraries without ever exposing your data to a public server. This is not just a compressor; it's a statement of data sovereignty and performance excellence.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-3 pb-12">
                      <AnimatePresence mode="popLayout">
                        {files.map((f, i) => (
                          <motion.div 
                            key={f.id} 
                            layout 
                            initial={{ opacity: 0, y: 20, scale: 0.98 }} 
                            animate={{ opacity: 1, y: 0, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                          >
                            <Card className={cn("p-4 md:p-6 rounded-2xl bg-secondary/30 border-border group relative overflow-hidden transition-all duration-500", f.status === "processing" && "border-primary/50 shadow-[0_0_50px_-10px_rgba(var(--primary-rgb),0.3)]")}>
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              
                              <div className="flex gap-4 md:gap-4 relative z-10">
                                <div className="w-12 h-12 md:w-44 md:h-44 rounded-xl bg-muted/60 border border-border overflow-hidden shrink-0 relative shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                  <img src={f.previewUrl} className="w-full h-full object-cover" alt="" />
                                  <AnimatePresence>
                                    {f.status === "completed" && (
                                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-emerald-500/80 backdrop-blur-sm flex flex-col items-center justify-center text-foreground">
                                        <CheckCircle2 className="w-10 h-10 mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Complete</span>
                                      </motion.div>
                                    )}
                                    {f.status === "processing" && (
                                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-muted/80 backdrop-blur-sm flex flex-col items-center justify-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-primary mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">{f.progress}%</span>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                                <div className="flex-grow min-w-0 flex flex-col justify-between py-2">
                                  <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                      <div className="space-y-1">
                                        <h4 className="text-sm md:text-xl font-black tracking-tight truncate pr-4 italic">{f.file.name}</h4>
                                        <div className="flex items-center gap-3">
                                          <Badge variant="outline" className="text-[8px] md:text-[10px] border-border bg-secondary/50 px-3 py-0.5 uppercase tracking-widest font-black opacity-60">Original: {(f.file.size / 1024).toFixed(0)} KB</Badge>
                                        </div>
                                      </div>
                                      <button onClick={() => removeFile(f.id)} className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all"><X className="w-5 h-5" /></button>
                                    </div>

                                    {f.status === "processing" && (
                                      <div className="w-full h-2 bg-secondary/50 rounded-full overflow-hidden border border-border">
                                        <motion.div
                                          className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                                          initial={{ width: 0 }}
                                          animate={{ width: `${f.progress || 10}%` }}
                                          transition={{ ease: "linear" }}
                                        />
                                      </div>
                                    )}

                                    {f.status === "completed" && f.outputSize && (
                                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col gap-2">
                                         <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Shrink Rate</span>
                                            </div>
                                            <span className="text-xs font-mono font-bold text-emerald-500">-{Math.round((1 - (f.outputSize / f.file.size)) * 100)}%</span>
                                         </div>
                                         <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Output Size</span>
                                            <span className="text-xs font-mono font-bold text-muted-foreground/80">{(f.outputSize / 1024).toFixed(1)} KB</span>
                                         </div>
                                      </motion.div>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between pt-6">
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary/50 border border-border">
                                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">{f.file.name.split('.').pop()}</span> 
                                      <ArrowRight className="w-3 h-3 text-primary opacity-40" /> 
                                      <span className="text-[10px] font-black uppercase text-primary tracking-widest italic">{outputFormat}</span>
                                    </div>
                                    <Button
                                      size="lg"
                                      variant={f.status === "completed" ? "default" : "outline"}
                                      className={cn("h-12 md:h-10 rounded-2xl text-[10px] md:text-xs px-6 md:px-5 uppercase font-black tracking-widest transition-all shadow-xl group", f.status === "completed" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "border-border hover:bg-primary/20 hover:border-primary/40")}
                                      onClick={() => {
                                        if (f.status === "completed" && f.outputUrl) {
                                          const ext = outputFormat === "original" ? (f.file.name.split('.').pop() || "webp") : outputFormat;
                                          ExportManager.downloadFromUrl(
                                            f.outputUrl,
                                            `compressed-${f.file.name.split('.')[0]}.${ext}`
                                          );
                                        } else {
                                          compressFile(f.id);
                                        }
                                      }}
                                      disabled={isProcessingAll || f.status === "processing"}
                                    >
                                      {f.status === "completed" ? (
                                        <>Export <Download className="w-4 h-4 ml-3 group-hover:translate-y-1 transition-transform" /></>
                                      ) : (
                                        f.status === "processing" ? (
                                          <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                          <>Shrink Asset <Zap className="w-4 h-4 ml-3 group-hover:scale-125 transition-transform" /></>
                                        )
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                  {files.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 max-w-xl mx-auto pb-16">
                       <DropZone onFilesDrop={handleFilesDrop} multiple maxSize={1024} className="h-24 md:h-32 bg-secondary/30 rounded-2xl border-dashed border-border hover:bg-secondary/50 hover:border-primary/50 transition-all group" title="Batch Append to Pipeline" />
                    </motion.div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </section>

          {/* Mobile FAB */}
          <AnimatePresence>
            {files.length > 0 && !isProcessingAll && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: 50 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.5, y: 50 }}
                className="lg:hidden fixed bottom-6 right-4 z-40"
              >
                 <Button 
                  className="w-11 h-11 rounded-full bg-primary shadow-[0_20px_50px_rgba(var(--primary-rgb),0.5)] flex items-center justify-center p-0 border-4 border-border active:scale-90 transition-all"
                  onClick={processAll}
                  disabled={isProcessingAll}
                 >
                   <Zap className="w-8 h-8 text-foreground" />
                 </Button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
      <SEOStructuredData 
        name="Image Compressor Studio"
        description="Shrink image file sizes by up to 90% locally in your browser. Set target KB/MB limits with zero quality loss. 100% private."
        url="https://safetools.space/image/compress"
        faqItems={COMPRESSOR_FAQ}
      />
      <FAQ 
        items={COMPRESSOR_FAQ}
        title="Image Compression FAQ"
        description="Everything you need to know about shrinking images without losing quality."
      />
      <Footer />
    </div>
  );
}

