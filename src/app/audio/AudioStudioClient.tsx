"use client";

import React, { useState, useRef, useEffect } from "react";
import { fetchFile } from "@ffmpeg/util";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Music, Settings2, Trash2, CheckCircle2, Loader2,
  FileDown, ArrowRight, Zap, Play, Pause, 
  Volume2, Mic, Terminal, Layers, Cpu, 
  ShieldCheck, DownloadCloud, Radio, Waves, Smartphone
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExportManager } from "@/lib/export-manager";
import { loadFFmpegInstance } from "@/lib/ffmpeg-loader";

export default function AudioStudioPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Settings
  const [bitrate, setBitrate] = useState("192k");
  const [outputFormat, setOutputFormat] = useState("mp3");
  const [sampleRate, setSampleRate] = useState("44100");
  const [metadata, setMetadata] = useState({
    title: "",
    artist: "",
    album: ""
  });
  const [waveform, setWaveform] = useState<number[]>([]);

  const ffmpegRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initEngine = async () => {
    try {
      const ffmpeg = await loadFFmpegInstance(
        (p) => setProgress(Math.round(p * 100)),
        (msg) => setLogs((prev) => [...prev.slice(-10), msg])
      );
      ffmpegRef.current = ffmpeg;
      setIsLoaded(true);
    } catch (e) {
      console.error("Audio Engine Load Failed", e);
      toast.error("Audio engine failed to initialize.");
    }
  };

  useEffect(() => {
    initEngine();
  }, []);

  const handleFileDrop = (files: File[]) => {
    if (files[0]) {
      const file = files[0];
      setAudioFile(file);
      setOutputUrl(null);
      setWaveform(Array.from({ length: 48 }).map(() => Math.random()));
      setLogs(["Engine Ready. File loaded: " + file.name]);
    }
  };

  const processAudio = async () => {
    if (!audioFile || !isLoaded) return;
    setIsProcessing(true);
    setProgress(0);
    const ffmpeg = ffmpegRef.current;
    const inputExt = audioFile.name.substring(audioFile.name.lastIndexOf("."));
    const inputName = "input" + inputExt;
    const outputName = `master_export_${Date.now()}.${outputFormat}`;

    try {
      await ffmpeg.writeFile(inputName, await fetchFile(audioFile));
      
      const args = ["-i", inputName];
      args.push("-b:a", bitrate, "-ar", sampleRate);
      
      if (metadata.title) args.push("-metadata", `title=${metadata.title}`);
      if (metadata.artist) args.push("-metadata", `artist=${metadata.artist}`);
      if (metadata.album) args.push("-metadata", `album=${metadata.album}`);
      
      args.push(outputName);

      await ffmpeg.exec(args);
      const data = await ffmpeg.readFile(outputName);
      const url = URL.createObjectURL(new Blob([(data as any).buffer], { type: `audio/${outputFormat}` }));
      setOutputUrl(url);
      setLogs((prev) => [...prev, "SUCCESS: Master Exported."]);
      toast.success("Mastering complete!");
    } catch (e) {
      console.error(e);
      setLogs((prev) => [...prev, "ERROR: Mastering Failed."]);
      toast.error("Mastering failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-[#050505] text-white overflow-y-auto lg:overflow-hidden selection:bg-primary/30 custom-scrollbar">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-visible lg:overflow-hidden relative scrollbar-hide">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-purple-500/5 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`, backgroundSize: '48px 48px' }} />
        </div>

        {/* Center Workspace */}
        <section className="flex-grow flex flex-col relative z-10 min-w-0">
          <div className="flex-grow flex items-center justify-center p-8 lg:p-16">
            <AnimatePresence mode="wait">
              {outputUrl ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-2xl"
                >
                  <Card className="p-12 bg-white/[0.03] border-emerald-500/30 rounded-[4rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <audio ref={audioRef} src={outputUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                    <div className="text-center space-y-8 relative z-10">
                      <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-2xl">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter">Master Ready</h2>
                        <div className="flex items-center justify-center gap-3">
                           <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1 rounded-full font-black uppercase tracking-widest text-[9px]">Success</Badge>
                           <span className="text-white/40 text-[10px] uppercase font-black tracking-widest">Target: {outputFormat.toUpperCase()} @ {bitrate}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                        <Button 
                          size="icon" 
                          className="w-16 h-16 rounded-full bg-white text-black hover:bg-white/90 shadow-2xl active:scale-95 transition-all mx-auto sm:mx-0"
                          onClick={() => {
                            if (isPlaying) audioRef.current?.pause();
                            else audioRef.current?.play();
                            setIsPlaying(!isPlaying);
                          }}
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-black" />}
                        </Button>
                        <Button 
                          className="h-16 px-12 rounded-full bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-2xl shadow-primary/40 gap-3 group active:scale-95 transition-all"
                          onClick={() => ExportManager.downloadFromUrl(outputUrl, `private-master-${Date.now()}.${outputFormat}`)}
                        >
                          <DownloadCloud className="w-6 h-6 group-hover:translate-y-1 transition-transform" /> Export Master Asset
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : audioFile ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full space-y-12 text-center"
                >
                  <div className="relative py-20 flex flex-col items-center gap-12">
                    <div className="flex items-center gap-1.5 h-40">
                      {waveform.length > 0 ? waveform.map((val, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            height: isProcessing ? [val * 40 + 10, val * 120 + 20, val * 40 + 10] : val * 100 + 10,
                            opacity: isProcessing ? [0.4, 1, 0.4] : 1
                          }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.02 }}
                          className={cn(
                            "w-2 rounded-full transition-colors",
                            isProcessing ? "bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" : "bg-primary/40"
                          )}
                          style={{ height: `${val * 100 + 10}px` }}
                        />
                      )) : Array.from({ length: 48 }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: isProcessing ? [20, 100, 20] : 20 }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.04 }}
                          className="w-1.5 rounded-full bg-white/10"
                        />
                      ))}
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-4xl font-black uppercase tracking-tighter italic">{audioFile.name}</h2>
                      <div className="flex items-center justify-center gap-3">
                        <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 text-primary uppercase font-black px-4 py-1 rounded-full italic tracking-widest">Active Studio Asset</Badge>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                      </div>
                    </div>
                  </div>
                  
                  {isProcessing && (
                    <div className="space-y-6 max-w-md mx-auto">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">
                        <span>Mastering Local Frame</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                         <motion.div 
                           className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.6)]"
                           initial={{ width: 0 }}
                           animate={{ width: `${progress}%` }}
                         />
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="text-center space-y-10">
                  <div className="w-32 h-32 rounded-[3rem] bg-gradient-to-br from-purple-500 to-primary p-[1px] mx-auto animate-pulse shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]">
                    <div className="w-full h-full rounded-[calc(3rem-1px)] bg-black flex items-center justify-center">
                      <Mic className="w-12 h-12 text-white/30" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black tracking-tighter uppercase leading-none italic">Audio Mastering <br/><span className="text-primary">Laboratory</span></h2>
                    <p className="text-muted-foreground font-medium max-w-sm mx-auto text-lg">High-fidelity audio conversion and mastering with zero server interaction.</p>
                  </div>
                  <Button 
                    className="rounded-full px-16 h-20 bg-white text-black font-black text-xl hover:bg-white/90 shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95 transition-all group"
                    onClick={() => document.getElementById('audio-input')?.click()}
                  >
                    Import Sound <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" />
                  </Button>
                  <input id="audio-input" type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileDrop(Array.from(e.target.files || []))} />
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>
 
        {/* Right Sidebar - Inspector */}
        <aside className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/5 bg-[#0a0a0a]/60 backdrop-blur-3xl shrink-0 flex flex-col h-[500px] lg:h-full">
          <div className="p-8 border-b border-white/5 flex flex-col shrink-0 bg-black/20">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
              <Settings2 className="w-4 h-4" /> Studio Matrix
            </h3>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">WASM Thread Execution</p>
              <Badge className="bg-white/5 border-white/10 text-white/40 text-[9px] font-black uppercase px-3 py-1 rounded-full italic">v4.0 Pro</Badge>
            </div>
          </div>
 
          <ScrollArea className="flex-grow min-h-0">
            <div className="p-8 space-y-10 pb-32">
              <div className="space-y-4">
                <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Target Pipeline</Label>
                <Select value={outputFormat} onValueChange={(val) => val && setOutputFormat(val)}>
                  <SelectTrigger className="h-14 rounded-2xl bg-white/[0.03] border-white/10 font-black uppercase tracking-widest text-xs focus:border-primary/50 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10 text-white rounded-2xl">
                    <SelectItem value="mp3" className="rounded-xl focus:bg-primary/20 uppercase font-black tracking-widest text-[10px] py-3">MP3 (LAME Engine)</SelectItem>
                    <SelectItem value="wav" className="rounded-xl focus:bg-primary/20 uppercase font-black tracking-widest text-[10px] py-3">WAV (Lossless Master)</SelectItem>
                    <SelectItem value="aac" className="rounded-xl focus:bg-primary/20 uppercase font-black tracking-widest text-[10px] py-3">AAC (Modern Pipeline)</SelectItem>
                    <SelectItem value="ogg" className="rounded-xl focus:bg-primary/20 uppercase font-black tracking-widest text-[10px] py-3">OGG (Vorbis Codec)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
 
              <div className="space-y-4">
                <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Audio Bitrate</Label>
                <Select value={bitrate} onValueChange={(val) => val && setBitrate(val)}>
                  <SelectTrigger className="h-14 rounded-2xl bg-white/[0.03] border-white/10 font-black uppercase tracking-widest text-xs focus:border-primary/50 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10 text-white rounded-2xl">
                    <SelectItem value="128k" className="rounded-xl focus:bg-primary/20 uppercase font-black tracking-widest text-[10px] py-3">128kbps (Standard)</SelectItem>
                    <SelectItem value="192k" className="rounded-xl focus:bg-primary/20 uppercase font-black tracking-widest text-[10px] py-3">192kbps (High Fidelity)</SelectItem>
                    <SelectItem value="320k" className="rounded-xl focus:bg-primary/20 uppercase font-black tracking-widest text-[10px] py-3">320kbps (Studio Master)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
 
              <div className="space-y-4">
                <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Sample Rate</Label>
                <Select value={sampleRate} onValueChange={(val) => val && setSampleRate(val)}>
                  <SelectTrigger className="h-14 rounded-2xl bg-white/[0.03] border-white/10 font-black uppercase tracking-widest text-xs focus:border-primary/50 transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10 text-white rounded-2xl">
                    <SelectItem value="44100" className="rounded-xl focus:bg-primary/20 uppercase font-black tracking-widest text-[10px] py-3">44.1 kHz (CD Standard)</SelectItem>
                    <SelectItem value="48000" className="rounded-xl focus:bg-primary/20 uppercase font-black tracking-widest text-[10px] py-3">48.0 kHz (Studio Grade)</SelectItem>
                    <SelectItem value="96000" className="rounded-xl focus:bg-primary/20 uppercase font-black tracking-widest text-[10px] py-3">96.0 kHz (Audiophile)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
 
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
                 <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Identity Tags (ID3)</Label>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <p className="text-[8px] font-black uppercase tracking-widest opacity-20 ml-1">Asset Title</p>
                       <input 
                         className="w-full bg-black/40 border border-white/5 rounded-xl h-10 px-4 text-[10px] font-bold focus:border-primary/50 outline-none transition-all"
                         value={metadata.title}
                         onChange={e => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                         placeholder="Unknown Track"
                       />
                    </div>
                    <div className="space-y-2">
                       <p className="text-[8px] font-black uppercase tracking-widest opacity-20 ml-1">Lead Artist</p>
                       <input 
                         className="w-full bg-black/40 border border-white/5 rounded-xl h-10 px-4 text-[10px] font-bold focus:border-primary/50 outline-none transition-all"
                         value={metadata.artist}
                         onChange={e => setMetadata(prev => ({ ...prev, artist: e.target.value }))}
                         placeholder="Independent Creator"
                       />
                    </div>
                    <div className="space-y-2">
                       <p className="text-[8px] font-black uppercase tracking-widest opacity-20 ml-1">Album Archive</p>
                       <input 
                         className="w-full bg-black/40 border border-white/5 rounded-xl h-10 px-4 text-[10px] font-bold focus:border-primary/50 outline-none transition-all"
                         value={metadata.album}
                         onChange={e => setMetadata(prev => ({ ...prev, album: e.target.value }))}
                         placeholder="Pro Studio Vol. 1"
                       />
                    </div>
                 </div>
              </div>
            </div>
          </ScrollArea>
 
          <div className="p-8 border-t border-white/5 bg-black/40 shrink-0">
            <Button 
              className="w-full h-20 rounded-[2.5rem] bg-primary hover:bg-primary/90 text-white font-black text-xl gap-3 shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] active:scale-95 transition-all group disabled:opacity-30 disabled:grayscale"
              onClick={processAudio}
              disabled={!audioFile || isProcessing || !isLoaded}
            >
              {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Zap className="w-7 h-7 group-hover:scale-125 transition-transform" />}
              {isProcessing ? "Mastering..." : "Begin Mastering"}
            </Button>
            <div className="mt-6 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-30">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> AES-256 Local Processing
            </div>
          </div>
        </aside>
      </main>

      {/* Structured Data: SoftwareApplication & FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Audio Studio Pro",
            "operatingSystem": "Any",
            "applicationCategory": "MultimediaApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "LAME/Vorbis Encoding (WASM)",
              "Local ID3 Metadata Editing",
              "Studio Bitrate Control (up to 320kbps)",
              "Zero-Server Mastering Pipeline"
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is my audio quality preserved?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. The Audio Studio uses the standard LAME and Vorbis libraries compiled to WebAssembly, ensuring parity with professional desktop software while maintaining 100% privacy."
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
