"use client";

import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QrCode, Download, Copy, CheckCircle2, Link as LinkIcon,
  Wifi, Phone, MessageSquare, Settings2, Sparkles,
  FileDown, Layers, Cpu, Smartphone, ShieldCheck, Zap,
  AlertCircle, Lock, Search, SearchCode, Database, RefreshCcw, Palette
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FAQ } from "@/components/shared/FAQ";
import Link from "next/link";

export default function QRGeneratorClient() {
  const [value, setValue] = useState("https://safetools.space");
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
    { name: "Brand", fg: "#8b5cf6", bg: "#ffffff" },
    { name: "Matrix", fg: "#22c55e", bg: "#020617" },
    { name: "Ocean", fg: "#3b82f6", bg: "#f8fafc" },
    { name: "Dark", fg: "#ffffff", bg: "#020617" },
    { name: "Classic", fg: "#020617", bg: "#ffffff" },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Content copied to clipboard");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-purple-500/30">
      <Navbar />

      {/* Cyber/Terminal Aesthetic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="flex-grow relative z-10">
        {/* HERO SECTION */}
        <section className="pt-24 pb-12 px-4 container mx-auto text-center max-w-4xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(139,92,246,0.1)]">
              <QrCode className="w-10 h-10 text-purple-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
                QR Code Generator
              </h1>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto">
                Create secure QR codes instantly using browser-based local processing with zero tracking and privacy-first design.
              </p>
              <p className="text-sm font-medium text-emerald-400 bg-emerald-500/10 inline-block px-4 py-2 rounded-full border border-emerald-500/20">
                Generate secure QR codes instantly without uploads or tracking.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                { icon: Zap, text: "Instant Generation" },
                { icon: Lock, text: "Local Processing" },
                { icon: Search, text: "No Tracking" },
                { icon: Cpu, text: "Browser-Based" },
                { icon: Smartphone, text: "Mobile Friendly" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
                  <badge.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* INTERACTIVE QR STUDIO */}
        <section className="container mx-auto px-4 pb-16 max-w-[1400px]">
          <div className="glass-card rounded-[40px] border border-border shadow-2xl bg-card overflow-hidden flex flex-col xl:flex-row h-auto xl:h-[750px] w-full">
            
            {/* Left Sidebar - Data Configuration */}
            <aside className="w-full xl:w-[380px] border-b xl:border-b-0 xl:border-r border-border bg-background/50 flex flex-col shrink-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
                <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-500" /> Identity Engine
                </h3>
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-purple-500/30 text-purple-400 bg-purple-500/10">
                  WASM ACTIVE
                </Badge>
              </div>

              <ScrollArea className="flex-grow p-6">
                <div className="space-y-8">
                  {/* Protocol Selector */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Data Protocol</h4>
                    <Tabs defaultValue="link" className="w-full">
                      <TabsList className="w-full grid grid-cols-4 h-12 mb-6 bg-secondary border border-border rounded-xl p-1">
                        <TabsTrigger value="link" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white"><LinkIcon className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="wifi" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white"><Wifi className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="vcard" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white"><Phone className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="text" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white"><MessageSquare className="w-4 h-4" /></TabsTrigger>
                      </TabsList>

                      <TabsContent value="link" className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest">Target URI</Label>
                          <Input 
                            value={value} 
                            onChange={(e) => handleValueChange(e.target.value)}
                            className={cn(
                              "bg-background border-border rounded-xl h-12 font-bold text-foreground transition-all",
                              !urlValid && "border-red-500 bg-red-500/5 text-red-500"
                            )}
                            placeholder="https://..."
                          />
                          {!urlValid && (
                            <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3 h-3" /> Potential Invalid Format
                            </p>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="wifi" className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest">SSID</Label>
                            <Input placeholder="Network_Name" className="bg-background border-border rounded-xl h-12" onChange={(e) => setValue(`WIFI:S:${e.target.value};T:WPA;;`)} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest">Password</Label>
                            <Input type="password" placeholder="••••••••" className="bg-background border-border rounded-xl h-12" onChange={(e) => {
                              const ssidMatch = value.match(/S:(.*?);/);
                              const ssid = ssidMatch ? ssidMatch[1] : '';
                              setValue(`WIFI:S:${ssid};T:WPA;P:${e.target.value};;`);
                            }} />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="vcard" className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest">Contact Identity</Label>
                          <Input placeholder="Full Name" className="bg-background border-border rounded-xl h-12" onChange={(e) => handleValueChange(`MECARD:N:${e.target.value};`)} />
                        </div>
                      </TabsContent>

                      <TabsContent value="text" className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest">Text Payload</Label>
                          <Input placeholder="Enter secret message" className="bg-background border-border rounded-xl h-12" onChange={(e) => handleValueChange(e.target.value)} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Brand Overlay</h4>
                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Center Logo</Label>
                        {logoFile && <button className="text-[10px] font-black text-red-500 uppercase tracking-widest" onClick={() => setLogoFile(null)}>Remove</button>}
                      </div>
                      <div className="relative group">
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                        <label htmlFor="logo-upload" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-purple-500/40 hover:bg-purple-500/5 transition-all">
                          {logoFile ? (
                            <img src={logoFile} className="w-12 h-12 object-contain rounded-lg shadow-xl" alt="Logo preview" />
                          ) : (
                            <>
                              <Sparkles className="w-6 h-6 text-muted-foreground/30 mb-2 group-hover:text-purple-500 transition-colors" />
                              <span className="text-[10px] font-black uppercase text-muted-foreground/50 tracking-widest">Drop Icon Here</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-border bg-card flex flex-col gap-3">
                <Button 
                  className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black italic gap-2 shadow-xl shadow-purple-500/20"
                  onClick={() => downloadQR("png")}
                >
                  <Download className="w-5 h-5" /> EXPORT PNG @2X
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-12 rounded-xl border-border bg-background hover:bg-secondary text-foreground font-black italic gap-2"
                  onClick={() => downloadQR("svg")}
                >
                  <FileDown className="w-5 h-5" /> EXPORT SVG VECTOR
                </Button>
              </div>
            </aside>

            {/* Center - Preview */}
            <section className="flex-grow flex flex-col relative min-w-0 bg-background/30">
              <header className="p-6 border-b border-border flex items-center justify-between bg-card z-10 flex-wrap gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                    <QrCode className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-black text-xl uppercase italic truncate max-w-[200px] sm:max-w-sm">QR Preview</h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Locally Rendered • {value.length} Bytes</p>
                  </div>
                </div>
                <Button variant="outline" className="h-10 rounded-xl px-6 border-border font-black italic gap-2 shadow-sm bg-background hover:bg-secondary" onClick={copyToClipboard}>
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />} COPY CONTENT
                </Button>
              </header>

              <div className="flex-grow relative flex items-center justify-center p-8 overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(40,minmax(0,1fr))] pointer-events-none opacity-[0.02]">
                  {Array.from({ length: 1600 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-foreground/10" />
                  ))}
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
                  <div ref={qrRef} className="p-6 rounded-[2rem] bg-white shadow-2xl border border-border/10 transition-transform group-hover:scale-[1.02] duration-500 relative ring-1 ring-black/5 dark:ring-white/10">
                    <QRCodeSVG 
                      value={value} 
                      size={size} 
                      fgColor={fgColor} 
                      bgColor={bgColor} 
                      includeMargin={includeMargin}
                      level={level}
                      imageSettings={logoFile ? {
                        src: logoFile,
                        height: size * 0.22,
                        width: size * 0.22,
                        excavate: true,
                      } : undefined}
                    />
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Right Sidebar - Design */}
            <aside className="w-full xl:w-[320px] border-t xl:border-t-0 xl:border-l border-border bg-background/50 flex flex-col shrink-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Design Studio
                </h3>
              </div>

              <ScrollArea className="flex-grow p-6">
                <div className="space-y-8">
                  {/* Colors */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Chromatic Matrix</h4>
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex justify-between items-center">
                        <Label className="text-[10px] uppercase font-black tracking-widest">Foreground</Label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={fgColor} 
                            onChange={(e) => setFgColor(e.target.value)} 
                            className="w-8 h-8 p-0 border border-border rounded-lg cursor-pointer overflow-hidden bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:border-none"
                          />
                          <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-20 bg-background border-border rounded-lg h-8 font-mono text-[10px] uppercase text-center p-0" />
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex justify-between items-center">
                        <Label className="text-[10px] uppercase font-black tracking-widest">Background</Label>
                        <div className="flex gap-2">
                          <input 
                            type="color" 
                            value={bgColor} 
                            onChange={(e) => setBgColor(e.target.value)} 
                            className="w-8 h-8 p-0 border border-border rounded-lg cursor-pointer overflow-hidden bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:border-none"
                          />
                          <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-20 bg-background border-border rounded-lg h-8 font-mono text-[10px] uppercase text-center p-0" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Presets</h4>
                    <div className="flex flex-wrap gap-2">
                      {colorPresets.map(p => (
                        <button
                          key={p.name}
                          onClick={() => { setFgColor(p.fg); setBgColor(p.bg); }}
                          className="px-3 py-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Config */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Configuration</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border">
                         <span className="text-[10px] font-black uppercase tracking-widest">Error Correction</span>
                         <select 
                          className="bg-background border border-border text-[10px] font-black uppercase px-2 py-1.5 rounded-lg outline-none"
                          value={level}
                          onChange={(e) => setLevel(e.target.value as any)}
                        >
                          <option value="L">Low (7%)</option>
                          <option value="M">Med (15%)</option>
                          <option value="Q">Quartile (25%)</option>
                          <option value="H">High (30%)</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border cursor-pointer" onClick={() => setIncludeMargin(!includeMargin)}>
                         <span className="text-[10px] font-black uppercase tracking-widest">Include Margin</span>
                         <input type="checkbox" checked={includeMargin} onChange={(e) => setIncludeMargin(e.target.checked)} className="w-4 h-4 accent-purple-600 cursor-pointer pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-border bg-card">
                 <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" /> Processing Secured
                 </div>
              </div>
            </aside>
          </div>
        </section>

        {/* EDUCATIONAL & SEO CONTENT */}
        <div className="container mx-auto px-4 max-w-5xl py-12 space-y-20">
          
          {/* Features Grid */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black tracking-tight">QR Generator Features</h2>
              <p className="text-muted-foreground font-medium">Everything you need to create professional QR codes securely.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "URL QR codes", icon: LinkIcon },
                { title: "WiFi QR codes", icon: Wifi },
                { title: "Contact vCard", icon: Phone },
                { title: "Email/Text", icon: MessageSquare },
                { title: "Custom colors", icon: Palette },
                { title: "Logo embedding", icon: Sparkles },
                { title: "SVG/PNG export", icon: Download },
                { title: "Offline support", icon: Zap }
              ].map((Feature, i) => (
                <div key={i} className="p-4 rounded-2xl bg-secondary/50 border border-border flex flex-col items-center text-center gap-3">
                  <Feature.icon className="w-6 h-6 text-purple-500" />
                  <span className="text-sm font-bold leading-tight">{Feature.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Educational Content */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2"><QrCode className="text-purple-500 w-6 h-6" /> What Is a QR Code?</h2>
              <div className="p-6 rounded-3xl bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                QR codes are machine-readable patterns that store information such as URLs, text, contact details, WiFi credentials, and payment data for quick mobile access. Our browser-based generator ensures this conversion happens instantly and privately, protecting your information unlike other tools that track your inputs. For added security after sharing, you can permanently wipe your source files using our <Link href="/security/file-shredder" className="text-purple-500 hover:text-purple-400 hover:underline font-bold transition-colors">File Shredder</Link>.
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2"><Lock className="text-emerald-500 w-6 h-6" /> Privacy-First QR Generation</h2>
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-600 dark:text-emerald-400 font-medium">
                <ul className="space-y-2 list-disc pl-4 marker:text-emerald-500 mb-4">
                  <li>Local QR generation inside your browser</li>
                  <li>No cloud uploads or server storage</li>
                  <li>No tracking pixels injected into the code</li>
                  <li>No analytics or redirects attached to your data</li>
                </ul>
                <p className="text-sm">If you need to share highly sensitive passwords via QR, we recommend generating them offline using our <Link href="/privacy/password-generator" className="text-emerald-500 hover:text-emerald-400 hover:underline font-bold transition-colors">Password Generator</Link> first.</p>
              </div>
            </div>
          </section>

          {/* Supported Types & Use Cases */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 p-8 rounded-[2rem] border border-border bg-card">
              <h3 className="text-xl font-black uppercase italic">Supported QR Types</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-widest mb-2">Basic</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Text", "URLs", "Phone numbers", "SMS", "Email"].map(t => (
                      <Badge key={t} variant="outline" className="bg-background">{t}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-widest mb-2">Advanced</h4>
                  <div className="flex flex-wrap gap-2">
                    {["WiFi credentials", "vCard contacts", "Payment links", "Event details"].map(t => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-8 rounded-[2rem] border border-border bg-card">
              <h3 className="text-xl font-black uppercase italic">Common Use Cases</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Business cards", "Restaurant menus", 
                  "WiFi sharing", "Payments", 
                  "Event tickets", "Product packaging", 
                  "Social media", "Secure document access"
                ].map(use => (
                  <div key={use} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> {use}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black flex items-center gap-2 text-orange-500"><AlertCircle className="w-6 h-6" /> QR Security Best Practices</h2>
            <div className="p-6 rounded-3xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-medium space-y-4">
              <p>We provide secure generation, but always exercise caution when scanning unknown QR codes. Verify unknown QR codes before scanning, avoid suspicious redirects, ensure links use HTTPS, and protect sensitive data from shoulder surfing.</p>
              <p className="text-sm border-t border-orange-500/20 pt-4">For securely storing your sensitive scanned data or configuration files, consider utilizing our military-grade <Link href="/security/vault" className="text-orange-500 hover:text-orange-400 hover:underline font-bold transition-colors">Encryption Vault</Link> or sharing secrets as <Link href="/privacy/secure-notes" className="text-orange-500 hover:text-orange-400 hover:underline font-bold transition-colors">Secure Notes</Link>.</p>
            </div>
          </section>

          {/* Error Correction Levels */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2"><ShieldCheck className="text-purple-500 w-6 h-6" /> Error Correction Explained</h2>
              <div className="p-6 rounded-3xl bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                <p className="mb-3">QR codes use Reed-Solomon error correction to remain scannable even if they are damaged or partially covered (like when adding a logo). SafeTools provides four levels:</p>
                <ul className="space-y-2 text-sm">
                  <li><strong className="text-foreground">Low (L):</strong> Restores ~7% of data. Smallest QR size.</li>
                  <li><strong className="text-foreground">Medium (M):</strong> Restores ~15% of data. Standard for web.</li>
                  <li><strong className="text-foreground">Quartile (Q):</strong> Restores ~25% of data. Good for complex codes.</li>
                  <li><strong className="text-foreground">High (H):</strong> Restores ~30% of data. Best for embedding logos.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2"><Database className="text-emerald-500 w-6 h-6" /> Static vs. Dynamic QR Codes</h2>
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-600 dark:text-emerald-400 font-medium">
                <p className="mb-3">SafeTools strictly generates <strong>Static QR Codes</strong>. Why?</p>
                <ul className="space-y-2 text-sm list-disc pl-4 marker:text-emerald-500">
                  <li><strong>Static:</strong> Data is permanently encoded directly into the image. No server is required to read it, ensuring 100% privacy and zero tracking capabilities.</li>
                  <li><strong>Dynamic:</strong> Stores a short URL that redirects to the actual destination. This allows companies to track who scanned the code, when, and where. We reject this invasive practice.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-center">Why Use SafeTools QR Generator?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-card rounded-3xl overflow-hidden border border-border shadow-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border">Feature</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-muted-foreground">Typical QR Sites</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-purple-500 bg-purple-500/5">SafeTools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm font-medium">
                  <tr>
                    <td className="p-4">Tracking Scripts</td>
                    <td className="p-4 text-muted-foreground">Often</td>
                    <td className="p-4 text-purple-400 bg-purple-500/5 font-bold">No</td>
                  </tr>
                  <tr>
                    <td className="p-4">Browser-Based</td>
                    <td className="p-4 text-muted-foreground">Partial</td>
                    <td className="p-4 text-purple-400 bg-purple-500/5 font-bold">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4">Privacy Focused</td>
                    <td className="p-4 text-muted-foreground">Rare</td>
                    <td className="p-4 text-purple-400 bg-purple-500/5 font-bold">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4">Upload Required</td>
                    <td className="p-4 text-muted-foreground">Sometimes</td>
                    <td className="p-4 text-purple-400 bg-purple-500/5 font-bold">No</td>
                  </tr>
                  <tr>
                    <td className="p-4">Offline Support</td>
                    <td className="p-4 text-muted-foreground">Limited</td>
                    <td className="p-4 text-purple-400 bg-purple-500/5 font-bold">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <FAQ 
            items={[
              { question: "Are QR codes uploaded to servers?", answer: "No. QR generation happens locally inside your browser." },
              { question: "Can I generate QR codes offline?", answer: "Yes. Offline support can be enabled through PWA functionality." },
              { question: "Which formats can I export?", answer: "PNG, SVG, and high-resolution formats are recommended." },
              { question: "Can I customize QR code colors?", answer: "Yes. Custom styling and branding support can be added." },
              { question: "Is there tracking inside generated QR codes?", answer: "No. SafeTools does not inject tracking into QR codes." }
            ]}
          />

          {/* Related Tools */}
          <section className="space-y-6 text-center border-t border-border pt-16">
            <h2 className="text-2xl font-black">Related Utility Tools</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Password Generator", href: "/privacy/password-generator" },
                { name: "Secure Notes", href: "/privacy/secure-notes" },
                { name: "URL Encoder", href: "/devtools/url-encoder" },
                { name: "Image Converter", href: "/image/convert" },
                { name: "File Shredder", href: "/security/file-shredder" }
              ].map(tool => (
                <Link key={tool.href} href={tool.href} className="px-5 py-2.5 rounded-full bg-secondary hover:bg-purple-600 hover:text-white border border-border hover:border-purple-600 transition-colors font-bold text-sm">
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Privacy Manifesto */}
          <section className="text-center max-w-2xl mx-auto space-y-4 pb-12">
            <ShieldCheck className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground">Privacy-First Utility Tools</h3>
            <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed italic">
              "SafeTools creates browser-based tools designed for speed, privacy, and user control without unnecessary tracking or uploads. Fast, privacy-first browser tools designed for modern digital workflows."
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
