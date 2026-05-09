"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileInput, Loader2, Trash2, FileText, ShieldCheck,
  CheckCircle2, Zap, Smartphone, Globe, Star, Plus, Download, Search
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils/fileSize";
import { toast } from "sonner";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/lib/utils";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PDF_TO_TXT_FAQ } from "@/lib/faq-content";

// ─── Core Logic ─────────────────────────────────────────────────────────────
async function extractPdfText(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const lines: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str ?? "").join(" ");
    lines.push(`--- Page ${i} ---\n${pageText}`);
    onProgress?.(Math.round((i / pdf.numPages) * 100));
  }

  return lines.join("\n\n");
}

export default function PdfToTxtClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("Extracted Text");

  const handleDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f || f.type !== "application/pdf") { 
      toast.error("Please upload a valid PDF file."); 
      return; 
    }
    setFile(f);
    setTitle(f.name.replace(/\.[^/.]+$/, ""));
    setStatus("idle");
    setResult(null);
    setPreview("");
    setProgress(0);
  }, []);

  const handleExtract = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(0);
    try {
      const text = await extractPdfText(file, setProgress);
      const blob = new Blob([text], { type: "text/plain" });
      setResult(blob);
      setPreview(text.slice(0, 500) + (text.length > 500 ? "…" : ""));
      setStatus("done");
      toast.success(`Extracted ${text.split("\\n").length} lines of text.`);
    } catch (e) {
      toast.error("Extraction failed: " + (e as Error).message);
      setStatus("error");
    }
  };

  const handleReset = () => { 
    setFile(null); 
    setResult(null); 
    setStatus("idle"); 
    setPreview("");
    setProgress(0);
    setTitle("Extracted Text");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-orange-500/30">
      <Navbar />
      
      <main className={cn(
        "flex-grow flex flex-col relative",
        file ? "overflow-hidden" : "overflow-y-auto"
      )}>
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-600/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-600/10 blur-[160px] rounded-full animate-pulse delay-1000" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(249, 115, 22, 0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        {!file ? (
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
                    <FileInput className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                    PDF to <span className="text-orange-500">TXT.</span>
                  </h1>
                  <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                    Extract clean plain text from PDF documents instantly with a fast and privacy-focused PDF to TXT converter. No uploads, no registration, and fully browser-based processing.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <DropZone 
                  onFilesDrop={handleDrop} 
                  accept=".pdf,application/pdf" 
                  multiple={false} 
                  className="h-80 border-dashed border-border bg-secondary/30 backdrop-blur-xl rounded-3xl hover:bg-secondary/50 transition-all shadow-2xl group relative overflow-hidden"
                  title="Drop PDF Here"
                  description="Supports standard and text-based PDFs"
                />
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
                
                {/* Convert PDF Files to Plain Text Online */}
                <section className="space-y-6 text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-orange-500">Convert PDF Files to Plain Text Online</h2>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                    The PDF to TXT Converter helps you quickly extract readable plain text from PDF documents while preserving important written content. Whether you need text for editing, research, note-taking, coding, accessibility, or document processing, this tool makes PDF text extraction simple and efficient.
                  </p>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                    The converter works directly in your browser for improved speed, privacy, and security.
                  </p>
                </section>

                {/* Key Features / Why Use */}
                <section className="space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Why Use This PDF to TXT Converter?</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Features of the PDF to TXT Tool</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { title: "Accurate Text Extraction", desc: "Extract readable text from PDFs including paragraphs, headings, lists, and document content with high accuracy.", icon: FileText },
                      { title: "Privacy-Focused Processing", desc: "Your PDF files remain on your device during processing, helping protect confidential or sensitive documents.", icon: ShieldCheck },
                      { title: "Fast Conversion Engine", desc: "Convert PDF files into TXT format within seconds without long waiting times.", icon: Zap },
                      { title: "Minimal and Clean Output", desc: "Generate lightweight TXT files that are easy to edit, copy, search, archive, or import into other systems.", icon: Download },
                      { title: "Cross-Platform Compatibility", desc: "Use the tool on Windows, macOS, Linux, Android, iPhone, iPad, and Chromebook.", icon: Smartphone },
                      { title: "Free & No Watermarks", desc: "Free online PDF text converter with no watermark added and no registration required.", icon: CheckCircle2 }
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
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-orange-500">Supported File Formats</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Input Format</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["PDF"].map((ext) => (
                      <Badge key={ext} className="px-6 py-2 rounded-full bg-background border-border text-[11px] font-black tracking-widest uppercase hover:text-orange-500 transition-colors">
                        .{ext}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-center mt-6">
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs mb-3">Output Formats</p>
                    <div className="flex justify-center gap-3">
                      <Badge className="px-6 py-2 rounded-full bg-orange-500 text-white border-0 text-[11px] font-black tracking-widest uppercase">
                        .TXT
                      </Badge>
                      <Badge className="px-6 py-2 rounded-full bg-orange-500 text-white border-0 text-[11px] font-black tracking-widest uppercase">
                        Plain Text
                      </Badge>
                    </div>
                  </div>
                </section>

                {/* Common Use Cases & Benefits */}
                <section className="space-y-12">
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-grow space-y-6">
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter">Common Use Cases & Benefits</h2>
                      <p className="text-muted-foreground font-medium leading-relaxed">
                        TXT files are lightweight, universal, and easy to process across nearly all devices and operating systems. Converting PDF to TXT helps reduce file size, simplify editing, improve compatibility, enable automation workflows, and speed up text processing.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {[
                          "Research and data extraction",
                          "Copying content from PDFs",
                          "AI and NLP text processing",
                          "Accessibility tools",
                          "Note-taking and summaries",
                          "Ebook text extraction",
                          "Coding and scripting",
                          "Text indexing and search"
                        ].map((use, i) => (
                          <div key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-secondary/30 transition-colors group border border-transparent hover:border-border">
                            <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 group-hover:bg-orange-500 text-orange-500 group-hover:text-white transition-all mt-0.5">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                            <p className="text-sm font-black uppercase tracking-tight italic text-muted-foreground group-hover:text-foreground transition-colors">{use}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* How to Convert */}
                <section className="space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">How to Convert PDF to TXT</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { step: "1", title: "Upload", desc: "Upload or drag your PDF document" },
                      { step: "2", title: "Process", desc: "The tool extracts text automatically" },
                      { step: "3", title: "Preview", desc: "Preview the extracted content" },
                      { step: "4", title: "Download", desc: "Download the TXT file instantly" }
                    ].map((s, i) => (
                      <div key={i} className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-secondary/20 border border-border">
                        <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                          {s.step}
                        </div>
                        <h4 className="font-black uppercase italic tracking-tight">{s.title}</h4>
                        <p className="text-xs text-muted-foreground">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-12 max-w-3xl mx-auto">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Everything you need to know</p>
                  </div>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {PDF_TO_TXT_FAQ.map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-2xl px-6 bg-background/50">
                        <AccordionTrigger className="hover:no-underline font-black uppercase text-xs tracking-widest italic text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>

              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center p-6 relative z-10 h-[calc(100vh-64px)]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xl bg-card/50 backdrop-blur-2xl border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6 flex-grow min-h-0">
                <div className="flex flex-col items-center space-y-4 shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner">
                    {status === "done" ? (
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    ) : status === "processing" ? (
                      <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                    ) : (
                      <FileInput className="w-10 h-10 text-orange-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight italic truncate max-w-[300px] text-orange-500">
                      {title}
                    </h2>
                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                {preview && status === "done" && (
                  <div className="w-full flex-grow min-h-0 bg-secondary/30 border border-border rounded-xl p-4 text-left overflow-auto custom-scrollbar">
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-words">
                      {preview}
                    </pre>
                  </div>
                )}

                <div className="w-full space-y-4 shrink-0 mt-auto pt-4">
                  {status !== "done" && (
                    <Button 
                      className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-sm gap-3 shadow-2xl shadow-orange-500/20 active:scale-95 transition-all italic"
                      onClick={handleExtract}
                      disabled={status === "processing"}
                    >
                      {status === "processing" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          EXTRACTING TEXT... {progress}%
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          EXTRACT TEXT
                        </>
                      )}
                    </Button>
                  )}
                  
                  {status === "done" && result && (
                    <ExportPanel
                      blob={result}
                      filename={file.name.replace(/\.[^/.]+$/, ".txt")}
                      inputSize={file.size}
                      onReset={handleReset}
                    />
                  )}
                  
                  {status !== "processing" && status !== "done" && (
                    <Button 
                      variant="ghost" 
                      className="w-full h-12 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 font-bold uppercase text-xs tracking-widest gap-2"
                      onClick={handleReset}
                    >
                      <Trash2 className="w-4 h-4" /> Cancel
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border w-full justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Local Browser Processing</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      
      {!file && <Footer />}
    </div>
  );
}
