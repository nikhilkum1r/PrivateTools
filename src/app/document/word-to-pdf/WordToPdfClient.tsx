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
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

  if (!html?.trim()) {
    throw new Error("The document appears to be empty or could not be parsed.");
  }

  // ── Render container ──────────────────────────────────────────────────────
  // IMPORTANT: Do NOT use position:fixed with a large negative offset.
  // html2canvas uses getBoundingClientRect() to locate the element — if it's
  // off-screen it captures an empty area → blank pages.
  // Solution: append in normal document flow; compensate scroll with scrollY.
  const container = document.createElement("div");
  container.style.cssText = [
    "width:794px",
    "padding:48px 64px",
    "box-sizing:border-box",
    "background:#ffffff",
    "color:#000000",
    "font-family:Arial,Helvetica,sans-serif",
    "font-size:11pt",
    "line-height:1.6",
  ].join(";");

  const styleEl = document.createElement("style");
  styleEl.textContent = `
    .wtp h1{font-size:20pt;font-weight:700;margin:16px 0 8px}
    .wtp h2{font-size:16pt;font-weight:700;margin:14px 0 6px}
    .wtp h3{font-size:13pt;font-weight:700;margin:12px 0 4px}
    .wtp p {margin:0 0 8px}
    .wtp table{border-collapse:collapse;width:100%;margin:8px 0}
    .wtp td,.wtp th{border:1px solid #ccc;padding:4px 8px;font-size:10pt}
    .wtp ul,.wtp ol{margin:0 0 8px 24px}
    .wtp li{margin:2px 0}
    .wtp strong{font-weight:700}
    .wtp em{font-style:italic}
  `;
  container.className = "wtp";
  container.innerHTML = html;
  container.prepend(styleEl);

  // Append at end of body (below page content) — briefly visible but fine
  // since the user sees the "Converting…" button state.
  document.body.appendChild(container);

  try {
    // Allow layout + fonts to settle
    await new Promise((r) => setTimeout(r, 500));

    const contentHeight = container.scrollHeight;

    // Capture the full element.
    // scrollY: -window.scrollY corrects for the viewport scroll offset so
    // html2canvas maps the element's document position → canvas position correctly.
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: "#ffffff",
      width: 794,
      height: contentHeight,
      windowWidth: 794,
      windowHeight: contentHeight,
      scrollX: 0,
      scrollY: -window.scrollY,
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error("Rendering produced an empty canvas. Please try again.");
    }

    // ── Paginate into A4 jsPDF ───────────────────────────────────────────────
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageW = pdf.internal.pageSize.getWidth();  // 210 mm
    const pageH = pdf.internal.pageSize.getHeight(); // 297 mm

    const imgW  = pageW;
    const imgH  = (canvas.height / canvas.width) * imgW;
    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    let yRendered = 0;
    let pageCount = 0;
    while (yRendered < imgH) {
      if (pageCount > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, -yRendered, imgW, imgH);
      yRendered += pageH;
      pageCount++;
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
