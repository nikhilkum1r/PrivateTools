"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { StudioLayout } from "@/components/shared/StudioLayout";
import { Edit3 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import type { PdfEditorCanvasProps } from "./components/PdfEditorCanvas";
import type { EditPdfLandingExtrasProps } from "./components/EditPdfLandingExtras";

// SSR-safe dynamic imports — pdfjs-dist uses DOMMatrix which is browser-only
const PdfEditorCanvas = dynamic<PdfEditorCanvasProps>(
  () => import("./components/PdfEditorCanvas").then(m => ({ default: m.PdfEditorCanvas })),
  { ssr: false }
);

const EditPdfLandingExtras = dynamic<EditPdfLandingExtrasProps>(
  () => import("./components/EditPdfLandingExtras").then(m => ({ default: m.EditPdfLandingExtras })),
  { ssr: false }
);

export interface Annotation {
  id: string;
  type: "text" | "draw" | "highlight" | "image";
  page: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  // Text specific
  text?: string;
  fontSize?: number;
  color?: string;
  // Draw specific
  paths?: { x: number; y: number }[];
  strokeWidth?: number;
  strokeColor?: string;
  // Highlight specific
  highlightColor?: string;
  opacity?: number;
  // Image specific
  imageData?: string; // base64
  imageWidth?: number;
  imageHeight?: number;
}

export interface PageInfo {
  pageNum: number;
  rotation: number;
  width: number;
  height: number;
  thumbnailUrl?: string;
}

export default function EditPdfClient() {
  const t = useTranslations("pdfEditor");
  const common = useTranslations("common");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedBlob, setEditedBlob] = useState<Blob | null>(null);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);

  const loadPdf = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file || file.type !== "application/pdf") {
      toast.error(t("messages.invalidFile"));
      return;
    }

    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = doc.getPageCount();

      const pageInfos: PageInfo[] = [];
      for (let i = 0; i < pageCount; i++) {
        const page = doc.getPage(i);
        const { width, height } = page.getSize();
        pageInfos.push({
          pageNum: i + 1,
          rotation: page.getRotation().angle,
          width,
          height,
        });
      }

      setPdfFile(file);
      setPdfDoc(doc);
      setPdfBytes(buffer);
      setPages(pageInfos);
      setCurrentPage(1);
      setAnnotations([]);
      setEditedBlob(null);
      setEditedUrl(null);

      toast.success(t("messages.fileLoaded", { pages: pageCount }));
    } catch (e: any) {
      console.error("Failed to load PDF", e);
      toast.error(t("messages.invalidFile"));
    } finally {
      setIsProcessing(false);
    }
  }, [t]);

  const addAnnotation = useCallback((annotation: Annotation) => {
    setAnnotations(prev => [...prev, annotation]);
  }, []);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearAnnotations = useCallback((pageNum?: number) => {
    if (pageNum) {
      setAnnotations(prev => prev.filter(a => a.page !== pageNum));
    } else {
      setAnnotations([]);
    }
  }, []);

  const rotatePage = useCallback((pageNum: number, direction: "left" | "right") => {
    setPages(prev =>
      prev.map(p =>
        p.pageNum === pageNum
          ? { ...p, rotation: (p.rotation + (direction === "right" ? 90 : -90) + 360) % 360 }
          : p
      )
    );
    toast.success(t("messages.pageRotated", { page: pageNum }));
  }, [t]);

  const deletePage = useCallback((pageNum: number) => {
    if (pages.length <= 1) return;
    setPages(prev => {
      const filtered = prev.filter(p => p.pageNum !== pageNum);
      return filtered.map((p, i) => ({ ...p, pageNum: i + 1 }));
    });
    setAnnotations(prev =>
      prev
        .filter(a => a.page !== pageNum)
        .map(a => (a.page > pageNum ? { ...a, page: a.page - 1 } : a))
    );
    if (currentPage > pages.length - 1) {
      setCurrentPage(Math.max(1, pages.length - 1));
    }
    toast.success(t("messages.pageDeleted", { page: pageNum }));
  }, [pages, currentPage, t]);

  const savePdf = useCallback(async () => {
    if (!pdfBytes || !pdfDoc) return;
    setIsProcessing(true);

    try {
      const doc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const helvetica = await doc.embedFont(StandardFonts.Helvetica);

      // Remove deleted pages (in reverse order so indexes don't shift)
      const originalPageCount = doc.getPageCount();
      const pagesToRemove: number[] = [];
      for (let i = 0; i < originalPageCount; i++) {
        if (i >= pages.length) pagesToRemove.push(i);
      }
      for (const idx of pagesToRemove.reverse()) {
        doc.removePage(idx);
      }

      // Apply rotations
      for (let i = 0; i < pages.length; i++) {
        const pageInfo = pages[i];
        const page = doc.getPage(i);
        if (pageInfo.rotation !== page.getRotation().angle) {
          page.setRotation(degrees(pageInfo.rotation));
        }
      }

      // Apply annotations
      for (const ann of annotations) {
        const pageIndex = ann.page - 1;
        if (pageIndex < 0 || pageIndex >= doc.getPageCount()) continue;
        const page = doc.getPage(pageIndex);
        const { height: pageHeight } = page.getSize();

        switch (ann.type) {
          case "text": {
            const fontSize = ann.fontSize || 16;
            const colorHex = ann.color || "#000000";
            const r = parseInt(colorHex.slice(1, 3), 16) / 255;
            const g = parseInt(colorHex.slice(3, 5), 16) / 255;
            const b = parseInt(colorHex.slice(5, 7), 16) / 255;
            page.drawText(ann.text || "", {
              x: ann.x,
              y: pageHeight - ann.y - fontSize,
              size: fontSize,
              font: helvetica,
              color: rgb(r, g, b),
            });
            break;
          }
          case "draw": {
            if (ann.paths && ann.paths.length > 1) {
              const colorHex = ann.strokeColor || "#ff0000";
              const r = parseInt(colorHex.slice(1, 3), 16) / 255;
              const g = parseInt(colorHex.slice(3, 5), 16) / 255;
              const b = parseInt(colorHex.slice(5, 7), 16) / 255;
              const strokeW = ann.strokeWidth || 2;
              for (let i = 1; i < ann.paths.length; i++) {
                page.drawLine({
                  start: { x: ann.paths[i - 1].x, y: pageHeight - ann.paths[i - 1].y },
                  end: { x: ann.paths[i].x, y: pageHeight - ann.paths[i].y },
                  thickness: strokeW,
                  color: rgb(r, g, b),
                });
              }
            }
            break;
          }
          case "highlight": {
            const colorHex = ann.highlightColor || "#ffff00";
            const r = parseInt(colorHex.slice(1, 3), 16) / 255;
            const g = parseInt(colorHex.slice(3, 5), 16) / 255;
            const b = parseInt(colorHex.slice(5, 7), 16) / 255;
            page.drawRectangle({
              x: ann.x,
              y: pageHeight - ann.y - (ann.height || 30),
              width: ann.width || 200,
              height: ann.height || 30,
              color: rgb(r, g, b),
              opacity: ann.opacity || 0.3,
            });
            break;
          }
          case "image": {
            if (ann.imageData) {
              try {
                const imgBytes = Uint8Array.from(atob(ann.imageData), c => c.charCodeAt(0));
                let embeddedImg;
                try {
                  embeddedImg = await doc.embedPng(imgBytes);
                } catch {
                  embeddedImg = await doc.embedJpg(imgBytes);
                }
                const imgW = ann.imageWidth || 100;
                const imgH = ann.imageHeight || 100;
                page.drawImage(embeddedImg, {
                  x: ann.x,
                  y: pageHeight - ann.y - imgH,
                  width: imgW,
                  height: imgH,
                });
              } catch (imgErr) {
                console.warn("Failed to embed image annotation", imgErr);
              }
            }
            break;
          }
        }
      }

      const savedBytes = await doc.save();
      const blob = new Blob([savedBytes as any], { type: "application/pdf" });
      setEditedBlob(blob);
      setEditedUrl(URL.createObjectURL(blob));
      toast.success(t("messages.pdfSaved"));
    } catch (e: any) {
      console.error("Failed to save PDF", e);
      toast.error(t("messages.saveFailed"));
    } finally {
      setIsProcessing(false);
    }
  }, [pdfBytes, pdfDoc, pages, annotations, t]);

  const handleReset = useCallback(() => {
    setPdfFile(null);
    setPdfDoc(null);
    setPdfBytes(null);
    setPages([]);
    setCurrentPage(1);
    setAnnotations([]);
    setEditedBlob(null);
    setEditedUrl(null);
    setIsProcessing(false);
  }, []);

  const inputSize = pdfFile?.size || 0;

  return (
    <StudioLayout
      title={t.raw("hero.title")}
      description={t.raw("hero.description")}
      heroIcon={Edit3}
      badge={t("hero.disclaimer")}
      trustColor="indigo"
      breadcrumbs={[
        { label: common("Navbar.categories.pdf"), href: "/pdf" },
        { label: t("seo.title"), href: "/pdf/edit-pdf" }
      ]}
      trustTitle={t("landing.features.title") || "PDF Editing"}
      trustDesc={t("landing.secure.description") || t("hero.description")}
      footerExtras={<EditPdfLandingExtras t={t} />}
    >
      <PdfEditorCanvas
        t={t}
        pdfFile={pdfFile}
        pdfBytes={pdfBytes}
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        annotations={annotations}
        isProcessing={isProcessing}
        editedBlob={editedBlob}
        editedUrl={editedUrl}
        loadPdf={loadPdf}
        addAnnotation={addAnnotation}
        removeAnnotation={removeAnnotation}
        clearAnnotations={clearAnnotations}
        rotatePage={rotatePage}
        deletePage={deletePage}
        savePdf={savePdf}
        handleReset={handleReset}
        inputSize={inputSize}
      />
    </StudioLayout>
  );
}
