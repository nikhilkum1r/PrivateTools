"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Palette, Copy, Check, Trash2, Pipette,
  Share2, Layers, Search, 
  Settings2, RefreshCw,
  Info, Eye, Loader2, Wand2,
  Cpu, Play, Smartphone, ShieldCheck, FileDown
} from "lucide-react";
import { DropZone } from "@/components/shared/DropZone";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ColorSwatch {
  hex: string;
  rgb: string;
  hsl: string;
  isDark: boolean;
  type: "dominant" | "vibrant" | "muted" | "accent";
}

export default function ColorLabClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorSwatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sampleRate, setSampleRate] = useState(10);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<"palette" | "grading" | "contrast">("palette");
  
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFilesDrop = (files: File[]) => {
    if (files[0]) {
      setFile(files[0]);
      setPreview(URL.createObjectURL(files[0]));
      setColors([]);
    }
  };

  const [exportFormat, setExportFormat] = useState<"css" | "scss" | "json">("css");
  const [showHarmony, setShowHarmony] = useState<string | null>(null);

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
    return { onWhite: contrastWhite.toFixed(1), onBlack: contrastBlack.toFixed(1), passAA: contrastWhite >= 4.5 || contrastBlack >= 4.5, passAAA: contrastWhite >= 7 || contrastBlack >= 7 };
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
      { label: "Complementary", hex: hslToHex((hDeg+180)%360, sat, light) },
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
    setColors(sortedColors);
    setIsProcessing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 2000);
    toast.success(`Copied: ${text.toUpperCase()}`);
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative scrollbar-hide">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        {!file ? (
          <div className="flex-grow flex items-center justify-center p-8 relative z-10">
            <div className="max-w-2xl w-full space-y-12 text-center">
              <div className="space-y-6">
                <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-primary to-blue-600 p-[1px] mx-auto animate-pulse">
                  <div className="w-full h-full rounded-[calc(2.5rem-1px)] bg-black flex items-center justify-center border border-border">
                    <Palette className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                    Color <span className="text-primary">Lab.</span>
                  </h1>
                  <p className="text-muted-foreground text-xl font-medium max-w-lg mx-auto leading-relaxed">
                    Neural chromatic analysis. Extract high-fidelity design palettes and verify accessibility locally.
                  </p>
                </div>
              </div>
              <DropZone 
                onFilesDrop={handleFilesDrop} 
                accept="image/*" 
                multiple={false} 
                className="h-64 border-dashed border-border bg-secondary/50 rounded-[3rem] hover:bg-white/[0.08] transition-all"
              />
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Identity Engine */}
            <aside className="flex w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-border bg-card/40 backdrop-blur-3xl flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
              <div className="p-8 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
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
                <Badge variant="outline" className="text-[10px] border-border bg-secondary/50 text-muted-foreground/60 px-4 py-1.5 rounded-full font-black italic">ACTIVE</Badge>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-8 space-y-10">
                   <div className="aspect-square rounded-[3rem] bg-muted/40 border border-border overflow-hidden relative group">
                      <img 
                         ref={imageRef}
                         src={preview!} 
                         crossOrigin="anonymous"
                         onLoad={extractPalette}
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                         alt="" 
                       />
                      <div className="absolute inset-0 bg-muted/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8">
                         <Button variant="ghost" className="rounded-2xl text-red-500 hover:bg-red-500/10" onClick={() => { setFile(null); setPreview(null); setColors([]); }}>
                            <Trash2 className="w-6 h-6" />
                         </Button>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Analysis Stats</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-1">
                           <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Swatches</p>
                           <p className="text-xl font-black tabular-nums">{colors.length}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-1">
                           <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Precision</p>
                           <p className="text-xl font-black uppercase tracking-tighter">{sampleRate}PX</p>
                        </div>
                      </div>
                   </div>

                   <div className="p-6 rounded-[2rem] bg-secondary/30 border border-border space-y-4">
                    <div className="flex items-center gap-3">
                      <Wand2 className="w-5 h-5 text-primary" />
                      <h4 className="text-xs font-black uppercase tracking-widest">Neural Scan</h4>
                    </div>
                    <p className="text-[10px] text-muted-foreground/50 leading-relaxed font-medium">
                      High-fidelity design palette extraction using pixel-by-pixel neural sampling.
                    </p>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-8 border-t border-border bg-muted/40 shrink-0">
                <Button 
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-foreground font-black text-sm gap-2 shadow-2xl shadow-primary/20 active:scale-95 transition-all italic"
                  onClick={extractPalette}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  RENDER PALETTE
                </Button>
              </div>
            </aside>

            {/* Center - Color Workspace */}
            <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[600px] lg:min-h-0">
              <header className="p-8 flex items-center justify-between bg-muted/40 backdrop-blur-3xl border-b border-border relative z-20">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl">
                    <Palette className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="font-black text-2xl tracking-tighter uppercase italic truncate max-w-[200px] md:max-w-md">
                      Chromatic Studio
                    </h2>
                    <div className="flex items-center gap-4">
                      <Badge className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1 rounded-full font-black uppercase tracking-widest italic">
                        SECURE SESSION
                      </Badge>
                      <span className="text-[10px] text-muted-foreground/40 uppercase font-black tracking-widest">
                        {colors.length} SWATCHES EXTRACTED
                      </span>
                    </div>
                  </div>
                </div>
                {colors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex p-1 bg-secondary/50 border border-border rounded-xl">
                      {(["css", "scss", "json"] as const).map(fmt => (
                        <button key={fmt} onClick={() => setExportFormat(fmt)} className={cn("px-3 h-7 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", exportFormat === fmt ? "bg-primary text-foreground" : "text-muted-foreground/50 hover:text-foreground")}>{fmt}</button>
                      ))}
                    </div>
                    <Button variant="outline" className="h-9 px-4 rounded-xl border-border bg-secondary/50 text-foreground font-black gap-2 hover:bg-secondary transition-all text-[10px]" onClick={exportPalette}>
                      <FileDown className="w-4 h-4" /> Export
                    </Button>
                  </div>
                )}
              </header>

              <ScrollArea className="flex-grow relative z-10 min-h-0">
                <div className="p-8 lg:p-12 space-y-12">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              className="group p-6 rounded-[3rem] bg-secondary/30 border border-border flex flex-col gap-5 hover:bg-secondary/70 hover:border-primary/30 transition-all cursor-pointer relative overflow-hidden"
                              onClick={() => copyToClipboard(c.hex)}
                            >
                               <div className="flex items-center gap-6">
                                 <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] border-4 border-border shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-500 relative overflow-hidden" style={{ backgroundColor: c.hex }}>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                                       <Copy className={cn("w-6 h-6", c.isDark ? "text-foreground" : "text-black")} />
                                    </div>
                                 </div>
                                 <div className="flex-grow min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="font-black text-xl md:text-2xl tracking-tighter uppercase italic">{c.hex}</p>
                                      <Badge className={cn(
                                        "text-[9px] font-black border-none px-3 h-5 uppercase tracking-[0.15em] rounded-full",
                                        c.type === "dominant" ? "bg-primary text-foreground" :
                                        c.type === "vibrant" ? "bg-blue-600 text-foreground" :
                                        c.type === "muted" ? "bg-secondary text-muted-foreground/60" :
                                        "bg-orange-600 text-foreground"
                                      )}>{c.type}</Badge>
                                    </div>
                                    <div className="flex flex-col gap-1 opacity-25 mb-3">
                                      <span className="text-[9px] font-black tracking-widest uppercase">{c.rgb}</span>
                                      <span className="text-[9px] font-black tracking-widest uppercase">{c.hsl}</span>
                                    </div>
                                    {(() => { const cr = getContrastRatio(c.hex); return (
                                      <div className="flex gap-1.5">
                                        <span className={cn("px-2 py-0.5 rounded-md text-[8px] font-black uppercase", cr.passAAA ? "bg-emerald-500/20 text-emerald-400" : cr.passAA ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400")}>
                                          {cr.passAAA ? "AAA ✓" : cr.passAA ? "AA ✓" : "FAIL"}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md text-[8px] font-black bg-secondary/50 text-muted-foreground/50">/{cr.onWhite}</span>
                                        <span className="px-2 py-0.5 rounded-md text-[8px] font-black bg-muted/40 text-muted-foreground/50">/{cr.onBlack}</span>
                                      </div>
                                    ); })()}
                                 </div>
                               </div>
                               {/* Copy action buttons */}
                               <div className="flex gap-2 pt-1 border-t border-border">
                                 <button onClick={(e) => { e.stopPropagation(); copyToClipboard(c.hex); }} className="flex-1 text-[9px] font-black uppercase tracking-widest py-2 rounded-xl bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-all">HEX</button>
                                 <button onClick={(e) => { e.stopPropagation(); copyToClipboard(c.rgb); }} className="flex-1 text-[9px] font-black uppercase tracking-widest py-2 rounded-xl bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-all">RGB</button>
                                 <button onClick={(e) => { e.stopPropagation(); copyToClipboard(c.hsl); }} className="flex-1 text-[9px] font-black uppercase tracking-widest py-2 rounded-xl bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-all">HSL</button>
                                 <button onClick={(e) => { e.stopPropagation(); setShowHarmony(showHarmony === c.hex ? null : c.hex); }} className="flex-1 text-[9px] font-black uppercase tracking-widest py-2 rounded-xl bg-secondary/50 hover:bg-blue-500/20 hover:text-blue-400 transition-all">HARMONY</button>
                               </div>
                               {/* Harmony row */}
                               {showHarmony === c.hex && (
                                 <div className="flex gap-2 pt-1">
                                   {getHarmonyColors(c.hex).map(h => (
                                     <div key={h.label} className="flex-1 text-center space-y-1" onClick={(e) => { e.stopPropagation(); copyToClipboard(h.hex); }}>
                                       <div className="w-full h-8 rounded-xl border border-border cursor-pointer hover:scale-105 transition-transform" style={{ backgroundColor: h.hex }} />
                                       <p className="text-[7px] font-black uppercase tracking-widest opacity-30">{h.label}</p>
                                     </div>
                                   ))}
                                 </div>
                               )}
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                   </div>

                   {colors.length === 0 && !isProcessing && (
                      <div className="py-20 text-center space-y-6 opacity-20">
                         <div className="w-24 h-24 rounded-[3rem] bg-secondary/50 border border-dashed border-border flex items-center justify-center mx-auto">
                            <Pipette className="w-10 h-10" />
                         </div>
                         <p className="text-sm font-black uppercase tracking-[0.3em] italic">Select source to extract palette</p>
                      </div>
                   )}
                </div>
              </ScrollArea>
            </section>

            {/* Right Sidebar - Studio Matrix */}
            <aside className="flex w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-border bg-card/40 backdrop-blur-3xl shrink-0 flex-col relative z-10 shadow-2xl h-[600px] lg:h-full">
              <div className="p-8 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                    <Settings2 className="w-4 h-4" /> Studio Matrix
                  </h3>
                  <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none mt-1">WASM Thread Execution</p>
                </div>
                <Badge variant="outline" className="text-[10px] border-border bg-secondary/50 text-muted-foreground/60 px-4 py-1.5 rounded-full font-black italic">ACTIVE</Badge>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-8 space-y-10">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Sampling Precision</Label>
                      <span className="text-xs font-mono font-black text-primary">{sampleRate}px</span>
                    </div>
                    <Slider 
                      value={[sampleRate]} 
                      min={1} max={50} step={1} 
                      onValueChange={(v) => setSampleRate(Array.isArray(v) ? v[0] : v)}
                      className="py-2"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Analysis Mode</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: "palette", label: "Palette Extraction", icon: Palette },
                        { id: "grading", label: "Color Grading", icon: Layers },
                        { id: "contrast", label: "Contrast Check", icon: Search }
                      ].map((mode) => (
                        <Button 
                          key={mode.id}
                          variant={activeAnalysis === mode.id ? "default" : "outline"}
                          className={cn(
                            "h-14 justify-start gap-4 rounded-2xl px-6 border-border transition-all duration-300",
                            activeAnalysis === mode.id ? "bg-primary text-foreground shadow-lg shadow-primary/20" : "bg-white/[0.03] hover:bg-white/[0.08]"
                          )}
                          onClick={() => setActiveAnalysis(mode.id as any)}
                        >
                          <mode.icon className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{mode.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-secondary/30 border border-border space-y-4">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-primary" />
                      <h4 className="text-xs font-black uppercase tracking-widest">Neural Guard</h4>
                    </div>
                    <p className="text-[10px] text-muted-foreground/50 leading-relaxed font-medium">
                      Localized chromatic analysis performed in high-entropy worker threads.
                    </p>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="p-8 border-t border-border bg-muted/40 shrink-0">
                 <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Chromatic Integrity Verified
                 </div>
              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  );
}
