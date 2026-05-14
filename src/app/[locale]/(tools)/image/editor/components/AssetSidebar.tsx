"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ImageFile } from "@/store/useImageStore";
import { useTranslations } from "next-intl";

interface AssetSidebarProps {
  files: ImageFile[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  removeFile: (id: string) => void;
  onAddFiles: (files: File[]) => void;
}

export function AssetSidebar({ files, selectedId, setSelectedId, removeFile, onAddFiles }: AssetSidebarProps) {
  const t = useTranslations("imageEditor");

  if (files.length === 0) return null;

  return (
    <aside className="flex w-[60px] md:w-[320px] h-full max-h-full bg-card shrink-0 flex-col relative z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-r border-border transition-all duration-500 overflow-hidden group/sidebar hover:w-[320px]">
      <div className="w-[320px]">
        <div className="px-6 py-5 border-b border-border bg-black/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-bold tracking-wider text-primary flex items-center gap-2">
                <Layers className="w-4 h-4" /> {t("sidebar.navigator")}
              </h3>
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{t("sidebar.bin")}</p>
            </div>
            <Badge className="rounded-full bg-primary/10 text-primary border-primary/20 text-[10px] font-bold px-3 py-0.5">
              {files.length}
            </Badge>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-semibold uppercase tracking-wider text-emerald-500/80">{t("sidebar.session")}</span>
          </div>
        </div>

        <ScrollArea className="flex-grow min-h-0 h-[calc(100vh-280px)]">
          <div className="p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setSelectedId(file.id)}
                  className={cn(
                    "group p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden duration-500",
                    selectedId === file.id
                      ? "bg-primary/10 border-primary/40 shadow-2xl shadow-primary/20"
                      : "bg-secondary/20 border-border/50 hover:bg-secondary/40 hover:border-border"
                  )}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-black border border-border/50 shrink-0 shadow-2xl group-hover:scale-105 transition-transform relative">
                      <div className="absolute top-0 right-0 px-1 bg-black/60 backdrop-blur-md text-[6px] font-bold text-primary border-bl border-border/50 z-20">
                        {file.file.name.split('.').pop()}
                      </div>
                      <img src={file.previewUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="File preview thumbnail" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-[11px] font-bold truncate leading-tight uppercase tracking-tight text-foreground/80">{file.file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-semibold uppercase text-muted-foreground/40 tracking-wider tabular-nums">
                          {(file.file.size / 1024).toFixed(1)} KB
                        </span>
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          file.status === "completed" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" :
                            file.status === "processing" ? "bg-primary animate-pulse" :
                              file.status === "error" ? "bg-destructive" : "bg-white/10"
                        )} />
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                      className="p-2 rounded-xl opacity-0 group-hover:opacity-100 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {selectedId === file.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-border bg-black/20">
          <Button
            className="w-full bg-white text-black hover:bg-primary hover:text-white rounded-2xl font-bold h-12 gap-3 text-[10px] uppercase tracking-wider shadow-2xl active:scale-95 transition-all group"
            onClick={() => document.getElementById('studio-upload-mobile')?.click()}
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            {t("sidebar.add")}
          </Button>
        </div>
      </div>
    </aside>
  );
}
