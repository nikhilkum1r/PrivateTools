"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Lock, Loader2, ShieldCheck, Key, FileText, Zap, 
  Search, Cpu, CheckCircle2, Briefcase, FileKey, Fingerprint, 
  DownloadCloud, Monitor, Smartphone, Activity, Database, Trash2
} from "lucide-react";
import { StudioLayout } from "@/components/shared/StudioLayout";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { FileSizeWarning } from "@/components/shared/FileSizeWarning";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils/fileSize";
import { toast } from "sonner";
import { FAQ } from "@/components/shared/FAQ";
import { AdUnit } from "@/components/shared/AdUnit";
import { PDFDocument } from "pdf-lib";
import { useTranslations } from "next-intl";

export default function ProtectPdfClient() {
  const t = useTranslations("pdfProtect");
  const common = useTranslations("common");
  const trust = useTranslations("trust.points");

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
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
    setPassword("");
  }, [t]);

  const handleLock = async () => {
    if (!file) return;
    if (!password) {
      toast.error(t("messages.password_error"));
      return;
    }
    
    setStatus("processing");
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      
      const pdfBytes = await pdfDoc.save();
      
      const { encryptPDF } = await import("@pdfsmaller/pdf-encrypt-lite");
      const encryptedBytes = await encryptPDF(pdfBytes, password, password);

      const blob = new Blob([new Uint8Array(encryptedBytes)], { type: "application/pdf" });
      
      setResult(blob);
      setStatus("done");
      toast.success(t("messages.success"));
    } catch (e) {
      console.error("Protection error:", e);
      toast.error(t("messages.error"));
      setStatus("idle");
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStatus("idle");
    setPassword("");
  };

  return (
    <StudioLayout
      title={t("hero.title")}
      description={t("hero.description")}
      heroIcon={ShieldCheck}
      badge={t("hero.security")}
      trustColor="emerald"
      breadcrumbs={[
        { label: common("Navbar.categories.pdf"), href: "/pdf" },
        { label: t("hero.title"), href: "/pdf/protect-pdf" }
      ]}
      trustTitle={t("badges.local")}
      trustDesc={t("hero.description")}
      footerExtras={
        <div className="container mx-auto px-4 max-w-5xl py-12 space-y-20">
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">{t("landing.features.title")}</h2>
              <p className="text-muted-foreground font-medium">{t("landing.features.subtitle")}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {(Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as string[]) : []).map((feature, i) => {
                const icons = [Lock, Key, Cpu, ShieldCheck, FileText, Lock, DownloadCloud, Database, Zap, Monitor];
                const Icon = icons[i % icons.length];
                return (
                  <div key={i} className="p-4 rounded-2xl glass-card bg-secondary/30 border border-border flex flex-col items-center text-center gap-3">
                    <Icon className="w-6 h-6 text-emerald-500" />
                    <span className="text-sm font-bold leading-tight text-foreground">{feature}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <FAQ items={t.raw("landing.faq.items") as any} />
        </div>
      }
    >
      <div className="glass-card rounded-3xl border border-border shadow-2xl bg-secondary/30 overflow-hidden relative">
        <div className="px-6 py-4 border-b border-border bg-black/20 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-500 flex items-center gap-2">
            <FileKey className="w-4 h-4" /> {t("engine.title")}
          </h3>
          <Badge variant="outline" className="text-[9px] font-semibold uppercase tracking-wider border-emerald-500/30 text-emerald-500 bg-emerald-500/10">
            {t("engine.active")}
          </Badge>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {!file ? (
            <div className="space-y-6">
              <AdUnit type="banner" className="mb-6" />
              <DropZone 
                onFilesDrop={handleDrop} 
                accept=".pdf"
                multiple={false} 
                className="h-64 border-dashed border-emerald-500/30 hover:border-emerald-500/60 bg-black/20 rounded-3xl transition-colors"
              />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="p-4 rounded-2xl glass-card bg-secondary/50 border border-border flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20">
                  <FileText className="w-6 h-6" />
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
                    <Label htmlFor="password" className="text-sm font-bold text-foreground">{t("form.label")}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        placeholder={t("form.placeholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-14 rounded-xl pl-4 pr-12 bg-background border-border text-foreground focus-visible:ring-emerald-500"
                      />
                      <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                      {t("form.note")}
                    </p>
                  </div>

                  <button
                    className="w-full h-14 rounded-2xl font-bold text-lg gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    onClick={handleLock}
                    disabled={status === "processing" || !password}
                  >
                    {status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                    {status === "processing" ? t("form.processing") : t("form.button")}
                  </button>

                  <div className="pt-4">
                    <AdUnit type="content" className="my-0" />
                  </div>
                </div>
              )}

              {status === "done" && result && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <ExportPanel
                    blob={result}
                    filename={file.name.replace(/\.pdf$/i, "_protected.pdf")}
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
