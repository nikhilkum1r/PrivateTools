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
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WORD_TO_PDF_FAQ } from "@/lib/faq-content";

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

  // Parse HTML in memory — zero DOM side-effects
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

// ─── Component ────────────────────────────────────────────────────────────────
export default function WordToPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<Blob | null>(null);
  const [title, setTitle] = useState("Converted Document");

  const handleDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["docx", "doc", "dot", "dotx", "rtf", "txt"].includes(ext || "")) { 
      toast.error("Unsupported file format. Please upload a Word document."); 
      return; 
    }
    setFile(f);
    setTitle(f.name.replace(/\.[^/.]+$/, ""));
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

  const handleReset = () => { 
    setFile(null); 
    setResult(null); 
    setStatus("idle"); 
    setTitle("Converted Document");
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
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                    Word to <span className="text-blue-500">PDF.</span>
                  </h1>
                  <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                    Convert Word files to high-quality PDF documents instantly in your browser. Secure, fast, and privacy-focused DOC to PDF conversion without uploading your files.
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
                  title="Drop Word Document Here"
                  description="Supports DOCX, DOC, RTF & TXT"
                />
              </motion.div>

              {/* Trusted By / Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Privacy-First", icon: ShieldCheck },
                  { label: "No Uploads", icon: Globe },
                  { label: "Instant Export", icon: Zap },
                  { label: "Zero Watermark", icon: Star }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-secondary/20 border border-border flex flex-col items-center gap-2">
                    <item.icon className="w-5 h-5 text-blue-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full bg-secondary/10 border-y border-border backdrop-blur-3xl">
              <div className="max-w-5xl mx-auto px-6 py-24 space-y-24">
                
                {/* Convert Word Documents to PDF Instantly */}
                <section className="space-y-6 text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-blue-500">Convert Word Documents to PDF Instantly</h2>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                    The Word to PDF Converter helps you transform Microsoft Word documents into professional PDF files within seconds. Whether you are converting resumes, reports, invoices, assignments, presentations, contracts, ebooks, or business documents, this tool ensures clean formatting and reliable output.
                  </p>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                    Our browser-based conversion system keeps your files private while delivering fast and accurate PDF generation directly on your device.
                  </p>
                </section>

                {/* Key Features / Why Use */}
                <section className="space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Why Use This Word to PDF Converter?</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Features of the Online Word to PDF Tool</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      { title: "High-Quality PDF Output", desc: "Generate professional PDF documents while preserving text alignment, headings, fonts, spacing, tables, and layouts.", icon: FileText },
                      { title: "Privacy-Focused", desc: "Files are processed locally in your browser for improved security and data privacy. Sensitive business and personal documents remain under your control.", icon: ShieldCheck },
                      { title: "Fast Processing", desc: "Convert Word documents into PDFs in just a few clicks without waiting for server uploads or downloads.", icon: Zap },
                      { title: "Cross-Platform", desc: "Use the converter on Windows, macOS, Linux, Android, iPhone, iPad, and Chromebook.", icon: Smartphone },
                      { title: "Free & No Watermarks", desc: "Free online Word to PDF tool with no watermark on exported PDFs and no registration needed.", icon: CheckCircle2 },
                      { title: "Easy Drag & Drop", desc: "Simply drag your DOC or DOCX file into the converter and download the generated PDF instantly.", icon: Download }
                    ].map((feature, i) => (
                      <Card key={i} className="p-8 rounded-3xl bg-background/50 border-border hover:border-blue-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <feature.icon className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-black uppercase italic mb-3 tracking-tight">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Supported Formats */}
                <section className="p-12 rounded-[3rem] bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/10 space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-blue-500">Supported File Formats</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Input Formats</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["DOC", "DOCX", "DOT", "DOTX", "RTF", "TXT"].map((ext) => (
                      <Badge key={ext} className="px-6 py-2 rounded-full bg-background border-border text-[11px] font-black tracking-widest uppercase hover:text-blue-500 transition-colors">
                        .{ext}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-center mt-6">
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs mb-3">Output Format</p>
                    <Badge className="px-6 py-2 rounded-full bg-blue-500 text-white border-0 text-[11px] font-black tracking-widest uppercase">
                      .PDF
                    </Badge>
                  </div>
                </section>

                {/* Common Use Cases & Benefits */}
                <section className="space-y-12">
                  <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-grow space-y-6">
                      <h2 className="text-3xl font-black uppercase italic tracking-tighter">Common Use Cases & Benefits</h2>
                      <p className="text-muted-foreground font-medium leading-relaxed">
                        PDF files are more secure, portable, and consistent across devices compared to editable Word documents. Converting Word documents into PDF format helps prevent accidental editing, preserve formatting, improve printing compatibility, and share files professionally.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {[
                          "Resume and CV PDF creation",
                          "Office document sharing",
                          "School and college assignments",
                          "Legal contracts & Business proposals",
                          "Ebook formatting & Printable documents",
                          "Invoice & Government form submission"
                        ].map((use, i) => (
                          <div key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-secondary/30 transition-colors group border border-transparent hover:border-border">
                            <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500 text-blue-500 group-hover:text-white transition-all mt-0.5">
                              <CheckCircle2 className="w-3 h-3" />
                            </div>
                            <p className="text-sm font-black uppercase tracking-tight italic text-muted-foreground group-hover:text-foreground transition-colors">{use}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* How to Convert */}
                <section className="space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">How to Convert Word to PDF</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { step: "1", title: "Upload", desc: "Upload or drag your Word file" },
                      { step: "2", title: "Process", desc: "The tool automatically processes the document" },
                      { step: "3", title: "Preview", desc: "Preview the generated PDF" },
                      { step: "4", title: "Download", desc: "Download the converted PDF instantly" }
                    ].map((s, i) => (
                      <div key={i} className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-secondary/20 border border-border">
                        <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                          {s.step}
                        </div>
                        <h4 className="font-black uppercase italic tracking-tight">{s.title}</h4>
                        <p className="text-xs text-muted-foreground">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-12 max-w-3xl mx-auto">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Everything you need to know</p>
                  </div>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {WORD_TO_PDF_FAQ.map((item, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-2xl px-6 bg-background/50">
                        <AccordionTrigger className="hover:no-underline font-black uppercase text-xs tracking-widest italic text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>

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
                    <h2 className="text-xl font-black uppercase tracking-tight italic truncate max-w-[300px] text-blue-500">
                      {title}
                    </h2>
                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                <div className="w-full space-y-4">
                  {status !== "done" && (
                    <Button 
                      className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm gap-3 shadow-2xl shadow-blue-500/20 active:scale-95 transition-all italic"
                      onClick={handleConvert}
                      disabled={status === "processing"}
                    >
                      {status === "processing" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          CONVERTING TO PDF...
                        </>
                      ) : (
                        <>
                          <FileOutput className="w-5 h-5" />
                          CONVERT TO PDF
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
                      className="w-full h-12 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 font-bold uppercase text-xs tracking-widest gap-2"
                      onClick={handleReset}
                    >
                      <Trash2 className="w-4 h-4" /> Cancel
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border w-full justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Local Browser Processing</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      
      {/* Footer will render only when no file is selected (landing page mode), or we can keep it as is. 
          The UI looks cleaner if Footer is outside the main block.
      */}
      {!file && <Footer />}
    </div>
  );
}
