"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Languages, 
  RefreshCw, 
  Trash2, 
  Loader2, 
  Sparkles, 
  Zap, 
  Copy, 
  Check, 
  Volume2, 
  RotateCcw,
  Maximize2,
  FileText,
  FileDigit,
  Code,
  Table as TableIcon,
  Download,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropZone } from "@/components/shared/DropZone";
import { cn } from "@/lib/utils";

import { AdUnit } from "@/components/shared/AdUnit";

interface OCREditorProps {
  t: any;
  files: File[];
  onDrop: (files: File[]) => void;
  onClear: () => void;
  status: "idle" | "loading" | "processing" | "done";
  progress: number;
  language: string;
  setLanguage: (lang: string) => void;
  LANGUAGES: { code: string; name: string }[];
  runOCR: () => void;
  result: string;
  setResult: (val: string) => void;
  preview: string | null;
  copied: boolean;
  handleCopy: () => void;
  handleSpeak: () => void;
  isSpeaking: boolean;
  downloadFile: (format: 'txt' | 'docx' | 'json' | 'csv') => void;
  detectedLang?: string;
  currentFileIndex: number;
}

export function OCREditor({
  t,
  files,
  onDrop,
  onClear,
  status,
  progress,
  language,
  setLanguage,
  LANGUAGES,
  runOCR,
  result,
  setResult,
  preview,
  copied,
  handleCopy,
  handleSpeak,
  isSpeaking,
  downloadFile,
  detectedLang,
  currentFileIndex
}: OCREditorProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left Column: Image Source & Config */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest">{t("workspace.config")}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t("workspace.configDesc")}</p>
            </div>
          </div>
          {files.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClear} 
              className="rounded-xl text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-all active:scale-95 gap-2"
            >
              <Trash2 className="w-4 h-4" /> {t("workspace.clear")}
            </Button>
          )}
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/10 to-primary/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative glass-card rounded-[2rem] border-border/40 overflow-hidden">
            <AnimatePresence mode="wait">
              {files.length === 0 ? (
                <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <DropZone
                    onFilesDrop={onDrop}
                    title={t("dropzone.title")}
                    description={t("dropzone.description")}
                    className="h-[400px] border-none bg-transparent"
                  />
                </motion.div>
              ) : (
                <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative h-[400px] group/preview">
                  {preview ? (
                    <img src={preview} className="w-full h-full object-contain p-6" alt="Source" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Generating Preview...</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Button 
                      variant="secondary" 
                      className="rounded-xl gap-2 font-bold uppercase text-[10px] bg-white/90 hover:bg-white text-black shadow-2xl transition-all active:scale-95" 
                      onClick={onClear}
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> {t("workspace.changeFile")}
                    </Button>
                  </div>
                  
                  {status === "processing" && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
                      <div className="w-20 h-20 relative">
                        <svg className="w-full h-full rotate-[-90deg]">
                          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
                          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="226.2" strokeDashoffset={226.2 - (226.2 * progress) / 100} className="text-primary transition-all duration-500" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white tabular-nums">{progress}%</div>
                      </div>
                      <div className="text-center space-y-2">
                         <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 animate-pulse">{t("workspace.extracting")}</p>
                         <p className="text-[8px] font-bold uppercase tracking-wider text-primary">{files[currentFileIndex]?.name}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t("workspace.language")}</Label>
            <Select value={language} onValueChange={(val) => { if (val) setLanguage(val); }}>
              <SelectTrigger className="h-14 bg-secondary/20 border-border/40 rounded-2xl font-bold uppercase tracking-wider text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl bg-card/95 backdrop-blur-xl border-border">
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.code} value={lang.code} className="font-bold uppercase tracking-wider text-[10px]">
                    {t(lang.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button
              onClick={runOCR}
              disabled={files.length === 0 || status === "loading" || status === "processing"}
              className={cn(
                "w-full h-14 rounded-2xl font-bold text-xs uppercase tracking-[0.1em] gap-3 group/btn transition-all active:scale-[0.98]",
                "bg-gradient-to-r from-primary via-blue-600 to-indigo-600 hover:from-primary/90 hover:via-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-primary/30"
              )}
            >
              {(status === "loading" || status === "processing") ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5 group-hover/btn:scale-125 group-hover/btn:rotate-12 transition-all" />
                  {t("workspace.run")}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="pt-6">
          <></>
        </div>
      </div>

      {/* Right Column: Result Output */}
      <div className="space-y-8 flex flex-col">
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest">{t("workspace.result")}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {status === "done" ? t("workspace.extractionComplete") : t("workspace.awaitingExtraction")}
              </p>
            </div>
          </div>
          {result && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleSpeak} className={cn("rounded-xl transition-colors", isSpeaking ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary")}>
                <Volume2 className={cn("w-4 h-4", isSpeaking && "animate-pulse")} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setResult("")} className="rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="relative group flex-grow">
          <div className={cn(
            "absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-primary/10 to-emerald-500/20 rounded-[2rem] blur-xl opacity-0 transition-opacity duration-700",
            status === "done" && "opacity-100"
          )} />
          <div className="relative h-full flex flex-col">
            <Textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder={t("workspace.placeholder")}
              className="flex-grow min-h-[400px] bg-secondary/10 border-border/40 rounded-[2rem] p-10 font-mono text-sm leading-relaxed resize-none focus:border-primary/50 transition-all custom-scrollbar"
            />
            
            {result && (
              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <Button 
                  size="sm" 
                  className={cn(
                    "rounded-xl font-bold uppercase text-[10px] gap-2 shadow-2xl transition-all active:scale-95",
                    copied 
                      ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                      : "bg-gradient-to-r from-primary to-blue-600 text-white hover:from-primary/90 hover:to-blue-500"
                  )} 
                  onClick={handleCopy}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t("workspace.copied") : t("workspace.copy")}
                </Button>
              </div>
            )}
            
            {detectedLang && (
              <div className="absolute bottom-6 left-6">
                <Badge variant="outline" className="rounded-xl bg-primary/5 border-primary/20 text-[8px] font-bold uppercase tracking-wider px-3 py-1.5">
                   Engine Detection: {detectedLang}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className={cn(
          "grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 delay-300",
          result ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}>
          {[
            { id: 'txt', l: 'Text', i: FileText, c: 'text-blue-500', bg: 'hover:bg-blue-500/5', bc: 'hover:border-blue-500/50' },
            { id: 'docx', l: 'Word', i: FileDigit, c: 'text-indigo-500', bg: 'hover:bg-indigo-500/5', bc: 'hover:border-indigo-500/50' },
            { id: 'json', l: 'JSON', i: Code, c: 'text-emerald-500', bg: 'hover:bg-emerald-500/5', bc: 'hover:border-emerald-500/50' },
            { id: 'csv', l: 'CSV', i: TableIcon, c: 'text-amber-500', bg: 'hover:bg-amber-500/5', bc: 'hover:border-amber-500/50' }
          ].map(fmt => (
            <Button
              key={fmt.id}
              variant="outline"
              onClick={() => downloadFile(fmt.id as any)}
              className={cn(
                "h-14 rounded-2xl border-border/40 transition-all active:scale-95 group/dl flex items-center px-4",
                fmt.bg, fmt.bc
              )}
            >
              <fmt.i className={cn("w-4 h-4 mr-3 transition-colors", fmt.c)} />
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest">{fmt.l}</span>
                <span className="text-[7px] text-muted-foreground/60 uppercase">{fmt.id.toUpperCase()}</span>
              </div>
              <Download className={cn("w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all", fmt.c)} />
            </Button>
          ))}
        </div>

        <div className="pt-10 mt-auto">
          <></>
        </div>
      </div>
    </div>
  );
}
