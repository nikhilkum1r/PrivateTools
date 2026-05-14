"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Unlock, Loader2, Lock, Trash2, ShieldCheck, Eye, EyeOff,
  Search, Cpu, CheckCircle2, ShieldAlert, FileText, Database,
  Zap, AlertTriangle, Layers, FileCode, CheckCircle, Scale,
  Monitor, Smartphone
} from "lucide-react";
import { StudioLayout } from "@/components/shared/StudioLayout";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { FileSizeWarning } from "@/components/shared/FileSizeWarning";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdUnit } from "@/components/shared/AdUnit";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils/fileSize";
import { toast } from "sonner";
import { FAQ } from "@/components/shared/FAQ";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function UnlockPdfClient() {
  const t = useTranslations("pdfUnlock");
  const common = useTranslations("common");
  const trust = useTranslations("trust.points");

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<Blob | null>(null);
  const qpdfRef = useRef<any>(null);

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

  const silenceConsole = () => {
    const saved = { error: console.error, warn: console.warn, log: console.log };
    console.error = () => {}; console.warn = () => {}; console.log = () => {};
    return saved;
  };

  const restoreConsole = (saved: any) => {
    console.error = saved.error; console.warn = saved.warn; console.log = saved.log;
  };

  const getQpdf = async () => {
    if (qpdfRef.current) return qpdfRef.current;
    const initQPDF = (await import("qpdf-wasm")).default;
    const qpdf = await initQPDF({
      print: () => {},
      printErr: () => {},
      locateFile: (filename: string) => {
        if (filename.endsWith(".wasm")) return "/qpdf.wasm";
        return "/" + filename;
      },
    });
    qpdfRef.current = qpdf;
    return qpdf;
  };

  const handleUnlock = async () => {
    if (!file) return;
    setStatus("processing");
    const saved = silenceConsole();

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      const qpdf = await getQpdf();
      const inputPath = "input.pdf";
      const outputPath = "output.pdf";

      qpdf.FS.writeFile(inputPath, pdfBytes);
      try { qpdf.FS.unlink(outputPath); } catch {}

      try {
        qpdf.callMain([
          "--password=" + password,
          "--decrypt",
          inputPath,
          outputPath,
        ]);
      } catch (exitErr: any) {
        const isExitStatus = exitErr?.name === "ExitStatus";
        const exitCode = isExitStatus ? (exitErr.status ?? 1) : 1;
        if (exitCode !== 0) {
          try { qpdf.FS.unlink(inputPath); } catch {}
          restoreConsole(saved);
          toast.error(t("messages.incorrect_password"));
          setStatus("idle");
          return;
        }
      }

      let decryptedBytes: Uint8Array;
      try {
        decryptedBytes = qpdf.FS.readFile(outputPath);
      } catch {
        try { qpdf.FS.unlink(inputPath); } catch {}
        restoreConsole(saved);
        toast.error(t("messages.incorrect_password"));
        setStatus("idle");
        return;
      }

      const blob = new Blob([new Uint8Array(decryptedBytes)], { type: "application/pdf" });
      setResult(blob);
      setStatus("done");
      restoreConsole(saved);
      toast.success(t("messages.success"));

      try { qpdf.FS.unlink(inputPath); } catch {}
      try { qpdf.FS.unlink(outputPath); } catch {}

    } catch (err: unknown) {
      restoreConsole(saved);
      toast.error(t("messages.unexpected_error"));
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
      title={t.raw("hero.title")}
      description={t.raw("hero.description")}
      heroIcon={Unlock}
      badge={t("engine.active")}
      trustColor="emerald"
      breadcrumbs={[
        { label: common("Navbar.categories.pdf"), href: "/pdf" },
        { label: t.raw("hero.title"), href: "/pdf/unlock-pdf" }
      ]}
      trustTitle={t("badges.local")}
      trustDesc={t("hero.description")}
      footerExtras={
        <div className="container mx-auto px-4 max-w-5xl py-12 space-y-20">
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight" dangerouslySetInnerHTML={{ __html: t.raw("landing.features.title") }} />
              <p className="text-muted-foreground font-medium">{t("landing.features.subtitle")}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(Array.isArray(t.raw("landing.features.items")) ? (t.raw("landing.features.items") as any[]) : []).map((feature, i) => {
                const icons = [Unlock, ShieldCheck, Cpu, Zap, FileText, Zap, Lock, ShieldAlert];
                const Icon = icons[i % icons.length];
                return (
                  <div key={i} className="p-4 rounded-2xl glass-card bg-secondary/30 border border-border flex flex-col items-center text-center gap-3">
                    <Icon className="w-6 h-6 text-emerald-500" />
                    <span className="text-sm font-bold leading-tight">{feature}</span>
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
            <Unlock className="w-4 h-4" /> {t("engine.title")}
          </h3>
          <Badge variant="outline" className="text-[9px] font-semibold uppercase tracking-wider border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
            {t("engine.active")}
          </Badge>
        </div>

        <div className="bg-orange-500/10 border-b border-orange-500/20 p-4 flex gap-3">
          <Scale className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <div className="text-sm text-orange-500 leading-relaxed font-medium">
            <strong>{t("legal.label")}</strong> {t("legal.text")}
          </div>
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
              <FileSizeWarning fileSize={file.size} module="pdf" />

              <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold truncate text-lg">{file.name}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{formatBytes(file.size)}</p>
                </div>
                <Button variant="ghost" size="icon" className="hover:bg-red-500/10 text-muted-foreground hover:text-red-500" onClick={handleReset}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {status !== "done" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pdf-password" className="text-[10px] font-semibold uppercase text-muted-foreground/60 tracking-wider">
                      {t("form.label")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="pdf-password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("form.placeholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && status !== "processing") handleUnlock(); }}
                        className="h-14 pr-12 rounded-2xl bg-background border-border font-bold text-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    className="w-full h-14 rounded-2xl font-bold text-lg gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    onClick={handleUnlock}
                    disabled={status === "processing"}
                  >
                    {status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Unlock className="w-5 h-5" />}
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
                    filename={file.name.replace(/\.pdf$/i, "_unlocked.pdf")}
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
