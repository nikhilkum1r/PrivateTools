"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { createWorker, Worker } from "tesseract.js";
import { ExportManager } from "@/lib/export-manager";
import { usePersistedState } from "@/hooks/usePersistedState";

import { AdUnit } from "@/components/shared/AdUnit";

// Modular Components
import { OCRHero } from "./components/OCRHero";
import { OCREditor } from "./components/OCREditor";
import { OCRHistory } from "./components/OCRHistory";
import { OCRLandingExtras } from "./components/OCRLandingExtras";

const LANGUAGES = [
  { code: "auto", name: "languages.auto" },
  { code: "eng", name: "languages.eng" },
  { code: "hin", name: "languages.hin" },
  { code: "spa", name: "languages.spa" },
  { code: "fra", name: "languages.fra" },
  { code: "deu", name: "languages.deu" },
  { code: "ara", name: "languages.ara" },
  { code: "chi_sim", name: "languages.chi_sim" },
  { code: "jpn", name: "languages.jpn" },
  { code: "kor", name: "languages.kor" },
  { code: "ita", name: "languages.ita" },
  { code: "por", name: "languages.por" },
  { code: "rus", name: "languages.rus" },
  { code: "eng+hin", name: "languages.eng_hin" },
  { code: "eng+spa", name: "languages.eng_spa" },
  { code: "eng+fra", name: "languages.eng_fra" },
];

interface HistoryItem {
  id: string;
  filename: string;
  text: string;
  timestamp: number;
}

interface OCRClientProps {
  isEmbed?: boolean;
}

