"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, Unlock, Download, Trash2, ShieldCheck, Key } from "lucide-react";
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
import { PDFDocument } from "pdf-lib";

export default function LockPdfClient() {
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
      
      // Save the PDF first
      const pdfBytes = await pdfDoc.save();
      
      // Now encrypt it using the specialized lite library
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight tracking-tight">Lock PDF</h1>
              <p className="text-muted-foreground mt-2 leading-relaxed">Add military-grade password protection to your PDF files locally.</p>
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
                  <Unlock className="w-5 h-5" />
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
                    <Label htmlFor="password">Set PDF Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Choose a strong password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-xl pl-4 pr-12"
                      />
                      <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                    <p className="text-[11px] text-muted-foreground">This password will be required to open and view the PDF. Processing is 100% local.</p>
                  </div>

                  <Button 
                    className="w-full h-12 rounded-xl font-bold gap-2" 
                    onClick={handleLock} 
                    disabled={status === "processing"}
                  >
                    {status === "processing" ? <><Loader2 className="w-4 h-4 animate-spin" /> Locking…</> : <><Lock className="w-4 h-4" /> Encrypt & Lock PDF</>}
                  </Button>
                </div>
              )}

              {status === "done" && result && (
                <ExportPanel
                  blob={result}
                  filename={file.name.replace(/\.pdf$/i, "_protected.pdf")}
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
                <p className="font-bold text-sm">Strong Encryption</p>
                <p className="text-xs text-muted-foreground">Uses standard PDF security handlers to ensure wide compatibility with all PDF viewers.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/30 flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Local Security</p>
                <p className="text-xs text-muted-foreground">Encryption happens in your RAM. Your files and passwords never touch our servers.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
