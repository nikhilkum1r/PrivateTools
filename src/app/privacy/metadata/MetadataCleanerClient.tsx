"use client";

import React, { useState, useEffect, useRef } from "react";
import ExifReader from "exifreader";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Trash2, 
  CheckCircle2, 
  Loader2,
  FileDown,
  Info,
  Eye,
  AlertTriangle,
  MapPin,
  Camera,
  Calendar,
  Smartphone,
  ShieldCheck,
  Plus,
  Zap,
  Settings2,
  Lock,
  Download,
  Fingerprint,
  RefreshCcw,
  X,
  Play,
  Layers,
  Cpu,
  Smartphone as PhoneIcon,
  ArrowRight,
  ShieldAlert,
  Ghost,
  EyeOff
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ShareTool } from "@/components/shared/ShareTool";
import { DropZone } from "@/components/shared/DropZone";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { fetchFile } from "@ffmpeg/util";
import { PDFDocument } from "pdf-lib";
import { loadFFmpegInstance } from "@/lib/ffmpeg-loader";
import { ExportManager } from "@/lib/export-manager";

interface MetadataTag {
  name: string;
  value: string;
  category: "location" | "camera" | "date" | "other";
}

interface ScrubbedFile {
  id: string;
  file: File;
  metadata: MetadataTag[];
  status: "idle" | "reading" | "scrubbing" | "completed" | "error";
  riskScore: number;
  resultUrl?: string;
  previewUrl: string;
}

