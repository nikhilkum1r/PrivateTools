"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileInput, Loader2, Trash2 } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatBytes } from "@/lib/utils/fileSize";
import { toast } from "sonner";

async function extractPdfText(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const lines: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str ?? "").join(" ");
    lines.push(`--- Page ${i} ---\n${pageText}`);
    onProgress?.(Math.round((i / pdf.numPages) * 100));
  }

  return lines.join("\n\n");
}

export default function PdfToTxtPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [preview, setPreview] = useState("");

  const handleDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f || f.type !== "application/pdf") { toast.error("Please upload a PDF file."); return; }
    setFile(f); setStatus("idle"); setResult(null); setPreview("");
  }, []);

  const handleExtract = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(0);
    try {
      const text = await extractPdfText(file, setProgress);
      const blob = new Blob([text], { type: "text/plain" });
      setResult(blob);
      setPreview(text.slice(0, 500) + (text.length > 500 ? "…" : ""));
      setStatus("done");
      toast.success(`Extracted ${text.split("\n").length} lines of text.`);
    } catch (e) {
      toast.error("Extraction failed: " + (e as Error).message);
      setStatus("idle");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto">
              <FileInput className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-4xl font-black tracking-tight">PDF → Text</h1>
            <p className="text-muted-foreground">Extract all text from PDF files with page structure preserved.</p>
            <PrivacyBadge />
          </div>

          {!file ? (
            <DropZone onFilesDrop={handleDrop} accept=".pdf,application/pdf" multiple={false} />
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/50 border border-primary/5 flex items-center gap-4">
                <div className="flex-grow min-w-0">
                  <p className="font-bold truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setFile(null); setResult(null); setStatus("idle"); setPreview(""); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {status === "processing" && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extracting text from pages… {progress}%
                </div>
              )}

              {status !== "done" && (
                <Button className="w-full h-12 rounded-xl font-bold gap-2" onClick={handleExtract} disabled={status === "processing"}>
                  {status === "processing" ? <><Loader2 className="w-4 h-4 animate-spin" /> Extracting…</> : "Extract Text"}
                </Button>
              )}

              {preview && (
                <div className="p-4 rounded-xl bg-secondary/30 border border-primary/5 font-mono text-xs text-muted-foreground whitespace-pre-wrap max-h-40 overflow-auto">
                  {preview}
                </div>
              )}

              {status === "done" && result && (
                <ExportPanel
                  blob={result}
                  filename={file.name.replace(/\.pdf$/i, ".txt")}
                  inputSize={file.size}
                  onReset={() => { setFile(null); setResult(null); setStatus("idle"); setPreview(""); }}
                />
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
