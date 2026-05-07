"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/shared/Navbar";
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
  Undo2, Redo2, AlertCircle, ShieldOff, MousePointer2
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const CATEGORIZED_FORMATS = {
  "Regular Use": ["webp", "jpeg", "png", "pdf", "svg", "heic"],
  "Web Standard": ["webp", "jpeg", "jpg", "png", "gif", "svg", "ico", "cur", "bmp", "apng", "jfif", "pjpeg", "pjp"],
  "Modern & Next-Gen": ["avif", "heic", "heif", "jxl", "flif", "apng", "mng"],
  "Professional Print": ["pdf", "tiff", "tif", "eps", "ai", "psd", "psb", "indd", "indt"]
};

export default function ImageStudioPage() {
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
      addFiles(dropped);
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
      <div className="flex-grow flex items-center justify-center p-12 text-center space-y-4">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">No Selection</p>
          <p className="text-xs text-white/10 italic">Upload an image to unlock studio controls.</p>
        </div>
      </div>
    );

    return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow min-h-0">
      <div className="px-6 py-4 border-b border-white/5 bg-[#0a0a0a]">
        <TabsList className="bg-white/5 border border-white/5 rounded-2xl w-full p-1 h-12">
          <TabsTrigger value="format" className="flex-grow rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"><Settings2 className="w-3.5 h-3.5 mr-2" /> CORE</TabsTrigger>
          <TabsTrigger value="crop" className="flex-grow rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"><Scissors className="w-3.5 h-3.5 mr-2" /> CROP</TabsTrigger>
          <TabsTrigger value="privacy" className="flex-grow rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-emerald-500 data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20"><ShieldOff className="w-3.5 h-3.5 mr-2" /> PRIVACY</TabsTrigger>
          <TabsTrigger value="filters" className="flex-grow rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"><Palette className="w-3.5 h-3.5 mr-2" /> FX</TabsTrigger>
          <TabsTrigger value="ai" className="flex-grow rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20"><Zap className="w-3.5 h-3.5 mr-2" /> LAB</TabsTrigger>
        </TabsList>
      </div>

      <ScrollArea className="flex-grow min-h-0">
        <div className="p-8 space-y-10 pb-20">
          <TabsContent value="format" className="m-0 focus-visible:outline-none">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
            {/* Export Format */}
            <div className="space-y-4">
              <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Target Format</Label>
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="outline" className="w-full h-20 rounded-[2rem] bg-white/[0.02] border-white/5 p-4 hover:border-primary/50 hover:bg-primary/5 transition-all group overflow-hidden shadow-2xl relative">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
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
                <DropdownMenuContent className="w-[400px] p-0 bg-[#0a0a0a] border-white/10 rounded-[2.5rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] overflow-hidden backdrop-blur-3xl" align="start">
                  <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="Filter Formats..." 
                        className="h-12 pl-12 bg-black/40 border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest focus:border-primary/50 transition-all shadow-inner"
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
                  <ScrollArea className="h-[450px]">
                    <div className="p-4 space-y-8">
                      {Object.entries(CATEGORIZED_FORMATS).map(([cat, fmts]) => (
                        <div key={cat} className="space-y-4">
                          <div className="flex items-center gap-3 px-2">
                            <div className="h-[1px] flex-grow bg-white/5" />
                            <p className="text-[9px] uppercase font-black tracking-[0.3em] text-primary/60">{cat}</p>
                            <div className="h-[1px] flex-grow bg-white/5" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {fmts.map(f => (
                              <button
                                key={f}
                                data-value={f.toLowerCase()}
                                className={cn(
                                  "format-item flex items-center justify-between px-5 py-4 rounded-2xl border transition-all active:scale-95 group",
                                  settings.format === f 
                                    ? "bg-primary border-primary shadow-lg shadow-primary/20 text-white" 
                                    : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/5 hover:border-primary/30 hover:text-white"
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
            <div className="space-y-8">
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
                    className="bg-white/[0.03] border-white/10 rounded-2xl h-14 pl-12 focus:border-primary/50 transition-all shadow-inner font-mono"
                    value={settings.targetSize || ""}
                    onChange={(e) => updateSettings({ targetSize: parseInt(e.target.value) || undefined })}
                  />
                  <Maximize className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
                </div>
              </div>
            </div>

            {/* Transformations */}
            <div className="space-y-4">
              <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Geometry Core</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" size="icon" className="rounded-2xl h-12 w-full border-white/10 bg-white/[0.03] hover:bg-primary/10 hover:border-primary/30 transition-all" onClick={() => pushSettings({ rotate: (settings.rotate + 90) % 360 })}>
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className={cn("rounded-2xl h-12 w-full border-white/10 bg-white/[0.03] transition-all", settings.flipX && "bg-primary border-primary")} onClick={() => pushSettings({ flipX: !settings.flipX })}>
                  <FlipHorizontal className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className={cn("rounded-2xl h-12 w-full border-white/10 bg-white/[0.03] transition-all", settings.flipY && "bg-primary border-primary")} onClick={() => pushSettings({ flipY: !settings.flipY })}>
                  <FlipVertical className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-2xl h-12 w-full border-white/10 bg-white/[0.03] hover:bg-primary/10 hover:border-primary/30 transition-all"
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
              className="space-y-10"
            >
            <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Boundary Definition</Label>
                  <p className="text-[8px] font-bold text-primary uppercase tracking-[0.2em]">Manual Offset Matrix</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-white/5"
                    onClick={() => setActiveTab("format")}
                  >
                    <ChevronLeft className="w-4 h-4 opacity-40 hover:opacity-100" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-white/5"
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

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary" /> X-Origin
                  </Label>
                  <Input 
                    type="number" 
                    value={currentFile?.crop?.x || 0} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      updateFileCrop(currentFile.id, { x: val });
                    }}
                    className="h-12 rounded-xl bg-white/5 border-white/10 font-black text-xs" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary" /> Y-Origin
                  </Label>
                  <Input 
                    type="number" 
                    value={currentFile?.crop?.y || 0} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      updateFileCrop(currentFile.id, { y: val });
                    }}
                    className="h-12 rounded-xl bg-white/5 border-white/10 font-black text-xs" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
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
                    className="h-12 rounded-xl bg-white/5 border-white/10 font-black text-xs" 
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[9px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
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
                    className="h-12 rounded-xl bg-white/5 border-white/10 font-black text-xs" 
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
              className="space-y-10"
            >
              <div className="p-8 rounded-[2.5rem] bg-emerald-500/[0.02] border border-emerald-500/10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <ShieldOff className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-black uppercase tracking-widest text-white">Privacy Shield</h4>
                    <p className="text-[8px] font-black text-emerald-500/60 uppercase tracking-widest">Dynamic Sensitive Data Masking</p>
                  </div>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed font-medium italic">
                  Draw boxes over faces, license plates, or documents to apply secure, client-side blurring.
                </p>
                <div className="flex flex-col gap-3">
                   <Button 
                     variant="outline" 
                     className={cn(
                       "w-full h-14 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest transition-all",
                       activeTab === "privacy" ? "bg-emerald-500 text-white border-emerald-500" : "bg-white/[0.03] border-white/10 hover:bg-emerald-500/10"
                     )}
                     onClick={() => setActiveTab("privacy")}
                   >
                     <MousePointer2 className="w-4 h-4 mr-2" /> Start Masking
                   </Button>
                   <Button 
                     variant="outline" 
                     className="w-full h-12 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all disabled:opacity-20"
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
                      <div key={blur.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-white/40">
                            #{idx + 1}
                          </div>
                          <span className="text-[10px] font-black text-white/60 uppercase tracking-tighter">Mask Region {Math.round(blur.width)}x{Math.round(blur.height)}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full text-white/20 hover:text-destructive hover:bg-destructive/10 transition-all"
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
              className="space-y-10"
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
                      settings.filter === f ? "bg-primary border-primary shadow-lg shadow-primary/20" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
                    )}
                    onClick={() => updateSettings({ filter: f as any })}
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
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
              className="space-y-10"
            >
            {/* WASM Neural Lab Card */}
            <div className="relative group overflow-hidden rounded-[2.5rem] p-[1px] bg-gradient-to-br from-primary/30 via-white/5 to-blue-500/30">
              <div className="absolute inset-0 bg-[#0a0a0a] rounded-[calc(2.5rem-1px)]" />
              <div className="relative p-7 space-y-6 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/5 rounded-[calc(2.5rem-1px)] backdrop-blur-3xl">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">WASM Neural Lab</h4>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest">Proprietary Architecture</p>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-white/40 leading-relaxed font-medium relative z-10 italic">
                  Secure, client-side intelligence for document analysis and design extraction.
                </p>
                
                <div className="space-y-3 pt-2 relative z-10">
                  <Button variant="outline" className="w-full h-14 rounded-[1.25rem] bg-white/[0.03] border-white/10 text-[10px] font-black uppercase tracking-widest group hover:bg-primary hover:border-primary hover:text-white transition-all shadow-xl" onClick={() => currentFile && handleOCR(currentFile.file)}>
                    {isOcrLoading ? <Loader2 className="w-4 h-4 mr-3 animate-spin" /> : <ScanText className="w-4 h-4 mr-3 group-hover:scale-125 transition-transform" />} Extract Text (OCR)
                  </Button>
                  <Button variant="outline" className="w-full h-14 rounded-[1.25rem] bg-white/[0.03] border-white/10 text-[10px] font-black uppercase tracking-widest group hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all shadow-xl" onClick={() => currentFile && extractColors(currentFile.file)}>
                    <Palette className="w-4 h-4 mr-3 group-hover:scale-125 transition-transform" /> Design Palette
                  </Button>
                  <Button variant="outline" className="w-full h-14 rounded-[1.25rem] bg-white/[0.03] border-white/10 text-[10px] font-black uppercase tracking-widest group hover:bg-emerald-600 hover:border-emerald-600 hover:text-white transition-all shadow-xl" onClick={() => currentFile && setMetadataFile(currentFile)}>
                    <Info className="w-4 h-4 mr-3 group-hover:scale-125 transition-transform" /> Deep Metadata Inspector
                  </Button>
                </div>
              </div>

              {/* Watermark Section */}
              <div className="pt-10 border-t border-white/5 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Signature Matrix</Label>
                    <p className="text-[8px] font-bold text-white/10 uppercase tracking-widest">WASM-Level Watermarking</p>
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
                      <Label className="text-[8px] uppercase font-black tracking-widest text-white/40">Custom Label</Label>
                      <Input 
                        value={settings.watermarkText}
                        onChange={(e) => updateSettings({ watermarkText: e.target.value })}
                        className="bg-white/5 border-white/10 rounded-xl h-12 text-[10px] font-black uppercase tracking-widest"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-[8px] uppercase font-black tracking-widest text-white/40">Density Scale</Label>
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
            <div className="p-7 rounded-[2.5rem] bg-emerald-500/[0.02] border border-emerald-500/10 space-y-6 relative overflow-hidden group">
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
                  <span className="text-[11px] text-white font-black uppercase tracking-tighter">Auto-Strip Metadata</span>
                  <p className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Wiping Exif / GPS / Location</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
              </div>
            </div>
            </motion.div>
          </TabsContent>
        </div>
      </ScrollArea>
      
      <div className="p-8 border-t border-white/5 bg-[#0a0a0a] space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="rounded-[1.25rem] text-[9px] font-black uppercase h-12 border-white/5 bg-white/5 hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-all" onClick={clearFiles}>
            Flush Memory
          </Button>
          <Button variant="outline" className="rounded-[1.25rem] text-[9px] font-black uppercase h-12 border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all" onClick={handleDownloadAll}>
            Zip Export
          </Button>
        </div>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] font-black h-14 gap-3 shadow-2xl shadow-primary/30 group active:scale-95 transition-all text-xs uppercase tracking-widest italic"
          onClick={handleProcess}
          disabled={isProcessing || !currentFile}
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          Render Studio Asset
        </Button>

        {files.length > 1 && (
          <Button 
            variant="ghost"
            className="w-full text-white/40 hover:text-white rounded-[1.5rem] font-black h-12 gap-3 text-[9px] uppercase tracking-[0.3em] active:scale-95 transition-all"
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
    <div className="flex flex-col min-h-screen lg:h-screen bg-[#050505] text-white overflow-y-auto lg:overflow-hidden selection:bg-primary/30 custom-scrollbar">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-visible lg:overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-blue-500/5 blur-[140px] rounded-full animate-pulse" />
          <div 
            className="absolute inset-0 opacity-[0.4] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} 
          />
        </div>

        {/* Left Sidebar - File Queue */}
        <aside className="hidden lg:flex w-[420px] h-full max-h-full border-r border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl flex-col shrink-0 relative z-10 shadow-2xl">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/10">
            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                <Layers className="w-4 h-4" /> Identity Engine
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Multi-Platform Asset Matrix</p>
                <div className="flex gap-1.5 opacity-30">
                  <Play className="w-2 h-2 text-primary fill-primary" />
                  <div className="w-2 h-2 rounded-full border border-white/40" />
                  <Smartphone className="w-2 h-2" />
                </div>
              </div>
            </div>
            <Badge className="rounded-full bg-primary/10 text-primary border-primary/20 text-[10px] font-black px-4 py-1">
              {files.length}
            </Badge>
          </div>
          
          <ScrollArea className="flex-grow min-h-0">
            <div className="p-6 space-y-4">
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
                      "group p-4 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden duration-500",
                      selectedId === file.id 
                        ? "bg-primary/10 border-primary/30 shadow-2xl shadow-primary/20" 
                        : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center gap-4 relative z-10">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black/60 border border-white/5 shrink-0 shadow-2xl group-hover:scale-105 transition-transform">
                        <img src={file.previewUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-black truncate leading-tight uppercase tracking-tight italic mb-1">{file.file.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">
                            {file.file.name.split('.').pop()}
                          </span>
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            file.status === "completed" ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" :
                            file.status === "processing" ? "bg-primary animate-pulse" :
                            file.status === "error" ? "bg-destructive" : "bg-white/10"
                          )} />
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}
                        className="p-2 rounded-xl opacity-0 group-hover:opacity-100 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
          
          <input id="studio-upload" type="file" multiple accept="image/*,.heic,.heif,.tiff,.tif,.psd,.svg,.pdf,.webp,.avif" className="hidden" onChange={(e) => addFiles(Array.from(e.target.files || []))} />
          
          <div className="p-8 border-t border-white/5 bg-[#0a0a0a]">
            <Button 
              className="w-full bg-white text-black hover:bg-white/90 rounded-[1.5rem] font-black h-14 gap-3 text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
              onClick={() => document.getElementById('studio-upload-mobile')?.click()}
            >
              <Plus className="w-5 h-5" /> Import Assets
            </Button>
          </div>
        </aside>

        {/* Global file input — accessible on all screen sizes */}
        <input
          id="studio-upload-mobile"
          type="file"
          multiple
          accept="image/*,.heic,.heif,.tiff,.tif,.psd,.svg,.pdf,.webp,.avif"
          className="hidden"
          onChange={(e) => {
            addFiles(Array.from(e.target.files || []));
            (e.target as HTMLInputElement).value = "";
          }}
        />

        {/* Center - Workspace */}
        <section className="flex-grow bg-transparent relative flex flex-col h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Workspace Header */}
          <header className="p-4 md:p-8 flex items-center justify-between bg-black/20 backdrop-blur-sm border-b border-white/5 relative z-20">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center border border-white/10 shadow-2xl group overflow-hidden relative">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Cpu className="w-6 h-6 md:w-8 md:h-8 text-white relative z-10" />
              </div>
              <div className="flex flex-col">
                <h2 className="font-black text-lg md:text-2xl tracking-tighter uppercase italic">Creative Workspace</h2>
                <div className="flex items-center gap-3">
                   <Badge className="text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-0.5 rounded-full font-black uppercase tracking-widest">
                       Secure Session
                    </Badge>
                   <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-40 truncate max-w-[200px]">{currentFile?.file.name || "Standby Mode"}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Sheet open={isMobileSettingsOpen} onOpenChange={setIsMobileSettingsOpen}>
                <SheetTrigger render={<Button variant="outline" size="icon" className="lg:hidden rounded-2xl border-white/10 bg-white/5 h-12 w-12 md:h-14 md:w-14 shadow-xl"><Settings2 className="w-5 h-5" /></Button>} />
                <SheetContent side="right" className="w-full sm:w-[450px] p-0 bg-[#0a0a0a] border-white/10 rounded-l-[3rem] flex flex-col h-full">
                  <SheetHeader className="p-8 border-b border-white/5">
                    <SheetTitle className="text-white flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter">
                      <Wand2 className="w-6 h-6 text-primary" /> Studio Control
                    </SheetTitle>
                  </SheetHeader>
                  {renderSettings()}
                </SheetContent>
              </Sheet>
            </div>
          </header>

          <div 
            className={cn(
              "flex-grow relative flex items-center justify-center p-12 overflow-auto custom-scrollbar select-none",
              zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); }}
            onDrop={handleDrop}
          >
            {/* Grid background moved to separate layer for better perf */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
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
                    className="relative shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] border border-white/10 rounded-sm transition-all duration-700 ease-[0.16,1,0.3,1] bg-black/40 group-hover:border-primary/20 flex items-center justify-center w-fit h-fit overflow-visible"
                    style={{ 
                      transform: `scale(${zoom})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      maxWidth: 'none',
                      maxHeight: 'none'
                    }}
                  >
                    {/* Unified Transform Layer */}
                    <div 
                      className="relative transition-transform duration-500 ease-[0.16,1,0.3,1]"
                      style={{ 
                        transform: `rotate(${settings.rotate}deg) scaleX(${settings.flipX ? -1 : 1}) scaleY(${settings.flipY ? -1 : 1})`,
                      }}
                    >
                      <img 
                        ref={imageRef}
                        src={currentFile.processedUrl || currentFile.previewUrl} 
                        className="w-auto h-auto max-w-none shadow-inner" 
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
                          // Ensure overlays are updated when image loads
                          const img = e.currentTarget;
                          console.log("Image Loaded:", img.naturalWidth, img.naturalHeight);
                        }}
                      />
                      {activeTab === "crop" && imageDimensions && (
                        <CropOverlay 
                          file={currentFile} 
                          imageRef={imageRef} 
                          dimensions={imageDimensions}
                          updateFileCrop={updateFileCrop} 
                        />
                      )}
                      {activeTab === "privacy" && <BlurOverlay file={currentFile} updateFileBlurs={updateFileBlurs} />}
                    </div>
                    <AnimatePresence>
                      {isProcessing && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center gap-6">
                          <div className="relative">
                            <Loader2 className="w-20 h-20 animate-spin text-primary opacity-20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <p className="text-[12px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Neural Processing</p>
                            <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Optimizing via WebAssembly</p>
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
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full whitespace-nowrap">
                            Neural Sync In Progress
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center p-8"
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <motion.div
                    animate={{ scale: isDragging ? 1.02 : 1 }}
                    className="max-w-sm w-full"
                  >
                  <Card className={`p-8 border-dashed bg-white/[0.01] rounded-[3rem] text-center space-y-8 relative group overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-300 ${isDragging ? 'border-primary/60 bg-primary/5 shadow-primary/20' : 'border-white/5'}`}>
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10">
                      <motion.div 
                         initial={{ scale: 0.9, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/10 via-[#0a0a0a] to-blue-600/10 p-[1px] mx-auto mb-8 shadow-2xl relative group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                        <div className="w-full h-full rounded-[calc(1.5rem-1px)] bg-black/40 backdrop-blur-xl flex items-center justify-center border border-white/5 relative z-10">
                          {isDragging
                            ? <DownloadCloud className="w-10 h-10 text-primary animate-bounce" />
                            : <Cpu className="w-10 h-10 text-primary opacity-20" />
                          }
                        </div>
                      </motion.div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-6">
                        {isDragging ? "Release to Import" : "Drop images here or click below"}
                      </p>
                      <Button 
                        className="bg-white text-black hover:bg-white/90 rounded-[1.5rem] font-black px-10 h-14 uppercase tracking-widest text-[10px] shadow-2xl active:scale-95 transition-all w-full"
                        onClick={() => document.getElementById('studio-upload-mobile')?.click()}
                      >
                        Initialize Asset
                      </Button>
                    </div>
                  </Card>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* High-Performance Fixed Workspace Toolbar */}
            <AnimatePresence>
              {currentFile && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 rounded-[2.5rem] bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 shadow-[0_30px_100px_-20px_rgba(0,0,0,1)] z-[100] hover:border-primary/20 max-w-[95vw] overflow-x-auto no-scrollbar group/toolbar"
                  style={{ left: 'calc(50% + 10px)' }} // Offset for center-balanced look with sidebar
                >
                  {/* Undo/Redo Group */}
                  <div className="flex items-center gap-1 bg-black/40 rounded-full p-1 shrink-0">
                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full hover:bg-white/5 disabled:opacity-20" onClick={undo} disabled={history.length === 0}>
                      <Undo2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full hover:bg-white/5 disabled:opacity-20" onClick={redo} disabled={redoStack.length === 0}>
                      <Redo2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="w-[1px] h-6 bg-white/10 mx-1 shrink-0" />

                  {/* Zoom Group */}
                  <div className="flex items-center gap-3 px-3 shrink-0">
                      <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full hover:bg-white/5" onClick={() => setZoom(Math.max(0.1, zoom - 0.2))}>
                      <ZoomOut className="w-4 h-4 opacity-40" />
                    </Button>
                    <div className="w-24">
                      <Slider 
                        value={[zoom * 100]} 
                        min={10} max={500} step={1}
                        onValueChange={(v) => setZoom((Array.isArray(v) ? v[0] : v) / 100)}
                        className="py-2"
                      />
                    </div>
                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full hover:bg-white/5" onClick={() => setZoom(Math.min(5, zoom + 0.2))}>
                      <ZoomIn className="w-4 h-4 opacity-40" />
                    </Button>
                    <div className="min-w-[40px] text-[10px] font-black text-primary tabular-nums text-center uppercase tracking-tighter italic">
                      {Math.round(zoom * 100)}%
                    </div>
                  </div>

                  <div className="w-[1px] h-6 bg-white/10 mx-1 shrink-0" />

                  {/* Quality Group */}
                  <div className="flex items-center gap-3 px-3 shrink-0 text-white">
                      <Zap className="w-4 h-4 opacity-40" />
                      <div className="flex gap-1 bg-black/20 rounded-full p-1 mr-2">
                        {[
                          { l: "L", v: 30, t: "Low" },
                          { l: "M", v: 75, t: "Med" },
                          { l: "H", v: 95, t: "High" }
                        ].map(p => (
                          <button 
                            key={p.l}
                            onClick={() => pushSettings({ quality: p.v })}
                            className={cn(
                              "w-7 h-7 rounded-full text-[8px] font-black transition-all",
                              settings.quality === p.v ? "bg-primary text-white" : "text-white/20 hover:bg-white/5"
                            )}
                            title={p.t}
                          >
                            {p.l}
                          </button>
                        ))}
                      </div>
                      <div className="w-20">
                      <Slider 
                        value={[settings.quality]} 
                        min={1} max={100} step={1}
                        onValueChange={(v) => updateSettings({ quality: Array.isArray(v) ? v[0] : v })}
                        onValueCommitted={(v) => pushSettings({ quality: Array.isArray(v) ? v[0] : v })}
                        className="py-2"
                      />
                    </div>
                    <div className="min-w-[30px] text-[10px] font-black text-primary tabular-nums text-center uppercase tracking-tighter italic">
                      Q{settings.quality}
                    </div>
                  </div>

                  <div className="w-[1px] h-6 bg-white/10 mx-1 shrink-0" />


                  <div className="flex items-center gap-2 shrink-0">
                      <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full hover:bg-white/5" onClick={() => setZoom(1)}>
                      <Maximize className="w-4 h-4 opacity-40" />
                    </Button>
                    
                    <div className="relative group">
                      {currentFile?.status === "idle" && (
                        <div className="absolute -inset-1 bg-primary/20 blur-xl rounded-full animate-pulse group-hover:bg-primary/40 transition-all" />
                      )}
                      <Button 
                        size="lg" 
                        className={cn(
                          "relative rounded-[1.5rem] px-8 h-10 font-black text-[10px] gap-3 shadow-2xl uppercase italic tracking-tighter group active:scale-95 transition-all duration-500",
                          currentFile?.status === "idle" 
                            ? "bg-primary hover:bg-primary/90 text-white shadow-primary/30" 
                            : "bg-white/5 border border-white/10 text-white/40 cursor-default"
                        )}
                        onClick={handleProcess}
                        disabled={isProcessing || currentFile?.status === "processing"}
                      >
                        {isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className={cn(
                            "w-4 h-4 transition-transform duration-700",
                            currentFile?.status === "idle" && "group-hover:rotate-180 text-white"
                          )} />
                        )}
                        {isProcessing ? "Processing..." : currentFile?.status === "idle" ? "Render Changes" : "Up to Date"}
                      </Button>
                    </div>

                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-[1.5rem] px-6 h-10 border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-400 text-white/60 font-black text-[10px] gap-2 uppercase italic tracking-tighter group active:scale-95 transition-all"
                      onClick={handleDownloadSingle}
                      disabled={!currentFile?.processedUrl}
                    >
                      <DownloadCloud className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Save
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Right Sidebar - Engine Inspector */}
        <aside className="hidden lg:flex w-[420px] h-full max-h-full border-l border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl shrink-0 flex-col relative z-10 shadow-2xl">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/10">
            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> Studio Matrix
              </h3>
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">WASM Thread Execution</p>
            </div>
            <Badge variant="outline" className="text-[9px] border-white/10 bg-white/5 text-white/50 uppercase font-black px-3 py-1 rounded-full italic">Native</Badge>
          </div>
          {renderSettings()}
        </aside>
      </main>

      {/* Modern Dialogs */}
      <Dialog open={!!ocrResult} onOpenChange={() => setOcrResult(null)}>
        <DialogContent className="max-w-3xl bg-[#0a0a0a] border-white/10 text-white rounded-[3rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] p-0 overflow-hidden">
          <div className="relative h-2 w-full bg-gradient-to-r from-blue-600 via-primary to-emerald-500" />
          <div className="p-12 space-y-10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-6 text-3xl font-black uppercase tracking-tighter italic">
                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-600/10 flex items-center justify-center border border-blue-600/20 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                  <ScanText className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span>Extraction Result</span>
                  <span className="text-[10px] font-black tracking-[0.3em] text-blue-500/60 not-italic uppercase mt-1">Neural OCR Mapping Engine</span>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="relative group">
              <ScrollArea className="h-[450px] w-full rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-10 shadow-inner group-hover:border-blue-500/30 transition-all duration-500">
                <pre className="text-sm md:text-base font-mono leading-relaxed text-white/60 whitespace-pre-wrap selection:bg-blue-500/30">{ocrResult}</pre>
              </ScrollArea>
              <div className="absolute top-6 right-6 flex gap-2">
                 <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black px-4 py-1.5 rounded-full uppercase tracking-widest text-[9px]">Neural Corrected</Badge>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-grow rounded-[1.5rem] border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 h-16 font-black uppercase text-[10px] tracking-widest transition-all" onClick={() => setOcrResult(null)}>Dismiss Engine</Button>
              <Button className="flex-[2] rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black h-16 px-10 uppercase text-[10px] tracking-widest gap-3 shadow-2xl shadow-blue-900/30 group active:scale-95 transition-all" onClick={() => {
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
        <DialogContent className="max-w-3xl bg-[#0a0a0a] border-white/10 text-white rounded-[3rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] p-0 overflow-hidden">
          <div className="relative h-2 w-full bg-gradient-to-r from-primary via-blue-500 to-emerald-500" />
          <div className="p-12 space-y-10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-6 text-3xl font-black uppercase tracking-tighter italic">
                <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]">
                  <Palette className="w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span>Design Extraction</span>
                  <span className="text-[10px] font-black tracking-[0.3em] text-primary/60 not-italic uppercase mt-1">Neural Color Mapping Protocol</span>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-6">
              {extractedColors.map((color, i) => (
                <motion.div 
                   key={i} 
                   initial={{ opacity: 0, scale: 0.5 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.1 }}
                   className="space-y-4 group"
                >
                  <div 
                    className="aspect-square rounded-[2rem] shadow-2xl border-4 border-white/10 cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-black/50 overflow-hidden relative" 
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      navigator.clipboard.writeText(color);
                      toast.success(`Copied: ${color.toUpperCase()}`);
                    }}
                  >
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <Copy className="w-6 h-6 text-white" />
                     </div>
                  </div>
                  <p className="text-[10px] font-black font-mono text-center opacity-20 group-hover:opacity-100 transition-opacity uppercase tracking-tighter tabular-nums">{color}</p>
                </motion.div>
              ))}
            </div>
            <Button className="w-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-2xl h-16 font-black text-xs uppercase tracking-widest gap-3 transition-all" onClick={() => {
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
        <DialogContent className="max-w-xl bg-[#0a0a0a] border-white/10 text-white rounded-[3rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] p-0 overflow-hidden">
          <div className="relative h-2 w-full bg-gradient-to-r from-emerald-500 via-primary to-blue-500" />
          <div className="p-10 space-y-8">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-6 text-3xl font-black uppercase tracking-tighter italic">
                <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
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
                  <div key={item.label} className="flex justify-between items-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
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
              className="w-14 h-14 rounded-full bg-white text-black shadow-2xl flex items-center justify-center p-0 border-4 border-white/20 active:scale-90 transition-all shadow-black/60"
              onClick={() => document.getElementById('studio-upload-mobile')?.click()}
             >
               <Plus className="w-7 h-7" />
             </Button>
             {currentFile?.processedUrl && (
               <Button 
                className="w-14 h-14 rounded-full bg-emerald-500 shadow-[0_20px_50px_rgba(16,185,129,0.4)] flex items-center justify-center p-0 border-4 border-white/20 active:scale-90 transition-all"
                onClick={handleDownloadSingle}
               >
                 <DownloadCloud className="w-7 h-7 text-white" />
               </Button>
             )}
             <Button 
              className="w-14 h-14 rounded-full bg-primary shadow-[0_20px_50px_rgba(var(--primary-rgb),0.5)] flex items-center justify-center p-0 border-4 border-white/20 active:scale-90 transition-all"
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
  updateFileCrop 
}: { 
  file: ImageFile, 
  imageRef: React.RefObject<HTMLImageElement | null>,
  dimensions: { naturalWidth: number, naturalHeight: number },
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
      const rect = imageRef.current.getBoundingClientRect();
      const imageRatio = naturalWidth / naturalHeight;
      const containerRatio = rect.width / rect.height;
      
      let displayWidth = rect.width;
      let displayHeight = rect.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imageRatio > containerRatio) {
        displayHeight = rect.width / imageRatio;
        offsetY = (rect.height - displayHeight) / 2;
      } else {
        displayWidth = rect.height * imageRatio;
        offsetX = (rect.width - displayWidth) / 2;
      }

      setDisplayMetrics({
        width: displayWidth,
        height: displayHeight,
        offsetX,
        offsetY,
        scale: displayWidth / naturalWidth
      });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [imageRef, naturalWidth, naturalHeight]);

  const crop = file.crop || { x: 0, y: 0, width: naturalWidth, height: naturalHeight };

  useEffect(() => {
    if (!displayMetrics) return;
    const { scale } = displayMetrics;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingBox) return;
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;

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
      const dx = (moveEvent.clientX - startX) / scale;
      const dy = (moveEvent.clientY - startY) / scale;

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
            className="absolute -top-3 -right-3 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
