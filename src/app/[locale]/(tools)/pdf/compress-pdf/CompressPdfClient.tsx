"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Zap, Settings2, Trash2, FileType, Activity, Loader2, Play, 
  Briefcase, ShieldCheck, CheckCircle2, Lock, Smartphone, Fingerprint,
  FileText, Cpu, Search, Layout, Database, Monitor
} from "lucide-react";
import { StudioLayout } from "@/components/shared/StudioLayout";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { FileSizeWarning } from "@/components/shared/FileSizeWarning";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBytes } from "@/lib/utils/fileSize";
import { toast } from "sonner";
import { FAQ } from "@/components/shared/FAQ";
import { AdUnit } from "@/components/shared/AdUnit";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CompressPdfClient() {
  const t = useTranslations("pdfCompress");
  const common = useTranslations("common");
  const trust = useTranslations("trust.points");

  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<"recommended" | "extreme">("recommended");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<Blob | null>(null);

  const handleDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      toast.error(t("messages.upload_error"));
      return;
    }
    setFile(f);
    setStatus("idle");
    setResult(null);
  }, [t]);

  const handleCompress = async () => {
    if (!file) return;
    setStatus("processing");
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      // Perform compression by re-saving with compression enabled
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        updateFieldAppearances: false
      });

      const blob = new Blob([compressedBytes as any], { type: "application/pdf" });
      setResult(blob);
      setStatus("done");
      toast.success(t("messages.success"));
    } catch (e) {
      console.error("Compression error:", e);
      toast.error(t("messages.error"));
      setStatus("idle");
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStatus("idle");
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <StudioLayout
      title={t("title")}
      description={t("description")}
      heroIcon={Zap}
      badge={t("engine_badge")}
      trustColor="blue"
      breadcrumbs={[
        { label: common("Navbar.categories.pdf"), href: "/pdf" },
        { label: t("title"), href: "/pdf/compress-pdf" }
      ]}
      trustTitle={trust("processedLocally")}
      trustDesc={t("landing.educational.privacy.description") || t("description")}
      footerExtras={
        <>
          <div className="container mx-auto px-4 max-w-5xl py-12 space-y-20">
            <section className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("landing.features.title")}</h2>
                <p className="text-muted-foreground font-medium">{t("landing.features.subtitle")}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {(Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as string[]) : []).map((feature, i) => {
                  const featureIcons = [Zap, Cpu, Activity, Layout, Database, Settings2, Monitor, ShieldCheck, Smartphone, FileText];
                  const Icon = featureIcons[i % featureIcons.length];
                  return (
                    <div key={i} className="p-4 rounded-2xl glass-card bg-secondary/30 border border-border flex flex-col items-center text-center gap-3">
                      <Icon className="w-6 h-6 text-blue-500" />
                      <span className="text-sm font-bold leading-tight text-foreground">{feature}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <></>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><FileText className="text-blue-500 w-6 h-6" /> {t("landing.educational.what_is.title")}</h2>
                <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                  {t("landing.educational.what_is.description")}
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Lock className="text-emerald-500 w-6 h-6" /> {t("landing.educational.privacy.title")}</h2>
                <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-500 font-medium">
                  <ul className="space-y-2 list-disc pl-4 marker:text-emerald-500">
                    {(Array.isArray(t.raw("landing.educational.privacy.points")) ? (t.raw("landing.educational.privacy.points") as string[]) : []).map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Settings2 className="text-amber-500 w-6 h-6" /> {t("landing.educational.modes.title")}</h2>
                <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border">
                  <div className="grid grid-cols-2 gap-3">
                    {(Array.isArray(t.raw("landing.educational.modes.items")) ? (t.raw("landing.educational.modes.items") as string[]) : []).map(item => (
                      <div key={item} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Activity className="text-blue-500 w-6 h-6" /> {t("landing.educational.smart.title")}</h2>
                <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                  <ul className="space-y-2 list-disc pl-4 marker:text-blue-500">
                    {(Array.isArray(t.raw("landing.educational.smart.points")) ? (t.raw("landing.educational.smart.points") as string[]) : []).map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <FAQ items={t.raw("landing.faq.items") as any} />
          </div>
          <div className="container mx-auto px-4 max-w-5xl pb-12">
            <></>
          </div>
        </>
      }
    >
      <div className="glass-card rounded-3xl border border-border shadow-2xl bg-secondary/30 overflow-hidden relative">
        <div className="px-6 py-4 border-b border-border bg-black/20 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-500 flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> {t("settings.title")}
          </h3>
          <Badge variant="outline" className="text-[9px] font-semibold uppercase tracking-wider border-blue-500/30 text-blue-500 bg-blue-500/10">
            {t("engine")}
          </Badge>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {!file ? (
            <div className="space-y-6">
              <></>
              <DropZone 
                onFilesDrop={handleDrop} 
                accept=".pdf"
                multiple={false} 
                className="h-64 border-dashed border-blue-500/30 hover:border-blue-500/60 bg-black/20 rounded-3xl transition-colors"
              />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="p-4 rounded-2xl glass-card bg-secondary/50 border border-border flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20">
                  <FileType className="w-6 h-6" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold truncate text-foreground">{file.name}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10" onClick={handleReset}>
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              <FileSizeWarning fileSize={file.size} module="pdf" />

              {status !== "done" && (
                <div className="space-y-6 p-6 rounded-3xl border border-border bg-black/30">
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-500" /> {t("settings.mode_label")}
                    </label>
                    <Tabs value={level} onValueChange={(v: any) => setLevel(v)} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 h-14 p-1 glass-card bg-background border border-border rounded-xl">
                        <TabsTrigger value="recommended" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white font-bold h-full">
                          {t("settings.recommended")}
                        </TabsTrigger>
                        <TabsTrigger value="extreme" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white font-bold h-full">
                          {t("settings.extreme")}
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <p className="text-[11px] font-medium text-muted-foreground leading-relaxed pt-1">
                      {level === "recommended" ? t("settings.recommended_desc") : t("settings.extreme_desc")}
                    </p>
                  </div>

                  <button
                    className="w-full h-14 rounded-2xl font-bold text-lg gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    onClick={handleCompress}
                    disabled={status === "processing"}
                  >
                    {status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                    {status === "processing" ? t("settings.processing").toUpperCase() : t("settings.button").toUpperCase()}
                  </button>
                  <></>
                </div>
              )}

              {status === "done" && result && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <ExportPanel
                    blob={result}
                    filename={file.name.replace(/\.pdf$/i, "_compressed.pdf")}
                    inputSize={file.size}
                    onReset={handleReset}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </StudioLayout>
  );
}
