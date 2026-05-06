"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Trash2, Upload, ShieldAlert, Download } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { DropZone } from "@/components/shared/DropZone";
import { DisclaimerModal, useDisclaimer } from "@/components/shared/DisclaimerModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { shredFile, shreddedFilename, type ShredPasses } from "@/lib/privacy/shredder";
import { downloadBlob } from "@/lib/utils/download";
import { formatBytes } from "@/lib/utils/fileSize";
import { STRINGS } from "@/lib/utils/strings";
import { toast } from "sonner";

const PASS_OPTIONS: { value: ShredPasses; label: string; desc: string }[] = [
  { value: 1, label: "1 Pass", desc: "Quick — single random overwrite" },
  { value: 3, label: "3 Passes", desc: "Standard — recommended for most use cases" },
  { value: 7, label: "7 Passes", desc: "Thorough — DoD 5220.22-M style" },
];

export default function FileShredderPage() {
  const { shown, accepted, showDisclaimer, accept } = useDisclaimer();
  const [file, setFile] = useState<File | null>(null);
  const [passes, setPasses] = useState<ShredPasses>(3);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

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
      toast.success("File shredded successfully.");
    } catch (e) {
      toast.error("Shredding failed: " + (e as Error).message);
      setStatus("idle");
    }
  }, [file, passes, accepted]);

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    downloadBlob(resultBlob, shreddedFilename(file.name));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <DisclaimerModal
        open={shown}
        title={STRINGS.disclaimers.fileShredder.title}
        body={STRINGS.disclaimers.fileShredder.body}
        onAccept={accept}
      />

      <main className="flex-grow container mx-auto px-4 py-12 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">File Shredder</h1>
              <p className="text-muted-foreground mt-2">Overwrite file data with random bytes before disposal. In-browser only.</p>
            </div>
            <PrivacyBadge />
          </div>

          {/* Warning banner */}
          <div className="flex gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-sm">
            <ShieldAlert className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-yellow-700 dark:text-yellow-400 leading-relaxed">
              <strong>Browser limitation:</strong> This overwrites data in memory only. Your original file on disk is NOT modified or deleted.
            </p>
          </div>

          {/* Drop zone */}
          {!file ? (
            <DropZone onFilesDrop={handleDrop} multiple={false} />
          ) : (
            <div className="p-4 rounded-xl bg-secondary/50 border border-primary/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-bold truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { setFile(null); setStatus("idle"); setResultBlob(null); }}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Pass selector */}
          {file && (
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Overwrite Passes</Label>
              <div className="grid grid-cols-3 gap-2">
                {PASS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPasses(opt.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${passes === opt.value ? "border-primary bg-primary/5" : "border-primary/10 hover:border-primary/30"}`}
                  >
                    <p className="font-bold text-sm">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          {status === "processing" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span>Shredding… pass {Math.ceil((progress / 100) * passes)}/{passes}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Actions */}
          {file && status !== "processing" && (
            <div className="flex flex-col gap-3">
              {status !== "done" && (
                <Button
                  className="w-full h-12 rounded-xl font-bold gap-2 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                  onClick={handleShred}
                  disabled={!accepted}
                >
                  <Trash2 className="w-4 h-4" />
                  {accepted ? `Shred File (${passes} ${passes === 1 ? "pass" : "passes"})` : "Accept disclaimer first"}
                </Button>
              )}
              {status === "done" && resultBlob && (
                <Button
                  className="w-full h-12 rounded-xl font-bold gap-2"
                  onClick={handleDownload}
                >
                  <Download className="w-4 h-4" />
                  Download Shredded File
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
