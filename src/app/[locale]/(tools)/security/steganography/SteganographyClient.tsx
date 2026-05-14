"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Fingerprint, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Download, 
  Trash2, 
  Loader2,
  FileUp,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Info,
  RefreshCcw,
  Play,
  Smartphone,
  Layers,
  Cpu,
  Settings2,
  Copy,
  Check,
  ShieldQuestion,
  Image as ImageIcon,
  History,
  Shield,
  Globe,
  Share2,
  HelpCircle,
  Code2,
  Table,
  HardDrive
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FAQ } from "@/components/shared/FAQ";
import { Footer } from "@/components/shared/Footer";
import { AdUnit } from "@/components/shared/AdUnit";
import { useTranslations } from "next-intl";

export default function SteganographyClient() {
  const t = useTranslations("steganography");
  const common = useTranslations("common");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [extractedMessage, setExtractedMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"hide" | "reveal">("hide");
  const [capacity, setCapacity] = useState<number | null>(null);
  const [isHttps, setIsHttps] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsHttps(window.location.protocol === "https:");
    setIsDev(window.location.hostname === "localhost");
  }, []);

  const calculateCapacity = (img: HTMLImageElement) => {
    const totalPixels = img.width * img.height;
    const totalBits = totalPixels * 3;
    const totalBytes = Math.floor(totalBits / 8) - 4;
    setCapacity(totalBytes);
  };

  const handleFileChange = (files: File[]) => {
    const f = files[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
      setExtractedMessage(null);
      setError(null);
      
      const img = new Image();
      img.src = url;
      img.onload = () => {
        calculateCapacity(img);
      };
      toast.success(t("toast.initialized", { name: f.name }));
    }
  };

  const encodeMessage = async () => {
    if (!file || !message) return;
    setIsProcessing(true);
    setProgress(10);
    setError(null);
    try {
      const img = new Image();
      img.src = preview!;
      await new Promise((res) => (img.onload = res));
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const encoder = new TextEncoder();
      const messageBytes = encoder.encode(message);
      const length = messageBytes.length;
      const totalBits = 32 + (length * 8);
      
      if (totalBits > (data.length * 3) / 4) throw new Error(t("engine.capacityError") || "Payload exceeds carrier capacity.");
      
      setProgress(40);
      const payload = new Uint8Array(4 + length);
      new DataView(payload.buffer).setUint32(0, length, false);
      payload.set(messageBytes, 4);
      
      let bitIdx = 0;
      for (let i = 0; i < payload.length; i++) {
        const byte = payload[i];
        for (let bit = 7; bit >= 0; bit--) {
          const bitValue = (byte >> bit) & 1;
          const pixelIdx = Math.floor(bitIdx / 3) * 4 + (bitIdx % 3);
          data[pixelIdx] = (data[pixelIdx] & 0xFE) | bitValue;
          bitIdx++;
        }
      }
      
      setProgress(80);
      ctx.putImageData(imageData, 0, 0);
      const blob = await new Promise<Blob>((res) => canvas.toBlob(b => res(b!), "image/png"));
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `spy-${file.name.split('.')[0]}.png`;
      a.click();
      setProgress(100);
      toast.success(t("toast.vanished"));
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const decodeMessage = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(10);
    setError(null);
    setExtractedMessage(null);
    try {
      const img = new Image();
      img.src = preview!;
      await new Promise((res) => (img.onload = res));
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      setProgress(40);
      const lengthBytes = new Uint8Array(4);
      let bitIdx = 0;
      for (let i = 0; i < 4; i++) {
        let byte = 0;
        for (let bit = 7; bit >= 0; bit--) {
          const pixelIdx = Math.floor(bitIdx / 3) * 4 + (bitIdx % 3);
          const bitValue = data[pixelIdx] & 1;
          byte |= (bitValue << bit);
          bitIdx++;
        }
        lengthBytes[i] = byte;
      }

      const length = new DataView(lengthBytes.buffer).getUint32(0, false);
      if (length > (data.length * 3) / 8) throw new Error(t("engine.noPayloadError") || "No hidden payload detected in this image.");

      const messageBytes = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        let byte = 0;
        for (let bit = 7; bit >= 0; bit--) {
          const pixelIdx = Math.floor(bitIdx / 3) * 4 + (bitIdx % 3);
          const bitValue = data[pixelIdx] & 1;
          byte |= (bitValue << bit);
          bitIdx++;
        }
        messageBytes[i] = byte;
      }

      const decoded = new TextDecoder().decode(messageBytes);
      setExtractedMessage(decoded);
      setProgress(100);
      toast.success(t("toast.revealed"));
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary/10 opacity-50" />
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider animate-pulse">
              {t("hero.badge")}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none uppercase" dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }} />
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {[
                { icon: ShieldCheck, text: t("hero.badges.local") },
                { icon: Zap, text: t("hero.badges.zero") },
                { icon: EyeOff, text: t("hero.badges.no_tracking") },
                { icon: Zap, text: t("hero.badges.instant") },
                { icon: HardDrive, text: t("hero.badges.browser") }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-sm">
                  <badge.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl py-4">
        <AdUnit type="banner" />
      </div>

      {/* Visual Process Section */}
      <section className="container mx-auto px-4 max-w-5xl -mt-8 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: t("process.carrier.title"), desc: t("process.carrier.desc"), icon: ImageIcon },
            { step: "02", title: t("process.payload.title"), desc: t("process.payload.desc"), icon: MessageSquare },
            { step: "03", title: t("process.output.title"), desc: t("process.output.desc"), icon: Download }
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border p-6 rounded-3xl text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl py-8">
        <AdUnit type="in-article" />
      </div>

      <main id="main-content" className="container mx-auto px-4 py-12 space-y-24 max-w-6xl">
        
        {/* Steganography Tool Interface */}
        <section id="steganography-tool" className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-8 border-border bg-card shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Fingerprint className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight" dangerouslySetInnerHTML={{ __html: t.raw("engine.title") }} />
                </div>
                <div className="flex bg-secondary/50 p-1 rounded-xl border border-border">
                  <Button 
                    variant="ghost"
                    className={cn("h-10 px-6 rounded-lg font-bold transition-all", activeTab === "hide" ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}
                    onClick={() => { setActiveTab("hide"); setFile(null); setPreview(null); setMessage(""); setExtractedMessage(null); }}
                  >
                    <Lock className="w-4 h-4 mr-2" /> {t("engine.encode")}
                  </Button>
                  <Button 
                    variant="ghost"
                    className={cn("h-10 px-6 rounded-lg font-bold transition-all", activeTab === "reveal" ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}
                    onClick={() => { setActiveTab("reveal"); setFile(null); setPreview(null); setMessage(""); setExtractedMessage(null); }}
                  >
                    <Unlock className="w-4 h-4 mr-2" /> {t("engine.decode")}
                  </Button>
                </div>
              </div>

              {!file ? (
                <DropZone 
                  onFilesDrop={handleFileChange} 
                  className="h-80 bg-background/50 border-dashed border-border rounded-3xl hover:border-[#22C55E]/50 transition-colors"
                  accept="image/png,image/webp"
                  title={activeTab === "hide" ? t("engine.dropzone.encode") : t("engine.dropzone.decode")}
                  description={activeTab === "hide" ? t("engine.dropzone.encodeDesc") : t("engine.dropzone.decodeDesc")}
                />
              ) : (
                <div className="space-y-6">
<div className="grid md:grid-cols-2 gap-6">
                    <div className="aspect-square rounded-2xl bg-background border border-border overflow-hidden relative group">
                      <img src={preview!} className="w-full h-full object-contain" alt="Preview" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Button variant="ghost" className="text-red-500 hover:bg-red-500/10" onClick={() => { setFile(null); setPreview(null); setMessage(""); setExtractedMessage(null); }}>
                            <Trash2 className="w-6 h-6 mr-2" /> {t("engine.remove")}
                         </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center space-y-6">
                       {activeTab === "hide" ? (
                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("engine.payloadLabel")}</Label>
                              {capacity && (
                                <span className={cn("text-[10px] font-bold", message.length > capacity ? "text-red-500" : "text-emerald-500")}>
                                  {message.length} / {capacity} B
                                </span>
                              )}
                            </div>
                            <Textarea 
                              placeholder={t("engine.placeholder")}
                              className="min-h-[150px] bg-background border-border rounded-xl font-mono text-sm"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button 
                              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xl"
                              onClick={encodeMessage}
                              disabled={isProcessing || !message}
                            >
                              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                              {t("engine.hideButton")}
                            </Button>
                         </div>
                       ) : (
                         <div className="space-y-4">
                            {extractedMessage ? (
                              <div className="space-y-4">
                                <Label className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">{t("engine.extractedLabel")}</Label>
                                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 font-mono text-emerald-400 break-all whitespace-pre-wrap min-h-[100px]">
                                  {extractedMessage}
                                </div>
                                <Button 
                                  variant="outline" 
                                  className="w-full h-12 rounded-xl border-border bg-secondary/50 font-bold gap-2"
                                  onClick={() => {
                                    navigator.clipboard.writeText(extractedMessage);
                                    toast.success(t("toast.copied"));
                                  }}
                                >
                                  <Copy className="w-4 h-4" /> {t("engine.copyButton")}
                                </Button>
                              </div>
                            ) : (
                              <div className="text-center py-8 space-y-4">
                                <Button 
                                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                  onClick={decodeMessage}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                                  {t("engine.revealButton")}
                                </Button>
                                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{t("engine.awaitingScan")}</p>
                              </div>
                            )}
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              )}
              
              {isProcessing && (
                <div className="mt-8 space-y-2">
                  <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
                    <span>{t("engine.processing")}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-secondary/50" />
                </div>
              )}
            </motion.div>
          </div>

          <aside className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-6 border-border bg-card/80 shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                {t("status.title")}
              </h3>
              <div className="space-y-4">
                {[
                  { label: t("status.local"), status: t("status.active"), active: true },
                  { label: t("status.zero"), status: t("status.verified"), active: true },
                  { label: t("status.https"), status: isHttps ? t("status.verified") : (isDev ? t("status.localDev") : t("status.warning")), active: isHttps || isDev },
                  { label: t("status.carrier"), status: "100%", active: true },
                  { label: t("status.tracking"), status: t("status.none"), active: true }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-background border border-border">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <Badge className={item.active ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border-border bg-card/80 shadow-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t("trackers.title")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Google Analytics", "FB Pixel", "Hotjar", "Mixpanel", "Segment", "Intercom"
                ].map((tracker, i) => (
                  <div key={i} className="px-3 py-1 rounded-full bg-background border border-border text-[10px] font-bold text-muted-foreground flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-red-500" />
                    <span className="line-through opacity-50">{tracker}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">
                {t("trackers.note")}
              </p>
            </div>
          </aside>
        </section>

        {/* Educational Content: What is Steganography */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5">{t("landing.educational.whatIs.badge")}</Badge>
            <h2 className="text-4xl md:text-5xl font-bold uppercase leading-none">
              {t.rich("landing.educational.whatIs.titleRich", { span: (c) => <span className="text-primary">{c}</span> })}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t("landing.educational.whatIs.description")}
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
               {(Array.isArray(t.raw("landing.educational.whatIs.items")) ? (t.raw("landing.educational.whatIs.items") as any[]) : []).map((item, i) => (
                 <div key={i} className="space-y-2">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
             <div className="relative glass-card border-border rounded-3xl overflow-hidden aspect-video flex items-center justify-center bg-card">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 animate-pulse" />
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/40 animate-pulse delay-75" />
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 animate-pulse delay-150" />
                  </div>
                  <p className="text-[10px] font-bold tracking-[0.4em] text-emerald-500">{t("engine.processing")}</p>
                </div>
             </div>
          </div>
        </section>

        {/* Steganography vs Encryption */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{t("landing.educational.vs.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("landing.educational.vs.subtitle")}</p>
          </div>
          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-border shadow-2xl bg-card/50 backdrop-blur-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  {(Array.isArray(t.raw("landing.educational.vs.headers")) ? (t.raw("landing.educational.vs.headers") as string[]) : []).map((header, i) => (
                    <th key={i} className={cn("px-8 py-6 text-sm font-semibold uppercase tracking-wider", i === 0 ? "text-muted-foreground" : i === 1 ? "text-primary" : "text-blue-500")}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(Array.isArray(t.raw("landing.educational.vs.rows")) ? (t.raw("landing.educational.vs.rows") as string[][]) : []).map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 text-sm font-bold">{row[0]}</td>
                    <td className="px-8 py-5 text-sm text-emerald-400 font-medium">{row[1]}</td>
                    <td className="px-8 py-5 text-sm text-blue-400 font-medium">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-400 shrink-0" />
            <p className="text-sm text-blue-400/80 leading-relaxed">
              {t("landing.educational.vs.tip")}
            </p>
          </div>

          <div className="max-w-4xl mx-auto py-12">
            <AdUnit type="in-feed" />
          </div>
        </section>

        {/* Supported Formats */}
        <section className="p-12 rounded-3xl border border-border bg-card/30 space-y-12">
          <div className="text-center space-y-4">
             <h2 className="text-3xl font-bold uppercase">{t("landing.educational.formats.title")}</h2>
             <p className="text-muted-foreground">{t("landing.educational.formats.subtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
             {(Array.isArray(t.raw("landing.educational.formats.items")) ? (t.raw("landing.educational.formats.items") as any[]) : []).map((format, i) => (
               <div key={i} className="space-y-4 p-6 rounded-3xl bg-background border border-border">
                  <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${i === 2 ? "text-yellow-500" : "text-emerald-500"}`}>
                    {i === 2 ? <AlertTriangle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                  </div>
                  <h4 className="font-bold text-lg leading-tight">{format.n}</h4>
                  <Badge variant="outline" className={`font-bold tracking-wider text-[9px] ${i === 2 ? "text-yellow-500" : "text-emerald-500"} border-current/20`}>{format.s}</Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">{format.d}</p>
               </div>
             ))}
          </div>
        </section>

        {/* Common Use Cases */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("landing.educational.useCases.title")}</h2>
            <p className="text-muted-foreground">{t("landing.educational.useCases.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
             {(Array.isArray(t.raw("landing.educational.useCases.items")) ? (t.raw("landing.educational.useCases.items") as string[]) : []).map((use, i) => {
               const useIcons = [Share2, EyeOff, MessageSquare, Fingerprint, ShieldCheck, Layers, Zap, Check];
               const colors = ["text-emerald-400", "text-blue-400", "text-purple-400", "text-pink-400", "text-cyan-400", "text-orange-400", "text-yellow-400", "text-red-400"];
               const Icon = useIcons[i % useIcons.length];
               const color = colors[i % colors.length];
               return (
                 <div key={i} className="p-6 rounded-3xl bg-card border border-border flex flex-col items-center text-center gap-4 hover:border-[#22C55E]/20 transition-all group">
                   <div className={`w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                     <Icon className="w-6 h-6" />
                   </div>
                   <h4 className="font-bold text-sm leading-tight">{use}</h4>
                 </div>
               );
             })}
          </div>
        </section>

        {/* Steganography Analysis (Forensics) Section */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
             <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full" />
             <div className="relative glass-card border-border rounded-3xl p-8 bg-card space-y-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-400">{t("landing.educational.forensics.histogram")}</h4>
                  <Badge variant="outline" className="text-[9px] border-blue-500/20 text-blue-400">{t("landing.educational.forensics.view")}</Badge>
                </div>
                <div className="h-32 w-full flex items-end gap-1">
                  {[40, 70, 45, 90, 65, 30, 85, 50, 95, 60, 75, 40, 80, 55].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-muted-foreground uppercase">{t("landing.educational.forensics.lsbSignature")}</span>
                    <span className="text-blue-400">{t("landing.educational.forensics.normalized")}</span>
                  </div>
                  <div className="h-1 w-full bg-blue-500/10 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-blue-500" />
                  </div>
                </div>
             </div>
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-1.5">{t("landing.educational.forensics.badge")}</Badge>
            <h2 className="text-4xl md:text-5xl font-bold uppercase leading-none" dangerouslySetInnerHTML={{ __html: t.raw("landing.educational.forensics.title") }} />
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t("landing.educational.forensics.description")}
            </p>
            <div className="space-y-4">
               {(Array.isArray(t.raw("landing.educational.forensics.items")) ? (t.raw("landing.educational.forensics.items") as any[]) : []).map((item, i) => (
                 <div key={i} className="flex gap-4 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <p className="text-sm leading-relaxed"><strong className="text-blue-400">{item.title}:</strong> {item.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Advanced Technical Specifications */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">{t("landing.educational.specs.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("landing.educational.specs.subtitle")}</p>
          </div>
          <div className="max-w-4xl mx-auto glass-card rounded-2xl border-border bg-card/30 overflow-hidden shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
              {(Array.isArray(t.raw("landing.educational.specs.items")) ? (t.raw("landing.educational.specs.items") as any[]) : []).map((spec, i) => (
                <div key={i} className="bg-card p-8 flex flex-col gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{spec.l}</span>
                  <span className="text-sm font-mono font-bold text-foreground tracking-tight">{spec.v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pro Security Tips */}
        <section className="grid lg:grid-cols-3 gap-8">
           {(Array.isArray(t.raw("landing.educational.tips.items")) ? (t.raw("landing.educational.tips.items") as any[]) : []).map((tip, i) => {
              const tipIcons = [Zap, Lock, Maximize2];
              const Icon = tipIcons[i % tipIcons.length];
              return (
                <div key={i} className="p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-4 group hover:bg-emerald-500/10 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h4 className="font-bold text-lg">{tip.t}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.d}</p>
                </div>
              );
           })}
        </section>

        {/* Security Warning Section */}
        <section className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 md:p-16 space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <ShieldAlert className="w-64 h-64 text-red-500" />
           </div>
           <div className="relative z-10 max-w-3xl space-y-6">
             <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-4 py-1.5 font-semibold uppercase tracking-wider text-[10px]">{t("landing.educational.notice.badge")}</Badge>
             <h2 className="text-4xl font-bold uppercase" dangerouslySetInnerHTML={{ __html: t.raw("landing.educational.notice.title") }} />
             <p className="text-xl text-red-400/80 leading-relaxed">
               {t("landing.educational.notice.description")}
             </p>
             <ul className="space-y-4">
               {(Array.isArray(t.raw("landing.educational.notice.points")) ? (t.raw("landing.educational.notice.points") as string[]) : []).map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-sm text-red-400/60 font-medium">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                   {item}
                 </li>
               ))}
             </ul>
           </div>
        </section>

        {/* FAQ Section */}
        <FAQ 
           items={t.raw("landing.faq.items") as any}
          title={t("landing.faq.title")}
          description={t("landing.faq.description")}
        />

        {/* Related Tools */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold uppercase">{t("landing.related.title")}</h2>
            <p className="text-muted-foreground">{t("landing.related.subtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
             {(Array.isArray(t.raw("landing.related.items")) ? (t.raw("landing.related.items") as any[]) : []).map((tool, i) => {
               const toolIcons = [Lock, Zap, MessageSquare, Fingerprint, ShieldCheck, Trash2];
               const Icon = toolIcons[i % toolIcons.length];
               const hrefs = ["/security/vault", "/security/metadata-cleaner", "/privacy/secure-notes", "/privacy/password-generator", "/privacy/password-checker", "/security/file-shredder"];
               const localizedNames: any = {
                 "File Vault": useTranslations("common")("tools.vault"),
                 "Metadata Cleaner": useTranslations("common")("tools.metadataCleaner"),
                 "Secure Notes": useTranslations("common")("tools.secureNotes"),
                 "Password Generator": useTranslations("common")("tools.passwordGenerator"),
                 "Strength Checker": useTranslations("common")("tools.passwordChecker"),
                 "File Shredder": useTranslations("common")("tools.fileShredder")
               };
               return (
                 <Link key={i} href={hrefs[i]} className="group p-6 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all">
                   <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <Icon className="w-5 h-5 text-primary" />
                   </div>
                   <h4 className="font-bold text-lg mb-1">{localizedNames[tool.n] || tool.n}</h4>
                   <p className="text-sm text-muted-foreground leading-tight">{tool.d}</p>
                 </Link>
               );
             })}
          </div>
        </section>

        <div className="max-w-6xl mx-auto py-16">
          <AdUnit type="multiplex" />
        </div>

        {/* Privacy Manifesto */}
        <section className="py-24 border-y border-border">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <Badge variant="outline" className="text-[10px] font-bold tracking-wider text-emerald-500 border-emerald-500/20 px-6 py-2 rounded-full">
                <span dangerouslySetInnerHTML={{ __html: t.raw("landing.manifesto.title") }} />
              </Badge>
              <h2 className="text-5xl md:text-7xl font-semibold uppercase tracking-tight leading-none">
                {t.rich("landing.manifesto.headline", { span: (c) => <span className="text-emerald-500">{c}</span>, br: () => <br /> })}
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
              {t("landing.manifesto.description")}
            </p>
            <div className="flex items-center justify-center gap-8 pt-8 grayscale opacity-50">
              <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-xs">
                <Shield className="w-5 h-5" /> {t("landing.manifesto.zeroServer")}
              </div>
              <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-xs">
                <Globe className="w-5 h-5" /> {t("landing.manifesto.localFirst")}
              </div>
              <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-xs">
                <Zap className="w-5 h-5" /> {t("landing.manifesto.noTracking")}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

function Link({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
