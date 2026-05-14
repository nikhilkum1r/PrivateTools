"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileOutput, Loader2, Trash2, FileText, ShieldCheck,
  CheckCircle2, Zap, Smartphone, Globe, Star, Plus, Download
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils/fileSize";
import { toast } from "sonner";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/lib/utils";
import { AdUnit } from "@/components/shared/AdUnit";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pt2mm(pt: number) { return pt * 0.352778; }

async function docxToPdf(file: File): Promise<Blob> {
  const mammoth = await import("mammoth");
  const { jsPDF } = await import("jspdf");

  const arrayBuffer = await file.arrayBuffer();
  const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

  if (!html?.trim()) {
    throw new Error("The document appears to be empty or could not be parsed.");
  }

  // Parse HTML in memory  zero DOM side-effects
  const parsed = new DOMParser().parseFromString(`<div id="root">${html}</div>`, "text/html");
  const root = parsed.getElementById("root")!;

  // ── jsPDF setup ─────────────────────────────────────────────────────────────
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();   // 210 mm
  const pageH = pdf.internal.pageSize.getHeight();  // 297 mm
  const mX = 20;  // horizontal margin
  const mY = 20;  // vertical margin
  const maxW = pageW - mX * 2;

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
    spaceAfter = 3,
  ) {
    if (!text.trim()) return;
    curY += spaceBefore;
    pdf.setFontSize(fontSize);
    pdf.setFont("helvetica", style);
    const usableW = maxW - indent;
    const lines = pdf.splitTextToSize(text, usableW);
    const lineH = pt2mm(fontSize) * 1.45;
    for (const line of lines) {
      ensureSpace(lineH);
      pdf.text(line, mX + indent, curY);
      curY += lineH;
    }
    curY += spaceAfter;
  }

  // Recursively process the parsed DOM tree
  function processNode(el: Element, listDepth = 0, listType: "ul" | "ol" = "ul", listIndex = { n: 1 }) {
    const tag = el.tagName?.toLowerCase() ?? "";
    const text = el.textContent?.trim() ?? "";

    switch (tag) {
      case "h1": renderBlock(text, 20, "bold", 0, 6, 4); break;
      case "h2": renderBlock(text, 16, "bold", 0, 4, 3); break;
      case "h3": renderBlock(text, 13, "bold", 0, 3, 2); break;
      case "h4":
      case "h5":
      case "h6": renderBlock(text, 11, "bold", 0, 2, 2); break;

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
        const lines = pdf.splitTextToSize(text, maxW - indent - bulletW);
        const lineH = pt2mm(11) * 1.45;
        ensureSpace(lineH);
        pdf.text(bullet, mX + indent, curY);
        for (let i = 0; i < lines.length; i++) {
          ensureSpace(lineH);
          pdf.text(lines[i], mX + indent + bulletW, curY);
          curY += lineH;
        }
        break;
      }

      case "table": {
        const rows = Array.from(el.querySelectorAll("tr"));
        const colCount = Math.max(...rows.map(r => r.children.length), 1);
        const colW = maxW / colCount;
        pdf.setFontSize(9);
        for (const row of rows) {
          const cells = Array.from(row.children);
          const cellH = pt2mm(9) * 1.45 + 4;
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

export default function WordToPdfClient() {
  const t = useTranslations("wordToPdf");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<Blob | null>(null);
  const [title, setTitle] = useState(t("stats.converting"));

  const handleDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["docx", "doc", "dot", "dotx", "rtf", "txt"].includes(ext || "")) {
      toast.error(t("toast.errorFile"));
      return;
    }
    setFile(f);
    setTitle(f.name.replace(/\.[^/.]+$/, ""));
    setStatus("idle");
    setResult(null);
  }, [t]);

  const handleConvert = async () => {
    if (!file) return;
    setStatus("processing");
    try {
      const blob = await docxToPdf(file);
      setResult(blob);
      setStatus("done");
      toast.success(t("toast.success"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error(t("toast.error", { message: msg }));
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStatus("idle");
    setTitle(t("stats.converting"));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-blue-500/30">
      <Navbar />

      <main className={cn(
        "flex-grow flex flex-col relative",
        file ? "lg:flex-row h-[calc(100vh-64px)] overflow-hidden" : "overflow-y-auto"
      )}>
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[160px] rounded-full animate-pulse delay-1000" />
          <div
            className="absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }}
          />
        </div>

        {!file ? (
          <div className="flex-grow flex flex-col items-center justify-center relative z-10">
            {/* Top Banner Ad */}
            <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-10 -mb-10">
              <AdUnit type="banner" format="horizontal" className="rounded-2xl border-none bg-transparent" />
            </div>

            {/* Hero Section */}
            <div className="max-w-5xl w-full px-6 py-20 space-y-12 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] mx-auto shadow-2xl shadow-blue-500/20">
                  <div className="w-full h-full rounded-[calc(1rem-1px)] bg-card flex items-center justify-center border border-border">
                    <FileOutput className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-none">
                    {t("title")} <span className="text-blue-500">{t("subtitle")}</span>
                  </h1>
                  <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                    {t("description")}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <DropZone
                  onFilesDrop={handleDrop}
                  accept=".doc,.docx,.dot,.dotx,.rtf,.txt"
                  multiple={false}
                  className="h-80 border-dashed border-border bg-secondary/30 backdrop-blur-xl rounded-3xl hover:bg-secondary/50 transition-all shadow-2xl group relative overflow-hidden"
                  title={t("dropzoneTitle")}
                  description={t("dropzoneDescription")}
                />
              </motion.div>

              {/* Trusted By / Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: t("stats.privacy"), icon: ShieldCheck },
                  { label: t("stats.noUploads"), icon: Globe },
                  { label: t("stats.highQuality"), icon: Zap },
                  { label: t("stats.noWatermark"), icon: Star }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-secondary/20 border border-border flex flex-col items-center gap-2">
                    <item.icon className="w-5 h-5 text-blue-500" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full bg-secondary/10 border-y border-border backdrop-blur-3xl">
              <div className="max-w-5xl mx-auto px-6 py-24 space-y-24">
                
                {/* Convert Word Documents to PDF Instantly */}
                <section className="space-y-6 text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold tracking-tight text-blue-500">{t("content.mainTitle")}</h2>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                    {t("content.mainDesc1")}
                  </p>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                    {t("content.mainDesc2")}
                  </p>
                </section>

                {/* Key Features / Why Use */}
                <section className="space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">{t("content.featuresTitle")}</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">{t("content.featuresSubtitle")}</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { title: t("content.feature1Title"), desc: t("content.feature1Desc"), icon: FileText },
                      { title: t("content.feature2Title"), desc: t("content.feature2Desc"), icon: ShieldCheck },
                      { title: t("content.feature3Title"), desc: t("content.feature3Desc"), icon: Zap },
                      { title: t("content.feature4Title"), desc: t("content.feature4Desc"), icon: Smartphone },
                      { title: t("content.feature5Title"), desc: t("content.feature5Desc"), icon: CheckCircle2 },
                      { title: t("content.feature6Title"), desc: t("content.feature6Desc"), icon: Download }
                    ].map((feature, i) => (
                      <Card key={i} className="p-8 rounded-3xl bg-background/50 border-border hover:border-blue-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <feature.icon className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-3 tracking-tight">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Supported Formats */}
                <section className="p-12 rounded-[3rem] bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/10 space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-blue-500">Supported File Formats</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">Input Formats</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["DOC", "DOCX", "DOT", "DOTX", "RTF", "TXT"].map((ext) => (
                      <Badge key={ext} className="px-6 py-2 rounded-full bg-background border-border text-[11px] font-bold tracking-wider uppercase hover:text-blue-500 transition-colors">
                        .{ext}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-center mt-6">
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs mb-3">Output Format</p>
                    <Badge className="px-6 py-2 rounded-full bg-blue-500 text-white border-0 text-[11px] font-bold tracking-wider uppercase">
                      .PDF
                    </Badge>
                  </div>
                </section>



                {/* In-Article Ad */}
                <div className="w-full">
                  <AdUnit type="in-article" format="horizontal" className="rounded-3xl border border-border bg-secondary/10" />
                </div>

                {/* Common Use Cases & Benefits */}
                <section className="space-y-12">
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-grow space-y-6">
                      <h2 className="text-3xl font-bold tracking-tight">{t("content.useCasesTitle")}</h2>
                      <p className="text-muted-foreground font-medium leading-relaxed">
                        {t("content.useCasesDesc")}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {(Array.isArray(t.raw("content.useCasesList")) ? (t.raw("content.useCasesList") as string[]) : []).map((use, i) => (
                          <div key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-secondary/30 transition-colors group border border-transparent hover:border-border">
                            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500 text-blue-500 group-hover:text-white transition-all mt-0.5">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                            <p className="text-sm font-bold tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">{use}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* How to Convert */}
                <section className="space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">{t("content.howTitle")}</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { step: "1", title: t("content.step1Title"), desc: t("content.step1Desc") },
                      { step: "2", title: t("content.step2Title"), desc: t("content.step2Desc") },
                      { step: "3", title: t("content.step3Title"), desc: t("content.step3Desc") },
                      { step: "4", title: t("content.step4Title"), desc: t("content.step4Desc") }
                    ].map((s, i) => (
                      <div key={i} className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-secondary/20 border border-border">
                        <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                          {s.step}
                        </div>
                        <h4 className="font-bold tracking-tight">{s.title}</h4>
                        <p className="text-xs text-muted-foreground">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-12 max-w-3xl mx-auto">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">{t("faq.title")}</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">{t("faq.description")}</p>
                  </div>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {(Array.isArray(t.raw("faq.items")) ? (t.raw("faq.items") as any[]) : []).map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-2xl px-6 bg-background/50">
                        <AccordionTrigger className="hover:no-underline font-semibold text-sm text-left">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>

                {/* Footer Multiplex Ad */}
                <div className="w-full pt-12">
                  <AdUnit type="multiplex" format="autorelaxed" className="rounded-3xl border border-border bg-secondary/5 shadow-2xl" />
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center p-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xl bg-card/50 backdrop-blur-2xl border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                    {status === "done" ? (
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    ) : status === "processing" ? (
                      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    ) : (
                      <FileText className="w-10 h-10 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight truncate max-w-[300px] text-blue-500">
                      {title}
                    </h2>
                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider mt-1">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                <div className="w-full space-y-4">
                  {status !== "done" && (
                    <Button
                      className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm gap-3 shadow-2xl shadow-blue-500/20 active:scale-95 transition-all"
                      onClick={handleConvert}
                      disabled={status === "processing"}
                    >
                      {status === "processing" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t("buttons.converting")}
                        </>
                      ) : (
                        <>
                          <FileOutput className="w-5 h-5" />
                          {t("buttons.convert")}
                        </>
                      )}
                    </Button>
                  )}

                  {status === "done" && result && (
                    <ExportPanel
                      blob={result}
                      filename={file.name.replace(/\.[^/.]+$/, ".pdf")}
                      inputSize={file.size}
                      onReset={handleReset}
                    />
                  )}

                  {status !== "processing" && status !== "done" && (
                    <Button
                      variant="ghost"
                      className="w-full h-12 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 font-bold uppercase text-xs tracking-wider gap-2"
                      onClick={handleReset}
                    >
                      <Trash2 className="w-4 h-4" /> {t("buttons.cancel")}
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border w-full justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("stats.localProcessing")}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {!file && <Footer />}
    </div>
  );
}
