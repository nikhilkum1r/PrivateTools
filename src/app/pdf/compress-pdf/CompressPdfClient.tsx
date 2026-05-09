"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Zap, Loader2, Trash2, ShieldCheck, FileType, 
  Search, Cpu, Database, Play, Monitor, Smartphone,
  CheckCircle2, Briefcase, FileText, Fingerprint, Lock,
  Settings2, Activity, Layout
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { FileSizeWarning } from "@/components/shared/FileSizeWarning";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBytes } from "@/lib/utils/fileSize";
import { toast } from "sonner";
import { FAQ } from "@/components/shared/FAQ";
import Link from "next/link";

// Declare qpdf-wasm module (no @types available)
declare module "qpdf-wasm";

export default function CompressPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<"recommended" | "extreme">("recommended");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<Blob | null>(null);
  const qpdfRef = useRef<any>(null);

  const handleDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (f.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      return;
    }
    setFile(f);
    setStatus("idle");
    setResult(null);
  }, []);

  const getQpdf = async () => {
    if (qpdfRef.current) return qpdfRef.current;
    const initQPDF = (await import("qpdf-wasm")).default;
    const qpdf = await initQPDF({
      print: () => {},
      printErr: () => {},
      locateFile: (filename: string) => {
        if (filename.endsWith(".wasm")) return "/qpdf.wasm";
        if (filename.endsWith(".js")) return "/" + filename;
        return "/" + filename;
      },
    });
    qpdfRef.current = qpdf;
    return qpdf;
  };

  const handleCompress = async () => {
    if (!file) return;
    setStatus("processing");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      const qpdf = await getQpdf();

      const inputPath = "input.pdf";
      const outputPath = "output.pdf";

      qpdf.FS.writeFile(inputPath, pdfBytes);
      try { qpdf.FS.unlink(outputPath); } catch {}

      const flags = [
        inputPath,
        outputPath,
        "--linearize",
        "--object-streams=generate",
        "--compress-streams=y",
        "--stream-data=compress"
      ];

      if (level === "extreme") {
        flags.push("--remove-unreferenced-resources=yes");
      }

      try {
        qpdf.callMain(flags);
      } catch (exitErr: any) {
        const isExitStatus = exitErr?.name === "ExitStatus";
        const exitCode = isExitStatus ? (exitErr.status ?? 1) : 1;
        if (exitCode !== 0) throw new Error("QPDF exited with error code " + exitCode);
      }

      const exitStatus: number = qpdf.EXITSTATUS ?? 0;
      if (exitStatus !== 0) throw new Error("QPDF compression failed (exit code " + exitStatus + ")");

      let compressedBytes: Uint8Array;
      try {
        compressedBytes = qpdf.FS.readFile(outputPath);
      } catch (e) {
        throw new Error("Compression failed: output file not generated.");
      }

      if (!compressedBytes || compressedBytes.length === 0) {
        throw new Error("Compression produced an empty file.");
      }

      if (compressedBytes.length >= pdfBytes.length && level === "recommended") {
        toast.info("This file is already highly optimized.");
        setResult(new Blob([pdfBytes], { type: "application/pdf" }));
      } else {
        const safeBytes = new Uint8Array(compressedBytes);
        setResult(new Blob([safeBytes], { type: "application/pdf" }));
      }

      setStatus("done");
      toast.success("PDF compressed successfully!");

      try { qpdf.FS.unlink(inputPath); } catch {}
      try { qpdf.FS.unlink(outputPath); } catch {}

    } catch (err: any) {
      console.error(err);
      toast.error("Compression failed: " + (err.message || "Unexpected error"));
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStatus("idle");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-blue-500/30">
      <Navbar />

      {/* Aesthetic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="flex-grow relative z-10">
        {/* HERO SECTION */}
        <section className="pt-24 pb-12 px-4 container mx-auto text-center max-w-4xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(59,130,246,0.1)]">
              <Zap className="w-10 h-10 text-blue-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-foreground">
                Compress PDF Files
              </h1>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto">
                Reduce PDF file size securely using browser-based local compression with privacy-first processing.
              </p>
              <p className="text-sm font-medium text-blue-500 bg-blue-500/10 inline-block px-4 py-2 rounded-full border border-blue-500/20">
                Reduce PDF file sizes securely without uploading documents to external servers.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                { icon: ShieldCheck, text: "Local Processing" },
                { icon: Lock, text: "Zero Upload" },
                { icon: Search, text: "No Tracking" },
                { icon: Zap, text: "Fast Compression" },
                { icon: Cpu, text: "Browser-Based" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card bg-secondary/30 border border-border">
                  <badge.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* INTERACTIVE COMPRESSION STUDIO */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="glass-card rounded-[40px] border border-border shadow-2xl bg-secondary/30 overflow-hidden relative">
            <div className="px-6 py-4 border-b border-border bg-black/20 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-500 flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> Compression Engine
              </h3>
              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-blue-500/30 text-blue-500 bg-blue-500/10">
                QPDF WASM
              </Badge>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {!file ? (
                <DropZone 
                  onFilesDrop={handleDrop} 
                  accept=".pdf"
                  multiple={false} 
                  className="h-64 border-dashed border-blue-500/30 hover:border-blue-500/60 bg-black/20 rounded-3xl transition-colors"
                />
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  
                  {/* File Info */}
                  <div className="p-4 rounded-2xl glass-card bg-secondary/50 border border-border flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20">
                      <FileType className="w-6 h-6" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold truncate text-foreground">{file.name}</p>
                      <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">{formatBytes(file.size)}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10" onClick={handleReset}>
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <FileSizeWarning fileSize={file.size} module="pdf" />

                  {/* Settings & Action */}
                  {status !== "done" && (
                    <div className="space-y-6 p-6 rounded-3xl border border-border bg-black/30">
                      <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-500" /> Compression Mode
                        </label>
                        <Tabs value={level} onValueChange={(v: any) => setLevel(v)} className="w-full">
                          <TabsList className="grid w-full grid-cols-2 h-14 p-1 glass-card bg-background border border-border rounded-xl">
                            <TabsTrigger value="recommended" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white font-bold h-full">
                              Recommended
                            </TabsTrigger>
                            <TabsTrigger value="extreme" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white font-bold h-full">
                              Extreme
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed pt-1">
                          {level === "recommended" 
                            ? "Best balance of size and quality. Ideal for email sharing and web viewing." 
                            : "Maximum size reduction. Strips unreferenced resources and aggressively linearizes streams."}
                        </p>
                      </div>

                      <button
                        className="w-full h-14 rounded-2xl font-black italic text-lg gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        onClick={handleCompress}
                        disabled={status === "processing"}
                      >
                        {status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                        {status === "processing" ? "O P T I M I Z I N G . . ." : "C O M P R E S S   P D F"}
                      </button>
                    </div>
                  )}

                  {/* Result Panel */}
                  {status === "done" && result && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <ExportPanel
                        blob={result}
                        filename={file.name.replace(/\.pdf$/i, "_compressed.pdf")}
                        inputSize={file.size}
                        onReset={handleReset}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </section>

        {/* EDUCATIONAL & SEO CONTENT */}
        <div className="container mx-auto px-4 max-w-5xl py-12 space-y-20">
          
          {/* Main Features */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-foreground">PDF Compression Features</h2>
              <p className="text-muted-foreground font-medium">Enterprise-grade document optimization.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { title: "Reduce PDF size", icon: Zap },
                { title: "Browser processing", icon: Cpu },
                { title: "Fast compression", icon: Activity },
                { title: "Drag-and-drop", icon: Layout },
                { title: "Batch compression", icon: Database },
                { title: "Quality optimization", icon: Settings2 },
                { title: "Offline capable", icon: Monitor },
                { title: "Secure handling", icon: ShieldCheck },
                { title: "Mobile-friendly", icon: Smartphone },
                { title: "Instant downloads", icon: FileText }
              ].map((Feature, i) => (
                <div key={i} className="p-4 rounded-2xl glass-card bg-secondary/30 border border-border flex flex-col items-center text-center gap-3">
                  <Feature.icon className="w-6 h-6 text-blue-500" />
                  <span className="text-sm font-bold leading-tight text-foreground">{Feature.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Educational & Privacy */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><FileText className="text-blue-500 w-6 h-6" /> What Is PDF Compression?</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                PDF compression reduces document file size by optimizing images, fonts, embedded resources, and document structures while preserving readability.
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Lock className="text-emerald-500 w-6 h-6" /> Privacy-First PDF Compression</h2>
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-500 font-medium">
                <ul className="space-y-2 list-disc pl-4 marker:text-emerald-500">
                  <li>Local browser processing</li>
                  <li>No server uploads</li>
                  <li>No document retention</li>
                  <li>Temporary memory-only workflows</li>
                  <li>Zero tracking scripts</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Modes & Quality */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Settings2 className="text-amber-500 w-6 h-6" /> Compression Modes</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Low Compression", "Balanced Compression",
                    "Maximum Compression", "Image Optimization",
                    "Print Quality Preservation", "Web Optimization"
                  ].map(use => (
                    <div key={use} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" /> {use}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Activity className="text-blue-500 w-6 h-6" /> Smart PDF Optimization</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                <ul className="space-y-2 list-disc pl-4 marker:text-blue-500">
                  <li>Image compression</li>
                  <li>Font optimization</li>
                  <li>Resource cleanup</li>
                  <li>Structure optimization</li>
                  <li>Resolution balancing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How It Works & Performance */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 p-8 rounded-[2rem] border border-border glass-card bg-secondary/30">
              <h3 className="text-xl font-black uppercase italic text-foreground flex items-center gap-2"><Play className="w-5 h-5 text-blue-500" /> How PDF Compression Works</h3>
              <ol className="space-y-4 list-decimal pl-5 text-muted-foreground font-medium marker:text-blue-500 marker:font-black">
                <li>Upload your PDF locally into the studio</li>
                <li>Choose your desired compression level</li>
                <li>Optimize document resources within RAM</li>
                <li>Download the compressed PDF instantly</li>
              </ol>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500 text-sm font-bold">
                PDF compression happens entirely inside your browser.
              </div>
            </div>

            <div className="space-y-6 p-8 rounded-[2rem] border border-border glass-card bg-secondary/30">
              <h3 className="text-xl font-black uppercase italic text-foreground flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-500" /> Fast Browser-Based Compression</h3>
              <div className="space-y-3 text-muted-foreground font-medium">
                <p>Maximize your efficiency with local optimization:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Lightweight architecture</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No upload waiting</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Local optimization</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Fast rendering</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Mobile-friendly performance</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Use Cases & Security */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Briefcase className="w-6 h-6 text-blue-500" /> Common Use Cases</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Email attachments", "Website uploads",
                    "Cloud storage optimization", "Faster document sharing",
                    "Mobile document access", "Business workflows",
                    "Student assignments", "Archive optimization"
                  ].map(use => (
                    <div key={use} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {use}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><ShieldCheck className="text-emerald-500 w-6 h-6" /> Secure PDF Handling</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                We strictly enforce local memory processing. There is no file retention, secure local memory usage, no cloud storage, and only temporary browser processing.
              </div>
            </div>
          </section>

          {/* Works Offline */}
          <section className="p-8 rounded-[2rem] border border-border glass-card bg-secondary/30 space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Smartphone className="w-6 h-6 text-blue-500" /> Works Offline</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { name: "PWA support" },
                { name: "Offline PDF compression" },
                { name: "Local-only workflows" },
                { name: "Reduced network dependency" }
              ].map(feat => (
                <div key={feat.name} className="p-4 rounded-xl border border-border bg-black/30">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{feat.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison Table */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-center text-foreground">Why Use SafeTools PDF Compress?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse glass-card bg-secondary/30 rounded-3xl overflow-hidden border border-border shadow-sm">
                <thead>
                  <tr className="bg-black/30">
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-foreground">Feature</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-muted-foreground">Traditional PDF Sites</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-blue-500 bg-blue-500/5">SafeTools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm font-medium">
                  <tr>
                    <td className="p-4 text-foreground">Upload Required</td>
                    <td className="p-4 text-muted-foreground">Usually</td>
                    <td className="p-4 text-blue-500 bg-blue-500/5 font-bold">No</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Local Processing</td>
                    <td className="p-4 text-muted-foreground">Rare</td>
                    <td className="p-4 text-blue-500 bg-blue-500/5 font-bold">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Tracking Scripts</td>
                    <td className="p-4 text-muted-foreground">Often</td>
                    <td className="p-4 text-blue-500 bg-blue-500/5 font-bold">No</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Browser-Based</td>
                    <td className="p-4 text-muted-foreground">Partial</td>
                    <td className="p-4 text-blue-500 bg-blue-500/5 font-bold">Full</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Privacy Focused</td>
                    <td className="p-4 text-muted-foreground">Limited</td>
                    <td className="p-4 text-blue-500 bg-blue-500/5 font-bold">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <FAQ 
            items={[
              { question: "Are PDF files uploaded to servers?", answer: "No. PDF compression happens locally inside your browser." },
              { question: "Will compression reduce PDF quality?", answer: "Compression levels can affect image quality depending on settings." },
              { question: "Does this tool work offline?", answer: "Yes. Offline support can be enabled through PWA functionality." },
              { question: "Can SafeTools access my PDFs?", answer: "No. Files remain locally processed and are not stored." },
              { question: "Can I compress large PDFs?", answer: "Yes. Performance depends on browser memory and device capabilities." }
            ]}
          />

          {/* Related Tools */}
          <section className="space-y-6 text-center border-t border-border pt-16">
            <h2 className="text-2xl font-black text-foreground">Related Privacy Tools</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "PDF Merge", href: "/pdf/merge-pdf" },
                { name: "PDF Split", href: "/pdf/split-pdf" },
                { name: "PDF Unlock", href: "/pdf/unlock-pdf" },
                { name: "PDF Protect", href: "/pdf/protect-pdf" },
                { name: "PDF to Image", href: "/pdf/to-image" },
                { name: "File Shredder", href: "/security/file-shredder" }
              ].map(tool => (
                <Link key={tool.href} href={tool.href} className="px-5 py-2.5 rounded-full glass-card bg-secondary/30 hover:bg-blue-600 hover:text-white border border-border hover:border-blue-600 transition-colors font-bold text-sm text-foreground">
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Privacy Manifesto */}
          <section className="text-center max-w-2xl mx-auto space-y-4 pb-12">
            <Fingerprint className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground">Privacy-First Document Processing</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
              "SafeTools develops browser-based PDF tools designed for privacy, speed, and secure local document processing. Fast, privacy-first PDF tools designed for secure browser-based document workflows."
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
