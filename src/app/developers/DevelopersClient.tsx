"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Terminal, Code2, Cpu, Globe, 
  Lock, Zap, Database, GitBranch,
  Search, Shield, Layers, FileCode,
  Command, Box, ArrowRight, CheckCircle2,
  ExternalLink, Workflow, Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/lib/utils";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const codeExamples = [
  {
    title: "Zero-Server PDF Merge",
    lang: "javascript",
    code: `// Processed entirely in browser via WASM
import { PDFDocument } from 'pdf-lib';

async function mergePDFs(files) {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const pdf = await PDFDocument.load(await file.arrayBuffer());
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  return await mergedPdf.save();
}`
  },
  {
    title: "Local Image Transform",
    lang: "javascript",
    code: `// Multi-threaded Sharp-like performance in browser
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

async function resize(imageFile, width, height) {
  const img = await createImageBitmap(imageFile);
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  return new Promise(r => canvas.toBlob(r, 'image/webp', 0.9));
}`
  },
  {
    title: "Client-Side AI Inference",
    lang: "javascript",
    code: `// via Transformers.js v3 (WebGPU)
import { pipeline } from '@xenova/transformers';

const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
const output = await extractor('This text is processed locally!', {
  pooling: 'mean',
  normalize: true,
});`
  }
];

const devTools = [
  { name: "JSON Formatter", desc: "Validate and beautify large JSON datasets.", icon: FileCode },
  { name: "JWT Debugger", desc: "Decode and inspect local JSON Web Tokens.", icon: Shield },
  { name: "Base64 Studio", desc: "Bidirectional encoding for binary data.", icon: Box },
  { name: "Regex Lab", desc: "Test complex expressions in isolation.", icon: Search },
  { name: "SQL Formatter", desc: "Clean up raw queries for production.", icon: Database },
  { name: "Hash Generator", desc: "MD5, SHA-256, and more—all local.", icon: Lock }
];

