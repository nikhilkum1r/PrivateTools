"use client";

import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Palette, Copy, Check, Trash2, Pipette,
  Layers, Search, 
  Settings2, RefreshCw,
  Info, Eye, Loader2, Wand2,
  Cpu, Play, Smartphone, ShieldCheck, FileDown,
  Zap, ArrowLeftRight, CheckSquare, Wind, Layout,
  ArrowRight, DownloadCloud, Sparkles, Monitor, Lock, Globe,
  CheckCircle2, Plus, HardDrive, Scaling, Undo2
} from "lucide-react";
import { DropZone } from "@/components/shared/DropZone";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FAQ } from "@/components/shared/FAQ";
import { Footer } from "@/components/shared/Footer";
import { TrustLayer } from "@/components/shared/TrustLayer";
import { RelatedTools } from "@/components/shared/RelatedTools";
import { COLOR_PICKER_FAQ } from "@/lib/faq-content";
import Link from "next/link";

interface ColorSwatch {
  hex: string;
  rgb: string;
  hsl: string;
  isDark: boolean;
  type: "dominant" | "vibrant" | "muted" | "accent";
}

const STUDIO_STYLES = `
  @keyframes background-animate {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .background-animate {
    background-size: 200% 200%;
    animation: background-animate 3s linear infinite;
  }
`;

