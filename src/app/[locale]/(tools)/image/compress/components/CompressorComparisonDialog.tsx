"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, GripVertical } from "lucide-react";

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

interface CompressorComparisonDialogProps {
  t: any;
  previewId: string | null;
  setPreviewId: (id: string | null) => void;
  files: CompressionFile[];
  comparisonValue: number;
  setComparisonValue: (val: number) => void;
  outputFormat: string;
  resolveFilename: (name: string) => string;
  ExportManager: any;
}

export function CompressorComparisonDialog({
  t,
  previewId,
  setPreviewId,
  files,
  comparisonValue,
  setComparisonValue,
  outputFormat,
  resolveFilename,
  ExportManager
}: CompressorComparisonDialogProps) {
  const currentFile = files.find(f => f.id === previewId);

  return (
    <Dialog open={!!previewId} onOpenChange={() => setPreviewId(null)}>
      <DialogContent className="max-w-[95vw] h-[90vh] p-0 bg-black/95 border-white/5 overflow-hidden flex flex-col rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)]">
        <DialogHeader className="p-8 border-b border-white/5 bg-black/40 backdrop-blur-xl relative z-20">
          <DialogTitle className="text-3xl md:text-5xl font-bold tracking-tight flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-primary font-heading">{t("comparison.title")}</span>
              <div className="h-8 w-[1px] bg-white/10 hidden md:block" />
              <span className="text-white/40 text-sm md:text-lg not-italic font-medium lowercase">{t("comparison.subtitle")}</span>
            </div>
            {currentFile && (
              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-semibold uppercase tracking-wider opacity-40">{t("comparison.originalSize")}</span>
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-xs font-bold px-4 py-1.5 rounded-xl">{(currentFile.file.size / 1024).toFixed(1)} KB</Badge>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-semibold uppercase tracking-wider text-emerald-500/60">{t("comparison.newSize")}</span>
                  <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 text-xs font-bold px-4 py-1.5 rounded-xl">{(currentFile.outputSize! / 1024).toFixed(1)} KB</Badge>
                </div>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-grow relative overflow-hidden bg-[#050505] group/studio">
          {currentFile && (
            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12">
              <div className="relative w-full h-full max-w-5xl glass-card rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl group/comparison">
                <div className="absolute inset-0 select-none bg-checkerboard">
                  <img 
                    src={currentFile.outputUrl} 
                    className="absolute inset-0 w-full h-full object-contain p-4 md:p-12" 
                    alt="Optimized" 
                  />
                  
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - comparisonValue}% 0 0)` }}
                  >
                    <img 
                      src={currentFile.previewUrl} 
                      className="absolute inset-0 w-full h-full object-contain p-4 md:p-12" 
                      alt="Original" 
                    />
                  </div>

                  <div 
                    className="absolute inset-y-0 z-30 flex items-center pointer-events-none"
                    style={{ left: `${comparisonValue}%` }}
                  >
                    <div className="h-full w-[2px] bg-primary relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary border-4 border-black/40 shadow-2xl flex items-center justify-center pointer-events-auto cursor-ew-resize hover:scale-110 active:scale-95 transition-transform">
                        <GripVertical className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={comparisonValue} 
                    onChange={(e) => setComparisonValue(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
                  />

                  <div className="absolute top-8 left-8 px-6 py-2 rounded-2xl bg-black/80 text-[10px] font-semibold uppercase tracking-wider text-white border border-white/10 backdrop-blur-md shadow-2xl z-50">{t("comparison.original")}</div>
                  <div className="absolute top-8 right-8 px-6 py-2 rounded-2xl bg-emerald-500/80 text-[10px] font-semibold uppercase tracking-wider text-white border border-emerald-500/20 backdrop-blur-md shadow-2xl z-50">{t("comparison.optimized")}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-8 bg-black/40 border-t border-white/5 flex items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[8px] font-semibold uppercase tracking-wider text-primary/60">{t("comparison.smaller")}</span>
              <span className="text-2xl font-bold tabular-nums">
                {currentFile && t("comparison.smallerLabel", { percent: Math.round((1 - (currentFile.outputSize! / currentFile.file.size)) * 100) })}
              </span>
            </div>
            <div className="h-10 w-[1px] bg-white/5" />
            <div className="flex flex-col">
              <span className="text-[8px] font-semibold uppercase tracking-wider text-blue-400/60">{t("comparison.qualityCheck")}</span>
              <span className="text-2xl font-bold tabular-nums text-blue-400">{t("comparison.perfect")}</span>
            </div>
          </div>

          <Button 
            className="h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wider text-sm px-12 gap-4 shadow-2xl shadow-primary/30 group/dl-modal"
            onClick={() => {
              if (currentFile) {
                const ext = outputFormat === "original" ? (currentFile.file.name.split('.').pop() || "webp") : outputFormat;
                const baseName = resolveFilename(currentFile.file.name);
                ExportManager.downloadFromUrl(currentFile.outputUrl!, `${baseName}.${ext}`);
              }
            }}
          >
            {t("comparison.save")} <Download className="w-6 h-6 group-hover/dl-modal:translate-y-1 transition-transform" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