export default function DevelopersClient() {
  const [activeCode, setActiveCode] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-grow">
        {/* HERO SECTION - TERMINAL STYLE */}
        <section className="relative pt-32 pb-20 overflow-hidden bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-primary),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                   <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none text-foreground">
                      Build for <br /> <span className="text-primary">The Edge.</span>
                   </h1>
                   <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl italic">
                      SafeTools isn't just a suite of apps—it's an architecture. Learn how we leverage WebAssembly and client-side compute to build the future of private software.
                   </p>
                   <div className="flex flex-wrap gap-4 pt-4">
                      <Button className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase italic tracking-widest text-sm group">
                         View Source <GithubIcon className="ml-2 w-5 h-5" />
                      </Button>
                   </div>
                </motion.div>

                {/* TERMINAL UI */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                   <div className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
                      <div className="bg-muted/50 px-6 py-4 flex items-center justify-between border-b border-border/50">
                         <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                         </div>
                         <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">safetools-core — bash</div>
                      </div>
                      <div className="p-8 font-mono text-sm space-y-4">
                         <div className="flex gap-3">
                            <span className="text-emerald-500">$</span>
                            <span className="text-foreground">npm install @safetools/core</span>
                         </div>
                         <div className="text-muted-foreground">
                            added 42 packages, and audited 43 packages in 842ms
                         </div>
                         <div className="flex gap-3">
                            <span className="text-emerald-500">$</span>
                            <span className="text-foreground">safetools --verify --local-only</span>
                         </div>
                         <div className="space-y-1">
                            <div className="flex items-center gap-2 text-emerald-400">
                               <CheckCircle2 className="w-3 h-3" /> WASM Environment initialized (multithreaded)
                            </div>
                            <div className="flex items-center gap-2 text-emerald-400">
                               <CheckCircle2 className="w-3 h-3" /> COEP/COOP Policy: Enforced (Credentialless)
                            </div>
                            <div className="flex items-center gap-2 text-emerald-400">
                               <CheckCircle2 className="w-3 h-3" /> Secure RAM Sandboxing: Active
                            </div>
                         </div>
                         <div className="flex gap-3 pt-4">
                            <span className="text-emerald-500">$</span>
                            <span className="animate-pulse w-2 h-5 bg-primary" />
                         </div>
                      </div>
                   </div>
                   {/* Glow */}
                   <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full -z-10" />
                </motion.div>
             </div>
          </div>
        </section>

        {/* CODE PLAYGROUND SECTION */}
        <section className="py-32 bg-background">
           <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-4 space-y-8">
                    <div className="space-y-4">
                       <h2 className="text-4xl font-black tracking-tighter uppercase italic font-heading">The Local-First <br /> <span className="text-primary">Standard.</span></h2>
                       <p className="text-muted-foreground font-medium italic">SafeTools uses high-performance browser engines to replicate server-side logic at 0ms latency.</p>
                    </div>
                    
                    <div className="space-y-2">
                       {codeExamples.map((ex, i) => (
                         <button
                           key={i}
                           onClick={() => setActiveCode(i)}
                           className={cn(
                             "w-full text-left p-6 rounded-2xl border transition-all flex items-center justify-between group",
                             activeCode === i ? "bg-primary text-primary-foreground border-primary shadow-xl" : "bg-card border-border hover:border-primary/30"
                           )}
                         >
                            <div>
                               <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Example {i + 1}</div>
                               <div className="font-black uppercase italic font-heading">{ex.title}</div>
                            </div>
                            <Code2 className={cn("w-5 h-5 group-hover:scale-110 transition-transform", activeCode === i ? "opacity-100" : "opacity-40")} />
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="lg:col-span-8">
                    <div className="rounded-[40px] bg-card border border-border overflow-hidden shadow-2xl relative">
                       <div className="absolute top-0 right-0 p-6 flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-muted" />
                          <div className="w-2 h-2 rounded-full bg-muted" />
                          <div className="w-2 h-2 rounded-full bg-muted" />
                       </div>
                       <div className="p-10 font-mono text-sm overflow-x-auto custom-scrollbar">
                          <pre className="text-foreground leading-relaxed">
                             {codeExamples[activeCode].code}
                          </pre>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* DEVELOPER TOOLS GRID */}
        <section className="py-32 bg-secondary/10 relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />
           <div className="container mx-auto px-6 relative z-10">
              <div className="text-center space-y-6 mb-20">
                 <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary italic font-black uppercase tracking-widest text-[10px]">Utility Suite</Badge>
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading">Powerful Tools for <br /> <span className="text-primary">Productive Devs</span></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                 {devTools.map((tool, i) => (
                   <div key={i} className="p-10 rounded-[40px] bg-card border border-border/50 hover:bg-background hover:border-primary/30 transition-all shadow-sm hover:shadow-2xl group cursor-pointer">
                      <div className="w-16 h-16 rounded-[22px] bg-secondary flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                         <tool.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-black uppercase italic font-heading mb-3">{tool.name}</h3>
                      <p className="text-muted-foreground text-sm font-medium leading-relaxed">{tool.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* TECH RECAP / BADGES */}
        <section className="py-20 border-y border-border">
           <div className="container mx-auto px-6">
              <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-40">
                 {["React", "Next.js", "WebAssembly", "TypeScript", "Rust", "FFmpeg", "Transformers"].map((tech) => (
                   <span key={tech} className="text-2xl font-black uppercase italic font-heading tracking-tighter">{tech}</span>
                 ))}
              </div>
           </div>
        </section>

        {/* OPEN SOURCE CTA */}
        <section className="py-40">
           <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto rounded-[60px] bg-primary p-20 text-primary-foreground relative overflow-hidden text-center space-y-10">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                 <GitBranch className="w-20 h-20 mx-auto opacity-50" />
                 <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic font-heading leading-none">Collaborate on <br /> GitHub</h2>
                 <p className="text-xl font-medium opacity-80 max-w-2xl mx-auto italic">SafeTools is a community effort to reclaim the private web. Contribute new tools, report bugs, or suggest architectural improvements.</p>
                 <div className="pt-6">
                    <Button size="lg" className="h-20 px-12 rounded-3xl bg-white text-primary hover:bg-white/90 font-black uppercase italic tracking-widest text-sm group">
                       View Repository <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
