"use client";

import React, { useState, useRef } from "react";
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
  ShieldQuestion
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

  const calculateCapacity = (img: HTMLImageElement) => {
    // Each pixel has 3 color channels (RGB) we can use for LSB
    // 1 bit per channel = 3 bits per pixel
    const totalPixels = img.width * img.height;
    const totalBits = totalPixels * 3;
    const totalBytes = Math.floor(totalBits / 8) - 4; // 4 bytes for length header
    setCapacity(totalBytes);
  };

  const handleFileChange = (files: File[]) => {
    const f = files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setExtractedMessage(null);
      setError(null);
      
      const img = new Image();
      img.src = URL.createObjectURL(f);
      img.onload = () => {
        calculateCapacity(img);
        URL.revokeObjectURL(img.src);
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
      if (length > (data.length * 3) / 8) throw new Error("Invalid payload length detected.");

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
    <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative scrollbar-hide">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[160px] rounded-full animate-pulse" />
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
                <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-blue-600 p-[1px] mx-auto animate-pulse">
                  <div className="w-full h-full rounded-[calc(2.5rem-1px)] bg-black flex items-center justify-center border border-white/5">
                    <Fingerprint className="w-10 h-10 text-emerald-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                    Secret <span className="text-emerald-500">Studio.</span>
                  </h1>
                  <p className="text-muted-foreground text-xl font-medium max-w-lg mx-auto leading-relaxed">
                    LSB bit-injection engine. Vanish classified data inside standard PNG pixels with zero visual trace.
                  </p>
                </div>
              </div>
              <DropZone 
                onFilesDrop={handleFileChange} 
                accept="image/png" 
                multiple={false} 
                className="h-64 border-dashed border-white/10 bg-white/5 rounded-[3rem] hover:bg-white/[0.08] transition-all"
              />
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Identity Engine */}
            <aside className="flex w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Identity Engine
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Multi-Platform Asset Matrix</p>
                    <div className="flex gap-1.5 opacity-30">
                      <Play className="w-2 h-2 text-emerald-500 fill-emerald-500" />
                      <div className="w-2 h-2 rounded-full border border-white/40" />
                      <Smartphone className="w-2 h-2" />
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 text-white/40 px-4 py-1.5 rounded-full font-black italic">ACTIVE</Badge>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-8 space-y-10">
                   <div className="aspect-square rounded-[3rem] bg-black/40 border border-white/10 overflow-hidden relative group">
                      <img src={preview!} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8">
                         <Button variant="ghost" className="rounded-2xl text-red-500 hover:bg-red-500/10" onClick={() => { setFile(null); setPreview(null); setMessage(""); setExtractedMessage(null); }}>
                            <Trash2 className="w-6 h-6" />
                         </Button>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-white/20">Operational Mode</Label>
                      <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
                         <Button 
                            variant={activeTab === "hide" ? "default" : "ghost"}
                            className={cn("rounded-xl h-12 font-black uppercase tracking-widest text-[10px] transition-all", activeTab === "hide" && "bg-emerald-600 shadow-lg")}
                            onClick={() => setActiveTab("hide")}
                         >
                            <Lock className="w-3.5 h-3.5 mr-2" /> Hide
                         </Button>
                         <Button 
                            variant={activeTab === "reveal" ? "default" : "ghost"}
                            className={cn("rounded-xl h-12 font-black uppercase tracking-widest text-[10px] transition-all", activeTab === "reveal" && "bg-emerald-600 shadow-lg")}
                            onClick={() => setActiveTab("reveal")}
                         >
                            <Unlock className="w-3.5 h-3.5 mr-2" /> Reveal
                         </Button>
                      </div>
                   </div>

                   <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="flex items-center gap-3 text-emerald-500">
                      <Zap className="w-5 h-5" />
                      <h4 className="text-xs font-black uppercase tracking-widest">Protocol LSB</h4>
                    </div>
                    <p className="text-[10px] text-white/30 leading-relaxed font-medium">
                      High-entropy bit injection limited to least significant bits. Guaranteed visual zero-delta.
                    </p>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-white/5 bg-black/40 shrink-0">
                <Button 
                  className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm gap-2 shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all italic"
                  onClick={activeTab === "hide" ? encodeMessage : decodeMessage}
                  disabled={isProcessing || (activeTab === "hide" && !message)}
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : activeTab === "hide" ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  {activeTab === "hide" ? "VANISH PAYLOAD" : "REVEAL SECRETS"}
                </Button>
              </div>
            </aside>

            {/* Center - Interaction Workspace */}
            <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[600px] lg:min-h-0">
              <header className="p-8 flex items-center justify-between bg-black/40 backdrop-blur-3xl border-b border-white/5 relative z-20">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-2xl">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="font-black text-2xl tracking-tighter uppercase italic truncate max-w-[200px] md:max-w-md">
                      LSB Mutation Studio
                    </h2>
                    <div className="flex items-center gap-4">
                      <Badge className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1 rounded-full font-black uppercase tracking-widest italic">
                        {activeTab === "hide" ? "INJECTION ENGINE" : "EXTRACTION ENGINE"}
                      </Badge>
                      <span className="text-[10px] text-white/20 uppercase font-black tracking-widest truncate max-w-[200px]">
                        {file?.name || "Matrix Standby"}
                      </span>
                    </div>
                  </div>
                </div>
              </header>

              <ScrollArea className="flex-grow relative z-10 min-h-0">
                <div className="p-8 lg:p-12">
                   <div className="max-w-3xl mx-auto space-y-12">
                      <AnimatePresence mode="wait">
                         {activeTab === "hide" ? (
                           <motion.div key="hide" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Intelligence Payload</Label>
                                  <span className={cn(
                                    "text-[10px] font-black tabular-nums tracking-widest",
                                    capacity && message.length > capacity ? "text-red-500" : "text-primary"
                                  )}>
                                    {message.length} / {capacity || "..."} <span className="opacity-40 ml-1">BYTES</span>
                                  </span>
                                </div>
                                <Textarea 
                                  placeholder="Vanish your secrets here..." 
                                  className="min-h-[160px] bg-white/[0.03] border-white/10 rounded-[2rem] p-6 focus:border-primary/50 transition-all font-mono text-sm leading-relaxed"
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                />
                                {capacity && (
                                  <div className="space-y-2">
                                     <Progress value={Math.min(100, (message.length / capacity) * 100)} className="h-1 bg-white/5" />
                                     <p className="text-[8px] font-black uppercase tracking-widest text-white/20 text-right">
                                       Carrier Saturation: {Math.round((message.length / capacity) * 100)}%
                                     </p>
                                  </div>
                                )}
                              </div>
                              {isProcessing && (
                                <div className="space-y-3">
                                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">
                                      <span>Bit-Injection Sequence Active...</span>
                                      <span>{progress}%</span>
                                   </div>
                                   <Progress value={progress} className="h-2 bg-white/5 rounded-full" />
                                </div>
                              )}
                           </motion.div>
                         ) : (
                           <motion.div key="reveal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                               {extractedMessage ? (
                                 <div className="space-y-6">
                                    <div className="p-10 rounded-[3rem] bg-black/80 border border-emerald-500/20 font-mono text-xl leading-relaxed text-emerald-400 shadow-[0_50px_100px_-20px_rgba(16,185,129,0.2)] break-all whitespace-pre-wrap">
                                      {extractedMessage}
                                    </div>
                                    <Button 
                                      variant="outline" 
                                      className="w-full h-16 rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest gap-3"
                                      onClick={() => {
                                        navigator.clipboard.writeText(extractedMessage);
                                        toast.success("Intelligence copied to secure clipboard");
                                      }}
                                    >
                                      <Copy className="w-5 h-5" /> Copy Intelligence
                                    </Button>
                                 </div>
                               ) : (
                                 <div className="py-20 text-center space-y-8">
                                    <div className="w-32 h-32 rounded-[3.5rem] bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/20">
                                       <Fingerprint className="w-16 h-16 text-emerald-500 animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                       <h3 className="text-2xl font-black uppercase tracking-tight italic">Scan carrier for signatures</h3>
                                       <p className="text-white/20 font-black uppercase text-[10px] tracking-widest">Awaiting WASM thread execution</p>
                                    </div>
                                 </div>
                               )}
                               {isProcessing && <Progress value={progress} className="h-2 bg-white/5" />}
                           </motion.div>
                         )}
                      </AnimatePresence>

                      {error && (
                        <Card className="p-6 bg-red-500/5 border-red-500/20 text-red-500 flex items-center gap-4 rounded-3xl">
                           <ShieldAlert className="w-6 h-6" />
                           <p className="font-black uppercase tracking-widest text-[10px]">{error}</p>
                        </Card>
                      )}
                   </div>
                </div>
              </ScrollArea>
            </section>

            {/* Right Sidebar - Studio Matrix */}
            <aside className="flex w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl shrink-0 flex-col relative z-10 shadow-2xl h-[600px] lg:h-full">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 flex items-center gap-3">
                    <Settings2 className="w-4 h-4" /> Studio Matrix
                  </h3>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none mt-1">WASM Thread Execution</p>
                </div>
                <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 text-white/40 px-4 py-1.5 rounded-full font-black italic">ACTIVE</Badge>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-8 space-y-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20">Protocol Intel</h4>
                    <div className="space-y-4">
                        {[
                          { label: "Injection Delta", value: "0.001%", icon: Zap },
                          { label: "Plausible Deniability", value: "ACTIVE", icon: EyeOff },
                          { label: "Carrier Integrity", value: "SECURE", icon: Maximize2 }
                        ].map((stat, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                             <div className="flex items-center gap-3">
                                <stat.icon className="w-4 h-4 text-white/20" />
                                <span className="text-[10px] font-black uppercase text-white/60 tracking-wider italic">{stat.label}</span>
                             </div>
                             <Badge variant="outline" className="text-[9px] border-white/10 text-emerald-500 font-black">{stat.value}</Badge>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-emerald-500" />
                      <h4 className="text-xs font-black uppercase tracking-widest">Matrix Guard</h4>
                    </div>
                    <p className="text-[10px] text-white/30 leading-relaxed font-medium">
                      Encryption occurs in isolated WASM threads. No intelligence packets leave the localized environment.
                    </p>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="p-8 border-t border-white/5 bg-black/40 shrink-0">
                 <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Intelligence Secured
                 </div>
              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  );
}
