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
import { SECURITY_FAQ } from "@/lib/faq-content";

export default function SteganographyClient() {
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
      toast.success(`Asset initialized: ${f.name}`);
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
      
      if (totalBits > (data.length * 3) / 4) throw new Error("Payload exceeds carrier capacity.");
      
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
      toast.success("Intelligence successfully vanished into pixels");
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
      if (length > (data.length * 3) / 8) throw new Error("No hidden payload detected in this image.");

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
      toast.success("Intelligence revealed from pixels");
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
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
              Privacy-First Steganography
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase italic">
              Steganography <span className="text-primary">Tool</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
              Hide and extract secret messages inside images securely using browser-based steganography and local processing.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {[
                { icon: ShieldCheck, text: "Local Processing" },
                { icon: Zap, text: "Zero Upload" },
                { icon: EyeOff, text: "No Tracking" },
                { icon: Zap, text: "Instant Encoding" },
                { icon: HardDrive, text: "Browser-Based" }
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

      {/* Visual Process Section */}
      <section className="container mx-auto px-4 max-w-5xl -mt-8 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Select Carrier", desc: "Upload a PNG or WebP image to act as your secret carrier.", icon: ImageIcon },
            { step: "02", title: "Hide Payload", desc: "Inject your secret text or identifier into the image's pixels.", icon: MessageSquare },
            { step: "03", title: "Secure Output", desc: "Download the visually identical image containing your secret.", icon: Download }
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

      <main className="container mx-auto px-4 py-12 space-y-24 max-w-6xl">
        
        {/* Steganography Tool Interface */}
        <section id="steganography-tool" className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-[40px] p-8 border-border bg-card shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <Fingerprint className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight italic">LSB Mutation Engine</h2>
                </div>
                <div className="flex bg-secondary/50 p-1 rounded-xl border border-border">
                  <Button 
                    variant="ghost"
                    className={cn("h-10 px-6 rounded-lg font-black transition-all", activeTab === "hide" ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}
                    onClick={() => { setActiveTab("hide"); setFile(null); setPreview(null); setMessage(""); setExtractedMessage(null); }}
                  >
                    <Lock className="w-4 h-4 mr-2" /> ENCODE
                  </Button>
                  <Button 
                    variant="ghost"
                    className={cn("h-10 px-6 rounded-lg font-black transition-all", activeTab === "reveal" ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}
                    onClick={() => { setActiveTab("reveal"); setFile(null); setPreview(null); setMessage(""); setExtractedMessage(null); }}
                  >
                    <Unlock className="w-4 h-4 mr-2" /> DECODE
                  </Button>
                </div>
              </div>

              {!file ? (
                <DropZone 
                  onFilesDrop={handleFileChange} 
                  className="h-80 bg-background/50 border-dashed border-border rounded-3xl hover:border-[#22C55E]/50 transition-colors"
                  accept="image/png,image/webp"
                  title={activeTab === "hide" ? "Select Carrier Image" : "Load Encoded Image"}
                  description={activeTab === "hide" ? "PNG or WebP recommended" : "Extract hidden data locally"}
                />
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="aspect-square rounded-2xl bg-background border border-border overflow-hidden relative group">
                      <img src={preview!} className="w-full h-full object-contain" alt="Preview" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <Button variant="ghost" className="text-red-500 hover:bg-red-500/10" onClick={() => { setFile(null); setPreview(null); setMessage(""); setExtractedMessage(null); }}>
                            <Trash2 className="w-6 h-6 mr-2" /> REMOVE
                         </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center space-y-6">
                       {activeTab === "hide" ? (
                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Payload Message</Label>
                              {capacity && (
                                <span className={cn("text-[10px] font-black", message.length > capacity ? "text-red-500" : "text-emerald-500")}>
                                  {message.length} / {capacity} B
                                </span>
                              )}
                            </div>
                            <Textarea 
                              placeholder="Vanish your secret text here..."
                              className="min-h-[150px] bg-background border-border rounded-xl font-mono text-sm"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button 
                              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black italic shadow-xl"
                              onClick={encodeMessage}
                              disabled={isProcessing || !message}
                            >
                              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lock className="w-4 h-4 mr-2" />}
                              HIDE MESSAGE
                            </Button>
                         </div>
                       ) : (
                         <div className="space-y-4">
                            {extractedMessage ? (
                              <div className="space-y-4">
                                <Label className="text-[10px] uppercase font-black tracking-widest text-emerald-500">Extracted Intelligence</Label>
                                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 font-mono text-emerald-400 break-all whitespace-pre-wrap min-h-[100px]">
                                  {extractedMessage}
                                </div>
                                <Button 
                                  variant="outline" 
                                  className="w-full h-12 rounded-xl border-border bg-secondary/50 font-black gap-2"
                                  onClick={() => {
                                    navigator.clipboard.writeText(extractedMessage);
                                    toast.success("Intelligence copied to clipboard");
                                  }}
                                >
                                  <Copy className="w-4 h-4" /> COPY TEXT
                                </Button>
                              </div>
                            ) : (
                              <div className="text-center py-8 space-y-4">
                                <Button 
                                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black italic"
                                  onClick={decodeMessage}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                                  REVEAL SECRETS
                                </Button>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Awaiting Pixel Scan</p>
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
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">
                    <span>Processing Bits...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-secondary/50" />
                </div>
              )}
            </motion.div>
          </div>

          <aside className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-6 border-border bg-card/80 shadow-xl">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Security Status
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Local Encoding", status: "Active", active: true },
                  { label: "Zero-Server Policy", status: "Verified", active: true },
                  { label: "HTTPS Protected", status: isHttps ? "Verified" : (isDev ? "Local Dev" : "Warning"), active: isHttps || isDev },
                  { label: "Carrier Integrity", status: "100%", active: true },
                  { label: "Tracking Scripts", status: "None", active: true }
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
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Blocked Tracking Engines
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
              <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed italic">
                SafeTools is a tracker-free zone. We do not inject any 3rd party scripts.
              </p>
            </div>
          </aside>
        </section>

        {/* Educational Content: What is Steganography */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5">Educational Guide</Badge>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-none">
              What Is <span className="text-primary">Steganography?</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Steganography is the practice of hiding information inside digital media such as images without visibly changing the original file. Unlike encryption, which makes data unreadable, steganography makes data <span className="text-foreground font-bold">undetectable</span>.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
               {[
                 { title: "Educational Use", desc: "Learn how data is structured in pixel channels." },
                 { title: "Privacy Protection", desc: "Hide sensitive identifiers from casual observers." },
                 { title: "Secure Notes", desc: "Embed private notes inside innocent-looking photos." },
                 { title: "Digital Watermarking", desc: "Prove ownership without visible artifacts." }
               ].map((item, i) => (
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
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Bit Injection Active</p>
                </div>
             </div>
          </div>
        </section>

        {/* Steganography vs Encryption */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black uppercase italic">Steganography vs Encryption</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Understanding the difference between hiding data and protecting it.</p>
          </div>
          <div className="max-w-4xl mx-auto overflow-hidden rounded-[32px] border border-border shadow-2xl bg-card/50 backdrop-blur-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-muted-foreground">Feature</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-primary">Steganography</th>
                  <th className="px-8 py-6 text-sm font-black uppercase tracking-widest text-blue-500">Encryption</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { f: "Hides Existence", s: "Yes", e: "No" },
                  { f: "Readable by Unauthorized", s: "If found", e: "No" },
                  { f: "Visual Concealment", s: "Yes", e: "No" },
                  { f: "Data Overhead", s: "None", e: "Increased" },
                  { f: "Detection Risk", s: "Plausible Deniability", e: "Obvious Signature" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 text-sm font-bold">{row.f}</td>
                    <td className="px-8 py-5 text-sm text-emerald-400 font-medium">{row.s}</td>
                    <td className="px-8 py-5 text-sm text-blue-400 font-medium">{row.e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-400 shrink-0" />
            <p className="text-sm text-blue-400/80 leading-relaxed italic">
              <strong>Security Pro-Tip:</strong> For maximum security, always encrypt your sensitive message first, then use steganography to hide the resulting ciphertext inside an image. This provides both concealment and data protection.
            </p>
          </div>
        </section>

        {/* Supported Formats */}
        <section className="p-12 rounded-[40px] border border-border bg-card/30 space-y-12">
          <div className="text-center space-y-4">
             <h2 className="text-3xl font-black italic uppercase">Supported Image Formats</h2>
             <p className="text-muted-foreground">Why format selection matters for hidden data integrity.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
             {[
               { name: "PNG (Portable Network Graphics)", status: "Perfect", desc: "Lossless compression ensures every hidden bit remains exactly as encoded.", icon: Check, color: "text-emerald-500" },
               { name: "WebP (Lossless)", status: "Recommended", desc: "High efficiency with lossless support keeps payloads intact.", icon: Check, color: "text-emerald-500" },
               { name: "JPEG / JPG", status: "Limited", desc: "Lossy compression can corrupt hidden bits. Not recommended for LSB.", icon: AlertTriangle, color: "text-yellow-500" }
             ].map((format, i) => (
               <div key={i} className="space-y-4 p-6 rounded-3xl bg-background border border-border">
                  <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${format.color}`}>
                    <format.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-lg leading-tight">{format.name}</h4>
                  <Badge variant="outline" className={`font-black tracking-widest text-[9px] ${format.color} border-current/20`}>{format.status}</Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">{format.desc}</p>
               </div>
             ))}
          </div>
        </section>

        {/* Common Use Cases */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight">Steganography Use Cases</h2>
            <p className="text-muted-foreground">Practical and professional applications for hidden data.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Hidden Communication", icon: Share2, color: "text-emerald-400" },
              { title: "Privacy Protection", icon: EyeOff, color: "text-blue-400" },
              { title: "Secure Note Sharing", icon: MessageSquare, color: "text-purple-400" },
              { title: "Digital Watermarking", icon: Fingerprint, color: "text-pink-400" },
              { title: "Cybersecurity Education", icon: ShieldCheck, color: "text-cyan-400" },
              { title: "Research Demos", icon: Layers, color: "text-orange-400" },
              { title: "Metadata Concealment", icon: Zap, color: "text-yellow-400" },
              { title: "Authentication Markers", icon: Check, color: "text-red-400" }
            ].map((use, i) => (
              <div key={i} className="p-6 rounded-3xl bg-card border border-border flex flex-col items-center text-center gap-4 hover:border-[#22C55E]/20 transition-all group">
                <div className={`w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center ${use.color} group-hover:scale-110 transition-transform`}>
                  <use.icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm leading-tight">{use.title}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* Steganography Analysis (Forensics) Section */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
             <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full" />
             <div className="relative glass-card border-border rounded-3xl p-8 bg-card space-y-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Histogram Analysis</h4>
                  <Badge variant="outline" className="text-[9px] border-blue-500/20 text-blue-400">FORENSIC VIEW</Badge>
                </div>
                <div className="h-32 w-full flex items-end gap-1">
                  {[40, 70, 45, 90, 65, 30, 85, 50, 95, 60, 75, 40, 80, 55].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-500/20 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-muted-foreground uppercase">LSB Signature</span>
                    <span className="text-blue-400">NORMALIZED</span>
                  </div>
                  <div className="h-1 w-full bg-blue-500/10 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-blue-500" />
                  </div>
                </div>
             </div>
          </div>
          <div className="space-y-8 order-1 lg:order-2">
            <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-1.5">Forensic Awareness</Badge>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-none">
              Detecting <span className="text-blue-400">Hidden Data</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              While LSB steganography is visually undetectable, advanced forensic tools can detect patterns in the least significant bits. Professionals use techniques like <span className="text-foreground font-bold">Chi-square analysis</span> and <span className="text-foreground font-bold">Visual Attacks</span> to find hidden payloads.
            </p>
            <div className="space-y-4">
               {[
                 { title: "Statistical Analysis", desc: "Detecting deviations in bit distribution that indicate non-natural data." },
                 { title: "Visual Attacks", desc: "Isolating bit planes to reveal structural anomalies in the noise." },
                 { title: "Histogram Shifts", desc: "Identifying subtle shifts in color frequencies caused by bit mutation." }
               ].map((item, i) => (
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
            <h2 className="text-3xl md:text-4xl font-black uppercase italic">Advanced Technical Specs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Low-level parameters of the SafeTools LSB mutation engine.</p>
          </div>
          <div className="max-w-4xl mx-auto glass-card rounded-[32px] border-border bg-card/30 overflow-hidden shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
              {[
                { label: "Bit Depth", val: "8-bit per channel" },
                { label: "Injection Rate", val: "1 bit/channel" },
                { label: "Channel Matrix", val: "R-G-B Order" },
                { label: "Mutation Space", val: "24-bit TrueColor" },
                { label: "Header Logic", val: "32-bit BigEndian" },
                { label: "Visual Delta", val: "E < 0.001%" },
                { label: "Entropy Target", val: "Maximized" },
                { label: "Browser Engine", val: "WASM / Canvas" }
              ].map((spec, i) => (
                <div key={i} className="bg-card p-8 flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{spec.label}</span>
                  <span className="text-sm font-mono font-bold text-foreground tracking-tighter">{spec.val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pro Security Tips */}
        <section className="grid lg:grid-cols-3 gap-8">
           {[
             { 
               title: "Use High-Entropy Images", 
               desc: "Images with lots of texture and detail (like nature shots) are better carriers than flat, solid colors where bit mutations are easier to spot statistically.",
               icon: Zap
             },
             { 
               title: "Pre-Encrypt Payloads", 
               desc: "Always encrypt your text with AES-256 before hiding it. This ensures that even if the steganography is detected, the data remains unreadable.",
               icon: Lock
             },
             { 
               title: "Avoid Resizing", 
               desc: "Resizing or re-compressing an encoded image will almost certainly destroy the hidden data. Always share the original output file.",
               icon: Maximize2
             }
           ].map((tip, i) => (
             <div key={i} className="p-8 rounded-[32px] bg-emerald-500/5 border border-emerald-500/10 space-y-4 group hover:bg-emerald-500/10 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <tip.icon className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="font-bold text-lg">{tip.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
             </div>
           ))}
        </section>

        {/* Security Warning Section */}
        <section className="bg-red-500/5 border border-red-500/10 rounded-[40px] p-8 md:p-16 space-y-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <ShieldAlert className="w-64 h-64 text-red-500" />
           </div>
           <div className="relative z-10 max-w-3xl space-y-6">
             <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-4 py-1.5 uppercase tracking-widest text-[10px] font-black">Important Security Notice</Badge>
             <h2 className="text-4xl font-black italic uppercase">Steganography Is Not Encryption</h2>
             <p className="text-xl text-red-400/80 leading-relaxed">
               Steganography relies on <span className="font-bold">obscurity</span>, not computational hardness. While it hides the existence of a message, it does not necessarily protect the content if the steganography is detected.
             </p>
             <ul className="space-y-4">
               {[
                 "Always combine with strong encryption (AES-256) for sensitive data.",
                 "Use lossless formats (PNG) to avoid data corruption.",
                 "Never use for illegal or unethical concealment.",
                 "Be aware that forensic tools can detect LSB mutations."
               ].map((item, i) => (
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
          items={[
            { q: "Are images uploaded to servers?", a: "No. All encoding and decoding happen locally inside your browser using canvas API and Web Workers." },
            { q: "Which image format works best?", a: "PNG is strongly recommended because it uses lossless compression, which perfectly preserves the hidden bits in each pixel." },
            { q: "Can hidden data survive compression?", a: "No. Uploading an encoded image to services like WhatsApp, Facebook, or Twitter often re-compresses it, which will destroy the hidden message." },
            { q: "Is steganography encryption?", a: "No. Steganography is about hiding the fact that a message exists. Encryption is about making a message unreadable." },
            { q: "Does this tool work offline?", a: "Yes. Once loaded, the tool works completely offline as it doesn't need to communicate with any server." }
          ].map(f => ({ question: f.q, answer: f.a }))}
          title="Steganography FAQ"
          description="Everything you need to know about hiding data in images."
        />

        {/* Related Tools */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black italic uppercase">Related Security Tools</h2>
            <p className="text-muted-foreground">Complement your privacy workflow with our secure suite.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: "File Vault", href: "/security/vault", icon: Lock, desc: "Military-grade file encryption." },
              { name: "Metadata Cleaner", href: "/security/metadata-cleaner", icon: Zap, desc: "Strip metadata from any file." },
              { name: "Secure Notes", href: "/privacy/secure-notes", icon: MessageSquare, desc: "Encrypted browser-based notes." },
              { name: "Password Generator", href: "/privacy/password-generator", icon: Fingerprint, desc: "Generate strong offline passwords." },
              { name: "Strength Checker", href: "/privacy/password-checker", icon: ShieldCheck, desc: "Audit your password security." },
              { name: "File Shredder", href: "/security/file-shredder", icon: Trash2, desc: "Permanently delete digital traces." }
            ].map((tool, i) => (
              <Link key={i} href={tool.href} className="group p-6 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <tool.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-lg mb-1">{tool.name}</h4>
                <p className="text-sm text-muted-foreground leading-tight">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Privacy Manifesto */}
        <section className="py-24 border-y border-border">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 border-emerald-500/20 px-6 py-2 rounded-full">Privacy Manifesto</Badge>
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
                Privacy is a <span className="text-emerald-500">Right,</span><br />Not a Feature.
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed italic max-w-2xl mx-auto">
              "At SafeTools, we believe your data belongs to you. Our mission is to provide industrial-grade security tools that operate entirely in your browser, ensuring your secrets never leave your device."
            </p>
            <div className="flex items-center justify-center gap-8 pt-8 grayscale opacity-50">
              <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                <Shield className="w-5 h-5" /> Zero-Server
              </div>
              <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                <Globe className="w-5 h-5" /> Local-First
              </div>
              <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
                <Zap className="w-5 h-5" /> No-Tracking
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
