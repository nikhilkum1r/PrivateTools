"use client";

import React from "react";
import { motion } from "framer-motion";
import { DropZone } from "@/components/shared/DropZone";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { useTranslations } from "next-intl";

interface DropzoneOverlayProps {
  onFilesDrop: (files: File[]) => void;
}

export function DropzoneOverlay({ onFilesDrop }: DropzoneOverlayProps) {
  const t = useTranslations("imageEditor");

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden bg-background">
      {/* Decorative blurred blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl space-y-12"
      >
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight uppercase">{t("workspace.dropzoneTitle")}</h2>
          <p className="text-muted-foreground text-sm font-semibold uppercase tracking-widest opacity-60">
            {t("workspace.dropzoneSubtitle")}
          </p>
        </div>

        <div className="aspect-[16/9] md:aspect-[21/9]">
          <DropZone
            onFilesDrop={onFilesDrop}
            accept="image/*,.heic,.psd,.tiff,.tif,.docx"
            multiple={true}
            className="h-full rounded-[2.5rem] border-dashed border-primary/20 bg-card/50 backdrop-blur-3xl hover:bg-secondary/50 hover:border-primary transition-all duration-700 shadow-2xl group ring-1 ring-white/5"
            title={t("workspace.dropzonePrompt")}
            description={t("workspace.dropzoneFormats")}
          />
        </div>

        <div className="flex justify-center">
          <PrivacyBadge />
        </div>
      </motion.div>
    </div>
  );
}
