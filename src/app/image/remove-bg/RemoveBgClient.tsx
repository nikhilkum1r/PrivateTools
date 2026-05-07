"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Loader2, Download, Trash2, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { FileSizeWarning } from "@/components/shared/FileSizeWarning";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function RemoveBgClient() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading-model" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [resultPreview, setResultPreview] = useState<string | null>(null);
  
  const workerRef = useRef<Worker | null>(null);

  // Initialize worker
  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL("./worker.ts", import.meta.url), {
        type: "module",
      });
    }

    const handleMessage = (event: MessageEvent) => {
      const { type, data, error, mask } = event.data;

      if (type === "progress") {
        if (data.status === "progress") {
          setProgress(data.progress / 100);
        }
      } else if (type === "ready") {
        // Model loaded, now start processing
        if (imagePreview) {
          workerRef.current?.postMessage({ type: "remove-bg", image: imagePreview });
        }
      } else if (type === "result") {
        applyMask(mask);
      } else if (type === "error") {
        console.error("Worker error:", error);
        toast.error("AI Processing failed: " + error);
        setStatus("error");
      }
    };

    workerRef.current.addEventListener("message", handleMessage);
    return () => {
      workerRef.current?.removeEventListener("message", handleMessage);
    };
  }, [imagePreview]);

  const applyMask = async (mask: { data: Uint8Array; width: number; height: number }) => {
    if (!file || !imagePreview) return;

    try {
      // 1. Load original image
      const img = new Image();
      img.src = imagePreview;
      await new Promise((resolve) => (img.onload = resolve));

      // 2. Create canvas for final composition
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context failed");

      // Draw original
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      // 3. Apply mask
      // The mask might be a different size than the original image
      // Create a temporary canvas to resize the mask data
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = mask.width;
      maskCanvas.height = mask.height;
      const maskCtx = maskCanvas.getContext("2d");
      if (!maskCtx) throw new Error("Mask context failed");

      const maskImageData = maskCtx.createImageData(mask.width, mask.height);
      for (let i = 0; i < mask.data.length; i++) {
        maskImageData.data[i * 4] = 0;
        maskImageData.data[i * 4 + 1] = 0;
        maskImageData.data[i * 4 + 2] = 0;
        maskImageData.data[i * 4 + 3] = mask.data[i];
      }
      maskCtx.putImageData(maskImageData, 0, 0);

      // Scale mask to original size
      const finalMaskCanvas = document.createElement("canvas");
      finalMaskCanvas.width = img.width;
      finalMaskCanvas.height = img.height;
      const finalMaskCtx = finalMaskCanvas.getContext("2d");
      finalMaskCtx?.drawImage(maskCanvas, 0, 0, mask.width, mask.height, 0, 0, img.width, img.height);

      const finalMaskData = finalMaskCtx?.getImageData(0, 0, img.width, img.height).data;
      if (!finalMaskData) throw new Error("Failed to get final mask data");

      // Apply to alpha channel
      for (let i = 0; i < finalMaskData.length / 4; i++) {
        data[i * 4 + 3] = finalMaskData[i * 4 + 3];
      }

      ctx.putImageData(imageData, 0, 0);

      // 4. Export
      canvas.toBlob((blob) => {
        if (blob) {
          setResult(blob);
          setResultPreview(URL.createObjectURL(blob));
          setStatus("done");
          toast.success("Magic complete! Background removed.");
        }
      }, "image/png");

    } catch (err: any) {
      console.error(err);
      toast.error("Failed to compose final image.");
      setStatus("error");
    }
  };

  const handleDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    setFile(f);
    setImagePreview(URL.createObjectURL(f));
    setStatus("idle");
    setResult(null);
    setResultPreview(null);
    setProgress(0);
  }, []);

  const handleRemoveBackground = () => {
    if (!file || !imagePreview) return;
    setStatus("loading-model");
    setProgress(0);
    workerRef.current?.postMessage({ type: "load" });
  };

  const handleReset = () => {
    setFile(null);
    setImagePreview(null);
    setResult(null);
    setResultPreview(null);
    setStatus("idle");
    setProgress(0);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center mx-auto border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
              <Sparkles className="w-8 h-8 text-indigo-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                Magic Background Remover
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base font-medium">
                Professional-grade AI background removal that runs entirely in your browser. 
                Zero uploads, 100% private, crystal clear edges.
              </p>
            </div>
            <div className="flex justify-center">
              <PrivacyBadge />
            </div>
          </div>

          {!file ? (
            <div className="max-w-2xl mx-auto w-full">
              <DropZone 
                onFilesDrop={handleDrop} 
                accept="image/*" 
                multiple={false} 
                className="aspect-video"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Source Preview */}
                <Card className="overflow-hidden border-2 border-border/50 bg-secondary/20 relative group">
                  <div className="aspect-square flex items-center justify-center p-4">
                    <img 
                      src={imagePreview!} 
                      alt="Original" 
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-background/80 backdrop-blur-md text-foreground border-border/50">
                      Original
                    </Badge>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                    onClick={handleReset}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </Card>

                {/* Result / Status Area */}
                <Card className={cn(
                  "overflow-hidden border-2 relative min-h-[400px] flex flex-col",
                  status === "done" ? "border-emerald-500/30 bg-emerald-500/5" : "border-border/50 bg-secondary/10"
                )}>
                  {status === "idle" && (
                    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-6">
                      <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center animate-pulse">
                        <Sparkles className="w-10 h-10 text-indigo-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl">Ready for Magic?</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                          Our AI will analyze your image and separate the foreground from the background with surgical precision.
                        </p>
                      </div>
                      <Button 
                        size="lg" 
                        onClick={handleRemoveBackground}
                        className="w-full max-w-[200px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl shadow-xl shadow-indigo-500/20"
                      >
                        Remove Background
                      </Button>
                    </div>
                  )}

                  {(status === "loading-model" || status === "processing") && (
                    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-8">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
                        <Sparkles className="w-8 h-8 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      
                      <div className="space-y-4 w-full max-w-xs mx-auto">
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg italic">
                            {status === "loading-model" ? "Summoning AI Model..." : "Extracting Foreground..."}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {status === "loading-model" 
                              ? "First time only. Downloading ~70MB intelligence core to your browser cache." 
                              : "Applying pixel-perfect segmentation. This stays 100% on your device."}
                          </p>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <span>{status === "loading-model" ? "Downloading" : "Processing"}</span>
                            <span>{Math.round(progress * 100)}%</span>
                          </div>
                          <Progress value={progress * 100} className="h-2 bg-indigo-500/10" />
                        </div>
                      </div>
                    </div>
                  )}

                  {status === "done" && resultPreview && (
                    <div className="flex-grow flex flex-col items-center justify-center p-4 relative group">
                      <div className="w-full h-full aspect-square flex items-center justify-center bg-[url('/checkered.png')] bg-repeat rounded-lg overflow-hidden shadow-inner border border-border/50">
                        <motion.img 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          src={resultPreview} 
                          alt="Result" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-emerald-500 text-white border-none shadow-lg">
                          Transperent PNG
                        </Badge>
                      </div>
                    </div>
                  )}
                </Card>
              </div>

              {status === "done" && result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <ExportPanel
                    blob={result}
                    filename={file.name.replace(/\.[^/.]+$/, "") + "_no_bg.png"}
                    inputSize={file.size}
                    onReset={handleReset}
                  />
                </motion.div>
              )}
            </div>
          )}

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {[
              {
                icon: ShieldCheck,
                title: "Pure Privacy",
                desc: "Your photos never leave your computer. The AI model runs directly in your browser's memory.",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10"
              },
              {
                icon: Sparkles,
                title: "RMBG-1.4 Engine",
                desc: "Powered by BRIA AI's state-of-the-art background removal model for professional results.",
                color: "text-indigo-500",
                bg: "bg-indigo-500/10"
              },
              {
                icon: CheckCircle2,
                title: "High Definition",
                desc: "Supports high-resolution images with edge preservation and alpha-transparency output.",
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              }
            ].map((benefit, i) => (
              <Card key={i} className="p-6 bg-secondary/10 border-border/50 flex flex-col items-center text-center space-y-4 hover:border-border transition-colors">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", benefit.bg)}>
                  <benefit.icon className={cn("w-6 h-6", benefit.color)} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold">{benefit.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>

        </motion.div>
      </main>
      
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border", className)}>
      {children}
    </div>
  );
}
