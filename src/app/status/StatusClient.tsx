"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Lock, 
  Globe, 
  Activity,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HardDrive,
  Network,
  RefreshCcw,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function StatusClient() {
  const [checks, setChecks] = useState({
    wasm: { status: "checking", label: "WebAssembly Support" },
    workers: { status: "checking", label: "Web Workers" },
    sab: { status: "checking", label: "SharedArrayBuffer (COOP/COEP)" },
    opfs: { status: "checking", label: "Origin Private File System" },
    webgpu: { status: "checking", label: "WebGPU (Acceleration)" },
    crypto: { status: "checking", label: "Web Crypto API" }
  });

  useEffect(() => {
    const runChecks = async () => {
      const newChecks = { ...checks };

      // WASM
      newChecks.wasm.status = typeof WebAssembly === "object" ? "ok" : "fail";
      
      // Workers
      newChecks.workers.status = typeof Worker !== "undefined" ? "ok" : "fail";

      // SharedArrayBuffer
      newChecks.sab.status = typeof SharedArrayBuffer !== "undefined" ? "ok" : "fail";

      // OPFS
      try {
        const storage = await navigator.storage.getDirectory();
        newChecks.opfs.status = storage ? "ok" : "fail";
      } catch (e) {
        newChecks.opfs.status = "fail";
      }

      // WebGPU
      newChecks.webgpu.status = (navigator as any).gpu ? "ok" : "warn";

      // Crypto
      newChecks.crypto.status = window.crypto && window.crypto.subtle ? "ok" : "fail";

      setChecks(newChecks as any);
    };

    runChecks();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "fail": return <XCircle className="w-5 h-5 text-red-500" />;
      case "warn": return <AlertCircle className="w-5 h-5 text-amber-500" />;
      default: return <RefreshCcw className="w-5 h-5 text-muted-foreground animate-spin" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow">
        {/* HERO */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.1),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-emerald-500/30 text-emerald-500 uppercase font-black tracking-widest text-[10px]">Infrastructure Audit</Badge>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic font-heading leading-none">
                   System <br /> <span className="text-emerald-500 italic">Integrity.</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic">
                   Since SafeTools runs entirely on your hardware, this dashboard verifies your browser's capability to execute our high-performance engine.
                </p>
             </motion.div>
          </div>
        </section>

        {/* STATUS GRID */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-5xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {Object.entries(checks).map(([key, check], i) => (
                   <motion.div
                     key={key}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.1 }}
                     className="p-8 rounded-[40px] bg-secondary/5 border border-border/50 hover:bg-card hover:border-emerald-500/30 transition-all group"
                   >
                      <div className="flex justify-between items-start mb-10">
                         <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:text-emerald-500 transition-colors">
                            {key === 'wasm' ? <Cpu className="w-6 h-6" /> : key === 'workers' ? <Zap className="w-6 h-6" /> : key === 'sab' ? <Lock className="w-6 h-6" /> : <HardDrive className="w-6 h-6" />}
                         </div>
                         {getStatusIcon(check.status)}
                      </div>
                      <div className="space-y-2">
                         <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Capability Check</div>
                         <h3 className="text-xl font-black uppercase italic font-heading leading-tight">{check.label}</h3>
                         <div className={cn(
                           "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mt-2",
                           check.status === "ok" ? "bg-emerald-500/10 text-emerald-500" : check.status === "warn" ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                         )}>
                            {check.status === "ok" ? "Operational" : check.status === "warn" ? "Degraded" : "Unsupported"}
                         </div>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* GLOBAL UPTIME INDICATOR */}
        <section className="py-40 bg-secondary/10">
           <div className="container mx-auto px-6 max-w-4xl">
              <div className="p-12 md:p-20 rounded-[60px] bg-card border border-border shadow-2xl relative overflow-hidden space-y-12">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />
                 
                 <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="space-y-4 text-center md:text-left">
                       <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading">Sanctuary <br /> <span className="text-emerald-500">Status.</span></h2>
                       <p className="text-muted-foreground font-medium italic">Our global nodes are operational. No server-side maintenance required.</p>
                    </div>

                    <div className="flex items-center gap-6">
                       <div className="text-center">
                          <div className="text-4xl font-black text-emerald-500 tracking-tighter">100%</div>
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Uptime</div>
                       </div>
                       <div className="w-px h-12 bg-border" />
                       <div className="text-center">
                          <div className="text-4xl font-black text-emerald-500 tracking-tighter">0ms</div>
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-40">API Latency</div>
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-wrap items-center gap-4 pt-10">
                    <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Global CDN: Online</span>
                    </div>
                    <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">WASM Delivery: Online</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* SUPPORT CTA */}
        <section className="py-40 text-center space-y-10">
           <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading">Having Issues?</h2>
           <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto">If your system check failed, ensure you are using the latest version of Chrome, Edge, or Firefox.</p>
           <div className="pt-6">
              <Link href="/contact">
                 <Button className="h-20 px-12 rounded-[32px] bg-primary hover:bg-primary/90 font-black uppercase italic tracking-widest text-sm shadow-2xl shadow-primary/20 group">
                    Report Issue <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </Link>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
