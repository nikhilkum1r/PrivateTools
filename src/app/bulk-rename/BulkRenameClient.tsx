"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Loader2,
  Zap,
  Edit3,
  Type,
  Hash,
  RefreshCw,
  FolderOpen,
  Smartphone,
  Play,
  Plus
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import JSZip from "jszip";

interface RenameItem {
  id: string;
  originalName: string;
  newName: string;
  file: File;
}

export default function BulkRenameClient() {
  const [items, setItems] = useState<RenameItem[]>([]);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesDrop = (files: File[]) => {
    const newItems = files.map(f => ({
      id: Math.random().toString(36).substring(7),
      originalName: f.name,
      newName: f.name,
      file: f
    }));
    setItems(prev => [...prev, ...newItems]);
  };

  const applyLogic = () => {
    setItems(prev => prev.map((item, index) => {
      const name = item.originalName;
      const extIndex = name.lastIndexOf('.');
      const namePart = extIndex !== -1 ? name.slice(0, extIndex) : name;
      const extPart = extIndex !== -1 ? name.slice(extIndex) : "";

      let currentName = namePart;

      if (find) {
        currentName = currentName.split(find).join(replace);
      }

      let finalName = `${prefix}${currentName}${suffix}`;
      
      // Handle {n} placeholder for sequencing
      finalName = finalName.replace(/{n}/g, (index + 1).toString());

      return { ...item, newName: `${finalName}${extPart}` };
    }));
  };

  const downloadAll = async () => {
    setIsProcessing(true);
    const zip = new JSZip();
    
    items.forEach(item => {
      zip.file(item.newName, item.file);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "renamed_files.zip";
    a.click();
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white overflow-hidden selection:bg-green-500/30">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative scrollbar-hide">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-green-500/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[160px] rounded-full animate-pulse" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        {items.length === 0 ? (
          <div className="flex-grow flex items-center justify-center p-8 relative z-10">
            <div className="max-w-2xl w-full space-y-12 text-center">
              <div className="space-y-6">
                <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-green-500 to-emerald-600 p-[1px] mx-auto animate-pulse">
                  <div className="w-full h-full rounded-[calc(2.5rem-1px)] bg-black flex items-center justify-center border border-white/5">
                    <Edit3 className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                    Bulk Master <br/> <span className="text-green-500">Renamer.</span>
                  </h1>
                  <p className="text-muted-foreground text-xl font-medium max-w-lg mx-auto leading-relaxed">
                    Instant batch transformation. Pattern-based sequencing for professional asset management.
                  </p>
                </div>
              </div>
              <DropZone 
                onFilesDrop={handleFilesDrop} 
                className="h-64 border-dashed border-white/10 bg-white/5 rounded-[3rem] hover:bg-white/[0.08] transition-all"
              />
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Pattern Logic */}
            <aside className="flex w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500 flex items-center gap-3">
                    <Type className="w-4 h-4" /> Identity Engine
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none">Multi-Platform Asset Matrix</p>
                    <div className="flex gap-1.5 opacity-30">
                      <Play className="w-2 h-2 text-green-500 fill-green-500" />
                      <div className="w-2 h-2 rounded-full border border-white/40" />
                      <Smartphone className="w-2 h-2 text-white" />
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] border-white/10 bg-white/5 text-white/40 px-4 py-1.5 rounded-full font-black italic">{items.length} FILES</Badge>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-8 space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity Mutation</label>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-white/20">Prefix</label>
                        <Input placeholder="Prefix" value={prefix} onChange={e => setPrefix(e.target.value)} className="h-12 bg-white/5 border-white/10 rounded-xl px-4 font-bold" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-white/20">Suffix</label>
                        <Input placeholder="Suffix" value={suffix} onChange={e => setSuffix(e.target.value)} className="h-12 bg-white/5 border-white/10 rounded-xl px-4 font-bold" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Search & Replace</label>
                    <div className="space-y-3">
                       <Input placeholder="Find text..." value={find} onChange={e => setFind(e.target.value)} className="h-12 bg-white/5 border-white/10 rounded-xl px-4 font-bold" />
                       <Input placeholder="Replace with..." value={replace} onChange={e => setReplace(e.target.value)} className="h-12 bg-white/5 border-white/10 rounded-xl px-4 font-bold" />
                    </div>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-green-500/5 border border-green-500/20 space-y-4">
                    <div className="flex items-center gap-3 text-green-500">
                      <Hash className="w-5 h-5" />
                      <h4 className="text-xs font-black uppercase tracking-widest">Sequencing</h4>
                    </div>
                    <p className="text-[10px] text-green-500/60 leading-relaxed font-medium">
                      Use <code className="text-white">{"{n}"}</code> placeholder to inject auto-incrementing numbers. Perfect for photo batches.
                    </p>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-8 border-t border-white/5 bg-black/40 shrink-0">
                <Button 
                  className="w-full h-16 rounded-[2rem] bg-white text-black hover:bg-white/90 font-black text-xl gap-3 shadow-2xl active:scale-95 transition-all italic"
                  onClick={applyLogic}
                >
                  <RefreshCw className="w-6 h-6" />
                  PREVIEW MUTATION
                </Button>
              </div>
            </aside>

            {/* Center - Renaming Studio */}
            <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[600px] lg:min-h-0">
              <header className="p-6 md:p-10 flex items-center justify-between bg-black/40 backdrop-blur-3xl border-b border-white/5 relative z-20">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 md:w-20 md:h-20 rounded-[2.5rem] bg-green-600/10 flex items-center justify-center border border-green-500/20 shadow-2xl">
                    <FolderOpen className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="font-black text-xl md:text-3xl tracking-tighter uppercase italic">
                      Asset Studio
                    </h2>
                    <div className="flex items-center gap-4">
                      <Badge className="text-[10px] bg-green-500/10 text-green-500 border-green-500/20 px-4 py-1 rounded-full font-black uppercase tracking-widest italic">
                         LOCAL WORKSPACE
                      </Badge>
                      <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">
                        {items.length} TARGETS LOADED
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" className="rounded-xl border-white/10 h-12 gap-2" onClick={() => document.getElementById('bulk-append')?.click()}>
                     <Plus className="w-4 h-4" />
                     <input id="bulk-append" type="file" multiple className="hidden" onChange={(e) => handleFilesDrop(Array.from(e.target.files || []))} />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all" onClick={() => setItems([])}>
                    <Trash2 className="w-6 h-6" />
                   </Button>
                </div>
              </header>

              <ScrollArea className="flex-grow relative z-10 min-h-0">
                <div className="p-8 space-y-3">
                   <AnimatePresence mode="popLayout">
                     {items.map((item, i) => (
                       <motion.div
                         key={item.id}
                         layout
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, scale: 0.95 }}
                       >
                         <Card className="p-6 bg-white/[0.02] border-white/5 hover:border-green-500/30 transition-all group flex items-center gap-6 rounded-[2rem]">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                               <FileText className="w-6 h-6 text-white/20" />
                            </div>
                            <div className="flex-grow min-w-0 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                               <div className="min-w-0">
                                 <p className="text-[10px] font-black uppercase text-white/20 mb-1 tracking-widest">Original</p>
                                 <p className="text-sm font-medium truncate opacity-40">{item.originalName}</p>
                               </div>
                               <div className="min-w-0 flex items-center gap-4">
                                 <div className="w-1 h-10 bg-green-500/20 rounded-full" />
                                 <div className="min-w-0">
                                   <p className="text-[10px] font-black uppercase text-green-500 mb-1 tracking-widest italic">Mutated</p>
                                   <p className="text-sm font-black truncate text-green-400">{item.newName}</p>
                                 </div>
                               </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-10 w-10 rounded-xl hover:bg-red-500/10 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                              onClick={() => setItems(items.filter(it => it.id !== item.id))}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                         </Card>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                </div>
              </ScrollArea>
            </section>

            {/* Right Sidebar - Export Telemetry */}
            <aside className="flex w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-white/5 bg-[#0a0a0a]/40 backdrop-blur-3xl shrink-0 flex-col relative z-10 shadow-2xl h-[600px] lg:h-full">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4" /> Studio Matrix
                  </h3>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest leading-none mt-1">WASM Thread Execution</p>
                </div>
                <Badge variant="outline" className="text-[10px] border-green-500/20 bg-green-500/10 text-green-500 uppercase font-black px-4 py-1.5 rounded-full italic">READY</Badge>
              </div>

              <ScrollArea className="flex-grow min-h-0">
                <div className="p-8 space-y-10">
                   <div className="space-y-6">
                      <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Batch Statistics</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assets</p>
                          <p className="text-2xl font-black">{items.length}</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payload</p>
                          <p className="text-sm font-black uppercase tracking-tighter">
                            ~{(items.reduce((acc, f) => acc + f.file.size, 0) / 1024 / 1024).toFixed(1)}MB
                          </p>
                        </div>
                      </div>
                   </div>

                   <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                     <div className="flex items-center gap-3 text-white/40">
                       <Zap className="w-5 h-5 text-green-500" />
                       <h4 className="text-xs font-black uppercase tracking-widest">Local Integrity</h4>
                     </div>
                     <p className="text-[10px] text-white/20 leading-relaxed font-medium">
                       Files are compressed into a standard ZIP archive within the browser. Original file data remains untouched and private.
                     </p>
                   </div>
                </div>
              </ScrollArea>

              <div className="p-8 border-t border-white/5 bg-black/40 shrink-0">
                <Button 
                  className="w-full h-16 rounded-[2rem] bg-green-600 hover:bg-green-700 text-white font-black text-xl gap-3 shadow-2xl shadow-green-500/20 group active:scale-95 transition-all italic"
                  onClick={downloadAll}
                  disabled={items.length === 0 || isProcessing}
                >
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                  Finalize & ZIP
                </Button>
              </div>
            </aside>
          </>
        )}
      </main>
    </div>
  );
}
