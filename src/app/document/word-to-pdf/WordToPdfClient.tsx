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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pt2mm(pt: number) { return pt * 0.352778; }

// ─── Core conversion: mammoth + jsPDF text API (no html2canvas) ───────────────
// html2canvas is incompatible with Cross-Origin-Embedder-Policy: require-corp
// and requires visible DOM nodes — causing blank pages or screen flicker.
// Instead we parse mammoth's HTML output in memory (DOMParser) and render
// directly with jsPDF's text/drawing primitives.
async function docxToPdf(file: File): Promise<Blob> {
  const mammoth    = await import("mammoth");
  const { jsPDF } = await import("jspdf");

  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

  if (!html?.trim()) {
    throw new Error("The document appears to be empty or could not be parsed.");
  }

  // Parse HTML in memory — zero DOM side-effects
  const parsed = new DOMParser().parseFromString(`<div id="root">${html}</div>`, "text/html");
  const root   = parsed.getElementById("root")!;

  // ── jsPDF setup ─────────────────────────────────────────────────────────────
  const pdf      = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW    = pdf.internal.pageSize.getWidth();   // 210 mm
  const pageH    = pdf.internal.pageSize.getHeight();  // 297 mm
  const mX       = 20;  // horizontal margin
  const mY       = 20;  // vertical margin
  const maxW     = pageW - mX * 2;

  let curY = mY;

  function ensureSpace(needed: number) {
    if (curY + needed > pageH - mY) {
      pdf.addPage();
      curY = mY;
    }
  }

  // Render a block of text with wrapping and automatic page breaks
  function renderBlock(
    text: string,
    fontSize: number,
    style: "normal" | "bold" | "italic" | "bolditalic" = "normal",
    indent = 0,
    spaceBefore = 0,
    spaceAfter  = 3,
  ) {
    if (!text.trim()) return;
    curY += spaceBefore;
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", style);
    const usableW = maxW - indent;
    const lines   = pdf.splitTextToSize(text, usableW);
    const lineH   = pt2mm(fontSize) * 1.45;
    for (const line of lines) {
      ensureSpace(lineH);
      pdf.text(line, mX + indent, curY);
      curY += lineH;
    }
    curY += spaceAfter;
  }

  // Recursively process the parsed DOM tree
  function processNode(el: Element, listDepth = 0, listType: "ul" | "ol" = "ul", listIndex = { n: 1 }) {
    const tag  = el.tagName?.toLowerCase() ?? "";
    const text = el.textContent?.trim() ?? "";

    switch (tag) {
      case "h1": renderBlock(text, 20, "bold",   0, 6, 4); break;
      case "h2": renderBlock(text, 16, "bold",   0, 4, 3); break;
      case "h3": renderBlock(text, 13, "bold",   0, 3, 2); break;
      case "h4":
      case "h5":
      case "h6": renderBlock(text, 11, "bold",   0, 2, 2); break;

      case "p":
        if (text) renderBlock(text, 11, "normal", 0, 0, 3);
        break;

      case "blockquote":
        renderBlock(text, 11, "italic", 8, 2, 2);
        break;

      case "ul":
      case "ol": {
        const idx = { n: 1 };
        Array.from(el.children).forEach((li) => {
          processNode(li, listDepth + 1, tag, idx);
        });
        curY += 2;
        break;
      }

      case "li": {
        const bullet = listType === "ol" ? `${listIndex.n++}.  ` : "•  ";
        const indent = listDepth * 6;
        if (!text) break;
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        const bulletW = pdf.getStringUnitWidth(bullet) * pt2mm(11);
        const lines   = pdf.splitTextToSize(text, maxW - indent - bulletW);
        const lineH   = pt2mm(11) * 1.45;
        ensureSpace(lineH);
        // bullet on first line, subsequent lines indented
        pdf.text(bullet, mX + indent, curY);
        for (let i = 0; i < lines.length; i++) {
          ensureSpace(lineH);
          pdf.text(lines[i], mX + indent + bulletW, curY);
          curY += lineH;
        }
        break;
      }

      case "table": {
        const rows     = Array.from(el.querySelectorAll("tr"));
        const colCount = Math.max(...rows.map(r => r.children.length), 1);
        const colW     = maxW / colCount;
        pdf.setFontSize(9);
        for (const row of rows) {
          const cells  = Array.from(row.children);
          const cellH  = pt2mm(9) * 1.45 + 4;
          ensureSpace(cellH + 1);
          let cx = mX;
          for (const cell of cells) {
            const isHeader = cell.tagName.toLowerCase() === "th";
            const cellText = (cell.textContent ?? "").trim();
            pdf.setFont("helvetica", isHeader ? "bold" : "normal");
            pdf.rect(cx, curY - pt2mm(9) * 1.2, colW, cellH);
            if (cellText) {
              pdf.text(
                pdf.splitTextToSize(cellText, colW - 3),
                cx + 1.5,
                curY,
              );
            }
            cx += colW;
          }
          curY += cellH;
        }
        curY += 3;
        break;
      }

      case "br":
        curY += pt2mm(11) * 1.45;
        break;

      case "hr":
        curY += 2;
        ensureSpace(1);
        pdf.setDrawColor(180, 180, 180);
        pdf.line(mX, curY, pageW - mX, curY);
        pdf.setDrawColor(0, 0, 0);
        curY += 3;
        break;

      default:
        // div, span, section, article, etc. — recurse into children
        for (const child of Array.from(el.children)) {
          processNode(child, listDepth, listType, listIndex);
        }
    }
  }

  for (const child of Array.from(root.children)) {
    processNode(child);
  }

  const blob = pdf.output("blob");
  if (blob.size < 500) throw new Error("PDF output appears empty. The document may be unsupported.");
  return blob;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function WordToPdfClient() {
  const [file,   setFile]   = useState<File | null>(null);
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
      toast.success("Converted successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error("Conversion failed: " + msg);
      setStatus("error");
    }
  };

  const handleReset = () => { setFile(null); setResult(null); setStatus("idle"); };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto border border-blue-500/20">
              <FileOutput className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Word → PDF</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Convert .docx files to PDF locally. Nothing is uploaded.
              </p>
            </div>
            <PrivacyBadge />
          </div>

          {!file ? (
            <DropZone onFilesDrop={handleDrop} accept=".docx" multiple={false} />
          ) : (
            <div className="space-y-4">
              <FileSizeWarning fileSize={file.size} module="document" />

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

              {status !== "done" && (
                <Button
                  className="w-full h-10 rounded-lg font-semibold gap-2"
                  onClick={handleConvert}
                  disabled={status === "processing"}
                >
                  {status === "processing"
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Converting…</>
                    : <><FileOutput className="w-4 h-4" /> Convert to PDF</>}
                </Button>
              )}

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-secondary/30 border border-border flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">100% Local</p>
                <p className="text-xs text-muted-foreground">Conversion runs entirely in your browser. No uploads.</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-secondary/30 border border-border flex items-start gap-3">
              <FileOutput className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Headings, Tables & Lists</p>
                <p className="text-xs text-muted-foreground">Text layout rendered directly — fast and reliable.</p>
              </div>
            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
