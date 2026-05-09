"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Presentation, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Loader2,
  Zap,
  Plus,
  MoveUp,
  MoveDown,
  Layout,
  FileStack,
  Settings2,
  Monitor,
  Eye,
  RefreshCw,
  X,
  FileText,
  Save,
  DownloadCloud,
  ChevronUp,
  ChevronDown,
  Play,
  Smartphone,
  Layers,
  Cpu,
  Info,
  ShieldCheck,
  MousePointer2,
  Globe,
  Star,
  HelpCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import pptxgen from "pptxgenjs";
import { toast } from "sonner";

interface PPTXFile {
  id: string;
  file: File;
  previewUrl: string;
}

const SUPPORTED_FORMATS = [
  "JPG", "JPEG", "PNG", "WEBP", "SVG", "BMP", "GIF", "TIFF", "TIF", "ICO", "HEIC", "AVIF", "PSD", "RAW"
];

export default function ImageToPptxClient() {
  const [files, setFiles] = useState<PPTXFile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [title, setTitle] = useState("Pro Presentation");

  const currentFile = files.find(f => f.id === selectedId) || files[0];

  useEffect(() => {
    if (files.length > 0 && !selectedId) {
      setSelectedId(files[0].id);
    }
  }, [files, selectedId]);

  const processFile = async (file: File): Promise<{ file: File; previewUrl: string }> => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    // Handle HEIC
    if (extension === 'heic' || extension === 'heif') {
      try {
        const heic2any = (await import("heic2any")).default;
        const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
        const convertedFile = new File(
          [Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob], 
          file.name.replace(/\.(heic|heif)$/i, '.jpg'), 
          { type: 'image/jpeg' }
        );
        return { file: convertedFile, previewUrl: URL.createObjectURL(convertedFile) };
      } catch (e) {
        console.error("HEIC conversion failed", e);
      }
    }
    
    // Handle TIFF
    if (extension === 'tif' || extension === 'tiff') {
      try {
        const UTIF = (await import("utif")).default;
        const buffer = await file.arrayBuffer();
        const ifds = UTIF.decode(buffer);
        UTIF.decodeImage(buffer, ifds[0]);
        const rgba = UTIF.toRGBA8(ifds[0]);
        
        const canvas = document.createElement('canvas');
        canvas.width = ifds[0].width;
        canvas.height = ifds[0].height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const imgData = ctx.createImageData(canvas.width, canvas.height);
          imgData.data.set(rgba);
          ctx.putImageData(imgData, 0, 0);
          const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg'));
          if (blob) {
            const convertedFile = new File([blob], file.name.replace(/\.(tif|tiff)$/i, '.jpg'), { type: 'image/jpeg' });
            return { file: convertedFile, previewUrl: URL.createObjectURL(convertedFile) };
          }
        }
      } catch (e) {
        console.error("TIFF conversion failed", e);
      }
    }

    // Default for standard images
    return { file, previewUrl: URL.createObjectURL(file) };
  };

  const handleFilesDrop = async (newFiles: File[]) => {
    setIsProcessing(true);
    const toastId = toast.loading(`Processing ${newFiles.length} files...`);
    
    try {
      const processed = await Promise.all(newFiles.map(f => processFile(f)));
      const finalFiles = processed.map(p => ({
        id: Math.random().toString(36).substring(7),
        file: p.file,
        previewUrl: p.previewUrl,
      }));

      setFiles(prev => [...prev, ...finalFiles]);
      toast.success(`${newFiles.length} slides added`, { id: toastId });
    } catch (e) {
      toast.error("Failed to process some files", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) URL.revokeObjectURL(file.previewUrl);
      const filtered = prev.filter(f => f.id !== id);
      if (selectedId === id) setSelectedId(filtered[0]?.id || null);
      return filtered;
    });
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newFiles.length) return;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const createPPTX = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const pres = new pptxgen();
      pres.title = title;
      
      for (const f of files) {
        const slide = pres.addSlide();
        
        // Convert file to base64 for pptxgenjs
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(f.file);
        });

        slide.addImage({
          data: base64,
          x: 0, y: 0, w: "100%", h: "100%",
          sizing: { type: "contain", w: 10, h: 5.625 }
        });
      }
      
      await pres.writeFile({ fileName: `${title.replace(/\s+/g, '_')}.pptx` });
      toast.success("Presentation exported successfully");
    } catch (e) {
      console.error(e);
      toast.error("Export failed. Ensure all images are valid.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-orange-500/30">
      <Navbar />
      
      <main className={cn(
        "flex-grow flex flex-col relative",
        files.length > 0 ? "lg:flex-row h-[calc(100vh-64px)] overflow-hidden" : "overflow-y-auto"
      )}>
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-600/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-600/10 blur-[160px] rounded-full animate-pulse" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--color-primary-rgb),0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        {files.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center relative z-10">
            {/* Hero Section */}
            <div className="max-w-5xl w-full px-6 py-20 space-y-12 text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-[1px] mx-auto shadow-2xl shadow-orange-500/20">
                  <div className="w-full h-full rounded-[calc(1rem-1px)] bg-card flex items-center justify-center border border-border">
                    <Presentation className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                    Image to <span className="text-orange-500">PPTX.</span>
                  </h1>
                  <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                    Turn your images into professional PowerPoint presentations instantly. Fast, secure, and 100% private.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <DropZone 
                  onFilesDrop={handleFilesDrop} 
                  accept="image/*" 
                  multiple={true} 
                  className="h-80 border-dashed border-border bg-secondary/30 backdrop-blur-xl rounded-3xl hover:bg-secondary/50 transition-all shadow-2xl group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Plus className="w-8 h-8 text-orange-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-black uppercase tracking-widest italic">Drop Images Here</p>
                      <p className="text-xs text-muted-foreground/60 font-bold uppercase tracking-widest">Supports JPG, PNG, WEBP, SVG, TIFF & More</p>
                    </div>
                  </div>
                </DropZone>
              </motion.div>

              {/* Trusted By / Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Privacy-First", icon: ShieldCheck },
                  { label: "No Uploads", icon: Globe },
                  { label: "Instant Export", icon: Zap },
                  { label: "Zero Watermark", icon: Star }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-secondary/20 border border-border flex flex-col items-center gap-2">
                    <item.icon className="w-5 h-5 text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full bg-secondary/10 border-y border-border backdrop-blur-3xl">
              <div className="max-w-5xl mx-auto px-6 py-24 space-y-24">
                
                {/* Features Grid */}
                <section className="space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Key Features</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Why professionals choose SafeTools</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { 
                        title: "Instant Conversion", 
                        desc: "Create fully compatible PPTX presentation files from single or multiple images in seconds.",
                        icon: Zap
                      },
                      { 
                        title: "Privacy-First", 
                        desc: "Your files stay on your device. Images are processed locally in your browser without uploading.",
                        icon: ShieldCheck
                      },
                      { 
                        title: "Batch Processing", 
                        desc: "Upload multiple images and automatically generate multi-slide PowerPoint presentations.",
                        icon: Layers
                      },
                      { 
                        title: "High Quality", 
                        desc: "Maintain image clarity, resolution, and colors during PPTX generation.",
                        icon: Monitor
                      },
                      { 
                        title: "Cross-Device", 
                        desc: "Works on Windows, macOS, Linux, Android, and iOS directly in your browser.",
                        icon: Smartphone
                      },
                      { 
                        title: "No Watermarks", 
                        desc: "Generated presentations are clean, professional, and ready for use.",
                        icon: CheckCircle2
                      }
                    ].map((feature, i) => (
                      <Card key={i} className="p-8 rounded-3xl bg-background/50 border-border hover:border-orange-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <feature.icon className="w-6 h-6 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-black uppercase italic mb-3 tracking-tight">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Supported Formats */}
                <section className="p-12 rounded-[3rem] bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/10 space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-orange-500">Supported Formats</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Convert almost any image format</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {SUPPORTED_FORMATS.map((ext) => (
                      <Badge key={ext} className="px-6 py-2 rounded-full bg-background border-border text-[11px] font-black tracking-widest uppercase hover:text-orange-500 transition-colors">
                        .{ext}
                      </Badge>
                    ))}
                  </div>
                </section>

                {/* Use Cases */}
                <section className="space-y-12">
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-grow space-y-6">
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter">Common Use Cases</h2>
                      <div className="space-y-4">
                        {[
                          { title: "Education", desc: "Convert lecture notes, scanned pages, and diagrams into classroom slides." },
                          { title: "Business", desc: "Create reports, analytics decks, and product showcases from screenshots." },
                          { title: "Designers", desc: "Transform portfolios and mockups into client-ready presentations." },
                          { title: "Marketing", desc: "Turn campaign creatives and banners into editable pitch decks." }
                        ].map((use, i) => (
                          <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-secondary/30 transition-colors group">
                            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 group-hover:bg-orange-500 text-orange-500 group-hover:text-white transition-all">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-black uppercase text-sm italic">{use.title}</h4>
                              <p className="text-sm text-muted-foreground">{use.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-full md:w-[400px] aspect-square rounded-[3rem] bg-secondary/30 border border-border flex items-center justify-center p-12 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-orange-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Presentation className="w-32 h-32 text-orange-500/20 group-hover:text-orange-500/40 transition-all group-hover:scale-110" />
                    </div>
                  </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-12 max-w-3xl mx-auto">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Everything you need to know</p>
                  </div>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {[
                      { q: "Is the Image to PPTX Converter free?", a: "Yes. The tool is completely free to use with no hidden costs or watermarks." },
                      { q: "Do I need to install software?", a: "No. Everything works directly in your modern web browser (Chrome, Firefox, Safari, Edge)." },
                      { q: "Are my files uploaded to servers?", a: "No. SafeTools prioritizes browser-based processing. Your images never leave your device." },
                      { q: "Can I convert multiple images into one PPTX file?", a: "Yes. You can upload multiple images and they will be converted into a multi-slide PowerPoint presentation." },
                      { q: "Does the tool support mobile devices?", a: "Yes. The converter works seamlessly on Android phones, iPhones, tablets, and desktop devices." },
                      { q: "Will image quality be reduced?", a: "The converter is optimized to preserve image clarity and resolution as much as possible during the generation process." }
                    ].map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-2xl px-6 bg-background/50">
                        <AccordionTrigger className="hover:no-underline font-black uppercase text-xs tracking-widest italic text-left">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>

              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Studio Interface */}
            {/* Left Sidebar - Assets */}
            <aside className="flex w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-border glass-card flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full bg-card/50 backdrop-blur-2xl">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Asset Matrix
                  </h3>
                  <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">{files.length} Slides Initialized</p>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-orange-500 hover:bg-orange-500/10 rounded-xl" onClick={() => document.getElementById('sidebar-add')?.click()}>
                  <Plus className="w-5 h-5" />
                  <input id="sidebar-add" type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFilesDrop(Array.from(e.target.files || []))} />
                </Button>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-4 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {files.map((f, i) => (
                      <motion.div
                        key={f.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <Card 
                          className={cn(
                            "p-3 flex items-center gap-4 cursor-pointer transition-all border-border hover:border-orange-500/20 group relative overflow-hidden rounded-2xl",
                            selectedId === f.id ? "bg-orange-500/5 border-orange-500/30 shadow-lg" : "bg-secondary/30"
                          )}
                          onClick={() => setSelectedId(f.id)}
                        >
                          <div className="w-6 text-[10px] font-black text-muted-foreground/40 group-hover:text-orange-500/40 transition-colors shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <div className="w-16 h-10 rounded-lg overflow-hidden bg-muted/40 shrink-0 relative flex items-center justify-center border border-border shadow-inner">
                            {f.previewUrl ? (
                              <img src={f.previewUrl} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <FileText className="w-4 h-4 text-muted-foreground/20" />
                            )}
                          </div>
                          <div className="min-w-0 flex-grow">
                            <p className="text-[11px] font-black uppercase truncate tracking-tight">{f.file.name}</p>
                            <p className="text-[9px] text-muted-foreground/40 font-bold uppercase">{(f.file.size / 1024).toFixed(0)} KB</p>
                          </div>
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                            <button onClick={(e) => { e.stopPropagation(); moveFile(i, 'up'); }} disabled={i === 0} className="hover:text-orange-500 disabled:opacity-10 p-0.5"><ChevronUp className="w-3 h-3" /></button>
                            <button onClick={(e) => { e.stopPropagation(); moveFile(i, 'down'); }} disabled={i === files.length - 1} className="hover:text-orange-500 disabled:opacity-10 p-0.5"><ChevronDown className="w-3 h-3" /></button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 text-red-500 shrink-0 hover:bg-red-500/10"
                            onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-border bg-secondary/20 shrink-0">
                <Button 
                  className="w-full h-12 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm gap-3 shadow-2xl shadow-orange-500/20 active:scale-95 transition-all italic"
                  onClick={createPPTX}
                  disabled={isProcessing || files.length === 0}
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-5 h-5" />}
                  GENERATE PPTX DECK
                </Button>
              </div>
            </aside>

            {/* Center - Workspace */}
            <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[600px] lg:min-h-0">
              <header className="px-8 py-4 flex items-center justify-between bg-card/30 backdrop-blur-3xl border-b border-border relative z-20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-xl">
                    <Presentation className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-black text-xl tracking-tighter uppercase italic truncate max-w-[200px] md:max-w-md">
                      {title}
                    </h2>
                    <div className="flex items-center gap-3">
                      <Badge className="text-[9px] bg-orange-500/10 text-orange-500 border-orange-500/20 px-3 py-0.5 rounded-full font-black uppercase tracking-widest italic">
                        SLIDE {files.indexOf(currentFile!) + 1} / {files.length}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="outline" className="rounded-xl border-border h-10 px-4 font-black uppercase text-[10px] tracking-widest italic gap-2" onClick={() => setFiles([])}>
                      <RefreshCw className="w-3 h-3" /> Reset
                   </Button>
                </div>
              </header>

              <div className="flex-grow relative flex items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(40,minmax(0,1fr))] pointer-events-none opacity-[0.03]">
                  {Array.from({ length: 1600 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-white" />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {currentFile ? (
                     <motion.div 
                        key={currentFile.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        className="w-full h-full max-w-5xl bg-card rounded-3xl border border-border shadow-[0_40px_100px_-30px_rgba(0,0,0,0.5)] dark:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] flex items-center justify-center relative group overflow-hidden p-8"
                     >
                        {currentFile.previewUrl ? (
                          <img 
                            src={currentFile.previewUrl} 
                            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform group-hover:scale-[1.005] duration-700" 
                            alt="Slide Preview" 
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-4 text-muted-foreground/20">
                            <FileText className="w-24 h-24" />
                            <p className="font-black uppercase tracking-widest italic">No Preview Available</p>
                          </div>
                        )}
                        <div className="absolute bottom-8 right-8">
                           <Badge className="bg-background/80 backdrop-blur-xl text-muted-foreground/60 border-border px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] text-[9px] shadow-lg">
                             SECURE BROWSER THREAD
                           </Badge>
                        </div>
                     </motion.div>
                  ) : (
                    <div className="text-center space-y-6 opacity-20">
                       <FileStack className="w-24 h-16 mx-auto animate-pulse" />
                       <p className="font-black uppercase tracking-[0.4em] text-sm italic">Workspace Initialized</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Right Sidebar - Logic */}
            <aside className="flex w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-border glass-card shrink-0 flex-col relative z-10 shadow-2xl h-[500px] lg:h-full bg-card/50 backdrop-blur-2xl">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-3">
                    <Settings2 className="w-4 h-4" /> Studio Config
                  </h3>
                  <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Local Synthesis Mode</p>
                </div>
                <Badge variant="outline" className="text-[9px] border-orange-500/20 bg-orange-500/5 text-orange-500 px-3 py-1 rounded-full font-black italic">PRO</Badge>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-6 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                       <Info className="w-3.5 h-3.5" /> Identity
                    </h4>
                    <div className="space-y-3">
                       <div className="space-y-2">
                          <Label className="text-[9px] text-muted-foreground/40 uppercase font-black tracking-widest ml-1">Presentation Name</Label>
                          <Input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-secondary/40 border-border rounded-2xl h-11 font-black uppercase tracking-tight italic text-orange-500 focus:ring-orange-500/20"
                            placeholder="DECK_2024"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                       <Zap className="w-3.5 h-3.5" /> Optimization
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                          { label: "Layout Engine", value: "HD 16:9", icon: Monitor },
                          { label: "Image Fit", value: "Contain", icon: Layout },
                          { label: "Worker Status", value: "Idle", icon: Cpu }
                        ].map((stat, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-border group hover:border-orange-500/20 transition-colors">
                             <div className="flex items-center gap-3">
                                <stat.icon className="w-4 h-4 text-muted-foreground/30 group-hover:text-orange-500 transition-colors" />
                                <span className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-widest">{stat.label}</span>
                             </div>
                             <Badge variant="outline" className="text-[9px] border-border text-foreground/40 font-black">{stat.value}</Badge>
                          </div>
                        ))}
                    </div>
                  </div>

                  <Card className="p-6 rounded-3xl bg-orange-500/5 border-orange-500/10 space-y-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-orange-500" />
                      <h4 className="text-xs font-black uppercase tracking-widest italic">Privacy Shield</h4>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                      All slide construction occurs within your browser's sandboxed environment. No data is transmitted, cached, or stored on our infrastructure.
                    </p>
                  </Card>
                </div>
              </ScrollArea>
              
              <div className="p-6 border-t border-border bg-secondary/10 shrink-0">
                 <div className="flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">
                    <CheckCircle2 className="w-3 h-3 text-orange-500" /> System Ready
                 </div>
              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  );
}

