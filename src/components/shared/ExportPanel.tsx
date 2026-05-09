"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, Share2, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExportManager } from "@/lib/export-manager";
import { formatBytes, formatSavings } from "@/lib/utils/fileSize";

interface ExportPanelProps {
  blob: Blob | null;
  filename: string;
  inputSize?: number;       // bytes — for savings display
  onReset: () => void;
  allowCopy?: boolean;      // show Copy button (images only)
  className?: string;
}

export function ExportPanel({
  blob,
  filename,
  inputSize,
  onReset,
  allowCopy = false,
  className = "",
}: ExportPanelProps) {
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);

  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  const handleDownload = () => {
    if (!blob) return;
    ExportManager.downloadFile(blob, filename);
  };

  const handleCopy = async () => {
    if (!blob) return;
    await ExportManager.copyImage(blob);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!blob) return;
    const ok = await ExportManager.shareFile(blob, filename);
    if (ok) setShared(true);
  };

  if (!blob) return null;

  const savings = inputSize ? formatSavings(inputSize, blob.size) : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        className={`rounded-2xl border border-green-500/20 bg-green-500/5 p-6 space-y-4 ${className}`}
      >
        {/* Status + size info */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Ready to download</p>
              <p className="text-xs text-muted-foreground font-mono">{formatBytes(blob.size)}</p>
            </div>
          </div>
          {savings && (
            <Badge className="bg-green-500/10 text-green-600 border-green-500/20 font-bold">
              {savings}
            </Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            className="flex-1 min-w-[120px] gap-2 rounded-xl shadow-lg shadow-primary/10"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            Download
          </Button>

          {allowCopy && (
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={handleCopy}
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
          )}

          {canShare && (
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          )}

          <Button
            variant="ghost"
            className="gap-2 rounded-xl text-muted-foreground hover:text-foreground"
            onClick={onReset}
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
