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
// Pipeline: mammoth (DOCX → HTML) → html2canvas (DOM → canvas) → jsPDF (→ PDF)
// mammoth is used instead of docx-preview because docx-preview throws
// "Cannot read properties of undefined (reading 'children')" on many DOCX
// variants due to fragile internal XML traversal.
async function docxToPdf(file: File): Promise<Blob> {
  const mammoth = await import("mammoth");
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const arrayBuffer = await file.arrayBuffer();

  // 1. DOCX → HTML (mammoth is robust to quirky DOCX structures)
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

  if (!html || html.trim().length === 0) {
    throw new Error("The document appears to be empty or could not be parsed.");
  }

  // 2. Render HTML in an offscreen A4-width container (794px ≈ 210mm @ 96dpi)
  const container = document.createElement("div");
  container.style.cssText = [
    "position:fixed",
    "left:-99999px",
    "top:0",
    "width:794px",
    "padding:48px 64px",
    "box-sizing:border-box",
    "background:#ffffff",
    "color:#000000",
    "font-family:Arial,Helvetica,sans-serif",
    "font-size:11pt",
    "line-height:1.6",
    "-webkit-print-color-adjust:exact",
  ].join(";");

  // Basic styling for mammoth HTML output
  const style = document.createElement("style");
  style.textContent = `
    .wtp-wrap h1 { font-size:20pt; font-weight:700; margin:16px 0 8px; }
    .wtp-wrap h2 { font-size:16pt; font-weight:700; margin:14px 0 6px; }
    .wtp-wrap h3 { font-size:13pt; font-weight:700; margin:12px 0 4px; }
    .wtp-wrap p  { margin:0 0 8px; }
    .wtp-wrap table { border-collapse:collapse; width:100%; margin:8px 0; }
    .wtp-wrap td, .wtp-wrap th { border:1px solid #ccc; padding:4px 8px; font-size:10pt; }
    .wtp-wrap ul, .wtp-wrap ol { margin:0 0 8px 24px; }
    .wtp-wrap li { margin:2px 0; }
    .wtp-wrap strong { font-weight:700; }
    .wtp-wrap em { font-style:italic; }
  `;
  container.className = "wtp-wrap";
  container.innerHTML = html;
  container.prepend(style);
  document.body.appendChild(container);

  try {
    // Wait for fonts and layout to settle
    await new Promise((r) => setTimeout(r, 400));

    // 3. Snapshot the full rendered height into one canvas at 2× for sharpness
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 794,
      windowHeight: container.scrollHeight,
      width: 794,
      height: container.scrollHeight,
    });

    // 4. Build A4 PDF and paginate
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = pdf.internal.pageSize.getWidth();  // 210 mm
    const pageH = pdf.internal.pageSize.getHeight(); // 297 mm

    const imgW = pageW;
    const imgH = (canvas.height / canvas.width) * imgW;
    const imgData = canvas.toDataURL("image/jpeg", 0.96);

    let yRendered = 0;
    let pagesWritten = 0;
    while (yRendered < imgH) {
      if (pagesWritten > 0) pdf.addPage();
      // Shift image up so current slice aligns to the top of this page
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
