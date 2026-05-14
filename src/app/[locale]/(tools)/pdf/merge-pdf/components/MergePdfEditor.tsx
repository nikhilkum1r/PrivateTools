"use client";

import React from "react";
import { motion, Reorder } from "framer-motion";
import { 
  Settings2, FileText, ImageIcon, Trash2, GripVertical, 
  Plus, Loader2, Layers 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ExportPanel } from "@/components/shared/ExportPanel";

import { AdUnit } from "@/components/shared/AdUnit";

interface PDFFile {
  id: string;
  file: File;
  status: "idle" | "processing" | "completed" | "error";
  previewUrl?: string;
  pageCount?: number;
}

interface MergePdfEditorProps {
  t: any;
  files: PDFFile[];
  setFiles: (f: PDFFile[] | ((prev: PDFFile[]) => PDFFile[])) => void;
  isProcessing: boolean;
  mergedUrl: string | null;
  mergedBlob: Blob | null;
  progress: number;
  progressLabel: string;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  processDocuments: () => void;
  handleReset: () => void;
  totalSize: number;
}

export function MergePdfEditor({
  t, files, setFiles, isProcessing, mergedUrl, mergedBlob,
  progress, progressLabel, addFiles, removeFile, processDocuments,
  handleReset, totalSize
}: MergePdfEditorProps) {

  return (
    <section className="container mx-auto px-4 pb-16 max-w-4xl">
      <div className="glass-card rounded-3xl border border-border shadow-2xl bg-secondary/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-black/20 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-500 flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> {t("studio.title")}
          </h3>
          <Badge variant="outline" className="text-[9px] font-semibold uppercase tracking-wider border-blue-500/30 text-blue-400 bg-blue-500/10">
            {t("studio.badge")}
          </Badge>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {files.length === 0 ? (
            <div className="space-y-6">
              <div className="ad-wrapper">
                <AdUnit type="banner" className="my-0 mb-6" />
              </div>
              <DropZone 
                onFilesDrop={addFiles} 
                accept=".pdf"
                multiple={true} 
                className="h-64 border-dashed border-blue-500/30 hover:border-blue-500/60 bg-black/20 rounded-3xl transition-colors"
              />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              
              {/* File List & Reordering */}
              {!mergedUrl && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-muted-foreground">{t("studio.reorder_desc")}</p>
                    <Button variant="outline" size="sm" className="border-border hover:bg-secondary/50 text-foreground" onClick={() => document.getElementById('pdf-add-btn')?.click()}>
                      <Plus className="w-4 h-4 mr-2" /> {t("studio.add_more")}
                      <input id="pdf-add-btn" type="file" className="hidden" multiple accept=".pdf" onChange={e => addFiles(Array.from(e.target.files || []))} />
                    </Button>
                  </div>

                  <div className="bg-black/30 rounded-3xl border border-border p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                    <Reorder.Group axis="y" values={files} onReorder={setFiles} className="space-y-2">
                      {files.map((f, i) => (
                        <Reorder.Item key={f.id} value={f}>
                          <div className="group p-3 rounded-2xl glass-card bg-secondary/30 border border-border flex items-center gap-4 transition-all hover:bg-secondary/50">
                            <div className="text-muted-foreground cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100 shrink-0">
                              <GripVertical className="w-5 h-5" />
                            </div>
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                              f.file.type === "application/pdf" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            )}>
                              {f.file.type === "application/pdf" ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                            </div>
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-bold truncate text-foreground">{f.file.name}</p>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {f.pageCount ? t("studio.pages", { count: f.pageCount }) : t("studio.image")} • {((f.file.size) / 1024).toFixed(0)} KB
                              </p>
                            </div>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 shrink-0" onClick={() => removeFile(f.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </div>
                </div>
              )}

              {/* Progress & Actions */}
              {!mergedUrl && (
                <div className="space-y-4">
                  {isProcessing && (
                    <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">{progressLabel}</p>
                        <span className="text-[10px] font-bold tabular-nums text-blue-400">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2 bg-blue-950 [&>div]:bg-blue-500" />
                    </div>
                  )}

                  <button
                    className="w-full h-14 rounded-2xl font-bold text-lg gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-foreground shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    onClick={processDocuments}
                    disabled={isProcessing || files.length < 2}
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Layers className="w-5 h-5" />}
                    {isProcessing ? t("studio.merging_button") : files.length < 2 ? t("studio.add_more_button") : t("studio.merge_button")}
                  </button>

                  {/* Contextual Ad below merge button */}
                  <div className="pt-4">
                    <AdUnit type="content" className="my-0" />
                  </div>
                </div>
              )}

              {/* Result Panel */}
              {mergedUrl && mergedBlob && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <ExportPanel
                    blob={mergedBlob}
                    filename="SafeTools_Merged.pdf"
                    inputSize={totalSize}
                    onReset={handleReset}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