export default function ColorLabClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorSwatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sampleRate, setSampleRate] = useState(10);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<"palette" | "grading" | "contrast">("palette");
  const [exportFormat, setExportFormat] = useState<"css" | "scss" | "json">("css");
  const [showHarmony, setShowHarmony] = useState<string | null>(null);
  const [mood, setMood] = useState<string>("Neutral");
  
  const imageRef = useRef<HTMLImageElement>(null);
  const toolSectionRef = useRef<HTMLDivElement>(null);

  const handleFilesDrop = (files: File[]) => {
    if (files[0]) {
      setFile(files[0]);
      setPreview(URL.createObjectURL(files[0]));
      setColors([]);
      // Scroll to tool section if not already visible
      toolSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const toLinear = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  const getContrastRatio = (hex: string) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    const lum = getLuminance(r, g, b);
    const white = 1;
    const contrastWhite = (white + 0.05) / (lum + 0.05);
    const contrastBlack = (lum + 0.05) / (0 + 0.05);
    return { 
      onWhite: contrastWhite.toFixed(1), 
      onBlack: contrastBlack.toFixed(1), 
      passAA: contrastWhite >= 4.5 || contrastBlack >= 4.5, 
      passAAA: contrastWhite >= 7 || contrastBlack >= 7 
    };
  };

  const getHarmonyColors = (hex: string) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    // Convert to HSL
    const rn = r/255, gn = g/255, bn = b/255;
    const max = Math.max(rn,gn,bn), min = Math.min(rn,gn,bn);
    let h = 0, s = 0;
    const l = (max+min)/2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      if (max === rn) h = (gn-bn)/d + (gn < bn ? 6 : 0);
      else if (max === gn) h = (bn-rn)/d + 2;
      else h = (rn-gn)/d + 4;
      h /= 6;
    }
    const hDeg = Math.round(h * 360);
    const sat = Math.round(s * 100);
    const light = Math.round(l * 100);
    const hslToHex = (hh: number, ss: number, ll: number) => {
      const hslF = (n: number) => { const k = (n + hh/30) % 12; const a = ss/100 * Math.min(ll/100, 1-ll/100); return Math.round(255*(ll/100 - a*Math.max(-1,Math.min(k-3,9-k,1)))); };
      return `#${[hslF(0),hslF(8),hslF(4)].map(x => x.toString(16).padStart(2,'0')).join('')}`;
    };
    return [
      { label: "Comp.", hex: hslToHex((hDeg+180)%360, sat, light) },
      { label: "Triadic A", hex: hslToHex((hDeg+120)%360, sat, light) },
      { label: "Triadic B", hex: hslToHex((hDeg+240)%360, sat, light) },
      { label: "Analogous", hex: hslToHex((hDeg+30)%360, sat, light) },
    ];
  };

  const exportPalette = () => {
    let content = "";
    if (exportFormat === "css") {
      content = ":root {\n" + colors.map((c,i) => `  --color-${c.type}-${i+1}: ${c.hex};`).join("\n") + "\n}";
    } else if (exportFormat === "scss") {
      content = colors.map((c,i) => `$color-${c.type}-${i+1}: ${c.hex};`).join("\n");
    } else {
      content = JSON.stringify({ palette: colors.map((c,i) => ({ name: `${c.type}-${i+1}`, hex: c.hex, rgb: c.rgb, hsl: c.hsl })) }, null, 2);
    }
    const ext = exportFormat === "json" ? "json" : exportFormat;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `palette.${ext}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast.success(`Exported as ${exportFormat.toUpperCase()}`);
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const extractPalette = async () => {
    if (!imageRef.current) return;
    setIsProcessing(true);
    const img = imageRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scale = Math.min(1, 1000 / Math.max(img.naturalWidth, img.naturalHeight));
    canvas.width = img.naturalWidth * scale;
    canvas.height = img.naturalHeight * scale;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorCounts: Record<string, number> = {};
    for (let i = 0; i < imageData.length; i += 4 * sampleRate) {
      const r = imageData[i], g = imageData[i + 1], b = imageData[i + 2];
      const qr = Math.round(r / 15) * 15, qg = Math.round(g / 15) * 15, qb = Math.round(b / 15) * 15;
      const key = `${qr},${qg},${qb}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }
    const sortedColors = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key], index) => {
        const [r, g, b] = key.split(',').map(Number);
        const hex = rgbToHex(r, g, b);
        let type: ColorSwatch["type"] = "dominant";
        if (index > 0 && index < 4) type = "vibrant";
        if (index >= 4 && index < 7) type = "muted";
        if (index >= 7) type = "accent";
        return { hex, rgb: `rgb(${r}, ${g}, ${b})`, hsl: rgbToHsl(r, g, b), isDark: getLuminance(r, g, b) < 0.5, type };
      });
    // Detect mood
    const avgLum = sortedColors.reduce((acc, c) => acc + (c.isDark ? 0 : 1), 0) / sortedColors.length;
    setMood(avgLum > 0.7 ? "Ethereal & Airy" : avgLum < 0.3 ? "Moody & Deep" : "Natural & Balanced");
    
    setColors(sortedColors);
    setIsProcessing(false);
  };

  const pickColor = async () => {
    // @ts-ignore
    if (!window.EyeDropper) {
      toast.error("Your browser doesn't support the EyeDropper API. Try Chrome, Edge or Opera.");
      return;
    }
    // @ts-ignore
    const eyeDropper = new window.EyeDropper();
    try {
      const result = await eyeDropper.open();
      const hex = result.sRGBHex.toUpperCase();
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      
      // Check if already exists
      if (colors.some(c => c.hex.toUpperCase() === hex)) {
        toast.info("Color already in palette");
        return;
      }

      const newSwatch: ColorSwatch = {
        hex,
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: rgbToHsl(r, g, b),
        isDark: getLuminance(r, g, b) < 0.5,
        type: "accent"
      };
      setColors(prev => [newSwatch, ...prev]);
      toast.success(`Added custom color: ${hex}`);
    } catch (e) {
      // User cancelled
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 2000);
    toast.success(`Copied: ${text.toUpperCase()}`);
  };

  const resetTool = () => {
    setFile(null);
    setPreview(null);
    setColors([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 relative overflow-x-hidden">
      <style>{STUDIO_STYLES}</style>
      
      {/* Studio Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <Navbar />

      <main className="flex-grow relative z-10">
        {/* HERO SECTION */}
        <section className="relative px-6 py-24 md:py-40 flex flex-col items-center text-center overflow-hidden">
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-12 relative z-10"
           >
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-card border border-primary/20 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Professional Chromatic Analyzer</span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic font-heading leading-[0.9]">
                  Image Color Picker <br />
                  <span className="text-primary">& Palette Generator</span>
                </h1>
                <p className="text-muted-foreground text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed italic">
                  Extract dominant colors from any image instantly. Generate HEX, RGB, HSL, CMYK palettes, gradients, Tailwind colors, and accessibility-safe combinations directly in your browser with zero uploads.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-all gap-3"
                  onClick={() => toolSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Wand2 className="w-5 h-5" /> Extract Colors Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-16 px-10 rounded-2xl border-border bg-secondary/50 font-black uppercase tracking-widest text-sm hover:bg-secondary transition-all gap-3"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files) handleFilesDrop(Array.from(files));
                    };
                    input.click();
                  }}
                >
                  <Plus className="w-5 h-5" /> Upload Image
                </Button>
              </div>

              <div className="pt-12 grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { l: "100% Private", i: ShieldCheck },
                  { l: "Browser-Based", i: Monitor },
                  { l: "No Upload", i: Lock },
                  { l: "Free Forever", i: Zap },
                  { l: "Lightning Fast", i: Globe }
                ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
                    <b.i className="w-5 h-5 text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{b.l}</span>
                  </div>
                ))}
              </div>
           </motion.div>

           {/* Floating Background Elements */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none -z-10">
              <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
           </div>
        </section>

        {/* FEATURE SHOWCASE SECTION */}
        <section className="px-6 py-24 md:py-32 bg-secondary/10 relative overflow-hidden border-y border-border/40">
           <div className="max-w-7xl mx-auto space-y-20">
              <div className="flex flex-col items-center text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic font-heading">Powerful Color Extraction Tools</h2>
                <div className="w-20 h-1 bg-primary rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "AI Palette Extraction",
                    desc: "Automatically detect dominant and accent colors from images with advanced smart extraction algorithms.",
                    icon: Wand2
                  },
                  {
                    title: "Pro Format Converter",
                    desc: "Convert colors instantly between HEX, RGB, HSL & CMYK for design, branding, and development.",
                    icon: ArrowLeftRight
                  },
                  {
                    title: "Gradient Generator",
                    desc: "Create stunning linear, radial, and mesh gradients from extracted image palettes.",
                    icon: Sparkles
                  },
                  {
                    title: "Contrast Checker",
                    desc: "Check WCAG AA and AAA accessibility compliance for readable text and UI combinations.",
                    icon: CheckCircle2
                  },
                  {
                    title: "Tailwind & CSS Export",
                    desc: "Export generated colors directly into Tailwind CSS config files and CSS variables.",
                    icon: Layout
                  },
                  {
                    title: "Brand Color Detection",
                    desc: "Extract logo and brand colors from screenshots, websites, and uploaded images.",
                    icon: Search
                  },
                  {
                    title: "Privacy First",
                    desc: "All color extraction happens locally in your browser for maximum privacy and speed.",
                    icon: ShieldCheck
                  },
                  {
                    title: "Multi-Format Support",
                    desc: "Supports PNG, JPG, WEBP, GIF, SVG, AVIF, BMP, ICO and more image formats.",
                    icon: Layers
                  }
                ].map((f, i) => (
                  <Card key={i} className="p-8 rounded-[32px] glass-card border-border/40 hover:border-primary/50 transition-all group hover:bg-primary/[0.02]">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      <f.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-widest italic mb-4">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </Card>
                ))}
              </div>
           </div>
        </section>

        {/* TOOL SECTION */}
        <section ref={toolSectionRef} id="tool" className="px-6 py-24 md:py-32 relative">
           <div className="max-w-7xl mx-auto space-y-12">
              <div className="flex flex-col items-center text-center space-y-4">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic font-heading">Extract Colors From Images Instantly</h2>
                <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">High-Fidelity Neural Scan Engine</p>
              </div>

              <div className="relative group max-w-5xl mx-auto">
                  {/* Neural Scan Line Animation */}
                  <AnimatePresence>
                    {isProcessing && (
                      <motion.div
                        className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent blur-md z-20 pointer-events-none"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      />
                    )}
                  </AnimatePresence>

                  {!file ? (
                    <div className="relative overflow-hidden rounded-[40px] border border-border/40 hover:border-primary/50 transition-all duration-700 shadow-2xl glass-card">
                      <DropZone
                        onFilesDrop={handleFilesDrop}
                        multiple={false}
                        accept="image/*"
                        title="Drag and drop your image here"
                        description="or click to browse local files"
                        className="h-80 border-none bg-transparent hover:bg-primary/[0.02] transition-colors"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      {/* Left: Preview & Controls */}
                      <div className="lg:col-span-5 space-y-6">
                        <Card className="p-1 rounded-[32px] bg-gradient-to-br from-primary/20 via-transparent to-primary/5 overflow-hidden">
                          <div className="relative aspect-square rounded-[31px] overflow-hidden bg-muted/40 group">
                            <img 
                              ref={imageRef}
                              src={preview!} 
                              crossOrigin="anonymous"
                              onLoad={extractPalette}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                              alt="Source for color extraction" 
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                               <Button variant="ghost" className="rounded-2xl text-red-500 hover:bg-red-500/10" onClick={resetTool}>
                                  <Trash2 className="w-8 h-8" />
                               </Button>
                            </div>
                          </div>
                        </Card>

                         <Card className="p-8 rounded-[32px] glass-card border-border/40 space-y-8">
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Precision</Label>
                                <p className="text-xs font-mono font-black text-primary">{sampleRate}px</p>
                              </div>
                              <div className="text-right space-y-1">
                                <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Mood</Label>
                                <p className="text-xs font-black italic text-emerald-500 uppercase">{mood}</p>
                              </div>
                           </div>
                           
                           <Slider 
                              value={[sampleRate]} 
                              min={1} max={50} step={1} 
                              onValueChange={(v) => setSampleRate(Array.isArray(v) ? v[0] : v)}
                              className="py-2"
                           />

                           <div className="grid grid-cols-1 gap-3">
                              <Button 
                                className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-emerald-600/20"
                                onClick={pickColor}
                              >
                                <Pipette className="w-5 h-5" /> Pick Custom Color
                              </Button>
                              <Button 
                                variant="outline"
                                className="h-14 rounded-2xl border-border bg-secondary/50 font-black uppercase tracking-widest text-xs gap-3 hover:bg-secondary transition-all"
                                onClick={extractPalette}
                                disabled={isProcessing}
                              >
                                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                                Regenerate Full Palette
                              </Button>
                           </div>
                        </Card>
                      </div>

                      {/* Right: Palette Result */}
                      <div className="lg:col-span-7 space-y-6">
                        <header className="flex flex-col gap-6 p-8 rounded-[32px] glass-card border border-border/40">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-col">
                              <h3 className="text-xl font-black uppercase tracking-tighter italic">Extracted Palette</h3>
                              <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest">{colors.length} Swatches found</p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="flex p-1 bg-secondary/50 border border-border rounded-xl">
                                {(["css", "scss", "json"] as const).map(fmt => (
                                  <button 
                                    key={fmt} 
                                    onClick={() => setExportFormat(fmt)} 
                                    className={cn(
                                      "px-4 h-9 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all relative overflow-hidden", 
                                      exportFormat === fmt 
                                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 scale-105 z-10" 
                                        : "text-muted-foreground/50 hover:text-emerald-500 hover:bg-emerald-500/5"
                                    )}
                                  >
                                    {fmt}
                                    {exportFormat === fmt && (
                                      <motion.div 
                                        layoutId="activeExportTab"
                                        className="absolute inset-0 bg-emerald-600 opacity-20 blur-lg"
                                        initial={false}
                                      />
                                    )}
                                  </button>
                                ))}
                              </div>
                              <Button variant="outline" className="h-11 px-6 rounded-xl border-border bg-secondary/50 text-foreground font-black gap-2 hover:bg-secondary transition-all text-xs" onClick={exportPalette}>
                                <FileDown className="w-4 h-4" /> Export
                              </Button>
                            </div>
                          </div>

                          {/* Palette Stripe Visualization */}
                          <div className="flex h-12 w-full rounded-2xl overflow-hidden shadow-inner bg-secondary/20 border border-border/40">
                             {colors.map((c, i) => (
                               <motion.div 
                                 key={c.hex}
                                 className="h-full flex-grow cursor-pointer group relative"
                                 style={{ backgroundColor: c.hex }}
                                 initial={{ flexGrow: 0 }}
                                 animate={{ flexGrow: 1 }}
                                 onClick={() => copyToClipboard(c.hex)}
                               >
                                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/20 flex items-center justify-center transition-opacity">
                                     <Copy className={cn("w-4 h-4", c.isDark ? "text-white" : "text-black")} />
                                  </div>
                               </motion.div>
                             ))}
                          </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <AnimatePresence mode="popLayout">
                              {colors.map((c, i) => (
                                <motion.div
                                  key={c.hex}
                                  layout
                                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                >
                                  <Card 
                                    className="group p-5 rounded-[24px] glass-card border border-border/40 flex flex-col gap-4 hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden"
                                    onClick={() => copyToClipboard(c.hex)}
                                  >
                                     <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl border-4 border-border/50 shadow-2xl shrink-0 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden" style={{ backgroundColor: c.hex }}>
                                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                                              <Copy className={cn("w-6 h-6", c.isDark ? "text-foreground" : "text-black")} />
                                           </div>
                                        </div>
                                        <div className="flex-grow min-w-0 space-y-1">
                                           <div className="flex items-center justify-between">
                                              <p className="font-black text-xl tracking-tighter uppercase italic">{c.hex}</p>
                                              <Badge className={cn(
                                                "text-[8px] font-black border-none px-2 h-5 uppercase tracking-widest rounded-full",
                                                c.type === "dominant" ? "bg-primary text-primary-foreground" :
                                                c.type === "vibrant" ? "bg-blue-600 text-white" :
                                                c.type === "muted" ? "bg-secondary text-muted-foreground/60" :
                                                "bg-orange-600 text-white"
                                              )}>{c.type}</Badge>
                                           </div>
                                           <div className="flex gap-2 opacity-30 text-[8px] font-black uppercase tracking-widest">
                                              <span>{c.rgb}</span>
                                              <span>{c.hsl}</span>
                                           </div>
                                           {(() => { const cr = getContrastRatio(c.hex); return (
                                              <div className="flex gap-1.5 pt-1">
                                                <span className={cn("px-2 py-0.5 rounded-md text-[8px] font-black uppercase", cr.passAAA ? "bg-emerald-500/20 text-emerald-400" : cr.passAA ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400")}>
                                                  WCAG {cr.passAAA ? "AAA" : cr.passAA ? "AA" : "FAIL"}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md text-[8px] font-black bg-secondary/50 text-muted-foreground/50">W: {cr.onWhite}</span>
                                                <span className="px-2 py-0.5 rounded-md text-[8px] font-black bg-muted/40 text-muted-foreground/50">B: {cr.onBlack}</span>
                                              </div>
                                           ); })()}
                                        </div>
                                     </div>
                                     
                                     <div className="flex gap-2 pt-3 border-t border-border/20">
                                        <button onClick={(e) => { e.stopPropagation(); copyToClipboard(c.hex); }} className="flex-1 text-[9px] font-black uppercase tracking-widest py-2 rounded-lg bg-secondary/30 hover:bg-primary/20 hover:text-primary transition-all">HEX</button>
                                        <button onClick={(e) => { e.stopPropagation(); copyToClipboard(c.rgb); }} className="flex-1 text-[9px] font-black uppercase tracking-widest py-2 rounded-lg bg-secondary/30 hover:bg-primary/20 hover:text-primary transition-all">RGB</button>
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setShowHarmony(showHarmony === c.hex ? null : c.hex); }} 
                                          className={cn(
                                            "flex-1 text-[9px] font-black uppercase tracking-widest py-2 rounded-lg transition-all italic",
                                            showHarmony === c.hex ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-secondary/30 hover:bg-emerald-500/20 hover:text-emerald-500"
                                          )}
                                        >
                                          Harmony
                                        </button>
                                     </div>

                                     {showHarmony === c.hex && (
                                       <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 pt-1">
                                         {getHarmonyColors(c.hex).map(h => (
                                           <div key={h.label} className="flex-1 text-center space-y-1" onClick={(e) => { e.stopPropagation(); copyToClipboard(h.hex); }}>
                                             <div className="w-full h-8 rounded-lg border border-border/40 cursor-pointer hover:scale-105 transition-transform" style={{ backgroundColor: h.hex }} />
                                             <p className="text-[6px] font-black uppercase tracking-widest opacity-30">{h.label}</p>
                                           </div>
                                         ))}
                                       </motion.div>
                                     )}
                                  </Card>
                                </motion.div>
                              ))}
                           </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
           </div>
        </section>

        {/* DESIGNER SECTION */}
        <section className="px-6 py-24 md:py-32 border-t border-border/40 bg-muted/20">
           <div className="max-w-7xl mx-auto space-y-20">
              <div className="flex flex-col items-center text-center space-y-6">
                 <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic font-heading">Perfect for Designers, Developers & Creators</h2>
                 <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto italic font-medium">Build harmonious design systems instantly from any visual source.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   {
                     title: "Designers",
                     points: ["UI/UX Projects", "Branding & Logos", "Illustrations", "Marketing Materials"],
                     icon: Layout,
                     color: "text-primary"
                   },
                   {
                     title: "Developers",
                     points: ["CSS Variables", "Tailwind Themes", "SCSS Color Maps", "Design Tokens"],
                     icon: Cpu,
                     color: "text-blue-400"
                   },
                   {
                     title: "Content Creators",
                     points: ["Instagram Aesthetics", "YouTube Branding", "Social Media Themes", "Visual Consistency"],
                     icon: Smartphone,
                     color: "text-emerald-400"
                   }
                 ].map((s, i) => (
                   <Card key={i} className="p-10 rounded-[40px] glass-card border-border/40 flex flex-col gap-8 hover:bg-primary/[0.01] transition-all">
                      <div className={cn("w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center", s.color)}>
                         <s.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter italic">{s.title}</h3>
                      <ul className="space-y-4">
                         {s.points.map((p, pi) => (
                           <li key={pi} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-primary" /> {p}
                           </li>
                         ))}
                      </ul>
                   </Card>
                 ))}
              </div>
           </div>
        </section>

        {/* LONG-FORM SEO CONTENT */}
        <section className="px-6 py-24 md:py-40">
           <div className="max-w-5xl mx-auto space-y-32">
              {/* How to Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                 <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic font-heading leading-none">How to Extract Colors From an Image Online</h2>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      Extracting colors from an image helps designers, developers, marketers, and creators build visually consistent projects. Our free online image color picker analyzes uploaded images and detects dominant, vibrant, muted, and complementary colors automatically.
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-lg italic">
                      Unlike traditional desktop software, this browser-based color extractor works instantly without requiring installation or uploads to external servers.
                    </p>
                    <div className="space-y-4 pt-4">
                       {[
                         "Upload your image",
                         "Wait for automatic analysis",
                         "Copy or export your palette",
                         "Use the generated colors in your project"
                       ].map((step, si) => (
                         <div key={si} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/40">
                            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-black italic">{si + 1}</span>
                            <span className="font-bold uppercase tracking-widest text-xs">{step}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="relative aspect-square rounded-[40px] bg-gradient-to-br from-primary/20 via-blue-500/10 to-primary/5 p-1">
                    <div className="w-full h-full rounded-[39px] glass-card border border-border/40 flex items-center justify-center p-12 text-center relative overflow-hidden">
                       <Palette className="w-32 h-32 text-primary/20 absolute -top-10 -right-10 rotate-12" />
                       <Search className="w-24 h-24 text-blue-500/10 absolute -bottom-10 -left-10 -rotate-12" />
                       <div className="space-y-6 relative z-10">
                          <h4 className="text-2xl font-black uppercase tracking-tighter italic">Instant Chromatic Precision</h4>
                          <p className="text-sm text-muted-foreground italic font-medium leading-relaxed">Everything runs locally on your machine. No lag, no latency, total privacy.</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Educational Section */}
              <div className="space-y-16">
                 <div className="flex flex-col items-center text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic font-heading">Understanding Color Formats</h2>
                    <p className="text-muted-foreground max-w-2xl italic font-medium">Master the professional standards of digital and print design.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      {
                        title: "HEX Colors",
                        desc: "Commonly used in web development and CSS styling. Perfect for designers and devs.",
                        example: "#2563EB"
                      },
                      {
                        title: "RGB Colors",
                        desc: "Red, Green, Blue. Used primarily for digital screens and UI design systems.",
                        example: "rgb(37, 99, 235)"
                      },
                      {
                        title: "HSL Colors",
                        desc: "Hue, Saturation, Lightness. Useful for generating shades and harmonious variations.",
                        example: "hsl(221, 83%, 53%)"
                      },
                      {
                        title: "CMYK Colors",
                        desc: "Cyan, Magenta, Yellow, Key (Black). Used in professional print and publishing.",
                        example: "cmyk(84, 58, 0, 8)"
                      }
                    ].map((fmt, i) => (
                      <Card key={i} className="p-10 rounded-[40px] glass-card border-border/40 space-y-6">
                         <h3 className="text-2xl font-black uppercase tracking-tighter italic text-primary">{fmt.title}</h3>
                         <p className="text-muted-foreground leading-relaxed font-medium">{fmt.desc}</p>
                         <div className="p-4 rounded-xl bg-secondary/50 border border-border/40 flex items-center justify-between">
                            <code className="text-xs font-black font-mono tracking-widest">{fmt.example}</code>
                            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 hover:text-primary transition-colors">Copy</button>
                         </div>
                      </Card>
                    ))}
                 </div>
              </div>

              {/* Accessibility Section */}
              <div className="p-16 rounded-[60px] bg-emerald-500/5 border border-emerald-500/10 flex flex-col md:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic font-heading leading-none">Accessibility & WCAG Compliance</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                       Accessible color combinations are essential for readable websites and inclusive design. Our tool helps verify WCAG AA and AAA compliance for text readability and UI contrast.
                    </p>
                    <div className="flex flex-wrap gap-3">
                       {["SaaS Platforms", "Mobile Apps", "Dashboards", "Education Tools"].map((use, i) => (
                         <Badge key={i} variant="outline" className="px-4 py-2 rounded-full border-emerald-500/20 text-emerald-500 font-black uppercase tracking-widest text-[10px] italic">{use}</Badge>
                       ))}
                    </div>
                 </div>
                 <div className="w-full md:w-[350px] space-y-4">
                    <div className="p-8 rounded-[40px] bg-black/40 border border-white/5 space-y-6 shadow-2xl">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">AA Passed</span>
                          <span className="text-2xl font-black italic">4.5:1</span>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[70%]" />
                       </div>
                       <p className="text-[10px] text-muted-foreground/40 font-bold leading-relaxed italic uppercase tracking-widest text-center">Standard for Web Compliance</p>
                    </div>
                 </div>
              </div>

              {/* Gradient Section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                 <div className="md:col-span-7 space-y-8">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic font-heading leading-none">Beautiful CSS Gradients Automatically</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                       Generate modern UI backgrounds with smooth transitions. Export linear, radial, and mesh gradients based on your image colors instantly.
                    </p>
                    <div className="p-8 rounded-[40px] glass-card border border-border/40 font-mono text-xs overflow-x-auto">
                       <p className="text-blue-400">background: <span className="text-emerald-400">linear-gradient</span>(135deg, <span className="text-primary">#2563EB</span>, <span className="text-blue-600">#7C3AED</span>);</p>
                    </div>
                 </div>
                 <div className="md:col-span-5 h-[400px] rounded-[50px] bg-gradient-to-br from-primary via-blue-600 to-emerald-500 shadow-2xl shadow-primary/20 animate-pulse relative overflow-hidden group">
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-12 text-center">
                       <h4 className="text-3xl font-black uppercase tracking-tighter italic text-white drop-shadow-2xl">Dynamic <br /> Backgrounds</h4>
                    </div>
                 </div>
              </div>

              {/* Tailwind Section */}
              <div className="space-y-12">
                 <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-border/40 pb-12">
                    <div className="space-y-4">
                       <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic font-heading leading-none">Tailwind CSS Export</h2>
                       <p className="text-muted-foreground text-lg italic font-medium">Instantly transform palettes into theme configuration objects.</p>
                    </div>
                    <Badge className="bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/20 px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] italic">v4.0 Ready</Badge>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                       <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">Perfect for Next.js, React, and Vue projects using modern design systems like shadcn/ui.</p>
                       <ul className="space-y-3">
                          {["Seamless Integration", "Type-Safe Tokens", "Semantic Naming", "Copy-Paste Ready"].map((p, i) => (
                            <li key={i} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary">
                               <Check className="w-4 h-4" /> {p}
                            </li>
                          ))}
                       </ul>
                    </div>
                    <div className="p-8 rounded-[40px] glass-card border border-border/40 font-mono text-[10px] space-y-1">
                       <p className="text-muted-foreground/40">// tailwind.config.js</p>
                       <p className="text-blue-400">colors: {'{'}</p>
                       <p className="pl-4 text-emerald-400">primary: <span className="text-primary">"#2563EB"</span>,</p>
                       <p className="pl-4 text-emerald-400">secondary: <span className="text-blue-600">"#7C3AED"</span></p>
                       <p className="text-blue-400">{'}'}</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* COMPARISON SECTION */}
        <section className="px-6 py-24 md:py-32 bg-secondary/10 border-y border-border/40 relative overflow-hidden">
           <div className="max-w-7xl mx-auto space-y-20">
              <div className="flex flex-col items-center text-center space-y-4">
                 <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic font-heading">Why Choose SafeTools Color Picker</h2>
                 <p className="text-muted-foreground italic font-medium">The privacy-first standard for modern creatives.</p>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-border/40">
                          <th className="py-6 px-4 text-sm font-black uppercase tracking-widest">Feature</th>
                          <th className="py-6 px-4 text-sm font-black uppercase tracking-widest text-primary">SafeTools</th>
                          <th className="py-6 px-4 text-sm font-black uppercase tracking-widest text-muted-foreground/40">Other Tools</th>
                       </tr>
                    </thead>
                    <tbody>
                       {[
                         { f: "Browser-Based", s: "Yes", o: "Sometimes" },
                         { f: "No Upload Required", s: "Yes", o: "No" },
                         { f: "Tailwind Export", s: "Yes", o: "Limited" },
                         { f: "Accessibility Checker", s: "Yes", o: "Limited" },
                         { f: "Privacy Focused", s: "Yes", o: "No" },
                         { f: "Free Forever", s: "Yes", o: "Often Limited" }
                       ].map((row, i) => (
                         <tr key={i} className="border-b border-border/20 hover:bg-white/[0.02] transition-colors">
                            <td className="py-6 px-4 text-xs font-bold uppercase tracking-widest">{row.f}</td>
                            <td className="py-6 px-4 text-xs font-black text-emerald-500 italic">{row.s}</td>
                            <td className="py-6 px-4 text-xs font-medium text-muted-foreground/40 italic">{row.o}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </section>

        {/* USE CASES SECTION */}
        <section className="px-6 py-24 md:py-32">
           <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {[
                { title: "Website Design", desc: "Modern palettes", icon: Globe },
                { title: "Branding", desc: "Consistent systems", icon: ShieldCheck },
                { title: "UI/UX Design", desc: "Harmonious UI", icon: Layout },
                { title: "App Dev", desc: "Design tokens", icon: Smartphone },
                { title: "Marketing", desc: "Visual campaigns", icon: Zap },
                { title: "Social Media", desc: "Aesthetics", icon: Play }
              ].map((uc, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-4 group">
                   <div className="w-16 h-16 rounded-3xl bg-secondary/50 border border-border/40 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/40 transition-all group-hover:-translate-y-2">
                      <uc.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-[10px] font-black uppercase tracking-widest">{uc.title}</h4>
                      <p className="text-[8px] text-muted-foreground/40 font-bold uppercase tracking-[0.2em]">{uc.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* FAQ SECTION */}
        <section className="px-6 py-24 md:py-32 bg-muted/20 border-t border-border/40">
           <div className="max-w-4xl mx-auto space-y-16">
              <div className="flex flex-col items-center text-center space-y-4">
                 <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic font-heading">Frequently Asked Questions</h2>
                 <p className="text-muted-foreground italic font-medium">Everything you need to know about our image color picker.</p>
              </div>
              <FAQ items={COLOR_PICKER_FAQ} />
           </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="px-6 py-32 md:py-48 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-600/10 to-transparent pointer-events-none" />
           <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic font-heading leading-none">Start Extracting Beautiful Color Palettes Now</h2>
              <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto italic">Upload your image and generate professional color palettes instantly with privacy-first browser processing.</p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <Button 
                  size="lg" 
                  className="h-20 px-12 rounded-[2rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-lg shadow-[0_0_60px_rgba(var(--color-primary-rgb),0.4)] hover:scale-105 active:scale-95 transition-all gap-4 group"
                  onClick={() => toolSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Generate Palette <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Button>
                <Link href="/image">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-20 px-12 rounded-[2rem] border-border bg-secondary/50 font-black uppercase tracking-widest text-lg hover:bg-secondary transition-all gap-4"
                  >
                    Explore Tools
                  </Button>
                </Link>
              </div>
           </div>
        </section>

        <RelatedTools 
          title="Explore More Creative Tools"
          tools={[
            { name: "Image Compressor", href: "/image/compress" },
            { name: "Background Remover", href: "/image/remove-bg" },
            { name: "Image Converter", href: "/image/convert" },
            { name: "PDF to Image", href: "/pdf/to-image" }
          ]}
          className="mt-40"
        />
      </main>

      <Footer />

      {/* Persistent Privacy Badge */}
      <div className="fixed bottom-8 left-8 z-50 pointer-events-none hidden md:block">
         <div className="px-6 py-3 rounded-2xl glass-card border border-emerald-500/20 flex items-center gap-4 shadow-2xl backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex flex-col">
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Secure Node</span>
               <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">100% Local Execution</span>
            </div>
         </div>
      </div>
    </div>
  );
}
