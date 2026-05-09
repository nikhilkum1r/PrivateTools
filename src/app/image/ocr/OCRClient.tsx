"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileSearch, 
  Copy, 
  CheckCircle2, 
  RefreshCw, 
  Trash2, 
  Languages, 
  FileText,
  Loader2,
  Sparkles,
  Zap,
  Download,
  ShieldCheck
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createWorker } from "tesseract.js";
import { toast } from "sonner";
import { formatBytes } from "@/lib/utils/fileSize";

const LANGUAGES = [
  { code: "eng", name: "English" },
  { code: "spa", name: "Spanish" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "ita", name: "Italian" },
  { code: "por", name: "Portuguese" },
  { code: "hin", name: "Hindi" },
  { code: "chi_sim", name: "Chinese (Simp)" },
  { code: "jpn", name: "Japanese" },
];

export default function OCRClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [language, setLanguage] = useState("eng");
  const [status, setStatus] = useState<"idle" | "loading" | "processing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [file]);

  const handleDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (f) {
      setFile(f);
      setStatus("idle");
      setResult("");
      setProgress(0);
    }
  }, []);

  const runOCR = async () => {
    if (!file) return;
    setStatus("loading");
    setProgress(0);

    try {
      const worker = await createWorker(language, 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      setStatus("processing");
      const { data: { text } } = await worker.recognize(file);
      setResult(text);
      await worker.terminate();
      setStatus("done");
      toast.success("Text extraction complete!");
    } catch (error) {
      toast.error("OCR failed. Please try again.");
      setStatus("idle");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ocr-${file?.name.split('.')[0] || 'result'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 max-w-5xl relative">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        
        <div className="space-y-6 relative z-10">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Visual Intelligence
            </motion.div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight italic">
              OCR <span className="text-primary not-italic">Studio.</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              Extract clean text from any image instantly. 100% private, local-first AI processing.
            </p>
            <PrivacyBadge />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Input Column */}
            <div className="space-y-4">
              {!file ? (
                <DropZone onFilesDrop={handleDrop} accept="image/*" multiple={false} className="h-96 rounded-2xl border-dashed border-border bg-secondary/50" />
              ) : (
                <Card className="p-8 rounded-2xl bg-secondary/30 border-border space-y-4 overflow-hidden relative group">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-card border border-border shadow-2xl relative">
                    {preview && <img src={preview} className="w-full h-full object-contain" alt="Preview" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                       <Badge variant="secondary" className="bg-muted/40 backdrop-blur-md border-border">{formatBytes(file.size)}</Badge>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Select Language</Label>
                       <Select value={language} onValueChange={(val) => val && setLanguage(val)}>
                          <SelectTrigger className="h-10 rounded-2xl bg-secondary/50 border-border font-bold">
                             <div className="flex items-center gap-3">
                               <Languages className="w-4 h-4 text-primary" />
                               <SelectValue placeholder="Select Language" />
                             </div>
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                             {LANGUAGES.map(lang => (
                               <SelectItem key={lang.code} value={lang.code} className="font-medium">{lang.name}</SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="flex gap-4">
                       <Button 
                         className="flex-grow h-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black gap-2 shadow-2xl shadow-primary/20 italic"
                         onClick={runOCR}
                         disabled={status === "loading" || status === "processing"}
                       >
                         {status === "loading" || status === "processing" ? (
                           <><Loader2 className="w-4 h-4 animate-spin" /> Processing {progress}%</>
                         ) : (
                           <><Zap className="w-4 h-4" /> Start Extraction</>
                         )}
                       </Button>
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-10 w-10 rounded-2xl border border-border text-red-500 hover:bg-red-500/10"
                         onClick={() => { setFile(null); setResult(""); setStatus("idle"); }}
                       >
                         <Trash2 className="w-5 h-5" />
                       </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Output Column */}
            <div className="space-y-4">
              <Card className="h-full p-8 rounded-2xl bg-secondary/30 border-border flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-black uppercase tracking-widest text-sm">Extracted Matrix</h3>
                   </div>
                   {result && (
                     <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-primary" onClick={handleCopy}>
                           {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-foreground" onClick={downloadText}>
                           <Download className="w-4 h-4" />
                        </Button>
                     </div>
                   )}
                </div>

                <div className="flex-grow relative">
                   <Textarea 
                     value={result}
                     onChange={(e) => setResult(e.target.value)}
                     placeholder="Waiting for neural analysis..."
                     className="absolute inset-0 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed text-foreground/70 placeholder:text-foreground/10 p-0"
                   />
                   {!result && status === "idle" && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 pointer-events-none space-y-4">
                        <FileSearch className="w-16 h-11" />
                        <p className="font-black uppercase tracking-[0.3em] text-xs">Awaiting Asset</p>
                     </div>
                   )}
                   {(status === "loading" || status === "processing") && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/20 backdrop-blur-sm rounded-2xl z-10 space-y-6">
                        <div className="w-12 h-12 rounded-3xl border border-primary/20 flex items-center justify-center relative">
                           <Loader2 className="w-5 h-5 text-primary animate-spin" />
                           <div className="absolute inset-0 bg-primary/5 blur-xl rounded-full" />
                        </div>
                        <div className="text-center space-y-2">
                           <p className="font-black uppercase tracking-widest text-xs">Neural Mapping Active</p>
                           <p className="text-[10px] text-primary font-bold">{progress}% Synthesized</p>
                        </div>
                     </div>
                   )}
                </div>
              </Card>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12">
             {[
               { icon: FileSearch, title: "Neural OCR", desc: "Advanced pattern recognition engines for high-accuracy text extraction." },
               { icon: ShieldCheck, title: "100% Private", desc: "Neural weights are executed locally. No image data is ever transmitted." },
               { icon: Zap, title: "GPU Enabled", desc: "Hardware accelerated inference for lightning-fast character recognition." }
             ].map((feature, i) => (
               <div key={i} className="p-8 rounded-2xl bg-secondary/30 border border-border space-y-4">
                  <div className="w-8 h-8 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-black uppercase tracking-widest text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </main>
    </div>
  );
}
