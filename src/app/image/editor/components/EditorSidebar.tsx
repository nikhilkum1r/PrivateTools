"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Settings2, Scissors, Palette, Zap, ShieldOff, 
  ChevronLeft, Undo2, RotateCw, FlipHorizontal, 
  FlipVertical, Search, CheckCircle2, Maximize,
  Loader2, ScanText, Info, MousePointer2, Trash2, X,
  ChevronDown, Sparkles, ShieldCheck, Save
} from "lucide-react";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useImageStore, ImageSettings, ImageFile } from "@/store/useImageStore";
import { cn } from "@/lib/utils";

const CATEGORIZED_FORMATS = {
  "Regular Use": ["webp", "jpeg", "png", "pdf", "svg", "heic"],
  "Web Standard": ["webp", "jpeg", "jpg", "png", "gif", "svg", "ico", "cur", "bmp", "apng", "jfif", "pjpeg", "pjp"],
  "Modern & Next-Gen": ["avif", "heic", "heif", "jxl", "flif", "apng", "mng"],
  "Professional Print": ["pdf", "tiff", "tif", "eps", "ai", "psd", "psb", "indd", "indt"]
};

interface EditorSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentFile: ImageFile | null;
  settings: ImageSettings;
  pushSettings: (settings: Partial<ImageSettings>) => void;
  updateSettings: (settings: Partial<ImageSettings>) => void;
  handleOCR: (file: File) => void;
  extractColors: (file: File) => void;
  setMetadataFile: (file: ImageFile) => void;
  isOcrLoading: boolean;
  isProcessing: boolean;
  imageRef: React.RefObject<HTMLImageElement | null>;
  handleDownloadAll: () => void;
  handleProcess: () => void;
  handleProcessAll: () => void;
  files: ImageFile[];
  clearFiles: () => void;
}

