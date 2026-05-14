"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileInput, Loader2, Trash2, FileText, ShieldCheck,
  CheckCircle2, Zap, Smartphone, Globe, Star, Plus, Download, Search
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

// ─── Core Logic ─────────────────────────────────────────────────────────────
async function extractPdfText(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `/lib/pdfjs/pdf.worker.min.mjs`;

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

export default function PdfToTxtClient() {
  const t = useTranslations("pdfToTxt");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState(t("stats.extractedText"));

  const handleDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f || f.type !== "application/pdf") { 
      toast.error(t("toast.errorFile")); 
      return; 
    }
    setFile(f);
    setTitle(f.name.replace(/\.[^/.]+$/, ""));
    setStatus("idle");
    setResult(null);
    setPreview("");
    setProgress(0);
  }, [t]);

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
      toast.success(t("toast.success", { count: text.split("\n").length }));
    } catch (e) {
      toast.error(t("toast.error", { message: (e as Error).message }));
      setStatus("error");
    }
  };

  const handleReset = () => { 
    setFile(null); 
    setResult(null); 
    setStatus("idle"); 
    setPreview("");
    setProgress(0);
    setTitle(t("stats.extractedText"));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-orange-500/30">
      <Navbar />
      
      <main className={cn(
        "flex-grow flex flex-col relative",
        file ? "overflow-hidden" : "overflow-y-auto"
      )}>
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-600/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-600/10 blur-[160px] rounded-full animate-pulse delay-1000" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(249, 115, 22, 0.1) 1px, transparent 0)`,
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
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-[1px] mx-auto shadow-2xl shadow-orange-500/20">
                  <div className="w-full h-full rounded-[calc(1rem-1px)] bg-card flex items-center justify-center border border-border">
                    <FileInput className="w-8 h-8 text-orange-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-none">
                    {t("title")} <span className="text-orange-500">{t("subtitle")}</span>
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
                  accept=".pdf,application/pdf" 
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
                  { label: t("stats.instant"), icon: Zap },
                  { label: t("stats.noWatermark"), icon: Star }
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-secondary/20 border border-border flex flex-col items-center gap-2">
                    <item.icon className="w-5 h-5 text-orange-500" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full bg-secondary/10 border-y border-border backdrop-blur-3xl">
              <div className="max-w-5xl mx-auto px-6 py-24 space-y-24">
                
                {/* Convert PDF Files to Plain Text Online */}
                <section className="space-y-6 text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl font-bold tracking-tight text-orange-500">{t("content.mainTitle")}</h2>
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
                      { title: t("content.feature4Title"), desc: t("content.feature4Desc"), icon: Download },
                      { title: t("content.feature5Title"), desc: t("content.feature5Desc"), icon: Smartphone },
                      { title: t("content.feature6Title"), desc: t("content.feature6Desc"), icon: CheckCircle2 }
                    ].map((feature, i) => (
                      <Card key={i} className="p-8 rounded-3xl bg-background/50 border-border hover:border-orange-500/30 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          <feature.icon className="w-6 h-6 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-3 tracking-tight">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                      </Card>
                    ))}
                  </div>
                </section>

                {/* Middle Section Ad */}
                <AdUnit type="in-article" className="max-w-4xl mx-auto rounded-3xl" />

                {/* Supported Formats */}
                <section className="p-12 rounded-[3rem] bg-gradient-to-br from-orange-500/5 to-transparent border border-orange-500/10 space-y-12">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-orange-500">Supported File Formats</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">Input Format</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {["PDF"].map((ext) => (
                      <Badge key={ext} className="px-6 py-2 rounded-full bg-background border-border text-[11px] font-bold tracking-wider uppercase hover:text-orange-500 transition-colors">
                        .{ext}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-center mt-6">
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs mb-3">Output Formats</p>
                    <div className="flex justify-center gap-3">
                      <Badge className="px-6 py-2 rounded-full bg-orange-500 text-white border-0 text-[11px] font-bold tracking-wider uppercase">
                        .TXT
                      </Badge>
                      <Badge className="px-6 py-2 rounded-full bg-orange-500 text-white border-0 text-[11px] font-bold tracking-wider uppercase">
                        Plain Text
                      </Badge>
                    </div>
                  </div>
                </section>

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
                            <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 group-hover:bg-orange-500 text-orange-500 group-hover:text-white transition-all mt-0.5">
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
                        <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                          {s.step}
                        </div>
                        <h4 className="font-bold tracking-tight">{s.title}</h4>
                        <p className="text-xs text-muted-foreground">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Footer Area Multiplex Ad */}
                <div className="max-w-5xl mx-auto w-full py-12 border-t border-border/50">
                  <AdUnit type="multiplex" className="rounded-3xl" />
                </div>

                {/* FAQ Section */}
                <section className="space-y-12 max-w-3xl mx-auto">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">{t("landing.faq.title")}</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">{t("landing.faq.description")}</p>
                  </div>
                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {(Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any[]) : []).map((item, i) => (
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

              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center p-6 relative z-10 h-[calc(100vh-64px)]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xl bg-card/50 backdrop-blur-2xl border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6 flex-grow min-h-0">
                <div className="flex flex-col items-center space-y-4 shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner">
                    {status === "done" ? (
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    ) : status === "processing" ? (
                      <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                    ) : (
                      <FileInput className="w-10 h-10 text-orange-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight truncate max-w-[300px] text-orange-500">
                      {title}
                    </h2>
                    <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-wider mt-1">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                {preview && status === "done" && (
                  <div className="w-full flex-grow min-h-0 bg-secondary/30 border border-border rounded-xl p-4 text-left overflow-auto custom-scrollbar">
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-words">
                      {preview}
                    </pre>
                  </div>
                )}

                <div className="w-full space-y-4 shrink-0 mt-auto pt-4">
                  {status !== "done" && (
                    <Button 
                      className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm gap-3 shadow-2xl shadow-orange-500/20 active:scale-95 transition-all"
                      onClick={handleExtract}
                      disabled={status === "processing"}
                    >
                      {status === "processing" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t("buttons.extracting", { progress })}
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          {t("buttons.extract")}
                        </>
                      )}
                    </Button>
                  )}
                  
                  {status === "done" && result && (
                    <ExportPanel
                      blob={result}
                      filename={file.name.replace(/\.[^/.]+$/, ".txt")}
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

                <div className="flex items-center gap-2 pt-4 border-t border-border w-full justify-center shrink-0">
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
