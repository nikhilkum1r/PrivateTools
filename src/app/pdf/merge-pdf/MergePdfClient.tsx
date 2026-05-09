"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  FileText, Trash2, Loader2, Zap, Plus,
  GripVertical, ImageIcon, Layers,
  ShieldCheck, DownloadCloud, Monitor, 
  Settings2, Eye, Layout, Smartphone, CheckCircle2,
  Lock, Search, Cpu, Database, Play, Link as LinkIcon, AlertTriangle, Briefcase
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExportManager } from "@/lib/export-manager";
import { FAQ } from "@/components/shared/FAQ";
import Link from "next/link";

interface PDFFile {
  id: string;
  file: File;
  status: "idle" | "processing" | "completed" | "error";
  previewUrl?: string;
  pageCount?: number;
}

export default function MergePdfClient() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
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
    setMergedUrl(null);
    setMergedBlob(null);
    toast.success(`${mapped.length} file${mapped.length > 1 ? "s" : ""} added`);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setMergedUrl(null);
    setMergedBlob(null);
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
      setMergedBlob(blob);
      setMergedUrl(URL.createObjectURL(blob));
      setProgress(100);
      setProgressLabel("Complete!");
      toast.success(`${files.length} files merged successfully`);
    } catch (e) {
      console.error("Document merging failed", e);
      toast.error("Merging failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setMergedUrl(null);
    setMergedBlob(null);
    setIsProcessing(false);
    setProgress(0);
  };

  const totalPages = files.reduce((acc, f) => acc + (f.pageCount ?? 1), 0);
  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      <Navbar />

      {/* Cyber/Terminal Aesthetic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="flex-grow relative z-10">
        {/* HERO SECTION */}
        <section className="pt-24 pb-12 px-4 container mx-auto text-center max-w-4xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(59,130,246,0.1)]">
              <Layers className="w-10 h-10 text-blue-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-foreground">
                Merge PDF Files
              </h1>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto">
                Combine multiple PDF files securely using browser-based local processing with privacy-first protection.
              </p>
              <p className="text-sm font-medium text-emerald-400 bg-emerald-500/10 inline-block px-4 py-2 rounded-full border border-emerald-500/20">
                Combine PDF documents securely without uploading files to external servers.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                { icon: Lock, text: "Local Processing" },
                { icon: ShieldCheck, text: "Zero Upload" },
                { icon: Search, text: "No Tracking" },
                { icon: Zap, text: "Fast PDF Merging" },
                { icon: Cpu, text: "Browser-Based" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card bg-secondary/30 border border-border">
                  <badge.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* INTERACTIVE MERGE STUDIO */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="glass-card rounded-[40px] border border-border shadow-2xl glass-card bg-secondary/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-black/20 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> Assembly Studio
              </h3>
              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-blue-500/30 text-blue-400 bg-blue-500/10">
                WASM ACTIVE
              </Badge>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {files.length === 0 ? (
                <DropZone 
                  onFilesDrop={addFiles} 
                  accept=".pdf,image/*"
                  multiple={true} 
                  className="h-64 border-dashed border-blue-500/30 hover:border-blue-500/60 bg-black/20 rounded-3xl transition-colors"
                />
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  
                  {/* File List & Reordering */}
                  {!mergedUrl && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-muted-foreground">Drag and drop files to rearrange their order.</p>
                        <Button variant="outline" size="sm" className="border-border hover:bg-secondary/50 text-foreground" onClick={() => document.getElementById('pdf-add-btn')?.click()}>
                          <Plus className="w-4 h-4 mr-2" /> Add More
                          <input id="pdf-add-btn" type="file" className="hidden" multiple accept=".pdf,image/*" onChange={e => addFiles(Array.from(e.target.files || []))} />
                        </Button>
                      </div>

                      <div className="bg-black/30 rounded-3xl border border-border p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                        <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-2">
                          {files.map((f, i) => (
                            <Reorder.Item key={f.id} value={f}>
                              <div className="group p-3 rounded-2xl glass-card bg-secondary/30 border border-border flex items-center gap-4 transition-all hover:bg-secondary/50">
                                <div className="text-muted-foreground cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100 shrink-0">
                                  <GripVertical className="w-5 h-5" />
                                </div>
                                <div className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                                  f.file.type === "application/pdf" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                )}>
                                  {f.file.type === "application/pdf" ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                                </div>
                                <div className="flex-grow min-w-0">
                                  <p className="text-sm font-bold truncate text-foreground">{f.file.name}</p>
                                  <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                                    {f.pageCount ? `${f.pageCount} pages` : "Image"} • {((f.file.size) / 1024).toFixed(0)} KB
                                  </p>
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 shrink-0" onClick={() => removeFile(f.id)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </Reorder.Item>
                          ))}
                        </Reorder.Group>
                      </div>
                    </div>
                  )}

                  {/* Progress & Actions */}
                  {!mergedUrl && (
                    <div className="space-y-4">
                      {isProcessing && (
                        <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">{progressLabel}</p>
                            <span className="text-[10px] font-black tabular-nums text-blue-400">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2 bg-blue-950 [&>div]:bg-blue-500" />
                        </div>
                      )}

                      <button
                        className="w-full h-14 rounded-2xl font-black italic text-lg gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-foreground shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        onClick={processDocuments}
                        disabled={isProcessing || files.length < 2}
                      >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Layers className="w-5 h-5" />}
                        {isProcessing ? "M E R G I N G . . ." : files.length < 2 ? "A D D   M O R E   F I L E S" : "M E R G E   P D F"}
                      </button>
                    </div>
                  )}

                  {/* Result Panel */}
                  {mergedUrl && mergedBlob && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <ExportPanel
                        blob={mergedBlob}
                        filename="SafeTools_Merged.pdf"
                        inputSize={totalSize}
                        onReset={handleReset}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* EDUCATIONAL & SEO CONTENT */}
        <div className="container mx-auto px-4 max-w-5xl py-12 space-y-20">
          
          {/* Main Features */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-foreground">PDF Merge Features</h2>
              <p className="text-muted-foreground font-medium">Enterprise-grade local document assembly.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { title: "Merge unlimited PDFs", icon: Layers },
                { title: "Drag-and-drop", icon: GripVertical },
                { title: "Reorder visually", icon: Layout },
                { title: "Browser processing", icon: Cpu },
                { title: "Instant downloads", icon: DownloadCloud },
                { title: "Batch merging", icon: Database },
                { title: "Offline capable", icon: Zap },
                { title: "Secure local handling", icon: ShieldCheck },
                { title: "Fast performance", icon: Monitor },
                { title: "Mobile-friendly", icon: Smartphone }
              ].map((Feature, i) => (
                <div key={i} className="p-4 rounded-2xl glass-card bg-secondary/30 border border-border flex flex-col items-center text-center gap-3">
                  <Feature.icon className="w-6 h-6 text-blue-500" />
                  <span className="text-sm font-bold leading-tight text-foreground">{Feature.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Educational & Privacy */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><FileText className="text-blue-500 w-6 h-6" /> What Is PDF Merging?</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                PDF merging combines multiple PDF documents into a single organized file for easier sharing, printing, and document management. SafeTools allows you to arrange pages exactly how you need them.
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Lock className="text-emerald-500 w-6 h-6" /> Privacy-First PDF Processing</h2>
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-400 font-medium">
                <ul className="space-y-2 list-disc pl-4 marker:text-emerald-500">
                  <li>Local browser processing</li>
                  <li>No cloud uploads</li>
                  <li>No stored documents</li>
                  <li>Secure temporary memory usage</li>
                  <li>Zero tracking</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How It Works & Reordering */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 p-8 rounded-[2rem] border border-border glass-card bg-secondary/30">
              <h3 className="text-xl font-black uppercase italic text-foreground flex items-center gap-2"><Play className="w-5 h-5 text-blue-500" /> How PDF Merging Works</h3>
              <ol className="space-y-4 list-decimal pl-5 text-muted-foreground font-medium marker:text-blue-500 marker:font-black">
                <li>Upload PDF files locally</li>
                <li>Arrange document order</li>
                <li>Merge PDFs securely</li>
                <li>Download combined PDF instantly</li>
              </ol>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-sm font-bold">
                Files are processed entirely inside your browser.
              </div>
            </div>

            <div className="space-y-6 p-8 rounded-[2rem] border border-border glass-card bg-secondary/30">
              <h3 className="text-xl font-black uppercase italic text-foreground flex items-center gap-2"><Layout className="w-5 h-5 text-emerald-500" /> Organize PDFs Before Merging</h3>
              <div className="space-y-3 text-muted-foreground font-medium">
                <p>Prepare your perfect document with our visual studio tools:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Drag-and-drop ordering</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Page arrangement</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> File previews</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Remove unwanted files</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Use Cases & Performance */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Briefcase className="w-6 h-6 text-blue-500" /> Common Use Cases</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Business reports", "Research papers",
                    "Legal documents", "Student assignments",
                    "Contracts", "Invoices",
                    "Portfolio creation", "Presentation packaging"
                  ].map(use => (
                    <div key={use} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {use}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Zap className="w-6 h-6 text-emerald-500" /> Fast Browser Processing</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                <ul className="space-y-2 list-disc pl-4 marker:text-emerald-500">
                  <li>Lightweight architecture</li>
                  <li>No upload waiting</li>
                  <li>Instant merging</li>
                  <li>Optimized performance</li>
                  <li>Mobile compatibility</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Security & Offline */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><ShieldCheck className="text-emerald-500 w-6 h-6" /> Secure PDF Handling</h2>
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-400 font-medium">
                We strictly enforce local memory processing. There is no server retention, meaning temporary handling ensures automatic cleanup the moment you close the tab.
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Smartphone className="text-blue-500 w-6 h-6" /> Works Offline</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                SafeTools features comprehensive PWA support. Experience true offline PDF merging with zero internet dependency and reduced data exposure.
              </div>
            </div>
          </section>

          {/* Advanced Capabilities & Limits */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><ImageIcon className="text-blue-500 w-6 h-6" /> Supported Formats</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                We don't just merge PDF files. SafeTools supports embedding various image formats directly into your document. Currently supported formats include <strong>PDF, PNG, JPG, JPEG, and WEBP</strong>. Images are automatically fitted to the page layout for a seamless reading experience.
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Zap className="text-emerald-500 w-6 h-6" /> Zero File Size Limits</h2>
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-400 font-medium">
                Because everything happens in your local browser environment, there are no artificial file size limits. Merge 10MB or 1GB files without encountering paywalls or upload restrictions—your only limitation is your device's RAM capacity.
              </div>
            </div>
          </section>

          {/* Future Roadmap */}
          <section className="p-8 rounded-[2rem] border border-border glass-card bg-secondary/30 space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Settings2 className="w-6 h-6 text-blue-500" /> Advanced Future Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { name: "Page-level merge editing" },
                { name: "Compression during merge" },
                { name: "OCR integration" },
                { name: "AI document sorting" },
                { name: "Split & merge workflows" },
                { name: "Encrypted merging" },
                { name: "Thumbnail previews" },
                { name: "Collaborative workflows" }
              ].map(feat => (
                <div key={feat.name} className="p-4 rounded-xl border border-border bg-black/30">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{feat.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison Table */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-center text-foreground">Why Use SafeTools PDF Merge?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse glass-card bg-secondary/30 rounded-3xl overflow-hidden border border-border shadow-sm">
                <thead>
                  <tr className="bg-black/30">
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-foreground">Feature</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-muted-foreground">Traditional PDF Sites</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-blue-400 bg-blue-500/5">SafeTools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm font-medium">
                  <tr>
                    <td className="p-4 text-foreground">Upload Required</td>
                    <td className="p-4 text-muted-foreground">Usually</td>
                    <td className="p-4 text-blue-400 bg-blue-500/5 font-bold">No</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Local Processing</td>
                    <td className="p-4 text-muted-foreground">Rare</td>
                    <td className="p-4 text-blue-400 bg-blue-500/5 font-bold">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Tracking Scripts</td>
                    <td className="p-4 text-muted-foreground">Often</td>
                    <td className="p-4 text-blue-400 bg-blue-500/5 font-bold">No</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Browser-Based</td>
                    <td className="p-4 text-muted-foreground">Partial</td>
                    <td className="p-4 text-blue-400 bg-blue-500/5 font-bold">Full</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Privacy Focused</td>
                    <td className="p-4 text-muted-foreground">Limited</td>
                    <td className="p-4 text-blue-400 bg-blue-500/5 font-bold">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <FAQ 
            items={[
              { question: "Are PDF files uploaded to servers?", answer: "No. All PDF merging happens locally inside your browser." },
              { question: "Can I merge large PDF files?", answer: "Yes. Performance depends on device memory and browser capabilities." },
              { question: "Does this tool work offline?", answer: "Yes. Offline support can be enabled through PWA functionality." },
              { question: "Can SafeTools access my PDFs?", answer: "No. Files remain locally processed and are never stored." },
              { question: "Can I rearrange PDF order?", answer: "Yes. Drag-and-drop reordering is fully supported." }
            ]}
          />

          {/* Related Tools */}
          <section className="space-y-6 text-center border-t border-border pt-16">
            <h2 className="text-2xl font-black text-foreground">Related Privacy Tools</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "PDF Split", href: "/pdf/split-pdf" },
                { name: "PDF Compress", href: "/pdf/compress-pdf" },
                { name: "PDF Unlock", href: "/pdf/unlock-pdf" },
                { name: "PDF Encrypt", href: "/pdf/encrypt" },
                { name: "PDF to Image", href: "/pdf/to-image" },
                { name: "File Shredder", href: "/security/file-shredder" }
              ].map(tool => (
                <Link key={tool.href} href={tool.href} className="px-5 py-2.5 rounded-full glass-card bg-secondary/30 hover:bg-blue-600 hover:text-foreground border border-border hover:border-blue-600 transition-colors font-bold text-sm text-foreground">
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Privacy Manifesto */}
          <section className="text-center max-w-2xl mx-auto space-y-4 pb-12">
            <ShieldCheck className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground">Privacy-First Document Processing</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
              "SafeTools develops browser-based document tools designed to maximize privacy, speed, and user control. Fast, privacy-first PDF tools designed for secure browser-based document workflows."
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
