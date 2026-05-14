"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Pause, Play, DownloadCloud, Mic, ArrowRight,
  Settings2, Loader2, Zap, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

interface AudioStudioEditorProps {
  t: any;
  audioFile: File | null;
  outputUrl: string | null;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isProcessing: boolean;
  progress: number;
  waveform: number[];
  handleFileDrop: (files: File[]) => void;
  processAudio: () => void;
  outputFormat: string;
  setOutputFormat: (v: string) => void;
  bitrate: string;
  setBitrate: (v: string) => void;
  sampleRate: string;
  setSampleRate: (v: string) => void;
  metadata: { title: string; artist: string; album: string };
  setMetadata: React.Dispatch<React.SetStateAction<{ title: string; artist: string; album: string }>>;
  isLoaded: boolean;
  ExportManager: any;
}

export function AudioStudioEditor({
  t, audioFile, outputUrl, isPlaying, setIsPlaying, audioRef,
  isProcessing, progress, waveform, handleFileDrop, processAudio,
  outputFormat, setOutputFormat, bitrate, setBitrate, sampleRate,
  setSampleRate, metadata, setMetadata, isLoaded, ExportManager
}: AudioStudioEditorProps) {

  return (
    <div className="flex flex-col lg:flex-row flex-grow w-full h-full relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-purple-500/5 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute inset-0 opacity-100" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--foreground-rgb), 0.05) 1px, transparent 0)`, backgroundSize: '48px 48px' }} />
      </div>

      {/* Center Workspace */}
      <section className="flex-grow flex flex-col relative z-10 min-w-0">
        <div className="flex-grow flex items-center justify-center p-8 lg:p-6">
          <AnimatePresence mode="wait">
            {outputUrl ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl"
              >
                <Card className="p-5 bg-card border-emerald-500/30 rounded-3xl shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <audio ref={audioRef} src={outputUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                  <div className="text-center space-y-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-2xl">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight">{t("queue.master_ready")}</h2>
                      <div className="flex items-center justify-center gap-3">
                         <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1 rounded-full font-semibold uppercase tracking-wider text-[9px]">{t("queue.success")}</Badge>
                         <span className="text-muted-foreground/60 text-[10px] font-semibold uppercase tracking-wider">{t("queue.target")}: {outputFormat.toUpperCase()} @ {bitrate}</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                      <Button 
                        size="icon" 
                        className="w-11 h-11 rounded-full bg-white text-black hover:bg-white/90 shadow-2xl active:scale-95 transition-all mx-auto sm:mx-0"
                        onClick={() => {
                          if (isPlaying) audioRef.current?.pause();
                          else audioRef.current?.play();
                          setIsPlaying(!isPlaying);
                        }}
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-black" />}
                      </Button>
                      <Button 
                        className="h-11 px-5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-2xl shadow-primary/40 gap-3 group active:scale-95 transition-all"
                        onClick={() => ExportManager.downloadFromUrl(outputUrl, `private-master-${Date.now()}.${outputFormat}`)}
                      >
                        <DownloadCloud className="w-6 h-6 group-hover:translate-y-1 transition-transform" /> {t("queue.download")}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : audioFile ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full space-y-6 text-center"
              >
                <div className="relative py-20 flex flex-col items-center gap-5">
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
                        className="w-1.5 rounded-full bg-secondary"
                      />
                    ))}
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight">{audioFile.name}</h2>
                    <div className="flex items-center justify-center gap-3">
                      <Badge variant="outline" className="text-[10px] border-border bg-secondary/50 text-primary font-semibold uppercase px-4 py-1 rounded-full tracking-wider">{t("queue.active_asset")}</Badge>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                    </div>
                  </div>
                </div>
                
                {isProcessing && (
                  <div className="space-y-6 max-w-md mx-auto">
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-wider text-primary">
                      <span>{t("queue.processing_frame")}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden border border-border p-0.5">
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
              <div className="text-center space-y-5">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500 to-primary p-[1px] mx-auto animate-pulse shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]">
                  <div className="w-full h-full rounded-[calc(3rem-1px)] bg-card flex items-center justify-center">
                    <Mic className="w-12 h-12 text-muted-foreground/50" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-xl font-extrabold tracking-tight uppercase leading-none">{t.rich("hero.title", { span: (c: any) => <span className="text-primary">{c}</span> })}</h2>
                  <p className="text-muted-foreground font-medium max-w-sm mx-auto text-lg">{t("hero.subtitle")}</p>
                </div>
                <Button 
                  className="rounded-full px-6 h-12 bg-foreground text-background font-bold text-xl hover:bg-foreground/90 shadow-2xl active:scale-95 transition-all group"
                  onClick={() => document.getElementById('audio-input')?.click()}
                >
                  {t("hero.button")} <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" />
                </Button>
                <input id="audio-input" type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileDrop(Array.from(e.target.files || []))} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Right Sidebar - Inspector */}
      <aside className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-border glass-card shrink-0 flex flex-col h-[500px] lg:h-full relative z-20">
        <div className="px-4 py-3 border-b border-border flex flex-col shrink-0 bg-muted/20">
          <h3 className="text-[10px] font-bold tracking-[0.4em] text-primary flex items-center gap-3">
            <Settings2 className="w-4 h-4" /> {t("settings.title")}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{t("settings.execution")}</p>
            <Badge className="bg-secondary/50 border-border text-muted-foreground/60 text-[9px] font-bold px-3 py-1 rounded-full">{t("settings.version")}</Badge>
          </div>
        </div>

        <ScrollArea className="flex-grow min-h-0">
          <div className="p-8 space-y-5 pb-12">
            <div className="space-y-4">
              <Label className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{t("settings.format")}</Label>
              <Select value={outputFormat} onValueChange={(val) => val && setOutputFormat(val)}>
                <SelectTrigger className="h-10 rounded-2xl bg-secondary/30 border-border font-semibold uppercase tracking-wider text-xs focus:border-primary/50 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground rounded-2xl">
                  <SelectItem value="mp3" className="rounded-xl focus:bg-primary/20 font-semibold uppercase tracking-wider text-[10px] py-3">{t("settings.formats.mp3")}</SelectItem>
                  <SelectItem value="wav" className="rounded-xl focus:bg-primary/20 font-semibold uppercase tracking-wider text-[10px] py-3">{t("settings.formats.wav")}</SelectItem>
                  <SelectItem value="aac" className="rounded-xl focus:bg-primary/20 font-semibold uppercase tracking-wider text-[10px] py-3">{t("settings.formats.aac")}</SelectItem>
                  <SelectItem value="ogg" className="rounded-xl focus:bg-primary/20 font-semibold uppercase tracking-wider text-[10px] py-3">{t("settings.formats.ogg")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{t("settings.bitrate")}</Label>
              <Select value={bitrate} onValueChange={(val) => val && setBitrate(val)}>
                <SelectTrigger className="h-10 rounded-2xl bg-secondary/30 border-border font-semibold uppercase tracking-wider text-xs focus:border-primary/50 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground rounded-2xl">
                  <SelectItem value="128k" className="rounded-xl focus:bg-primary/20 font-semibold uppercase tracking-wider text-[10px] py-3">{t("settings.bitrates.128k")}</SelectItem>
                  <SelectItem value="192k" className="rounded-xl focus:bg-primary/20 font-semibold uppercase tracking-wider text-[10px] py-3">{t("settings.bitrates.192k")}</SelectItem>
                  <SelectItem value="320k" className="rounded-xl focus:bg-primary/20 font-semibold uppercase tracking-wider text-[10px] py-3">{t("settings.bitrates.320k")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{t("settings.sample_rate")}</Label>
              <Select value={sampleRate} onValueChange={(val) => val && setSampleRate(val)}>
                <SelectTrigger className="h-10 rounded-2xl bg-secondary/30 border-border font-semibold uppercase tracking-wider text-xs focus:border-primary/50 transition-all">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground rounded-2xl">
                  <SelectItem value="44100" className="rounded-xl focus:bg-primary/20 font-semibold uppercase tracking-wider text-[10px] py-3">{t("settings.sample_rates.44100")}</SelectItem>
                  <SelectItem value="48000" className="rounded-xl focus:bg-primary/20 font-semibold uppercase tracking-wider text-[10px] py-3">{t("settings.sample_rates.48000")}</SelectItem>
                  <SelectItem value="96000" className="rounded-xl focus:bg-primary/20 font-semibold uppercase tracking-wider text-[10px] py-3">{t("settings.sample_rates.96000")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-6">
               <Label className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{t("settings.metadata.label")}</Label>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <p className="text-[8px] font-semibold uppercase tracking-wider opacity-20 ml-1">{t("settings.metadata.title")}</p>
                     <input 
                       className="w-full bg-muted/40 border border-border rounded-xl h-10 px-4 text-[10px] font-bold focus:border-primary/50 outline-none transition-all"
                       value={metadata.title}
                       onChange={e => setMetadata(prev => ({ ...prev, title: e.target.value }))}
                       placeholder={t("settings.metadata.placeholders.title")}
                     />
                  </div>
                  <div className="space-y-2">
                     <p className="text-[8px] font-semibold uppercase tracking-wider opacity-20 ml-1">{t("settings.metadata.artist")}</p>
                     <input 
                       className="w-full bg-muted/40 border border-border rounded-xl h-10 px-4 text-[10px] font-bold focus:border-primary/50 outline-none transition-all"
                       value={metadata.artist}
                       onChange={e => setMetadata(prev => ({ ...prev, artist: e.target.value }))}
                       placeholder={t("settings.metadata.placeholders.artist")}
                     />
                  </div>
                  <div className="space-y-2">
                     <p className="text-[8px] font-semibold uppercase tracking-wider opacity-20 ml-1">{t("settings.metadata.album")}</p>
                     <input 
                       className="w-full bg-muted/40 border border-border rounded-xl h-10 px-4 text-[10px] font-bold focus:border-primary/50 outline-none transition-all"
                       value={metadata.album}
                       onChange={e => setMetadata(prev => ({ ...prev, album: e.target.value }))}
                       placeholder={t("settings.metadata.placeholders.album")}
                     />
                  </div>
               </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-8 border-t border-border bg-muted/40 shrink-0">
          <Button 
            className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl gap-3 shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] active:scale-95 transition-all group disabled:opacity-30 disabled:grayscale"
            onClick={processAudio}
            disabled={!audioFile || isProcessing || !isLoaded}
          >
            {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Zap className="w-7 h-7 group-hover:scale-125 transition-transform" />}
            {isProcessing ? t("settings.processing") : t("settings.button")}
          </Button>
          <div className="mt-6 flex items-center justify-center gap-3 text-[10px] font-bold tracking-wider text-muted-foreground opacity-30">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> {t("settings.security")}
          </div>
        </div>
      </aside>
    </div>
  );
}
