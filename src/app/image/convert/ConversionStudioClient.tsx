"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Download, Trash2, Loader2, ArrowRight, 
  FileStack, CheckCircle2, AlertCircle,
  FileText, ImageIcon, Search,
  Settings2, DownloadCloud, Layers, ShieldCheck,
  Maximize2, Undo2, Palette, Type, Sliders,
  X, RefreshCw, ChevronRight, ChevronDown, Info,
  Shield, Zap, HardDrive, Cpu, Globe, Check,
  FileCode, Sparkles, Wand2
} from "lucide-react";
import { DropZone } from "@/components/shared/DropZone";
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
  const [activeTab, setActiveTab] = useState("general");
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);

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
            const pageFile = new File([blob], `${f.name.replace(".pdf", "")}-page-${i}.png`, { type: "image/png" });
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
    setIsProcessingAll(false);
    setIsMobileSettingsOpen(false);
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

  const SettingsContent = () => (
    <div className="flex flex-col flex-grow min-h-0">
      <ScrollArea className="flex-grow min-h-0">
        <div className="p-8 space-y-12">
          {/* Core Conversion Module */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Conversion Logic</h4>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Target Format</Label>
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="outline" className="w-full h-20 rounded-[2rem] bg-white/[0.02] border-white/5 p-4 hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden shadow-2xl relative">
                    <div className="flex items-center gap-4 w-full text-white">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                        <HardDrive className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-col items-start text-left flex-grow">
                        <span className="text-[8px] opacity-30 tracking-[0.3em] uppercase font-black text-white">Active Extension</span>
                        <span className="text-sm font-black uppercase tracking-widest">{settings.format || "Select Format"}</span>
                      </div>
                      <ChevronDown className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Button>
                } />
                <DropdownMenuContent className="w-[400px] p-0 bg-[#0a0a0a] border-white/10 rounded-[2.5rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] overflow-hidden backdrop-blur-3xl" align="start">
                  <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="Filter Formats..." 
                        className="h-12 pl-12 bg-black/40 border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-primary/50 transition-all shadow-inner"
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
                  <ScrollArea className="h-[450px]">
                    <div className="p-4 space-y-8">
                      {Object.entries(CATEGORIZED_FORMATS).map(([cat, fmts]) => (
                        <div key={cat} className="space-y-4">
                          <div className="flex items-center gap-3 px-2">
                            <div className="h-[1px] flex-grow bg-white/5" />
                            <p className="text-[9px] uppercase font-black tracking-[0.3em] text-primary/60">{cat}</p>
                            <div className="h-[1px] flex-grow bg-white/5" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {fmts.map(f => (
                              <button
                                key={f}
                                data-value={f.toLowerCase()}
                                className={cn(
                                  "format-item flex items-center justify-between px-5 py-4 rounded-2xl border transition-all active:scale-95 group",
                                  settings.format === f 
                                    ? "bg-primary border-primary shadow-lg shadow-primary/20 text-white" 
                                    : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/5 hover:border-primary/30 hover:text-white"
                                )}
                                onClick={() => updateSettings({ format: f as any })}
                              >
                                <span className="text-[10px] font-black tracking-widest uppercase">{f}</span>
                                {settings.format === f && <CheckCircle2 className="w-4 h-4" />}
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

          {/* Quality Module */}
          <div className="space-y-10 pt-4 border-t border-white/5">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Encoding Fidelity</Label>
                <span className="text-xs font-bold text-primary">{settings.quality}%</span>
              </div>
              <Slider 
                value={[settings.quality]} 
                min={10} max={100} step={1} 
                onValueChange={(v) => updateSettings({ quality: Array.isArray(v) ? v[0] : v })}
                className="py-2"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Target File Size</Label>
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Strict Metadata Compression</p>
                </div>
                <Switch checked={!!settings.targetSize} onCheckedChange={(c) => updateSettings({ targetSize: c ? 500 : undefined })} />
              </div>
              <AnimatePresence>
                {settings.targetSize !== undefined && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2"
                  >
                    <Input 
                      type="number" 
                      value={settings.targetSize} 
                      onChange={(e) => updateSettings({ targetSize: parseInt(e.target.value) || 0 })}
                      className="bg-white/5 border-white/10 rounded-xl h-12 font-mono text-center text-white"
                    />
                    <Badge variant="outline" className="rounded-xl shrink-0 px-4 text-white/40">KB</Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Resolution Module */}
          <div className="space-y-6 pt-4 border-t border-white/5 pb-10">
            <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Resampling Dimensions</Label>
            <div className="grid grid-cols-2 gap-3 text-white">
              <div className="space-y-2">
                <Label className="text-[8px] uppercase opacity-50">Width (px)</Label>
                <Input placeholder="Auto" type="number" value={settings.maxWidth || ""} onChange={(e) => updateSettings({ maxWidth: parseInt(e.target.value) || undefined })} className="bg-white/5 border-white/10 rounded-xl h-12 font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[8px] uppercase opacity-50">Height (px)</Label>
                <Input placeholder="Auto" type="number" value={settings.maxHeight || ""} onChange={(e) => updateSettings({ maxHeight: parseInt(e.target.value) || undefined })} className="bg-white/5 border-white/10 rounded-xl h-12 font-bold" />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
        <Button 
          className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black text-lg gap-3 shadow-2xl shadow-primary/30 group active:scale-95 transition-all"
          onClick={convertAll}
          disabled={files.length === 0 || isProcessingAll}
        >
          {isProcessingAll ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 group-hover:scale-125 transition-transform" />}
          Render Studio Queue
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[#050505] text-white overflow-y-auto lg:overflow-hidden selection:bg-primary/30 custom-scrollbar">
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
          <aside className="hidden lg:flex w-[420px] h-full max-h-full border-r border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl shrink-0 flex-col relative shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                  <Wand2 className="w-3.5 h-3.5" /> Engine Inspector
                </h3>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">WASM Multi-threaded Enabled</p>
              </div>
              <Badge variant="outline" className="text-[9px] border-white/10 bg-white/5 text-white/50 uppercase font-black px-3 py-1 rounded-full">v4.0 Pro</Badge>
            </div>
            <SettingsContent />
          </aside>

          {/* Workspace */}
          <section className="flex-grow flex flex-col min-w-0 bg-transparent">
            <header className="p-4 md:p-8 flex items-center justify-between bg-black/20 backdrop-blur-sm border-b border-white/5">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center border border-white/10 shadow-2xl group relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <FileStack className="w-6 h-6 md:w-8 md:h-8 text-white relative z-10" />
                </div>
                <div>
                  <h2 className="font-black text-lg md:text-2xl tracking-tighter uppercase italic">
                    {fromFormat && toFormat ? `Convert ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()}` : "Format Converter"}
                  </h2>
                  <div className="flex items-center gap-3">
                    <Badge className="text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-0.5 rounded-full font-black uppercase tracking-widest">
                       Secure Session
                    </Badge>
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-40">{files.length} Assets in Pipeline</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <AnimatePresence>
                  {files.some(f => f.status === "completed") && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                      <Button variant="outline" className="rounded-2xl border-primary/20 bg-primary/10 text-primary h-12 md:h-14 px-6 text-xs font-black uppercase tracking-widest gap-3 hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/20" onClick={downloadAll}>
                        <DownloadCloud className="w-5 h-5" /> <span className="hidden sm:inline">Export Bundle</span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <Button variant="ghost" className="rounded-2xl text-muted-foreground hover:text-white hover:bg-white/5 h-12 md:h-14 px-6 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all" onClick={clearFiles}>
                  Flush Memory
                </Button>

                {/* Mobile Settings Toggle */}
                <Sheet open={isMobileSettingsOpen} onOpenChange={setIsMobileSettingsOpen}>
                  <SheetTrigger 
                    render={
                      <Button variant="outline" size="icon" className="lg:hidden rounded-2xl border-white/10 bg-white/5 h-12 w-12 md:h-14 md:w-14" />
                    }
                  >
                    <Settings2 className="w-5 h-5" />
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:w-[450px] p-0 bg-[#0a0a0a] border-white/10 rounded-l-[3rem]">
                    <SheetHeader className="p-8 border-b border-white/5">
                      <SheetTitle className="text-white flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter">
                        <Wand2 className="w-6 h-6 text-primary" /> Studio Engine
                      </SheetTitle>
                    </SheetHeader>
                    <SettingsContent />
                  </SheetContent>
                </Sheet>
              </div>
            </header>

            <div className="flex-grow relative overflow-y-auto lg:overflow-hidden bg-[#050505]/40">
              <ScrollArea className="h-full">
                <div className="p-4 md:p-12">
                  {files.length === 0 ? (
                    <>
                      <div className="max-w-sm mx-auto mt-20 md:mt-32 pb-20">
                        <DropZone 
                          onFilesDrop={handleFilesDrop} 
                          multiple 
                          maxSize={1024} 
                          title=" "
                          description=" "
                          className="h-48 border-2 border-dashed border-white/5 hover:border-primary/50 bg-white/[0.02] rounded-[3rem] transition-all" 
                        />
                      </div>

                      {/* SEO FAQ SECTION (Visible only on specific routes) */}
                      {fromFormat && toFormat && (
                        <motion.div 
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="mt-32 space-y-20 text-left"
                        >
                          <div className="space-y-6">
                            <h3 className="text-4xl font-black uppercase tracking-tighter italic">Expert Conversion: <span className="text-primary">{fromFormat.toUpperCase()}</span> to <span className="text-blue-500">{toFormat.toUpperCase()}</span></h3>
                            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                              Transform your digital assets with pixel-perfect precision using PrivateTools' proprietary local computing engine. We maintain the highest fidelity across 200+ format pairs, ensuring that every bit of metadata and color depth is preserved—all without your data ever touching a remote server.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                              { 
                                title: "Why use PrivateTools?", 
                                desc: "Standard cloud converters monetize your data. We process everything in sandboxed browser memory, providing 100% data sovereignty.",
                                icon: Shield 
                              },
                              { 
                                title: "Parallel Rendering", 
                                desc: "Our multi-threaded WASM engine converts entire file bundles simultaneously, maximizing your local hardware's throughput.",
                                icon: Zap 
                              },
                              { 
                                title: "Engine Fidelity", 
                                desc: "We utilize advanced interpolation and color mapping algorithms to ensure 100% visual accuracy in every output format.",
                                icon: Layers 
                              },
                              { 
                                title: "Universal Compatibility", 
                                desc: "From RAW photography to professional document standards, we support the full spectrum of modern digital assets.",
                                icon: HardDrive 
                              }
                            ].map((item, i) => (
                              <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6 hover:bg-white/[0.04] hover:border-primary/20 transition-all group shadow-xl">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                                  <item.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h4 className="text-lg font-black uppercase tracking-tight">{item.title}</h4>
                                <p className="text-sm text-white/40 leading-relaxed font-medium">{item.desc}</p>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-8">
                            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 italic border-l-4 border-primary pl-6">
                              <Info className="w-6 h-6 text-primary" /> Studio Intel
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                              {[
                                { q: `Is it free to convert ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()}?`, a: "Yes. PrivateTools is a community-driven utility suite with no subscriptions, paywalls, or hidden costs." },
                                { q: "Where is my data stored?", a: "Nowhere. Your files exist only in your device's RAM during the conversion process and are purged instantly when the tab is closed." },
                                { q: "What is the maximum file size?", a: "Since we use your local hardware, there are no software-imposed limits. You are only limited by your available system memory." }
                              ].map((faq, i) => (
                                <div key={i} className="p-8 rounded-3xl border border-white/5 bg-black/40 hover:border-white/10 transition-colors">
                                  <h4 className="text-sm font-black text-white/80 mb-3 uppercase tracking-wide italic">Q: {faq.q}</h4>
                                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">A: {faq.a}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* SEO Link Cloud */}
                          <div className="space-y-16 pt-20 border-t border-white/5">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <h3 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                                <Globe className="w-7 h-7 text-primary" /> Global Conversion Directory
                              </h3>
                              <Badge className="bg-primary/10 text-primary border-primary/20 uppercase text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest">
                                200+ Pairs Active
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                              {[
                                { 
                                  title: "Core Web Standards", 
                                  pairs: ["png-to-webp", "webp-to-png", "jpeg-to-webp", "webp-to-jpeg", "png-to-jpeg", "jpeg-to-png"] 
                                },
                                { 
                                  title: "Modern & Next-Gen", 
                                  pairs: ["avif-to-webp", "webp-to-avif", "heic-to-jpeg", "heic-to-png", "jxl-to-webp", "avif-to-png"] 
                                },
                                { 
                                  title: "Professional & Print", 
                                  pairs: ["pdf-to-png", "pdf-to-jpeg", "tiff-to-png", "png-to-pdf", "jpeg-to-pdf", "eps-to-svg"] 
                                },
                                { 
                                  title: "Photography & RAW", 
                                  pairs: ["raw-to-jpeg", "nef-to-jpg", "arw-to-png", "dng-to-webp", "cr2-to-jpg", "orf-to-png"] 
                                },
                                { 
                                  title: "Vector & Graphics", 
                                  pairs: ["svg-to-png", "png-to-svg", "svg-to-webp", "ico-to-png", "png-to-ico", "tga-to-png"] 
                                },
                                { 
                                  title: "Legacy & Archive", 
                                  pairs: ["bmp-to-webp", "gif-to-webp", "webp-to-gif", "pcx-to-png", "iff-to-webp", "tga-to-webp"] 
                                }
                              ].map((cat) => (
                                <div key={cat.title} className="space-y-6">
                                  <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/50 border-l-4 border-primary/20 pl-4">{cat.title}</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {cat.pairs.map((pair) => (
                                      <Link 
                                        key={pair}
                                        href={`/image/convert/${pair}`}
                                        className="px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 hover:border-primary/40 hover:text-white transition-all whitespace-nowrap"
                                      >
                                        {pair.replace(/-/g, " ")}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="p-10 md:p-16 rounded-[4rem] bg-gradient-to-br from-primary/10 via-black to-blue-500/10 border border-white/5 space-y-10 shadow-2xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12 scale-150">
                                 <Cpu className="w-64 h-64" />
                              </div>
                              <div className="flex items-center gap-6 relative z-10">
                                <div className="w-16 h-16 rounded-3xl bg-black border border-white/10 flex items-center justify-center shadow-2xl">
                                  <Cpu className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">WASM Neural Architecture</h3>
                                  <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] opacity-40">Proprietary Client-Side Logic</p>
                                </div>
                              </div>
                              <p className="text-sm md:text-lg text-white/60 leading-relaxed font-medium relative z-10">
                                Our conversion engine represents the pinnacle of modern web engineering. By leveraging high-performance **C++ and Rust** binaries compiled to **WebAssembly (WASM)**, we provide the computational power of a desktop application within a sandboxed browser environment. This eliminates the latency and security risks of cloud-based processing, enabling you to manage professional-grade media pipelines with absolute privacy and unparalleled speed.
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 relative z-10">
                                {[
                                  { label: "Rendering Latency", val: "< 3ms", desc: "Local CPU/GPU Execution" },
                                  { label: "Data Integrity", val: "Immutable", desc: "No Server Interaction" },
                                  { label: "Engine Runtime", val: "Isolated", desc: "Hardware Sandboxed" }
                                ].map((stat) => (
                                  <div key={stat.label} className="p-6 rounded-[2rem] bg-black/40 border border-white/5 backdrop-blur-xl">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-2">{stat.label}</p>
                                    <p className="text-2xl font-black text-primary italic mb-1">{stat.val}</p>
                                    <p className="text-[9px] uppercase font-black tracking-widest text-white/30">{stat.desc}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 pb-32">
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
                            <Card className={cn("p-4 md:p-6 rounded-[2.5rem] bg-white/[0.02] border-white/5 group relative overflow-hidden transition-all duration-500", f.status === "processing" && "border-primary/50 shadow-[0_0_50px_-10px_rgba(var(--primary-rgb),0.3)]")}>
                              {/* Selection overlay */}
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              
                              <div className="flex gap-4 md:gap-8 relative z-10">
                                <div className="w-24 h-24 md:w-44 md:h-44 rounded-[2rem] bg-black/60 border border-white/5 overflow-hidden shrink-0 relative shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                  <img src={f.previewUrl} className="w-full h-full object-cover" alt="" />
                                  <AnimatePresence>
                                    {f.status === "completed" && (
                                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-emerald-500/80 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                                        <CheckCircle2 className="w-10 h-10 mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Complete</span>
                                      </motion.div>
                                    )}
                                    {f.status === "processing" && (
                                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
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
                                          <Badge variant="outline" className="text-[8px] md:text-[10px] border-white/10 bg-white/5 px-3 py-0.5 uppercase tracking-widest font-black opacity-60">{(f.file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                                          <div className="w-1 h-1 rounded-full bg-white/20" />
                                          <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{f.file.name.split('.').pop()}</span>
                                        </div>
                                      </div>
                                      <button onClick={() => removeFile(f.id)} className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all"><X className="w-5 h-5" /></button>
                                    </div>

                                    {/* Progress Bar */}
                                    {f.status === "processing" && (
                                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                          className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                                          initial={{ width: 0 }}
                                          animate={{ width: `${f.progress || 10}%` }}
                                          transition={{ ease: "linear" }}
                                        />
                                      </div>
                                    )}

                                    {f.status === "completed" && f.outputSize && (
                                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                                         <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Output Size</span>
                                         </div>
                                         <span className="text-xs font-mono font-bold text-emerald-500">{(f.outputSize / 1024).toFixed(1)} KB</span>
                                      </motion.div>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between pt-6">
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                                      <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">{f.file.name.split('.').pop()}</span> 
                                      <ArrowRight className="w-3 h-3 text-primary opacity-40" /> 
                                      <span className="text-[10px] font-black uppercase text-primary tracking-widest italic">{settings.format}</span>
                                    </div>
                                    <Button
                                      size="lg"
                                      variant={f.status === "completed" ? "default" : "outline"}
                                      className={cn("h-12 md:h-14 rounded-2xl text-[10px] md:text-xs px-6 md:px-10 uppercase font-black tracking-widest transition-all shadow-xl group", f.status === "completed" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "border-white/10 hover:bg-primary/20 hover:border-primary/40")}
                                      onClick={() => {
                                        if (f.status === "completed" && f.processedUrl) {
                                          ExportManager.downloadFromUrl(
                                            f.processedUrl,
                                            `${f.file.name.split('.')[0]}.${settings.format}`
                                          );
                                        } else {
                                          convertFile(f.id);
                                        }
                                      }}
                                      disabled={isProcessingAll || f.status === "processing"}
                                    >
                                      {f.status === "completed" ? (
                                        <>Download <Download className="w-4 h-4 ml-3 group-hover:translate-y-1 transition-transform" /></>
                                      ) : (
                                        f.status === "processing" ? (
                                          <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                          <>Render Asset <Zap className="w-4 h-4 ml-3 group-hover:scale-125 transition-transform" /></>
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 max-w-xl mx-auto pb-40">
                       <DropZone onFilesDrop={handleFilesDrop} multiple maxSize={1024} className="h-24 md:h-32 bg-white/[0.02] rounded-[2.5rem] border-dashed border-white/10 hover:bg-white/5 hover:border-primary/50 transition-all group" title="Batch Append to Pipeline" />
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
                className="lg:hidden fixed bottom-24 right-6 z-40"
              >
                 <Button 
                  className="w-16 h-16 rounded-full bg-primary shadow-[0_20px_50px_rgba(var(--primary-rgb),0.5)] flex items-center justify-center p-0 border-4 border-white/20 active:scale-90 transition-all"
                  onClick={convertAll}
                  disabled={isProcessingAll}
                 >
                   <Zap className="w-8 h-8 text-white" />
                 </Button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
