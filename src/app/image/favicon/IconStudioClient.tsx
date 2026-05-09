"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Loader2,
  Zap,
  Monitor,
  FileCode,
  Play,
  Smartphone,
  Layout,
  Info,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Settings2,
  DownloadCloud,
  Layers,
  Cpu,
  RefreshCw,
  Search,
  Grid,
  Shield,
  SmartphoneIcon,
  Plus,
  Sparkles,
  Wand2,
  HardDrive,
  Maximize,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExportManager } from "@/lib/export-manager";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

interface FaviconResult {
  name: string;
  url: string;
  size: string;
  type: "png" | "ico" | "apple" | "json" | "manifest";
  category: "Web" | "Android" | "iOS" | "Windows" | "Linux";
}

interface IconStudioClientProps {
  defaultTitle?: string;
}

export default function IconStudioClient({ defaultTitle }: IconStudioClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<FaviconResult[]>([]);
  const [zoom, setZoom] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [palette, setPalette] = useState<string[]>([]);

  const categories = ["All", "Web", "Android", "iOS", "Windows", "Linux"];
  const filteredResults = activeCategory === "All" ? results : results.filter(r => r.category === activeCategory);

  const generateIcons = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = URL.createObjectURL(file);
      });

      // Extract Palette
      const paletteCanvas = document.createElement("canvas");
      const paletteCtx = paletteCanvas.getContext("2d")!;
      paletteCanvas.width = 100; paletteCanvas.height = 100;
      paletteCtx.drawImage(img, 0, 0, 100, 100);
      const data = paletteCtx.getImageData(0, 0, 100, 100).data;
      const colors: Record<string, number> = {};
      for (let i = 0; i < data.length; i += 40) {
        if (data[i+3] < 128) continue;
        const hex = `#${((1 << 24) + (data[i] << 16) + (data[i+1] << 8) + data[i+2]).toString(16).slice(1)}`;
        colors[hex] = (colors[hex] || 0) + 1;
      }
      const sorted = Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
      setPalette(sorted);

      const generatedResults: FaviconResult[] = [];

      const drawIcon = (canvas: HTMLCanvasElement, size: number) => {
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, size, size);
        const iconSize = size * zoom;
        const offset = (size - iconSize) / 2;
        ctx.drawImage(img, offset, offset, iconSize, iconSize);
      };

      // --- WEB & PWA ---
      const webSizes = [
        { s: 16, n: "favicon-16x16.png" },
        { s: 32, n: "favicon-32x32.png" },
        { s: 48, n: "favicon.ico" },
        { s: 180, n: "apple-touch-icon.png" },
        { s: 192, n: "android-chrome-192x192.png" },
        { s: 512, n: "android-chrome-512x512.png" },
      ];

      for (const size of webSizes) {
        const canvas = document.createElement("canvas");
        canvas.width = size.s; canvas.height = size.s;
        drawIcon(canvas, size.s);
        generatedResults.push({
          name: `web/${size.n}`,
          url: canvas.toDataURL(size.n.endsWith(".ico") ? "image/x-icon" : "image/png"),
          size: `${size.s}x${size.s}`,
          type: size.n.endsWith(".ico") ? "ico" : "png",
          category: "Web"
        });
      }

      // Add site.webmanifest
      const manifest = {
        name: "Private App",
        short_name: "App",
        icons: [
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
        ],
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone"
      };
      generatedResults.push({
        name: "web/site.webmanifest",
        url: `data:application/json;base64,${btoa(JSON.stringify(manifest, null, 2))}`,
        size: "JSON",
        type: "manifest",
        category: "Web"
      });

      // --- ANDROID ---
      const androidDensities = [
        { s: 48, d: "mdpi" }, { s: 72, d: "hdpi" }, { s: 96, d: "xhdpi" },
        { s: 144, d: "xxhdpi" }, { s: 192, d: "xxxhdpi" }
      ];

      for (const den of androidDensities) {
        const canvas = document.createElement("canvas");
        canvas.width = den.s; canvas.height = den.s;
        drawIcon(canvas, den.s);
        generatedResults.push({
          name: `android/res/mipmap-${den.d}/ic_launcher.png`,
          url: canvas.toDataURL("image/png"),
          size: `${den.s}x${den.s}`,
          type: "png",
          category: "Android"
        });
      }

      // Add Play Store Icon
      const playStoreCanvas = document.createElement("canvas");
      playStoreCanvas.width = 512; playStoreCanvas.height = 512;
      drawIcon(playStoreCanvas, 512);
      generatedResults.push({
        name: "android/play_store_512.png",
        url: playStoreCanvas.toDataURL("image/png"),
        size: "512x512",
        type: "png",
        category: "Android"
      });

      // --- iOS ---
      const iosIcons = [
        { s: 20, n: "Icon-20.png" }, { s: 40, n: "Icon-20@2x.png" }, { s: 60, n: "Icon-20@3x.png" },
        { s: 29, n: "Icon-29.png" }, { s: 58, n: "Icon-29@2x.png" }, { s: 87, n: "Icon-29@3x.png" },
        { s: 40, n: "Icon-40.png" }, { s: 80, n: "Icon-40@2x.png" }, { s: 120, n: "Icon-40@3x.png" },
        { s: 60, n: "Icon-60.png" }, { s: 120, n: "Icon-60@2x.png" }, { s: 180, n: "Icon-60@3x.png" },
        { s: 76, n: "Icon-76.png" }, { s: 152, n: "Icon-76@2x.png" },
        { s: 167, n: "Icon-83.5@2x.png" },
        { s: 1024, n: "AppStoreIcon.png" }
      ];

      for (const icon of iosIcons) {
        const canvas = document.createElement("canvas");
        canvas.width = icon.s; canvas.height = icon.s;
        drawIcon(canvas, icon.s);
        generatedResults.push({
          name: `ios/AppIcon.appiconset/${icon.n}`,
          url: canvas.toDataURL("image/png"),
          size: `${icon.s}x${icon.s}`,
          type: "apple",
          category: "iOS"
        });
      }

      // --- WINDOWS ---
      const windowsSizes = [
        16, 20, 24, 30, 32, 36, 40, 44, 48, 60, 64, 72, 80, 96, 128, 256
      ];
      for (const s of windowsSizes) {
        const canvas = document.createElement("canvas");
        canvas.width = s; canvas.height = s;
        drawIcon(canvas, s);
        generatedResults.push({
          name: `windows/Assets/Square${s}x${s}Logo.png`,
          url: canvas.toDataURL("image/png"),
          size: `${s}x${s}`,
          type: "png",
          category: "Windows"
        });
      }

      // --- LINUX ---
      const linuxSizes = [16, 22, 24, 32, 48, 64, 128, 256, 512];
      for (const s of linuxSizes) {
        const canvas = document.createElement("canvas");
        canvas.width = s; canvas.height = s;
        drawIcon(canvas, s);
        generatedResults.push({
          name: `linux/hicolor/${s}x${s}/apps/icon.png`,
          url: canvas.toDataURL("image/png"),
          size: `${s}x${s}`,
          type: "png",
          category: "Linux"
        });
      }

      setResults(generatedResults);
      toast.success("Icons architected for all platforms");
    } catch (e) {
      console.error("Icon generation failed", e);
      toast.error("Generation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadZip = async () => {
    if (results.length === 0) return;
    setIsProcessing(true);
    try {
      const exportFiles = results.map(r => ({
        blob: dataURLToBlob(r.url),
        name: r.name
      }));
      await ExportManager.downloadZip(exportFiles, "studio-icon-bundle.zip");
    } finally {
      setIsProcessing(false);
    }
  };

  const dataURLToBlob = (dataUrl: string) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };



  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-background text-foreground overflow-y-auto lg:overflow-hidden lg:overflow-hidden selection:bg-primary/30 custom-scrollbar">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-visible lg:overflow-hidden relative scrollbar-hide">
        {/* Dynamic Identity Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute top-[30%] left-[40%] w-[20%] h-[20%] bg-purple-500/5 blur-[120px] rounded-full" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--color-primary-rgb),0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        {/* Left Sidebar - Control Panel */}
        <aside className="flex w-full lg:w-[300px] border-b lg:border-b-0 lg:border-r border-border glass-card flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                <Layers className="w-4 h-4" /> Identity Engine
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Multi-Platform Asset Matrix</p>
                <div className="flex gap-1.5 opacity-30">
                  <Play className="w-2 h-2 text-primary fill-primary" />
                  <div className="w-2 h-2 rounded-full border border-white/40" />
                  <Smartphone className="w-2 h-2 text-foreground" />
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-border bg-secondary/50 text-primary border-primary/20 uppercase font-black px-4 py-1.5 rounded-full italic shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]">PRO v2.0</Badge>
          </div>
          
          <ScrollArea className="flex-grow min-h-0">
            <div className="p-4 space-y-4">
              {!file ? (
                <div className="space-y-4">
                  <DropZone 
                    onFilesDrop={(fs) => { setFile(fs[0]); setPreview(URL.createObjectURL(fs[0])); setResults([]); }} 
                    title="Source Architect"
                    className="h-64 bg-secondary/30 border-dashed border-border rounded-2xl hover:bg-secondary/70 hover:border-primary/50 transition-all group"
                  />
                  <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-[#0a0a0a] to-blue-600/10 border border-border space-y-4 shadow-xl">
                    <div className="flex items-center gap-3 text-primary">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-lg">
                        <Info className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em]">Master Matrix</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/60 leading-relaxed font-medium italic">
                      For pixel-perfect clarity across retina displays, utilize a 1024x1024 master asset without transparency padding.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/60 border border-border flex items-center justify-center p-5 group shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] transition-all duration-700 hover:border-primary/20">
                    <img src={preview!} className="max-w-full max-h-full object-contain filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]" alt="" />
                    <button 
                      className="absolute top-6 right-6 p-3 rounded-2xl bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive hover:text-foreground active:scale-90"
                      onClick={() => { setFile(null); setResults([]); setPreview(null); }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] uppercase font-black tracking-widest opacity-40 text-primary">In-Engine Padding</Label>
                        <span className="text-xs font-mono font-black text-muted-foreground/80">{Math.round(zoom * 100)}%</span>
                      </div>
                      <Slider value={[zoom * 100]} min={10} max={200} step={1} onValueChange={(v) => setZoom((Array.isArray(v) ? v[0] : v) / 100)} className="py-2" />
                    </div>

                    {palette.length > 0 && (
                      <div className="space-y-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                           <Sparkles className="w-4 h-4 text-primary" />
                           <Label className="text-[10px] uppercase font-black tracking-widest opacity-40 text-primary">Identity Palette</Label>
                        </div>
                        <div className="flex gap-3">
                          {palette.map((color, i) => (
                            <motion.div 
                              key={color}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="group relative"
                            >
                              <div 
                                className="w-10 h-10 rounded-xl border border-border shadow-lg cursor-pointer active:scale-90 transition-transform"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  navigator.clipboard.writeText(color);
                                  toast.success(`Copied ${color.toUpperCase()}`);
                                }}
                              />
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-card border border-border rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                 <span className="text-[8px] font-mono text-foreground font-black">{color.toUpperCase()}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full h-9 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-tighter gap-3 shadow-2xl shadow-primary/30 group active:scale-95 transition-all italic text-lg"
                      onClick={generateIcons}
                      disabled={isProcessing}
                    >
                      {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 group-hover:scale-125 transition-transform" />}
                      Architect Bundle
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* Center - Mockup Workspace */}
        <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[700px] lg:min-h-0">
          <header className="p-4 md:p-5 flex items-center justify-between bg-muted/40 backdrop-blur-3xl border-b border-border relative z-20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary via-primary to-blue-600 flex items-center justify-center border border-border shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] group overflow-hidden relative">
                 <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Zap className="w-8 h-8 md:w-10 md:h-10 text-foreground relative z-10" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-black text-xl md:text-xl tracking-tighter uppercase italic bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                  {defaultTitle ? `${defaultTitle}` : "Studio Identity Lab"}
                </h2>
                <div className="flex items-center gap-4">
                   <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 px-4 py-1 rounded-full font-black uppercase tracking-[0.2em] italic">
                       Pro Environment
                    </Badge>
                   <span className="text-[10px] text-muted-foreground/50 uppercase font-black tracking-widest truncate max-w-[250px]">{file?.name || "Matrix Standby"}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Sheet open={isMobileSettingsOpen} onOpenChange={setIsMobileSettingsOpen}>
                <SheetTrigger 
                  render={
                    <Button variant="outline" size="icon" className="lg:hidden rounded-2xl border-border bg-secondary/50 h-12 w-12 md:h-10 md:w-14 shadow-xl" />
                  }
                >
                  <Settings2 className="w-5 h-5" />
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[320px] p-0 bg-card border-border rounded-l-xl">
                  <SheetHeader className="px-4 py-3 border-b border-border">
                    <SheetTitle className="text-foreground flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter">
                      <Cpu className="w-6 h-6 text-primary" /> Matrix Inspector
                    </SheetTitle>
                  </SheetHeader>
                  <InspectorContent 
                    results={results} 
                    activeCategory={activeCategory} 
                    setActiveCategory={setActiveCategory} 
                    categories={categories} 
                    filteredResults={filteredResults} 
                    handleDownloadZip={handleDownloadZip} 
                    dataURLToBlob={dataURLToBlob} 
                  />
                </SheetContent>
              </Sheet>
            </div>
          </header>

          <div className="flex-grow relative flex flex-col items-center p-5 overflow-y-auto bg-background/40 scrollbar-none">
             <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
              style={{ 
                backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }} 
            />

            {!file ? (
                <>
                  <div className="max-w-sm w-full mx-auto mt-8 md:mt-12 pb-8 relative z-10">
                    <DropZone 
                      onFilesDrop={(fs) => { setFile(fs[0]); setPreview(URL.createObjectURL(fs[0])); setResults([]); }} 
                      title=" "
                      description=" "
                      className="h-48 bg-secondary/30 border-2 border-dashed border-border rounded-2xl hover:border-primary/50 transition-all group"
                    />
                  </div>

                  {/* Dynamic SEO Link Cloud */}
                  <div className="space-y-5 pt-8 border-t border-border relative z-10">
                    <h3 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-4">
                      <Layers className="w-8 h-8 text-primary" /> Identity Hub
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "png-to-ico", "svg-to-favicon", "android-icon-architect", "ios-touch-generator", "convert-image-to-favicon", "web-manifest-builder", "apple-touch-studio"
                      ].map((slug) => (
                        <Link 
                          key={slug}
                          href={`/image/favicon/${slug}`}
                          className="px-6 py-3 rounded-2xl bg-secondary/30 border border-border text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/20 hover:border-primary/40 hover:text-primary-foreground transition-all shadow-xl"
                        >
                          {slug.replace(/-/g, " ")}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full max-w-5xl relative z-10">
                {/* Browser Mockup v5 */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full rounded-3xl bg-card border border-border shadow-[0_120px_250px_-50px_rgba(0,0,0,1)] overflow-hidden group hover:border-primary/20 transition-all duration-1000 relative"
                >
                  <div className="h-12 bg-[#151515] border-b border-border flex items-center px-5 gap-3">
                    <div className="flex gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500/30" />
                      <div className="w-4 h-4 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                      <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/30" />
                    </div>
                    <div className="h-11 flex-grow max-w-2xl bg-muted/40 rounded-[1.25rem] border border-border flex items-center px-5 gap-4 shadow-inner group-hover:border-primary/40 transition-colors">
                      <div className="w-6 h-6 shrink-0 rounded-lg overflow-hidden bg-secondary/50 border border-border flex items-center justify-center shadow-2xl relative">
                        {preview ? <img src={preview} style={{ transform: `scale(${zoom})` }} className="w-full h-full object-contain" /> : <Globe className="w-4 h-4 text-foreground/5" />}
                        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-muted-foreground/50 tracking-[0.2em] uppercase leading-none mb-0.5">Live Environment</span>
                        <span className="text-[10px] font-bold text-muted-foreground/80 truncate italic">studio.private.tools/identity/v2</span>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-4 opacity-20">
                       <Plus className="w-4 h-4" />
                       <Search className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>

                {/* Windows 11 Desktop Simulation */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-full aspect-[16/9] rounded-3xl bg-card border border-border shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] overflow-hidden group hover:border-primary/20 transition-all duration-1000 relative"
                >
                  {/* Desktop Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-900/10 opacity-40" />
                  
                  {/* Desktop Shortcut */}
                  <div className="absolute top-16 left-16 flex flex-col items-center gap-3 group/shortcut cursor-pointer active:scale-95 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-muted/40 backdrop-blur-xl border border-border flex items-center justify-center p-0 shadow-2xl transition-all duration-500 group-hover/shortcut:border-primary/40 group-hover/shortcut:bg-primary/5 relative">
                      {preview ? <img src={preview} style={{ transform: `scale(${zoom})` }} className="w-full h-full object-contain relative z-10" /> : <div className="w-10 h-10 rounded-lg bg-secondary/50" />}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/shortcut:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] italic group-hover:text-foreground transition-colors">Identity</span>
                  </div>

                  {/* Taskbar */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] h-11 bg-muted/60 backdrop-blur-3xl border border-border rounded-xl flex items-center px-8 gap-4 shadow-2xl">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40 shadow-lg group-hover:scale-110 transition-transform">
                       <Grid className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-grow flex justify-center gap-3">
                       {Array.from({ length: 4 }).map((_, i) => (
                         <div key={i} className="w-12 h-12 rounded-xl bg-secondary/50 border border-border flex items-center justify-center opacity-40">
                            <div className="w-6 h-6 rounded-lg bg-secondary" />
                         </div>
                       ))}
                       {/* Active Identity App */}
                       <div className="relative group/active">
                         <div className="w-12 h-12 rounded-xl bg-secondary border border-primary/40 flex items-center justify-center p-2 shadow-2xl group-hover/active:scale-110 transition-all cursor-pointer">
                            {preview ? <img src={preview} style={{ transform: `scale(${zoom})` }} className="w-full h-full object-contain" /> : <div className="w-8 h-8 rounded-md bg-primary/20" />}
                         </div>
                         <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),1)]" />
                       </div>
                       {Array.from({ length: 3 }).map((_, i) => (
                         <div key={i+4} className="w-12 h-12 rounded-xl bg-secondary/50 border border-border flex items-center justify-center opacity-40">
                            <div className="w-6 h-6 rounded-lg bg-secondary" />
                         </div>
                       ))}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest italic">
                       <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 h-4 text-[7px]">Online</Badge>
                          <span>12:00</span>
                       </div>
                    </div>
                  </div>
                </motion.div>

                {/* Mac OS Desktop Simulation */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full aspect-[16/9] rounded-3xl bg-card border border-border shadow-[0_120px_250px_-50px_rgba(0,0,0,1)] overflow-hidden group hover:border-primary/20 transition-all duration-1000 relative"
                >
                  {/* Mac OS Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-background to-purple-900/10 opacity-50" />
                  
                  {/* Menu Bar */}
                  <div className="absolute top-0 inset-x-0 h-8 bg-secondary/50 backdrop-blur-3xl border-b border-border flex items-center px-8 justify-between">
                    <div className="flex items-center gap-3 text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest italic">
                       <span>Identity Lab</span>
                       <span>File</span>
                       <span>Edit</span>
                    </div>
                  </div>

                  {/* Desktop Shortcut */}
                  <div className="absolute top-20 right-16 flex flex-col items-center gap-3 group/macshortcut cursor-pointer active:scale-95 transition-all">
                    <div className="w-12 h-12 rounded-[22.5%] bg-muted/40 backdrop-blur-xl border border-border flex items-center justify-center p-0 shadow-2xl transition-all duration-500 group-hover/macshortcut:border-primary/40 group-hover/macshortcut:scale-110 relative">
                      {preview ? <img src={preview} style={{ transform: `scale(${zoom})` }} className="w-full h-full object-contain relative z-10" /> : <div className="w-10 h-10 rounded-2xl bg-secondary/50" />}
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] italic group-hover:text-foreground transition-colors">Project Identity</span>
                  </div>

                  {/* Mac OS Dock */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 h-12 bg-secondary backdrop-blur-3xl border border-border rounded-[1.75rem] flex items-center px-4 gap-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-2xl bg-secondary/50 border border-border flex items-center justify-center opacity-40">
                         <div className="w-8 h-8 rounded-lg bg-secondary" />
                      </div>
                    ))}
                    {/* Active Identity App */}
                    <div className="relative group/macactive pb-2">
                      <div className="w-10 h-10 rounded-[22.5%] bg-secondary border border-primary/40 flex items-center justify-center p-0 shadow-2xl group-hover/macactive:scale-125 transition-all cursor-pointer origin-bottom">
                         {preview ? <img src={preview} style={{ transform: `scale(${zoom})` }} className="w-full h-full object-contain" /> : <Zap className="w-8 h-8 rounded-[22.5%] bg-primary/20" />}
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/60 rounded-full shadow-lg" />
                    </div>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i+4} className="w-10 h-10 rounded-2xl bg-secondary/50 border border-border flex items-center justify-center opacity-40">
                         <div className="w-8 h-8 rounded-lg bg-secondary" />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Mobile Identity Mockup v5 - Multi-Platform Grid */}
                <motion.div 
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring", damping: 20 }}
                  className="relative aspect-[9/19] w-80 rounded-[5rem] bg-card border-[14px] border-[#151515] overflow-hidden shadow-[0_150px_300px_-50px_rgba(0,0,0,1)] ring-1 ring-white/10 group hover:border-primary/20 transition-all duration-1000 scale-105"
                >
                  <div className="absolute top-0 inset-x-0 h-12 bg-black flex items-center justify-center z-20">
                    <div className="w-28 h-7 bg-secondary/50 rounded-full border border-border" />
                  </div>
                  <div className="p-5 h-full flex flex-col items-center justify-center gap-5 relative bg-gradient-to-br from-primary/10 via-background to-black">
                    
                    <div className="w-full space-y-4 relative z-10">
                      {/* iOS & Desktop Simulation */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-4">
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic block ml-2">iOS Standard</span>
                          <div className="flex flex-col items-center gap-4 group/ios cursor-pointer active:scale-95 transition-all">
                            <div className="w-11 h-11 rounded-[22.5%] overflow-hidden bg-muted/60 backdrop-blur-3xl border border-border flex items-center justify-center p-0 shadow-2xl transition-all duration-500 group-hover/ios:border-primary/40 group-hover/ios:scale-110">
                              {preview ? <img src={preview} style={{ transform: `scale(${zoom})` }} className="w-full h-full object-contain" /> : <Zap className="w-8 h-8 text-foreground/5" />}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic block ml-2">Windows Core</span>
                          <div className="flex flex-col items-center gap-4 group/win cursor-pointer active:scale-95 transition-all">
                            <div className="w-11 h-11 rounded-none overflow-hidden bg-muted/60 backdrop-blur-3xl border border-border flex items-center justify-center p-0 shadow-2xl transition-all duration-500 group-hover/win:border-primary/40 group-hover/win:scale-110">
                              {preview ? <img src={preview} style={{ transform: `scale(${zoom})` }} className="w-full h-full object-contain" /> : <Grid className="w-8 h-8 text-foreground/5" />}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Simulation Matrix */}
                      <div className="space-y-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 italic block ml-2">Adaptive Protocols</span>
                        <div className="grid grid-cols-4 gap-3">
                           {[
                             { name: "Circle", radius: "rounded-full" },
                             { name: "Pixel", radius: "rounded-2xl" },
                             { name: "T-Drop", radius: "rounded-full rounded-tr-none" },
                             { name: "Samsung", radius: "rounded-[35%]" },
                             { name: "Linux", radius: "rounded-[40%]" },
                             { name: "Hexagon", radius: "[mask-image:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTAgMEwxMDAgMjVWMDc1TDUwIDEwMEwwIDc1VjI1TDUwIDBaIi8+PC9zdmc+')] [mask-size:contain] [mask-repeat:no-repeat]" },
                             { name: "Octagon", radius: "[mask-image:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMEw3MCAwTDEwMCAzMEwxMDAgNzBMNzAgMTAwTDMwIDEwMEwwIDcwTDAgMzBaIi8+PC9zdmc+')] [mask-size:contain] [mask-repeat:no-repeat]" },
                             { name: "Legacy", radius: "rounded-sm" }
                           ].map((s) => (
                             <div key={s.name} className="flex flex-col items-center gap-2 group/variant cursor-pointer active:scale-95 transition-all">
                                <div className={cn("w-12 h-12 overflow-hidden bg-muted/60 border border-border flex items-center justify-center p-0 shadow-xl group-hover/variant:border-primary/40 group-hover/variant:scale-110 transition-all", s.radius)}>
                                   {preview ? <img src={preview} style={{ transform: `scale(${zoom})` }} className="w-full h-full object-contain" /> : <div className={cn("w-6 h-6 bg-secondary/50", s.radius)} />}
                                </div>
                                <span className="text-[6px] font-black text-muted-foreground/40 uppercase tracking-widest">{s.name}</span>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-5 w-full opacity-[0.01] group-hover:opacity-[0.02] transition-opacity duration-1000">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-2xl bg-white" />
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-secondary rounded-full" />
                </motion.div>

                {/* Processing Overlay */}
                <AnimatePresence>
                  {isProcessing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-muted/60 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center gap-4">
                       <div className="relative">
                          <Loader2 className="w-24 h-24 animate-spin text-primary opacity-20" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                          </div>
                       </div>
                       <div className="flex flex-col items-center gap-2">
                          <p className="text-[14px] font-black uppercase tracking-[0.6em] text-primary animate-pulse italic">Architecting Bundle</p>
                          <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Multi-Platform Matrix Resampling</p>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>

        {/* Right Sidebar - Engine Inspector / Asset Matrix */}
        <aside className="flex w-full lg:w-[300px] border-t lg:border-t-0 lg:border-l border-border glass-card shrink-0 flex-col relative z-10 shadow-2xl h-[600px] lg:h-full">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-black/10 shrink-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Studio Matrix
              </h3>
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">WASM Thread Execution</p>
            </div>
            <Badge variant="outline" className="text-[9px] border-border bg-secondary/50 text-muted-foreground/50 uppercase font-black px-4 py-1.5 rounded-full italic">Active</Badge>
          </div>
          <InspectorContent 
            results={results} 
            activeCategory={activeCategory} 
            setActiveCategory={setActiveCategory} 
            categories={categories} 
            filteredResults={filteredResults} 
            handleDownloadZip={handleDownloadZip} 
            dataURLToBlob={dataURLToBlob} 
          />
        </aside>

      </main>
      
      {/* Mobile FAB */}
      <AnimatePresence>
        {file && !isProcessing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="lg:hidden fixed bottom-12 right-6 z-50 flex flex-col gap-4"
          >
             <Button 
              className="w-11 h-11 rounded-full bg-white text-black shadow-2xl flex items-center justify-center p-0 border-4 border-border active:scale-90 transition-all shadow-black/60"
              onClick={() => { setFile(null); setResults([]); setPreview(null); }}
             >
               <Trash2 className="w-8 h-8" />
             </Button>
             <Button 
              className="w-11 h-11 rounded-full bg-primary shadow-[0_20px_50px_rgba(var(--primary-rgb),0.5)] flex items-center justify-center p-0 border-4 border-border active:scale-90 transition-all"
              onClick={generateIcons}
              disabled={isProcessing}
             >
               <Zap className="w-8 h-8 text-foreground" />
             </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



const InspectorContent = ({ 
  results, 
  activeCategory, 
  setActiveCategory, 
  categories, 
  filteredResults, 
  handleDownloadZip,
  dataURLToBlob
}: { 
  results: FaviconResult[], 
  activeCategory: string, 
  setActiveCategory: (cat: string) => void, 
  categories: string[], 
  filteredResults: FaviconResult[], 
  handleDownloadZip: () => void,
  dataURLToBlob: (dataUrl: string) => Blob
}) => (
  <div className="flex flex-col h-full bg-card min-h-0">
    <div className="px-8 py-8 border-b border-border bg-muted/40 backdrop-blur-xl shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-1">
           <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Matrix Output</h4>
           <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Atomic Node Synthesis</p>
        </div>
        <Badge variant="outline" className="text-[10px] border-border bg-secondary/50 text-muted-foreground/60 px-4 py-1.5 rounded-full font-black">{results.length} NODES</Badge>
      </div>
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="bg-muted/40 border border-border rounded-xl w-full p-1.5 h-10">
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat} className="flex-grow rounded-xl text-[10px] uppercase font-black tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] transition-all italic">{cat}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>

    <ScrollArea className="flex-grow min-h-0">
      <div className="p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredResults.map((r, i) => (
            <motion.div
              key={r.name}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group p-5 rounded-2xl bg-secondary/30 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center gap-3 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center p-4 shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-500 relative">
                <img src={r.url} className="max-w-full max-h-full object-contain relative z-10" alt="" />
                <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-[11px] font-black truncate text-foreground uppercase tracking-wider mb-2 leading-none italic">{r.name.split('/').pop()}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[8px] px-2 h-4 border-border bg-secondary/50 text-muted-foreground/60 uppercase font-black">{r.size}</Badge>
                  <div className="w-1 h-1 rounded-full bg-secondary" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">{r.category}</span>
                </div>
              </div>
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => {
                  ExportManager.downloadFile(
                    dataURLToBlob(r.url), 
                    r.name.split('/').pop()!
                  );
                }}
                className="h-12 w-12 rounded-2xl opacity-0 group-hover:opacity-100 text-primary hover:bg-primary/20 transition-all active:scale-90"
              >
                <Download className="w-5 h-5" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        {results.length === 0 && (
          <div className="py-40 text-center space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-secondary/50 border border-dashed border-border mx-auto flex items-center justify-center relative overflow-hidden">
              <Grid className="w-10 h-10 text-muted-foreground/40 group-hover:rotate-90 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-black uppercase tracking-[0.4em] text-muted-foreground/40">Matrix Standby</p>
              <p className="text-[9px] text-foreground/10 uppercase font-bold tracking-widest">Architect identity to populate nodes</p>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
    
    <div className="p-8 border-t border-border bg-muted/40 shrink-0">
      <Button 
        className="w-full h-18 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xl gap-4 shadow-2xl shadow-primary/30 group active:scale-95 transition-all italic tracking-tighter"
        onClick={handleDownloadZip}
        disabled={results.length === 0}
      >
        <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
          <DownloadCloud className="w-5 h-5" />
        </div>
        Export Studio Bundle
      </Button>
    </div>
  </div>
);
