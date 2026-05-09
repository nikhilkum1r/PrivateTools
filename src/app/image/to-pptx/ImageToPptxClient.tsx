"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Presentation, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Loader2,
  Zap,
  Plus,
  MoveUp,
  MoveDown,
  Layout,
  FileStack,
  Settings2,
  Monitor,
  Eye,
  RefreshCw,
  X,
  FileText,
  Save,
  DownloadCloud,
  ChevronUp,
  ChevronDown,
  Play,
  Smartphone,
  Layers,
  Cpu,
  SmartphoneIcon
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import pptxgen from "pptxgenjs";
import { toast } from "sonner";

interface PPTXFile {
  id: string;
  file: File;
  previewUrl: string;
}

export default function ImageToPptxClient() {
  const [files, setFiles] = useState<PPTXFile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [title, setTitle] = useState("Pro Presentation");

  const currentFile = files.find(f => f.id === selectedId) || files[0];

  useEffect(() => {
    if (files.length > 0 && !selectedId) {
      setSelectedId(files[0].id);
    }
  }, [files, selectedId]);

  const handleFilesDrop = (newFiles: File[]) => {
    const processed = newFiles.map(f => ({
      id: Math.random().toString(36).substring(7),
      file: f,
      previewUrl: URL.createObjectURL(f),
    }));
    setFiles(prev => [...prev, ...processed]);
    toast.success(`${newFiles.length} slides added`);
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file) URL.revokeObjectURL(file.previewUrl);
      const filtered = prev.filter(f => f.id !== id);
      if (selectedId === id) setSelectedId(filtered[0]?.id || null);
      return filtered;
    });
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newFiles.length) return;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const createPPTX = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const pres = new pptxgen();
      pres.title = title;
      for (const f of files) {
        const slide = pres.addSlide();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(f.file);
        });
        slide.addImage({
          data: base64,
          x: 0, y: 0, w: "100%", h: "100%",
          sizing: { type: "contain", w: 10, h: 5.625 }
        });
      }
      await pres.writeFile({ fileName: `${title.replace(/\s+/g, '_')}.pptx` });
      toast.success("Presentation exported successfully");
    } catch (e) {
      toast.error("Export failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden selection:bg-orange-500/30">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative scrollbar-hide">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-600/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-red-600/10 blur-[160px] rounded-full animate-pulse" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--color-primary-rgb),0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        {files.length === 0 ? (
          <div className="flex-grow flex items-center justify-center p-8 relative z-10">
            <div className="max-w-2xl w-full space-y-6 text-center">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-[1px] mx-auto animate-pulse">
                  <div className="w-full h-full rounded-[calc(2.5rem-1px)] bg-black flex items-center justify-center border border-border">
                    <Presentation className="w-10 h-10 text-orange-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-none">
                    Deck <span className="text-orange-500">Builder.</span>
                  </h1>
                  <p className="text-muted-foreground text-xl font-medium max-w-lg mx-auto leading-relaxed">
                    Industrial-grade presentation synthesis. Transform media assets into professional PPTX decks locally.
                  </p>
                </div>
              </div>
              <DropZone 
                onFilesDrop={handleFilesDrop} 
                accept="image/*" 
                multiple={true} 
                className="h-64 border-dashed border-border bg-secondary/50 rounded-2xl hover:bg-white/[0.08] transition-all"
              />
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Identity Engine */}
            <aside className="flex w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-border glass-card flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Identity Engine
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Multi-Platform Asset Matrix</p>
                    <div className="flex gap-1.5 opacity-30">
                      <Play className="w-2 h-2 text-orange-500 fill-orange-500" />
                      <div className="w-2 h-2 rounded-full border border-white/40" />
                      <Smartphone className="w-2 h-2 text-foreground" />
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-orange-500 hover:bg-orange-500/10 rounded-xl" onClick={() => document.getElementById('sidebar-add')?.click()}>
                  <Plus className="w-5 h-5" />
                  <input id="sidebar-add" type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFilesDrop(Array.from(e.target.files || []))} />
                </Button>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-4 space-y-2">
                  <AnimatePresence mode="popLayout">
                    {files.map((f, i) => (
                      <motion.div
                        key={f.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                      >
                        <Card 
                          className={cn(
                            "p-3 flex items-center gap-4 cursor-pointer transition-all border-border hover:border-orange-500/20 group relative overflow-hidden rounded-2xl",
                            selectedId === f.id ? "bg-orange-500/5 border-orange-500/30" : "bg-secondary/30"
                          )}
                          onClick={() => setSelectedId(f.id)}
                        >
                          <div className="w-6 text-[10px] font-black text-muted-foreground/40 group-hover:text-orange-500/40 transition-colors shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </div>
                          <div className="w-12 h-8 rounded-lg overflow-hidden bg-muted/40 shrink-0 relative flex items-center justify-center border border-border shadow-lg">
                            <img src={f.previewUrl} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div className="min-w-0 flex-grow">
                            <p className="text-[11px] font-black uppercase truncate tracking-tight">{f.file.name}</p>
                          </div>
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                            <button onClick={(e) => { e.stopPropagation(); moveFile(i, 'up'); }} disabled={i === 0} className="hover:text-orange-500 disabled:opacity-20"><ChevronUp className="w-3 h-3" /></button>
                            <button onClick={(e) => { e.stopPropagation(); moveFile(i, 'down'); }} disabled={i === files.length - 1} className="hover:text-orange-500 disabled:opacity-20"><ChevronDown className="w-3 h-3" /></button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 text-red-500 shrink-0"
                            onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>

              <div className="p-6 border-t border-border bg-muted/40 shrink-0">
                <Button 
                  className="w-full h-10 rounded-2xl bg-orange-600 hover:bg-orange-700 text-foreground font-black text-sm gap-2 shadow-2xl shadow-orange-500/20 active:scale-95 transition-all italic"
                  onClick={createPPTX}
                  disabled={isProcessing || files.length === 0}
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                  EXPORT STUDIO DECK
                </Button>
              </div>
            </aside>

            {/* Center - Slide Workspace */}
            <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[600px] lg:min-h-0">
              <header className="p-8 flex items-center justify-between bg-muted/40 backdrop-blur-3xl border-b border-border relative z-20">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-2xl">
                    <Presentation className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="font-black text-2xl tracking-tighter uppercase italic truncate max-w-[200px] md:max-w-md">
                      {title}
                    </h2>
                    <div className="flex items-center gap-4">
                      <Badge className="text-[10px] bg-orange-500/10 text-orange-500 border-orange-500/20 px-4 py-1 rounded-full font-black uppercase tracking-widest italic">
                        DECK STUDIO
                      </Badge>
                      <span className="text-[10px] text-muted-foreground/40 uppercase font-black tracking-widest">
                        SLIDE {files.indexOf(currentFile!) + 1} OF {files.length}
                      </span>
                    </div>
                  </div>
                </div>
              </header>

              <div className="flex-grow relative flex items-center justify-center p-8 lg:p-5 overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(40,minmax(0,1fr))] pointer-events-none opacity-[0.03]">
                  {Array.from({ length: 1600 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-white" />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {currentFile ? (
                     <motion.div 
                        key={currentFile.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full h-full max-w-5xl bg-secondary/30 rounded-2xl border border-border shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] flex items-center justify-center relative group overflow-hidden p-8"
                     >
                        <img 
                          src={currentFile.previewUrl} 
                          className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform group-hover:scale-[1.01] duration-700" 
                          alt="Slide Preview" 
                        />
                        <div className="absolute bottom-10 left-10">
                           <Badge className="bg-muted/60 backdrop-blur-xl text-muted-foreground/60 border-border px-6 py-2 rounded-full font-black uppercase tracking-[0.3em] text-[10px]">
                             WASM SYNTHESIS ACTIVE
                           </Badge>
                        </div>
                     </motion.div>
                  ) : (
                    <div className="text-center space-y-4 opacity-20">
                       <FileStack className="w-20 h-12 mx-auto" />
                       <p className="font-black uppercase tracking-widest text-sm italic">Initialize Deck Sequence</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Right Sidebar - Studio Matrix */}
            <aside className="flex w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-border glass-card shrink-0 flex-col relative z-10 shadow-2xl h-[600px] lg:h-full">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 flex items-center gap-3">
                    <Settings2 className="w-4 h-4" /> Studio Matrix
                  </h3>
                  <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none mt-1">WASM Thread Execution</p>
                </div>
                <Badge variant="outline" className="text-[10px] border-border bg-secondary/50 text-muted-foreground/60 px-4 py-1.5 rounded-full font-black italic">ACTIVE</Badge>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-4 space-y-4">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Deck Identity</h4>
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <Label className="text-[9px] text-muted-foreground/60 uppercase font-black tracking-widest">Presentation Title</Label>
                          <Input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-secondary/50 border-border rounded-2xl h-10 font-black uppercase tracking-tighter italic text-orange-500"
                            placeholder="PROJECT_ALPHA"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Slide Intelligence</h4>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                          { label: "Aspect Ratio", value: "16:9 HD", icon: Monitor },
                          { label: "Sizing Mode", value: "Contain", icon: Layout },
                          { label: "Resolution", value: "4K Native", icon: Zap }
                        ].map((stat, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border">
                             <div className="flex items-center gap-3">
                                <stat.icon className="w-4 h-4 text-muted-foreground/40" />
                                <span className="text-[10px] font-black uppercase text-muted-foreground/80 tracking-wider">{stat.label}</span>
                             </div>
                             <Badge variant="outline" className="text-[9px] border-border text-orange-500 font-black">{stat.value}</Badge>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-4">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-orange-500" />
                      <h4 className="text-xs font-black uppercase tracking-widest">WASM Guard</h4>
                    </div>
                    <p className="text-[10px] text-muted-foreground/50 leading-relaxed font-medium">
                      Slide synthesis logic is executed locally within a secure WebAssembly thread. Asset integrity is maintained without external telemetry.
                    </p>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="p-8 border-t border-border bg-muted/40 shrink-0">
                 <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                    <DownloadCloud className="w-4 h-4 text-orange-500" /> Synthesis Optimized
                 </div>
              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  );
}
