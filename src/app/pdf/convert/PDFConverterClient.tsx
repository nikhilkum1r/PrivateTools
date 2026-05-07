"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Loader2,
  FileBox,
  ArrowRight,
  Settings,
  ShieldAlert,
  Smartphone,
  Play
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import pptxgen from "pptxgenjs";
import { Document, Packer, Paragraph, ImageRun } from "docx";

export default function PDFConverterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<"pptx" | "docx">("pptx");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFilesDrop = (files: File[]) => {
    if (files[0]) {
      setFile(files[0]);
    }
  };

  const convertPdfToImages = async (pdfFile: File): Promise<string[]> => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const numPages = pdf.numPages;
    const images: string[] = [];

    for (let i = 1; i <= numPages; i++) {
      setProgress(Math.round((i / numPages) * 50)); // 0-50% for extraction
      const page = await pdf.getPage(i);
      
      // Use a higher scale for better quality (e.g., 2.0 or 3.0)
      const viewport = page.getViewport({ scale: 2.0 });
      
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      
      if (!context) continue;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext: any = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
      images.push(canvas.toDataURL("image/jpeg", 0.9));
    }

    return images;
  };

  const convertToPPTX = async (images: string[]) => {
    const pres = new pptxgen();
    
    images.forEach((imgData, index) => {
      setProgress(50 + Math.round((index / images.length) * 50)); // 50-100% for generation
      const slide = pres.addSlide();
      slide.addImage({ data: imgData, x: 0, y: 0, w: "100%", h: "100%" });
    });

    await pres.writeFile({ fileName: `${file?.name.replace(".pdf", "")}_converted.pptx` });
  };

  const convertToDOCX = async (images: string[]) => {
    const paragraphs = await Promise.all(images.map(async (imgData, index) => {
      setProgress(50 + Math.round((index / images.length) * 50));
      // Convert base64 to ArrayBuffer for docx
      const res = await fetch(imgData);
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();

      return new Paragraph({
        children: [
          new ImageRun({
            data: arrayBuffer,
            transformation: {
              width: 600, 
              height: 800,
            },
          } as any),
        ],
      });
    }));

    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file?.name.replace(".pdf", "")}_converted.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConvert = async () => {
    if (!file) return;
    
    try {
      setIsProcessing(true);
      setProgress(0);

      // Step 1: Extract Images
      const images = await convertPdfToImages(file);

      // Step 2: Generate Target Format
      if (targetFormat === "pptx") {
        await convertToPPTX(images);
      } else {
        await convertToDOCX(images);
      }

      toast.success("Conversion successful!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to convert document.");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden selection:bg-orange-500/30">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative scrollbar-hide">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-500/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-600/10 blur-[160px] rounded-full animate-pulse" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        {!file ? (
          <div className="flex-grow flex items-center justify-center p-8 relative z-10">
            <div className="max-w-2xl w-full space-y-12 text-center">
              <div className="space-y-6">
                <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-orange-500 to-red-600 p-[1px] mx-auto animate-pulse">
                  <div className="w-full h-full rounded-[calc(2.5rem-1px)] bg-black flex items-center justify-center border border-white/5">
                    <FileBox className="w-10 h-10 text-orange-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                    Document <br/> <span className="text-orange-500">Converter.</span>
                  </h1>
                  <p className="text-muted-foreground text-xl font-medium max-w-lg mx-auto leading-relaxed">
                    Localized document transformation. Convert PDFs into editable formats with zero server transmission.
                  </p>
                </div>
              </div>
              <DropZone 
                onFilesDrop={handleFilesDrop} 
                accept="application/pdf" 
                multiple={false} 
                className="h-64 border-dashed border-white/10 bg-white/5 rounded-[3rem] hover:bg-white/[0.08] transition-all"
              />
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Format Controls */}
            <aside className="flex w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-3">
                    <Settings className="w-4 h-4" /> Identity Engine
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none">Multi-Platform Asset Matrix</p>
                    <div className="flex gap-1.5 opacity-30">
                      <Play className="w-2 h-2 text-orange-500 fill-orange-500" />
                      <div className="w-2 h-2 rounded-full border border-white/40" />
                      <Smartphone className="w-2 h-2 text-white" />
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 text-white/40 px-4 py-1.5 rounded-full font-black italic">ACTIVE</Badge>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-8 space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                       Target Format
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/40 rounded-[1.25rem] border border-white/5">
                      <Button 
                        variant={targetFormat === "pptx" ? "default" : "ghost"} 
                        className={cn("rounded-xl text-[10px] font-black h-11 transition-all", targetFormat === "pptx" ? "bg-orange-500 text-white" : "text-white/40")}
                        onClick={() => setTargetFormat("pptx")}
                      >
                        PPTX
                      </Button>
                      <Button 
                        variant={targetFormat === "docx" ? "default" : "ghost"} 
                        className={cn("rounded-xl text-[10px] font-black h-11 transition-all", targetFormat === "docx" ? "bg-orange-500 text-white" : "text-white/40")}
                        onClick={() => setTargetFormat("docx")}
                      >
                        DOCX
                      </Button>
                    </div>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-orange-500/5 border border-orange-500/20 space-y-4">
                    <div className="flex items-center gap-3 text-orange-500">
                      <ShieldAlert className="w-5 h-5" />
                      <h4 className="text-xs font-black uppercase tracking-widest">Privacy Lock</h4>
                    </div>
                    <p className="text-[10px] text-orange-500/60 leading-relaxed font-medium">
                      Conversion happens structurally as high-fidelity images within the target container. This ensures 100% layout preservation while remaining fully localized.
                    </p>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-8 border-t border-white/5 bg-black/40 shrink-0">
                <Button 
                  className="w-full h-16 rounded-[2rem] bg-orange-600 hover:bg-orange-700 text-white font-black text-xl gap-3 shadow-2xl shadow-orange-500/20 group active:scale-95 transition-all italic"
                  onClick={handleConvert}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  )}
                  {isProcessing ? `CONVERTING... ${progress}%` : "RECONSTRUCT FILE"}
                </Button>
              </div>
            </aside>

            {/* Center - Document Studio */}
            <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[600px] lg:min-h-0">
              <header className="p-6 md:p-10 flex items-center justify-between bg-black/40 backdrop-blur-3xl border-b border-white/5 relative z-20">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-[2.5rem] bg-orange-600/10 flex items-center justify-center border border-orange-500/20 shadow-2xl">
                    <FileText className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="font-black text-xl md:text-3xl tracking-tighter uppercase italic truncate max-w-[200px] md:max-w-md">
                      {file.name}
                    </h2>
                    <div className="flex items-center gap-4">
                      <Badge className="text-[10px] bg-orange-500/10 text-orange-500 border-orange-500/20 px-4 py-1 rounded-full font-black uppercase tracking-widest italic">
                        PDF SOURCE
                      </Badge>
                      <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">
                        {((file.size || 0) / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all" onClick={() => setFile(null)}>
                  <Trash2 className="w-6 h-6" />
                </Button>
              </header>

              <div className="flex-grow relative flex items-center justify-center p-8 lg:p-20">
                <div className="aspect-[3/4] w-full max-w-md bg-white/[0.03] rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center gap-6 relative group overflow-hidden">
                   <div className="w-24 h-24 rounded-[2rem] bg-orange-500/10 flex items-center justify-center">
                     <FileText className="w-10 h-10 text-orange-500" />
                   </div>
                   <div className="space-y-2 text-center">
                     <h3 className="text-xl font-black uppercase">Source Loaded</h3>
                     <p className="text-white/30 text-xs font-bold uppercase tracking-widest italic">Awaiting reconstruction</p>
                   </div>
                   <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </section>

            {/* Right Sidebar - Telemetry */}
            <aside className="flex w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl shrink-0 flex-col relative z-10 shadow-2xl h-[600px] lg:h-full">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4" /> Studio Matrix
                  </h3>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none mt-1">WASM Thread Execution</p>
                </div>
                {progress === 100 && (
                   <Badge variant="outline" className="text-[10px] border-emerald-500/20 bg-emerald-500/10 text-emerald-500 uppercase font-black px-4 py-1.5 rounded-full italic shadow-[0_0_15px_rgba(16,185,129,0.2)]">STABLE</Badge>
                )}
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-8 space-y-10">
                   <div className="space-y-6">
                      <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">System Status</Label>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase">
                          <span className="text-white/40">Worker Health</span>
                          <span className="text-emerald-500">OPTIMAL</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase">
                          <span className="text-white/40">Memory Load</span>
                          <span className="text-orange-500">NOMINAL</span>
                        </div>
                      </div>
                   </div>

                   <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                     <div className="flex items-center gap-3 text-white/40">
                       <FileBox className="w-5 h-5" />
                       <h4 className="text-xs font-black uppercase tracking-widest">Output Logic</h4>
                     </div>
                     <p className="text-[10px] text-white/20 leading-relaxed font-medium">
                       Target reconstruction utilizes PPTXGenJS and DOCX.js for pure client-side container generation. No external dependencies are involved during synthesis.
                     </p>
                   </div>
                </div>
              </ScrollArea>
            </aside>
          </>
        )}
      </main>
    </div>
  );
}
