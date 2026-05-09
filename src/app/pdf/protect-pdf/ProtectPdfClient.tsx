"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, Loader2, Unlock, Trash2, ShieldCheck, Key, FileText, Zap, 
  Search, Cpu, Database, Play, AlertTriangle, Monitor, Smartphone,
  CheckCircle2, Briefcase, FileKey, Fingerprint, DownloadCloud
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { FileSizeWarning } from "@/components/shared/FileSizeWarning";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils/fileSize";
import { toast } from "sonner";
import { FAQ } from "@/components/shared/FAQ";
import { PDFDocument } from "pdf-lib";
import Link from "next/link";

export default function ProtectPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<Blob | null>(null);

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
    setPassword("");
  }, []);

  const handleLock = async () => {
    if (!file) return;
    if (!password) {
      toast.error("Please enter a password to lock the PDF.");
      return;
    }
    
    setStatus("processing");
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const pdfBytes = await pdfDoc.save();
      
      const { encryptPDF } = await import("@pdfsmaller/pdf-encrypt-lite");
      const encryptedBytes = await encryptPDF(pdfBytes, password, password);

      const blob = new Blob([new Uint8Array(encryptedBytes)], { type: "application/pdf" });
      
      setResult(blob);
      setStatus("done");
      toast.success("PDF locked successfully!");
    } catch (e) {
      toast.error("Locking failed: " + (e as Error).message);
      setStatus("idle");
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStatus("idle");
    setPassword("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      <Navbar />

      {/* Cyber/Terminal Aesthetic Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="flex-grow relative z-10">
        {/* HERO SECTION */}
        <section className="pt-24 pb-12 px-4 container mx-auto text-center max-w-4xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              <ShieldCheck className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-foreground">
                Protect PDF Files
              </h1>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto">
                Add password protection and encryption to PDF documents securely using browser-based local processing.
              </p>
              <p className="text-sm font-medium text-emerald-500 bg-emerald-500/10 inline-block px-4 py-2 rounded-full border border-emerald-500/20">
                Secure PDF documents with privacy-first password protection and browser-based encryption.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                { icon: Lock, text: "Local Encryption" },
                { icon: ShieldCheck, text: "Zero Upload" },
                { icon: Search, text: "No Tracking" },
                { icon: Zap, text: "Instant Protection" },
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

        {/* INTERACTIVE ENCRYPTION STUDIO */}
        <section className="container mx-auto px-4 pb-16 max-w-4xl">
          <div className="glass-card rounded-[40px] border border-border shadow-2xl bg-secondary/30 overflow-hidden relative">
            <div className="px-6 py-4 border-b border-border bg-black/20 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                <FileKey className="w-4 h-4" /> Security Engine
              </h3>
              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-emerald-500/30 text-emerald-500 bg-emerald-500/10">
                WASM ACTIVE
              </Badge>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {!file ? (
                <DropZone 
                  onFilesDrop={handleDrop} 
                  accept=".pdf"
                  multiple={false} 
                  className="h-64 border-dashed border-emerald-500/30 hover:border-emerald-500/60 bg-black/20 rounded-3xl transition-colors"
                />
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  
                  {/* File Info */}
                  <div className="p-4 rounded-2xl glass-card bg-secondary/50 border border-border flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/20">
                      <FileText className="w-6 h-6" />
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

                  {/* Password & Action */}
                  {status !== "done" && (
                    <div className="space-y-6 p-6 rounded-3xl border border-border bg-black/30">
                      <div className="space-y-3">
                        <Label htmlFor="password" className="text-sm font-bold text-foreground">Set PDF Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type="password"
                            placeholder="Choose a strong password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-14 rounded-xl pl-4 pr-12 bg-background border-border text-foreground focus-visible:ring-emerald-500"
                          />
                          <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                          This password will be required to open and view the PDF. The encryption process runs 100% locally in your RAM.
                        </p>
                      </div>

                      <button
                        className="w-full h-14 rounded-2xl font-black italic text-lg gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        onClick={handleLock}
                        disabled={status === "processing" || !password}
                      >
                        {status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                        {status === "processing" ? "E N C R Y P T I N G . . ." : "E N C R Y P T   P D F"}
                      </button>
                    </div>
                  )}

                  {/* Result Panel */}
                  {status === "done" && result && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <ExportPanel
                        blob={result}
                        filename={file.name.replace(/\.pdf$/i, "_protected.pdf")}
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
              <h2 className="text-3xl font-black tracking-tight text-foreground">PDF Protection Features</h2>
              <p className="text-muted-foreground font-medium">Enterprise-grade document security tools.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { title: "Add PDF passwords", icon: Lock },
                { title: "Encrypt sensitive PDFs", icon: Key },
                { title: "Browser processing", icon: Cpu },
                { title: "Permission restriction", icon: ShieldCheck },
                { title: "Printing protection", icon: FileText },
                { title: "Editing protection", icon: Lock },
                { title: "Fast downloads", icon: DownloadCloud },
                { title: "Batch protection", icon: Database },
                { title: "Offline capable", icon: Zap },
                { title: "No cloud uploads", icon: Monitor }
              ].map((Feature, i) => (
                <div key={i} className="p-4 rounded-2xl glass-card bg-secondary/30 border border-border flex flex-col items-center text-center gap-3">
                  <Feature.icon className="w-6 h-6 text-emerald-500" />
                  <span className="text-sm font-bold leading-tight text-foreground">{Feature.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Educational & Privacy */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><FileText className="text-emerald-500 w-6 h-6" /> What Is PDF Protection?</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                PDF protection uses password encryption and permission controls to help secure sensitive documents from unauthorized access or modification. It prevents unwanted individuals from reading, copying, editing, or printing your files.
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Lock className="text-emerald-500 w-6 h-6" /> Privacy-First PDF Encryption</h2>
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 leading-relaxed text-emerald-500 font-medium">
                <ul className="space-y-2 list-disc pl-4 marker:text-emerald-500">
                  <li>Local browser encryption</li>
                  <li>No server-side uploads</li>
                  <li>Secure in-memory processing</li>
                  <li>No document retention</li>
                  <li>Zero tracking scripts</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Encryption Types & Options */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Cpu className="text-blue-500 w-6 h-6" /> Modern PDF Encryption</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                SafeTools utilizes industry-standard encryption protocols. We support AES encryption, password-based protection mapping to user and owner passwords, and stringent permission restriction integrations.
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><ShieldCheck className="text-emerald-500 w-6 h-6" /> Supported Security Options</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Open password protection", "Restrict printing",
                    "Restrict copying", "Restrict editing",
                    "Restrict annotations", "Secure sharing workflows"
                  ].map(use => (
                    <div key={use} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {use}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* How It Works & Best Practices */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 p-8 rounded-[2rem] border border-border glass-card bg-secondary/30">
              <h3 className="text-xl font-black uppercase italic text-foreground flex items-center gap-2"><Play className="w-5 h-5 text-emerald-500" /> How PDF Protection Works</h3>
              <ol className="space-y-4 list-decimal pl-5 text-muted-foreground font-medium marker:text-emerald-500 marker:font-black">
                <li>Upload your PDF locally into the studio</li>
                <li>Set a strong password and permissions</li>
                <li>Encrypt securely inside your browser's RAM</li>
                <li>Download the protected PDF document</li>
              </ol>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-sm font-bold">
                PDF encryption happens entirely inside your browser.
              </div>
            </div>

            <div className="space-y-6 p-8 rounded-[2rem] border border-border glass-card bg-secondary/30">
              <h3 className="text-xl font-black uppercase italic text-foreground flex items-center gap-2"><Key className="w-5 h-5 text-amber-500" /> PDF Security Best Practices</h3>
              <div className="space-y-3 text-muted-foreground font-medium">
                <p>Maximize your document security with these tips:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Use strong, high-entropy passwords</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Avoid password reuse across documents</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Share passwords via secure, separate channels</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-amber-500" /> Keep secure unencrypted backups locally</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Use Cases & Works Offline */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Briefcase className="w-6 h-6 text-blue-500" /> Common Use Cases</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Legal contracts", "Financial reports",
                    "Medical records", "Business proposals",
                    "Personal documents", "Academic files",
                    "Client data", "Internal company files"
                  ].map(use => (
                    <div key={use} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {use}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2 text-foreground"><Smartphone className="text-emerald-500 w-6 h-6" /> Works Offline</h2>
              <div className="p-6 rounded-3xl glass-card bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                SafeTools features comprehensive PWA support. Experience true offline encryption workflows with zero network dependency, guaranteeing absolute local data isolation.
              </div>
            </div>
          </section>

          {/* Comparison Table */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-center text-foreground">Why Use SafeTools PDF Protection?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse glass-card bg-secondary/30 rounded-3xl overflow-hidden border border-border shadow-sm">
                <thead>
                  <tr className="bg-black/30">
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-foreground">Feature</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-muted-foreground">Traditional PDF Sites</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-emerald-500 bg-emerald-500/5">SafeTools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm font-medium">
                  <tr>
                    <td className="p-4 text-foreground">Upload Required</td>
                    <td className="p-4 text-muted-foreground">Usually</td>
                    <td className="p-4 text-emerald-500 bg-emerald-500/5 font-bold">No</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Local Encryption</td>
                    <td className="p-4 text-muted-foreground">Rare</td>
                    <td className="p-4 text-emerald-500 bg-emerald-500/5 font-bold">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Tracking Scripts</td>
                    <td className="p-4 text-muted-foreground">Often</td>
                    <td className="p-4 text-emerald-500 bg-emerald-500/5 font-bold">No</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Browser-Based</td>
                    <td className="p-4 text-muted-foreground">Partial</td>
                    <td className="p-4 text-emerald-500 bg-emerald-500/5 font-bold">Full</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-foreground">Privacy Focused</td>
                    <td className="p-4 text-muted-foreground">Limited</td>
                    <td className="p-4 text-emerald-500 bg-emerald-500/5 font-bold">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <FAQ 
            items={[
              { question: "Are PDF files uploaded to servers?", answer: "No. PDF protection happens locally inside your browser." },
              { question: "What encryption is supported?", answer: "Modern PDF encryption standards such as AES-based protection can be supported." },
              { question: "Does this tool work offline?", answer: "Yes. Offline support can be enabled through PWA functionality." },
              { question: "Can SafeTools access my PDFs?", answer: "No. Files remain locally processed and are never stored." },
              { question: "Can I restrict printing and editing?", answer: "Yes. Permission restrictions can be added to supported PDFs." }
            ]}
          />

          {/* Related Tools */}
          <section className="space-y-6 text-center border-t border-border pt-16">
            <h2 className="text-2xl font-black text-foreground">Related Security Tools</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "PDF Unlock", href: "/pdf/unlock-pdf" },
                { name: "PDF Merge", href: "/pdf/merge-pdf" },
                { name: "PDF Split", href: "/pdf/split-pdf" },
                { name: "File Encryption", href: "/privacy/encrypt" },
                { name: "Secure Vault", href: "/security/vault" },
                { name: "File Shredder", href: "/security/file-shredder" }
              ].map(tool => (
                <Link key={tool.href} href={tool.href} className="px-5 py-2.5 rounded-full glass-card bg-secondary/30 hover:bg-emerald-600 hover:text-white border border-border hover:border-emerald-600 transition-colors font-bold text-sm text-foreground">
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Privacy Manifesto */}
          <section className="text-center max-w-2xl mx-auto space-y-4 pb-12">
            <Fingerprint className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground">Privacy-First Document Security</h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">
              "SafeTools develops browser-based security tools designed to maximize document privacy and user control. Secure sensitive documents with privacy-first browser-based PDF protection tools."
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
