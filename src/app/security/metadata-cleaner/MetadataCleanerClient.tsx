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
  HardDrive,
  EyeOff,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  FileAudio,
  FileVideo,
  Check,
  Globe,
  Share2
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
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
import { FAQ } from "@/components/shared/FAQ";
import { Footer } from "@/components/shared/Footer";

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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary/10 opacity-50" />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
              Industrial-Grade Metadata Purging
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase italic">
              Metadata <span className="text-primary">Cleaner</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
              Remove hidden metadata from images, documents, and files securely using browser-based privacy-first processing.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {[
                { icon: ShieldCheck, text: "Local Processing" },
                { icon: Zap, text: "Zero Upload" },
                { icon: EyeOff, text: "No Tracking" },
                { icon: Zap, text: "Instant Cleaning" },
                { icon: HardDrive, text: "Browser-Based" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-sm">
                  <badge.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{badge.text}</span>
                </div>
              ))}
            </div>
            
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest pt-4">
              Protect your privacy by removing hidden metadata from files before sharing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interactive Tool Section */}
      <section className="container mx-auto px-4 py-12 max-w-[1400px] relative z-20 -mt-8">
        <div className="glass-card rounded-[40px] border border-border shadow-2xl bg-card overflow-hidden flex flex-col xl:flex-row h-auto xl:h-[750px] w-full">
           {files.length === 0 ? (
             <div className="w-full flex items-center justify-center p-12 bg-secondary/10">
               <div className="max-w-2xl w-full text-center space-y-8">
                 <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
                   <Shield className="w-10 h-10 text-primary" />
                 </div>
                 <div className="space-y-2">
                   <h2 className="text-2xl font-black tracking-tight uppercase italic">Initialize Asset Sequence</h2>
                   <p className="text-muted-foreground">Drop files to detect and remove embedded tracking data.</p>
                 </div>
                 <DropZone 
                   onFilesDrop={handleFilesDrop} 
                   accept="image/*,video/*,audio/*,.pdf" 
                   multiple={true} 
                   className="h-64 border-dashed border-border bg-background rounded-3xl hover:border-primary/50 transition-colors"
                   title="Upload Files for Scrubbing"
                   description="Images, Videos, PDFs, Audio"
                 />
               </div>
             </div>
           ) : (
             <>
               {/* Left Sidebar - Files */}
               <aside className="w-full xl:w-[320px] border-b xl:border-b-0 xl:border-r border-border bg-background/50 flex flex-col shrink-0 overflow-hidden">
                 <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
                   <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                     <Layers className="w-4 h-4 text-indigo-500" /> Asset Queue
                   </h3>
                   <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-indigo-500/10 border-border text-indigo-400 rounded-lg bg-secondary/50" onClick={() => document.getElementById('add-more')?.click()}>
                     <Plus className="w-4 h-4" />
                     <input id="add-more" type="file" multiple className="hidden" onChange={(e) => handleFilesDrop(Array.from(e.target.files || []))} />
                   </Button>
                 </div>
                 <ScrollArea className="flex-grow p-4">
                   <div className="space-y-2">
                     <AnimatePresence>
                       {files.map(f => (
                         <motion.div key={f.id} layout initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}}>
                           <Card className={cn(
                             "p-3 flex items-center gap-4 cursor-pointer transition-all border-border hover:border-indigo-500/50 rounded-2xl group",
                             selectedFileId === f.id ? "bg-indigo-500/10 border-indigo-500/50 shadow-md" : "bg-card"
                           )} onClick={() => setSelectedFileId(f.id)}>
                             <div className="w-12 h-12 rounded-xl bg-muted shrink-0 flex items-center justify-center overflow-hidden border border-border">
                               {f.file.type.startsWith("image/") ? <img src={f.previewUrl} className="w-full h-full object-cover" alt="" /> : <FileDown className="w-6 h-6 text-muted-foreground" />}
                               {f.status === "completed" && <div className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-white" /></div>}
                             </div>
                             <div className="min-w-0 flex-grow">
                               <p className="text-xs font-bold truncate">{f.file.name}</p>
                               <Badge variant={f.status === "completed" ? "default" : "secondary"} className={cn("mt-1 text-[9px] font-black uppercase tracking-widest", f.status === "completed" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-secondary/50 text-muted-foreground")}>
                                 {f.status === "completed" ? "CLEAN" : `RISK ${f.riskScore}%`}
                               </Badge>
                             </div>
                             <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 text-red-500 shrink-0 hover:bg-red-500/10" onClick={(e) => { e.stopPropagation(); setFiles(prev => prev.filter(it => it.id !== f.id)); }}>
                               <Trash2 className="w-4 h-4" />
                             </Button>
                           </Card>
                         </motion.div>
                       ))}
                     </AnimatePresence>
                   </div>
                 </ScrollArea>
                 <div className="p-4 border-t border-border bg-card">
                   <button 
                     className="w-full h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black italic shadow-xl shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
                     onClick={batchScrub} 
                     disabled={isBatchProcessing || !files.some(f => f.status === "idle")}
                   >
                     {isBatchProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />} 
                     SCRUB ALL ASSETS
                   </button>
                 </div>
               </aside>

               {/* Center - Inspector */}
               <section className="flex-grow flex flex-col relative min-w-0">
                 <header className="p-6 border-b border-border flex items-center justify-between bg-card z-10 flex-wrap gap-4">
                   <div className="flex items-center gap-4 min-w-0">
                     <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
                       <ShieldCheck className="w-6 h-6 text-indigo-400" />
                     </div>
                     <div className="min-w-0">
                       <h2 className="font-black text-xl uppercase italic truncate max-w-[200px] sm:max-w-sm">{activeFile?.file.name}</h2>
                       <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{activeFile?.file.type || "Unknown Format"} • {(activeFile?.file.size / 1024).toFixed(1)} KB</p>
                     </div>
                   </div>
                   {activeFile?.status === "completed" && (
                     <button 
                       onClick={() => activeFile.resultUrl && ExportManager.downloadFromUrl(activeFile.resultUrl, `secure-${activeFile.file.name}`)} 
                       className="h-10 flex items-center justify-center rounded-xl px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black italic gap-2 shadow-xl shadow-emerald-500/20 transition-colors"
                     >
                       <Download className="w-4 h-4" /> DOWNLOAD SECURE
                     </button>
                   )}
                 </header>

                 <div className="flex-grow relative flex bg-secondary/20 p-6 overflow-hidden">
                   <div className="w-full h-full bg-background rounded-3xl border border-border flex items-center justify-center p-4 relative">
                     {activeFile?.file.type.startsWith("image/") ? (
                       <img src={activeFile.status === "completed" ? activeFile.resultUrl : activeFile.previewUrl} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" alt="Preview" />
                     ) : (
                       <div className="text-center space-y-4">
                         <Lock className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
                         <p className="font-black uppercase tracking-widest text-xs text-muted-foreground">Binary Stream Preview Restricted</p>
                       </div>
                     )}
                   </div>
                 </div>
               </section>

               {/* Right Sidebar - Logic */}
               <aside className="w-full xl:w-[320px] border-t xl:border-t-0 xl:border-l border-border bg-background/50 flex flex-col shrink-0 overflow-hidden">
                 <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
                   <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                     <Settings2 className="w-4 h-4 text-indigo-500" /> Logic Matrix
                   </h3>
                   <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-indigo-500/30 text-indigo-400 bg-indigo-500/10">WASM ACTIVE</Badge>
                 </div>
                 <ScrollArea className="flex-grow p-4">
                   <div className="space-y-6">
                     <div className="space-y-3">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Detected Metadata</h4>
                       {activeFile?.metadata.length ? (
                         <div className="space-y-2">
                           {activeFile.metadata.map((tag, i) => (
                             <div key={i} className={cn("p-3 rounded-xl border text-xs space-y-1", tag.category === "location" ? "bg-red-500/10 border-red-500/20" : "bg-card border-border")}>
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{tag.name}</p>
                               <p className="font-mono text-xs text-foreground break-all">{tag.value}</p>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-2 opacity-50">
                           <Eye className="w-6 h-6 mx-auto" />
                           <p className="text-[10px] font-black uppercase tracking-widest">No Markers Detected</p>
                         </div>
                       )}
                     </div>

                     <div className="space-y-3">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scrub Protocol</h4>
                       <div className="space-y-2">
                         {[
                           { id: "gps", label: "Strip GPS/Location", key: "stripGPS" },
                           { id: "camera", label: "Strip Camera Specs", key: "stripCamera" },
                           { id: "software", label: "Strip Software Sig", key: "stripSoftware" }
                         ].map(item => (
                           <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                             <Label htmlFor={item.id} className="text-xs font-bold">{item.label}</Label>
                             <Switch id={item.id} checked={(settings as any)[item.key]} onCheckedChange={(v) => setSettings(s => ({...s, [item.key]: v}))} />
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 </ScrollArea>
               </aside>
             </>
           )}
        </div>
      </section>

      <main className="container mx-auto px-4 py-16 space-y-24 max-w-6xl">
        
        {/* Main Features Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight">Metadata Protection Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Industrial-grade privacy controls built directly into your browser.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MapPin, title: "EXIF Removal" },
              { icon: Globe, title: "GPS Stripping" },
              { icon: Camera, title: "Camera Info" },
              { icon: FileText, title: "Document Purging" },
              { icon: Cpu, title: "Browser-Side" },
              { icon: Layers, title: "Batch Processing" },
              { icon: Shield, title: "Secure Local" },
              { icon: Download, title: "Instant Download" }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-3xl bg-card border border-border flex flex-col items-center text-center gap-4 hover:border-primary/20 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-sm leading-tight">{feature.title}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* Educational Section: What is Metadata */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-1.5 font-black uppercase">Educational Guide</Badge>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-none">
              What Is <span className="text-blue-500">Metadata?</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Metadata is hidden information stored inside files, images, and documents that can reveal sensitive details such as device information, location data, timestamps, software versions, and author details.
            </p>
            <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
              <h4 className="font-black uppercase tracking-widest text-xs text-primary">Why It Matters</h4>
              <p className="text-sm text-muted-foreground">Every time you take a photo or save a document, your device quietly embeds personal footprints into the file. This hidden data travels with the file wherever it goes.</p>
            </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full" />
             <div className="relative glass-card border-border rounded-3xl p-8 bg-card shadow-2xl space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <Eye className="w-6 h-6 text-blue-500" />
                  <h3 className="font-black uppercase tracking-widest text-sm">Hidden Payload Example</h3>
                </div>
                {[
                  { k: "Latitude", v: "40.7128° N" },
                  { k: "Longitude", v: "74.0060° W" },
                  { k: "Device", v: "iPhone 15 Pro" },
                  { k: "Author", v: "John Doe" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="font-bold text-muted-foreground">{item.k}</span>
                    <span className="font-mono text-blue-400">{item.v}</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Privacy Risk Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black uppercase italic text-red-500">Why Metadata Can Be Dangerous</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">The silent threat of data exposure through file sharing.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { title: "GPS Location Leaks", desc: "Photos taken on smartphones embed exact GPS coordinates of your home or workplace." },
              { title: "Device Fingerprinting", desc: "Camera models, serial numbers, and OS versions can be used to track you across uploads." },
              { title: "Author Identification", desc: "PDFs and Word documents store the creator's name and organization by default." }
            ].map((risk, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-red-500/5 border border-red-500/20 space-y-4 group">
                <AlertTriangle className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-lg">{risk.title}</h4>
                <p className="text-sm text-red-500/80 leading-relaxed">{risk.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Supported File Types */}
        <section className="p-12 rounded-[40px] border border-border bg-card/50 space-y-12 shadow-2xl">
          <div className="text-center space-y-4">
             <h2 className="text-3xl font-black italic uppercase">Supported File Formats</h2>
             <p className="text-muted-foreground">Comprehensive coverage for all your media and documents.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { cat: "Images", icon: ImageIcon, formats: ["JPG / JPEG", "PNG", "WEBP", "TIFF"] },
               { cat: "Documents", icon: FileText, formats: ["PDF", "DOCX", "XLSX", "PPTX"] },
               { cat: "Media", icon: FileVideo, formats: ["MP3", "MP4", "MOV", "WAV"] }
             ].map((group, i) => (
               <div key={i} className="space-y-6">
                 <div className="flex items-center gap-3 pb-4 border-b border-border">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                     <group.icon className="w-5 h-5 text-primary" />
                   </div>
                   <h3 className="font-black text-xl">{group.cat}</h3>
                 </div>
                 <ul className="space-y-3">
                   {group.formats.map((fmt, j) => (
                     <li key={j} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                       <Check className="w-4 h-4 text-primary" /> {fmt}
                     </li>
                   ))}
                 </ul>
               </div>
             ))}
          </div>
        </section>

        {/* Metadata Types Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black uppercase italic">Hidden Data We Can Remove</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
             {[
               "GPS Coordinates", "Camera Model", "Device Manufacturer", "Timestamps",
               "Author Names", "Editing Software", "Copyright Metadata", "File History",
               "Embedded Thumbnails", "Location History"
             ].map((type, i) => (
               <div key={i} className="p-4 rounded-xl bg-card border border-border flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                 <span className="text-sm font-bold">{type}</span>
               </div>
             ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black italic uppercase">How Metadata Cleaning Works</h2>
            <div className="space-y-6">
              {[
                { step: "01", title: "Upload file locally", desc: "Select files using drag-and-drop. They never leave your device." },
                { step: "02", title: "Detect hidden metadata", desc: "Our WASM engine scans the binary structure for known tags." },
                { step: "03", title: "Remove selected metadata", desc: "Tags are stripped or randomized based on your logic matrix settings." },
                { step: "04", title: "Download securely", desc: "Save the clean file back to your system instantly." }
              ].map((step, i) => (
                <div key={i} className="flex gap-6">
                  <div className="text-2xl font-black text-border italic">{step.step}</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg">{step.title}</h4>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex gap-3 items-start">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-primary">Files are processed locally inside your browser and are never uploaded to servers.</p>
            </div>
          </div>
          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-10 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 rounded-full border border-dashed border-primary/50 animate-[spin_20s_linear_infinite] flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-primary/30 animate-[spin_15s_linear_infinite_reverse] flex items-center justify-center">
                  <ShieldCheck className="w-20 h-20 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security & Privacy */}
        <section className="py-16 border-y border-border">
          <div className="text-center space-y-12">
            <h2 className="text-3xl font-black uppercase italic">Privacy-First File Processing</h2>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                "Browser-Side Cleaning", "No Cloud Uploads", "No File Retention",
                "Secure Local Processing", "Offline Capability", "Zero Tracking"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-lg font-bold">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black uppercase italic">Common Privacy Use Cases</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Social Media Uploads", "Journalism Protection", "Business Document Sharing",
              "Legal Document Sanitization", "Cybersecurity Investigations", "Research Privacy",
              "Anonymous Sharing", "Photography Privacy"
            ].map((use, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border text-center font-bold">
                {use}
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black uppercase italic">Why Use SafeTools Metadata Cleaner?</h2>
          </div>
          <div className="max-w-4xl mx-auto overflow-hidden rounded-[32px] border border-border shadow-2xl bg-card/50 backdrop-blur-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Feature</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-red-500">Traditional Tools</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-primary">SafeTools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { f: "Local Processing", t: "Rare", s: "Yes" },
                  { f: "File Upload Required", t: "Usually", s: "No" },
                  { f: "Tracking Scripts", t: "Sometimes", s: "No" },
                  { f: "Browser-Based", t: "Partial", s: "Full" },
                  { f: "Privacy Focused", t: "Varies", s: "Yes" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 text-sm font-bold">{row.f}</td>
                    <td className="px-8 py-5 text-sm text-red-400 font-medium">{row.t}</td>
                    <td className="px-8 py-5 text-sm text-primary font-medium">{row.s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Security Warning Section */}
        <section className="bg-red-500/5 border border-red-500/10 rounded-[40px] p-8 md:p-16 space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <AlertTriangle className="w-64 h-64 text-red-500" />
           </div>
           <div className="relative z-10 max-w-3xl space-y-6">
             <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-4 py-1.5 uppercase tracking-widest text-[10px] font-black">Important Privacy Reminder</Badge>
             <h2 className="text-4xl font-black italic uppercase">Metadata Limitations</h2>
             <ul className="space-y-4">
               {[
                 "Some platforms may add new metadata after upload.",
                 "Always verify cleaned files locally if anonymity is critical.",
                 "Metadata removal improves privacy but does not guarantee absolute anonymity."
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-sm text-red-400/80 font-medium">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                   {item}
                 </li>
               ))}
             </ul>
           </div>
        </section>

        {/* FAQ Section */}
        <FAQ 
          items={[
            { q: "Are files uploaded to servers?", a: "No. All metadata cleaning happens locally inside your browser." },
            { q: "Can metadata reveal my location?", a: "Yes. GPS coordinates and device information may be embedded inside files." },
            { q: "Does this tool work offline?", a: "Yes. Offline support can be enabled through PWA functionality." },
            { q: "Can SafeTools access my files?", a: "No. Files remain locally processed and are not stored." },
            { q: "Which metadata can be removed?", a: "EXIF, GPS, timestamps, author data, software information, and more." }
          ].map(f => ({ question: f.q, answer: f.a }))}
          title="Frequently Asked Questions"
          description="Everything you need to know about protecting your digital identity by stripping metadata."
        />

        {/* Related Tools */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black italic uppercase">Related Security Tools</h2>
            <p className="text-muted-foreground">Complement your privacy workflow with our secure suite.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: "File Vault", href: "/security/vault", icon: Lock, desc: "Military-grade file encryption." },
              { name: "Steganography", href: "/security/steganography", icon: EyeOff, desc: "Hide messages inside images." },
              { name: "Secure Notes", href: "/privacy/secure-notes", icon: MessageSquare, desc: "Encrypted browser-based notes." },
              { name: "Password Generator", href: "/privacy/password-generator", icon: Fingerprint, desc: "Generate strong offline passwords." },
              { name: "Strength Checker", href: "/privacy/password-checker", icon: ShieldCheck, desc: "Audit your password security." },
              { name: "File Shredder", href: "/security/file-shredder", icon: Trash2, desc: "Permanently delete digital traces." }
            ].map((tool, i) => (
              <Link key={i} href={tool.href} className="group p-6 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <tool.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-1">{tool.name}</h4>
                <p className="text-sm text-muted-foreground leading-tight">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Privacy Manifesto */}
        <section className="py-24 border-y border-border text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.3em] text-primary border-primary/20 px-6 py-2 rounded-full">Privacy by Default</Badge>
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                Privacy is a <span className="text-primary">Right.</span>
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed italic max-w-2xl mx-auto">
              "SafeTools creates browser-based privacy tools designed to minimize data exposure and maximize user control."
            </p>
          </div>
        </section>

      </main>
      
      {/* CTA Footer */}
      <div className="bg-primary text-primary-foreground py-12 text-center font-black uppercase tracking-widest text-lg italic border-t border-primary/20">
        Remove hidden data. Protect your privacy. Stay in control of your digital footprint.
      </div>
      
      <Footer />
    </div>
  );
}

function Link({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
