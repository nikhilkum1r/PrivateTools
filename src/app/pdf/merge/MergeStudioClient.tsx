"use client";

import React, { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  FileText, Trash2, Loader2, FileDown, Zap, Plus,
  GripVertical, Files, ImageIcon, Layers,
  ShieldCheck, DownloadCloud, Monitor, 
  Settings2, Info, Layout, Smartphone, Play, CheckCircle2
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExportManager } from "@/lib/export-manager";

interface PDFFile {
  id: string;
  file: File;
  status: "idle" | "processing" | "completed" | "error";
  previewUrl?: string;
  pageCount?: number;
}

export default function MergeStudioClient() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  const addFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.filter(
      f => f.type === "application/pdf" || f.type.startsWith("image/")
    );

    const mapped = await Promise.all(validFiles.map(async f => {
      let pageCount: number | undefined;
      if (f.type === "application/pdf") {
        try {
          const buf = await f.arrayBuffer();
          const doc = await PDFDocument.load(buf);
          pageCount = doc.getPageCount();
        } catch {}
      }
      return {
        id: Math.random().toString(36).substring(7),
        file: f,
        status: "idle" as const,
        previewUrl: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
        pageCount,
      };
    }));

    setFiles(prev => [...prev, ...mapped]);
    if (!selectedId && mapped.length > 0) setSelectedId(mapped[0].id);
    setMergedUrl(null);
    toast.success(`${mapped.length} asset${mapped.length > 1 ? "s" : ""} added`);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (selectedId === id) setSelectedId(null);
    setMergedUrl(null);
  };

  const processDocuments = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setProgressLabel("Initializing WASM engine...");

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        const file = fileData.file;
        const pct = Math.round(((i) / files.length) * 85);
        setProgress(pct);
        setProgressLabel(`Processing ${file.name}...`);

        setFiles(prev => prev.map(f => f.id === fileData.id ? { ...f, status: "processing" } : f));

        if (file.type === "application/pdf") {
          const fileBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(fileBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach(page => mergedPdf.addPage(page));
        } else if (file.type.startsWith("image/")) {
          const fileBuffer = await file.arrayBuffer();
          let image;
          if (file.type === "image/jpeg" || file.type === "image/jpg") {
            image = await mergedPdf.embedJpg(fileBuffer);
          } else if (file.type === "image/png") {
            image = await mergedPdf.embedPng(fileBuffer);
          } else {
            const img = new Image();
            const url = URL.createObjectURL(file);
            await new Promise(resolve => { img.onload = resolve; img.src = url; });
            const canvas = document.createElement("canvas");
            canvas.width = img.width; canvas.height = img.height;
            canvas.getContext("2d")?.drawImage(img, 0, 0);
            const pngBuffer = await (await fetch(canvas.toDataURL("image/png"))).arrayBuffer();
            image = await mergedPdf.embedPng(pngBuffer);
            URL.revokeObjectURL(url);
          }
          if (image) {
            const page = mergedPdf.addPage([image.width, image.height]);
            page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
          }
        }
        setFiles(prev => prev.map(f => f.id === fileData.id ? { ...f, status: "completed" } : f));
      }

      setProgress(95);
      setProgressLabel("Finalizing document...");
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
      setMergedUrl(URL.createObjectURL(blob));
      setProgress(100);
      setProgressLabel("Complete!");
      toast.success(`${files.length} assets assembled successfully`);
    } catch (e) {
      console.error("Document processing failed", e);
      toast.error("Assembly failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const currentFile = files.find(f => f.id === selectedId);
  const totalPages = files.reduce((acc, f) => acc + (f.pageCount ?? 1), 0);
  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[#050505] text-white overflow-y-auto lg:overflow-hidden selection:bg-primary/30 custom-scrollbar">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-visible lg:overflow-hidden relative scrollbar-hide">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-600/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`, backgroundSize: '48px 48px' }} />
        </div>

        {/* Left Sidebar */}
        <aside className="flex w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                <Files className="w-4 h-4" /> Identity Engine
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none">Multi-Platform Asset Matrix</p>
                <div className="flex gap-1.5 opacity-30">
                  <Play className="w-2 h-2 text-primary fill-primary" />
                  <div className="w-2 h-2 rounded-full border border-white/40" />
                  <Smartphone className="w-2 h-2 text-white" />
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 text-white/40 px-3 py-1 rounded-full font-black italic">{files.length} NODES</Badge>
          </div>
          
          <ScrollArea className="flex-grow min-h-0">
            <div className="p-3 space-y-1.5">
              <AnimatePresence mode="popLayout">
                {files.length > 0 ? (
                  <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-1.5">
                    {files.map((f, i) => (
                      <Reorder.Item key={f.id} value={f}>
                        <motion.div
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          onClick={() => setSelectedId(f.id)}
                          className={cn(
                            "group p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3",
                            selectedId === f.id
                              ? "bg-primary/10 border-primary/30"
                              : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                          )}
                        >
                          <div className="text-muted-foreground cursor-grab active:cursor-grabbing opacity-20 group-hover:opacity-60 transition-opacity shrink-0">
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/5 relative",
                            f.file.type === "application/pdf" ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"
                          )}>
                            {f.status === "processing" && <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse" />}
                            {f.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
                              f.file.type === "application/pdf" ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-[11px] font-bold truncate leading-tight">{f.file.name}</p>
                            <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mt-0.5">
                              {f.pageCount ? `${f.pageCount}p` : "img"} • {((f.file.size) / 1024).toFixed(0)}KB
                            </p>
                          </div>
                          <span className="text-[9px] font-black text-white/10 shrink-0">#{i + 1}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                            onClick={e => { e.stopPropagation(); removeFile(f.id); }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </motion.div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                ) : (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-14 h-14 rounded-[2rem] bg-white/5 border border-dashed border-white/10 flex items-center justify-center mx-auto opacity-20">
                      <FileText className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No assets loaded</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-white/5 bg-black/40 shrink-0 space-y-3">
            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Files", value: files.length },
                  { label: "Pages", value: totalPages },
                  { label: "Size", value: totalSize > 1048576 ? `${(totalSize/1048576).toFixed(1)}M` : `${(totalSize/1024).toFixed(0)}K` },
                ].map(s => (
                  <div key={s.label} className="p-2 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20">{s.label}</p>
                    <p className="text-sm font-black tabular-nums mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>
            )}
            <Button
              className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-2xl font-black uppercase tracking-widest h-12 group transition-all active:scale-95"
              onClick={() => document.getElementById('pdf-add-btn')?.click()}
            >
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
              Add Assets
              <input id="pdf-add-btn" type="file" className="hidden" multiple accept=".pdf,image/*" onChange={e => addFiles(Array.from(e.target.files || []))} />
            </Button>
          </div>
        </aside>

        {/* Center */}
        <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[700px] lg:min-h-0 h-full max-h-full">
          <header className="p-4 md:p-8 flex items-center justify-between bg-black/40 backdrop-blur-3xl border-b border-white/5 relative z-20 gap-4">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] bg-gradient-to-br from-red-600 via-red-500 to-primary flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(239,68,68,0.2)]">
                <FileText className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h2 className="font-black text-xl md:text-2xl tracking-tighter uppercase italic text-white">Document Architect</h2>
                <div className="flex items-center gap-3 mt-1">
                  <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 px-3 py-0.5 rounded-full font-black uppercase tracking-[0.15em] italic">Localized Assembly</Badge>
                  <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">{files.length} Assets</span>
                </div>
              </div>
            </div>
          </header>

          {isProcessing && (
            <div className="px-8 pt-6 shrink-0 relative z-10">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">{progressLabel}</p>
                  <span className="text-[10px] font-black tabular-nums text-primary">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-white/10" />
              </div>
            </div>
          )}

          <div className="flex-grow relative flex items-center justify-center p-8 lg:p-16">
            <AnimatePresence mode="wait">
              {mergedUrl ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full space-y-8 text-center">
                  <div className="aspect-[3/4] w-full max-w-xs mx-auto bg-white/[0.03] rounded-[3rem] border border-emerald-500/30 shadow-[0_50px_100px_-20px_rgba(16,185,129,0.2)] flex flex-col items-center justify-center gap-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black uppercase">Assembled</h3>
                      <p className="text-white/40 text-sm font-medium">{files.length} assets • {totalPages} pages</p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-3">
                    <Button
                      className="h-14 px-10 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black text-base shadow-xl shadow-primary/20 gap-3 active:scale-95 transition-all"
                      onClick={async () => {
                        const response = await fetch(mergedUrl);
                        const blob = await response.blob();
                        await ExportManager.downloadFile(blob, "studio-merged-doc.pdf");
                      }}
                    >
                      <DownloadCloud className="w-5 h-5" /> Download PDF
                    </Button>
                    <Button variant="outline" className="h-14 px-8 rounded-[2rem] border-white/10 font-bold hover:bg-white/5" onClick={() => { setMergedUrl(null); setFiles(prev => prev.map(f => ({ ...f, status: "idle" }))); }}>
                      Edit Sequence
                    </Button>
                  </div>
                </motion.div>
              ) : currentFile ? (
                <motion.div key={currentFile.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-6 flex flex-col items-center">
                  <div className="aspect-[3/4] w-full max-w-xs bg-white/[0.02] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative group">
                    {currentFile.previewUrl ? (
                      <img src={currentFile.previewUrl} className="w-full h-full object-contain" alt="" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-20">
                        <FileText className="w-16 h-16" />
                        <span className="text-xs font-black uppercase tracking-widest">PDF Document</span>
                        {currentFile.pageCount && <Badge className="bg-white/10 text-white/60">{currentFile.pageCount} pages</Badge>}
                      </div>
                    )}
                  </div>
                  <div className="text-center space-y-1">
                    <h2 className="text-lg font-black uppercase tracking-tight truncate max-w-xs">{currentFile.file.name}</h2>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">
                      {currentFile.pageCount ? `${currentFile.pageCount} pages` : "Image asset"} • {((currentFile.file.size) / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center space-y-8 max-w-sm">
                  <div className="w-28 h-28 rounded-[3rem] bg-gradient-to-br from-red-500/20 to-primary/20 border border-white/10 flex items-center justify-center mx-auto">
                    <Layout className="w-12 h-12 text-white/20" />
                  </div>

                  <DropZone onFilesDrop={addFiles} accept=".pdf,image/*" multiple title=" " className="h-40 border-dashed border-white/10 bg-white/[0.02] rounded-[2rem] hover:bg-white/[0.05] transition-all" />
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="flex w-full lg:w-[360px] border-t lg:border-t-0 lg:border-l border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl shrink-0 flex-col relative z-10 shadow-2xl h-[500px] lg:h-full">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                <Settings2 className="w-4 h-4" /> Studio Matrix
              </h3>
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none mt-1">WASM Thread Execution</p>
            </div>
            <Badge variant="outline" className="text-[10px] border-primary/20 bg-primary/5 text-primary uppercase font-black px-3 py-1 rounded-full italic">ACTIVE</Badge>
          </div>

          <ScrollArea className="flex-grow min-h-0">
            <div className="p-5 space-y-6">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Files", value: files.length, icon: Files },
                  { label: "Pages", value: totalPages, icon: FileDown },
                  { label: "Size", value: totalSize > 1048576 ? `${(totalSize/1048576).toFixed(1)}M` : `${(totalSize/1024).toFixed(0)}K`, icon: Layers },
                  { label: "Status", value: isProcessing ? "PROC." : mergedUrl ? "DONE" : "READY", icon: Zap },
                ].map(s => (
                  <div key={s.label} className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/20">{s.label}</p>
                    <p className="text-base font-black tabular-nums">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <h4 className="text-xs font-black uppercase tracking-widest">Privacy Shield</h4>
                </div>
                <p className="text-[10px] text-white/30 leading-relaxed font-medium">
                  Assembly runs entirely in your browser via pdf-lib WASM. No files are uploaded or transmitted.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" /> Assembly Notes
                </p>
                <ul className="space-y-2">
                  {[
                    "Drag handles to reorder pages",
                    "Supports PDF + PNG/JPG/WEBP",
                    "Images auto-fit to page size",
                    "Original quality preserved",
                  ].map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-[10px] text-white/30 font-medium">
                      <span className="text-primary mt-0.5">•</span> {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>

          <div className="p-5 border-t border-white/5 bg-black/40 shrink-0 space-y-3">
            <Button
              className="w-full h-14 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-white font-black text-base gap-3 shadow-[0_10px_40px_rgba(var(--primary-rgb),0.3)] group active:scale-95 transition-all italic"
              onClick={processDocuments}
              disabled={files.length === 0 || isProcessing}
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />}
              {isProcessing ? progressLabel || "Assembling..." : "Assemble PDF"}
            </Button>
            <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/15">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Local Processing
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={cn("block text-sm font-medium", className)}>{children}</label>;
}