export default function OCRClient({ isEmbed }: OCRClientProps = {}) {
  const t = useTranslations("ocr");
  const hp = useTranslations("home");
  const t_tools = useTranslations("tools");

  const [files, setFiles] = useState<File[]>([]);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "processing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("eng");
  const [detectedLang, setDetectedLang] = useState<string>();
  const [copied, setCopied] = useState(false);
  const [history, setHistory, clearHistory] = usePersistedState<HistoryItem[]>(
    "ocr:history",
    [],
    7 * 24 * 60 * 60 * 1000 // 7-day TTL
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [words, setWords] = useState<any[]>([]);


  const toolRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);


  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const getWorker = async () => {
    // If worker exists and language matches, return it
    if (workerRef.current && (workerRef.current as any)._lang === language) {
      return workerRef.current;
    }
    
    try {
      if (workerRef.current) {
        await workerRef.current.terminate();
        workerRef.current = null;
      }
      
      setStatus("loading");
      // Tesseract.js v5+ prefers language code as first arg
      // For auto-detection, we default to eng as the primary engine
      const langCode = language === "auto" ? "eng" : language;
      
      const worker = await createWorker(langCode, 1, {
        logger: m => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
        workerBlobURL: true,
        langPath: "https://tessdata.projectnaptha.com/4.0.0",
      });
      
      (worker as any)._lang = language;
      workerRef.current = worker;
      return worker;
    } catch (err) {
      console.error("Failed to initialize Tesseract worker:", err);
      throw new Error("Neural Engine failed to start. Check your internet connection.");
    }
  };

  const convertToStandardImage = async (file: File, highQuality = false): Promise<Blob | Blob[]> => {
    if (file.type === "application/pdf") {
      try {
        const pdfjs = await import("pdfjs-dist");
        if (typeof window !== 'undefined') {
          pdfjs.GlobalWorkerOptions.workerSrc = window.location.origin + `/lib/pdfjs/pdf.worker.min.mjs`;
        }
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        const pages: Blob[] = [];
        
        const maxPages = highQuality ? pdf.numPages : 1;
        for (let i = 1; i <= maxPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: highQuality ? 2.5 : 1.5 });
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await (page as any).render({ canvasContext: ctx, viewport, canvas }).promise;
          const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95));
          pages.push(blob);
        }
        return pages;
      } catch (err) {
        console.error("PDF to Image conversion failed:", err);
        throw new Error("Failed to process PDF. Make sure it's not password protected.");
      }
    }

    if (file.type === "image/heic") {
      try {
        const heic2any = (await import("heic2any")).default;
        const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
        const finalBlob = Array.isArray(result) ? result[0] : result;
        return finalBlob as Blob;
      } catch (err) {
        console.error("HEIC conversion failed:", err);
        throw new Error("Failed to convert HEIC image.");
      }
    }

    return file;
  };

  const enhanceImageForOCR = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        const minDimension = 1500; // Optimized for speed/accuracy balance
        const scale = Math.max(1, minDimension / Math.max(img.width, img.height));
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // High quality filtering for OCR
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.filter = "contrast(1.5) grayscale(1) brightness(1.1)";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        resolve(canvas.toDataURL("image/jpeg", 0.95));
      };

      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        console.error("Image loading failed for OCR enhancement", e);
        reject(new Error("Failed to load image for processing"));
      };

      img.src = url;
    });
  };

  useEffect(() => {
    if (files.length === 0) {
      setPreview(null);
      setActiveFile(null);
      return;
    }

    const active = files[currentFileIndex];
    setActiveFile(active);

    let objectUrl: string;
    const generatePreview = async () => {
      try {
        const standardImage = await convertToStandardImage(active, false);
        const previewBlob = Array.isArray(standardImage) ? standardImage[0] : standardImage;
        objectUrl = URL.createObjectURL(previewBlob as Blob);
        setPreview(objectUrl);
      } catch (e) {
        console.error("Preview generation failed", e);
      }
    };

    generatePreview();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [files, currentFileIndex]);

  const handleDrop = useCallback((newFiles: File[]) => {
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      setStatus("idle");
    }
  }, []);

  const runOCR = async () => {
    if (files.length === 0) return;
    setStatus("loading");
    setProgress(0);
    setResult("");
    let cumulativeText = "";

    try {
      const worker = await getWorker();

      for (let fIdx = 0; fIdx < files.length; fIdx++) {
        console.log(`Starting OCR for file ${fIdx + 1}/${files.length}`);
        setCurrentFileIndex(fIdx);
        const currentFile = files[fIdx];
        const baseImages = await convertToStandardImage(currentFile, true);
        const images = Array.isArray(baseImages) ? baseImages : [baseImages];

        cumulativeText += `\n--- FILE: ${currentFile.name} ---\n\n`;

        for (let i = 0; i < images.length; i++) {
          console.log(`Processing page ${i + 1}/${images.length}`);
          const enhancedSource = await enhanceImageForOCR(images[i] as Blob);
          setStatus("processing");
          const { data } = await worker.recognize(enhancedSource);
          console.log(`OCR complete for page ${i + 1}. Text length: ${data.text.length}`);
          setResult(prev => prev + (prev ? "\n\n" : "") + data.text);
          setWords((data as any).words || []);
          cumulativeText += (i > 0 ? "\n\n--- Page " + (i + 1) + " ---\n\n" : "") + data.text;
          setProgress(Math.round(((fIdx + (i + 1) / images.length) / files.length) * 100));
        }
      }

      const finalResult = cumulativeText.trim();
      const hasActualText = finalResult.split('\n').some(line => line.trim() && !line.startsWith('--- FILE:') && !line.startsWith('--- Page'));

      if (!hasActualText) {
        toast.warning("No text detected. Try a clearer image.");
        setResult("No text detected.");
      } else {
        setResult(finalResult);
      }
      
      setHistory(prev => [{
        id: Math.random().toString(36).substring(7),
        filename: files.length > 1 ? `${files.length} Files Batch` : files[0].name,
        text: finalResult || "No text detected",
        timestamp: Date.now(),
      }, ...prev]);

      setStatus("done");
      toast.success(t("messages.extractionSuccess", { count: files.length }));
    } catch (error: any) {
      console.error("OCR Extraction Error:", error);
      setStatus("idle");
      setProgress(0);
      toast.error(error?.message?.includes("network") 
        ? "Network error: Failed to download language data." 
        : t("messages.extractionFailed")
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success(t("messages.copySuccess"));
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
    const extension = format;

    if (format === 'json') {
      content = JSON.stringify({
        metadata: { source: activeFile?.name, timestamp: new Date().toISOString() },
        fullText: result,
        data: words.map(w => ({ text: w.text, confidence: w.confidence, bbox: w.bbox }))
      }, null, 2);
      mimeType = "application/json";
    } else if (format === 'csv') {
      const csvHeader = "Word,Confidence,X0,Y0,X1,Y1\n";
      const csvRows = words.map(w => `"${w.text.replace(/"/g, '""')}",${w.confidence},${w.bbox.x0},${w.bbox.y0},${w.bbox.x1},${w.bbox.y1}`).join("\n");
      content = csvHeader + csvRows;
      mimeType = "text/csv";
    } else if (format === 'docx') {
       // Simplified docx export or use ExportManager
    }

    const blob = typeof content === "string" ? new Blob([content], { type: mimeType }) : content;
    ExportManager.downloadFile(blob, `ocr-${activeFile?.name.split('.')[0] || 'result'}.${extension}`);
  };

  return (
    <div className={`flex flex-col ${isEmbed ? 'h-full bg-transparent' : 'min-h-screen bg-background'} text-foreground selection:bg-primary/30`}>
      {!isEmbed && <Navbar />}
      <main className="flex-grow">
        {!isEmbed && <OCRHero t={t} scrollToTool={() => toolRef.current?.scrollIntoView({ behavior: "smooth" })} />}
        
        {!isEmbed && (
          <div className="container mx-auto px-4 mb-20">
            <AdUnit type="banner" />
          </div>
        )}

        <section ref={toolRef} className={`container mx-auto px-4 ${isEmbed ? 'py-4' : 'pb-24 md:pb-32'} max-w-6xl`}>
          <OCREditor 
            t={t}
            files={files}
            onDrop={handleDrop}
            onClear={() => { setFiles([]); setResult(""); setStatus("idle"); }}
            status={status}
            progress={progress}
            language={language}
            setLanguage={setLanguage}
            LANGUAGES={LANGUAGES}
            runOCR={runOCR}
            result={result}
            setResult={setResult}
            preview={preview}
            copied={copied}
            handleCopy={handleCopy}
            handleSpeak={handleSpeak}
            isSpeaking={isSpeaking}
            downloadFile={downloadFile}
            detectedLang={detectedLang}
            currentFileIndex={currentFileIndex}
          />
        </section>

        {!isEmbed && (
          <>
            <OCRHistory 
              t={t} 
              history={history} 
              setHistory={setHistory} 
              onRestore={(item) => { setResult(item.text); toolRef.current?.scrollIntoView({ behavior: "smooth" }); }} 
            />

            <div className="container mx-auto px-4 pb-20">
              <AdUnit type="multiplex" />
            </div>

            <OCRLandingExtras t={t} hp={hp} t_tools={t_tools} />
          </>
        )}
      </main>
      {!isEmbed && <Footer />}
    </div>
  );
}
