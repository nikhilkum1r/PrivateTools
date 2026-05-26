"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useImageStore } from "@/store/useImageStore";
import { processImage } from "@/lib/image-processor";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ExportManager } from "@/lib/export-manager";

// Modular Components
import { ConversionHero } from "./components/ConversionHero";
import { ConversionEditor } from "./components/ConversionEditor";
import { ConversionLandingExtras } from "./components/ConversionLandingExtras";
import { AdUnit } from "@/components/shared/AdUnit";

const CATEGORIZED_FORMATS = {
  "regular": ["webp", "jpeg", "png", "pdf", "svg", "heic"],
  "web": ["webp", "jpeg", "jpg", "png", "gif", "svg", "ico", "cur", "bmp", "apng", "jfif", "pjpeg", "pjp"],
  "modern": ["avif", "heic", "heif", "jxl", "flif", "apng", "mng"],
  "print": ["pdf", "tiff", "tif", "eps", "ai", "psd", "psb", "indd", "indt"],
  "design": ["xcf", "kra", "ora", "afphoto", "cdr", "cmx"],
  "game": ["tga", "dds", "ktx", "ktx2", "basis", "pvr", "astc", "pkm", "vtf", "tex"],
  "raw": ["raw", "dng", "cr2", "cr3", "crw", "nef", "nrw", "arw", "srf", "sr2", "orf", "rw2", "raf", "pef", "erf", "kdc", "dcr", "mos", "mef", "mrw", "x3f", "3fr", "fff", "iiq", "cap", "rwl", "bay", "cine"],
  "scientific": ["dicom", "dcm", "dicomweb", "fits", "fts", "img", "nii", "nrrd"],
  "vector": ["svg", "svgz", "ai", "eps", "pdf", "dwg", "dxf", "wmf", "emf", "odg"],
  "hdr": ["exr", "hdr", "rgbe", "pic"],
  "document": ["docx", "doc", "xlsx", "xls", "pptx", "ppt", "csv", "txt", "md", "rtf", "odt", "ods", "odp"],
  "legacy": ["pcx", "pnm", "xbm", "xpm", "dib", "rle", "iff", "lbm", "pbm", "pgm", "ppm"]
};

interface ConversionStudioClientProps {
  fromFormat?: string;
  toFormat?: string;
  isEmbed?: boolean;
}

