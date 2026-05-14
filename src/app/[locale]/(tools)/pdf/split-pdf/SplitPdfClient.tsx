"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ExportManager } from "@/lib/export-manager";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Scissors, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Modular Components
import { StudioLayout } from "@/components/shared/StudioLayout";
import { SplitPdfEditor } from "./components/SplitPdfEditor";
import { SplitPdfLandingExtras } from "./components/SplitPdfLandingExtras";

interface SplitFile {
  id: string;
  file: File;
  pageCount: number;
  status: "idle" | "processing" | "completed" | "error";
  results: { url: string; name: string }[];
}

export default function SplitPdfClient() {
  const t = useTranslations("splitPdf");
  const common = useTranslations("common");
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
      toast.error(t("messages.unsupported_file"));
      return;
    }
    try {
      const buffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdf.getPageCount();
      setFile({ id: Math.random().toString(36).substring(7), file: f, pageCount: count, status: "idle", results: [] });
      setCustomRanges(`1-${Math.ceil(count / 2)}, ${Math.ceil(count / 2) + 1}-${count}`);
      toast.success(t("messages.loaded", { count }));
    } catch (e) {
      toast.error(t("messages.read_error"));
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
        setRangeError(t("messages.invalid_start", { start }));
        return null;
      }
      if (end < start || end > file.pageCount) {
        setRangeError(t("messages.invalid_end", { end, max: file.pageCount }));
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
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
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
      toast.success(t("messages.split_success", { count: results.length }));
    } catch (e) {
      setFile(prev => prev ? { ...prev, status: "error" } : null);
      toast.error(t("messages.split_error"));
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
    <StudioLayout
      title={t("hero.title")}
      description={t("hero.description")}
      heroIcon={Scissors}
      badge={t("hero.disclaimer")}
      trustColor="blue"
      breadcrumbs={[
        { label: common("Navbar.categories.pdf"), href: "/pdf" },
        { label: t("seo.title"), href: "/pdf/split-pdf" }
      ]}
      trustTitle={t("studio.identity")}
      trustDesc={t("hero.description")}
      footerExtras={<SplitPdfLandingExtras t={t} />}
    >
      <div className="glass-card rounded-3xl border border-border shadow-2xl bg-secondary/30 overflow-hidden relative min-h-[600px] flex flex-col">
        {/* Consistent Studio Header */}
        <div className="px-6 py-4 border-b border-border bg-black/20 flex items-center justify-between shrink-0">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-500 flex items-center gap-2">
            <Layers className="w-4 h-4" /> {t("studio.identity")}
          </h3>
          <Badge variant="outline" className="text-[9px] font-semibold uppercase tracking-wider border-blue-500/30 text-blue-400 bg-blue-500/10">
            {t("studio.active")}
          </Badge>
        </div>

        <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        <SplitPdfEditor 
          t={t}
          file={file}
          setFile={setFile}
          splitMode={splitMode}
          setSplitMode={setSplitMode}
          fixedInterval={fixedInterval}
          setFixedInterval={setFixedInterval}
          customRanges={customRanges}
          setCustomRanges={setCustomRanges}
          isProcessing={isProcessing}
          progress={progress}
          rangeError={rangeError}
          setRangeError={setRangeError}
          pageSelStart={pageSelStart}
          setPageSelStart={setPageSelStart}
          isZipping={isZipping}
          handleFileDrop={handleFileDrop}
          splitPdf={splitPdf}
          downloadAll={downloadAll}
          estimatedParts={estimatedParts}
        />
      </div>
    </div>
  </StudioLayout>
  );
}
