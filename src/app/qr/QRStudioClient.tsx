"use client";

import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QrCode, 
  Download, 
  Copy, 
  CheckCircle2, 
  Link as LinkIcon,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  Settings2,
  Palette,
  Layout,
  FileDown,
  Layers,
  Cpu,
  Play,
  Smartphone,
  ShieldCheck,
  Zap,
  RefreshCw,
  Info,
  Sparkles,
  SmartphoneIcon,
  AlertCircle
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FAQ } from "@/components/shared/FAQ";
import { Footer } from "@/components/shared/Footer";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { QR_FAQ } from "@/lib/faq-content";

export default function QRStudioClient() {
  const [value, setValue] = useState("https://safetools.local");
  const [fgColor, setFgColor] = useState("#8b5cf6");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const [includeMargin, setIncludeMargin] = useState(true);
  const [copied, setCopied] = useState(false);
  const [urlValid, setUrlValid] = useState(true);
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleValueChange = (v: string) => {
    setValue(v);
    if (v.startsWith("http") || v.startsWith("mailto:") || v.startsWith("tel:") || v.startsWith("WIFI:")) {
      try { new URL(v); setUrlValid(true); } catch { setUrlValid(false); }
    } else {
      setUrlValid(v.length > 0);
    }
  };

  const downloadQR = (format: "png" | "svg" = "png") => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    if (format === "svg") {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "qrcode.svg";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      toast.success("QR Code exported as SVG"); return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = size * 2; canvas.height = size * 2;
      ctx?.drawImage(img, 0, 0, size * 2, size * 2);
      canvas.toBlob(blob => {
        if (!blob) return;
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "qrcode.png";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast.success("QR Code exported as PNG @2x");
      }, "image/png");
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoFile(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const colorPresets = [
    { name: "Default", fg: "#8b5cf6", bg: "#ffffff" },
    { name: "Cyber", fg: "#00f3ff", bg: "#000000" },
    { name: "Mint", fg: "#10b981", bg: "#050505" },
    { name: "Gold", fg: "#fbbf24", bg: "#1a1a1a" },
    { name: "Stealth", fg: "#ffffff", bg: "#000000" },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Content copied to clipboard");
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative scrollbar-hide">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[160px] rounded-full animate-pulse" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--foreground-rgb), 0.05) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        {/* Left Sidebar - Identity Engine */}
        <aside className="flex w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-border glass-card flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-secondary/30 backdrop-blur-xl shrink-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                <Layers className="w-4 h-4" /> Identity Engine
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Multi-Platform Asset Matrix</p>
                <div className="flex gap-1.5 opacity-30">
                  <Play className="w-2 h-2 text-primary fill-primary" />
                  <div className="w-2 h-2 rounded-full border border-foreground/20" />
                  <Smartphone className="w-2 h-2" />
                </div>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] border-border bg-secondary/50 text-muted-foreground/60 px-4 py-1.5 rounded-full font-black italic">ACTIVE</Badge>
          </div>

          <ScrollArea className="flex-grow min-h-0">
            <div className="p-4 space-y-4">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Data Protocol</h4>
                <Tabs defaultValue="link" className="w-full">
                  <TabsList className="w-full grid grid-cols-4 h-12 mb-6 bg-secondary/50 border border-border rounded-xl p-1">
                    <TabsTrigger value="link" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><LinkIcon className="w-3.5 h-3.5" /></TabsTrigger>
                    <TabsTrigger value="wifi" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Wifi className="w-3.5 h-3.5" /></TabsTrigger>
                    <TabsTrigger value="vcard" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Phone className="w-3.5 h-3.5" /></TabsTrigger>
                    <TabsTrigger value="text" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><MessageSquare className="w-3.5 h-3.5" /></TabsTrigger>
                  </TabsList>

                  <TabsContent value="link" className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-widest">Target URI</Label>
                      <Input 
                        value={value} 
                        onChange={(e) => handleValueChange(e.target.value)}
                        className={cn(
                          "bg-secondary/50 border-border rounded-2xl h-10 font-black text-primary tracking-tighter italic transition-all",
                          !urlValid && "border-red-500/50 bg-red-500/5"
                        )}
                        placeholder="https://..."
                      />
                      <div className="flex justify-between items-center mt-2">
                        {!urlValid ? (
                          <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="w-3 h-3" /> Potential Invalid Format
                          </p>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className={cn("w-1.5 h-1.5 rounded-full", value.length > 200 ? "bg-orange-500" : "bg-emerald-500")} />
                            <p className="text-[9px] text-muted-foreground/50 font-black uppercase tracking-widest">{value.length} / 2000 bits</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="wifi" className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-widest">SSID</Label>
                        <Input placeholder="MATRIX_NET" className="bg-secondary/50 border-border rounded-xl h-12" onChange={(e) => setValue(`WIFI:S:${e.target.value};`)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-widest">KEY</Label>
                        <Input type="password" placeholder="••••••••" className="bg-secondary/50 border-border rounded-xl h-12" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="vcard" className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-widest">Contact Identity</Label>
                      <Input placeholder="Full Name" className="bg-secondary/50 border-border rounded-xl h-12" onChange={(e) => handleValueChange(`MECARD:N:${e.target.value};`)} />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Brand Overlay</h4>
                <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Center Logo</Label>
                    {logoFile && <Button variant="ghost" size="sm" className="h-6 text-[8px] uppercase text-red-400" onClick={() => setLogoFile(null)}>Remove</Button>}
                  </div>
                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                    <label htmlFor="logo-upload" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                      {logoFile ? (
                        <img src={logoFile} className="w-12 h-12 object-contain rounded-lg shadow-xl" />
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 text-foreground/10 mb-2 group-hover:text-primary transition-colors" />
                          <span className="text-[9px] font-black uppercase text-muted-foreground/40">Drop Icon Here</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <h4 className="text-xs font-black uppercase tracking-widest">Real-time Synthesis</h4>
                </div>
                <p className="text-[10px] text-muted-foreground/50 leading-relaxed font-medium">
                  Dynamic QR generation utilizing high-error correction protocols (Level H).
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-border bg-muted/40 shrink-0 flex flex-col gap-3">
            <Button 
              className="w-full h-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm gap-2 shadow-2xl shadow-primary/20 active:scale-95 transition-all italic"
              onClick={() => downloadQR("png")}
            >
              <Download className="w-4 h-4" />
              EXPORT PNG @2X
            </Button>
            <Button 
              variant="outline"
              className="w-full h-10 rounded-xl border-border bg-secondary/50 text-muted-foreground/60 hover:text-foreground hover:bg-secondary font-black text-[10px] gap-2 transition-all italic"
              onClick={() => downloadQR("svg")}
            >
              <FileDown className="w-4 h-4" />
              EXPORT SVG VECTOR
            </Button>
          </div>
        </aside>

        {/* Center - QR Workspace */}
        <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[600px] lg:min-h-0">
          <header className="p-8 flex items-center justify-between bg-muted/40 backdrop-blur-3xl border-b border-border relative z-20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-black text-2xl tracking-tighter uppercase italic truncate max-w-[200px] md:max-w-md">
                  QR Identity Studio
                </h2>
                <div className="flex items-center gap-4">
                  <Badge className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1 rounded-full font-black uppercase tracking-widest italic">
                    PRO ENGINE
                  </Badge>
                  <span className="text-[10px] text-muted-foreground/40 uppercase font-black tracking-widest truncate max-w-[200px]">
                    {value.length > 30 ? value.substring(0, 30) + "..." : value}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="h-10 rounded-2xl px-8 border-border bg-secondary/50 text-foreground font-black gap-2 shadow-xl hover:bg-secondary transition-all italic" onClick={copyToClipboard}>
              {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
              COPY CONTENT
            </Button>
          </header>

          <div className="flex-grow relative flex items-center justify-center p-8 lg:p-5 overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(40,minmax(0,1fr))] pointer-events-none opacity-[0.03]">
              {Array.from({ length: 1600 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-foreground/10" />
              ))}
            </div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative group"
            >
                <div ref={qrRef} className="p-5 rounded-3xl bg-white shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] border border-border transition-transform group-hover:scale-[1.02] duration-700 relative">
                  <QRCodeSVG 
                    value={value} 
                    size={size} 
                    fgColor={fgColor} 
                    bgColor={bgColor} 
                    includeMargin={includeMargin}
                    level={level}
                    imageSettings={logoFile ? {
                      src: logoFile,
                      x: undefined,
                      y: undefined,
                      height: size * 0.2,
                      width: size * 0.2,
                      excavate: true,
                    } : undefined}
                  />
                </div>
               <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-primary">High-Fidelity Matrix Output</p>
               </div>
            </motion.div>
          </div>
        </section>

        {/* Right Sidebar - Studio Matrix */}
        <aside className="flex w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-border glass-card shrink-0 flex-col relative z-10 shadow-2xl h-[600px] lg:h-full">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-secondary/30 backdrop-blur-xl shrink-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                <Settings2 className="w-4 h-4" /> Studio Matrix
              </h3>
              <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none mt-1">WASM Thread Execution</p>
            </div>
            <Badge variant="outline" className="text-[10px] border-border bg-secondary/50 text-muted-foreground/60 px-4 py-1.5 rounded-full font-black italic">ACTIVE</Badge>
          </div>

          <ScrollArea className="flex-grow min-h-0">
            <div className="p-4 space-y-4">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Chromatic Matrix</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-3 p-4 rounded-2xl bg-secondary/30 border border-border">
                    <Label className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-widest">Foreground</Label>
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl border border-border shadow-lg" style={{ backgroundColor: fgColor }} />
                      <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="bg-secondary/50 border-border rounded-lg h-9 font-mono uppercase text-xs" />
                    </div>
                  </div>
                  <div className="space-y-3 p-4 rounded-2xl bg-secondary/30 border border-border">
                    <Label className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-widest">Background</Label>
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl border border-border shadow-lg" style={{ backgroundColor: bgColor }} />
                      <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="bg-secondary/50 border-border rounded-lg h-9 font-mono uppercase text-xs" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[9px] uppercase font-black text-muted-foreground/60 tracking-widest">Chromatic Presets</Label>
                    <div className="flex flex-wrap gap-2">
                      {colorPresets.map(p => (
                        <button
                          key={p.name}
                          onClick={() => { setFgColor(p.fg); setBgColor(p.bg); }}
                          className="px-4 py-2 rounded-xl border border-border bg-secondary/50 text-[9px] font-black uppercase hover:border-primary/50 hover:text-primary transition-all"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Matrix Configuration</h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border">
                       <span className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-wider italic">Error Correction</span>
                       <select 
                        className="bg-secondary/50 border border-border text-primary text-[10px] font-black uppercase px-2 py-1 rounded-lg"
                        value={level}
                        onChange={(e) => setLevel(e.target.value as any)}
                      >
                        <option value="L">Level L (7%)</option>
                        <option value="M">Level M (15%)</option>
                        <option value="Q">Level Q (25%)</option>
                        <option value="H">Level H (30%)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border">
                       <span className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-wider italic">Include Margin</span>
                       <input type="checkbox" checked={includeMargin} onChange={(e) => setIncludeMargin(e.target.checked)} className="w-4 h-4 accent-primary" />
                    </div>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-4">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-primary" />
                  <h4 className="text-xs font-black uppercase tracking-widest">Matrix Guard</h4>
                </div>
                <p className="text-[10px] text-muted-foreground/50 leading-relaxed font-medium">
                  QR synthesis occurs in localized worker threads. No data packets leave the browser environment.
                </p>
              </div>
            </div>
          </ScrollArea>
          
          <div className="p-8 border-t border-border bg-muted/40 shrink-0">
             <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Synthesis Secured
             </div>
          </div>
        </aside>
      </main>
      <SEOStructuredData 
        name="QR Studio Pro"
        description="Generate custom, high-fidelity QR codes locally in your browser. Add logos, colors, and styling without any server tracking or redirects."
        url="https://safetools.space/qr"
        faqItems={QR_FAQ}
      />
      <FAQ 
        items={QR_FAQ}
        title="QR Studio FAQ"
        description="Everything you need to know about generating secure, static QR codes for your brand."
      />
      <Footer />
    </div>
  );
}

