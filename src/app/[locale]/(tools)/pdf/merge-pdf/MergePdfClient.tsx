"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { StudioLayout } from "@/components/shared/StudioLayout";
import { Files } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

// Modular Components
import { MergePdfHero } from "./components/MergePdfHero";
import { MergePdfEditor } from "./components/MergePdfEditor";
import { MergePdfLandingExtras } from "./components/MergePdfLandingExtras";
import { AdUnit } from "@/components/shared/AdUnit";

interface PDFFile {
  id: string;
  file: File;
  status: "idle" | "processing" | "completed" | "error";
  previewUrl?: string;
  pageCount?: number;
}

export default function MergePdfClient() {
  const t = useTranslations("pdfMerge");
  const common = useTranslations("common");
  const trust = useTranslations("trust.points");

  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");

  const addFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.filter(
      f => f.type === "application/pdf"
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
    toast.success(t("messages.filesAdded", { count: mapped.length }));
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
    setProgressLabel(t("studio.initializing"));

    try {
      const mergedPdf = await PDFDocument.create();
      
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        const file = fileData.file;
        const pct = Math.round(((i) / files.length) * 85);
        setProgress(pct);
        setProgressLabel(t("studio.processing", { name: file.name }));

        setFiles(prev => prev.map(f => f.id === fileData.id ? { ...f, status: "processing" } : f));

        if (file.type === "application/pdf") {
          const fileBuffer = await file.arrayBuffer();
          let pdf;
          try {
            pdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
          } catch (loadErr: any) {
            if (loadErr.message?.includes("encrypted")) {
              throw new Error(t("messages.encrypted_file", { name: file.name }) || `The file "${file.name}" is encrypted. Please unlock it using our PDF Unlock tool first.`);
            }
            throw loadErr;
          }
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach(page => mergedPdf.addPage(page));
        }
        setFiles(prev => prev.map(f => f.id === fileData.id ? { ...f, status: "completed" } : f));
      }

      setProgress(95);
      setProgressLabel(t("studio.finalizing"));
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
      setMergedBlob(blob);
      setMergedUrl(URL.createObjectURL(blob));
      setProgress(100);
      setProgressLabel(t("studio.complete"));
      toast.success(t("messages.filesMerged", { count: files.length }));
    } catch (e: any) {
      console.error("Document merging failed", e);
      toast.error(t("messages.mergingFailed") + (e.message ? `: ${e.message}` : ""));
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

  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);

  return (
    <StudioLayout
      title={t("hero.title")}
      description={t("hero.description")}
      heroIcon={Files}
      badge={t("hero.disclaimer")}
      trustColor="emerald"
      breadcrumbs={[
        { label: common("Navbar.categories.pdf"), href: "/pdf" },
        { label: t("seo.title"), href: "/pdf/merge-pdf" }
      ]}
      trustTitle={t("landing.features.title") || "Secure Merging"}
      trustDesc={t("landing.educational.privacy.description") || t("hero.description")}
      footerExtras={<MergePdfLandingExtras t={t} />}
    >
      <MergePdfEditor
        t={t}
        files={files}
        setFiles={setFiles}
        isProcessing={isProcessing}
        mergedUrl={mergedUrl}
        mergedBlob={mergedBlob}
        progress={progress}
        progressLabel={progressLabel}
        addFiles={addFiles}
        removeFile={removeFile}
        processDocuments={processDocuments}
        handleReset={handleReset}
        totalSize={totalSize}
      />
    </StudioLayout>
  );
}
