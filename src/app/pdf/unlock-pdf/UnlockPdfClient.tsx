"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Unlock, Loader2, Lock, Trash2, ShieldCheck, Eye, EyeOff,
  Search, Cpu, CheckCircle2, ShieldAlert, FileText, Database,
  Zap, AlertTriangle, Layers, FileCode, CheckCircle, Scale
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { FileSizeWarning } from "@/components/shared/FileSizeWarning";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/utils/fileSize";
import { toast } from "sonner";
import { FAQ } from "@/components/shared/FAQ";
import Link from "next/link";
import { cn } from "@/lib/utils";

declare module "qpdf-wasm";

export default function UnlockPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    setPassword("");
  }, []);

  const silenceConsole = () => {
    const saved = { error: console.error, warn: console.warn, log: console.log };
    console.error = () => {}; console.warn = () => {}; console.log = () => {};
    return saved;
  };

  const restoreConsole = (saved: { error: typeof console.error; warn: typeof console.warn; log: typeof console.log }) => {
    console.error = saved.error; console.warn = saved.warn; console.log = saved.log;
  };

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

  const handleUnlock = async () => {
    if (!file) return;
    setStatus("processing");
    const saved = silenceConsole();

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      const qpdf = await getQpdf();
      const inputPath = "input.pdf";
      const outputPath = "output.pdf";

      qpdf.FS.writeFile(inputPath, pdfBytes);
      try { qpdf.FS.unlink(outputPath); } catch {}

      try {
        qpdf.callMain([
          "--password=" + password,
          "--decrypt",
          inputPath,
          outputPath,
        ]);
      } catch (exitErr: any) {
        const isExitStatus = exitErr?.name === "ExitStatus";
        const exitCode = isExitStatus ? (exitErr.status ?? 1) : 1;
        if (exitCode !== 0) {
          try { qpdf.FS.unlink(inputPath); } catch {}
          restoreConsole(saved);
          toast.error("Incorrect password or this PDF is not password-protected.");
          setStatus("idle");
          return;
        }
      }

      const exitStatus: number = qpdf.EXITSTATUS ?? 0;
      if (exitStatus !== 0) {
        try { qpdf.FS.unlink(inputPath); } catch {}
        restoreConsole(saved);
        toast.error("Incorrect password or this PDF is not password-protected.");
        setStatus("idle");
        return;
      }

      let decryptedBytes: Uint8Array;
      try {
        decryptedBytes = qpdf.FS.readFile(outputPath);
      } catch {
        try { qpdf.FS.unlink(inputPath); } catch {}
        restoreConsole(saved);
        toast.error("Incorrect password or this PDF is not password-protected.");
        setStatus("idle");
        return;
      }

      if (!decryptedBytes || decryptedBytes.length === 0) {
        try { qpdf.FS.unlink(inputPath); } catch {}
        try { qpdf.FS.unlink(outputPath); } catch {}
        restoreConsole(saved);
        toast.error("Decryption produced an empty file. The password may be incorrect.");
        setStatus("idle");
        return;
      }

      const trailerSlice = decryptedBytes.slice(Math.max(0, decryptedBytes.length - 8192));
      const trailerText = new TextDecoder("latin1").decode(trailerSlice);
      const isStillEncrypted = trailerText.includes("/Encrypt");

      if (isStillEncrypted) {
        try { qpdf.FS.unlink(inputPath); } catch {}
        try { qpdf.FS.unlink(outputPath); } catch {}
        restoreConsole(saved);
        toast.error("Incorrect password. The PDF could not be decrypted.");
        setStatus("idle");
        return;
      }

      const safeBytes = new Uint8Array(decryptedBytes);
      const blob = new Blob([safeBytes], { type: "application/pdf" });
      setResult(blob);
      setStatus("done");
      restoreConsole(saved);
      toast.success("PDF unlocked successfully!");

      try { qpdf.FS.unlink(inputPath); } catch {}
      try { qpdf.FS.unlink(outputPath); } catch {}

    } catch (err: unknown) {
      restoreConsole(saved);
      let message = "An unexpected error occurred. Please try again.";
      if (err instanceof Error) message = err.message || message;
      else if (typeof err === "object" && err !== null) {
        const e = err as Record<string, unknown>;
        if (typeof e.message === "string" && e.message) message = e.message;
        else if (typeof e.status === "number") message = `Process exited with code ${e.status}.`;
      } else if (typeof err === "string") message = err;
      
      toast.error(message);
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
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <main className="flex-grow relative z-10">
        {/* HERO SECTION */}
        <section className="pt-24 pb-12 px-4 container mx-auto text-center max-w-4xl space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(34,197,94,0.1)]">
              <Unlock className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
                Unlock PDF Files
              </h1>
              <p className="text-xl md:text-2xl font-bold text-muted-foreground max-w-3xl mx-auto">
                Remove PDF password protection securely using browser-based local processing with privacy-first security.
              </p>
              <p className="text-sm font-medium text-blue-400 bg-blue-500/10 inline-block px-4 py-2 rounded-full border border-blue-500/20">
                Unlock PDF documents securely without uploading files to external servers.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {[
                { icon: Lock, text: "Local Processing" },
                { icon: ShieldCheck, text: "Zero Upload" },
                { icon: Search, text: "No Tracking" },
                { icon: Zap, text: "Instant Unlocking" },
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

        {/* INTERACTIVE UNLOCK STUDIO */}
        <section className="container mx-auto px-4 pb-16 max-w-3xl">
          <div className="glass-card rounded-[40px] border border-border shadow-2xl bg-card overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                <Unlock className="w-4 h-4" /> Decryption Engine
              </h3>
              <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                WASM ACTIVE
              </Badge>
            </div>

            {/* Strict Legal Notice Banner */}
            <div className="bg-orange-500/10 border-b border-orange-500/20 p-4 flex gap-3">
              <Scale className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-sm text-orange-500 leading-relaxed font-medium">
                <strong>Important Legal Notice:</strong> Only unlock PDF documents you own or are legally authorized to access. Unauthorized access to protected files may violate laws or agreements.
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {!file ? (
                <DropZone 
                  onFilesDrop={handleDrop} 
                  accept=".pdf"
                  multiple={false} 
                  className="h-64 border-dashed border-emerald-500/30 hover:border-emerald-500/60 bg-background rounded-3xl transition-colors"
                />
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  <FileSizeWarning fileSize={file.size} module="pdf" />

                  {/* Selected File Card */}
                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold truncate text-lg">{file.name}</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{formatBytes(file.size)}</p>
                    </div>
                    <Button variant="outline" size="icon" className="hover:bg-red-500/10 text-muted-foreground hover:text-red-500 border-border" onClick={handleReset}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Password Input & Actions */}
                  {status !== "done" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="pdf-password" className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest">
                          PDF Encryption Key (Password)
                        </Label>
                        <div className="relative">
                          <Input
                            id="pdf-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter the PDF password…"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter" && status !== "processing") handleUnlock(); }}
                            className="h-14 pr-12 rounded-2xl bg-background border-border font-bold text-lg"
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                          Leave blank if the PDF has no open password (permission restrictions only).
                        </p>
                      </div>

                      <button
                        className="w-full h-14 rounded-2xl font-black italic text-lg gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                        onClick={handleUnlock}
                        disabled={status === "processing"}
                      >
                        {status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Unlock className="w-5 h-5" />}
                        {status === "processing" ? "D E C R Y P T I N G . . ." : "U N L O C K   P D F"}
                      </button>
                    </div>
                  )}

                  {/* Result Panel */}
                  {status === "done" && result && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <ExportPanel
                        blob={result}
                        filename={file.name.replace(/\.pdf$/i, "_unlocked.pdf")}
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
              <h2 className="text-3xl font-black tracking-tight">PDF Unlock Features</h2>
              <p className="text-muted-foreground font-medium">Enterprise-grade local decryption tools.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Remove open passwords", icon: Unlock },
                { title: "Unlock restricted PDFs", icon: ShieldCheck },
                { title: "Browser-side processing", icon: Cpu },
                { title: "Fast local decryption", icon: Zap },
                { title: "Drag-and-drop support", icon: FileText },
                { title: "Offline capable", icon: Zap },
                { title: "Zero cloud uploads", icon: Lock },
                { title: "Secure file handling", icon: ShieldAlert }
              ].map((Feature, i) => (
                <div key={i} className="p-4 rounded-2xl bg-secondary/50 border border-border flex flex-col items-center text-center gap-3">
                  <Feature.icon className="w-6 h-6 text-emerald-500" />
                  <span className="text-sm font-bold leading-tight">{Feature.title}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Educational Content */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2"><FileText className="text-emerald-500 w-6 h-6" /> What Is PDF Unlocking?</h2>
              <div className="p-6 rounded-3xl bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
                PDF unlocking removes password restrictions or access protections from PDF documents when <strong className="text-foreground">authorized credentials</strong> are available. This grants permitted access to owned files that were previously restricted. Once unlocked, you can permanently secure the raw file in our <Link href="/security/vault" className="text-emerald-500 hover:underline">Encryption Vault</Link>.
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-black flex items-center gap-2"><Lock className="text-blue-500 w-6 h-6" /> Privacy-First Processing</h2>
              <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 leading-relaxed text-blue-600 dark:text-blue-400 font-medium">
                <ul className="space-y-2 list-disc pl-4 marker:text-blue-500">
                  <li>Local browser processing</li>
                  <li>No file uploads</li>
                  <li>No server-side storage</li>
                  <li>Secure in-browser handling</li>
                  <li>Temporary memory-only operations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Supported Types & Use Cases */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 p-8 rounded-[2rem] border border-border bg-card">
              <h3 className="text-xl font-black uppercase italic">Supported Restrictions</h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground font-bold mb-4">We safely remove these restrictions when the master password is provided:</p>
                {[
                  "Open password removal",
                  "Permission restrictions",
                  "Printing restrictions",
                  "Copy restrictions",
                  "Editing restrictions"
                ].map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-bold">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> {t}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 p-8 rounded-[2rem] border border-border bg-card">
              <h3 className="text-xl font-black uppercase italic">Common Use Cases</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Remove forgotten restrictions",
                  "Enable printing",
                  "Enable text copying",
                  "Archive access",
                  "Document editing",
                  "Internal workflows",
                  "Educational documents",
                  "Personal file management"
                ].map(use => (
                  <div key={use} className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> {use}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Encryption Info */}
          <section className="space-y-4">
            <h2 className="text-2xl font-black flex items-center gap-2"><Database className="w-6 h-6 text-emerald-500" /> Modern PDF Encryption Support</h2>
            <div className="p-6 rounded-3xl bg-secondary/30 border border-border leading-relaxed text-muted-foreground font-medium">
              We natively support unlocking AES-encrypted PDFs, password-protected documents, and permission-based restrictions using highly optimized secure browser decryption workflows. All decryption is performed completely client-side.
            </div>
          </section>

          {/* Comparison Table */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-center">Why Use SafeTools PDF Unlock?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse bg-card rounded-3xl overflow-hidden border border-border shadow-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border">Feature</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-muted-foreground">Typical Online Tools</th>
                    <th className="p-4 font-black uppercase tracking-widest text-xs border-b border-border text-emerald-500 bg-emerald-500/5">SafeTools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-sm font-medium">
                  <tr>
                    <td className="p-4">Local Processing</td>
                    <td className="p-4 text-muted-foreground">Rare</td>
                    <td className="p-4 text-emerald-400 bg-emerald-500/5 font-bold">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4">File Upload Required</td>
                    <td className="p-4 text-muted-foreground">Usually</td>
                    <td className="p-4 text-emerald-400 bg-emerald-500/5 font-bold">No</td>
                  </tr>
                  <tr>
                    <td className="p-4">Privacy Focused</td>
                    <td className="p-4 text-muted-foreground">Limited</td>
                    <td className="p-4 text-emerald-400 bg-emerald-500/5 font-bold">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4">Tracking Scripts</td>
                    <td className="p-4 text-muted-foreground">Often</td>
                    <td className="p-4 text-emerald-400 bg-emerald-500/5 font-bold">No</td>
                  </tr>
                  <tr>
                    <td className="p-4">Browser-Based</td>
                    <td className="p-4 text-muted-foreground">Partial</td>
                    <td className="p-4 text-emerald-400 bg-emerald-500/5 font-bold">Full</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ */}
          <FAQ 
            items={[
              { question: "Are PDF files uploaded to servers?", answer: "No. All PDF processing happens locally inside your browser." },
              { question: "Can all PDFs be unlocked?", answer: "Some PDFs require the correct password before restrictions can be removed." },
              { question: "Does this tool work offline?", answer: "Yes. Offline support can be enabled through PWA functionality." },
              { question: "Can SafeTools access my PDFs?", answer: "No. Files remain locally processed and are not stored." },
              { question: "Is unlocking PDFs legal?", answer: "Only unlock files you own or are authorized to access." }
            ]}
          />

          {/* Related Tools */}
          <section className="space-y-6 text-center border-t border-border pt-16">
            <h2 className="text-2xl font-black">Related Privacy Tools</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { name: "PDF Merge", href: "/pdf/merge-pdf" },
                { name: "PDF Split", href: "/pdf/split-pdf" },
                { name: "PDF Compress", href: "/pdf/compress-pdf" },
                { name: "PDF Encrypt", href: "/pdf/encrypt" },
                { name: "PDF to Image", href: "/pdf/to-image" },
                { name: "File Shredder", href: "/security/file-shredder" }
              ].map(tool => (
                <Link key={tool.href} href={tool.href} className="px-5 py-2.5 rounded-full bg-secondary hover:bg-emerald-600 hover:text-white border border-border hover:border-emerald-600 transition-colors font-bold text-sm">
                  {tool.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Privacy Manifesto */}
          <section className="text-center max-w-2xl mx-auto space-y-4 pb-12">
            <ShieldCheck className="w-8 h-8 mx-auto text-muted-foreground opacity-50" />
            <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground">Privacy-First Document Tools</h3>
            <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed italic">
              "SafeTools develops browser-based document tools designed to protect user privacy through local processing and minimal data exposure. Secure document tools designed with privacy-first browser processing."
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