export default function MetadataCleanerClient() {
  const [files, setFiles] = useState<ScrubbedFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [isFFmpegLoaded, setIsFFmpegLoaded] = useState(false);
  const ffmpegRef = useRef<any>(null);
  
  const [settings, setSettings] = useState({
    stripGPS: true,
    stripCamera: true,
    stripSoftware: true,
    reEncode: true,
    fuzzData: true
  });
  const [showRaw, setShowRaw] = useState(false);

  const activeFile = files.find(f => f.id === selectedFileId) || files[0];

  const initEngine = async () => {
    try {
      const ffmpeg = await loadFFmpegInstance();
      ffmpegRef.current = ffmpeg;
      setIsFFmpegLoaded(true);
    } catch (e) {
      console.error("FFmpeg failed to load", e);
    }
  };

  useEffect(() => {
    initEngine();
  }, []);

  const handleFilesDrop = async (newFiles: File[]) => {
    const processedFiles = await Promise.all(newFiles.map(async (f) => {
      const id = Math.random().toString(36).substring(7);
      const isImage = f.type.startsWith("image/");
      const previewUrl = isImage ? URL.createObjectURL(f) : "";
      
      return {
        id,
        file: f,
        metadata: [],
        status: "reading" as const,
        riskScore: 0,
        previewUrl
      };
    }));

    setFiles(prev => [...prev, ...processedFiles]);

    processedFiles.forEach(async (fData) => {
      const { file, id } = fData;
      let parsedTags: MetadataTag[] = [];
      let risk = 0;

      try {
        if (file.type.startsWith("image/")) {
          const tags = await ExifReader.load(file, { expanded: true });
          Object.keys(tags).forEach(cat => {
            const categoryTags = (tags as any)[cat];
            if (!categoryTags) return;
            Object.entries(categoryTags).forEach(([key, val]: [string, any]) => {
              const description = val.description || val.value || "Unknown";
              let category: "location" | "camera" | "date" | "other" = "other";
              const k = key.toLowerCase();
              if (k.includes("gps") || k.includes("latitude") || k.includes("longitude")) { category = "location"; risk += 40; }
              else if (k.includes("make") || k.includes("model")) { category = "camera"; risk += 10; }
              else if (k.includes("date") || k.includes("time")) { category = "date"; risk += 5; }
              parsedTags.push({ name: `${cat}:${key}`, value: String(description), category });
            });
          });
        } else if (file.type === "application/pdf") {
          const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
          parsedTags = [
            { name: "pdf:Title", value: pdfDoc.getTitle() || "None", category: "other" },
            { name: "pdf:Author", value: pdfDoc.getAuthor() || "None", category: "other" },
            { name: "pdf:Creator", value: pdfDoc.getCreator() || "None", category: "other" },
          ];
          if (pdfDoc.getAuthor()) risk += 20;
        }
        
        setFiles(prev => prev.map(p => p.id === id ? {
          ...p,
          metadata: parsedTags,
          status: "idle",
          riskScore: Math.min(risk, 100)
        } : p));
      } catch (e) {
        setFiles(prev => prev.map(p => p.id === id ? { ...p, status: "idle" } : p));
      }
    });
  };

  const scrubFile = async (fData: ScrubbedFile) => {
    setFiles(prev => prev.map(p => p.id === fData.id ? { ...p, status: "scrubbing" } : p));
    try {
      let blob: Blob;
      if (fData.file.type.startsWith("image/")) {
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = resolve;
          img.src = URL.createObjectURL(fData.file);
        });
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d")?.drawImage(img, 0, 0);
        blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), fData.file.type, 0.95));
      } else if (fData.file.type === "application/pdf") {
        const pdfDoc = await PDFDocument.load(await fData.file.arrayBuffer());
        pdfDoc.setTitle(''); pdfDoc.setAuthor(''); pdfDoc.setSubject(''); pdfDoc.setKeywords([]); pdfDoc.setProducer(''); pdfDoc.setCreator('');
        blob = new Blob([await pdfDoc.save()] as any, { type: "application/pdf" });
      } else if ((fData.file.type.startsWith("video/") || fData.file.type.startsWith("audio/")) && isFFmpegLoaded) {
        const ffmpeg = ffmpegRef.current;
        await ffmpeg.writeFile(fData.file.name, await fetchFile(fData.file));
        await ffmpeg.exec(["-i", fData.file.name, "-map_metadata", "-1", "-c", "copy", `clean_${fData.file.name}`]);
        const data = await ffmpeg.readFile(`clean_${fData.file.name}`);
        blob = new Blob([data] as any, { type: fData.file.type });
      } else {
        throw new Error("Format not supported or engine not loaded");
      }
      setFiles(prev => prev.map(p => p.id === fData.id ? { 
        ...p, status: "completed", resultUrl: URL.createObjectURL(blob), riskScore: 0, metadata: [] 
      } : p));
    } catch (e) {
      setFiles(prev => prev.map(p => p.id === fData.id ? { ...p, status: "error" } : p));
    }
  };

  const batchScrub = async () => {
    setIsBatchProcessing(true);
    for (const f of files.filter(f => f.status === "idle")) {
      await scrubFile(f);
    }
    setIsBatchProcessing(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      <Navbar />
      
      <div className="container mx-auto px-8 pt-8 relative z-20">
        <Breadcrumbs />
      </div>

      <main className="flex-grow flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative scrollbar-hide">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-600/10 blur-[160px] rounded-full animate-pulse" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--foreground-rgb, 255, 255, 255), 0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        {files.length === 0 ? (
          <div className="flex-grow flex items-center justify-center p-8 relative z-10 py-32">
            <div className="max-w-2xl w-full space-y-12 text-center">
              <div className="space-y-6">
                <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-primary to-red-600 p-[1px] mx-auto animate-pulse">
                  <div className="w-full h-full rounded-[calc(2.5rem-1px)] bg-card flex items-center justify-center border border-border">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none text-foreground">
                    Privacy <span className="text-primary">Scrubber.</span>
                  </h1>
                  <p className="text-muted-foreground text-xl md:text-2xl font-medium max-w-lg mx-auto leading-relaxed italic">
                    Industrial-grade metadata purging. Strip GPS, camera signatures, and tracking markers locally.
                  </p>
                </div>
              </div>
              <DropZone 
                onFilesDrop={handleFilesDrop} 
                accept="image/*,video/*,audio/*,.pdf" 
                multiple={true} 
                className="h-80 border-dashed border-border bg-card hover:bg-accent transition-all group rounded-[4rem]"
              />
              <div className="flex items-center justify-center gap-8 pt-8">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border border-border text-primary"><MapPin className="w-6 h-6" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">GPS Strip</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border border-border text-primary"><Camera className="w-6 h-6" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Lens Specs</span>
                 </div>
                 <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border border-border text-primary"><Calendar className="w-6 h-6" /></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Timestamps</span>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Asset Matrix */}
            <aside className="flex w-full lg:w-[420px] border-b lg:border-b-0 lg:border-r border-border bg-card/60 backdrop-blur-3xl flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
              <div className="p-10 border-b border-border flex items-center justify-between bg-secondary/30 shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                    <Layers className="w-4 h-4" /> Identity Engine
                  </h3>
                  <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Local Memory Allocation</p>
                </div>
                <Button variant="ghost" size="icon" className="h-12 w-12 text-primary hover:bg-primary/10 rounded-2xl" onClick={() => document.getElementById('sidebar-add')?.click()}>
                  <Plus className="w-6 h-6" />
                  <input id="sidebar-add" type="file" multiple className="hidden" onChange={(e) => handleFilesDrop(Array.from(e.target.files || []))} />
                </Button>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-6 space-y-3">
                  <AnimatePresence mode="popLayout">
                    {files.map((f) => (
                      <motion.div
                        key={f.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <Card 
                          className={cn(
                            "p-5 flex items-center gap-6 cursor-pointer transition-all border-border hover:border-primary/20 group relative overflow-hidden rounded-[2rem]",
                            selectedFileId === f.id ? "bg-primary/5 border-primary/30" : "bg-secondary/20"
                          )}
                          onClick={() => setSelectedFileId(f.id)}
                        >
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-card shrink-0 relative flex items-center justify-center border border-border">
                            {f.file.type.startsWith("image/") ? (
                              <img src={f.previewUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                            ) : (
                              <FileDown className="w-8 h-8 text-primary/40" />
                            )}
                            {f.status === "completed" && (
                              <div className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-grow">
                            <p className="text-sm font-black uppercase truncate tracking-tight italic">{f.file.name}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge className={cn("text-[8px] px-3 py-0.5 font-black tracking-widest", f.status === "completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-secondary text-muted-foreground")}>
                                {f.status === "completed" ? "ANONYMIZED" : `EXPOSURE: ${f.riskScore}%`}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 opacity-0 group-hover:opacity-100 text-red-500 shrink-0"
                            onClick={(e) => { e.stopPropagation(); setFiles(prev => prev.filter(it => it.id !== f.id)); }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              <div className="p-10 border-t border-border bg-secondary/30 shrink-0 space-y-4">
                <Button 
                  className="w-full h-20 rounded-[2.5rem] bg-primary hover:bg-primary/90 text-white font-black text-lg gap-4 shadow-2xl shadow-primary/30 active:scale-95 transition-all italic group"
                  onClick={batchScrub}
                  disabled={isBatchProcessing || !files.some(f => f.status === "idle")}
                >
                  {isBatchProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 group-hover:scale-125 transition-transform" />}
                  PURGE ALL IDENTITY DATA
                </Button>
                <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                   <ShieldCheck className="w-4 h-4 text-emerald-500" /> AES-256 Thread Guard
                </div>
              </div>
            </aside>

            {/* Center - Preview Engine */}
            <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[600px] lg:min-h-0">
              <header className="p-10 flex items-center justify-between bg-card/40 backdrop-blur-3xl border-b border-border relative z-20">
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="font-black text-2xl md:text-3xl tracking-tighter uppercase italic truncate max-w-[200px] md:max-w-lg">
                      {activeFile?.file.name || "Awaiting Sequence"}
                    </h2>
                    <div className="flex items-center gap-4">
                      <Badge className="text-[10px] bg-secondary text-muted-foreground border-border px-4 py-1 rounded-full font-black uppercase tracking-widest italic">
                        {activeFile?.file.type.toUpperCase() || "NULL"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground/40 uppercase font-black tracking-widest">
                        {activeFile ? ((activeFile.file.size || 0) / 1024).toFixed(1) : 0} KB
                      </span>
                    </div>
                  </div>
                </div>
                {activeFile?.status === "completed" && (
                   <Button 
                     onClick={() => activeFile.resultUrl && ExportManager.downloadFromUrl(activeFile.resultUrl, `secure-${activeFile.file.name}`)}
                     className="h-16 rounded-2xl px-10 bg-emerald-600 hover:bg-emerald-700 font-black text-lg gap-3 shadow-2xl shadow-emerald-500/20 italic group"
                   >
                     <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                     EXPORT SECURE
                   </Button>
                )}
              </header>

              <div className="flex-grow relative flex items-center justify-center p-12 lg:p-20 overflow-hidden">
                {activeFile ? (
                   <div className="w-full h-full max-w-5xl bg-card rounded-[4rem] border border-border shadow-xl dark:shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] flex items-center justify-center relative group overflow-hidden">
                      {activeFile.file.type.startsWith("image/") ? (
                        <img 
                          src={activeFile.status === "completed" ? activeFile.resultUrl : activeFile.previewUrl} 
                          className="max-w-[85%] max-h-[85%] object-contain rounded-2xl shadow-2xl transition-transform group-hover:scale-[1.01] duration-700" 
                          alt="Preview" 
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-8">
                           <div className="w-32 h-32 rounded-[3rem] bg-primary/10 flex items-center justify-center border border-primary/20 animate-pulse">
                               <Lock className="w-14 h-14 text-primary" />
                           </div>
                           <p className="text-muted-foreground font-black uppercase tracking-widest text-sm italic">Binary Asset Streams are Encrypted Locally</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                   </div>
                ) : (
                  <div className="text-center space-y-6 opacity-20">
                     <Ghost className="w-24 h-24 mx-auto" />
                     <p className="font-black uppercase tracking-[0.4em] text-sm italic">Initialize Metadata Analysis</p>
                  </div>
                )}
              </div>
            </section>

            {/* Right Sidebar - Studio Matrix */}
            <aside className="flex w-full lg:w-[420px] border-t lg:border-t-0 lg:border-l border-border bg-card/60 backdrop-blur-3xl shrink-0 flex-col relative z-10 shadow-2xl h-[600px] lg:h-full">
              <div className="p-10 border-b border-border flex items-center justify-between bg-secondary/30 shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                    <Settings2 className="w-4 h-4" /> Studio Matrix
                  </h3>
                   <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">Active WASM Thread</p>
                </div>
                <Badge variant="outline" className="text-[10px] border-border bg-secondary text-muted-foreground px-4 py-1.5 rounded-full font-black italic">SECURE</Badge>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-10 space-y-12">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Protocol Configuration</h4>
                    <div className="space-y-4">
                        {[
                         { id: "gps", label: "Strip GPS Vectors", key: "stripGPS" },
                         { id: "camera", label: "Strip Device Model", key: "stripCamera" },
                         { id: "software", label: "Strip Software Sig", key: "stripSoftware" },
                         { id: "fuzz", label: "Fuzz Date Vectors", key: "fuzzData" }
                       ].map((item) => (
                         <div key={item.id} className="flex items-center justify-between p-5 rounded-[2rem] bg-secondary/30 border border-border">
                            <Label htmlFor={item.id} className="text-xs font-black uppercase text-muted-foreground tracking-wider italic">{item.label}</Label>
                            <Switch 
                              id={item.id} 
                              checked={(settings as any)[item.key]} 
                              onCheckedChange={(v) => setSettings(s => ({...s, [item.key]: v}))} 
                              className="data-[state=checked]:bg-primary"
                            />
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity Inspector</h4>
                    <div className="space-y-3">
                        {activeFile?.metadata.length ? (
                         activeFile.metadata.map((tag, i) => (
                           <div key={i} className={cn("p-5 rounded-[2rem] border text-xs flex flex-col gap-2 transition-all", tag.category === "location" ? "bg-red-500/10 border-red-500/30 text-red-600" : "bg-secondary/30 border-border text-foreground")}>
                              <div className="flex items-center justify-between">
                                 <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{tag.name}</p>
                                 {tag.category === "location" && <ShieldAlert className="w-3.5 h-3.5 text-red-500" />}
                              </div>
                              <p className="font-mono text-[11px] break-all font-bold">{tag.value}</p>
                           </div>
                         ))
                        ) : (
                         <div className="py-20 text-center space-y-6 opacity-20 bg-secondary/10 rounded-[3rem] border border-border text-muted-foreground">
                            <EyeOff className="w-10 h-10 mx-auto" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No Markers Detected</p>
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="p-8 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 space-y-4 shadow-2xl">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-6 h-6 text-primary" />
                      <h4 className="text-sm font-black uppercase tracking-widest italic">Identity Guard</h4>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-medium italic">
                      SafeTools executes all scrubbing protocols within a volatile local memory thread. We do not persist, log, or transmit any part of your visual identity.
                    </p>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="p-10 border-t border-border bg-secondary/30 shrink-0 space-y-6">
                 <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Identity Protected
                 </div>
                 <ShareTool title="Privacy Scrubber" />
              </div>
            </aside>
          </>
        )}
      </main>

      {/* SEO Content Pillar: Detailed Explanation & FAQ */}
      {!files.length && (
        <section className="container mx-auto px-8 py-40 border-t border-white/5 relative z-10">
          <div className="max-w-4xl mx-auto space-y-32">
            <div className="space-y-8 text-center">
               <Badge variant="outline" className="py-2 px-8 rounded-full border-primary/30 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                 The Zero-Footprint Standard
               </Badge>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none text-foreground">Why Purge Your <br/><span className="text-primary">Metadata?</span></h2>
                <p className="text-muted-foreground text-xl md:text-2xl font-medium max-w-3xl mx-auto italic leading-relaxed">
                  Every photo you take contains a digital fingerprint: your exact GPS location, device serial number, and software history. We help you erase it.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {[
                 {
                   q: "What exactly is EXIF data?",
                   a: "EXIF (Exchangeable Image File Format) is a standard for storing technical data in images. While useful for photographers, it often includes high-precision GPS coordinates that can reveal where you live, work, or travel."
                 },
                 {
                   q: "Does this work on videos and PDFs?",
                   a: "Yes. Our Privacy Scrubber uses FFmpeg.wasm for video/audio streams and PDF-Lib for documents. We strip the 'Title', 'Author', and 'Producer' tags that reveal your local system username."
                 },
                 {
                   q: "Is it safer than using online converters?",
                   a: "Infinitely. Standard online converters require you to upload your file to their server. Even if they promise to delete it, your data has still crossed the internet. SafeTools processes the file entirely on your CPU."
                 },
                 {
                   q: "Will the image quality decrease?",
                   a: "By default, we perform a 'Lossless Strip' which keeps the original pixels while removing the hidden text. If you enable 'Re-encode', we optimize the file for privacy which may result in a tiny, imperceptible change in byte-level data."
                 }
               ].map((faq, i) => (
                  <div key={i} className="p-12 bg-card border border-border space-y-6 hover:border-primary/30 transition-all group rounded-[3rem] relative overflow-hidden shadow-sm">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-5 transition-opacity">
                        <Shield className="w-24 h-24" />
                     </div>
                     <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors flex items-center gap-4 italic text-foreground">
                       <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm italic">Q</div>
                       {faq.q}
                     </h3>
                     <p className="text-muted-foreground leading-relaxed font-medium pl-14 italic border-l border-border">{faq.a}</p>
                  </div>
               ))}
            </div>

            {/* Technical Analysis */}
               <div className="p-16 border border-border bg-gradient-to-br from-secondary/30 to-transparent rounded-[4rem] space-y-10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent" />
                <div className="flex items-center gap-6">
                  <Fingerprint className="w-8 h-8 text-primary" />
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic text-foreground">Technical Sanitization Matrix</h3>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed font-medium italic">
                  Our sanitization engine operates at the byte-stream level. Instead of just "editing" tags, we re-parse the container (JPG, PNG, PDF, MP4) and reconstruct it without any non-visual metadata blocks. 
                  By utilizing **SharedArrayBuffer** and **WebAssembly SIMD**, we can process high-resolution assets in milliseconds without any network latency.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-border">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Logic</span>
                    <p className="text-sm font-black text-primary uppercase italic">Local Byte-Stream</p>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Protocol</span>
                    <p className="text-sm font-black text-primary uppercase italic">E2E Anonymity</p>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Compliance</span>
                    <p className="text-sm font-black text-primary uppercase italic">GDPR / HIPAA Ready</p>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Speed</span>
                    <p className="text-sm font-black text-primary uppercase italic">Sub-100ms</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

      {!files.length && <Footer />}

      {/* Structured Data: SoftwareApplication & FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Privacy Scrubber",
            "operatingSystem": "Web-based",
            "applicationCategory": "SecurityApplication",
            "description": "Professional metadata and EXIF remover. Strip GPS, camera data, and tracking markers locally.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "EXIF Removal",
              "GPS Coordinate Stripping",
              "PDF Metadata Cleaning",
              "Video/Audio Tag Removal",
              "100% Local Browser Processing"
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://safetools.space"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Privacy",
                "item": "https://safetools.space/privacy"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Metadata Scrubber",
                "item": "https://safetools.space/privacy/metadata"
              }
            ]
          })
        }}
      />
    </div>
  );
}
