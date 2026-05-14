"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Copy, Wand2, Palette, Info, Check, Share2, Download } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface DialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

interface OCRDialogProps extends DialogProps {
  text: string;
}

export function OCRResultDialog({ isOpen, onClose, text }: OCRDialogProps) {
  const t = useTranslations("imageEditor");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-card border-border rounded-[2rem] p-0 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
        <DialogHeader className="px-8 py-6 border-b border-border bg-secondary/20">
          <DialogTitle className="text-3xl font-bold tracking-tight flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Wand2 className="w-5 h-5 text-primary" />
            </div>
            {t("dialogs.ocr.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="p-8 space-y-6">
          <ScrollArea className="h-[400px] rounded-2xl border border-border bg-black/40 p-6">
            <Textarea
              value={text}
              readOnly
              className="min-h-full bg-transparent border-none text-foreground leading-relaxed font-mono text-sm focus-visible:ring-0 resize-none"
            />
          </ScrollArea>
          <div className="flex gap-4">
            <Button
              className="flex-grow h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider text-xs gap-3 shadow-xl shadow-primary/20"
              onClick={() => {
                navigator.clipboard.writeText(text);
                toast.success(t("toasts.ocr_copy"));
              }}
            >
              <Copy className="w-4 h-4" /> {t("dialogs.ocr.copy")}
            </Button>
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-border bg-secondary/50 font-bold uppercase tracking-wider text-xs" onClick={() => onClose(false)}>
              {t("dialogs.close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PaletteDialogProps extends DialogProps {
  palette: string[];
}

export function ColorPaletteDialog({ isOpen, onClose, palette }: PaletteDialogProps) {
  const t = useTranslations("imageEditor");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border rounded-[2rem] p-0 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
        <DialogHeader className="px-8 py-6 border-b border-border bg-secondary/20">
          <DialogTitle className="text-3xl font-bold tracking-tight flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            {t("dialogs.palette.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="p-8 space-y-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {palette.map((color, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group space-y-3"
                onClick={() => {
                  navigator.clipboard.writeText(color);
                  toast.success(`Copied ${color}`);
                }}
              >
                <div
                  className="aspect-square rounded-3xl border-4 border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 cursor-pointer"
                  style={{ backgroundColor: color }}
                />
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold font-mono text-foreground uppercase tracking-widest">{color}</span>
                  <Badge variant="outline" className="text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Copy HEX</Badge>
                </div>
              </motion.div>
            ))}
          </div>
          <Button variant="outline" className="h-14 px-10 rounded-2xl border-border bg-secondary/50 font-bold uppercase tracking-wider text-xs w-full" onClick={() => onClose(false)}>
            {t("dialogs.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface MetadataDialogProps extends DialogProps {
  metadata: any;
}

export function MetadataDialog({ isOpen, onClose, metadata }: MetadataDialogProps) {
  const t = useTranslations("imageEditor");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border rounded-[2rem] p-0 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
        <DialogHeader className="px-8 py-6 border-b border-border bg-secondary/20">
          <DialogTitle className="text-3xl font-bold tracking-tight flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Info className="w-5 h-5 text-primary" />
            </div>
            {t("dialogs.meta.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="p-8">
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(metadata || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="p-4 rounded-2xl bg-secondary/20 border border-border/50 flex justify-between items-start gap-8">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest shrink-0 mt-1">{key}</span>
                  <span className="text-xs font-medium text-foreground text-right break-all">{String(value)}</span>
                </div>
              ))}
              {(!metadata || Object.keys(metadata).length === 0) && (
                <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <Info className="w-12 h-12" />
                  <p className="text-sm font-bold uppercase tracking-widest">{t("dialogs.meta.empty")}</p>
                </div>
              )}
            </div>
          </ScrollArea>
          <Button variant="outline" className="h-14 mt-8 rounded-2xl border-border bg-secondary/50 font-bold uppercase tracking-wider text-xs w-full" onClick={() => onClose(false)}>
            {t("dialogs.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EditorDialogs({
  ocrResult,
  setOcrResult,
  extractedColors,
  setExtractedColors,
  metadataFile,
  setMetadataFile,
}: {
  ocrResult: string | null;
  setOcrResult: (val: string | null) => void;
  extractedColors: string[];
  setExtractedColors: (val: string[]) => void;
  metadataFile: any | null;
  setMetadataFile: (val: any | null) => void;
}) {
  return (
    <>
      <OCRResultDialog
        isOpen={!!ocrResult}
        onClose={() => setOcrResult(null)}
        text={ocrResult || ""}
      />
      <ColorPaletteDialog
        isOpen={extractedColors.length > 0}
        onClose={() => setExtractedColors([])}
        palette={extractedColors}
      />
      <MetadataDialog
        isOpen={!!metadataFile}
        onClose={() => setMetadataFile(null)}
        metadata={metadataFile ? {
          name: metadataFile.file.name,
          type: metadataFile.file.type || "unknown",
          size: `${(metadataFile.file.size / 1024).toFixed(2)} KB`,
          status: metadataFile.status
        } : null}
      />
    </>
  );
}
