"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { ExportManager } from "@/lib/export-manager";
import { 
  Scissors, Download, Trash2, CheckCircle2, Loader2,
  FileDown, FileText, Layers, Zap, Smartphone, Play,
  ShieldCheck, Settings2, AlertCircle
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SplitFile {
  id: string;
  file: File;
  pageCount: number;
  status: "idle" | "processing" | "completed" | "error";
  results: { url: string; name: string }[];
}

export default function SplitStudioClient() {
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
    <div className="flex flex-col min-h-screen lg:h-screen bg-background text-foreground overflow-y-auto lg:overflow-hidden lg:overflow-hidden selection:bg-primary/30 custom-scrollbar">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-visible lg:overflow-hidden relative scrollbar-hide">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-600/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`, backgroundSize: '48px 48px' }} />
        </div>

        {!file ? (
          <div className="flex-grow flex items-center justify-center p-8 relative z-10">
            <div className="max-w-xl w-full space-y-10 text-center">
              <div className="space-y-5">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary/20 to-red-600/20 border border-primary/20 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)]">
                  <Scissors className="w-9 h-9 text-primary" />
                </div>
                <div className="space-y-3">
                  <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
                    PDF <span className="text-primary">Splitter.</span>
                  </h1>
                  <p className="text-muted-foreground/60 text-lg font-medium max-w-md mx-auto leading-relaxed">
                    Precision document slicing. Extract pages or custom ranges — entirely in your browser.
                  </p>
                </div>
              </div>
              <DropZone onFilesDrop={handleFileDrop} accept=".pdf" multiple={false} title=" " className="h-56 border-dashed border-border bg-secondary/30 rounded-[3rem] hover:bg-secondary/70 hover:border-primary/30 transition-all" />
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar */}
            <aside className="flex w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-border bg-card/40 backdrop-blur-3xl flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
              <div className="p-6 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                    <Layers className="w-4 h-4" /> Identity Engine
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Multi-Platform Asset Matrix</p>
                    <div className="flex gap-1.5 opacity-30">
                      <Play className="w-2 h-2 text-primary fill-primary" />
                      <div className="w-2 h-2 rounded-full border border-white/40" />
                      <Smartphone className="w-2 h-2 text-foreground" />
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] border-border bg-secondary/50 text-muted-foreground/60 px-3 py-1 rounded-full font-black italic">ACTIVE</Badge>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-6 space-y-8">
                  {/* Mode Toggle */}
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Split Mode</Label>
                    <div className="grid grid-cols-2 gap-2 p-1.5 bg-muted/40 rounded-2xl border border-border">
                      {(["fixed", "range"] as const).map(mode => (
                        <Button
                          key={mode}
                          variant={splitMode === mode ? "default" : "ghost"}
                          className={cn("rounded-xl text-[10px] font-black h-10 uppercase tracking-widest", splitMode === mode ? "bg-primary text-foreground shadow-lg shadow-primary/20" : "text-muted-foreground/50")}
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
                        <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Pages per Part</Label>
                        <span className="text-xs font-black text-primary tabular-nums">{fixedInterval}pg</span>
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
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-border text-center">
                          <p className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest">Parts</p>
                          <p className="text-lg font-black text-primary tabular-nums">{estimatedParts}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-border text-center">
                          <p className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest">Per Part</p>
                          <p className="text-lg font-black tabular-nums">{fixedInterval}pg</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Custom Ranges</Label>
                      <Input
                        placeholder="e.g. 1-3, 4-7, 10"
                        value={customRanges}
                        onChange={e => { setCustomRanges(e.target.value); setRangeError(null); }}
                        className={cn("h-12 bg-secondary/50 border-border rounded-xl px-4 font-mono text-sm focus:ring-primary/20", rangeError && "border-red-500/50")}
                      />
                      {rangeError ? (
                        <div className="flex items-center gap-2 text-red-400">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <p className="text-[10px] font-bold">{rangeError}</p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-muted-foreground/40 font-medium">
                          {estimatedParts} part{estimatedParts !== 1 ? "s" : ""} will be created • Pages 1–{file.pageCount} available
                        </p>
                      )}
                    </div>
                  )}

                  {/* Page visualizer - clickable in range mode */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Page Map ({file.pageCount} pages)</Label>
                      {splitMode === "range" && (
                        <span className="text-[8px] font-black uppercase tracking-widest text-primary/40">Click to select range</span>
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
                                ? "bg-primary/20 border-primary/40 text-primary"
                                : "bg-secondary border-border text-muted-foreground/40 hover:bg-primary/10 hover:border-primary/30 hover:text-primary/60"
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
                        <div className="w-6 h-8 rounded-md bg-secondary/50 border border-dashed border-border flex items-center justify-center text-[8px] text-muted-foreground/40">
                          +{file.pageCount - 40}
                        </div>
                      )}
                    </div>
                    {pageSelStart !== null && (
                      <p className="text-[9px] text-primary font-black uppercase tracking-widest animate-pulse">
                        Page {pageSelStart} selected — click end page
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-[1.5rem] bg-secondary/30 border border-border space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">WASM Engine</h4>
                    </div>
                    <p className="text-[10px] text-white/25 leading-relaxed font-medium">
                      Extraction runs in a local worker thread. Original resolution and font integrity are guaranteed.
                    </p>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-5 border-t border-border bg-muted/40 shrink-0 space-y-3">
                {isProcessing && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Processing...</span>
                      <span className="text-[9px] font-black text-primary">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1 bg-secondary" />
                  </div>
                )}
                <Button
                  className="w-full h-14 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-foreground font-black text-sm gap-3 shadow-2xl shadow-primary/20 group active:scale-95 transition-all italic"
                  onClick={splitPdf}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                  {isProcessing ? "Slicing..." : "Slice Document"}
                </Button>
              </div>
            </aside>

            {/* Center */}
            <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[500px] lg:min-h-0 h-full max-h-full">
              <header className="p-5 md:p-8 flex items-center justify-between bg-muted/40 backdrop-blur-3xl border-b border-border relative z-20 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[1.5rem] bg-red-600/10 flex items-center justify-center border border-red-500/20">
                    <FileText className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="font-black text-lg md:text-2xl tracking-tighter uppercase italic truncate max-w-[200px] md:max-w-sm">{file.file.name}</h2>
                    <div className="flex items-center gap-3 mt-0.5">
                      <Badge className="text-[9px] bg-red-500/10 text-red-400 border-red-500/20 px-3 py-0.5 rounded-full font-black uppercase">{file.pageCount} pages</Badge>
                      <span className="text-[9px] text-muted-foreground/40 uppercase font-black tracking-widest">{((file.file.size) / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-500/10 text-muted-foreground/40 hover:text-red-400 transition-all shrink-0" onClick={() => setFile(null)}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </header>

              <div className="flex-grow relative flex items-center justify-center p-8 lg:p-16">
                <div className="aspect-[3/4] w-full max-w-xs bg-white/[0.03] rounded-[3rem] border border-border shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center gap-5 relative group overflow-hidden">
                  {file.status === "completed" ? (
                    <>
                      <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      </div>
                      <div className="space-y-1 text-center">
                        <h3 className="text-lg font-black uppercase">Split Complete</h3>
                        <p className="text-muted-foreground/50 text-xs font-bold uppercase tracking-widest">{file.results.length} parts ready</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center">
                        <FileText className="w-9 h-9 text-red-400" />
                      </div>
                      <div className="space-y-1 text-center">
                        <h3 className="text-lg font-black uppercase">Source Ready</h3>
                        <p className="text-white/25 text-xs font-bold uppercase tracking-widest italic">Configure split mode →</p>
                      </div>
                      <div className="flex gap-1 flex-wrap justify-center px-8">
                        {Array.from({ length: Math.min(file.pageCount, 12) }).map((_, i) => (
                          <div key={i} className="w-4 h-5 bg-secondary/50 border border-border rounded-sm" />
                        ))}
                        {file.pageCount > 12 && <span className="text-[8px] text-muted-foreground/40 self-center">+{file.pageCount - 12}</span>}
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-primary/3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </section>

            {/* Right Sidebar */}
            <aside className="flex w-full lg:w-[360px] border-t lg:border-t-0 lg:border-l border-border bg-card/40 backdrop-blur-3xl shrink-0 flex-col relative z-10 shadow-2xl h-[500px] lg:h-full">
              <div className="p-6 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                    <Settings2 className="w-4 h-4" /> Studio Matrix
                  </h3>
                  <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none mt-1">WASM Thread Execution</p>
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
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{file.results.length} fragments</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-3 rounded-xl text-[9px] font-black border-border hover:bg-secondary gap-2"
                            onClick={downloadAll}
                            disabled={isZipping}
                          >
                            {isZipping ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileDown className="w-3 h-3" />}
                            {isZipping ? "Zipping..." : "Export ZIP"}
                          </Button>
                        </div>
                        {file.results.map((res, i) => (
                          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                            <Card className="p-3.5 bg-secondary/30 border-border hover:border-primary/30 transition-all group flex items-center justify-between rounded-2xl">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                                  <FileDown className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] font-black uppercase truncate">{res.name}</p>
                                  <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Part {i + 1}</p>
                                </div>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-lg hover:bg-primary/20 text-primary shrink-0"
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
                      <div className="py-16 text-center space-y-3 opacity-20">
                        <div className="w-14 h-14 rounded-3xl bg-secondary/50 border border-dashed border-border flex items-center justify-center mx-auto">
                          <Layers className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest">No results yet</p>
                        <p className="text-[9px] font-medium">Split a document to see output here</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              <div className="p-5 border-t border-border bg-muted/40 shrink-0">
                <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/15">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> All Fragments Verified
                </div>
              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  );
}
