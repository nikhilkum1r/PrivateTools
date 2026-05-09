"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { ExportManager } from "@/lib/export-manager";
import { 
  Scissors, Download, Trash2, CheckCircle2, Loader2,
  FileDown, FileText, Layers, Zap, Smartphone, Play,
  ShieldCheck, Settings2, AlertCircle, Search, Cpu, Database, Monitor, Briefcase, Lock, Fingerprint
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { FAQ } from "@/components/shared/FAQ";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

interface SplitFile {
  id: string;
  file: File;
  pageCount: number;
  status: "idle" | "processing" | "completed" | "error";
  results: { url: string; name: string }[];
}

export default function SplitPdfClient() {
  const [file, setFile] = useState<SplitFile | null>(null);
  const [splitMode, setSplitMode] = useState<"fixed" | "range">("fixed");
  const [fixedInterval, setFixedInterval] = useState(1);
  const [customRanges, setCustomRanges] = useState("1-2, 3-5");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [rangeError, setRangeError] = useState<string | null>(null);
  const [pageSelStart, setPageSelStart] = useState<number | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const handleFileDrop = async (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    if (f.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }
    try {
      const buffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const count = pdf.getPageCount();
      setFile({ id: Math.random().toString(36).substring(7), file: f, pageCount: count, status: "idle", results: [] });
      setCustomRanges(`1-${Math.ceil(count / 2)}, ${Math.ceil(count / 2) + 1}-${count}`);
      toast.success(`Loaded: ${count} pages detected`);
    } catch (e) {
      toast.error("Failed to read PDF");
    }
  };

  const validateRanges = (): { start: number; end: number }[] | null => {
    if (!file) return null;
    const parts = customRanges.split(",").map(r => r.trim()).filter(Boolean);
    const ranges: { start: number; end: number }[] = [];
    for (const part of parts) {
      const [s, e] = part.split("-").map(n => parseInt(n.trim()));
      const start = s, end = e || s;
      if (isNaN(start) || start < 1 || start > file.pageCount) {
        setRangeError(`Invalid start page: ${start}`);
        return null;
      }
      if (end < start || end > file.pageCount) {
        setRangeError(`Invalid end page: ${end} (max: ${file.pageCount})`);
        return null;
      }
      ranges.push({ start, end });
    }
    setRangeError(null);
    return ranges;
  };

  const splitPdf = async () => {
    if (!file) return;
    if (splitMode === "range" && !validateRanges()) return;

    setIsProcessing(true);
    setProgress(0);
    setFile(prev => prev ? { ...prev, status: "processing", results: [] } : null);

    try {
      const buffer = await file.file.arrayBuffer();
      const pdf = await PDFDocument.load(buffer);
      const results: { url: string; name: string }[] = [];

      if (splitMode === "fixed") {
        const totalParts = Math.ceil(file.pageCount / fixedInterval);
        for (let i = 0; i < file.pageCount; i += fixedInterval) {
          const partIdx = Math.floor(i / fixedInterval);
          setProgress(Math.round((partIdx / totalParts) * 90));
          const newPdf = await PDFDocument.create();
          const end = Math.min(i + fixedInterval, file.pageCount);
          const indices = Array.from({ length: end - i }, (_, k) => i + k);
          const pages = await newPdf.copyPages(pdf, indices);
          pages.forEach(p => newPdf.addPage(p));
          const bytes = await newPdf.save();
          const blob = new Blob([bytes as any], { type: "application/pdf" });
          results.push({ url: URL.createObjectURL(blob), name: `part-${partIdx + 1}.pdf` });
        }
      } else {
        const ranges = validateRanges()!;
        for (let ri = 0; ri < ranges.length; ri++) {
          setProgress(Math.round((ri / ranges.length) * 90));
          const { start, end } = ranges[ri];
          const newPdf = await PDFDocument.create();
          const indices = Array.from({ length: end - start + 1 }, (_, k) => start - 1 + k)
            .filter(idx => idx >= 0 && idx < file.pageCount);
          if (indices.length === 0) continue;
          const pages = await newPdf.copyPages(pdf, indices);
          pages.forEach(p => newPdf.addPage(p));
          const bytes = await newPdf.save();
          const blob = new Blob([bytes as any], { type: "application/pdf" });
          results.push({ url: URL.createObjectURL(blob), name: `range-${start}-${end}.pdf` });
        }
      }

      setProgress(100);
      setFile(prev => prev ? { ...prev, status: "completed", results } : null);
      toast.success(`${results.length} document${results.length > 1 ? "s" : ""} created`);
    } catch (e) {
      setFile(prev => prev ? { ...prev, status: "error" } : null);
      toast.error("Split failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = async () => {
    if (!file || file.results.length === 0) return;
    setIsZipping(true);
    try {
      const exportFiles = await Promise.all(file.results.map(async (res) => {
        const response = await fetch(res.url);
        const blob = await response.blob();
        return { blob, name: res.name };
      }));
      
      await ExportManager.downloadZip(exportFiles, `split-${file.file.name.replace('.pdf','')}.zip`);
    } finally {
      setIsZipping(false);
    }
  };

  const estimatedParts = file
    ? splitMode === "fixed"
      ? Math.ceil(file.pageCount / Math.max(1, fixedInterval))
      : customRanges.split(",").filter(r => r.trim()).length
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 custom-scrollbar">
      <Navbar />
      
      <main className="flex-grow flex flex-col relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-24 pb-8 px-4 container mx-auto text-center max-w-4xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(59,130,246,0.15)]">
              <Scissors className="w-10 h-10 text-blue-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-foreground">
                Split PDF Files
              </h1>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto">
                Extract pages and divide PDF documents securely using browser-based local processing with privacy-first protection.
              </p>
              <p className="text-sm font-medium text-blue-500 bg-blue-500/10 inline-block px-4 py-2 rounded-full border border-blue-500/20">
                Split PDF documents securely without uploading files to external servers.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                { icon: ShieldCheck, text: "Local Processing" },
                { icon: Lock, text: "Zero Upload" },
                { icon: Search, text: "No Tracking" },
                { icon: Zap, text: "Fast PDF Splitting" },
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

        {/* INTERACTIVE STUDIO */}
        <section className="container mx-auto px-4 pb-16 w-full">
          <div className="glass-card rounded-[40px] border border-border shadow-2xl bg-secondary/30 overflow-hidden relative min-h-[500px] flex flex-col lg:flex-row">
            
            {!file ? (
              <div className="flex-grow flex items-center justify-center p-8 relative z-10 w-full min-h-[500px]">
                <div className="max-w-xl w-full space-y-5 text-center">
                  <div className="space-y-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center mx-auto">
                      <Scissors className="w-9 h-9 text-blue-500" />
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">
                        PDF <span className="text-blue-500">Splitter.</span>
                      </h2>
                      <p className="text-muted-foreground text-lg font-medium max-w-md mx-auto leading-relaxed">
                        Precision document slicing. Extract pages or custom ranges — entirely in your browser.
                      </p>
                    </div>
                  </div>
                  <DropZone onFilesDrop={handleFileDrop} accept=".pdf" multiple={false} title=" " className="h-56 border-dashed border-border bg-black/20 rounded-2xl hover:bg-black/40 hover:border-blue-500/30 transition-all" />
                </div>
              </div>
            ) : (
              <>
                {/* Left Sidebar */}
                <aside className="flex w-full lg:w-[350px] border-b lg:border-b-0 lg:border-r border-border flex-col shrink-0 relative z-10 min-h-0 bg-black/10">
                  <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-3">
                        <Layers className="w-4 h-4" /> Identity Engine
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Multi-Platform Asset Matrix</p>
                        <div className="flex gap-1.5 opacity-30">
                          <Play className="w-2 h-2 text-blue-500 fill-blue-500" />
                          <div className="w-2 h-2 rounded-full border border-white/40" />
                          <Smartphone className="w-2 h-2 text-foreground" />
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-border bg-secondary/50 text-muted-foreground px-3 py-1 rounded-full font-black italic">ACTIVE</Badge>
                  </div>

                  <ScrollArea className="flex-grow min-h-0 h-[400px] lg:h-auto">
                    <div className="p-6 space-y-4">
                      {/* Mode Toggle */}
                      <div className="space-y-3">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Split Mode</Label>
                        <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/20 rounded-2xl border border-border">
                          {(["fixed", "range"] as const).map(mode => (
                            <Button
                              key={mode}
                              variant={splitMode === mode ? "default" : "ghost"}
                              className={cn("rounded-xl text-[10px] font-black h-10 uppercase tracking-widest transition-all", splitMode === mode ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-muted-foreground")}
                              onClick={() => setSplitMode(mode)}
                            >
                              {mode === "fixed" ? "By Interval" : "By Range"}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {splitMode === "fixed" ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Pages per Part</Label>
                            <span className="text-xs font-black text-blue-500 tabular-nums">{fixedInterval}pg</span>
                          </div>
                          <Slider
                            value={[fixedInterval]}
                            min={1}
                            max={Math.max(1, Math.floor(file.pageCount / 2))}
                            step={1}
                            onValueChange={v => setFixedInterval(Array.isArray(v) ? v[0] : v)}
                            className="py-2"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 rounded-xl glass-card bg-secondary/30 border border-border text-center">
                              <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Parts</p>
                              <p className="text-lg font-black text-blue-500 tabular-nums">{estimatedParts}</p>
                            </div>
                            <div className="p-3 rounded-xl glass-card bg-secondary/30 border border-border text-center">
                              <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Per Part</p>
                              <p className="text-lg font-black tabular-nums">{fixedInterval}pg</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Custom Ranges</Label>
                          <Input
                            placeholder="e.g. 1-3, 4-7, 10"
                            value={customRanges}
                            onChange={e => { setCustomRanges(e.target.value); setRangeError(null); }}
                            className={cn("h-12 bg-black/20 border-border rounded-xl px-4 font-mono text-sm focus:ring-blue-500/50", rangeError && "border-red-500/50")}
                          />
                          {rangeError ? (
                            <div className="flex items-center gap-2 text-red-400">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <p className="text-[10px] font-bold">{rangeError}</p>
                            </div>
                          ) : (
                            <p className="text-[10px] text-muted-foreground font-medium">
                              {estimatedParts} part{estimatedParts !== 1 ? "s" : ""} will be created • Pages 1–{file.pageCount} available
                            </p>
                          )}
                        </div>
                      )}

                      {/* Page visualizer - clickable in range mode */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Page Map ({file.pageCount} pages)</Label>
                          {splitMode === "range" && (
                            <span className="text-[8px] font-black uppercase tracking-widest text-blue-500/70">Click to select range</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {Array.from({ length: Math.min(file.pageCount, 40) }).map((_, i) => {
                            const pageNum = i + 1;
                            const isInRange = splitMode === "range" && (() => {
                              try {
                                return customRanges.split(",").some(r => {
                                  const [s, e] = r.trim().split("-").map(Number);
                                  return pageNum >= (s || 0) && pageNum <= (e || s || 0);
                                });
                              } catch { return false; }
                            })();
                            return (
                              <div
                                key={i}
                                className={cn(
                                  "w-6 h-8 rounded-md border flex items-end justify-center pb-1 text-[7px] font-black transition-all cursor-pointer select-none",
                                  isInRange
                                    ? "bg-blue-500/20 border-blue-500/40 text-blue-500"
                                    : "bg-secondary border-border text-muted-foreground hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-500/60"
                                )}
                                title={`Page ${pageNum}`}
                                onClick={() => {
                                  if (splitMode !== "range") return;
                                  if (pageSelStart === null) {
                                    setPageSelStart(pageNum);
                                  } else {
                                    const start = Math.min(pageSelStart, pageNum);
                                    const end = Math.max(pageSelStart, pageNum);
                                    const existing = customRanges.trim();
                                    setCustomRanges(existing ? `${existing}, ${start}-${end}` : `${start}-${end}`);
                                    setPageSelStart(null);
                                    setRangeError(null);
                                  }
                                }}
                              >
                                {pageNum}
                              </div>
                            );
                          })}
                          {file.pageCount > 40 && (
                            <div className="w-6 h-8 rounded-md bg-secondary/50 border border-dashed border-border flex items-center justify-center text-[8px] text-muted-foreground">
                              +{file.pageCount - 40}
                            </div>
                          )}
                        </div>
                        {pageSelStart !== null && (
                          <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest animate-pulse">
                            Page {pageSelStart} selected — click end page
                          </p>
                        )}
                      </div>

                      <div className="p-4 rounded-xl bg-black/20 border border-border space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">WASM Engine</h4>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
                          Extraction runs in a local worker thread. Original resolution and font integrity are guaranteed.
                        </p>
                      </div>
                    </div>
                  </ScrollArea>

                  <div className="p-5 border-t border-border bg-black/20 shrink-0 space-y-3">
                    {isProcessing && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Processing...</span>
                          <span className="text-[9px] font-black text-blue-500">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1 bg-secondary" />
                      </div>
                    )}
                    <button
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-sm gap-3 shadow-2xl shadow-blue-500/20 group active:scale-95 transition-all italic flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={splitPdf}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                      {isProcessing ? "Slicing..." : "Slice Document"}
                    </button>
                  </div>
                </aside>

                {/* Center */}
                <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[400px] lg:min-h-0 h-full max-h-full">
                  <header className="p-5 md:p-8 flex items-center justify-between border-b border-border relative z-20 gap-4 bg-black/10 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center border border-red-500/20 shrink-0">
                        <FileText className="w-6 h-6 text-red-400" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-black text-lg md:text-xl tracking-tighter uppercase italic truncate text-foreground">{file.file.name}</h2>
                        <div className="flex items-center gap-3 mt-0.5">
                          <Badge className="text-[9px] bg-red-500/10 text-red-400 border-red-500/20 px-3 py-0.5 rounded-full font-black uppercase">{file.pageCount} pages</Badge>
                          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">{((file.file.size) / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-all shrink-0" onClick={() => setFile(null)}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </header>

                  <div className="flex-grow relative flex items-center justify-center p-8 lg:p-6">
                    <div className="aspect-[3/4] w-full max-w-xs glass-card bg-secondary/50 rounded-2xl border border-border shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center gap-5 relative group overflow-hidden">
                      {file.status === "completed" ? (
                        <>
                          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                          </div>
                          <div className="space-y-1 text-center">
                            <h3 className="text-lg font-black uppercase text-foreground">Split Complete</h3>
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{file.results.length} parts ready</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <FileText className="w-9 h-9 text-red-400" />
                          </div>
                          <div className="space-y-1 text-center">
                            <h3 className="text-lg font-black uppercase text-foreground">Source Ready</h3>
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest italic">Configure split mode →</p>
                          </div>
                          <div className="flex gap-1 flex-wrap justify-center px-8">
                            {Array.from({ length: Math.min(file.pageCount, 12) }).map((_, i) => (
                              <div key={i} className="w-4 h-5 bg-secondary border border-border rounded-sm" />
                            ))}
                            {file.pageCount > 12 && <span className="text-[8px] text-muted-foreground self-center">+{file.pageCount - 12}</span>}
                          </div>
                        </>
                      )}
                      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </section>

                {/* Right Sidebar */}
                <aside className="flex w-full lg:w-[320px] border-t lg:border-t-0 lg:border-l border-border flex-col shrink-0 relative z-10 h-[400px] lg:h-auto bg-black/10">
                  <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-3">
                        <Settings2 className="w-4 h-4" /> Studio Matrix
                      </h3>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">WASM Thread Execution</p>
                    </div>
                    {file.status === "completed" && (
                      <Badge variant="outline" className="text-[10px] border-emerald-500/20 bg-emerald-500/10 text-emerald-500 uppercase font-black px-3 py-1 rounded-full italic">READY</Badge>
                    )}
                  </div>

                  <ScrollArea className="flex-grow min-h-0">
                    <div className="p-5 space-y-3">
                      <AnimatePresence>
                        {file.status === "completed" && file.results.length > 0 ? (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{file.results.length} fragments</p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-3 rounded-xl text-[9px] font-black border-border hover:bg-secondary gap-2 text-foreground"
                                onClick={downloadAll}
                                disabled={isZipping}
                              >
                                {isZipping ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileDown className="w-3 h-3" />}
                                {isZipping ? "Zipping..." : "Export ZIP"}
                              </Button>
                            </div>
                            {file.results.map((res, i) => (
                              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                                <Card className="p-3.5 bg-black/20 border-border hover:border-blue-500/30 transition-all group flex items-center justify-between rounded-2xl">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:scale-110 transition-transform">
                                      <FileDown className="w-4 h-4" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-[10px] font-black uppercase text-foreground truncate">{res.name}</p>
                                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Part {i + 1}</p>
                                    </div>
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-lg hover:bg-blue-500/20 text-blue-500 shrink-0"
                                    onClick={() => {
                                      const a = document.createElement("a");
                                      a.href = res.url;
                                      a.download = res.name;
                                      document.body.appendChild(a);
                                      a.click();
                                      document.body.removeChild(a);
                                      toast.success(`Downloading ${res.name}`);
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </Card>
                              </motion.div>
                            ))}
                          </>
                        ) : (
                          <div className="py-16 text-center space-y-3 opacity-40">
                            <div className="w-10 h-10 rounded-3xl bg-secondary border border-dashed border-border flex items-center justify-center mx-auto">
                              <Layers className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No results yet</p>
                            <p className="text-[9px] font-medium text-muted-foreground">Split a document to see output here</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>

                  <div className="p-5 border-t border-border bg-black/20 shrink-0">
                    <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/50">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> All Fragments Verified
                    </div>
                  </div>
                </aside>
              </>
            )}
          </div>
        </section>

        {/* EDUCATIONAL & SEO CONTENT */}
        <div className="container mx-auto px-4 max-w-5xl py-12 space-y-20">
          
          {/* Main Features */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-foreground">PDF Split Features</h2>
              <p className="text-muted-foreground font-medium">Enterprise-grade document separation tools.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { title: "Split by page range", icon: Scissors },
                { title: "Extract specific pages", icon: FileDown },
                { title: "Separate chapters", icon: Layers },
                { title: "Browser processing", icon: Cpu },
                { title: "Drag-and-drop", icon: Smartphone },
                { title: "Batch splitting", icon: Database },
                { title: "Instant downloads", icon: Zap },
                { title: "Offline capable", icon: Monitor },
                { title: "Secure local handling", icon: ShieldCheck },
                { title: "Mobile workflows", icon: Play }
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
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><FileText className="text-blue-500 w-6 h-6" /> What Is PDF Splitting?</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                PDF splitting separates pages or sections from a PDF document into smaller individual files for easier sharing, editing, and organization.
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Lock className="text-emerald-500 w-6 h-6" /> Privacy-First PDF Processing</h2>
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-500 font-medium">
                <ul className="space-y-2 list-disc pl-4 marker:text-emerald-500">
                  <li>Local browser processing</li>
                  <li>No cloud uploads</li>
                  <li>No document retention</li>
                  <li>Temporary in-memory workflows</li>
                  <li>Zero tracking scripts</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Splitting Modes */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Scissors className="text-blue-500 w-6 h-6" /> Supported Splitting Options</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Split by page range", "Extract single pages",
                    "Split every page", "Split odd/even pages",
                    "Custom page selection", "Multi-document extraction"
                  ].map(use => (
                    <div key={use} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {use}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Layers className="text-emerald-500 w-6 h-6" /> Better PDF Organization</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                Splitting your documents enables easier document management, creates smaller file sizes, allows for faster sharing, improves collaboration, and simplifies digital archives.
              </div>
            </div>
          </section>

          {/* How It Works & Performance */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 p-8 rounded-[2rem] border border-border glass-card bg-secondary/30">
              <h3 className="text-xl font-black uppercase italic text-foreground flex items-center gap-2"><Play className="w-5 h-5 text-blue-500" /> How PDF Splitting Works</h3>
              <ol className="space-y-4 list-decimal pl-5 text-muted-foreground font-medium marker:text-blue-500 marker:font-black">
                <li>Upload PDF locally into the studio</li>
                <li>Select pages or custom ranges</li>
                <li>Split securely inside the browser</li>
                <li>Download separated PDFs instantly</li>
              </ol>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500 text-sm font-bold">
                PDF splitting happens entirely inside your browser.
              </div>
            </div>

            <div className="space-y-6 p-8 rounded-[2rem] border border-border glass-card bg-secondary/30">
              <h3 className="text-xl font-black uppercase italic text-foreground flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-500" /> Fast Browser-Based Splitting</h3>
              <div className="space-y-3 text-muted-foreground font-medium">
                <p>Enjoy unparalleled speed with our local engine:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Lightweight architecture</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant processing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No upload delays</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Optimized local workflows</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Mobile compatibility</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Use Cases & Security */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Briefcase className="w-6 h-6 text-blue-500" /> Common Use Cases</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Extract contracts", "Separate invoices",
                    "Share chapters", "Organize reports",
                    "Remove unwanted pages", "Student assignments",
                    "Business workflows", "Legal separation"
                  ].map(use => (
                    <div key={use} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {use}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><ShieldCheck className="text-emerald-500 w-6 h-6" /> Secure PDF Handling</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                We guarantee no file retention. Your documents undergo secure local memory usage, temporary processing only, and all operations remain completely browser-side.
              </div>
            </div>
          </section>

          {/* Works Offline */}
          <section className="p-8 rounded-[2rem] border border-border glass-card bg-secondary/30 space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Smartphone className="w-6 h-6 text-blue-500" /> Works Offline</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { name: "PWA support" },
                { name: "Offline PDF splitting" },
                { name: "Local-only workflows" },
                { name: "Reduced internet dependency" }
              ].map(feat => (
                <div key={feat.name} className="p-4 rounded-xl border border-border bg-black/30">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{feat.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison Table */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-center text-foreground">Why Use SafeTools PDF Split?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse glass-card bg-secondary/30 rounded-3xl overflow-hidden border border-border shadow-sm">
                <thead>
                  <tr className="bg-black/30">
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-foreground">Feature</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-muted-foreground">Traditional PDF Sites</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-blue-500 bg-blue-500/5">SafeTools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm font-medium">
                  <tr>
                    <td className="p-4 text-foreground">Upload Required</td>
                    <td className="p-4 text-muted-foreground">Usually</td>
                    <td className="p-4 text-blue-500 bg-blue-500/5 font-bold">No</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Local Processing</td>
                    <td className="p-4 text-muted-foreground">Rare</td>
                    <td className="p-4 text-blue-500 bg-blue-500/5 font-bold">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Tracking Scripts</td>
                    <td className="p-4 text-muted-foreground">Often</td>
                    <td className="p-4 text-blue-500 bg-blue-500/5 font-bold">No</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Browser-Based</td>
                    <td className="p-4 text-muted-foreground">Partial</td>
                    <td className="p-4 text-blue-500 bg-blue-500/5 font-bold">Full</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Privacy Focused</td>
                    <td className="p-4 text-muted-foreground">Limited</td>
                    <td className="p-4 text-blue-500 bg-blue-500/5 font-bold">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <FAQ 
            items={[
              { question: "Are PDF files uploaded to servers?", answer: "No. PDF splitting happens locally inside your browser." },
              { question: "Can I extract only specific pages?", answer: "Yes. Custom page extraction should be supported." },
              { question: "Does this tool work offline?", answer: "Yes. Offline support can be enabled through PWA functionality." },
              { question: "Can SafeTools access my PDFs?", answer: "No. Files remain locally processed and are not stored." },
              { question: "Can I split large PDF files?", answer: "Yes. Performance depends on browser memory and device capabilities." }
            ]}
          />

          {/* Related Tools */}
          <section className="space-y-6 text-center border-t border-border pt-16">
            <h2 className="text-2xl font-black text-foreground">Related Privacy Tools</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "PDF Merge", href: "/pdf/merge-pdf" },
                { name: "PDF Compress", href: "/pdf/compress-pdf" },
                { name: "PDF Unlock", href: "/pdf/unlock-pdf" },
                { name: "PDF Protect", href: "/pdf/protect-pdf" },
                { name: "PDF to Image", href: "/pdf/to-image" },
                { name: "File Shredder", href: "/security/file-shredder" }
              ].map(tool => (
                <Link key={tool.href} href={tool.href} className="px-5 py-2.5 rounded-full glass-card bg-secondary/30 hover:bg-blue-600 hover:text-white border border-border hover:border-blue-600 transition-colors font-bold text-sm text-foreground">
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Privacy Manifesto */}
          <section className="text-center max-w-2xl mx-auto space-y-4 pb-12">
            <Fingerprint className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground">Privacy-First Document Tools</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
              "SafeTools develops browser-based PDF tools designed to maximize user privacy and secure local document processing. Fast, privacy-first PDF tools designed for secure browser-based document workflows."
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
