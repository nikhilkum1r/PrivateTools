"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileOutput, Loader2 } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { FileSizeWarning } from "@/components/shared/FileSizeWarning";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatBytes } from "@/lib/utils/fileSize";
import { toast } from "sonner";

async function docxToPdf(file: File): Promise<Blob> {
  const { renderAsync } = await import("docx-preview");
  // @ts-ignore
  const html2pdf = (await import("html2pdf.js")).default;

  const container = document.createElement("div");
  // Setup container with standard A4 width
  container.style.cssText = "position:fixed;left:-9999px;top:0;width:210mm;background:white;";
  document.body.appendChild(container);

  try {
    // Render DOCX to HTML
    await renderAsync(await file.arrayBuffer(), container, undefined, {
      className: "docx-preview",
      ignoreLastRenderedPageBreak: false,
    });

    // Small delay to ensure docx-preview has fully settled the DOM
    await new Promise(r => setTimeout(r, 500));

    // Configure html2pdf options
    const opt = {
      margin: 0,
      filename: file.name.replace(/\.docx$/i, ".pdf"),
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        logging: false 
      },
      jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
      pagebreak: { mode: ['css' as const, 'legacy' as const] }
    };

    // Use the worker-based API for more reliability
    const worker = html2pdf().set(opt).from(container);
    const pdfBlob = await worker.outputPdf("blob");
    return pdfBlob;
  } finally {
    document.body.removeChild(container);
  }
}

export default function WordToPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<Blob | null>(null);

  const handleDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext !== "docx") { toast.error("Only .docx files are supported."); return; }
    setFile(f);
    setStatus("idle");
    setResult(null);
  }, []);

  const handleConvert = async () => {
    if (!file) return;
    setStatus("processing");
    try {
      const blob = await docxToPdf(file);
      setResult(blob);
      setStatus("done");
    } catch (e) {
      toast.error("Conversion failed: " + (e as Error).message);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto">
              <FileOutput className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-4xl font-black tracking-tight">Word → PDF</h1>
            <p className="text-muted-foreground">High-fidelity local conversion from Word to PDF. 100% private.</p>
            <PrivacyBadge />
          </div>

          {!file ? (
            <DropZone onFilesDrop={handleDrop} accept=".docx" multiple={false} />
          ) : (
            <div className="space-y-4">
              <FileSizeWarning fileSize={file.size} module="document" />
              <div className="p-4 rounded-xl bg-secondary/50 border border-primary/5 flex items-center gap-4">
                <div className="flex-grow min-w-0">
                  <p className="font-bold truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setFile(null); setResult(null); setStatus("idle"); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {status !== "done" && (
                <Button className="w-full h-12 rounded-xl font-bold gap-2" onClick={handleConvert} disabled={status === "processing"}>
                  {status === "processing" ? <><Loader2 className="w-4 h-4 animate-spin" /> Converting…</> : "Convert to PDF"}
                </Button>
              )}

              {status === "done" && result && (
                <ExportPanel
                  blob={result}
                  filename={file.name.replace(/\.docx$/i, ".pdf")}
                  inputSize={file.size}
                  onReset={() => { setFile(null); setResult(null); setStatus("idle"); }}
                />
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
