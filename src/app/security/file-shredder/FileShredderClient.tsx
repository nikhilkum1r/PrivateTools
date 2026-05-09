"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, ShieldAlert, Download, ShieldCheck, Database, 
  Cpu, FileCode, Search, CheckCircle2, Zap, AlertTriangle, 
  Lock, Key, FileText, Settings2, FileDigit, Skull, Layers
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DropZone } from "@/components/shared/DropZone";
import { DisclaimerModal, useDisclaimer } from "@/components/shared/DisclaimerModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { shredFile, shreddedFilename, type ShredPasses } from "@/lib/privacy/shredder";
import { ExportManager } from "@/lib/export-manager";
import { formatBytes } from "@/lib/utils/fileSize";
import { STRINGS } from "@/lib/utils/strings";
import { FAQ } from "@/components/shared/FAQ";
import Link from "next/link";
import { cn } from "@/lib/utils";

const PASS_OPTIONS: { value: ShredPasses; label: string; desc: string; risk: string }[] = [
  { value: 1, label: "1 Pass", desc: "Single random overwrite", risk: "Basic" },
  { value: 3, label: "3 Passes", desc: "Standard recommended wipe", risk: "Medium" },
  { value: 7, label: "7 Passes", desc: "Thorough 5220.22-M style", risk: "High" },
];

