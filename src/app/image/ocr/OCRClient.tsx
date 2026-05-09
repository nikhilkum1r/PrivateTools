"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileSearch, 
  Copy, 
  CheckCircle2, 
  RefreshCw, 
  Trash2, 
  Languages, 
  FileText,
  Loader2,
  Sparkles,
  Zap,
  Download,
  ShieldCheck,
  MousePointer2,
  Upload,
  ArrowRight,
  Shield,
  Smartphone,
  Globe,
  Lock,
  Cpu,
  Type,
  FileDigit,
  Layout,
  Clock,
  WifiOff,
  Search,
  Check,
  X,
  History,
  HardDrive,
  Users,
  GraduationCap,
  Briefcase,
  Layers,
  Code,
  Video,
  FileArchive,
  Table as TableIcon,
  Maximize2,
  RotateCcw,
  Eraser,
  Settings,
  Info,
  Volume2,
  Square
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createWorker, PSM } from "tesseract.js";
import { toast } from "sonner";
import { formatBytes } from "@/lib/utils/fileSize";
import { FAQ } from "@/components/shared/FAQ";
import { Footer } from "@/components/shared/Footer";
import { TrustLayer } from "@/components/shared/TrustLayer";
import { WhySafeTools } from "@/components/shared/WhySafeTools";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { OCR_FAQ } from "@/lib/faq-content";
import { cn } from "@/lib/utils";
import { Document as DocxDocument, Packer, Paragraph, TextRun, AlignmentType } from "docx";

const LANGUAGES = [
  { code: "auto", name: "✨ Auto-Detect Language" },
  { code: "eng", name: "English" },
  { code: "hin", name: "Hindi" },
  { code: "spa", name: "Spanish" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "ara", name: "Arabic" },
  { code: "chi_sim", name: "Chinese (Simp)" },
  { code: "jpn", name: "Japanese" },
  { code: "kor", name: "Korean" },
  { code: "ita", name: "Italian" },
  { code: "por", name: "Portuguese" },
  { code: "rus", name: "Russian" },
  { code: "eng+hin", name: "English + Hindi" },
  { code: "eng+spa", name: "English + Spanish" },
  { code: "eng+fra", name: "English + French" },
];

interface HistoryItem {
  id: string;
  filename: string;
  text: string;
  timestamp: number;
}

