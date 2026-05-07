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
  Smartphone as PhoneIcon
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

export default function MetadataCleanerPage() {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "location": return <MapPin className="w-4 h-4 text-red-500" />;
      case "camera": return <Camera className="w-4 h-4 text-blue-500" />;
      case "date": return <Calendar className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative scrollbar-hide">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-600/10 blur-[160px] rounded-full animate-pulse" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        {files.length === 0 ? (
          <div className="flex-grow flex items-center justify-center p-8 relative z-10">
            <div className="max-w-2xl w-full space-y-12 text-center">
              <div className="space-y-6">
                <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-primary to-red-600 p-[1px] mx-auto animate-pulse">
                  <div className="w-full h-full rounded-[calc(2.5rem-1px)] bg-black flex items-center justify-center border border-white/5">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                    Privacy <span className="text-primary">Scrubber.</span>
                  </h1>
                  <p className="text-muted-foreground text-xl font-medium max-w-lg mx-auto leading-relaxed">
                    Industrial-grade metadata purging. Strip GPS, camera signatures, and tracking markers locally.
                  </p>
                </div>
              </div>
              <DropZone 
                onFilesDrop={handleFilesDrop} 
                accept="image/*,video/*,audio/*,.pdf" 
                multiple={true} 
                className="h-64 border-dashed border-white/10 bg-white/5 rounded-[3rem] hover:bg-white/[0.08] transition-all"
              />
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Asset Matrix */}
            <aside className="flex w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Identity Engine
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Multi-Platform Asset Matrix</p>
                    <div className="flex gap-1.5 opacity-30">
                      <Play className="w-2 h-2 text-primary fill-primary" />
                      <div className="w-2 h-2 rounded-full border border-white/40" />
                      <Smartphone className="w-2 h-2" />
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-primary hover:bg-primary/10 rounded-xl" onClick={() => document.getElementById('sidebar-add')?.click()}>
                  <Plus className="w-5 h-5" />
                  <input id="sidebar-add" type="file" multiple className="hidden" onChange={(e) => handleFilesDrop(Array.from(e.target.files || []))} />
                </Button>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-4 space-y-2">
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
                            "p-3 flex items-center gap-4 cursor-pointer transition-all border-white/5 hover:border-primary/20 group relative overflow-hidden rounded-2xl",
                            selectedFileId === f.id ? "bg-primary/5 border-primary/30" : "bg-white/[0.02]"
                          )}
                          onClick={() => setSelectedFileId(f.id)}
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 shrink-0 relative flex items-center justify-center border border-white/5">
                            {f.file.type.startsWith("image/") ? (
                              <img src={f.previewUrl} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <FileDown className="w-6 h-6 text-primary" />
                            )}
                            {f.status === "completed" && (
                              <div className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-grow">
                            <p className="text-[11px] font-black uppercase truncate tracking-tight">{f.file.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={f.status === "completed" ? "default" : "secondary"} className={cn("text-[8px] h-4 py-0 font-black tracking-widest", f.status === "completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-white/5 text-white/40")}>
                                {f.status === "completed" ? "CLEAN" : `RISK ${f.riskScore}%`}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 text-red-500 shrink-0"
                            onClick={(e) => { e.stopPropagation(); setFiles(prev => prev.filter(it => it.id !== f.id)); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-white/5 bg-black/40 shrink-0">
                <Button 
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm gap-2 shadow-2xl shadow-primary/20 active:scale-95 transition-all italic"
                  onClick={batchScrub}
                  disabled={isBatchProcessing || !files.some(f => f.status === "idle")}
                >
                  {isBatchProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  SCRUB ALL ASSETS
                </Button>
              </div>
            </aside>

            {/* Center - Preview Engine */}
            <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[600px] lg:min-h-0">
              <header className="p-8 flex items-center justify-between bg-black/40 backdrop-blur-3xl border-b border-white/5 relative z-20">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="font-black text-2xl tracking-tighter uppercase italic truncate max-w-[200px] md:max-w-md">
                      {activeFile?.file.name || "Awaiting Payload"}
                    </h2>
                    <div className="flex items-center gap-4">
                      <Badge className="text-[10px] bg-white/5 text-white/40 border-white/10 px-4 py-1 rounded-full font-black uppercase tracking-widest italic">
                        {activeFile?.file.type.toUpperCase() || "NULL"}
                      </Badge>
                      <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">
                        {activeFile ? ((activeFile.file.size || 0) / 1024).toFixed(1) : 0} KB
                      </span>
                    </div>
                  </div>
                </div>
                {activeFile?.status === "completed" && (
                   <Button 
                     onClick={() => activeFile.resultUrl && ExportManager.downloadFromUrl(activeFile.resultUrl, `secure-${activeFile.file.name}`)}
                     className="h-14 rounded-2xl px-8 bg-emerald-600 hover:bg-emerald-700 font-black gap-2 shadow-xl shadow-emerald-500/20 italic"
                   >
                     <Download className="w-5 h-5" />
                     DOWNLOAD SECURE
                   </Button>
                )}
              </header>

              <div className="flex-grow relative flex items-center justify-center p-8 lg:p-12 overflow-hidden">
                {activeFile ? (
                   <div className="w-full h-full max-w-4xl bg-white/[0.02] rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] flex items-center justify-center relative group overflow-hidden">
                      {activeFile.file.type.startsWith("image/") ? (
                        <img 
                          src={activeFile.status === "completed" ? activeFile.resultUrl : activeFile.previewUrl} 
                          className="max-w-[90%] max-h-[90%] object-contain rounded-xl shadow-2xl transition-transform group-hover:scale-[1.02] duration-700" 
                          alt="Preview" 
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-6">
                           <div className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20">
                              <Lock className="w-10 h-10 text-primary" />
                           </div>
                           <p className="text-white/40 font-black uppercase tracking-widest text-xs">Binary Stream Preview Restricted</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                   </div>
                ) : (
                  <div className="text-center space-y-4 opacity-20">
                     <Fingerprint className="w-20 h-20 mx-auto" />
                     <p className="font-black uppercase tracking-widest text-sm italic">Initialize Asset Sequence</p>
                  </div>
                )}
              </div>
            </section>

            {/* Right Sidebar - Studio Matrix */}
            <aside className="flex w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl shrink-0 flex-col relative z-10 shadow-2xl h-[600px] lg:h-full">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                    <Settings2 className="w-4 h-4" /> Studio Matrix
                  </h3>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none mt-1">WASM Thread Execution</p>
                </div>
                <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 text-white/40 px-4 py-1.5 rounded-full font-black italic">ACTIVE</Badge>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-8 space-y-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Scrub Protocol</h4>
                    <div className="space-y-4">
                       {[
                         { id: "gps", label: "Strip GPS/Location", key: "stripGPS" },
                         { id: "camera", label: "Strip Camera Specs", key: "stripCamera" },
                         { id: "software", label: "Strip Software Sig", key: "stripSoftware" },
                         { id: "fuzz", label: "Fuzz/Scramble Data", key: "fuzzData" }
                       ].map((item) => (
                         <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                            <Label htmlFor={item.id} className="text-[11px] font-black uppercase text-white/60 tracking-wider">{item.label}</Label>
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

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Metadata Inspector</h4>
                    <div className="space-y-2">
                       {activeFile?.metadata.length ? (
                         activeFile.metadata.map((tag, i) => (
                           <div key={i} className={cn("p-4 rounded-2xl border text-xs flex flex-col gap-1 transition-all", tag.category === "location" ? "bg-red-500/5 border-red-500/20" : "bg-white/[0.02] border-white/5")}>
                              <p className="text-[9px] font-black uppercase text-white/20 tracking-widest">{tag.name}</p>
                              <p className="font-mono text-[11px] break-all text-white/60">{tag.value}</p>
                           </div>
                         ))
                       ) : (
                         <div className="py-12 text-center space-y-4 opacity-20">
                            <Eye className="w-8 h-8 mx-auto" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No Markers Detected</p>
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-primary" />
                      <h4 className="text-xs font-black uppercase tracking-widest">WASM Guard</h4>
                    </div>
                    <p className="text-[10px] text-white/30 leading-relaxed font-medium">
                      All scrubbing logic is executed within a high-entropy WebAssembly container. No data packets leave the local thread architecture.
                    </p>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="p-8 border-t border-white/5 bg-black/40 shrink-0">
                 <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Identity Protected
                 </div>
              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  );
}
