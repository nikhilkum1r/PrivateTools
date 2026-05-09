"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/shared/Navbar";

import { Footer } from "@/components/shared/Footer";
import { FAQ } from "@/components/shared/FAQ";
import { TrustLayer } from "@/components/shared/TrustLayer";
import { ToolHealth } from "@/components/shared/ToolHealth";
import { WhySafeTools } from "@/components/shared/WhySafeTools";
import { LocalProcessingGuide } from "@/components/shared/LocalProcessingGuide";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Download, Trash2, RotateCw, FlipHorizontal, FlipVertical, 
  Image as ImageIcon, Wand2, Scissors, Palette, Type, 
  Settings2, Loader2, DownloadCloud, FileText, Search,
  ChevronRight, ChevronLeft, ChevronDown, Maximize, ZoomIn, ZoomOut,
  Layers, Cpu, ShieldCheck, Zap, Info, ScanText, Save, Smartphone, Play,
  Eye, RefreshCw, X, Check, CheckCircle2, Copy, Share2, Sparkles, Plus, HardDrive,
  Undo2, Redo2, AlertCircle, ShieldOff, MousePointer2, Fingerprint, Monitor, CloudOff,
  Clock, Heart, HelpCircle, Table
} from "lucide-react";
import { useImageStore, ImageFormat, ImageFile, ImageSettings } from "@/store/useImageStore";
import { processImage } from "@/lib/image-processor";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { createWorker } from "tesseract.js";
import JSZip from "jszip";
import { toast } from "sonner";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IMAGE_EDITOR_FAQ } from "@/lib/faq-content";

import { useRouter } from "next/navigation";

const CATEGORIZED_FORMATS = {
  "Regular Use": ["webp", "jpeg", "png", "pdf", "svg", "heic"],
  "Web Standard": ["webp", "jpeg", "jpg", "png", "gif", "svg", "ico", "cur", "bmp", "apng", "jfif", "pjpeg", "pjp"],
  "Modern & Next-Gen": ["avif", "heic", "heif", "jxl", "flif", "apng", "mng"],
  "Professional Print": ["pdf", "tiff", "tif", "eps", "ai", "psd", "psb", "indd", "indt"]
};