export function EditorSidebar({
  activeTab,
  setActiveTab,
  currentFile,
  settings,
  pushSettings,
  updateSettings,
  handleOCR,
  extractColors,
  setMetadataFile,
  isOcrLoading,
  isProcessing,
  imageRef,
  handleDownloadAll,
  handleProcess,
  handleProcessAll,
  files,
  clearFiles
}: EditorSidebarProps) {
  const { updateFileCrop, updateFileBlurs } = useImageStore();

  return (
    <>
      <div className="px-4 py-3 border-b border-border bg-black/20">
        <TabsList className="bg-secondary/40 border border-white/5 rounded-[1.25rem] w-full p-1.5 h-16 flex gap-1 shadow-inner backdrop-blur-2xl">
          {[
            { v: "format", i: Settings2, l: "Core" },
            { v: "crop", i: Scissors, l: "Crop" },
            { v: "privacy", i: ShieldOff, l: "Shield", activeColor: "bg-emerald-500" },
            { v: "filters", i: Palette, l: "Filters" },
            { v: "ai", i: Zap, l: "Lab" }
          ].map((tab) => {
            const Icon = tab.i;
            return (
              <TabsTrigger 
                key={tab.v}
                value={tab.v} 
                className={cn(
                  "flex-grow flex flex-col items-center justify-center gap-1.5 rounded-2xl transition-all duration-500",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-2xl data-[state=active]:shadow-primary/20",
                  tab.activeColor && `data-[state=active]:${tab.activeColor} data-[state=active]:shadow-${tab.activeColor.split('-')[1]}-500/20`
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[7px] font-black uppercase tracking-widest">{tab.l}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      <ScrollArea className="flex-grow min-h-0">
        <div className="p-8 space-y-5 pb-8">
          <TabsContent value="format" className="m-0 focus-visible:outline-none">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
            <div className="space-y-4">
              <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Target Format</Label>
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full h-14 rounded-2xl bg-secondary/30 border border-border px-4 hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden shadow-2xl relative flex items-center focus-visible:outline-none">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col items-start text-left flex-grow">
                      <span className="text-[8px] opacity-30 tracking-[0.3em] uppercase font-black">Active Pipeline</span>
                      <span className="text-sm font-black uppercase tracking-widest">{settings.format || "Select Format"}</span>
                    </div>
                    <ChevronDown className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[300px] p-0 bg-card border-border rounded-2xl shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] overflow-hidden backdrop-blur-3xl" align="start">
                  <div className="p-4 border-b border-border bg-secondary/30">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="Filter Formats..." 
                        className="h-12 pl-12 bg-muted/40 border-border rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-primary/50 transition-all shadow-inner"
                        onChange={(e) => {
                          const search = e.target.value.toLowerCase();
                          const items = document.querySelectorAll('.format-item');
                          items.forEach((item: any) => {
                            const val = item.getAttribute('data-value') || '';
                            item.style.display = val.includes(search) ? 'flex' : 'none';
                          });
                        }}
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-[360px]">
                    <div className="p-4 space-y-4">
                      {Object.entries(CATEGORIZED_FORMATS).map(([cat, fmts]) => (
                        <div key={cat} className="space-y-4">
                          <div className="flex items-center gap-3 px-2">
                            <div className="h-[1px] flex-grow bg-secondary/50" />
                            <p className="text-[9px] uppercase font-black tracking-[0.3em] text-primary/60">{cat}</p>
                            <div className="h-[1px] flex-grow bg-secondary/50" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {fmts.map(f => (
                              <button
                                key={f}
                                data-value={f.toLowerCase()}
                                className={cn(
                                  "format-item flex items-center justify-between px-3 py-2 rounded-lg border transition-all active:scale-95 group",
                                  settings.format === f 
                                    ? "bg-primary border-primary shadow-lg shadow-primary/20 text-primary-foreground" 
                                    : "bg-secondary/30 border-border text-muted-foreground/70 hover:bg-secondary/50 hover:border-primary/30 hover:text-foreground"
                                )}
                                onClick={() => pushSettings({ format: f as any })}
                              >
                                <span className="text-[10px] font-black tracking-widest uppercase">{f}</span>
                                {settings.format === f && <CheckCircle2 className="w-4 h-4" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Render Quality</Label>
                  <span className="text-xs font-mono text-primary font-black">{settings.quality}%</span>
                </div>
                <Slider 
                  value={[settings.quality]} 
                  max={100} 
                  step={1} 
                  onValueChange={(v) => updateSettings({ quality: Array.isArray(v) ? v[0] : v })}
                  onValueCommitted={(v) => pushSettings({ quality: Array.isArray(v) ? v[0] : v })}
                  className="py-2"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Target File Size (KB)</Label>
                  <span className="text-[10px] font-mono text-muted-foreground opacity-40 uppercase tracking-widest">{settings.targetSize ? "Forced" : "Unlimited"}</span>
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    placeholder="Unlimited" 
                    className="bg-secondary/50 border-border rounded-2xl h-12 pl-12 focus:border-primary/50 transition-all shadow-inner font-mono"
                    value={settings.targetSize || ""}
                    onChange={(e) => updateSettings({ targetSize: parseInt(e.target.value) || undefined })}
                  />
                  <Maximize className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Geometry Core</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" size="icon" className="rounded-2xl h-12 w-full border-border bg-secondary/50 hover:bg-primary/10 hover:border-primary/30 transition-all" onClick={() => pushSettings({ rotate: (settings.rotate + 90) % 360 })}>
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className={cn("rounded-2xl h-12 w-full border-border bg-secondary/50 transition-all", settings.flipX && "bg-primary border-primary text-primary-foreground")} onClick={() => pushSettings({ flipX: !settings.flipX })}>
                  <FlipHorizontal className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className={cn("rounded-2xl h-12 w-full border-border bg-secondary/50 transition-all", settings.flipY && "bg-primary border-primary text-primary-foreground")} onClick={() => pushSettings({ flipY: !settings.flipY })}>
                  <FlipVertical className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-2xl h-12 w-full border-border bg-secondary/50 hover:bg-primary/10 hover:border-primary/30 transition-all"
                  onClick={() => setActiveTab("crop")}
                >
                  <Scissors className="w-4 h-4" />
                </Button>
              </div>
            </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="crop" className="m-0 focus-visible:outline-none">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
            <div className="p-6 rounded-2xl bg-secondary/30 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Boundary Definition</Label>
                  <p className="text-[8px] font-bold text-primary uppercase tracking-[0.2em]">Manual Offset Matrix</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-secondary/50"
                    onClick={() => setActiveTab("format")}
                  >
                    <ChevronLeft className="w-4 h-4 opacity-40 hover:opacity-100" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-secondary/50"
                    onClick={() => {
                      if (currentFile && imageRef.current) {
                        updateFileCrop(currentFile.id, { 
                          x: 0, 
                          y: 0, 
                          width: imageRef.current.naturalWidth, 
                          height: imageRef.current.naturalHeight 
                        });
                      }
                    }}
                  >
                    <Undo2 className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                  </Button>
                  <Scissors className="w-5 h-5 text-primary opacity-40" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary" /> X-Origin
                  </Label>
                  <Input 
                    type="number" 
                    value={currentFile?.crop?.x || 0} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      updateFileCrop(currentFile!.id, { x: val });
                    }}
                    className="h-12 rounded-xl bg-secondary/50 border-border font-black text-xs" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary" /> Y-Origin
                  </Label>
                  <Input 
                    type="number" 
                    value={currentFile?.crop?.y || 0} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      updateFileCrop(currentFile!.id, { y: val });
                    }}
                    className="h-12 rounded-xl bg-secondary/50 border-border font-black text-xs" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-500" /> Resolution Width
                  </Label>
                  <Input 
                    type="number" 
                    placeholder="Width"
                    value={currentFile?.crop?.width || ""} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      updateFileCrop(currentFile!.id, { width: val });
                    }}
                    className="h-12 rounded-xl bg-secondary/50 border-border font-black text-xs" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-blue-500" /> Resolution Height
                  </Label>
                  <Input 
                    type="number" 
                    placeholder="Height"
                    value={currentFile?.crop?.height || ""} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      updateFileCrop(currentFile!.id, { height: val });
                    }}
                    className="h-12 rounded-xl bg-secondary/50 border-border font-black text-xs" 
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest leading-relaxed">
                  Leave Width/Height empty to maintain native resolution from the origin points.
                </p>
              </div>
            </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="privacy" className="m-0 focus-visible:outline-none">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <div className="p-8 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <ShieldOff className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-black uppercase tracking-widest text-foreground">Privacy Shield</h4>
                    <p className="text-[8px] font-black text-emerald-500/60 uppercase tracking-widest">Dynamic Sensitive Data Masking</p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground/60 leading-relaxed font-medium italic">
                  Draw boxes over faces, license plates, or documents to apply secure, client-side blurring.
                </p>
                <div className="flex flex-col gap-3">
                   <Button 
                     variant="outline" 
                     className={cn(
                       "w-full h-10 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all",
                       activeTab === "privacy" ? "bg-emerald-500 text-primary-foreground border-emerald-500" : "bg-muted/20 border-border hover:bg-emerald-500/10"
                     )}
                     onClick={() => setActiveTab("privacy")}
                   >
                     <MousePointer2 className="w-4 h-4 mr-2" /> Start Masking
                   </Button>
                   <Button 
                     variant="outline" 
                     className="w-full h-12 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all disabled:opacity-20"
                     onClick={() => currentFile && updateFileBlurs(currentFile.id, [])}
                     disabled={!currentFile?.blurs?.length}
                   >
                     <Trash2 className="w-4 h-4 mr-2" /> Clear All Masks
                   </Button>
                </div>
              </div>

              {currentFile?.blurs && currentFile.blurs.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Active Masks ({currentFile.blurs.length})</Label>
                  <div className="space-y-2">
                    {currentFile.blurs.map((blur, idx) => (
                      <div key={blur.id} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center text-[10px] font-black text-muted-foreground/60">
                            #{idx + 1}
                          </div>
                          <span className="text-[10px] font-black text-muted-foreground/80 uppercase tracking-tighter">Mask Region {Math.round(blur.width)}x{Math.round(blur.height)}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
                          onClick={() => updateFileBlurs(currentFile!.id, currentFile!.blurs?.filter(b => b.id !== blur.id) || [])}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="filters" className="m-0 focus-visible:outline-none">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
            <div className="space-y-4">
              <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Chromatic Engine</Label>
              <div className="grid grid-cols-2 gap-3">
                {["none", "grayscale", "sepia", "invert", "vivid"].map((f) => (
                  <Button 
                    key={f} 
                    variant={settings.filter === f ? "default" : "outline"} 
                    size="sm" 
                    className={cn(
                      "rounded-xl h-12 uppercase font-black text-[10px] tracking-widest transition-all",
                      settings.filter === f ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-border bg-secondary/30 hover:bg-secondary/50"
                    )}
                    onClick={() => updateSettings({ filter: f as any })}
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Luminance", key: "brightness" },
                { label: "Contrast Range", key: "contrast" },
                { label: "Saturation Map", key: "saturation" },
              ].map((adj) => (
                <div key={adj.key} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[9px] uppercase font-black tracking-[0.2em] opacity-40">{adj.label}</Label>
                    <span className="text-xs font-mono text-primary font-black">{(settings as any)[adj.key]}%</span>
                  </div>
                  <Slider 
                    value={[(settings as any)[adj.key]]} 
                    min={0} max={200} step={1} 
                    onValueChange={(v) => updateSettings({ [adj.key]: Array.isArray(v) ? v[0] : v })}
                    onValueCommitted={(v) => pushSettings({ [adj.key]: Array.isArray(v) ? v[0] : v })}
                    className="py-2"
                  />
                </div>
              ))}
            </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="ai" className="m-0 focus-visible:outline-none">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
            <div className="relative group overflow-hidden rounded-[2.5rem] p-[1px] bg-gradient-to-br from-primary/30 via-white/5 to-blue-500/30">
              <div className="absolute inset-0 bg-card rounded-[calc(2.5rem-1px)]" />
              <div className="relative p-7 space-y-6 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/5 rounded-[calc(2.5rem-1px)] backdrop-blur-3xl">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">WASM Neural Lab</h4>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest">Proprietary Architecture</p>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground/60 leading-relaxed font-medium relative z-10 italic">
                  Secure, client-side intelligence for document analysis and design extraction.
                </p>
                
                <div className="space-y-3 pt-2 relative z-10">
                  <Button variant="outline" className="w-full h-12 rounded-[1.25rem] bg-secondary/30 border-border text-[10px] font-black uppercase tracking-widest group hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all shadow-xl" onClick={() => currentFile && handleOCR(currentFile.file)}>
                    {isOcrLoading ? <Loader2 className="w-4 h-4 mr-3 animate-spin" /> : <ScanText className="w-4 h-4 mr-3 group-hover:scale-125 transition-transform" />} Extract Text (OCR)
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-[1.25rem] bg-secondary/30 border-border text-[10px] font-black uppercase tracking-widest group hover:bg-blue-600 hover:border-blue-600 hover:text-primary-foreground transition-all shadow-xl" onClick={() => currentFile && extractColors(currentFile.file)}>
                    <Palette className="w-4 h-4 mr-3 group-hover:scale-125 transition-transform" /> Design Palette
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-[1.25rem] bg-secondary/30 border-border text-[10px] font-black uppercase tracking-widest group hover:bg-emerald-600 hover:border-emerald-600 hover:text-primary-foreground transition-all shadow-xl" onClick={() => currentFile && setMetadataFile(currentFile)}>
                    <Info className="w-4 h-4 mr-3 group-hover:scale-125 transition-transform" /> Deep Metadata Inspector
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-border space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Signature Matrix</Label>
                  <p className="text-[8px] font-bold text-primary uppercase tracking-[0.2em]">Ownership Protection</p>
                </div>
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary text-[8px] font-black uppercase tracking-widest">Active Guard</Badge>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <Input 
                    placeholder="Enter Watermark Text..." 
                    className="bg-secondary/50 border-border rounded-2xl h-12 pl-12 focus:border-primary/50 transition-all shadow-inner font-bold text-xs" 
                    value={settings.watermarkText || ""}
                    onChange={(e) => updateSettings({ watermarkText: e.target.value })}
                  />
                  <ShieldCheck className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-3">
                     <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Color Hex</Label>
                     <Input 
                       type="color" 
                       className="h-12 w-full p-1 bg-secondary/50 border-border rounded-xl"
                       value={settings.watermarkColor}
                       onChange={(e) => updateSettings({ watermarkColor: e.target.value })}
                     />
                   </div>
                   <div className="space-y-3">
                     <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Font Size ({settings.watermarkSize}px)</Label>
                     <Slider 
                       value={[settings.watermarkSize]} 
                       min={10} max={200} step={1}
                       onValueChange={(v) => updateSettings({ watermarkSize: Array.isArray(v) ? v[0] : v })}
                       className="py-4"
                     />
                   </div>
                </div>
              </div>
            </div>
            </motion.div>
          </TabsContent>
        </div>
      </ScrollArea>
      
      <div className="p-8 border-t border-border bg-card space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="rounded-[1.25rem] text-[9px] font-black uppercase h-12 border-border bg-secondary/50 hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-all" onClick={clearFiles}>
            Flush Memory
          </Button>
          <Button variant="outline" className="rounded-[1.25rem] text-[9px] font-black uppercase h-12 border-border bg-secondary/50 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all" onClick={handleDownloadAll}>
            Zip Export
          </Button>
        </div>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black h-12 gap-3 shadow-2xl shadow-primary/30 group active:scale-95 transition-all text-xs uppercase tracking-widest italic"
          onClick={handleProcess}
          disabled={isProcessing || !currentFile}
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          Render Studio Asset
        </Button>

        {files.length > 1 && (
          <Button 
            variant="ghost"
            className="w-full text-muted-foreground/60 hover:text-foreground rounded-xl font-black h-12 gap-3 text-[9px] uppercase tracking-[0.3em] active:scale-95 transition-all"
            onClick={handleProcessAll}
            disabled={isProcessing}
          >
            <Zap className="w-4 h-4" /> Neural Batch Render ({files.length} Assets)
          </Button>
        )}
      </div>
    </>
  );
}
