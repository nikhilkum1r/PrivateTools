"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, ShieldAlert, Download, ShieldCheck, Database, 
  Cpu, FileCode, Search, CheckCircle2, Zap, AlertTriangle, 
  Lock, Key, FileText, Settings2, FileDigit, Skull, Layers
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DropZone } from "@/components/shared/DropZone";
import { DisclaimerModal, useDisclaimer } from "@/components/shared/DisclaimerModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { shredFile, shreddedFilename, type ShredPasses } from "@/lib/privacy/shredder";
import { ExportManager } from "@/lib/export-manager";
import { formatBytes } from "@/lib/utils/fileSize";
import { STRINGS } from "@/lib/utils/strings";
import { FAQ } from "@/components/shared/FAQ";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function FileShredderClient() {
  const t = useTranslations("fileShredder");
  const { shown, accepted, showDisclaimer, accept } = useDisclaimer();
  const [file, setFile] = useState<File | null>(null);
  const [passes, setPasses] = useState<ShredPasses>(3);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const PASS_OPTIONS: { value: ShredPasses; label: string; desc: string; risk: string }[] = (Array.isArray(t.raw("protocols.options")) ? (t.raw("protocols.options") as any[]) : []).map((opt, i) => ({
    value: [1, 3, 7][i] as ShredPasses,
    label: opt.label,
    desc: opt.desc,
    risk: opt.risk
  }));

  const handleDrop = useCallback((files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    setStatus("idle");
    setResultBlob(null);
    setProgress(0);
    showDisclaimer();
  }, [showDisclaimer]);

  const handleShred = useCallback(async () => {
    if (!file || !accepted) return;
    setStatus("processing");
    setProgress(0);
    try {
      const blob = await shredFile(file, passes, setProgress);
      setResultBlob(blob);
      setStatus("done");
      import("sonner").then(m => m.toast.success(t("status.success")));
    } catch (e) {
      import("sonner").then(m => m.toast.error(t("status.failed", { error: (e as Error).message })));
      setStatus("idle");
    }
  }, [file, passes, accepted, t]);

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    ExportManager.downloadFile(resultBlob, shreddedFilename(file.name));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-red-500/30">
      <Navbar />
      
      <DisclaimerModal
        open={shown}
        title={t("disclaimer.title")}
        body={t("disclaimer.body")}
        onAccept={accept}
      />

      {/* Cyber/Terminal Aesthetic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main id="main-content" className="flex-grow relative z-10">
        {/* HERO SECTION */}
        <section className="pt-24 pb-12 px-4 container mx-auto text-center max-w-4xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(239,68,68,0.1)]">
              <Skull className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase">
                {t("hero.title")}
              </h1>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto">
                {t("hero.subtitle")}
              </p>
              <p className="text-sm font-medium text-red-400 bg-red-500/10 inline-block px-4 py-2 rounded-full border border-red-500/20">
                {t("hero.badge")}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {(Array.isArray(t.raw("trust")) ? (t.raw("trust") as any[]) : []).map((badge, i) => {
                const icons = [Lock, ShieldCheck, Search, Zap, Cpu];
                const Icon = icons[i % icons.length];
                return (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* INTERACTIVE SHREDDER STUDIO */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="glass-card rounded-3xl border border-border shadow-2xl bg-card overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-red-500 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> {t("terminal.title")}
              </h3>
              <Badge variant="outline" className="text-[9px] font-semibold uppercase tracking-wider border-red-500/30 text-red-400 bg-red-500/10">
                {t("terminal.engine")}
              </Badge>
            </div>

            {/* Warning Banner */}
            <div className="bg-orange-500/10 border-b border-orange-500/20 p-4 flex gap-3">
              <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-sm text-orange-400 leading-relaxed font-medium">
                <strong>{t("terminal.limitationLabel")}</strong> {t("terminal.warning")}
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {!file ? (
                <DropZone 
                  onFilesDrop={handleDrop} 
                  multiple={false} 
                  className="h-64 border-dashed border-red-500/30 hover:border-red-500/60 bg-background rounded-3xl transition-colors"
                />
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  {/* Selected File Card */}
                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 border border-red-500/20">
                      <FileDigit className="w-6 h-6" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold truncate text-lg">{file.name}</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{formatBytes(file.size)}</p>
                    </div>
                    <Button variant="outline" size="icon" className="hover:bg-red-500/10 text-muted-foreground hover:text-red-500 border-border" onClick={() => { setFile(null); setStatus("idle"); setResultBlob(null); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Overwrite Settings */}
                  {status !== "done" && (
                    <div className="space-y-4">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Settings2 className="w-4 h-4" /> {t("protocols.title")}
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {PASS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setPasses(opt.value)}
                            disabled={status === "processing"}
                            className={cn(
                              "p-4 rounded-2xl border text-left transition-all disabled:opacity-50",
                              passes === opt.value 
                                ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/5" 
                                : "border-border hover:border-red-500/30 bg-card hover:bg-red-500/5"
                            )}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <p className={cn("font-bold tracking-tight", passes === opt.value ? "text-red-500" : "text-foreground")}>{opt.label}</p>
                              <Badge variant="outline" className="text-[8px] tracking-wider uppercase border-border">{opt.risk} Risk</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">{opt.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Processing State */}
                  <AnimatePresence>
                    {status === "processing" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3 p-4 rounded-2xl bg-secondary/50 border border-border">
                        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider">
                          <span className="text-red-500 flex items-center gap-2"><Zap className="w-3 h-3 animate-pulse" /> {t("status.shredding", { pass: Math.ceil((progress / 100) * passes), total: passes })}</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-background [&>div]:bg-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  <div className="pt-4 border-t border-border">
                    {status !== "done" ? (
                      <button
                        className="w-full h-14 rounded-2xl font-bold text-lg gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-xl shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        onClick={handleShred}
                        disabled={!accepted || status === "processing"}
                      >
                        {status === "processing" ? <Cpu className="w-5 h-5 animate-pulse" /> : <Skull className="w-5 h-5" />}
                        {accepted ? (status === "processing" ? t("buttons.overwriting") : t("buttons.execute", { passes })) : t("buttons.accept")}
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                          <p className="font-bold text-emerald-500 uppercase tracking-wider">{t("status.success")}</p>
                          <p className="text-sm text-emerald-600/80 font-medium">{t("status.desc")}</p>
                        </div>
                        {resultBlob && (
                          <button
                            className="w-full h-14 flex items-center justify-center rounded-2xl font-bold text-lg gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 transition-colors"
                            onClick={handleDownload}
                          >
                            <Download className="w-5 h-5" />
                            {t("buttons.download")}
                          </button>
                        )}
                        <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-border" onClick={() => { setFile(null); setStatus("idle"); setResultBlob(null); }}>
                          {t("buttons.another")}
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* EDUCATIONAL & SEO CONTENT */}
        <div className="container mx-auto px-4 max-w-5xl py-12 space-y-20">
          
          {/* FAQ */}
          <FAQ 
            items={(Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any[]) : []).map(item => ({
              q: item.q,
              a: item.a
            }))}
            title={t("landing.faq.title")}
            description={t("landing.faq.description")}
          />

          {/* Related Tools */}
          <section className="space-y-6 text-center border-t border-border pt-16">
            <h2 className="text-2xl font-bold">{t("landing.related.title")}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {(Array.isArray(t.raw("landing.related.tools")) ? (t.raw("landing.related.tools") as any[]) : []).map(tool => {
                const localizedNames: any = {
                  "Metadata Cleaner": useTranslations("common")("tools.metadataCleaner"),
                  "Encryption Vault": useTranslations("common")("tools.vault"),
                  "Secure Notes": useTranslations("common")("tools.secureNotes"),
                  "Steganography": useTranslations("common")("tools.steganography"),
                  "Password Generator": useTranslations("common")("tools.passwordGenerator")
                };
                return (
                  <Link key={tool.href} href={tool.href} className="px-5 py-2.5 rounded-full bg-secondary hover:bg-red-500 hover:text-white border border-border hover:border-red-500 transition-colors font-bold text-sm">
                    {localizedNames[tool.name] || tool.name}
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Privacy Manifesto */}
          <section className="text-center max-w-2xl mx-auto space-y-4 pb-12">
            <ShieldCheck className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold uppercase tracking-wider text-muted-foreground">{t("landing.manifesto.title")}</h3>
            <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed">
              {t("landing.manifesto.content")}
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
