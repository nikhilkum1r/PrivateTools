"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Unlock, Loader2, Lock, Download, Trash2, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { FileSizeWarning } from "@/components/shared/FileSizeWarning";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { formatBytes } from "@/lib/utils/fileSize";
import { toast } from "sonner";

export default function UnlockPdfClient() {
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

  const handleUnlock = async () => {
    if (!file) return;
    setStatus("processing");
    
    // Unified console silence to prevent Next.js dev overlay from catching library stderr
    const backupError = console.error;
    // @ts-ignore
    console.error = function() {};

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      
      // Fetch WASM binary asynchronously to avoid synchronous XHR errors
      const wasmRes = await fetch("/qpdf.wasm");
      const wasmBinary = await wasmRes.arrayBuffer();

      // Load and initialize qpdf-wasm
      // @ts-ignore
      const initQPDF = (await import("qpdf-wasm")).default;
      const qpdf = await initQPDF({
        wasmBinary: wasmBinary,
        mainScriptUrlOrBlob: "/qpdf.js",
        noExitRuntime: true,
        print: () => {},
        printErr: () => {},
        onAbort: () => {},
        locateFile: (path: string) => {
          if (path.endsWith(".wasm")) return "/qpdf.wasm";
          if (path.endsWith(".js")) return "/qpdf.js";
          return path;
        }
      });
      
      // Setup virtual filesystem
      const inputPath = "input.pdf";
      const outputPath = "output.pdf";
      qpdf.FS.writeFile(inputPath, pdfBytes);
      
      // Run decryption
      const args = [inputPath, `--password=${password}`, "--decrypt", outputPath];
      
      try {
        qpdf.callMain(args);
      } catch (err: any) {
        // Handle specific failure state (e.g. wrong password)
        try { qpdf.FS.unlink(inputPath); } catch (e) {}
        
        // Restore console temporarily to show toast properly
        console.error = backupError;
        toast.error("Invalid password or corrupted PDF.");
        setStatus("idle");
        return;
      }

      // Read decrypted result
      const decryptedBytes = qpdf.FS.readFile(outputPath);
      const blob = new Blob([new Uint8Array(decryptedBytes)], { type: "application/pdf" });
      
      setResult(blob);
      setStatus("done");
      
      // Restore console for success toast
      console.error = backupError;
      toast.success("PDF unlocked successfully!");
      
      // Cleanup virtual FS
      try {
        qpdf.FS.unlink(inputPath);
        qpdf.FS.unlink(outputPath);
      } catch (e) {}
    } catch (e) {
      console.error = backupError;
      toast.error("Unlocking failed: " + (e as Error).message);
      setStatus("idle");
    } finally {
      console.error = backupError;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Unlock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight tracking-tight">Unlock PDF</h1>
              <p className="text-muted-foreground mt-2 leading-relaxed">Remove password protection and security restrictions from your PDF files locally.</p>
            </div>
            <PrivacyBadge />
          </div>

          {!file ? (
            <DropZone onFilesDrop={handleDrop} accept=".pdf" multiple={false} />
          ) : (
            <div className="space-y-6">
              <FileSizeWarning fileSize={file.size} module="pdf" />
              
              <Card className="p-4 bg-secondary/50 border border-primary/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => { setFile(null); setResult(null); setStatus("idle"); }}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>

              {status !== "done" && (
                <div className="space-y-4 p-6 rounded-2xl bg-card border border-primary/10 shadow-sm">
                  <div className="space-y-2">
                    <Label htmlFor="password">Enter PDF Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Type password to unlock..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-xl pl-4 pr-12"
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">The password is processed locally in your browser and is never sent to any server.</p>
                  </div>

                  <Button 
                    className="w-full h-12 rounded-xl font-bold gap-2" 
                    onClick={handleUnlock} 
                    disabled={status === "processing"}
                  >
                    {status === "processing" ? <><Loader2 className="w-4 h-4 animate-spin" /> Unlocking…</> : <><Unlock className="w-4 h-4" /> Unlock & Save PDF</>}
                  </Button>
                </div>
              )}

              {status === "done" && result && (
                <ExportPanel
                  blob={result}
                  filename={file.name.replace(/\.pdf$/i, "_unlocked.pdf")}
                  inputSize={file.size}
                  onReset={() => { setFile(null); setResult(null); setStatus("idle"); setPassword(""); }}
                />
              )}
            </div>
          )}

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-secondary/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Local Decryption</p>
                <p className="text-xs text-muted-foreground">Encryption is removed using your device hardware. Your password never leaves your screen.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 flex items-start gap-3">
              <Unlock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Remove Restrictions</p>
                <p className="text-xs text-muted-foreground">Enables printing, copying, and editing on locked documents once the master password is provided.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