export default function ConversionStudioClient({ fromFormat, toFormat, isEmbed }: ConversionStudioClientProps) {
  const { 
    files, settings, addFiles, removeFile, 
    updateSettings, setFileStatus, setProcessedUrl, clearFiles 
  } = useImageStore();

  const t = useTranslations("imageConverter");
  const common = useTranslations("common");
  
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [step, setStep] = useState<"upload" | "configure" | "processing" | "result">("upload");

  // Lifetime Stats Logic
  const [lifetimeSavings, setLifetimeSavings] = useState(0);
  const [lifetimeCount, setLifetimeCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("safetools_image_stats");
    if (saved) {
      const data = JSON.parse(saved);
      setLifetimeSavings(data.savings || 0);
      setLifetimeCount(data.count || 0);
    }
  }, []);

  const updateLifetimeStats = (newSavings: number) => {
    const nextSavings = lifetimeSavings + newSavings;
    const nextCount = lifetimeCount + 1;
    setLifetimeSavings(nextSavings);
    setLifetimeCount(nextCount);
    localStorage.setItem("safetools_image_stats", JSON.stringify({ savings: nextSavings, count: nextCount }));
  };

  useEffect(() => {
    if (toFormat) {
      updateSettings({ format: toFormat as any });
    }
  }, [toFormat, updateSettings]);

  const handleFilesDrop = async (newFiles: File[]) => {
    const toAdd: File[] = [];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".heif", ".tiff", ".tif", ".psd", ".svg"];
    
    for (const f of newFiles) {
      const fileName = f.name.toLowerCase();
      const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext)) || f.type.startsWith("image/");
      
      if (!isAllowed) {
        toast.error(`${f.name} is not a supported image format.`);
        continue;
      }

      toAdd.push(f);
    }
    addFiles(toAdd);
    setStep("configure");
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            // Give pasted images a proper name if they don't have one
            const ext = file.type.split('/')[1] || 'png';
            const namedFile = new File([file], `pasted-image-${Date.now()}.${ext}`, { type: file.type });
            pastedFiles.push(namedFile);
          }
        }
      }
      if (pastedFiles.length > 0) {
        handleFilesDrop(pastedFiles);
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [addFiles]);

  const convertFile = async (id: string) => {
    const f = files.find(x => x.id === id);
    if (!f) return;
    setFileStatus(id, "processing", 10);
    try {
      const result = await processImage(f.file, {
        ...settings,
        targetSize: settings.targetSize ? settings.targetSize * 1024 : undefined
      }, (p) => {
        setFileStatus(id, "processing", p);
      });
      setProcessedUrl(id, result.url, result.blob.size);
      
      const savings = f.file.size - result.blob.size;
      if (savings > 0) updateLifetimeStats(savings);
    } catch (err) {
      console.error(err);
      setFileStatus(id, "error");
    }
  };

  const convertAll = async () => {
    setIsProcessingAll(true);
    const batchSize = 3;
    const idleFiles = files.filter(f => f.status !== "completed");
    for (let i = 0; i < idleFiles.length; i += batchSize) {
      const batch = idleFiles.slice(i, i + batchSize);
      await Promise.all(batch.map(f => convertFile(f.id)));
    }
    setStep("result");
    setIsProcessingAll(false);
  };

  const downloadAll = async () => {
    setIsProcessingAll(true);
    try {
      const completed = files.filter(f => f.status === "completed" && f.processedUrl);
      if (completed.length === 0) {
        toast.error(t("toast.noProcessed"));
        return;
      }

      const exportFiles = await Promise.all(completed.map(async (f) => {
        const response = await fetch(f.processedUrl!);
        const blob = await response.blob();
        return {
          blob,
          name: `${f.file.name.split(".")[0]}.${settings.format}`
        };
      }));

      await ExportManager.downloadZip(exportFiles, "converted-studio-assets.zip");
    } finally {
      setIsProcessingAll(false);
    }
  };

  const downloadSingle = async (id: string) => {
    const f = files.find(x => x.id === id);
    if (!f || !f.processedUrl) return;
    await ExportManager.downloadFromUrl(
      f.processedUrl, 
      `${f.file.name.split(".")[0]}.${settings.format}`
    );
  };

  const copyToClipboard = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      toast.success(t("toast.copied"));
    } catch (err) {
      toast.error(t("toast.clipboardFailed"));
    }
  };

  const totalOriginalSize = files.reduce((acc, f) => acc + f.file.size, 0);
  const totalOutputSize = files.reduce((acc, f) => acc + (f.outputSize || 0), 0);
  const totalSavings = totalOriginalSize > 0 && totalOutputSize > 0 ? totalOriginalSize - totalOutputSize : 0;

  return (
    <div className={`flex flex-col ${isEmbed ? 'h-full bg-transparent' : 'min-h-screen lg:h-screen bg-background'} text-foreground overflow-y-auto lg:overflow-hidden selection:bg-primary/30 custom-scrollbar relative`}>
      {!isEmbed && (
        <>
          <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
          <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          <Navbar />
        </>
      )}

      <main id="main-content" className="flex-grow relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 z-50 bg-secondary/20">
          <motion.div
            className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
            initial={{ width: "25%" }}
            animate={{
              width: step === "upload" ? "25%" : step === "configure" ? "50%" : step === "processing" ? "75%" : "100%"
            }}
          />
        </div>

        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="w-full flex flex-col items-center">
            <section className={`w-full max-w-[1600px] px-6 md:px-16 ${isEmbed ? 'py-4' : 'py-12 md:py-24'}`}>
              <AnimatePresence mode="wait">
                {step === "upload" && files.length === 0 ? (
                  <ConversionHero 
                    t={t} 
                    fromFormat={fromFormat} 
                    toFormat={toFormat} 
                    handleFilesDrop={handleFilesDrop} 
                  />
                ) : (
                  <ConversionEditor 
                    t={t}
                    common={common}
                    files={files}
                    settings={settings}
                    updateSettings={updateSettings}
                    clearFiles={clearFiles}
                    removeFile={removeFile}
                    convertFile={convertFile}
                    convertAll={convertAll}
                    downloadAll={downloadAll}
                    downloadSingle={downloadSingle}
                    copyToClipboard={copyToClipboard}
                    handleFilesDrop={handleFilesDrop}
                    step={step}
                    setStep={setStep}
                    totalSavings={totalSavings}
                    lifetimeSavings={lifetimeSavings}
                    lifetimeCount={lifetimeCount}
                    isProcessingAll={isProcessingAll}
                    CATEGORIZED_FORMATS={CATEGORIZED_FORMATS}
                  />
                )}
              </AnimatePresence>
            </section>

            {!isEmbed && (
              <>
                <></>
                <ConversionLandingExtras t={t} common={common} />
              </>
            )}
          </div>
        </div>
      </main>
      {!isEmbed && <Footer />}
    </div>
  );
}
