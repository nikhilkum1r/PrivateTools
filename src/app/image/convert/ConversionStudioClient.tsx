"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Download, Trash2, Loader2, ArrowRight, 
  FileStack, CheckCircle2, AlertCircle,
  ImageIcon, Search,
  Settings2, DownloadCloud, Layers, ShieldCheck,
  Undo2, Sliders,
  X, RefreshCw, ChevronRight, ChevronDown, Info,
  Percent, Scaling, Plus, Shield, Globe, Cpu, HardDrive, Lock,
  Sparkles, Wand2, Zap, GripVertical, Activity, Monitor, Gauge
} from "lucide-react";
import Head from "next/head";
import { DropZone } from "@/components/shared/DropZone";
import { FAQ } from "@/components/shared/FAQ";
import { RelatedTools } from "@/components/shared/RelatedTools";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { IMAGE_CONVERTER_FAQ } from "@/lib/faq-content";
import { Footer } from "@/components/shared/Footer";
import { useImageStore, ImageFormat } from "@/store/useImageStore";
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
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExportManager } from "@/lib/export-manager";

const CATEGORIZED_FORMATS = {
  "Regular Use": ["webp", "jpeg", "png", "pdf", "svg", "heic"],
  "Web Standard": ["webp", "jpeg", "jpg", "png", "gif", "svg", "ico", "cur", "bmp", "apng", "jfif", "pjpeg", "pjp"],
  "Modern & Next-Gen": ["avif", "heic", "heif", "jxl", "flif", "apng", "mng"],
  "Professional Print": ["pdf", "tiff", "tif", "eps", "ai", "psd", "psb", "indd", "indt"],
  "Design & Illustration": ["xcf", "kra", "ora", "afphoto", "cdr", "cmx"],
  "Game Dev & Textures": ["tga", "dds", "ktx", "ktx2", "basis", "pvr", "astc", "pkm", "vtf", "tex"],
  "Camera RAW (All)": ["raw", "dng", "cr2", "cr3", "crw", "nef", "nrw", "arw", "srf", "sr2", "orf", "rw2", "raf", "pef", "erf", "kdc", "dcr", "mos", "mef", "mrw", "x3f", "3fr", "fff", "iiq", "cap", "rwl", "bay", "cine"],
  "Scientific & Medical": ["dicom", "dcm", "dicomweb", "fits", "fts", "img", "nii", "nrrd"],
  "Vector & CAD": ["svg", "svgz", "ai", "eps", "pdf", "dwg", "dxf", "wmf", "emf", "odg"],
  "HDR / High Dynamic": ["exr", "hdr", "rgbe", "pic"],
  "Document / Office": ["docx", "doc", "xlsx", "xls", "pptx", "ppt", "csv", "txt", "md", "rtf", "odt", "ods", "odp"],
  "Legacy / Other": ["pcx", "pnm", "xbm", "xpm", "dib", "rle", "iff", "lbm", "pbm", "pgm", "ppm"]
};

interface ConversionStudioClientProps {
  fromFormat?: string;
  toFormat?: string;
}

