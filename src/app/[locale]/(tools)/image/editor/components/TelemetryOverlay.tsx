"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageFile } from "@/store/useImageStore";
import { useTranslations } from "next-intl";

interface TelemetryOverlayProps {
  currentFile: ImageFile | null;
  imageDimensions: { naturalWidth: number, naturalHeight: number } | null;
}

export function TelemetryOverlay({ currentFile, imageDimensions }: TelemetryOverlayProps) {
  const t = useTranslations("imageEditor");

  return (
    <AnimatePresence>
      {currentFile && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-8 left-8 z-20 space-y-4 hidden xl:block pointer-events-none"
        >
          <div className="p-4 rounded-2xl bg-black/60 border border-border/50 backdrop-blur-xl space-y-3 shadow-2xl">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground">{t("workspace.telemetry")}</span>
            </div>
            <div className="space-y-2">
              {[
                { l: "MEM_USAGE", v: `${(currentFile.file.size / (1024 * 1024)).toFixed(2)} MB`, c: "text-primary" },
                { l: "PROC_ENGINE", v: "WASM_NATIVE", c: "text-foreground" },
                { l: "BIT_DEPTH", v: "8-BIT_RGBA", c: "text-foreground" },
                { l: "DIMENSIONS", v: imageDimensions ? `${imageDimensions.naturalWidth} x ${imageDimensions.naturalHeight}` : "Detecting...", c: "text-foreground" },
                { l: "STORAGE_IO", v: "ZERO_DEPENDENCY", c: "text-emerald-500" }
              ].map(stat => (
                <div key={stat.l} className="flex justify-between items-center gap-8">
                  <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-tight">{stat.l}</span>
                  <span className={cn("text-[10px] font-bold font-mono tracking-tight", stat.c)}>{stat.v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-wider">{t("workspace.privacyStatus")}</span>
              <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">{t("workspace.localPipeline")}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