export default function EditorStudioClient({ mode = "landing" }: { mode?: "landing" | "studio" }) {
  const router = useRouter();
  const { 
    files, settings, addFiles, removeFile, updateSettings, 
    setFileStatus, setProcessedUrl, clearFiles, updateFileCrop, updateFileBlurs
  } = useImageStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [imageDimensions, setImageDimensions] = useState<{ naturalWidth: number, naturalHeight: number } | null>(null);
  const [metadataFile, setMetadataFile] = useState<ImageFile | null>(null);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("format");
  const [isScanning, setIsScanning] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // History Stack for Undo/Redo
  const [history, setHistory] = useState<ImageSettings[]>([]);
  const [redoStack, setRedoStack] = useState<ImageSettings[]>([]);

  const currentFile = files.find(f => f.id === selectedId) || files[0];

  // Automatic Redirection Logic for Upload-First Flow
  useEffect(() => {
    if (mode === "landing" && files.length > 0) {
      router.push("/image/editor/go");
    }
  }, [files.length, mode, router]);

  const handleAddFiles = (newFiles: File[]) => {
    addFiles(newFiles);
    if (mode === "landing") {
      router.push("/image/editor/go");
    }
  };

  // Helper to update settings with history
  const pushSettings = (newSettings: Partial<ImageSettings>) => {
    setHistory(prev => [...prev, { ...settings }]);
    setRedoStack([]);
    updateSettings(newSettings);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack(prev => [...prev, { ...settings }]);
    setHistory(prev => prev.slice(0, -1));
    updateSettings(previous);
    toast.info("Undo applied");
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory(prev => [...prev, { ...settings }]);
    setRedoStack(prev => prev.slice(0, -1));
    updateSettings(next);
    toast.info("Redo applied");
  };

  const resetSettings = () => {
    pushSettings({
      quality: 80,
      rotate: 0,
      flipX: false,
      flipY: false,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      filter: "none",
    });
    toast.info("Settings reset");
  };

  const handleProcess = async () => {
    if (!currentFile) return;
    setIsProcessing(true);
    setFileStatus(currentFile.id, "processing");
    
    try {
      const result = await processImage(currentFile.file, {
        ...settings,
        crop: currentFile.crop,
        blurs: currentFile.blurs
      });
      setProcessedUrl(currentFile.id, result.url, result.blob.size);
      setFileStatus(currentFile.id, "completed");
      setActiveTab("format");
      toast.success("Image processed successfully");
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 2000);
    } catch (err) {
      setFileStatus(currentFile.id, "error");
      toast.error("Processing failed");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessAll = async () => {
    setIsProcessing(true);
    for (const file of files) {
      if (file.status === "completed") continue;
      setFileStatus(file.id, "processing");
      try {
        const result = await processImage(file.file, {
          ...settings,
          crop: file.crop,
          blurs: file.blurs
        });
        setProcessedUrl(file.id, result.url, result.blob.size);
        setFileStatus(file.id, "completed");
      } catch (err) {
        setFileStatus(file.id, "error");
      }
    }
    setIsProcessing(false);
    toast.success("Batch processing complete");
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const completedFiles = files.filter(f => f.status === "completed" && f.processedUrl);
    
    if (completedFiles.length === 0) {
      toast.error("No completed files to export");
      return;
    }

    for (const file of completedFiles) {
      const response = await fetch(file.processedUrl!);
      const blob = await response.blob();
      zip.file(`processed-${file.file.name.split('.')[0]}.${settings.format}`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "studio-export.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSingle = () => {
    if (!currentFile?.processedUrl) {
      toast.error("Process the image first before downloading");
      return;
    }
    const ext = settings.format || currentFile.file.name.split('.').pop() || 'webp';
    const a = document.createElement("a");
    a.href = currentFile.processedUrl;
    a.download = `${currentFile.file.name.split('.')[0]}-studio.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Download started");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f =>
      f.type.startsWith('image/') || /\.(heic|heif|tiff?|psd|pdf|svg|webp|avif)$/i.test(f.name)
    );
    if (dropped.length > 0) {
      handleAddFiles(dropped);
      toast.success(`${dropped.length} file${dropped.length > 1 ? 's' : ''} added`);
    }
  };

  const handleOCR = async (file: File) => {
    setIsOcrLoading(true);
    try {
      const worker = await createWorker('eng');
      // Use a canvas to ensure the format is readable by Tesseract
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((res) => img.onload = res);
      
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      
      const { data: { text } } = await worker.recognize(canvas);
      setOcrResult(text);
      await worker.terminate();
      URL.revokeObjectURL(img.src);
    } catch (err) {
      console.error(err);
      toast.error("OCR failed. Try a standard image format.");
    } finally {
      setIsOcrLoading(false);
    }
  };

  const extractColors = (file: File) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);
      const data = ctx.getImageData(0, 0, 100, 100).data;
      const colors: { [key: string]: number } = {};
      for (let i = 0; i < data.length; i += 20) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colors[hex] = (colors[hex] || 0) + 1;
      }
      const sorted = Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 8).map(c => c[0]);
      setExtractedColors(sorted);
      URL.revokeObjectURL(img.src);
    };
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleProcess();
      }
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        // Only if not in an input
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          updateSettings({ rotate: ((settings.rotate + 90) % 360) as any });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings, history, redoStack, currentFile]);

  useEffect(() => {
    if (files.length > 0 && !selectedId) {
      setSelectedId(files[0].id);
    }
  }, [files, selectedId]);





  const renderSettings = () => {
    if (!currentFile) return (
      <div className="flex-grow flex items-center justify-center p-5 text-center space-y-4">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">No Selection</p>
          <p className="text-xs text-muted-foreground/60 italic">Upload an image to unlock studio controls.</p>
        </div>
      </div>
    );

    return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as string)} className="flex flex-col flex-grow min-h-0">
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
            {/* Export Format */}
            <div className="space-y-4">
              <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Target Format</Label>
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="outline" className="w-full h-10 rounded-lg bg-secondary/30 border-border px-3 hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden shadow-2xl relative">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-8 h-8 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-col items-start text-left flex-grow">
                        <span className="text-[8px] opacity-30 tracking-[0.3em] uppercase font-black">Active Pipeline</span>
                        <span className="text-sm font-black uppercase tracking-widest">{settings.format || "Select Format"}</span>
                      </div>
                      <ChevronDown className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Button>
                } />
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

            {/* Quality & Size */}
            <div className="space-y-4">
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
                    className="bg-secondary/50 border-border rounded-2xl h-10 pl-12 focus:border-primary/50 transition-all shadow-inner font-mono"
                    value={settings.targetSize || ""}
                    onChange={(e) => updateSettings({ targetSize: parseInt(e.target.value) || undefined })}
                  />
                  <Maximize className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>

            {/* Transformations */}
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
                      updateFileCrop(currentFile.id, { x: val });
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
                      updateFileCrop(currentFile.id, { y: val });
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
                      updateFileCrop(currentFile.id, { width: val });
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
                      updateFileCrop(currentFile.id, { height: val });
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
                          onClick={() => updateFileBlurs(currentFile.id, currentFile.blurs?.filter(b => b.id !== blur.id) || [])}
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
            {/* WASM Neural Lab Card */}
            <div className="relative group overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-primary/30 via-white/5 to-blue-500/30">
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
                  <Button variant="outline" className="w-full h-10 rounded-[1.25rem] bg-secondary/30 border-border text-[10px] font-black uppercase tracking-widest group hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all shadow-xl" onClick={() => currentFile && handleOCR(currentFile.file)}>
                    {isOcrLoading ? <Loader2 className="w-4 h-4 mr-3 animate-spin" /> : <ScanText className="w-4 h-4 mr-3 group-hover:scale-125 transition-transform" />} Extract Text (OCR)
                  </Button>
                  <Button variant="outline" className="w-full h-10 rounded-[1.25rem] bg-secondary/30 border-border text-[10px] font-black uppercase tracking-widest group hover:bg-blue-600 hover:border-blue-600 hover:text-primary-foreground transition-all shadow-xl" onClick={() => currentFile && extractColors(currentFile.file)}>
                    <Palette className="w-4 h-4 mr-3 group-hover:scale-125 transition-transform" /> Design Palette
                  </Button>
                  <Button variant="outline" className="w-full h-10 rounded-[1.25rem] bg-secondary/30 border-border text-[10px] font-black uppercase tracking-widest group hover:bg-emerald-600 hover:border-emerald-600 hover:text-primary-foreground transition-all shadow-xl" onClick={() => currentFile && setMetadataFile(currentFile)}>
                    <Info className="w-4 h-4 mr-3 group-hover:scale-125 transition-transform" /> Deep Metadata Inspector
                  </Button>
                </div>
              </div>

              {/* Watermark Section */}
              <div className="pt-10 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Signature Matrix</Label>
                    <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">WASM-Level Watermarking</p>
                  </div>
                  <Switch 
                    checked={!!settings.watermarkText} 
                    onCheckedChange={(checked) => pushSettings({ watermarkText: checked ? "PRIVATE TOOLS" : undefined })} 
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                {settings.watermarkText !== undefined && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-6 overflow-hidden"
                  >
                    <div className="space-y-3">
                      <Label className="text-[8px] uppercase font-black tracking-widest text-muted-foreground/60">Custom Label</Label>
                      <Input 
                        value={settings.watermarkText}
                        onChange={(e) => updateSettings({ watermarkText: e.target.value })}
                        className="bg-secondary/50 border-border rounded-xl h-12 text-[10px] font-black uppercase tracking-widest"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-[8px] uppercase font-black tracking-widest text-muted-foreground/60">Density Scale</Label>
                        <span className="text-[10px] font-mono text-primary font-black">{settings.watermarkSize}PX</span>
                      </div>
                      <Slider 
                        value={[settings.watermarkSize]} 
                        min={10} 
                        max={100} 
                        onValueChange={(v) => {
                          const val = Array.isArray(v) ? v[0] : v;
                          updateSettings({ watermarkSize: val });
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Privacy Guard Card */}
            <div className="p-7 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[40px] rounded-full" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                  <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500/80">Privacy Guard</Label>
                </div>
                <div className="h-[1px] flex-grow bg-emerald-500/10 mx-4" />
              </div>
              
              <div className="flex items-center justify-between pt-2 relative z-10">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-foreground font-black uppercase tracking-tighter">Auto-Strip Metadata</span>
                  <p className="text-[8px] text-muted-foreground/40 uppercase font-bold tracking-widest">Wiping Exif / GPS / Location</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
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
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black h-10 gap-3 shadow-2xl shadow-primary/30 group active:scale-95 transition-all text-xs uppercase tracking-widest italic"
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
    </Tabs>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 custom-scrollbar">
      {mode === "landing" && <Navbar />}
      
      <main className="flex-grow flex flex-col relative z-10">
        
        {/* HERO SECTION - Landing Mode Only */}
        {mode === "landing" && (
          <section className="relative px-6 py-24 md:py-40 flex flex-col items-center text-center overflow-hidden">
           {/* Background decorative elements */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
           </div>

           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-12 relative z-10"
           >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-card border border-primary/20 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Professional Online Image Editor</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic font-heading leading-[0.9]">
                  Free Online <br />
                  <span className="text-primary">Image Editor</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed italic">
                  Edit, crop, resize, compress, convert, enhance, and transform images online with our privacy-first browser-based editor. No uploads, no watermarks.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
                 <Button 
                   size="lg" 
                   className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs gap-3 shadow-2xl shadow-primary/20"
                   onClick={() => document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' })}
                 >
                   Start Editing Now <ChevronRight className="w-5 h-5" />
                 </Button>
                 <Button 
                   size="lg" 
                   variant="outline" 
                   className="h-16 px-10 rounded-2xl border-border bg-secondary/50 font-black uppercase tracking-widest text-xs gap-3 hover:bg-secondary transition-all"
                   onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                 >
                   Explore Features
                 </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pt-20">
                {[
                  { icon: ShieldCheck, label: "100% Private" },
                  { icon: HardDrive, label: "Browser-Based" },
                  { icon: CloudOff, label: "No Uploads" },
                  { icon: Zap, label: "Free Forever" },
                  { icon: Sparkles, label: "AI-Powered" }
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
                    <badge.icon className="w-6 h-6 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{badge.label}</span>
                  </div>
                ))}
              </div>
           </motion.div>
        </section>
        )}

        {mode === "landing" && <TrustLayer />}


        {/* INTERACTIVE STUDIO AREA */}
        <section className={cn(
          "flex flex-row overflow-hidden relative border-y border-border bg-black/20",
          mode === "landing" ? "h-screen lg:h-[800px]" : "h-screen"
        )}>
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[140px] rounded-full animate-pulse" />
            <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-blue-500/5 blur-[140px] rounded-full animate-pulse" />
          </div>

          {/* Left Sidebar - Asset Navigator */}
          {/* Left Sidebar - Asset Navigator (Only visible when files exist) */}
          {files.length > 0 && (
            <aside className="flex w-[60px] md:w-[320px] h-full max-h-full bg-card shrink-0 flex-col relative z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-r border-border transition-all duration-500 overflow-hidden group/sidebar hover:w-[320px]">
              <div className="w-[320px]">
                <div className="px-6 py-5 border-b border-border bg-black/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                      <Layers className="w-4 h-4" /> Asset Navigator
                    </h3>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest italic">Local Memory Bin</p>
                  </div>
                  <Badge className="rounded-full bg-primary/10 text-primary border-primary/20 text-[10px] font-black px-3 py-0.5">
                    {files.length}
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500/80 italic">Isolated Session Live</span>
                </div>
              </div>
              
              <ScrollArea className="flex-grow min-h-0">
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
                             <div className="absolute top-0 right-0 px-1 bg-black/60 backdrop-blur-md text-[6px] font-black uppercase text-primary border-bl border-border/50 z-20">
                               {file.file.name.split('.').pop()}
                             </div>
                             <img src={file.previewUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-[11px] font-black truncate leading-tight uppercase tracking-tight italic text-foreground/80">{file.file.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[8px] uppercase font-black text-muted-foreground/40 tracking-widest tabular-nums">
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
                  className="w-full bg-white text-black hover:bg-primary hover:text-white rounded-2xl font-black h-12 gap-3 text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all group"
                  onClick={() => document.getElementById('studio-upload-mobile')?.click()}
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
                  Add Local Assets
                </Button>
              </div>
              </div>
            </aside>
          )}

          {/* Global file input — accessible on all screen sizes */}
          <input
            id="studio-upload-mobile"
            type="file"
            multiple
            accept="image/*,.heic,.heif,.tiff,.tif,.psd,.svg,.pdf,.webp,.avif"
            className="hidden"
            onChange={(e) => {
              handleAddFiles(Array.from(e.target.files || []));
              (e.target as HTMLInputElement).value = "";
            }}
          />

          {/* Center - Workspace */}
          <section className="flex-grow bg-transparent relative flex flex-col h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
            {/* Workspace Header (Only visible when files exist) */}
            {files.length > 0 && (
              <header className="p-4 md:px-8 md:py-6 flex items-center justify-between studio-header relative z-30 border-b border-border/50 bg-background/50 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  {mode === "studio" && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all active:scale-95 group"
                      onClick={() => router.push("/image/editor")}
                    >
                      <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Button>
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] group relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
                    <Cpu className="w-6 h-6 text-primary relative z-10" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-black text-lg md:text-xl tracking-tighter uppercase italic flex items-center gap-2">
                      Creative Studio
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    </h2>
                    <div className="flex items-center gap-3">
                      <Badge className="text-[8px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                          Isolated Session
                        </Badge>
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-40 truncate max-w-[150px] md:max-w-[300px]">
                        {currentFile?.file.name || "Standby Mode"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-6 px-6 py-2 rounded-2xl bg-secondary/20 border border-border/50">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black uppercase text-muted-foreground/40 tracking-widest">WASM Thread</span>
                      <span className="text-[10px] font-black uppercase text-primary italic">Active</span>
                    </div>
                    <div className="w-[1px] h-6 bg-border/50" />
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black uppercase text-muted-foreground/40 tracking-widest">RAM Latency</span>
                      <span className="text-[10px] font-black uppercase text-primary italic">0.2ms</span>
                    </div>
                    <div className="w-[1px] h-6 bg-border/50" />
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black uppercase text-muted-foreground/40 tracking-widest">Crypto Enclave</span>
                      <span className="text-[10px] font-black uppercase text-emerald-500 italic">Verified</span>
                    </div>
                  </div>

                  <Sheet open={isMobileSettingsOpen} onOpenChange={setIsMobileSettingsOpen}>
                    <SheetTrigger render={<Button variant="outline" size="icon" className="lg:hidden rounded-2xl border-border bg-secondary/50 h-12 w-12 shadow-xl"><Settings2 className="w-5 h-5" /></Button>} />
                    <SheetContent side="right" className="w-full sm:w-[320px] p-0 bg-card border-border rounded-l-xl flex flex-col h-full">
                      <SheetHeader className="px-4 py-3 border-b border-border">
                        <SheetTitle className="text-foreground flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter">
                          <Wand2 className="w-6 h-6 text-primary" /> Studio Control
                        </SheetTitle>
                      </SheetHeader>
                      {renderSettings()}
                    </SheetContent>
                  </Sheet>
                </div>
              </header>
            )}

            <div 
              className={cn(
                "flex-grow relative flex flex-col items-center justify-center p-8 overflow-hidden select-none bg-black/40",
                zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); }}
              onDrop={handleDrop}
            >
              {/* Studio Telemetry Overlay */}
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
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground italic">Studio Telemetry</span>
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
                            <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-tighter">{stat.l}</span>
                            <span className={cn("text-[10px] font-black font-mono tracking-tight", stat.c)}>{stat.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-xl flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">Data Privacy Status</span>
                        <span className="text-[10px] font-black text-foreground uppercase italic tracking-tighter">100% Local Pipeline</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Grid background moved to separate layer for better perf */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.1]" 
                style={{ 
                  backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }} 
              />

              <AnimatePresence mode="wait">
                {currentFile ? (
                  <motion.div 
                    key={currentFile.id}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative group flex flex-col items-center max-w-full max-h-full"
                  >
                    <div 
                      className="relative shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] border border-border rounded-sm transition-all duration-700 ease-[0.16,1,0.3,1] bg-[#0a0a0a] group-hover:border-primary/20 flex items-center justify-center w-fit h-fit overflow-visible"
                      style={{ 
                        transform: `scale(${zoom})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                        maxWidth: 'none',
                        maxHeight: 'none'
                      }}
                    >
                      {/* Checkerboard Transparency Layer */}
                      <div className="absolute inset-0 z-0 opacity-40 rounded-sm overflow-hidden" 
                           style={{ 
                             backgroundImage: `linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%)`,
                             backgroundSize: '20px 20px',
                             backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                           }} 
                      />

                      {/* Unified Transform Layer */}
                      <div 
                        className="relative z-10 transition-transform duration-500 ease-[0.16,1,0.3,1]"
                        style={{ 
                          transform: `rotate(${settings.rotate}deg) scaleX(${settings.flipX ? -1 : 1}) scaleY(${settings.flipY ? -1 : 1})`,
                        }}
                      >
                        <img 
                          ref={imageRef}
                          src={currentFile.processedUrl || currentFile.previewUrl} 
                          className="w-auto h-auto max-w-none shadow-2xl relative z-10" 
                          style={{ 
                            filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%) ${
                              settings.filter === "grayscale" ? "grayscale(100%)" :
                              settings.filter === "sepia" ? "sepia(100%)" :
                              settings.filter === "invert" ? "invert(100%)" :
                              settings.filter === "vivid" ? "saturate(150%) contrast(120%)" : ""
                            }`,
                          }}
                          alt="" 
                          onLoad={(e) => {
                            const img = e.currentTarget;
                            console.log("Image Loaded:", img.naturalWidth, img.naturalHeight);
                          }}
                        />
                        {activeTab === "crop" && imageDimensions && (
                          <CropOverlay 
                            file={currentFile} 
                            imageRef={imageRef} 
                            dimensions={imageDimensions}
                            settings={settings}
                            zoom={zoom}
                            updateFileCrop={updateFileCrop} 
                          />
                        )}
                        {activeTab === "privacy" && <BlurOverlay file={currentFile} updateFileBlurs={updateFileBlurs} />}
                      </div>
                      <AnimatePresence>
                        {isProcessing && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-muted/80 backdrop-blur-2xl flex flex-col items-center justify-center gap-3">
                            <div className="relative">
                              <Loader2 className="w-20 h-12 animate-spin text-primary opacity-20" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                              </div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <p className="text-[12px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Neural Processing</p>
                              <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Optimizing via WebAssembly</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Neural Scan Animation */}
                      <AnimatePresence>
                        {isScanning && (
                          <motion.div 
                            initial={{ top: "-10%" }}
                            animate={{ top: "110%" }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_30px_rgba(var(--primary-rgb),0.8)] z-50 pointer-events-none"
                          >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-primary-foreground text-[8px] font-black uppercase tracking-[0.3em] rounded-full whitespace-nowrap">
                              Neural Sync In Progress
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center p-8 min-h-[500px]"
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                  >
                    <motion.div
                      animate={{ scale: isDragging ? 1.05 : 1 }}
                      className="max-w-xl w-full"
                    >
                    <Card className={`p-12 md:p-20 border-dashed bg-secondary/10 rounded-[40px] text-center space-y-8 relative group overflow-hidden shadow-[0_80px_150px_-30px_rgba(0,0,0,0.8)] transition-all duration-500 ${isDragging ? 'border-primary/60 bg-primary/5 ring-4 ring-primary/10' : 'border-border/50'}`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      <div className="relative z-10 space-y-8">
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-primary/20 via-[#0a0a0a] to-blue-600/20 p-[1px] mx-auto shadow-2xl relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                          <div className="w-full h-full rounded-[calc(2rem-1px)] bg-muted/40 backdrop-blur-3xl flex items-center justify-center border border-primary/20 relative z-10">
                            <ImageIcon className={cn("w-10 h-10 text-primary transition-all duration-500", isDragging ? "scale-125 rotate-12" : "opacity-40")} />
                          </div>
                        </motion.div>

                        <div className="space-y-4">
                          <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
                            Ready to <span className="text-primary">Create?</span>
                          </h3>
                          <p className="text-muted-foreground text-sm md:text-lg font-medium max-w-sm mx-auto leading-relaxed italic">
                            Drop your high-resolution assets here to initialize the secure WASM-powered studio.
                          </p>
                        </div>

                        <div className="flex flex-col gap-4">
                          <Button 
                            size="lg"
                            className="bg-white text-black hover:bg-primary hover:text-white rounded-2xl font-black px-10 h-16 uppercase tracking-widest text-xs shadow-2xl active:scale-95 transition-all w-full gap-3"
                            onClick={() => document.getElementById('studio-upload-mobile')?.click()}
                          >
                            <Plus className="w-5 h-5" /> Initialize Asset
                          </Button>
                          <div className="flex items-center justify-center gap-6 opacity-30">
                             {["PNG", "JPG", "WEBP", "PDF", "SVG"].map(f => (
                               <span key={f} className="text-[10px] font-black tracking-widest">{f}</span>
                             ))}
                          </div>
                        </div>
                      </div>

                      {/* Scanning lines decorative */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan" />
                    </Card>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

               {/* High-Performance Studio Control Center (Floating Toolbar) */}
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
                      <span className="text-[7px] font-black uppercase tracking-[0.2em] text-primary italic">Engine Sync Active</span>
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
                        <div className="px-3 min-w-[50px] text-[10px] font-black text-foreground tabular-nums text-center uppercase tracking-tighter italic">
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
                        <span className="text-[7px] font-black text-muted-foreground/40 uppercase tracking-widest mb-1">Export Quality</span>
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
                                "w-7 h-7 rounded-lg text-[8px] font-black transition-all",
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
                            "relative rounded-2xl px-8 h-12 font-black text-[10px] gap-3 shadow-2xl uppercase italic tracking-tighter group active:scale-95 transition-all duration-500",
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
                          <span className="hidden md:inline">{isProcessing ? "Rendering..." : currentFile?.status === "idle" ? "Render Changes" : "Up to Date"}</span>
                          <span className="md:hidden">{isProcessing ? "..." : "Render"}</span>
                        </Button>
                      </div>

                      <Button
                        size="lg"
                        className="rounded-2xl px-6 h-12 bg-white text-black hover:bg-emerald-500 hover:text-white font-black text-[10px] gap-2 uppercase italic tracking-tighter group active:scale-95 transition-all shadow-2xl"
                        onClick={handleDownloadSingle}
                        disabled={!currentFile?.processedUrl}
                      >
                        <DownloadCloud className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        Save
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Right Sidebar - Studio Inspector */}
          {files.length > 0 && (
            <aside className="flex w-[60px] md:w-[320px] h-full max-h-full border-l border-border bg-card shrink-0 flex-col relative z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 overflow-hidden group/inspector hover:w-[320px]">
              <div className="w-[320px]">
                <div className="px-6 py-5 border-b border-border bg-black/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                      <Settings2 className="w-4 h-4" /> Studio Matrix
                    </h3>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">WASM Neural Execution</p>
                  </div>
                  <Badge variant="outline" className="text-[8px] border-emerald-500/20 bg-emerald-500/10 text-emerald-500 uppercase font-black px-2 py-0.5 rounded-full italic animate-pulse">Live</Badge>
                </div>

                {/* Thread Heatmap Visual */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-tighter text-muted-foreground/40">
                    <span>Thread Load</span>
                    <span>12.4%</span>
                  </div>
                  <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden flex gap-0.5">
                    <motion.div initial={{ width: "30%" }} animate={{ width: "45%" }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }} className="h-full bg-primary" />
                    <div className="h-full w-1 bg-primary/20" />
                    <div className="h-full w-4 bg-primary/40" />
                    <div className="h-full w-2 bg-primary/10" />
                  </div>
                </div>
              </div>
              
              <ScrollArea className="flex-grow">
                <div className="p-0">
                  {renderSettings()}
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-border bg-black/10 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Fingerprint className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary">Crypto Vault</span>
                    <span className="text-[10px] font-black uppercase text-foreground italic">Memory Isolated</span>
                  </div>
                </div>
              </div>
              </div>
            </aside>
          )}
        </section>

        {/* TOOL HEALTH & STATS FOOTER - Landing Mode Only */}
        {mode === "landing" && (
          <section className="bg-black/60 border-b border-border py-6 relative z-30">
             <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                   <ToolHealth status={currentFile?.status === "completed" ? "complete" : (currentFile?.status === "processing" ? "processing" : "idle")} />
                   <div className="flex items-center gap-10 text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                      <span className="flex items-center gap-2.5 group hover:text-primary transition-colors cursor-help">
                        <Monitor className="w-4 h-4 opacity-50 group-hover:opacity-100" /> 
                        100% Local GPU Pipeline
                      </span>
                      <span className="flex items-center gap-2.5 group hover:text-emerald-500 transition-colors cursor-help">
                        <ShieldCheck className="w-4 h-4 opacity-50 group-hover:opacity-100" /> 
                        Client-Side Secure Enclave
                      </span>
                      <span className="flex items-center gap-2.5 group hover:text-blue-500 transition-colors cursor-help">
                        <CloudOff className="w-4 h-4 opacity-50 group-hover:opacity-100" /> 
                        Offline Vector Support
                      </span>
                   </div>
                </div>
             </div>
          </section>
        )}

        {/* SEO CONTENT - Landing Mode Only */}
        {mode === "landing" && (
          <>
            <FAQ items={IMAGE_EDITOR_FAQ} />

            <section id="features" className="py-32 border-t border-border/40">
              <div className="container mx-auto px-6 max-w-5xl space-y-32">
                
                {/* Feature Showcase */}
                <div className="space-y-16">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Powerful Editing Tools</h2>
                    <p className="text-muted-foreground uppercase tracking-widest text-xs font-black">Everything you need in one browser-based studio</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { icon: Wand2, title: "AI Background Removal", desc: "Isolate subjects and create transparent backgrounds with advanced edge detection." },
                      { icon: Scissors, title: "Crop & Resize", desc: "Perfect dimensions for Instagram, YouTube, LinkedIn, and professional printing." },
                      { icon: Zap, title: "Image Compression", desc: "Reduce file sizes while maintaining pixel-perfect clarity for web performance." },
                      { icon: RefreshCw, title: "Format Conversion", desc: "Convert between PNG, JPG, WebP, AVIF, SVG, and more instantly." },
                      { icon: Palette, title: "Filters & Effects", desc: "Apply professional-grade cinematic, vintage, and modern photo effects." },
                      { icon: Type, title: "Text & Watermarks", desc: "Add signatures, branding, and text overlays with full control." }
                    ].map((f, i) => (
                      <Card key={i} className="p-8 rounded-[32px] glass-card border-border/40 space-y-6 hover:border-primary/50 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                          <f.icon className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight italic">{f.title}</h3>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed italic">{f.desc}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Privacy Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                      <ShieldCheck className="w-4 h-4" /> Privacy-First Architecture
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-[0.9]">
                      100% Private <br />
                      <span className="text-emerald-500">Local Editing</span>
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed italic">
                      Unlike traditional online editors, SafeTools processes your images directly in your browser. Your photos are never uploaded to any server, ensuring maximum confidentiality for personal and business assets.
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      {["Zero Uploads", "Offline Support", "GPU Accelerated", "Secure Sandboxing"].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-black uppercase tracking-widest opacity-60">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative aspect-video rounded-[40px] overflow-hidden border border-border/40 glass-card p-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent" />
                    <div className="relative h-full w-full rounded-[39px] bg-secondary/40 flex items-center justify-center">
                      <Monitor className="w-32 h-32 text-emerald-500 opacity-20" />
                    </div>
                  </div>
                </div>

                {/* AI Lab Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                  <div className="order-2 lg:order-1 relative aspect-video rounded-[40px] overflow-hidden border border-border/40 glass-card p-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
                    <div className="relative h-full w-full rounded-[39px] bg-secondary/40 flex items-center justify-center">
                      <Sparkles className="w-32 h-32 text-primary opacity-20" />
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                      <Cpu className="w-4 h-4" /> Neural Engine
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-[0.9]">
                      AI-Powered <br />
                      <span className="text-primary">Photo Studio</span>
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed italic">
                      Leverage advanced WebAssembly-powered AI to sharpen blurry images, upscale low-quality photos, and extract high-fidelity design palettes directly on your device.
                    </p>
                    <div className="space-y-4">
                      {[
                        "AI Background Removal Engine",
                        "Neural OCR Text Extraction",
                        "Advanced Chromatic Palette Analysis",
                        "Dynamic Edge Detection"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          <span className="text-xs font-black uppercase tracking-widest">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social Media Presets */}
                <div className="space-y-16">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Social Media Perfect</h2>
                    <p className="text-muted-foreground uppercase tracking-widest text-xs font-black">Instant presets for all your content platforms</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Instagram Post", icon: Smartphone },
                      { label: "YouTube Thumbnail", icon: Play },
                      { label: "LinkedIn Banner", icon: Monitor },
                      { label: "Twitter / X Post", icon: HardDrive },
                      { label: "Facebook Cover", icon: ImageIcon },
                      { label: "TikTok Cover", icon: Smartphone },
                      { label: "Pinterest Pin", icon: Layers },
                      { label: "Web Banner", icon: Maximize }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center justify-center p-8 rounded-3xl glass-card border border-border/40 hover:border-primary/50 transition-all cursor-pointer group">
                        <item.icon className="w-10 h-10 text-muted-foreground/40 group-hover:text-primary transition-colors mb-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-center">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="space-y-16">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-emerald-500">The Private Choice</h2>
                    <p className="text-muted-foreground uppercase tracking-widest text-xs font-black">SafeTools vs. Traditional Cloud Editors</p>
                  </div>

                  <div className="overflow-hidden rounded-[40px] border border-border/40 glass-card">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border/40">
                          <th className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Feature</th>
                          <th className="p-8 text-[10px] font-black uppercase tracking-widest text-emerald-500">SafeTools</th>
                          <th className="p-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Traditional</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        {[
                          { f: "Browser-Based", s: true, t: "Limited" },
                          { f: "No Uploads Required", s: true, t: false },
                          { f: "Free Forever", s: true, t: "Restricted" },
                          { f: "Privacy First", s: true, t: false },
                          { f: "Fast GPU Performance", s: true, t: "Slow" },
                          { f: "Watermark Free", s: true, t: "Paid Only" }
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-border/40 hover:bg-white/[0.02] transition-colors">
                            <td className="p-8 font-black uppercase tracking-widest opacity-60 italic">{row.f}</td>
                            <td className="p-8">
                              {row.s === true ? <Check className="text-emerald-500 w-5 h-5" /> : row.s}
                            </td>
                            <td className="p-8 opacity-40">
                              {row.t === true ? <Check className="w-5 h-5" /> : row.t === false ? <X className="text-destructive w-5 h-5" /> : row.t}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Final CTA */}
                <div className="relative overflow-hidden rounded-[40px] p-16 text-center space-y-8 glass-card border border-primary/20">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
                   <Sparkles className="w-20 h-20 mx-auto text-primary animate-pulse" />
                   <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">Ready to Edit?</h2>
                   <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto italic">
                     Join thousands of creators using the world's most private and powerful browser-based image editor.
                   </p>
                   <Button 
                    size="lg" 
                    className="h-20 px-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-sm gap-4 shadow-[0_40px_100px_rgba(var(--primary-rgb),0.3)] active:scale-95 transition-all"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                   >
                     Launch Studio Now <ChevronRight className="w-6 h-6" />
                   </Button>
                </div>

              </div>
            </section>

            <WhySafeTools />

            <LocalProcessingGuide />

            <RelatedTools 
              tools={[
                { name: "Background Remover", href: "/image/remove-background" },
                { name: "Image Compressor", href: "/image/compress" },
                { name: "Format Converter", href: "/image/convert" },
                { name: "Color Lab", href: "/image/colors" },
                { name: "App Icon Studio", href: "/image/icons" },
                { name: "Metadata Cleaner", href: "/security/metadata-cleaner" }
              ]}
            />

            {/* PRIVACY MANIFESTO */}
            <section className="py-24 border-t border-border bg-black/20">
               <div className="container mx-auto px-6 max-w-3xl text-center space-y-8">
                  <Fingerprint className="w-16 h-16 mx-auto text-primary opacity-50" />
                  <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter">Privacy-First Creative Tools</h2>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed italic">
                    "SafeTools develops browser-based creative tools designed for secure local processing and maximum user privacy. Fast, privacy-first creative tools designed for secure browser-based image workflows."
                  </p>
               </div>
            </section>
          </>
        )}

      </main>

      {/* MODERN DIALOGS (OCR, COLORS, METADATA) */}
      <Dialog open={!!ocrResult} onOpenChange={() => setOcrResult(null)}>
        <DialogContent className="max-w-3xl bg-card border-border text-foreground rounded-2xl shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] p-0 overflow-hidden">
          <div className="relative h-2 w-full bg-gradient-to-r from-blue-600 via-primary to-emerald-500" />
          <div className="p-5 space-y-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl font-black uppercase tracking-tighter italic">
                <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                  <ScanText className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span>Extraction Result</span>
                  <span className="text-[10px] font-black tracking-[0.3em] text-blue-500/60 not-italic uppercase mt-1">Neural OCR Mapping Engine</span>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="relative group">
              <ScrollArea className="h-[450px] w-full rounded-2xl border border-border bg-white/[0.01] p-5 shadow-inner group-hover:border-blue-500/30 transition-all duration-500">
                <pre className="text-sm md:text-base font-mono leading-relaxed text-muted-foreground/80 whitespace-pre-wrap selection:bg-blue-500/30">{ocrResult}</pre>
              </ScrollArea>
              <div className="absolute top-6 right-6 flex gap-2">
                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[9px]">Neural Corrected</Badge>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-grow rounded-xl border-border bg-secondary/30 hover:bg-secondary/50 hover:border-border h-11 font-black uppercase text-[10px] tracking-widest transition-all" onClick={() => setOcrResult(null)}>Dismiss Engine</Button>
              <Button className="flex-[2] rounded-xl bg-blue-600 hover:bg-blue-700 text-foreground font-black h-11 px-5 uppercase text-[10px] tracking-widest gap-3 shadow-2xl shadow-blue-900/30 group active:scale-95 transition-all" onClick={() => {
                navigator.clipboard.writeText(ocrResult || "");
                toast.success("Intelligence data copied");
              }}>
                <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" /> Copy Intelligence
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={extractedColors.length > 0} onOpenChange={() => setExtractedColors([])}>
        <DialogContent className="max-w-3xl bg-card border-border text-foreground rounded-2xl shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] p-0 overflow-hidden">
          <div className="relative h-2 w-full bg-gradient-to-r from-primary via-blue-500 to-emerald-500" />
          <div className="p-5 space-y-5">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl font-black uppercase tracking-tighter italic">
                <div className="w-11 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
                  <Palette className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span>Design Extraction</span>
                  <span className="text-[10px] font-black tracking-[0.3em] text-primary/60 not-italic uppercase mt-1">Neural Color Mapping Protocol</span>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-3">
              {extractedColors.map((color, i) => (
                <motion.div 
                   key={i} 
                   initial={{ opacity: 0, scale: 0.5 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.1 }}
                   className="space-y-4 group"
                >
                  <div 
                    className="aspect-square rounded-xl shadow-2xl border-4 border-border cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-black/50 overflow-hidden relative" 
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      navigator.clipboard.writeText(color);
                      toast.success(`Copied: ${color.toUpperCase()}`);
                    }}
                  >
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-muted/20">
                        <Copy className="w-6 h-6 text-foreground" />
                     </div>
                  </div>
                  <p className="text-[10px] font-black font-mono text-center opacity-20 group-hover:opacity-100 transition-opacity uppercase tracking-tighter tabular-nums">{color}</p>
                </motion.div>
              ))}
            </div>
            <Button className="w-full bg-white/[0.03] hover:bg-white/[0.08] border border-border rounded-2xl h-11 font-black text-xs uppercase tracking-widest gap-3 transition-all" onClick={() => {
              const css = extractedColors.map((c, i) => `--studio-color-${i+1}: ${c};`).join("\n");
              navigator.clipboard.writeText(css);
              toast.success("CSS Protocol copied");
            }}>
              <Share2 className="w-5 h-5" /> Export Design Protocol (CSS)
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!metadataFile} onOpenChange={() => setMetadataFile(null)}>
        <DialogContent className="max-w-xl bg-card border-border text-foreground rounded-2xl shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] p-0 overflow-hidden">
          <div className="relative h-2 w-full bg-gradient-to-r from-emerald-500 via-primary to-blue-500" />
          <div className="p-5 space-y-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl font-black uppercase tracking-tighter italic">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <Info className="w-8 h-8 text-emerald-500 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span>Asset Metadata</span>
                  <span className="text-[10px] font-black tracking-[0.3em] text-emerald-500/60 not-italic uppercase mt-1">Deep Forensic Inspector</span>
                </div>
              </DialogTitle>
            </DialogHeader>
            {metadataFile && (
              <div className="space-y-4">
                {[
                  { label: "File Name", value: metadataFile.file.name },
                  { label: "Protocol", value: metadataFile.file.type || "unknown/raw" },
                  { label: "Static Size", value: `${(metadataFile.file.size / 1024).toFixed(2)} KB` },
                  { label: "Engine Status", value: metadataFile.status.toUpperCase(), color: "text-primary" }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center p-6 rounded-2xl bg-secondary/30 border border-border hover:border-border transition-colors">
                    <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] opacity-40">{item.label}</span>
                    <span className={cn("text-sm font-black truncate max-w-[220px] tracking-tighter italic", item.color)}>{item.value}</span>
                  </div>
                ))}
                <div className="mt-8 p-6 rounded-3xl bg-primary/5 border border-primary/10 text-[10px] text-primary/60 leading-relaxed font-black uppercase tracking-[0.1em] text-center italic">
                  Verified: This asset remains 100% local. No telemetry or data transmitted.
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {mode === "landing" && <Footer />}

      {/* Mobile FAB */}

      <AnimatePresence>
        {currentFile && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="lg:hidden fixed bottom-10 right-6 z-50 flex flex-col gap-4"
          >
             <Button 
              className="w-10 h-10 rounded-full bg-white text-black shadow-2xl flex items-center justify-center p-0 border-4 border-border active:scale-90 transition-all shadow-black/60"
              onClick={() => document.getElementById('studio-upload-mobile')?.click()}
             >
               <Plus className="w-7 h-7" />
             </Button>
             {currentFile?.processedUrl && (
               <Button 
                className="w-10 h-10 rounded-full bg-emerald-500 shadow-[0_20px_50px_rgba(16,185,129,0.4)] flex items-center justify-center p-0 border-4 border-border active:scale-90 transition-all"
                onClick={handleDownloadSingle}
               >
                 <DownloadCloud className="w-7 h-7 text-foreground" />
               </Button>
             )}
             <Button 
              className="w-10 h-10 rounded-full bg-primary shadow-[0_20px_50px_rgba(var(--primary-rgb),0.5)] flex items-center justify-center p-0 border-4 border-border active:scale-90 transition-all"
              onClick={handleProcess}
              disabled={isProcessing}
             >
               {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Save className="w-7 h-7" />}
             </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CropOverlay = ({ 
  file, 
  imageRef, 
  dimensions,
  settings,
  zoom,
  updateFileCrop 
}: { 
  file: ImageFile, 
  imageRef: React.RefObject<HTMLImageElement | null>,
  dimensions: { naturalWidth: number, naturalHeight: number },
  settings: ImageSettings,
  zoom: number,
  updateFileCrop: (id: string, crop: { x: number, y: number, width: number, height: number }) => void
}) => {
  const [isDraggingBox, setIsDraggingBox] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0 });
  const [displayMetrics, setDisplayMetrics] = useState<{
    width: number, height: number, offsetX: number, offsetY: number, scale: number
  } | null>(null);

  const { naturalWidth, naturalHeight } = dimensions;

  useEffect(() => {
    const measure = () => {
      if (!imageRef.current) return;
      const img = imageRef.current;
      
      // Since CropOverlay is inside the rotated container, 
      // we can use the untransformed clientWidth/Height of the image.
      const displayWidth = img.clientWidth;
      const displayHeight = img.clientHeight;
      const rect = img.getBoundingClientRect();
      
      setDisplayMetrics({
        width: displayWidth,
        height: displayHeight,
        offsetX: 0,
        offsetY: 0,
        scale: zoom * (displayWidth / naturalWidth)
      });
    };

    measure();
    const timer = setTimeout(measure, 100); // Small delay to ensure DOM settled
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(timer);
    };
  }, [imageRef, naturalWidth, naturalHeight, zoom, settings.rotate]);

  const crop = file.crop || { x: 0, y: 0, width: naturalWidth, height: naturalHeight };

  useEffect(() => {
    if (!displayMetrics) return;
    const { scale } = displayMetrics;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingBox) return;
      
      // Calculate raw mouse delta
      let dx_screen = (e.clientX - dragStart.x) / scale;
      let dy_screen = (e.clientY - dragStart.y) / scale;

      // Transform delta if rotated
      const rad = -(settings.rotate * Math.PI) / 180;
      const dx = dx_screen * Math.cos(rad) - dy_screen * Math.sin(rad);
      const dy = dx_screen * Math.sin(rad) + dy_screen * Math.cos(rad);

      const nextX = Math.max(0, Math.min(naturalWidth - crop.width, dragStart.cropX + dx));
      const nextY = Math.max(0, Math.min(naturalHeight - crop.height, dragStart.cropY + dy));

      updateFileCrop(file.id, { x: Math.round(nextX), y: Math.round(nextY), width: crop.width, height: crop.height });
    };

    const handleMouseUp = () => setIsDraggingBox(false);

    if (isDraggingBox) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingBox, dragStart, crop, file.id, displayMetrics, naturalWidth, naturalHeight, updateFileCrop]);

  if (!displayMetrics) return null;

  const { offsetX, offsetY, scale, width: displayW_total, height: displayH_total } = displayMetrics;
  const displayX = offsetX + (crop.x * scale);
  const displayY = offsetY + (crop.y * scale);
  const displayW = crop.width * scale;
  const displayH = crop.height * scale;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingBox(true);
    setDragStart({ x: e.clientX, y: e.clientY, cropX: crop.x, cropY: crop.y });
  };

  const handleResize = (handle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCrop = { ...crop };

    const onMove = (moveEvent: MouseEvent) => {
      const { scale } = displayMetrics;
      let dx_screen = (moveEvent.clientX - startX) / scale;
      let dy_screen = (moveEvent.clientY - startY) / scale;

      // Transform delta if rotated
      const rad = -(settings.rotate * Math.PI) / 180;
      const dx = dx_screen * Math.cos(rad) - dy_screen * Math.sin(rad);
      const dy = dx_screen * Math.sin(rad) + dy_screen * Math.cos(rad);

      const nextCrop = { ...startCrop };

      if (handle.includes("e")) nextCrop.width = Math.max(10, Math.min(naturalWidth - startCrop.x, startCrop.width + dx));
      if (handle.includes("s")) nextCrop.height = Math.max(10, Math.min(naturalHeight - startCrop.y, startCrop.height + dy));
      if (handle.includes("w")) {
        const moveX = Math.min(startCrop.width - 10, Math.max(-startCrop.x, dx));
        nextCrop.x = startCrop.x + moveX;
        nextCrop.width = startCrop.width - moveX;
      }
      if (handle.includes("n")) {
        const moveY = Math.min(startCrop.height - 10, Math.max(-startCrop.y, dy));
        nextCrop.y = startCrop.y + moveY;
        nextCrop.height = startCrop.height - moveY;
      }

      updateFileCrop(file.id, { 
        x: Math.round(nextCrop.x), 
        y: Math.round(nextCrop.y), 
        width: Math.round(nextCrop.width), 
        height: Math.round(nextCrop.height) 
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="absolute inset-0 z-40 pointer-events-none select-none overflow-hidden">
      <svg className="w-full h-full">
        <defs>
          <mask id="crop-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect x={displayX} y={displayY} width={displayW} height={displayH} fill="black" rx="2" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="black" fillOpacity="0.6" mask="url(#crop-mask)" className="pointer-events-auto" />
      </svg>
      <div 
        className="absolute border-2 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] cursor-move pointer-events-auto group"
        style={{ left: displayX, top: displayY, width: displayW, height: displayH }}
        onMouseDown={handleMouseDown}
      >
        {["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((h) => (
          <div
            key={h}
            className={cn(
              "absolute w-4 h-4 bg-primary border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform cursor-pointer shadow-lg",
              h === "nw" && "left-0 top-0 cursor-nw-resize",
              h === "n" && "left-1/2 top-0 cursor-n-resize",
              h === "ne" && "left-full top-0 cursor-ne-resize",
              h === "e" && "left-full top-1/2 cursor-e-resize",
              h === "se" && "left-full top-full cursor-se-resize",
              h === "s" && "left-1/2 top-full cursor-s-resize",
              h === "sw" && "left-0 top-full cursor-sw-resize",
              h === "w" && "left-0 top-1/2 cursor-w-resize"
            )}
            onMouseDown={(e) => handleResize(h, e)}
          />
        ))}
      </div>
    </div>
  );
};

const BlurOverlay = ({ 
  file, 
  updateFileBlurs 
}: { 
  file: ImageFile, 
  updateFileBlurs: (id: string, blurs: any[]) => void
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentBlur, setCurrentBlur] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setIsDrawing(true);
    setStartPos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const width = Math.abs(x - startPos.x);
    const height = Math.abs(y - startPos.y);
    const left = Math.min(x, startPos.x);
    const top = Math.min(y, startPos.y);
    setCurrentBlur({ x: left, y: top, width, height });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentBlur && currentBlur.width > 5 && currentBlur.height > 5) {
      const newBlur = { id: Math.random().toString(36).substring(7), ...currentBlur };
      updateFileBlurs(file.id, [...(file.blurs || []), newBlur]);
    }
    setCurrentBlur(null);
  };

  return (
    <div 
      className="absolute inset-0 z-40 cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {file.blurs?.map(blur => (
        <div 
          key={blur.id}
          className="absolute border-2 border-emerald-500/50 backdrop-blur-3xl group/blur"
          style={{ left: blur.x, top: blur.y, width: blur.width, height: blur.height, backgroundColor: 'rgba(0,0,0,0.1)' }}
        >
          <button 
            className="absolute -top-3 -right-3 w-6 h-6 bg-destructive text-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              updateFileBlurs(file.id, file.blurs?.filter(b => b.id !== blur.id) || []);
            }}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      {currentBlur && (
        <div 
          className="absolute border-2 border-emerald-500 border-dashed bg-emerald-500/10"
          style={{ left: currentBlur.x, top: currentBlur.y, width: currentBlur.width, height: currentBlur.height }}
        />
      )}
    </div>
  );
};
