"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Unlock, Loader2, Lock, Trash2, ShieldCheck, Eye, EyeOff } from "lucide-react";
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

// Declare qpdf-wasm module (no @types available)
declare module "qpdf-wasm";

export default function UnlockPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [result, setResult] = useState<Blob | null>(null);
  // Cache the initialized qpdf module so we don't re-init on every unlock
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
    const saved = {
      error: console.error,
      warn: console.warn,
      log: console.log,
    };
    console.error = () => {};
    console.warn = () => {};
    console.log = () => {};
    return saved;
  };

  const restoreConsole = (saved: { error: typeof console.error; warn: typeof console.warn; log: typeof console.log }) => {
    console.error = saved.error;
    console.warn = saved.warn;
    console.log = saved.log;
  };

  const getQpdf = async () => {
    if (qpdfRef.current) return qpdfRef.current;
    // @ts-ignore – no type declarations for qpdf-wasm
    const initQPDF = (await import("qpdf-wasm")).default;
    const qpdf = await initQPDF({
      // noExitRuntime is hardcoded true in this build — callMain never throws
      print: () => {},
      printErr: () => {},
      locateFile: (filename: string) => {
        // Point WASM loader to /public assets
        if (filename.endsWith(".wasm")) return "/qpdf.wasm";
        return filename;
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

      // Write input to WASM virtual filesystem
      qpdf.FS.writeFile(inputPath, pdfBytes);

      // Clean up any leftover output from a previous run
      try { qpdf.FS.unlink(outputPath); } catch {}

      // Run qpdf decryption.
      // IMPORTANT: In this build, noExitRuntime is hardcoded true,
      // so callMain() NEVER throws — it simply returns.
      // We detect failure by checking whether the output file was created.
      try {
        qpdf.callMain([
          "--password=" + password,
          "--decrypt",
          inputPath,
          outputPath,
        ]);
      } catch (exitErr: any) {
        // Some builds may still throw ExitStatus — handle both cases.
        // ExitStatus.name === "ExitStatus", ExitStatus.status is the exit code.
        const isExitStatus = exitErr?.name === "ExitStatus";
        const exitCode = isExitStatus ? (exitErr.status ?? 1) : 1;
        if (exitCode !== 0) {
          try { qpdf.FS.unlink(inputPath); } catch {}
          restoreConsole(saved);
          toast.error("Incorrect password or this PDF is not password-protected.");
          setStatus("idle");
          return;
        }
        // exitCode === 0 means success even though it threw (rare builds)
      }

      // Check exit status if the module exposes it
      const exitStatus: number = qpdf.EXITSTATUS ?? 0;
      if (exitStatus !== 0) {
        try { qpdf.FS.unlink(inputPath); } catch {}
        restoreConsole(saved);
        toast.error("Incorrect password or this PDF is not password-protected.");
        setStatus("idle");
        return;
      }

      // Primary success check: output file must exist and be non-empty
      let decryptedBytes: Uint8Array;
      try {
        decryptedBytes = qpdf.FS.readFile(outputPath);
      } catch {
        // FS.readFile throws if the file was never created → wrong password
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

      // ✅ Success
      // Copy into a plain ArrayBuffer — qpdf FS may return a SharedArrayBuffer-backed
      // Uint8Array (for its WASM thread model). Blob only accepts ArrayBuffer, not
      // SharedArrayBuffer, so we copy into a fresh Uint8Array<ArrayBuffer> first.
      const safeBytes = new Uint8Array(decryptedBytes);
      const blob = new Blob([safeBytes], { type: "application/pdf" });
      setResult(blob);
      setStatus("done");
      restoreConsole(saved);
      toast.success("PDF unlocked successfully!");

      // Cleanup WASM virtual FS
      try { qpdf.FS.unlink(inputPath); } catch {}
      try { qpdf.FS.unlink(outputPath); } catch {}

    } catch (err: unknown) {
      restoreConsole(saved);
      // Safely extract a message regardless of what was thrown
      let message = "An unexpected error occurred. Please try again.";
      if (err instanceof Error) {
        message = err.message || message;
      } else if (typeof err === "object" && err !== null) {
        const e = err as Record<string, unknown>;
        if (typeof e.message === "string" && e.message) {
          message = e.message;
        } else if (typeof e.status === "number") {
          message = `Process exited with code ${e.status}.`;
        }
      } else if (typeof err === "string") {
        message = err;
      }
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
              <Unlock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Unlock PDF</h1>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Remove password protection from PDF files. Runs entirely in your browser — nothing is uploaded.
              </p>
            </div>
            <PrivacyBadge />
          </div>

          {/* Drop zone or file card */}
          {!file ? (
            <DropZone onFilesDrop={handleDrop} accept=".pdf" multiple={false} />
          ) : (
            <div className="space-y-4">
              <FileSizeWarning fileSize={file.size} module="pdf" />

              {/* File info card */}
              <Card className="p-3 bg-secondary/30 border border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={handleReset}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>

              {/* Password input + unlock button */}
              {status !== "done" && (
                <Card className="p-4 space-y-4 border border-border bg-card">
                  <div className="space-y-2">
                    <Label htmlFor="pdf-password" className="text-sm font-medium">
                      PDF Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="pdf-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter the PDF password…"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !status.startsWith("proc")) handleUnlock(); }}
                        className="h-10 pr-10 rounded-lg"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Leave blank if the PDF has no open password (only restrictions).
                    </p>
                  </div>

                  <Button
                    className="w-full h-10 rounded-lg font-semibold gap-2"
                    onClick={handleUnlock}
                    disabled={status === "processing"}
                  >
                    {status === "processing" ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Unlocking…</>
                    ) : (
                      <><Unlock className="w-4 h-4" /> Unlock PDF</>
                    )}
                  </Button>
                </Card>
              )}

              {/* Result / download */}
              {status === "done" && result && (
                <ExportPanel
                  blob={result}
                  filename={file.name.replace(/\.pdf$/i, "_unlocked.pdf")}
                  inputSize={file.size}
                  onReset={handleReset}
                />
              )}
            </div>
          )}

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-secondary/30 border border-border flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Local Decryption</p>
                <p className="text-xs text-muted-foreground">
                  Your password never leaves your browser. Decryption runs via WebAssembly.
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-secondary/30 border border-border flex items-start gap-3">
              <Unlock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Remove Restrictions</p>
                <p className="text-xs text-muted-foreground">
                  Unlocks printing, copying, and editing once the master password is provided.
                </p>
              </div>
            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
