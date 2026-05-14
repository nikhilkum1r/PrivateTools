"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Undo2, Redo2, ZoomOut, ZoomIn, Maximize, Loader2, RefreshCw, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageFile, ImageSettings } from "@/store/useImageStore";
import { useTranslations } from "next-intl";

interface ToolbarProps {
  currentFile: ImageFile | null;
  settings: ImageSettings;
  history: any[];
  redoStack: any[];
  zoom: number;
  isProcessing: boolean;
  undo: () => void;
  redo: () => void;
  setZoom: (zoom: number) => void;
  pushSettings: (settings: Partial<ImageSettings>) => void;
  handleProcess: () => void;
  handleDownloadSingle: () => void;
}

export function Toolbar({
  currentFile,
  settings,
  history,
  redoStack,
  zoom,
  isProcessing,
  undo,
  redo,
  setZoom,
  pushSettings,
  handleProcess,
  handleDownloadSingle
}: ToolbarProps) {
  const t = useTranslations("imageEditor");

  return (
    <AnimatePresence>
      {currentFile && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 50, x: "-50%" }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          className="fixed bottom-12 left-1/2 flex items-center gap-4 p-4 rounded-[2rem] bg-card/60 backdrop-blur-3xl border border-border/50 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] z-[100] group/toolbar ring-1 ring-white/5"
        >
          {/* Performance Pulse Indicator */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black/80 border border-border/50 backdrop-blur-xl flex items-center gap-2 shadow-2xl">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="text-[7px] font-semibold uppercase tracking-wider text-primary">{t("workspace.engineSync")}</span>
          </div>

          {/* Navigation Group */}
          <div className="flex items-center gap-1 bg-black/40 rounded-2xl p-1.5 shrink-0 border border-border/20">
            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary disabled:opacity-20 transition-all" onClick={undo} disabled={history.length === 0}>
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary disabled:opacity-20 transition-all" onClick={redo} disabled={redoStack.length === 0}>
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-[1px] h-8 bg-border/50 mx-1 shrink-0" />

          {/* View Control Group */}
          <div className="flex items-center gap-3 px-2 shrink-0">
            <div className="flex items-center gap-1 bg-black/40 rounded-2xl p-1.5 border border-border/20">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-secondary/50" onClick={() => setZoom(Math.max(0.1, zoom - 0.2))}>
                <ZoomOut className="w-3.5 h-3.5 opacity-40" />
              </Button>
              <div className="px-3 min-w-[50px] text-[10px] font-bold text-foreground tabular-nums text-center uppercase tracking-tight">
                {Math.round(zoom * 100)}%
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-secondary/50" onClick={() => setZoom(Math.min(5, zoom + 0.2))}>
                <ZoomIn className="w-3.5 h-3.5 opacity-40" />
              </Button>
              <div className="w-[1px] h-4 bg-border/50 mx-1" />
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-secondary/50" onClick={() => setZoom(1)}>
                <Maximize className="w-3.5 h-3.5 opacity-40" />
              </Button>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-border/50 mx-1 shrink-0" />

          {/* Quality Matrix Group */}
          <div className="hidden sm:flex items-center gap-4 px-2 shrink-0">
            <div className="flex flex-col">
              <span className="text-[7px] font-bold text-muted-foreground/40 uppercase tracking-wider mb-1">{t("workspace.exportQuality")}</span>
              <div className="flex gap-1.5 bg-black/40 rounded-xl p-1 border border-border/20">
                {[
                  { l: "L", v: 30 },
                  { l: "M", v: 75 },
                  { l: "H", v: 95 }
                ].map(p => (
                  <button
                    key={p.l}
                    onClick={() => pushSettings({ quality: p.v })}
                    className={cn(
                      "w-7 h-7 rounded-lg text-[8px] font-bold transition-all",
                      settings.quality === p.v ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground/40 hover:bg-secondary/50"
                    )}
                  >
                    {p.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-border/50 mx-1 shrink-0" />

          {/* Action Execution Group */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative group/btn">
              {currentFile?.status === "idle" && (
                <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full animate-pulse group-hover/btn:bg-primary/40 transition-all" />
              )}
              <Button
                size="lg"
                className={cn(
                  "relative rounded-2xl px-8 h-12 font-bold text-[10px] gap-3 shadow-2xl uppercase tracking-tight group active:scale-95 transition-all duration-500",
                  currentFile?.status === "idle"
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/30"
                    : "bg-secondary/50 border border-border text-muted-foreground/60 cursor-default"
                )}
                onClick={handleProcess}
                disabled={isProcessing || currentFile?.status === "processing"}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className={cn(
                    "w-4 h-4 transition-transform duration-700",
                    currentFile?.status === "idle" && "group-hover:rotate-180"
                  )} />
                )}
                <span className="hidden md:inline">{isProcessing ? t("workspace.rendering") : currentFile?.status === "idle" ? t("workspace.renderChanges") : t("workspace.upToDate")}</span>
                <span className="md:hidden">{isProcessing ? "..." : t("workspace.render")}</span>
              </Button>
            </div>

            <Button
              size="lg"
              className="rounded-2xl px-6 h-12 bg-white text-black hover:bg-emerald-500 hover:text-white font-bold text-[10px] gap-2 uppercase tracking-tight group active:scale-95 transition-all shadow-2xl"
              onClick={handleDownloadSingle}
              disabled={!currentFile?.processedUrl}
            >
              <DownloadCloud className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              {t("workspace.save")}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
