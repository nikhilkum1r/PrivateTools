"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Maximize2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageFile } from "@/store/useImageStore";
import { useTranslations } from "next-intl";

interface WorkspaceAreaProps {
  currentFile: ImageFile | null;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
  handleDrop: (e: React.DragEvent) => void;
  zoom: number;
  imageRef: React.RefObject<HTMLImageElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  imageDimensions: { naturalWidth: number; naturalHeight: number } | null;
  settings: any;
  activeTab: string;
  isProcessing: boolean;
  isScanning: boolean;
  updateFileCrop: (id: string, crop: any) => void;
  updateFileBlurs: (id: string, blurs: any[]) => void;
  onAddFiles: (files: File[]) => void;
  onOpenOCR: () => void;
  onOpenColorPalette: () => void;
  onOpenMetadata: () => void;
  handleDownloadSingle: () => void;
}

export function WorkspaceArea({
  currentFile,
  isDragging,
  setIsDragging,
  handleDrop,
  zoom,
  imageRef,
  canvasRef,
  imageDimensions,
  settings,
  activeTab,
  isProcessing,
  isScanning,
  updateFileCrop,
  updateFileBlurs,
  onAddFiles,
  onOpenOCR,
  onOpenColorPalette,
  onOpenMetadata,
  handleDownloadSingle
}: WorkspaceAreaProps) {
  const t = useTranslations("imageEditor");

  return (
    <div className="flex-grow h-full overflow-hidden relative studio-workspace bg-[#0a0a0a]">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="h-full w-full overflow-auto scrollbar-hide flex items-center justify-center p-8 md:p-20">
        <div className="relative group/canvas" style={{ transform: `scale(${zoom})`, transition: "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)" }}>
          <div className="absolute -inset-20 bg-primary/10 blur-[150px] opacity-0 group-hover/canvas:opacity-50 transition-opacity duration-1000 pointer-events-none" />

          {/* Processing Mask */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[2px] bg-black/20 rounded-xl"
              >
                <div className="bg-black/60 px-6 py-3 rounded-full border border-primary/20 flex items-center gap-4 shadow-2xl">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="text-[10px] font-bold text-primary tracking-widest uppercase">{t("workspace.syncing")}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SMART ACTION OVERLAY */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover/canvas:opacity-100 transition-all duration-500 translate-y-4 group-hover/canvas:translate-y-0 z-30">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl h-10 px-5 bg-black/60 border border-border/50 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all shadow-2xl"
              onClick={onOpenOCR}
            >
              OCR
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl h-10 px-5 bg-black/60 border border-border/50 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all shadow-2xl"
              onClick={onOpenColorPalette}
            >
              Palette
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl h-10 px-5 bg-black/60 border border-border/50 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all shadow-2xl"
              onClick={onOpenMetadata}
            >
              Meta
            </Button>
          </div>

          <div className="relative z-10 canvas-container group/preview shadow-[0_80px_150px_-30px_rgba(0,0,0,1)]">
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/preview:opacity-20 transition-opacity blur-2xl -z-10" />
            <canvas
              ref={canvasRef}
              className={cn(
                "max-w-full h-auto rounded-xl border border-white/5 transition-all duration-700 shadow-2xl",
                isProcessing && "brightness-50"
              )}
            />

            {/* PREVIEW TOOLTIP */}
            {currentFile?.processedUrl && (
              <div className="absolute bottom-6 right-6 flex items-center gap-3 opacity-0 group-hover/preview:opacity-100 transition-all duration-500 translate-y-4 group-hover/preview:translate-y-0">
                <Button variant="secondary" size="icon" className="h-10 w-10 rounded-xl bg-black/60 border border-border/50 backdrop-blur-md" onClick={() => window.open(currentFile.processedUrl!, '_blank')}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="icon" className="h-10 w-10 rounded-xl bg-primary text-white border-none shadow-xl shadow-primary/30" onClick={handleDownloadSingle}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* STATUS CHIP */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 group-hover/canvas:opacity-100 transition-all duration-500 -translate-y-4 group-hover/canvas:translate-y-0 pointer-events-none">
            <Badge className={cn(
              "rounded-full px-4 py-1 border text-[10px] font-bold tracking-widest uppercase shadow-2xl",
              currentFile?.status === "completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                currentFile?.status === "processing" ? "bg-primary/10 text-primary border-primary/20" :
                  "bg-white/5 text-white/40 border-white/10"
            )}>
              {currentFile?.status || "Idle"}
            </Badge>
            <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-tighter">Native Browser Pipeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
