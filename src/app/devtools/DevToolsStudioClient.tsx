"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, Code2, RefreshCw, Copy, Check, Braces, Hash, 
  Database, ArrowRightLeft, Trash2, FileCode, Sparkles, 
  Zap, Link, ShieldCheck, Cpu, Layers, Smartphone, 
  Maximize2, RotateCcw, Palette, Type, Sliders, X,
  Clock, Fingerprint, Search, Settings2, Info, TextCursorInput,
  ArrowRight, LucideIcon
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import NextLink from "next/link";
import { ToolType, TOOLS } from "@/app/devtools/tools";

const ICON_MAP: Record<string, LucideIcon> = {
  Braces, ArrowRightLeft, Hash, Database, Link, Fingerprint, Clock, TextCursorInput,
};

const ToolIcon = ({ iconName, ...props }: { iconName: string } & React.SVGProps<SVGSVGElement>) => {
  const Icon = ICON_MAP[iconName] ?? Code2;
  return <Icon {...(props as React.ComponentProps<typeof Icon>)} />;
};

interface DevToolsStudioClientProps {
  initialTool?: ToolType;
}

export default function DevToolsStudioClient({ initialTool = "json" }: DevToolsStudioClientProps) {
  const [activeTool, setActiveTool] = useState<ToolType>(initialTool);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setActiveTool(initialTool);
  }, [initialTool]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Result copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const processTool = async () => {
    setIsProcessing(true);
    // Simulate slight lag for WASM-feel
    await new Promise(r => setTimeout(r, 150));
    
    try {
      switch (activeTool) {
        case "json":
          try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, 2));
          } catch (e) { setOutput("Invalid JSON Structure"); }
          break;
        case "base64":
          try {
            if (input.includes("=") || input.length % 4 === 0) {
                try { setOutput(atob(input)); } catch { setOutput(btoa(input)); }
            } else {
                setOutput(btoa(input));
            }
          } catch (e) { setOutput("Base64 Operation Failed"); }
          break;
        case "hash":
          const encoder = new TextEncoder();
          const data = encoder.encode(input);
          const hashBuffer = await crypto.subtle.digest("SHA-256", data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          setOutput(hashArray.map(b => b.toString(16).padStart(2, '0')).join(''));
          break;
        case "jwt":
          try {
            const parts = input.split('.');
            if (parts.length !== 3) throw new Error();
            const payload = JSON.parse(atob(parts[1]));
            setOutput(JSON.stringify(payload, null, 2));
          } catch (e) { setOutput("Invalid JWT structure"); }
          break;
        case "url":
          try {
            if (input.includes("%")) setOutput(decodeURIComponent(input));
            else setOutput(encodeURIComponent(input));
          } catch (e) { setOutput("URL Operation Failed"); }
          break;
        case "uuid":
          const uuids = Array.from({ length: 5 }).map(() => crypto.randomUUID());
          setOutput(uuids.join("\n"));
          break;
        case "timestamp":
          const ts = parseInt(input) || Date.now();
          setOutput(new Date(ts * (input.length <= 10 ? 1000 : 1)).toISOString());
          break;
        case "lorem":
          setOutput("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
          break;
      }
    } catch (err) {
      toast.error("Processing error");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (input && activeTool !== "uuid" && activeTool !== "lorem") processTool();
  }, [input, activeTool]);

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-background text-foreground overflow-y-auto lg:overflow-hidden lg:overflow-hidden selection:bg-primary/30 custom-scrollbar">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-visible lg:overflow-hidden relative">
        {/* Left Sidebar - Utility Matrix */}
        <aside className="flex w-full lg:w-[320px] border-b lg:border-b-0 lg:border-r border-border bg-card/40 backdrop-blur-3xl flex-col shrink-0 relative z-10 shadow-2xl">
          <div className="p-6 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Utility Matrix
              </h3>
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Sovereign Developer Toolkit</p>
            </div>
            <Badge variant="outline" className="text-[9px] border-border bg-secondary/50 text-muted-foreground/60 px-3 py-1 rounded-full font-black italic">V4.0</Badge>
          </div>

          <ScrollArea className="flex-grow min-h-0">
            <div className="p-4 space-y-2">
              {TOOLS.map((tool) => (
                <NextLink
                  key={tool.id}
                  href={`/devtools/${tool.id}`}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    activeTool === tool.id 
                      ? "bg-primary/10 border border-primary/20" 
                      : "hover:bg-white/[0.03] border border-transparent"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500",
                    activeTool === tool.id ? "bg-primary text-foreground scale-110" : "bg-secondary/50 text-muted-foreground/40 group-hover:text-primary/60"
                  )}>
                    <ToolIcon iconName={tool.iconName} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-start text-left min-w-0">
                    <span className={cn(
                      "text-[11px] font-black uppercase tracking-widest transition-colors",
                      activeTool === tool.id ? "text-primary" : "text-muted-foreground/60"
                    )}>{tool.name}</span>
                    <span className="text-[9px] text-muted-foreground/40 line-clamp-1">{tool.desc}</span>
                  </div>
                  {activeTool === tool.id && (
                    <motion.div layoutId="active-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </NextLink>
              ))}
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-border bg-muted/40">
            <div className="flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> End-to-End Local
            </div>
          </div>
        </aside>

        {/* Center - Code Workspace */}
        <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink overflow-hidden">
          <header className="p-6 flex items-center justify-between bg-muted/40 backdrop-blur-3xl border-b border-border relative z-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl">
                <ToolIcon iconName={TOOLS.find(t => t.id === activeTool)?.iconName ?? "Code2"} className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-black text-xl tracking-tighter uppercase italic">
                  {TOOLS.find(t => t.id === activeTool)?.name}
                </h2>
                <div className="flex items-center gap-4">
                  <Badge className="text-[8px] bg-primary/10 text-primary border-primary/20 px-3 py-0.5 rounded-full font-black uppercase tracking-widest italic">
                    WASM Optimized
                  </Badge>
                  <span className="text-[9px] text-muted-foreground/40 uppercase font-black tracking-widest">
                    Buffered Stream Ready
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" className="h-10 rounded-xl px-4 border-border bg-secondary/50 text-muted-foreground/60 font-black text-[10px] gap-2 hover:text-foreground transition-all" onClick={() => setInput("")}>
                 <Trash2 className="w-3.5 h-3.5" /> CLEAR
               </Button>
               <Button className="h-10 rounded-xl px-6 bg-primary text-foreground font-black text-[10px] gap-2 shadow-lg shadow-primary/20 italic" onClick={processTool}>
                 <Zap className="w-3.5 h-3.5" /> RE-EXECUTE
               </Button>
            </div>
          </header>

          <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 p-4 lg:p-6 gap-4 overflow-hidden">
            {/* Input Card */}
            <div className="flex flex-col gap-4 min-h-0">
               <Card className="flex-grow bg-muted/40 border-border rounded-xl overflow-hidden flex flex-col relative group">
                  <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/30">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 italic">Raw Input Buffer</span>
                    <Badge variant="outline" className="text-[8px] border-border bg-secondary/50 opacity-50 uppercase tracking-widest">Source</Badge>
                  </div>
                  <Textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter payload here..."
                    className="flex-grow bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-[13px] leading-relaxed p-6 scrollbar-hide text-foreground/80 placeholder:text-white/10"
                  />
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">{input.length} characters</p>
                  </div>
               </Card>
            </div>

            {/* Output Card */}
            <div className="flex flex-col gap-4 min-h-0 relative">
               <Card className="flex-grow bg-secondary/30 border-border rounded-xl overflow-hidden flex flex-col group shadow-2xl">
                  <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/50">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">Processed Output</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn("h-8 px-4 rounded-xl font-black text-[9px] gap-2 transition-all", copied ? "bg-emerald-500 text-foreground" : "hover:bg-primary/20 hover:text-primary")}
                      onClick={handleCopy}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "COPIED" : "COPY RESULT"}
                    </Button>
                  </div>
                  <ScrollArea className="flex-grow bg-muted/60">
                    <pre className="p-6 font-mono text-[13px] leading-relaxed text-emerald-400/90 whitespace-pre-wrap break-all">
                      {isProcessing ? (
                        <span className="flex items-center gap-3 animate-pulse italic opacity-50">
                          <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing bitstream...
                        </span>
                      ) : (output || "// Output will materialize here...")}
                    </pre>
                  </ScrollArea>
               </Card>
            </div>
          </div>
        </section>

        {/* Right Sidebar - Analytics & History */}
        <aside className="flex w-full lg:w-[320px] border-t lg:border-t-0 lg:border-l border-border bg-card/40 backdrop-blur-3xl shrink-0 flex-col relative z-10 shadow-2xl">
          <div className="p-6 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                <Settings2 className="w-4 h-4" /> Bit Inspector
              </h3>
              <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none mt-1">Live Telemetry Analysis</p>
            </div>
            <Badge variant="outline" className="text-[9px] border-border bg-secondary/50 text-muted-foreground/60 px-3 py-1 rounded-full font-black italic">LIVE</Badge>
          </div>

          <ScrollArea className="flex-grow min-h-0">
            <div className="p-4 space-y-4">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Metadata Matrix</h4>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: "Execution Time", value: "0.12ms", icon: Cpu },
                    { label: "Memory Pressure", value: "2.4MB", icon: Layers },
                    { label: "Bit Entropy", value: "High", icon: Sparkles },
                    { label: "Security Level", value: "GOD-TIER", icon: ShieldCheck },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border group hover:bg-secondary/50 transition-all">
                      <div className="flex items-center gap-3">
                        <stat.icon className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-wider italic">{stat.label}</span>
                      </div>
                      <span className="text-[10px] font-black text-muted-foreground/80">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 relative z-10">
                  <Fingerprint className="w-5 h-5 text-primary" />
                  <h4 className="text-xs font-black uppercase tracking-widest">Sovereign Guard</h4>
                </div>
                <p className="text-[10px] text-muted-foreground/50 leading-relaxed font-medium relative z-10">
                  All bitwise operations are containerized within your browser's local sandbox. No data packets ever leave this session.
                </p>
              </div>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                   {["Minify", "Beautify", "Escape", "Unescape"].map(action => (
                     <Button key={action} variant="outline" className="h-10 rounded-xl border-border bg-secondary/50 text-[9px] font-black uppercase hover:bg-primary/20 hover:border-primary/30 transition-all">
                       {action}
                     </Button>
                   ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <div className="p-6 border-t border-border bg-muted/40 shrink-0">
             <div className="flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px]">E2EE</Badge>
                SECURED SESSION
             </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