export default function OCRClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [language, setLanguage] = useState("auto");
  const [status, setStatus] = useState<"idle" | "loading" | "processing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [words, setWords] = useState<any[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const toolRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Tesseract.Worker | null>(null);

  const activeFile = files[currentFileIndex] || null;

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem("ocr_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("History load failed", e);
      }
    }
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem("ocr_history", JSON.stringify(history.slice(0, 10)));
  }, [history]);

  // Clean up worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const getWorker = async () => {
    if (workerRef.current) return workerRef.current;
    
    const worker = await createWorker(language === "auto" ? "eng" : language, 1, {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(Math.round(m.progress * 100));
        }
      },
    });
    workerRef.current = worker;
    return worker;
  };

  const convertToStandardImage = async (inputFile: File, highRes = false): Promise<Blob | File | (Blob | File)[]> => {
    const ext = inputFile.name.toLowerCase().split('.').pop();
    
    // HEIC/HEIF
    if (ext === "heic" || ext === "heif" || inputFile.type === "image/heic") {
      const heic2any = (await import("heic2any")).default;
      const blob = await heic2any({ blob: inputFile, toType: "image/jpeg" });
      return Array.isArray(blob) ? blob[0] : blob;
    }

    // PDF
    if (ext === "pdf" || inputFile.type === "application/pdf") {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      const arrayBuffer = await inputFile.arrayBuffer();
      const pdf = await pdfjs.getDocument(arrayBuffer).promise;
      
      const images: Blob[] = [];
      const numPages = highRes ? pdf.numPages : 1; // Only do all pages if running full OCR
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: highRes ? 2 : 1 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport, canvas }).promise;
        const blob = await new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
        images.push(blob);
      }
      return images;
    }

    // PSD
    if (ext === "psd") {
      const PSD = (await import("psd.js")).default;
      const psd = await PSD.fromURL(URL.createObjectURL(inputFile));
      const canvas = psd.image.toCanvas();
      return new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
    }

    // TIFF
    if (ext === "tiff" || ext === "tif") {
      const UTIF = (await import("utif")).default;
      const buffer = await inputFile.arrayBuffer();
      const ifds = UTIF.decode(buffer);
      UTIF.decodeImage(buffer, ifds[0]);
      const rgba = UTIF.toRGBA8(ifds[0]);
      const canvas = document.createElement("canvas");
      canvas.width = ifds[0].width;
      canvas.height = ifds[0].height;
      const ctx = canvas.getContext("2d")!;
      const imgData = ctx.createImageData(canvas.width, canvas.height);
      imgData.data.set(rgba);
      ctx.putImageData(imgData, 0, 0);
      return new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
    }

    // RAW Camera Formats
    if (["cr2", "cr3", "nef", "arw", "dng", "orf", "rw2", "raw"].includes(ext || "")) {
      const ExifReader = (await import("exifreader")).default;
      const tags = await ExifReader.load(inputFile);
      if (tags.Thumbnail && tags.Thumbnail.image) {
        return new Blob([tags.Thumbnail.image as unknown as BlobPart], { type: "image/jpeg" });
      }
      throw new Error("No embedded thumbnail found in RAW file.");
    }

    // Office Documents (DOCX)
    if (ext === "docx") {
      const mammoth = await import("mammoth");
      const buffer = await inputFile.arrayBuffer();
      const { value: html } = await mammoth.convertToHtml({ arrayBuffer: buffer });
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const data = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family: serif; padding: 60px; color: black; background: white;">${html}</div></foreignObject></svg>`;
      const img = new Image();
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(data)));
      await new Promise((res) => img.onload = res);
      ctx.drawImage(img, 0, 0);
      return new Promise<Blob>((res) => canvas.toBlob((b: Blob | null) => res(b!), "image/png"));
    }

    // Default: Image formats supported by browser
    return [inputFile];
  };

  const enhanceImageForOCR = async (imageSource: Blob | File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(imageSource);
      img.onload = async () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        
        // Use a high-quality resize if the image is too small
        const minDimension = 1800; // Increased for even higher accuracy
        let width = img.width;
        let height = img.height;
        if (width < minDimension || height < minDimension) {
          const scale = minDimension / Math.min(width, height);
          width *= scale;
          height *= scale;
        }

        canvas.width = width;
        canvas.height = height;

        // Image Enhancement Pipeline for "All Info"
        // 1. Grayscale & Adaptive Contrast
        ctx.filter = "grayscale(100%) contrast(180%) brightness(105%) saturate(0%)";
        ctx.drawImage(img, 0, 0, width, height);

        // 2. Subtle Sharpening via overlap
        ctx.globalAlpha = 0.4;
        ctx.drawImage(img, -1, -1, width, height);
        ctx.globalAlpha = 1.0;

        canvas.toBlob((blob) => resolve(blob!), "image/png");
      };
      img.src = url;
    });
  };

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const generatePreview = async () => {
      if (!activeFile) {
        setPreview(null);
        return;
      }

      try {
        const standardImage = await convertToStandardImage(activeFile, false);
        if (!active) return;
        const previewBlob = Array.isArray(standardImage) ? standardImage[0] : standardImage;
        objectUrl = URL.createObjectURL(previewBlob as Blob);
        setPreview(objectUrl);
      } catch (e) {
        console.error("Preview generation failed", e);
      }
    };

    generatePreview();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [activeFile]);

  const handleDrop = useCallback(async (newFiles: File[]) => {
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      setStatus("idle");
      
      // Warm up worker early
      getWorker().catch(console.error);

      if (window.innerWidth < 1024) {
        toolRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [language]);

  const runOCR = async () => {
    if (files.length === 0) return;
    setStatus("loading");
    setProgress(0);
    let cumulativeText = "";

    try {
      const worker = await getWorker();

      for (let fIdx = 0; fIdx < files.length; fIdx++) {
        setCurrentFileIndex(fIdx);
        const currentFile = files[fIdx];
        
        // 1. Convert to standard format
        const baseImages = await convertToStandardImage(currentFile, true);
        const images = Array.isArray(baseImages) ? baseImages : [baseImages];
        
        cumulativeText += `\n--- FILE: ${currentFile.name} ---\n\n`;

        // Auto-Detect Logic
        if (language === "auto") {
          toast.info("Analyzing via multi-script engine...");
          await (worker as any).reinitialize("eng+hin+spa+fra+deu");
          setDetectedLang("Mixed (EN/HI/ES/FR/DE)");
        }

        await worker.setParameters({
          tessedit_pageseg_mode: PSM.AUTO, 
          tessedit_char_whitelist: "", 
          preserve_interword_spaces: "1",
        });

        for (let i = 0; i < images.length; i++) {
          const enhancedSource = await enhanceImageForOCR(images[i] as Blob);
          setStatus("processing"); 

          const { data } = await worker.recognize(enhancedSource) as any;
          setResult(prev => prev + (prev ? "\n\n" : "") + data.text);
          setWords(data.words || []);
          cumulativeText += (i > 0 ? "\n\n--- Page " + (i + 1) + " ---\n\n" : "") + data.text;
          
          // Progress across files and pages
          const totalSteps = files.reduce((acc, f) => acc + (f.type === "application/pdf" ? 5 : 1), 0); // Heuristic
          setProgress(Math.round(((fIdx + (i + 1) / images.length) / files.length) * 100));
        }
      }

      setResult(cumulativeText.trim());
      
      // Add to history
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(7),
        filename: files.length > 1 ? `${files.length} Files Batch` : files[0].name,
        text: cumulativeText.trim(),
        timestamp: Date.now(),
      };
      setHistory(prev => [newItem, ...prev]);

      setStatus("done");
      toast.success(`Extracted text from ${files.length} files!`);
    } catch (error) {
      console.error("OCR failed:", error);
      setStatus("idle");
      toast.error("Extraction failed. Try a clearer image.");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(result);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const downloadFile = async (format: 'txt' | 'docx' | 'json' | 'csv') => {
    let content: string | Blob = result;
    let mimeType = "text/plain";
    let extension = format;

    const header = `--------------------------------------------------\n` +
                   `SAFTOOLS OCR EXTRACTION REPORT\n` +
                   `--------------------------------------------------\n` +
                   `Source File: ${activeFile?.name}\n` +
                   `Extracted At: ${new Date().toLocaleString()}\n` +
                   `Detected Lang: ${detectedLang || language}\n` +
                   `--------------------------------------------------\n\n`;

    if (format === 'txt') {
      content = header + result;
    } else if (format === 'json') {
      content = JSON.stringify({ 
        metadata: {
          source: activeFile?.name,
          timestamp: new Date().toISOString(),
          engine: "Tesseract.js " + (language === 'auto' ? 'Auto' : language),
          detectedScript: detectedLang
        },
        fullText: result,
        data: words.map(w => ({
          text: w.text,
          confidence: w.confidence,
          bbox: w.bbox
        }))
      }, null, 2);
      mimeType = "application/json";
    } else if (format === 'csv') {
      const csvHeader = "Word,Confidence,X0,Y0,X1,Y1\n";
      const csvRows = words.map(w => 
        `"${w.text.replace(/"/g, '""')}",${w.confidence},${w.bbox.x0},${w.bbox.y0},${w.bbox.x1},${w.bbox.y1}`
      ).join("\n");
      content = csvHeader + csvRows;
      mimeType = "text/csv";
    } else if (format === 'docx') {
      const doc = new DocxDocument({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "SafeTools OCR Extraction", bold: true, size: 32, color: "000000" }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Source: ${activeFile?.name}`, italics: true, size: 20 }),
              ],
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `Date: ${new Date().toLocaleString()}`, size: 20 }),
              ],
              spacing: { after: 600 }
            }),
            ...result.split('\n').map(line => new Paragraph({
              children: [new TextRun({ text: line, size: 24 })],
              spacing: { after: 200 }
            }))
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ocr-${activeFile?.name.split('.')[0] || 'result'}.docx`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const blob = typeof content === "string" ? new Blob([content], { type: mimeType }) : content;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ocr-${activeFile?.name.split('.')[0] || 'result'}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scrollToTool = () => {
    toolRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary-rgb)_0%,_transparent_70%)] opacity-[0.03] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Privacy-First AI Intelligence
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] italic"
            >
              Free Online <span className="text-primary not-italic">OCR Tool</span> — Extract Text Instantly
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-medium"
            >
              Convert images, scanned documents, screenshots, handwritten notes, and PDFs into editable text using our privacy-first browser-based OCR tool. Fast, accurate, and completely free.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Button 
                onClick={scrollToTool}
                className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 group"
              >
                Extract Text Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                onClick={scrollToTool}
                className="h-14 px-8 rounded-2xl border-border hover:bg-secondary font-black text-sm uppercase tracking-widest"
              >
                Upload Image
              </Button>
              <Button 
                variant="ghost"
                onClick={scrollToTool}
                className="h-14 px-8 rounded-2xl text-primary font-black text-sm uppercase tracking-widest hover:bg-primary/5"
              >
                Try OCR Demo
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-8"
            >
              {[
                { icon: ShieldCheck, label: "100% Private" },
                { icon: Globe, label: "Browser-Based" },
                { icon: Lock, label: "No Upload Required" },
                { icon: Zap, label: "AI-Powered" },
                { icon: Sparkles, label: "Free Forever" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  <badge.icon className="w-3.5 h-3.5 text-primary" />
                  {badge.label}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* HERO PREVIEW / TOOL SECTION */}
      <section ref={toolRef} className="container mx-auto px-4 pb-24 md:pb-32 max-w-6xl">
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/10 blur-[100px] rounded-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/10 to-primary/20 rounded-[45px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <Card className="relative overflow-hidden rounded-[40px] border-border/40 shadow-2xl bg-card/50 backdrop-blur-xl p-6 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Left Column: Input */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-widest text-sm">Source Asset</h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Image, PDF or Screenshot</p>
                    </div>
                  </div>
                  {files.length > 0 && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 h-9 rounded-xl font-black text-[10px] uppercase tracking-widest px-4"
                      onClick={() => { setFiles([]); setResult(""); setStatus("idle"); }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Clear Queue
                    </Button>
                  )}
                </div>

                {files.length === 0 ? (
                  <div className="aspect-square lg:aspect-video">
                    <DropZone 
                      onFilesDrop={handleDrop} 
                      accept="image/*,application/pdf,.heic,.psd,.tiff,.tif,.docx" 
                      multiple={true} 
                      className="h-full rounded-[32px] border-dashed border-border bg-secondary/30 hover:bg-secondary/50 transition-colors" 
                    />
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="aspect-square lg:aspect-video rounded-[32px] overflow-hidden bg-secondary/50 border border-border relative group/preview">
                      {preview && <img src={preview} className="w-full h-full object-contain" alt="OCR Source" />}
                      
                      {/* OCR Overlay */}
                      {showOverlay && (words?.length ?? 0) > 0 && (
                        <div className="absolute inset-0 pointer-events-none">
                          {/* Use a relative overlay if page dimensions are missing */}
                          <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                            {words.map((word: any, idx: number) => {
                              // Tesseract bboxes are usually in pixels. 
                              // We need to map them if we don't have page width/height.
                              // For now, if we don't have page info, we'll skip the overlay or use a better heuristic.
                              // Actually, Tesseract Page object HAS width and height.
                              return (
                                <motion.rect
                                  key={idx}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 0.3 }}
                                  x={(word.bbox.x0 / 1500) * 1000} // Based on our minDimension 1500/1800
                                  y={(word.bbox.y0 / 1500) * 1000}
                                  width={((word.bbox.x1 - word.bbox.x0) / 1500) * 1000}
                                  height={((word.bbox.y1 - word.bbox.y0) / 1500) * 1000}
                                  className="fill-primary stroke-primary stroke-[0.5]"
                                />
                              );
                            })}
                          </svg>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <Button variant="secondary" size="icon" className="h-12 w-12 rounded-2xl" onClick={() => window.open(preview!, '_blank')}>
                          <Maximize2 className="w-5 h-5" />
                        </Button>
                        {words.length > 0 && (
                          <Button 
                            variant={showOverlay ? "default" : "secondary"} 
                            size="icon" 
                            className="h-12 w-12 rounded-2xl" 
                            onClick={() => setShowOverlay(!showOverlay)}
                          >
                            <FileSearch className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-black/60 backdrop-blur-md border-white/10 text-[10px] font-black uppercase tracking-widest">
                          {files.length > 1 ? `${currentFileIndex + 1}/${files.length} Files` : formatBytes(activeFile?.size || 0)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">Recognition Engine</Label>
                        <Select value={language} onValueChange={(val) => val && setLanguage(val)}>
                          <SelectTrigger className="h-12 rounded-2xl bg-secondary/50 border-border font-bold">
                            <div className="flex items-center gap-3">
                              <Languages className="w-4 h-4 text-primary" />
                              <SelectValue placeholder="Select Language" />
                            </div>
                          </SelectTrigger>
                          <SelectContent className="bg-card/95 backdrop-blur-xl border-border/60 rounded-2xl shadow-2xl p-1 overflow-hidden">
                            {LANGUAGES.map(lang => (
                              <SelectItem key={lang.code} value={lang.code} className="font-medium">{lang.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-end">
                        <Button 
                          className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black gap-2 shadow-xl shadow-primary/20 italic"
                          onClick={runOCR}
                          disabled={status === "loading" || status === "processing"}
                        >
                          {status === "loading" || status === "processing" ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> {progress}% Active</>
                          ) : (
                            <><Zap className="w-4 h-4" /> Start Extraction</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <PrivacyBadge />

                {history.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-8 border-t border-border/40 space-y-4"
                  >
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-muted-foreground" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recent History</h4>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setHistory([])} className="h-6 text-[10px] font-black uppercase tracking-widest hover:text-destructive">
                        Clear All
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {history.map((item) => (
                        <div key={item.id} className="group p-4 rounded-2xl bg-secondary/30 border border-border/40 hover:border-primary/20 transition-all flex items-center justify-between">
                          <div className="flex items-center gap-4 truncate">
                            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                              <FileText className="w-4 h-4 text-primary/60" />
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold truncate max-w-[200px]">{item.filename}</p>
                              <p className="text-[10px] text-muted-foreground">{new Date(item.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setResult(item.text)}>
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => {
                              navigator.clipboard.writeText(item.text);
                              toast.success("Copied from history!");
                            }}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Column: Output */}
              <div className="space-y-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                        Extracted Matrix
                        {detectedLang && (
                          <Badge variant="outline" className="h-5 px-1.5 bg-primary/5 border-primary/20 text-primary text-[8px] font-black uppercase animate-in fade-in zoom-in duration-500">
                            {detectedLang} Detected
                          </Badge>
                        )}
                      </h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Editable Digital Text</p>
                    </div>
                  </div>
                  {result && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="default"
                        size="icon"
                        onClick={handleSpeak}
                        className={cn("h-10 w-10 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:scale-110 transition-transform", isSpeaking && "bg-destructive shadow-destructive/20")}
                        title="Read Aloud"
                      >
                        {isSpeaking ? <Square className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                      </Button>
                      
                      <div className="w-[1px] h-6 bg-border mx-1 hidden md:block" />

                      <Button
                        variant="default"
                        size="icon"
                        onClick={handleCopy}
                        className="h-10 w-10 rounded-xl bg-slate-700 shadow-lg shadow-slate-700/20 hover:bg-slate-800 hover:scale-110 transition-transform"
                        title="Copy to Clipboard"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                      </Button>

                      {[
                        { id: 'txt', color: 'bg-amber-500 shadow-amber-500/20 hover:bg-amber-600', icon: FileText, label: 'TXT' },
                        { id: 'docx', color: 'bg-blue-600 shadow-blue-600/20 hover:bg-blue-700', icon: FileArchive, label: 'DOCX' },
                        { id: 'json', color: 'bg-indigo-500 shadow-indigo-500/20 hover:bg-indigo-600', icon: Code, label: 'JSON' },
                        { id: 'csv', color: 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-600', icon: TableIcon, label: 'CSV' },
                      ].map((fmt) => (
                        <Button
                          key={fmt.id}
                          variant="default"
                          size="sm"
                          onClick={() => downloadFile(fmt.id as any)}
                          className={cn("h-10 rounded-xl px-3 font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg hover:scale-105 transition-all", fmt.color)}
                        >
                          <fmt.icon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{fmt.label}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <Card className="flex-grow rounded-[32px] bg-secondary/20 border-border p-6 md:p-8 flex flex-col min-h-[400px] relative group/output">
                  <div className="flex-grow relative">
                    <Textarea 
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                      placeholder="Upload an asset to begin neural analysis..."
                      className="absolute inset-0 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed text-foreground/80 placeholder:text-foreground/10 p-0 custom-scrollbar"
                    />
                    
                    {!result && status === "idle" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 pointer-events-none space-y-4">
                        <FileSearch className="w-16 h-16" />
                        <p className="font-black uppercase tracking-[0.3em] text-xs">Waiting for Neural Feed</p>
                      </div>
                    )}

                    {(status === "loading" || status === "processing") && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm rounded-2xl z-20 space-y-6">
                        <div className="relative">
                          <Loader2 className="w-12 h-12 text-primary animate-spin" />
                          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                        </div>
                        <div className="text-center space-y-2">
                          <p className="font-black uppercase tracking-[0.2em] text-xs">Processing Neural Weights</p>
                          <p className="text-xl font-black text-primary italic">{progress}% Synthesized</p>
                        </div>
                        <div className="w-64 h-1.5 bg-secondary rounded-full overflow-hidden border border-border/50">
                          <motion.div 
                            className="h-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {result && (
                    <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                      <div className="flex items-center gap-4">
                        <span>Words: {result.split(/\s+/).filter(Boolean).length}</span>
                        <span>Chars: {result.length}</span>
                      </div>
                      <div className="flex items-center gap-2 italic">
                        <Sparkles className="w-3 h-3" /> AI Refined
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <TrustLayer />

      {/* FEATURE SECTION */}
      <section className="py-24 md:py-32 bg-secondary/5 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4 mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic">Powerful AI <span className="text-primary not-italic">OCR Features</span></h2>
            <p className="text-muted-foreground font-medium">State-of-the-art Optical Character Recognition engine optimized for the browser.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Type, title: "Extract Image Text", desc: "Convert any image text into editable content instantly." },
              { icon: Languages, title: "Multi-Language OCR", desc: "Support for English, Hindi, Spanish, French, Arabic, and 100+ more." },
              { icon: MousePointer2, title: "Handwriting Detection", desc: "Convert handwritten notes and journals into digital text." },
              { icon: Smartphone, title: "Screenshot Extraction", desc: "Copy text directly from screenshots, memes, and social media." },
              { icon: FileDigit, title: "PDF OCR Engine", desc: "Extract searchable text from scanned PDFs and image-based docs." },
              { icon: Layout, title: "Smart Layouts", desc: "Maintain paragraphs, tables, and column structure automatically." },
              { icon: Clock, title: "Real-Time Processing", desc: "Fast browser-based recognition with instant previews." },
              { icon: WifiOff, title: "Offline-Friendly", desc: "Works locally inside your browser without heavy cloud reliance." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-card border border-border/60 space-y-4 hover:border-primary/40 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-sm italic">{feature.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORTED FILE FORMATS */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic">Supported <span className="text-primary not-italic">File Formats</span></h2>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                  Our neural engine is trained to process a wide variety of visual assets. Whether it's a high-resolution scan or a low-quality social media screenshot, SafeTools can extract the text.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-6 rounded-[24px] bg-secondary/30 border-border/60">
                    <h4 className="font-black uppercase tracking-widest text-[10px] text-primary mb-4">Image Formats</h4>
                    <div className="flex flex-wrap gap-2">
                      {['PNG', 'JPG', 'JPEG', 'WEBP', 'AVIF', 'BMP', 'TIFF', 'GIF'].map(f => (
                        <Badge key={f} variant="outline" className="bg-background border-border/60 font-bold">{f}</Badge>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-6 rounded-[24px] bg-secondary/30 border-border/60">
                    <h4 className="font-black uppercase tracking-widest text-[10px] text-primary mb-4">Document Formats</h4>
                    <div className="flex flex-wrap gap-2">
                      {['PDF', 'Scanned Docs', 'Receipts', 'Invoices', 'Screenshots'].map(f => (
                        <Badge key={f} variant="outline" className="bg-background border-border/60 font-bold">{f}</Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
                <Card className="relative overflow-hidden rounded-[40px] border-border/60 bg-card/80 backdrop-blur-xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/40">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Check className="text-emerald-500 w-5 h-5" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Optimized For</p>
                        <p className="text-xs font-bold">Standard Office Documents</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/40">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Smartphone className="text-blue-500 w-5 h-5" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Mobile Ready</p>
                        <p className="text-xs font-bold">Social Media Screenshots</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 border border-border/40">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center"><Zap className="text-amber-500 w-5 h-5" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">High Precision</p>
                        <p className="text-xs font-bold">Receipts & Financial Invoices</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LONG-FORM SEO CONTENT */}
      <section className="py-24 md:py-32 bg-secondary/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-invert prose-p:text-muted-foreground prose-h2:text-4xl prose-h2:font-black prose-h2:tracking-tighter prose-h2:italic prose-h3:text-primary prose-h3:uppercase prose-h3:tracking-widest prose-h3:text-sm max-w-none space-y-12">
            <div className="space-y-6">
              <h2 id="extract-text">Extract Text From Images Online Free</h2>
              <p className="text-lg leading-relaxed">
                Optical Character Recognition (OCR) technology converts printed or handwritten text inside images into editable digital text. Our free online OCR tool helps users digitize documents, copy text from screenshots, scan printed pages, and convert handwritten notes into editable files instantly.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
                {[
                  "Digitize physical documents",
                  "Copy text from YouTube/Social Media",
                  "Convert handwritten assignments",
                  "Extract data from business receipts",
                  "Process legal and medical records",
                  "Save content as Word or Text files"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-background border border-border/40">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-12 border-t border-border/40">
              <h2 id="privacy-first">Privacy-First OCR Processing</h2>
              <p className="text-lg leading-relaxed">
                Unlike many online OCR tools, your files are not permanently stored on our servers. We leverage client-side processing using WebAssembly, meaning the OCR engine runs directly inside your browser.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
                <Card className="p-6 rounded-[24px] border-emerald-500/20 bg-emerald-500/5 space-y-3">
                  <WifiOff className="w-6 h-6 text-emerald-500" />
                  <h4 className="font-black uppercase tracking-widest text-[10px]">Local Execution</h4>
                  <p className="text-xs text-muted-foreground font-medium">Processing happens on your RAM, not our cloud.</p>
                </Card>
                <Card className="p-6 rounded-[24px] border-blue-500/20 bg-blue-500/5 space-y-3">
                  <ShieldCheck className="w-6 h-6 text-blue-500" />
                  <h4 className="font-black uppercase tracking-widest text-[10px]">No Tracking</h4>
                  <p className="text-xs text-muted-foreground font-medium">We don't log your files or extraction results.</p>
                </Card>
                <Card className="p-6 rounded-[24px] border-amber-500/20 bg-amber-500/5 space-y-3">
                  <Users className="w-6 h-6 text-amber-500" />
                  <h4 className="font-black uppercase tracking-widest text-[10px]">No Registration</h4>
                  <p className="text-xs text-muted-foreground font-medium">Use the full power of AI without an account.</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI OCR SECTION & EDUCATIONAL */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-32">
            {/* AI OCR Focus */}
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1 space-y-8 order-2 lg:order-1">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic">AI-Powered <span className="text-primary not-italic">Recognition</span></h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Advanced neural networks improve text accuracy, layout preservation, and multi-lingual support. Our engine works effectively even on noisy, blurry, or low-resolution images.
                </p>
                <ul className="space-y-4">
                  {[
                    "Handwriting recognition and conversion",
                    "Multi-column and table detection",
                    "Auto-rotation and tilt correction",
                    "Noisy image recovery and de-blurring"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 order-1 lg:order-2 w-full max-w-md">
                <div className="relative aspect-square rounded-[40px] bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                  <div className="absolute inset-4 rounded-[32px] border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col p-8 space-y-6">
                    <div className="h-4 w-3/4 bg-white/10 rounded-full animate-pulse" />
                    <div className="h-4 w-1/2 bg-white/10 rounded-full animate-pulse" />
                    <div className="h-4 w-5/6 bg-white/10 rounded-full animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-bounce">
                        <Cpu className="w-10 h-10 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What is OCR */}
            <div className="bg-card border border-border/60 rounded-[48px] p-8 md:p-16 flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                   Knowledge Base
                </div>
                <h2 className="text-3xl font-black tracking-tighter italic">What is <span className="text-primary not-italic">OCR?</span></h2>
              </div>
              <div className="lg:w-2/3 space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  OCR stands for <strong>Optical Character Recognition</strong>. It's a technology that allows software to analyze images and detect letters, numbers, and symbols to transform them into searchable and editable digital content.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                  <div className="space-y-3">
                    <h4 className="font-black uppercase tracking-widest text-xs text-primary">How it works</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">OCR software scans the pixel patterns of an image, identifies shapes as characters, and uses language models to reconstruct sentences and paragraphs.</p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-black uppercase tracking-widest text-xs text-primary">Applications</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Widely used in business automation, digitization of archives, and assistive technologies for the visually impaired.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES SECTION */}
      <section className="py-24 md:py-32 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4 mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic">Popular <span className="text-primary not-italic">Use Cases</span></h2>
            <p className="text-muted-foreground font-medium">SafeTools OCR is designed for diverse workflows and professional needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: GraduationCap, title: "Students", desc: "Convert lecture notes, textbooks, and research papers into editable study guides." },
              { icon: Briefcase, title: "Businesses", desc: "Digitize contracts, invoices, and physical records for faster digital workflows." },
              { icon: Code, title: "Developers", desc: "Extract structured text from UI mockups, code screenshots, and documentation." },
              { icon: Search, title: "Researchers", desc: "Transform old scanned archives into searchable PDF documents with selectable text." },
              { icon: Video, title: "Content Creators", desc: "Quickly reuse text from YouTube screenshots, infographics, and memes." },
              { icon: Lock, title: "Legal Professionals", desc: "Securely digitize sensitive case files without risk of data exposure." }
            ].map((useCase, i) => (
              <Card key={i} className="p-8 rounded-[32px] border-border/60 hover:bg-card transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                  <useCase.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-sm italic">{useCase.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">{useCase.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SCREENSHOT, HANDWRITING, PDF OCR SECTIONS */}
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 space-y-40">
           {/* Screenshot */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest">
                   Screenshot Intelligence
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic">Extract Text from <span className="text-blue-500 not-italic">Screenshots</span></h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                   Instantly copy text from YouTube captures, Instagram posts, or Zoom presentations. No more manual typing or re-creating content from scratch.
                </p>
                <div className="flex gap-4">
                   <Badge variant="secondary" className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Social Media</Badge>
                   <Badge variant="secondary" className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Webinars</Badge>
                   <Badge variant="secondary" className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">UI/UX Design</Badge>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl opacity-50 group-hover:opacity-100 transition-all" />
                <Card className="relative overflow-hidden rounded-[32px] border-blue-500/20 bg-card p-4">
                   <div className="aspect-video rounded-2xl bg-secondary/50 flex flex-col items-center justify-center gap-4 border border-blue-500/10 overflow-hidden relative">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426')] opacity-20 bg-cover bg-center" />
                      <div className="relative z-10 p-6 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 max-w-[80%]">
                         <p className="text-[10px] font-mono text-emerald-400 mb-2">Detected String:</p>
                         <p className="text-xs font-mono text-white/80">"SafeTools: Neural Text Extraction v3.0"</p>
                      </div>
                   </div>
                </Card>
              </div>
           </div>

           {/* Handwriting */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="order-2 lg:order-1 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl opacity-50 group-hover:opacity-100 transition-all" />
                <Card className="relative overflow-hidden rounded-[32px] border-amber-500/20 bg-card p-4">
                   <div className="aspect-video rounded-2xl bg-secondary/50 flex flex-col items-center justify-center gap-4 border border-amber-500/10 overflow-hidden relative">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=2670')] opacity-20 bg-cover bg-center" />
                      <div className="relative z-10 flex flex-col items-center">
                        <Type className="w-16 h-16 text-amber-500/40 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Handwriting AI Active</p>
                      </div>
                   </div>
                </Card>
              </div>
              <div className="order-1 lg:order-2 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                   Pen to Pixel
                </div>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic">Handwriting <span className="text-amber-500 not-italic">Recognition</span></h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                   Convert handwritten notes, journal entries, and whiteboards into digital text. Our AI is trained to understand varying handwriting styles and cursive scripts.
                </p>
                <div className="flex gap-4">
                   <Badge variant="secondary" className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Journals</Badge>
                   <Badge variant="secondary" className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Assignments</Badge>
                   <Badge variant="secondary" className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Whiteboards</Badge>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* EXPORT & PERFORMANCE SECTION */}
      <section className="py-24 md:py-32 bg-secondary/5 border-y border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
             {/* Export */}
             <div className="space-y-8">
                <h2 className="text-3xl font-black tracking-tighter italic">Export in <span className="text-primary not-italic">Multiple Formats</span></h2>
                <p className="text-muted-foreground font-medium leading-relaxed">
                   Once your text is extracted, save it in the format that best fits your workflow. Copy instantly or download high-quality files.
                </p>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { icon: FileText, label: "Plain Text (.TXT)" },
                     { icon: FileArchive, label: "Document (.DOCX)" },
                     { icon: Code, label: "Structured (.JSON)" },
                     { icon: TableIcon, label: "Tabular (.CSV)" }
                   ].map((f, i) => (
                     <div key={i} className="p-4 rounded-2xl bg-card border border-border/60 flex items-center gap-3">
                        <f.icon className="w-5 h-5 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{f.label}</span>
                     </div>
                   ))}
                </div>
             </div>

             {/* Performance */}
             <div className="space-y-8">
                <h2 className="text-3xl font-black tracking-tighter italic">Ultra Fast <span className="text-primary not-italic">Neural Engine</span></h2>
                <p className="text-muted-foreground font-medium leading-relaxed">
                   Optimized using WebAssembly and GPU acceleration to ensure fast recognition even on high-resolution assets.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span>Browser Optimization</span>
                         <span className="text-emerald-500">99%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500 w-[99%]" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span>Character Accuracy</span>
                         <span className="text-blue-500">98.5%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500 w-[98.5%]" />
                      </div>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <Zap className="w-3 h-3 text-primary" /> WebAssembly
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      <Cpu className="w-3 h-3 text-primary" /> GPU Accelerated
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic">Why Choose <span className="text-primary not-italic">SafeTools OCR</span></h2>
              <p className="text-muted-foreground font-medium">Compare us with traditional cloud-based OCR tools.</p>
            </div>
            
            <div className="overflow-hidden rounded-[32px] border border-border/60 bg-card shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-secondary/50 border-b border-border/60">
                      <th className="p-6 font-black uppercase tracking-widest text-[10px]">Feature</th>
                      <th className="p-6 font-black uppercase tracking-widest text-[10px] text-primary">SafeTools OCR</th>
                      <th className="p-6 font-black uppercase tracking-widest text-[10px] opacity-40">Traditional Tools</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {[
                      { f: "Browser-Based", s: true, t: "Limited" },
                      { f: "No Upload Required", s: true, t: false },
                      { f: "AI Powered Engine", s: true, t: "Sometimes" },
                      { f: "Handwriting Detection", s: true, t: "Limited" },
                      { f: "Mobile Friendly", s: true, t: "Often Poor" },
                      { f: "Privacy Focused", s: true, t: false },
                      { f: "Free Forever", s: true, t: "Often Limited" }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-secondary/20 transition-colors">
                        <td className="p-6 text-sm font-bold">{row.f}</td>
                        <td className="p-6">
                          {typeof row.s === 'boolean' ? (
                            row.s ? <div className="flex items-center gap-2 text-emerald-500 text-xs font-black uppercase italic"><Check className="w-4 h-4" /> Yes</div> : <X className="w-4 h-4 text-red-500" />
                          ) : <span className="text-xs font-bold">{row.s}</span>}
                        </td>
                        <td className="p-6 opacity-40">
                           {typeof row.t === 'boolean' ? (
                            row.t ? <Check className="w-4 h-4 text-emerald-500" /> : <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase italic"><X className="w-4 h-4" /> No</div>
                          ) : <span className="text-xs font-bold italic">{row.t}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADVANCED FEATURES */}
      <section className="py-24 md:py-32 bg-secondary/5 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4 mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter italic">Advanced <span className="text-primary not-italic">OCR Utilities</span></h2>
            <p className="text-muted-foreground font-medium">Professional features for complex document processing.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: TableIcon, title: "Table Detection", desc: "Extract structured tables from complex financial documents." },
              { icon: Layout, title: "Multi-Column Scan", desc: "Maintain layout for newspapers and multi-column magazines." },
              { icon: Eraser, title: "Noise Removal", desc: "Automatically clean up grainy scans for higher accuracy." },
              { icon: RotateCcw, title: "Auto-Rotation", desc: "Fix tilted document scans instantly during recognition." },
              { icon: History, title: "Batch OCR", desc: "Process multiple image assets simultaneously in your browser." },
              { icon: ShieldCheck, title: "Metadata Cleaning", desc: "Remove hidden tracking metadata from processed images." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-[32px] bg-card border border-border/60 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h4 className="font-black uppercase tracking-widest text-xs italic">{feature.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <FAQ items={OCR_FAQ} title="OCR Frequently Asked Questions" />
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 md:py-40 bg-primary/5 border-t border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--primary-rgb)_0%,_transparent_50%)] opacity-[0.05]" />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-12">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter italic max-w-4xl mx-auto leading-none">
            Convert Images to Editable <span className="text-primary not-italic">Text Instantly</span>
          </h2>
          <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Extract text from screenshots, scanned documents, handwritten notes, and PDFs directly in your browser with fast privacy-first OCR technology.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              onClick={scrollToTool}
              className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-base uppercase tracking-widest shadow-[0_0_40px_-10px_rgba(var(--primary-rgb),0.5)] group"
            >
              Start OCR Now <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              onClick={scrollToTool}
              className="h-16 px-10 rounded-2xl border-border hover:bg-secondary font-black text-base uppercase tracking-widest"
            >
              Upload Image
            </Button>
          </div>
        </div>
      </section>

      <RelatedTools 
        title="Explore More Tools"
        tools={[
          { name: "Image Editor", href: "/image/editor" },
          { name: "Image Compressor", href: "/image/compress" },
          { name: "Image Converter", href: "/image/convert" },
          { name: "PDF to Text", href: "/pdf/ocr" }
        ]}
        className="mt-24"
      />

      <WhySafeTools />
      
      <Footer />
    </div>
  );
}
