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
import { useTranslations } from "next-intl";

export default function QRGeneratorClient() {
  const t = useTranslations("qrGenerator");
  const common = useTranslations("common");
  
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

  const MAX_CHARS = 1200;

  const handleValueChange = (v: string) => {
    let trimmed = v;
    if (v.length > MAX_CHARS) {
      trimmed = v.slice(0, MAX_CHARS);
      toast.error(`Payload too large. Trimmed to ${MAX_CHARS} characters.`);
    }
    setValue(trimmed);
    if (trimmed.startsWith("http") || trimmed.startsWith("mailto:") || trimmed.startsWith("tel:") || trimmed.startsWith("WIFI:")) {
      try { new URL(trimmed); setUrlValid(true); } catch { setUrlValid(false); }
    } else {
      setUrlValid(trimmed.length > 0);
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
      toast.success(t("export.toastSvg")); return;
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
        toast.success(t("export.toastPng"));
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
    toast.success(t("preview.copied"));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-purple-500/30">
      <Navbar />

      {/* Cyber/Terminal Aesthetic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main id="main-content" className="flex-grow relative z-10">
        {/* HERO SECTION */}
        <section className="pt-24 pb-12 px-4 container mx-auto text-center max-w-4xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(139,92,246,0.1)]">
              <QrCode className="w-10 h-10 text-purple-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase">
                {t("hero.title")}
              </h1>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto">
                {t("hero.subtitle")}
              </p>
              <p className="text-sm font-medium text-emerald-400 bg-emerald-500/10 inline-block px-4 py-2 rounded-full border border-emerald-500/20">
                {t("hero.badge")}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                { icon: Zap, text: t("badges.instant") },
                { icon: Lock, text: t("badges.local") },
                { icon: Search, text: t("badges.noTracking") },
                { icon: Cpu, text: t("badges.browser") },
                { icon: Smartphone, text: t("badges.mobile") }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
                  <badge.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* INTERACTIVE QR STUDIO */}
        <section className="container mx-auto px-4 pb-16 max-w-[1400px]">
          <div className="glass-card rounded-3xl border border-border shadow-2xl bg-card overflow-hidden flex flex-col xl:flex-row h-auto xl:h-[750px] w-full">
            
            {/* Left Sidebar - Data Configuration */}
            <aside className="w-full xl:w-[380px] border-b xl:border-b-0 xl:border-r border-border bg-background/50 flex flex-col shrink-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-500" /> {t("identity.title")}
                </h3>
                <Badge variant="outline" className="text-[9px] font-semibold uppercase tracking-wider border-purple-500/30 text-purple-400 bg-purple-500/10">
                  {t("identity.status")}
                </Badge>
              </div>

              <ScrollArea className="flex-grow p-6">
                <div className="space-y-8">
                  {/* Protocol Selector */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{t("identity.protocol")}</h4>
                    <Tabs defaultValue="link" className="w-full">
                      <TabsList className="w-full grid grid-cols-4 h-12 mb-6 bg-secondary border border-border rounded-xl p-1">
                        <TabsTrigger value="link" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white"><LinkIcon className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="wifi" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white"><Wifi className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="vcard" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white"><Phone className="w-4 h-4" /></TabsTrigger>
                        <TabsTrigger value="text" className="rounded-lg data-[state=active]:bg-purple-600 data-[state=active]:text-white"><MessageSquare className="w-4 h-4" /></TabsTrigger>
                      </TabsList>

                      <TabsContent value="link" className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-semibold uppercase text-muted-foreground/60 tracking-wider">{t("identity.uriLabel")}</Label>
                          <Input 
                            value={value} 
                            onChange={(e) => handleValueChange(e.target.value)}
                            maxLength={MAX_CHARS}
                            className={cn(
                              "bg-background border-border rounded-xl h-12 font-bold text-foreground transition-all",
                              !urlValid && "border-red-500 bg-red-500/5 text-red-500"
                            )}
                            placeholder={t("identity.uriPlaceholder")}
                          />
                          {!urlValid && (
                            <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider flex items-center gap-1 mt-1">
                              <AlertCircle className="w-3 h-3" /> {t("identity.uriInvalid")}
                            </p>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="wifi" className="space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-semibold uppercase text-muted-foreground/60 tracking-wider">{t("identity.ssid")}</Label>
                            <Input placeholder={t("identity.ssidPlaceholder")} maxLength={100} className="bg-background border-border rounded-xl h-12" onChange={(e) => {
                              const trimmed = e.target.value.slice(0, 100);
                              setValue(`WIFI:S:${trimmed};T:WPA;;`);
                            }} />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-semibold uppercase text-muted-foreground/60 tracking-wider">{t("identity.password")}</Label>
                            <Input type="password" placeholder={t("identity.passwordPlaceholder")} maxLength={100} className="bg-background border-border rounded-xl h-12" onChange={(e) => {
                              const ssidMatch = value.match(/S:(.*?);/);
                              const ssid = ssidMatch ? ssidMatch[1] : '';
                              const trimmed = e.target.value.slice(0, 100);
                              setValue(`WIFI:S:${ssid};T:WPA;P:${trimmed};;`);
                            }} />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="vcard" className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-semibold uppercase text-muted-foreground/60 tracking-wider">{t("identity.contact")}</Label>
                          <Input placeholder={t("identity.contactPlaceholder")} maxLength={200} className="bg-background border-border rounded-xl h-12" onChange={(e) => handleValueChange(`MECARD:N:${e.target.value.slice(0, 200)};`)} />
                        </div>
                      </TabsContent>

                      <TabsContent value="text" className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-semibold uppercase text-muted-foreground/60 tracking-wider">{t("identity.text")}</Label>
                          <Input placeholder={t("identity.textPlaceholder")} maxLength={MAX_CHARS} className="bg-background border-border rounded-xl h-12" onChange={(e) => handleValueChange(e.target.value)} />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{t("identity.brand")}</h4>
                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-semibold uppercase tracking-wider opacity-60">{t("identity.centerLogo")}</Label>
                        {logoFile && <button className="text-[10px] font-bold text-red-500 uppercase tracking-wider" onClick={() => setLogoFile(null)}>{t("identity.remove")}</button>}
                      </div>
                      <div className="relative group">
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                        <label htmlFor="logo-upload" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-purple-500/40 hover:bg-purple-500/5 transition-all">
                          {logoFile ? (
                            <img src={logoFile} className="w-12 h-12 object-contain rounded-lg shadow-xl" alt="Logo preview" />
                          ) : (
                            <>
                              <Sparkles className="w-6 h-6 text-muted-foreground/30 mb-2 group-hover:text-purple-500 transition-colors" />
                              <span className="text-[10px] font-bold text-muted-foreground/50 tracking-wider">{t("identity.dropIcon")}</span>
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
                  className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold gap-2 shadow-xl shadow-purple-500/20"
                  onClick={() => downloadQR("png")}
                >
                  <Download className="w-5 h-5" /> {t("export.png")}
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-12 rounded-xl border-border bg-background hover:bg-secondary text-foreground font-bold gap-2"
                  onClick={() => downloadQR("svg")}
                >
                  <FileDown className="w-5 h-5" /> {t("export.svg")}
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
                    <h2 className="font-bold text-xl uppercase truncate max-w-[200px] sm:max-w-sm">{t("preview.title")}</h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("preview.status", { bytes: value.length })}</p>
                  </div>
                </div>
                <Button variant="outline" className="h-10 rounded-xl px-6 border-border font-bold gap-2 shadow-sm bg-background hover:bg-secondary" onClick={copyToClipboard}>
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />} {copied ? t("preview.copied") : t("preview.copy")}
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
                      value={value.length > MAX_CHARS ? value.slice(0, MAX_CHARS) : (value || " ")} 
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
                <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-500 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> {t("design.title")}
                </h3>
              </div>

              <ScrollArea className="flex-grow p-6">
                <div className="space-y-8">
                  {/* Colors */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{t("design.chromatic")}</h4>
                    <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-secondary/30 border border-border flex justify-between items-center">
                        <Label className="text-[10px] font-semibold uppercase tracking-wider">{t("design.foreground")}</Label>
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
                        <Label className="text-[10px] font-semibold uppercase tracking-wider">{t("design.background")}</Label>
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
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{t("design.presets")}</h4>
                    <div className="flex flex-wrap gap-2">
                      {colorPresets.map(p => (
                        <button
                          key={p.name}
                          onClick={() => { setFgColor(p.fg); setBgColor(p.bg); }}
                          className="px-3 py-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-[10px] font-semibold uppercase tracking-wider transition-all"
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Config */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">{t("design.config")}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border">
                         <span className="text-[10px] font-semibold uppercase tracking-wider">{t("design.errorCorrection")}</span>
                         <select 
                          className="bg-background border border-border text-[10px] font-bold px-2 py-1.5 rounded-lg outline-none"
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
                         <span className="text-[10px] font-semibold uppercase tracking-wider">{t("design.margin")}</span>
                         <input type="checkbox" checked={includeMargin} onChange={(e) => setIncludeMargin(e.target.checked)} className="w-4 h-4 accent-purple-600 cursor-pointer pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-border bg-card">
                 <div className="flex items-center justify-center gap-2 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" /> {t("design.secured")}
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
              <h2 className="text-3xl font-bold tracking-tight">{t("landing.features.title")}</h2>
              <p className="text-muted-foreground font-medium">{t("landing.features.subtitle")}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: t("landing.features.url"), icon: LinkIcon },
                { title: t("landing.features.wifi"), icon: Wifi },
                { title: t("landing.features.vcard"), icon: Phone },
                { title: t("landing.features.text"), icon: MessageSquare },
                { title: t("landing.features.colors"), icon: Palette },
                { title: t("landing.features.logo"), icon: Sparkles },
                { title: t("landing.features.export"), icon: Download },
                { title: t("landing.features.offline"), icon: Zap }
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
              <h2 className="text-2xl font-bold flex items-center gap-2"><QrCode className="text-purple-500 w-6 h-6" /> {t("landing.educational.whatIs.title")}</h2>
              <div className="p-6 rounded-3xl bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                {t.rich("landing.educational.whatIs.description", {
                  link: (chunks) => <Link href="/security/file-shredder" className="text-purple-500 hover:text-purple-400 hover:underline font-bold transition-colors">{chunks}</Link>
                })}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Lock className="text-emerald-500 w-6 h-6" /> {t("landing.educational.privacy.title")}</h2>
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-600 dark:text-emerald-400 font-medium">
                <ul className="space-y-2 list-disc pl-4 marker:text-emerald-500 mb-4">
                  {(Array.isArray(t.raw("landing.educational.privacy.items")) ? (t.raw("landing.educational.privacy.items") as string[]) : []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="text-sm">{t.rich("landing.educational.privacy.footer", {
                  link: (chunks) => <Link href="/privacy/password-generator" className="text-emerald-500 hover:text-emerald-400 hover:underline font-bold transition-colors">{chunks}</Link>
                })}</p>
              </div>
            </div>
          </section>

          {/* Supported Types & Use Cases */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 p-8 rounded-[2rem] border border-border bg-card">
              <h3 className="text-xl font-bold">{t("landing.educational.supported.title")}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">{t("landing.educational.supported.basic")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(t.raw("landing.educational.supported.basic_items")) ? (t.raw("landing.educational.supported.basic_items") as string[]) : []).map(t => (
                      <Badge key={t} variant="outline" className="bg-background">{t}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-2">{t("landing.educational.supported.advanced")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(t.raw("landing.educational.supported.advanced_items")) ? (t.raw("landing.educational.supported.advanced_items") as string[]) : []).map(t => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-8 rounded-[2rem] border border-border bg-card">
              <h3 className="text-xl font-bold">{t("landing.educational.cases.title")}</h3>
              <div className="grid grid-cols-2 gap-3">
                {(Array.isArray(t.raw("landing.educational.cases.items")) ? (t.raw("landing.educational.cases.items") as string[]) : []).map(use => (
                  <div key={use} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> {use}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-orange-500"><AlertCircle className="w-6 h-6" /> {t("landing.educational.security.title")}</h2>
            <div className="p-6 rounded-3xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 font-medium space-y-4">
              <p>{t("landing.educational.security.description")}</p>
              <p className="text-sm border-t border-orange-500/20 pt-4">{t.rich("landing.educational.security.footer", {
                vault: (chunks) => <Link href="/security/vault" className="text-orange-500 hover:text-orange-400 hover:underline font-bold transition-colors">{chunks}</Link>,
                notes: (chunks) => <Link href="/privacy/secure-notes" className="text-orange-500 hover:text-orange-400 hover:underline font-bold transition-colors">{chunks}</Link>
              })}</p>
            </div>
          </section>

          {/* Error Correction Levels */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><ShieldCheck className="text-purple-500 w-6 h-6" /> {t("landing.educational.correction.title")}</h2>
              <div className="p-6 rounded-3xl bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                <p className="mb-3">{t("landing.educational.correction.description")}</p>
                <ul className="space-y-2 text-sm">
                  <li><strong className="text-foreground">{t("landing.educational.correction.l")}</strong></li>
                  <li><strong className="text-foreground">{t("landing.educational.correction.m")}</strong></li>
                  <li><strong className="text-foreground">{t("landing.educational.correction.q")}</strong></li>
                  <li><strong className="text-foreground">{t("landing.educational.correction.h")}</strong></li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2"><Database className="text-emerald-500 w-6 h-6" /> {t("landing.educational.static.title")}</h2>
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-600 dark:text-emerald-400 font-medium">
                <p className="mb-3">{t("landing.educational.static.description")}</p>
                <ul className="space-y-2 text-sm list-disc pl-4 marker:text-emerald-500">
                  <li>{t("landing.educational.static.static")}</li>
                  <li>{t("landing.educational.static.dynamic")}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-center">{t("landing.comparison.title")}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-card rounded-3xl overflow-hidden border border-border shadow-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    {(Array.isArray(t.raw("landing.comparison.headers")) ? (t.raw("landing.comparison.headers") as string[]) : []).map((header, i) => (
                      <th key={i} className={cn("p-4 font-semibold uppercase tracking-wider text-xs border-b border-border", i === 2 && "text-purple-500 bg-purple-500/5")}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm font-medium">
                  {(Array.isArray(t.raw("landing.comparison.rows")) ? (t.raw("landing.comparison.rows") as string[][]) : []).map((row, i) => (
                    <tr key={i}>
                      <td className="p-4">{row[0]}</td>
                      <td className="p-4 text-muted-foreground">{row[1]}</td>
                      <td className="p-4 text-purple-400 bg-purple-500/5 font-bold">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <FAQ items={Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any[]) : []} />

          {/* Related Tools */}
          <section className="space-y-6 text-center border-t border-border pt-16">
            <h2 className="text-2xl font-bold">{t("landing.related.title")}</h2>
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
            <h3 className="text-xl font-semibold uppercase tracking-wider text-muted-foreground">{t("landing.manifesto.title")}</h3>
            <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed">
              {t("landing.manifesto.description")}
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
