"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Activity, Search, FileStack, Download, Zap, Trash2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CompressionFile {
  id: string;
  file: File;
  previewUrl: string;
  status: "idle" | "processing" | "completed" | "error";
  progress: number;
  outputSize?: number;
  outputUrl?: string;
  outputBlob?: Blob;
}

interface CompressorQueueProps {
  t: any;
  files: CompressionFile[];
  compressFile: (id: string) => void;
  removeFile: (id: string) => void;
  copyToClipboard: (id: string) => void;
  resolveFilename: (name: string) => string;
  setPreviewId: (id: string | null) => void;
  isProcessingAll: boolean;
  outputFormat: string;
  ExportManager: any;
  processAll: () => void;
  step: string;
}

export function CompressorQueue({
  t,
  files,
  compressFile,
  removeFile,
  copyToClipboard,
  resolveFilename,
  setPreviewId,
  isProcessingAll,
  outputFormat,
  ExportManager,
  processAll,
  step
}: CompressorQueueProps) {
  return (
    <motion.div
      key="processing-stage"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20"
    >
      <AnimatePresence mode="popLayout">
        {files.map((f, i) => (
          <motion.div
            key={f.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="col-span-full"
          >
            <div className={cn(
              "p-5 md:p-8 rounded-[2.5rem] transition-all duration-500 relative overflow-hidden border",
              f.status === "completed" 
                ? "bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_40px_-10px_rgba(16,185,129,0.1)]" 
                : f.status === "processing"
                  ? "bg-primary/5 border-primary/30 shadow-[0_0_40px_-10px_rgba(var(--color-primary-rgb),0.2)]"
                  : "glass-card hover:border-primary/20 shadow-xl"
            )}>
              {f.status === "completed" && (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
              )}

              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10 relative z-10">
                <div className="relative shrink-0 group/preview">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-md opacity-0 group-hover/preview:opacity-100 transition-opacity" />
                  <div className="w-28 h-28 md:w-40 md:h-40 rounded-3xl bg-black border border-white/10 overflow-hidden relative shadow-2xl transition-transform duration-500 group-hover/preview:scale-[1.02]">
                    <img src={f.previewUrl} className="w-full h-full object-cover opacity-70 group-hover/preview:opacity-100 transition-opacity" alt="File preview" />
                    <AnimatePresence>
                      {f.status === "completed" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-emerald-500/90 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                          <CheckCircle2 className="w-10 h-10 mb-2" />
                          <span className="text-[8px] font-semibold uppercase tracking-wider">{t("queue.optimized")}</span>
                        </motion.div>
                      )}
                      {f.status === "processing" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                          <span className="text-sm font-bold text-primary mt-2">{f.progress}%</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex-grow min-w-0 space-y-6 text-center md:text-left">
                  <div className="space-y-2">
                    <h4 className="text-xl md:text-3xl font-extrabold tracking-tight truncate pr-10 italic uppercase font-heading">{f.file.name}</h4>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                      <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-white/40">{t("queue.fileSize")}:</span>
                        <span className="text-[10px] font-bold text-white/80">{(f.file.size / 1024).toFixed(0)} KB</span>
                      </div>
                      {f.outputSize && (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }} 
                          animate={{ scale: 1, opacity: 1 }}
                          className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2"
                        >
                          <Activity className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[9px] font-semibold uppercase tracking-wider text-emerald-500">{t("queue.savings")}:</span>
                          <span className="text-[10px] font-bold text-emerald-500">-{Math.round((1 - (f.outputSize / f.file.size)) * 100)}%</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {f.status === "processing" && (
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary via-blue-500 to-primary background-animate"
                        initial={{ width: 0 }}
                        animate={{ width: `${f.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {f.status === "completed" ? (
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-14 h-14 rounded-2xl border-indigo-500/40 bg-indigo-500/10 text-indigo-500 hover:text-indigo-400 hover:border-indigo-500/60 transition-all group/info"
                        onClick={() => setPreviewId(f.id)}
                      >
                        <Search className="w-6 h-6 group-hover/info:scale-110 transition-transform" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-14 h-14 rounded-2xl border-blue-500/40 bg-blue-500/10 text-blue-500 hover:text-blue-400 hover:border-blue-500/60 transition-all group/copy"
                        onClick={() => copyToClipboard(f.id)}
                        title="Copy Image"
                      >
                        <FileStack className="w-6 h-6 group-hover/copy:scale-110 transition-transform" />
                      </Button>
                      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-14 h-14 rounded-2xl border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-500 hover:text-fuchsia-400 hover:border-fuchsia-500/60 transition-all group/share hidden sm:flex"
                          onClick={() => {
                            if (f.outputBlob) {
                              const ext = outputFormat === "original" ? (f.file.name.split('.').pop() || "webp") : outputFormat;
                              const baseName = resolveFilename(f.file.name);
                              ExportManager.shareFile(f.outputBlob, `${baseName}.${ext}`, `Compressed ${baseName}.${ext}`);
                            }
                          }}
                          title="Share File"
                        >
                          <Share2 className="w-6 h-6 group-hover/share:scale-110 transition-transform" />
                        </Button>
                      )}
                      <Button
                        className="h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold uppercase tracking-wider text-[11px] px-8 gap-3 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] active:scale-95 transition-all group/dl"
                        onClick={() => {
                          const ext = outputFormat === "original" ? (f.file.name.split('.').pop() || "webp") : outputFormat;
                          const baseName = resolveFilename(f.file.name);
                          ExportManager.downloadFromUrl(f.outputUrl!, `${baseName}.${ext}`);
                        }}
                      >
                        {t("queue.download")} <Download className="w-5 h-5 group-hover/dl:translate-y-0.5 transition-transform" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className={cn(
                        "h-14 rounded-2xl font-semibold uppercase tracking-wider text-[11px] px-10 gap-3 transition-all relative overflow-hidden group/opt",
                        f.status === "idle" 
                          ? "bg-primary text-primary-foreground shadow-[0_0_40px_-10px_rgba(var(--color-primary-rgb),0.5)] hover:scale-[1.02]" 
                          : "bg-white/5 text-white/20 cursor-not-allowed border-white/5"
                      )}
                      onClick={() => compressFile(f.id)}
                      disabled={f.status === "processing" || isProcessingAll}
                    >
                      {f.status === "processing" ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {t("queue.processing")}
                        </>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/opt:opacity-100 transition-opacity" />
                          {t("queue.compress")} <Zap className="w-5 h-5 group-hover/opt:scale-125 transition-transform" />
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-14 h-14 rounded-2xl text-rose-500/20 hover:text-rose-500 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/40 transition-all"
                    onClick={() => removeFile(f.id)}
                  >
                    <Trash2 className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {step === "configure" && files.length > 0 && (
        <div className="xl:col-span-2 flex justify-center pt-10">
          <Button
            className="h-20 rounded-[2.5rem] bg-gradient-to-r from-[#8b5cf6] via-[#6366f1] to-[#8b5cf6] bg-[length:200%_100%] animate-gradient hover:scale-[1.05] active:scale-95 text-white font-bold text-xl px-16 gap-4 shadow-[0_0_50px_-10px_rgba(139,92,246,0.6)] group transition-all border border-white/20"
            onClick={processAll}
          >
            <Zap className="w-8 h-8 group-hover:rotate-12 transition-transform" />
            <span className="tracking-tight">{t("queue.compress_all")}</span>
          </Button>
        </div>
      )}
    </motion.div>
  );
}