export default function ConversionStudioClient({ fromFormat, toFormat }: ConversionStudioClientProps) {
  const { 
    files, settings, addFiles, removeFile, 
    updateSettings, setFileStatus, setProcessedUrl, clearFiles 
  } = useImageStore();
  
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [step, setStep] = useState<"upload" | "configure" | "processing" | "result">("upload");
  const [comparisonValue, setComparisonValue] = useState(50);
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

  // Pre-populate target format if provided via props (SEO optimization)
  useEffect(() => {
    if (toFormat) {
      updateSettings({ format: toFormat as any });
    }
  }, [toFormat, updateSettings]);

  const handleFilesDrop = async (newFiles: File[]) => {
    const toAdd: File[] = [];
    for (const f of newFiles) {
      if (f.name.toLowerCase().endsWith(".pdf")) {
        try {
          const pdfjs = await import("pdfjs-dist");
          pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
          const arrayBuffer = await f.arrayBuffer();
          const pdf = await pdfjs.getDocument(arrayBuffer).promise;
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext("2d")!;
            await page.render({ canvasContext: ctx, viewport, canvas }).promise;
            
            const blob = await new Promise<Blob>((res) => canvas.toBlob(b => res(b!), "image/png"));
            const pageFile = new File([blob], `${f.name.replace(".pdf", "")}-page-${i}.png`, { type: "image/webp" });
            toAdd.push(pageFile);
          }
        } catch (e) {
          console.error("PDF breakdown failed", e);
          toAdd.push(f);
        }
      } else {
        toAdd.push(f);
      }
    }
    addFiles(toAdd);
    setStep("configure");
  };

  const convertFile = async (id: string) => {
    const f = files.find(x => x.id === id);
    if (!f) return;
    setFileStatus(id, "processing", 10);
    try {
      const result = await processImage(f.file, {
        ...settings,
        targetSize: settings.targetSize ? settings.targetSize * 1024 : undefined
      }, (p) => {
        setFileStatus(id, "processing", p);
      });
      setProcessedUrl(id, result.url, result.blob.size);
      
      const savings = f.file.size - result.blob.size;
      if (savings > 0) updateLifetimeStats(savings);
    } catch (err) {
      console.error(err);
      setFileStatus(id, "error");
    }
  };

  const convertAll = async () => {
    setIsProcessingAll(true);
    const batchSize = 3;
    const idleFiles = files.filter(f => f.status !== "completed");
    for (let i = 0; i < idleFiles.length; i += batchSize) {
      const batch = idleFiles.slice(i, i + batchSize);
      await Promise.all(batch.map(f => convertFile(f.id)));
    }
    setStep("result");
    setIsProcessingAll(false);
  };

  const downloadAll = async () => {
    setIsProcessingAll(true);
    try {
      const completed = files.filter(f => f.status === "completed" && f.processedUrl);
      if (completed.length === 0) {
        toast.error("No processed assets to export");
        return;
      }

      const exportFiles = await Promise.all(completed.map(async (f) => {
        const response = await fetch(f.processedUrl!);
        const blob = await response.blob();
        return {
          blob,
          name: `${f.file.name.split(".")[0]}.${settings.format}`
        };
      }));

      await ExportManager.downloadZip(exportFiles, "converted-studio-assets.zip");
    } finally {
      setIsProcessingAll(false);
    }
  };

  const downloadSingle = async (id: string) => {
    const f = files.find(x => x.id === id);
    if (!f || !f.processedUrl) return;
    await ExportManager.downloadFromUrl(
      f.processedUrl, 
      `${f.file.name.split(".")[0]}.${settings.format}`
    );
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

  const totalOriginalSize = files.reduce((acc, f) => acc + f.file.size, 0);
  const totalOutputSize = files.reduce((acc, f) => acc + (f.outputSize || 0), 0);
  const totalSavings = totalOriginalSize > 0 && totalOutputSize > 0 ? totalOriginalSize - totalOutputSize : 0;



  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-background text-foreground overflow-y-auto lg:overflow-hidden selection:bg-primary/30 custom-scrollbar relative">
      <Head>
        <title>Convert Images Online Free, Fast & Private | SafeTools</title>
        <meta name="description" content="Convert JPG, PNG, WEBP, AVIF, HEIC, GIF, SVG, TIFF, BMP and more image formats online for free. Secure browser-based image conversion with no uploads or tracking." />
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
              <AnimatePresence mode="wait">
                {step === "upload" && files.length === 0 ? (
                  <motion.div 
                    key="upload"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="py-12 md:py-24 space-y-12 text-center"
                  >
                    <div className="space-y-6 max-w-6xl mx-auto">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Browser Engine</span>
                        </div>
                        <ArrowRight className="w-3 h-3 opacity-20" />
                        <div className="flex items-center gap-2">
                          <Download className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 italic">Free & Private Converter</span>
                        </div>
                      </div>

                      <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter italic font-heading leading-none">
                        {fromFormat && toFormat 
                          ? `Convert ${fromFormat} to ${toFormat}` 
                          : "Convert Images Online"}
                      </h1>
                      <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-medium max-w-4xl mx-auto italic">
                        {fromFormat && toFormat 
                          ? `The fastest way to convert ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()} directly in your browser. Complete privacy with zero server uploads.`
                          : "Convert images between popular formats instantly. Transform JPG to PNG, WEBP to JPG, HEIC to PNG, AVIF to WEBP and more directly in your browser with complete privacy."
                        }
                      </p>
                    </div>

                    <div className="relative group max-w-5xl mx-auto">
                      <div className="absolute -inset-4 bg-primary/20 blur-[100px] rounded-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                      <div className="relative overflow-hidden rounded-[40px] border border-border/40 group-hover:border-primary/50 transition-all duration-700 shadow-2xl glass-card">
                        <DropZone
                          onFilesDrop={handleFilesDrop}
                          multiple
                          maxSize={1024}
                          title="Drop your images here"
                          description="or click to browse"
                          className="h-80 border-none bg-transparent hover:bg-primary/[0.02] transition-colors"
                        />
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

                    <div className="pt-20 space-y-12">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic font-heading">High-Performance Conversion</h2>
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Advanced Browser Engine</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          { t: "Fast Image Conversion", d: "Convert images in seconds using optimized browser-based processing.", i: Zap },
                          { t: "100% Private Processing", d: "Your images never leave your device. No server uploads or tracking.", i: ShieldCheck },
                          { t: "Supports Modern Formats", d: "Convert between JPG, PNG, WEBP, AVIF, HEIC, GIF and many more formats.", i: ImageIcon },
                          { t: "Batch Image Conversion", d: "Convert multiple images at once to save time.", i: Layers },
                          { t: "High Quality Output", d: "Maintain image clarity and quality during conversion.", i: Sparkles },
                          { t: "Works Everywhere", d: "Compatible with Windows, macOS, Linux, Android and iPhone browsers.", i: Globe }
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
                  </motion.div>
                ) : (
                  <motion.div
                    key="workspace"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 space-y-12"
                  >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-border/50">
                      <div className="flex items-center gap-6">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-12 h-12 rounded-2xl hover:bg-secondary transition-all"
                          onClick={() => { clearFiles(); setStep("upload"); }}
                        >
                          <Undo2 className="w-6 h-6" />
                        </Button>
                        <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Studio Workspace</h2>
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase text-[10px] font-black px-4 py-1 rounded-full tracking-widest">
                              {files.length} Assets
                            </Badge>
                          </div>
                          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40 mt-1 italic">WASM Hardware Acceleration Active</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 pr-6 border-r border-border/50">
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
                          {files.length > 0 && (
                            <Button 
                              variant="ghost" 
                              className="rounded-2xl text-rose-500 hover:bg-rose-500/10 h-11 px-6 text-xs font-black uppercase tracking-widest gap-3 transition-all"
                              onClick={clearFiles}
                            >
                              <Trash2 className="w-4 h-4" /> Clear All
                            </Button>
                          )}
                          <Button className="rounded-2xl bg-secondary/20 text-foreground border border-border/50 h-11 px-6 text-xs font-black uppercase tracking-widest gap-3 hover:bg-secondary/40 hover:scale-105 active:scale-95 transition-all shadow-xl" onClick={() => document.getElementById('append-files')?.click()}>
                            <Plus className="w-4 h-4" /> Add More
                            <input id="append-files" type="file" multiple hidden onChange={(e) => e.target.files && handleFilesDrop(Array.from(e.target.files))} />
                          </Button>
                          {step === "result" && files.some(f => f.status === "completed") && (
                            <Button className="rounded-2xl bg-emerald-500 text-white border border-emerald-400/50 h-11 px-6 text-xs font-black uppercase tracking-widest gap-3 hover:bg-emerald-600 transition-all shadow-xl btn-emerald-glow hover:scale-105 active:scale-95" onClick={downloadAll}>
                              <DownloadCloud className="w-4 h-4" /> Export All
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Global Settings Panel */}
                    <div className="relative group/settings">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/10 to-primary/20 rounded-[2.5rem] blur-xl opacity-50 group-hover/settings:opacity-100 transition-opacity duration-1000" />
                      <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-transparent to-primary/5">
                        <div className="relative flex flex-col gap-8 p-10 rounded-[2.4rem] glass-card border-border/60 shadow-2xl overflow-hidden shadow-primary/5">
                          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                          
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                            <div className="md:col-span-4 space-y-4">
                              <div className="flex items-center gap-3 mb-2">
                                <Settings2 className="w-4 h-4 text-primary" />
                                <Label className="text-sm uppercase font-black tracking-widest text-primary">Output Configuration</Label>
                              </div>
                              <div className="space-y-4">
                                <Label className="text-[11px] uppercase font-black tracking-[0.2em] text-muted-foreground">Target Format</Label>
                                <DropdownMenu>
                                  <DropdownMenuTrigger render={
                                    <Button variant="outline" className="w-full h-14 rounded-2xl bg-secondary/10 border-border/40 px-6 hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden relative shadow-inner">
                                      <div className="flex items-center gap-3 w-full">
                                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                          <HardDrive className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-black uppercase tracking-widest flex-grow text-left">{settings.format?.toUpperCase() || "Select Format"}</span>
                                        <ChevronDown className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                                      </div>
                                    </Button>
                                  } />
                                  <DropdownMenuContent className="w-[min(460px,95vw)] p-0 bg-popover/95 backdrop-blur-xl border-border rounded-[2rem] shadow-2xl overflow-hidden" align="start">
                                    <div className="p-6 border-b border-border bg-secondary/30">
                                      <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                        <Input placeholder="Search Formats..." className="h-12 pl-12 bg-muted/40 border-border rounded-xl text-xs font-black uppercase tracking-widest focus:border-primary/50 transition-all shadow-inner" />
                                      </div>
                                    </div>
                                    <ScrollArea className="h-[400px]">
                                      <div className="p-6 space-y-6">
                                        {Object.entries(CATEGORIZED_FORMATS).map(([cat, fmts]) => (
                                          <div key={cat} className="space-y-4">
                                            <div className="flex items-center gap-3 px-2">
                                              <p className="text-[10px] uppercase font-black tracking-[0.3em] text-primary/60">{cat}</p>
                                              <div className="h-[1px] flex-grow bg-secondary/50" />
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                              {fmts.map(f => (
                                                <button
                                                  key={f}
                                                  className={cn(
                                                    "flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all active:scale-95",
                                                    settings.format === f 
                                                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                                      : "bg-secondary/30 border-border text-muted-foreground hover:bg-secondary hover:border-primary/30 hover:text-foreground"
                                                  )}
                                                  onClick={() => updateSettings({ format: f as any })}
                                                >
                                                  <span className="text-[10px] font-black tracking-widest uppercase">{f}</span>
                                                  {settings.format === f && <CheckCircle2 className="w-3.5 h-3.5" />}
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
                            </div>

                            <div className="md:col-span-4 space-y-4">
                              <div className="flex items-center justify-between">
                                <Label className="text-[11px] uppercase font-black tracking-[0.2em] text-muted-foreground">Fidelity Quality</Label>
                                <span className="text-xs font-black text-primary italic">{settings.quality}%</span>
                              </div>
                              <Slider 
                                value={[settings.quality]} 
                                min={10} max={100} step={1} 
                                onValueChange={(v) => updateSettings({ quality: Array.isArray(v) ? v[0] : v })}
                                className="py-4"
                              />
                            </div>

                            <div className="md:col-span-4 grid grid-cols-2 gap-4">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <Label className="text-[11px] uppercase font-black tracking-[0.2em] text-muted-foreground">Resize (W)</Label>
                                  <Scaling className="w-3.5 h-3.5 text-muted-foreground/40" />
                                </div>
                                <div className="relative group/input">
                                  <Input 
                                    type="number" 
                                    placeholder="Auto" 
                                    value={settings.maxWidth || ""} 
                                    onChange={(e) => updateSettings({ maxWidth: parseInt(e.target.value) || undefined })}
                                    className="h-12 bg-secondary/10 border-border/40 rounded-xl font-black text-xs pr-10 focus:border-primary/50 transition-all"
                                  />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/40">PX</span>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <Label className="text-[11px] uppercase font-black tracking-[0.2em] text-muted-foreground">Resize (H)</Label>
                                  <Scaling className="w-3.5 h-3.5 text-muted-foreground/40 rotate-90" />
                                </div>
                                <div className="relative group/input">
                                  <Input 
                                    type="number" 
                                    placeholder="Auto" 
                                    value={settings.maxHeight || ""} 
                                    onChange={(e) => updateSettings({ maxHeight: parseInt(e.target.value) || undefined })}
                                    className="h-12 bg-secondary/10 border-border/40 rounded-xl font-black text-xs pr-10 focus:border-primary/50 transition-all"
                                  />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/40">PX</span>
                                </div>
                              </div>
                            </div>
                            <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border/40">
                              <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/5 border border-border/40">
                                <div className="flex flex-col">
                                  <Label className="text-[10px] uppercase font-black tracking-widest text-primary">Metadata Purge</Label>
                                  <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Strip EXIF/GPS Data</span>
                                </div>
                                <Switch checked={true} disabled />
                              </div>
                              <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/5 border border-border/40">
                                <div className="flex flex-col">
                                  <Label className="text-[10px] uppercase font-black tracking-widest text-primary">WASM Engine</Label>
                                  <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Hardware Accelerated</span>
                                </div>
                                <div className="w-8 h-4 rounded-full bg-emerald-500/20 flex items-center justify-end px-1 border border-emerald-500/30">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                              </div>
                              <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/5 border border-border/40">
                                <div className="flex flex-col">
                                  <Label className="text-[10px] uppercase font-black tracking-widest text-primary">Target Size</Label>
                                  <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest italic">{settings.targetSize ? `${settings.targetSize} KB Limit` : "Optimized"}</span>
                                </div>
                                <Switch checked={!!settings.targetSize} onCheckedChange={(c) => updateSettings({ targetSize: c ? 500 : undefined })} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Files Display */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 px-6">
                        <Activity className="w-4 h-4 text-primary animate-pulse" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Asset Queue & Live Telemetry</h3>
                      </div>
                      
                      {files.map((f, i) => (
                        <motion.div
                          key={f.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="relative group/file"
                        >
                          <div className={cn(
                            "relative overflow-hidden rounded-[2.5rem] border transition-all duration-700",
                            f.status === "completed" ? "bg-emerald-500/[0.03] border-emerald-500/30 shadow-2xl shadow-emerald-500/5" : "bg-secondary/10 border-border/40 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
                          )}>
                            <div className="flex flex-col md:flex-row items-center p-6 gap-8">
                              <div className="w-48 h-48 rounded-[2rem] overflow-hidden bg-black/20 border border-white/5 shrink-0 relative group/preview">
                                <img src={f.previewUrl} className="w-full h-full object-cover" alt="" />
                                <AnimatePresence>
                                  {f.status === "completed" && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-emerald-500/80 backdrop-blur-md flex flex-col items-center justify-center text-white">
                                      <CheckCircle2 className="w-10 h-10 mb-2" />
                                      <span className="text-[10px] font-black uppercase tracking-widest">Converted</span>
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

                              <div className="flex-grow min-w-0 space-y-6 text-center md:text-left">
                                <div className="space-y-2">
                                  <h4 className="text-xl md:text-3xl font-black tracking-tighter truncate pr-10 italic uppercase font-heading">{f.file.name}</h4>
                                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40">In:</span>
                                      <span className="text-[10px] font-black text-white/80">{(f.file.size / 1024).toFixed(1)} KB</span>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-muted-foreground/20" />
                                    <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                                      <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Out:</span>
                                      <span className="text-[10px] font-black text-primary">{settings.format?.toUpperCase()}</span>
                                    </div>
                                    {f.status === "completed" && f.outputSize && (
                                      <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                                        <Percent className="w-3 h-3 text-emerald-500" />
                                        <span className="text-[10px] font-black text-emerald-500">
                                          {Math.max(0, ((f.file.size - f.outputSize) / f.file.size * 100)).toFixed(0)}% Smaller
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 shrink-0">
                                {f.status === "completed" ? (
                                  <div className="flex items-center gap-3">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="w-14 h-14 rounded-2xl border-blue-500/40 bg-blue-500/10 text-blue-500 hover:text-blue-400 hover:border-blue-500/60 transition-all group/copy"
                                      onClick={() => copyToClipboard(f.processedUrl!)}
                                    >
                                      <FileStack className="w-6 h-6 group-hover/copy:scale-110 transition-transform" />
                                    </Button>
                                    <Button
                                      className="h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[11px] px-8 gap-3 shadow-xl active:scale-95 transition-all group/dl"
                                      onClick={() => downloadSingle(f.id)}
                                    >
                                      Download <Download className="w-5 h-5 group-hover/dl:translate-y-0.5 transition-transform" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    className={cn(
                                      "h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] px-10 gap-3 transition-all relative overflow-hidden group/opt hover:scale-105 active:scale-95",
                                      f.status === "idle" ? "bg-sky-500 text-white shadow-xl btn-sky-glow border-sky-400/50" : "bg-white/5 text-white/20 cursor-not-allowed border-white/5"
                                    )}
                                    onClick={() => convertFile(f.id)}
                                    disabled={f.status === "processing" || isProcessingAll}
                                  >
                                    {f.status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Convert <Zap className="w-5 h-5 group-hover/opt:scale-125 transition-transform" /></>}
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
                    </div>

                    {step !== "processing" && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center pt-12">
                        <Button 
                          className="h-24 rounded-[3rem] bg-gradient-to-r from-primary via-blue-600 to-primary background-animate text-primary-foreground font-black uppercase tracking-widest text-2xl px-24 gap-8 shadow-2xl btn-primary-glow group relative overflow-hidden active:scale-95 transition-all animate-glow border-t border-white/20"
                          onClick={convertAll}
                          disabled={isProcessingAll || files.every(f => f.status === "completed")}
                        >
                          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                          <div className="flex items-center gap-6 relative z-10">
                            <Zap className="w-10 h-10 group-hover:rotate-12 group-hover:scale-125 transition-all drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                            <span className="tracking-tighter">Convert All Now</span>
                          </div>
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* SEO Content & Modules */}
              <div className="mt-40 space-y-12 pb-24">
                <div className="flex flex-col items-center text-center space-y-4">
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic font-heading">Supported Image Formats</h2>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic">Universal Format Compatibility</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-10 rounded-[48px] glass-card border border-border space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary italic">Input Formats</h4>
                    <div className="flex flex-wrap gap-2">
                      {["JPG", "JPEG", "PNG", "WEBP", "AVIF", "HEIC", "GIF", "SVG", "TIFF", "BMP", "ICO"].map(f => (
                        <span key={f} className="px-4 py-2 rounded-xl bg-secondary/20 text-[10px] font-bold tracking-widest">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-10 rounded-[48px] glass-card border border-border space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 italic">Output Formats</h4>
                    <div className="flex flex-wrap gap-2">
                      {["JPG", "PNG", "WEBP", "AVIF", "BMP"].map(f => (
                        <span key={f} className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-widest border border-emerald-500/20">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
                  <div className="space-y-6">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Free Online Image Converter</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      SafeTools lets you convert images directly in your browser without uploading files to external servers. Fast, secure and privacy-focused image conversion for all users.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Optimized for Web & Social</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Easily optimize and convert images for websites, blogs, mobile apps, Instagram, LinkedIn, WhatsApp, online stores and presentations.
                    </p>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Browser-Based Precision</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      No software installation required. Convert images online instantly using your browser on desktop or mobile devices. Everything runs locally on your device.
                    </p>
                  </div>
                </div>

                {/* SEO Conversion Matrix / Sitemap */}
                <div className="pt-24 border-t border-border/40">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <FileStack className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tighter italic">Popular Image Conversions</h2>
                      <p className="text-sm text-muted-foreground font-medium italic">Handled 100% locally in your browser</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-6">
                    {["png-to-webp", "jpg-to-png", "webp-to-jpg", "heic-to-png", "avif-to-webp", "pdf-to-png", "svg-to-png", "tiff-to-pdf", "raw-to-jpg", "png-to-ico", "jpg-to-pdf", "png-to-svg"].map((slug) => (
                      <Link 
                        key={slug} 
                        href={`/image/convert/${slug}`}
                        className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                        {slug.replace(/-/g, " ")}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-12 p-8 rounded-3xl bg-secondary/10 border border-border/40 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                      <h3 className="text-lg font-black uppercase tracking-tighter italic">Need 150+ other formats?</h3>
                      <p className="text-xs text-muted-foreground font-medium italic">Our browser engine supports professional, camera RAW, and design formats automatically.</p>
                    </div>
                    <Button variant="outline" className="rounded-2xl border-border/60 font-black uppercase tracking-widest text-xs h-12 px-8" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                      Start Free Conversion
                    </Button>
                  </div>
                </div>

                <div className="pt-24 border-t border-border/40">
                  <FAQ
                    items={[
                      { question: "Is the image converter private?", answer: "Yes. All image conversion happens locally in your browser. Your files are never uploaded." },
                      { question: "Which formats are supported?", answer: "SafeTools supports JPG, JPEG, PNG, WEBP, AVIF, HEIC, GIF, SVG, TIFF, BMP, ICO and more." },
                      { question: "Can I convert multiple images at once?", answer: "Yes. Batch conversion is fully supported." },
                      { question: "Will image quality decrease?", answer: "You can control output quality settings to balance quality and file size." },
                      { question: "Is SafeTools free?", answer: "Yes. The image converter is completely free to use." }
                    ]}
                    title="Image Conversion FAQ"
                    description="Everything you need to know about transforming your images securely."
                  />
                </div>

                <RelatedTools 
                  title="Expand Your Creative Workflow"
                  tools={[
                    { name: "Image Compressor", href: "/image/compress" },
                    { name: "Background Remover", href: "/image/remove-bg" },
                    { name: "PDF to Image", href: "/pdf/to-image" },
                    { name: "Image Steganography", href: "/security/steganography" }
                  ]}
                  className="pt-24 border-t border-border/40"
                />

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
        name="Image Format Converter"
        description="Convert 150+ image formats locally in your browser. Supports HEIC, WebP, AVIF, RAW, and more. 100% private."
        url="https://safetools.space/image/convert"
        faqItems={IMAGE_CONVERTER_FAQ}
      />
    </div>
  );
}

const STUDIO_STYLES = `
  @keyframes background-animate {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .background-animate {
    background-size: 200% 200%;
    animation: background-animate 3s linear infinite;
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.2); }
    50% { box-shadow: 0 0 40px rgba(var(--primary-rgb), 0.4); }
  }
  .animate-glow {
    animation: glow 4s ease-in-out infinite;
  }
  .btn-primary-glow {
    box-shadow: 0 10px 30px -10px hsl(var(--primary) / 0.5);
  }
  .btn-primary-glow:hover {
    box-shadow: 0 20px 40px -10px hsl(var(--primary) / 0.7);
  }
  .btn-emerald-glow {
    box-shadow: 0 10px 30px -10px rgb(16 185 129 / 0.5);
  }
  .btn-emerald-glow:hover {
    box-shadow: 0 20px 40px -10px rgb(16 185 129 / 0.7);
  }
  .btn-sky-glow {
    box-shadow: 0 10px 30px -10px rgb(14 165 233 / 0.5);
  }
  .btn-sky-glow:hover {
    box-shadow: 0 20px 40px -10px rgb(14 165 233 / 0.7);
  }
`;