export default function FileShredderClient() {
  const { shown, accepted, showDisclaimer, accept } = useDisclaimer();
  const [file, setFile] = useState<File | null>(null);
  const [passes, setPasses] = useState<ShredPasses>(3);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleDrop = useCallback((files: File[]) => {
    if (!files[0]) return;
    setFile(files[0]);
    setStatus("idle");
    setResultBlob(null);
    setProgress(0);
    showDisclaimer();
  }, [showDisclaimer]);

  const handleShred = useCallback(async () => {
    if (!file || !accepted) return;
    setStatus("processing");
    setProgress(0);
    try {
      const blob = await shredFile(file, passes, setProgress);
      setResultBlob(blob);
      setStatus("done");
      import("sonner").then(m => m.toast.success("File shredded successfully."));
    } catch (e) {
      import("sonner").then(m => m.toast.error("Shredding failed: " + (e as Error).message));
      setStatus("idle");
    }
  }, [file, passes, accepted]);

  const handleDownload = () => {
    if (!resultBlob || !file) return;
    ExportManager.downloadFile(resultBlob, shreddedFilename(file.name));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-red-500/30">
      <Navbar />
      
      <DisclaimerModal
        open={shown}
        title={STRINGS.disclaimers.fileShredder.title}
        body={STRINGS.disclaimers.fileShredder.body}
        onAccept={accept}
      />

      {/* Cyber/Terminal Aesthetic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="flex-grow relative z-10">
        {/* HERO SECTION */}
        <section className="pt-24 pb-12 px-4 container mx-auto text-center max-w-4xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(239,68,68,0.1)]">
              <Skull className="w-10 h-10 text-red-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
                File Shredder
              </h1>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto">
                Securely remove sensitive files and reduce recovery risks using browser-based privacy-first file shredding tools.
              </p>
              <p className="text-sm font-medium text-red-400 bg-red-500/10 inline-block px-4 py-2 rounded-full border border-red-500/20">
                Protect sensitive information by securely removing files before sharing or disposal.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                { icon: Lock, text: "Local Processing" },
                { icon: ShieldCheck, text: "Zero Upload" },
                { icon: Search, text: "No Tracking" },
                { icon: Zap, text: "Instant File Wiping" },
                { icon: Cpu, text: "Browser-Based" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
                  <badge.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* INTERACTIVE SHREDDER STUDIO */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="glass-card rounded-[40px] border border-border shadow-2xl bg-card overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Shredder Terminal
              </h3>
              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-red-500/30 text-red-400 bg-red-500/10">
                CLIENT-SIDE ENGINE
              </Badge>
            </div>

            {/* Warning Banner */}
            <div className="bg-orange-500/10 border-b border-orange-500/20 p-4 flex gap-3">
              <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-sm text-orange-400 leading-relaxed font-medium">
                <strong>Browser Limitation:</strong> Browser-based tools cannot fully control operating system storage layers. Modern SSD wear leveling may affect overwrite guarantees. This tool assists in reducing recovery risks.
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {!file ? (
                <DropZone 
                  onFilesDrop={handleDrop} 
                  multiple={false} 
                  className="h-64 border-dashed border-red-500/30 hover:border-red-500/60 bg-background rounded-3xl transition-colors"
                />
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  {/* Selected File Card */}
                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 border border-red-500/20">
                      <FileDigit className="w-6 h-6" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold truncate text-lg">{file.name}</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{formatBytes(file.size)}</p>
                    </div>
                    <Button variant="outline" size="icon" className="hover:bg-red-500/10 text-muted-foreground hover:text-red-500 border-border" onClick={() => { setFile(null); setStatus("idle"); setResultBlob(null); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Overwrite Settings */}
                  {status !== "done" && (
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Settings2 className="w-4 h-4" /> Overwrite Protocol
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {PASS_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setPasses(opt.value)}
                            disabled={status === "processing"}
                            className={cn(
                              "p-4 rounded-2xl border text-left transition-all disabled:opacity-50",
                              passes === opt.value 
                                ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/5" 
                                : "border-border hover:border-red-500/30 bg-card hover:bg-red-500/5"
                            )}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <p className={cn("font-black uppercase tracking-tight", passes === opt.value ? "text-red-500" : "text-foreground")}>{opt.label}</p>
                              <Badge variant="outline" className="text-[8px] tracking-widest uppercase border-border">{opt.risk} Risk</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">{opt.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Processing State */}
                  <AnimatePresence>
                    {status === "processing" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3 p-4 rounded-2xl bg-secondary/50 border border-border">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                          <span className="text-red-500 flex items-center gap-2"><Zap className="w-3 h-3 animate-pulse" /> Shredding... Pass {Math.ceil((progress / 100) * passes)}/{passes}</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-background [&>div]:bg-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  <div className="pt-4 border-t border-border">
                    {status !== "done" ? (
                      <button
                        className="w-full h-14 rounded-2xl font-black italic text-lg gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-xl shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        onClick={handleShred}
                        disabled={!accepted || status === "processing"}
                      >
                        {status === "processing" ? <Cpu className="w-5 h-5 animate-pulse" /> : <Skull className="w-5 h-5" />}
                        {accepted ? (status === "processing" ? "O V E R W R I T I N G" : `E X E C U T E   S H R E D   (${passes} PASS)`) : "A C C E P T   N O T I C E"}
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                          <p className="font-black text-emerald-500 uppercase tracking-widest">File Successfully Shredded</p>
                          <p className="text-sm text-emerald-600/80 font-medium">Memory overwrite complete.</p>
                        </div>
                        {resultBlob && (
                          <button
                            className="w-full h-14 flex items-center justify-center rounded-2xl font-black italic text-lg gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 transition-colors"
                            onClick={handleDownload}
                          >
                            <Download className="w-5 h-5" />
                            D O W N L O A D   R E S I D U E
                          </button>
                        )}
                        <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-border" onClick={() => { setFile(null); setStatus("idle"); setResultBlob(null); }}>
                          Shred Another File
                        </Button>
                      </div>
                    )}
                  </div>
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
              <h2 className="text-3xl font-black tracking-tight">Secure File Removal Features</h2>
              <p className="text-muted-foreground font-medium">Professional browser-based wiping utilities.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Browser-side processing", icon: Cpu },
                { title: "Secure overwrite assistance", icon: ShieldCheck },
                { title: "Local file shredding", icon: Database },
                { title: "Drag-and-drop support", icon: FileDigit },
                { title: "Multiple passes", icon: Layers },
                { title: "Instant processing", icon: Zap },
                { title: "Offline capable", icon: Zap },
                { title: "No cloud uploads", icon: Lock }
              ].map((Feature, i) => (
                <div key={i} className="p-4 rounded-2xl bg-secondary/50 border border-border flex flex-col items-center text-center gap-3">
                  <Feature.icon className="w-6 h-6 text-red-500" />
                  <span className="text-sm font-bold leading-tight">{Feature.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Grid Content Sections */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2"><FileText className="text-red-500 w-6 h-6" /> What Is File Shredding?</h2>
              <div className="p-6 rounded-3xl bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                File shredding is the process of securely removing files in ways that help reduce the risk of recovery through standard recovery methods. By overwriting the original file data with random bytes, the physical memory traces are obscured.
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2"><AlertTriangle className="text-orange-500 w-6 h-6" /> Browser Limitations</h2>
              <div className="p-6 rounded-3xl bg-orange-500/10 border border-orange-500/20 leading-relaxed text-orange-400 font-medium">
                <ul className="space-y-2 list-disc pl-4 marker:text-orange-500">
                  <li>Browser-based tools cannot fully control operating system storage layers.</li>
                  <li>Modern SSD wear leveling may affect overwrite guarantees by writing to new blocks.</li>
                  <li>File shredding behavior depends heavily on device architecture.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-2"><ShieldAlert className="text-red-500 w-6 h-6" /> Why Simple Deletion Is Not Always Enough</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Recoverable Files", desc: "Deleted files may remain recoverable using forensic software." },
                { title: "Storage Remnants", desc: "Temporary storage remnants can linger in cache." },
                { title: "Metadata Traces", desc: "Metadata persistence may reveal sensitive file history." },
                { title: "Shared Devices", desc: "Shared-device risks expose data to other users." },
                { title: "Cloud Synchronization", desc: "Cloud synchronization exposure from undeleted cache." },
                { title: "Cache Persistence", desc: "Thumbnails and previews may survive file deletion." }
              ].map((risk, i) => (
                <div key={i} className="p-5 rounded-2xl border border-border bg-card">
                  <h4 className="font-bold text-foreground mb-1">{risk.title}</h4>
                  <p className="text-sm text-muted-foreground">{risk.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison Table */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-center">Why Use SafeTools File Shredder?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-card rounded-3xl overflow-hidden border border-border shadow-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border">Feature</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-muted-foreground">Standard Delete</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-red-500 bg-red-500/5">SafeTools Shredder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm font-medium">
                  <tr>
                    <td className="p-4">Browser-Based</td>
                    <td className="p-4 text-muted-foreground">No</td>
                    <td className="p-4 text-red-400 bg-red-500/5 font-bold">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4">Local Processing</td>
                    <td className="p-4 text-muted-foreground">Partial</td>
                    <td className="p-4 text-red-400 bg-red-500/5 font-bold">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4">Privacy Focused</td>
                    <td className="p-4 text-muted-foreground">No</td>
                    <td className="p-4 text-red-400 bg-red-500/5 font-bold">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4">Upload Required</td>
                    <td className="p-4 text-muted-foreground">Sometimes</td>
                    <td className="p-4 text-red-400 bg-red-500/5 font-bold">No</td>
                  </tr>
                  <tr>
                    <td className="p-4">Tracking Scripts</td>
                    <td className="p-4 text-muted-foreground">Sometimes</td>
                    <td className="p-4 text-red-400 bg-red-500/5 font-bold">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <FAQ 
            items={[
              { question: "Are my files uploaded?", answer: "No. All file processing happens locally inside your browser." },
              { question: "Can deleted files still be recovered?", answer: "Recovery risk may vary depending on operating system behavior, storage devices, and hardware architecture." },
              { question: "Does this work on SSDs?", answer: "Modern SSD storage mechanisms can affect overwrite behavior due to wear-leveling algorithms writing data to new blocks." },
              { question: "Does this tool work offline?", answer: "Yes. Offline support can be enabled through PWA functionality." },
              { question: "Can SafeTools access my files?", answer: "No. Files remain locally processed." }
            ]}
          />

          {/* Related Tools */}
          <section className="space-y-6 text-center border-t border-border pt-16">
            <h2 className="text-2xl font-black">Related Privacy Tools</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "Metadata Cleaner", href: "/security/metadata-cleaner" },
                { name: "Encryption Vault", href: "/security/vault" },
                { name: "Secure Notes", href: "/privacy/secure-notes" },
                { name: "Steganography", href: "/security/steganography" },
                { name: "Password Generator", href: "/privacy/password-generator" }
              ].map(tool => (
                <Link key={tool.href} href={tool.href} className="px-5 py-2.5 rounded-full bg-secondary hover:bg-red-500 hover:text-white border border-border hover:border-red-500 transition-colors font-bold text-sm">
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Privacy Manifesto */}
          <section className="text-center max-w-2xl mx-auto space-y-4 pb-12">
            <ShieldCheck className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground">Privacy-First Digital Protection</h3>
            <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed italic">
              "SafeTools builds browser-based privacy tools designed to minimize digital exposure and maximize user control. Reduce digital exposure with privacy-first browser security tools."
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
