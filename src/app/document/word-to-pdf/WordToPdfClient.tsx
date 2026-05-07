"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileOutput, Loader2, Trash2, FileText, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { FileSizeWarning } from "@/components/shared/FileSizeWarning";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatBytes } from "@/lib/utils/fileSize";
import { toast } from "sonner";

// ─── Core conversion logic ────────────────────────────────────────────────────
// We use docx-preview (renders DOCX → DOM) + html2canvas (DOM → canvas image) +
// jsPDF (canvas → paginated PDF). This avoids html2pdf.js which is a UMD bundle
// that breaks when dynamically imported inside Next.js (unresolved externals).
async function docxToPdf(file: File): Promise<Blob> {
  // Lazy-load all heavy libs — none of these run on the server
  const { renderAsync } = await import("docx-preview");
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  // Offscreen container at A4 width (794px ≈ 210mm @ 96dpi)
  const container = document.createElement("div");
  container.style.cssText = [
    "position:fixed",
    "left:-99999px",
    "top:0",
    "width:794px",
    "min-height:1px",
    "background:#ffffff",
    "color:#000000",
    "font-size:11pt",
    "line-height:1.5",
    "-webkit-print-color-adjust:exact",
  ].join(";");
  document.body.appendChild(container);

  try {
    // 1. Render DOCX → HTML inside the container
    await renderAsync(await file.arrayBuffer(), container, undefined, {
      className: "docx-preview-wtp",
      ignoreLastRenderedPageBreak: false,
    });

    // 2. Wait for DOM/images to settle
    await new Promise((r) => setTimeout(r, 700));

    // 3. Snapshot the full rendered height into a single canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      // Capture full scrollable height
      windowWidth: 794,
      windowHeight: container.scrollHeight,
      width: 794,
      height: container.scrollHeight,
    });

    // 4. Build PDF — A4 portrait in mm
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = pdf.internal.pageSize.getWidth();  // 210 mm
    const pageH = pdf.internal.pageSize.getHeight(); // 297 mm

    // Scale canvas to fit A4 width; compute total image height in mm
    const imgW = pageW;
    const imgH = (canvas.height / canvas.width) * imgW;

    const imgData = canvas.toDataURL("image/jpeg", 0.96);

    // 5. Paginate: draw the full image across multiple pages
    //    By shifting the Y origin by -pageH * pageIndex, we "scroll" through it.
    let pagesWritten = 0;
    let yRendered = 0; // mm of image already "past the top"
    while (yRendered < imgH) {
      if (pagesWritten > 0) pdf.addPage();
      // Draw image starting at -yRendered so the right slice aligns to page top
      pdf.addImage(imgData, "JPEG", 0, -yRendered, imgW, imgH);
      yRendered += pageH;
      pagesWritten++;
    }

    return pdf.output("blob");
  } finally {
    if (container.parentNode) document.body.removeChild(container);
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function WordToPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<Blob | null>(null);

  const handleDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext !== "docx") {
      toast.error("Only .docx files are supported.");
      return;
    }
    setFile(f);
    setStatus("idle");
    setResult(null);
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setStatus("processing");
    try {
      const blob = await docxToPdf(file);
      if (!blob || blob.size < 100) {
        throw new Error("Output PDF appears empty. The document may be corrupted.");
      }
      setResult(blob);
      setStatus("done");
      toast.success("Converted successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error("Conversion failed: " + msg);
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStatus("idle");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto border border-blue-500/20">
              <FileOutput className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Word → PDF</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Convert .docx files to PDF locally in your browser. Nothing is uploaded.
              </p>
            </div>
            <PrivacyBadge />
          </div>

          {!file ? (
            <DropZone onFilesDrop={handleDrop} accept=".docx" multiple={false} />
          ) : (
            <div className="space-y-4">
              <FileSizeWarning fileSize={file.size} module="document" />

              {/* File card */}
              <Card className="p-3 bg-secondary/30 border border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={handleReset}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>

              {/* Convert button */}
              {status !== "done" && (
                <Button
                  className="w-full h-10 rounded-lg font-semibold gap-2"
                  onClick={handleConvert}
                  disabled={status === "processing"}
                >
                  {status === "processing" ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Converting… this may take a moment</>
                  ) : (
                    <><FileOutput className="w-4 h-4" /> Convert to PDF</>
                  )}
                </Button>
              )}

              {/* Result */}
              {status === "done" && result && (
                <ExportPanel
                  blob={result}
                  filename={file.name.replace(/\.docx$/i, ".pdf")}
                  inputSize={file.size}
                  onReset={handleReset}
                />
              )}
            </div>
          )}

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-secondary/30 border border-border flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">100% Local</p>
                <p className="text-xs text-muted-foreground">
                  Conversion runs entirely in your browser using WebAssembly and Canvas APIs.
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-secondary/30 border border-border flex items-start gap-3">
              <FileOutput className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">High Fidelity</p>
                <p className="text-xs text-muted-foreground">
                  Preserves fonts, tables, images, and layout using docx-preview rendering.
                </p>
              </div>
            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
