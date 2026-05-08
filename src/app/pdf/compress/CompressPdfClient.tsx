"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Zap, Loader2, FileDown, Trash2, ShieldCheck, FileType } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { FileSizeWarning } from "@/components/shared/FileSizeWarning";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBytes } from "@/lib/utils/fileSize";
import { toast } from "sonner";

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

      // QPDF compression flags:
      // --linearize: Optimize for fast web view
      // --object-streams=generate: Combine objects into streams for better compression
      // --compress-streams=y: Ensure all streams are compressed
      // --stream-data=compress: Compress stream data
      const flags = [
        inputPath,
        outputPath,
        "--linearize",
        "--object-streams=generate",
        "--compress-streams=y",
        "--stream-data=compress"
      ];

      // Extreme mode: also remove unreferenced objects and metadata if possible
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

      // Check exit status if exposed
      const exitStatus: number = qpdf.EXITSTATUS ?? 0;
      if (exitStatus !== 0) throw new Error("QPDF compression failed (exit code " + exitStatus + ")");

      // Read result
      let compressedBytes: Uint8Array;
      try {
        compressedBytes = qpdf.FS.readFile(outputPath);
      } catch (e) {
        throw new Error("Compression failed: output file not generated.");
      }

      if (!compressedBytes || compressedBytes.length === 0) {
        throw new Error("Compression produced an empty file.");
      }

      // If the result is larger than input, just use original (rare but happens with small files)
      if (compressedBytes.length >= pdfBytes.length && level === "recommended") {
        toast.info("This file is already highly optimized.");
        setResult(new Blob([pdfBytes], { type: "application/pdf" }));
      } else {
        const safeBytes = new Uint8Array(compressedBytes);
        setResult(new Blob([safeBytes], { type: "application/pdf" }));
      }

      setStatus("done");
      toast.success("PDF compressed successfully!");

      // Cleanup
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mx-auto border border-orange-500/20">
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Compress PDF</h1>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Reduce PDF file size without sacrificing quality. Optimized for fast web delivery and sharing.
            </p>
            <PrivacyBadge />
          </div>

          {!file ? (
            <DropZone onFilesDrop={handleDrop} accept=".pdf" multiple={false} />
          ) : (
            <div className="space-y-4">
              <FileSizeWarning fileSize={file.size} module="pdf" />

              <Card className="p-4 bg-secondary/30 border border-border flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                  <FileType className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleReset}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>

              {status !== "done" && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                      Compression Strength
                    </label>
                    <Tabs value={level} onValueChange={(v: any) => setLevel(v)} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-secondary/50">
                        <TabsTrigger value="recommended" className="rounded-lg data-[state=active]:bg-background">
                          Recommended
                        </TabsTrigger>
                        <TabsTrigger value="extreme" className="rounded-lg data-[state=active]:bg-background">
                          Extreme
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <p className="text-[10px] text-muted-foreground ml-1 italic">
                      {level === "recommended" 
                        ? "Best balance of size and quality. Safe for all documents." 
                        : "Maximum reduction by rebuilding object streams and cleaning resources."}
                    </p>
                  </div>

                  <Button 
                    className="w-full h-12 rounded-xl font-bold gap-2 bg-orange-500 hover:bg-orange-600 text-white" 
                    onClick={handleCompress} 
                    disabled={status === "processing"}
                  >
                    {status === "processing" ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Optimizing PDF…</>
                    ) : (
                      <><Zap className="w-4 h-4" /> Compress Now</>
                    )}
                  </Button>
                </div>
              )}

              {status === "done" && result && (
                <ExportPanel
                  blob={result}
                  filename={file.name.replace(/\.pdf$/i, "_compressed.pdf")}
                  inputSize={file.size}
                  onReset={handleReset}
                />
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card className="p-4 bg-secondary/20 border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">100% Private</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    All processing happens in your browser. Your sensitive documents never leave your device.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-secondary/20 border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Smart Optimization</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Linearizes and generates object streams for the smallest possible file footprint.
                  </p>
                </div>
              </div>
            </Card>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
