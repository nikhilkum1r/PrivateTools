"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  FileCode, 
  Table, 
  RefreshCw, 
  Copy, 
  CheckCircle2, 
  Download, 
  Trash2,
  Database,
  ArrowLeftRight,
  Zap,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function DataConverterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"json-to-csv" | "csv-to-json">("json-to-csv");
  const [copied, setCopied] = useState(false);

  const convertData = () => {
    if (!input.trim()) { toast.error("Please provide input data."); return; }

    try {
      if (mode === "json-to-csv") {
        const json = JSON.parse(input);
        const data = Array.isArray(json) ? json : [json];
        if (data.length === 0) throw new Error("Empty array provided.");
        
        const headers = Object.keys(data[0]);
        const csvRows = [
          headers.join(","),
          ...data.map(row => headers.map(header => JSON.stringify(row[header] ?? "")).join(","))
        ];
        setOutput(csvRows.join("\n"));
      } else {
        const lines = input.trim().split("\n");
        const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ''));
        const json = lines.slice(1).map(line => {
          const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ''));
          const obj: any = {};
          headers.forEach((h, i) => obj[h] = values[i]);
          return obj;
        });
        setOutput(JSON.stringify(json, null, 2));
      }
      toast.success("Conversion successful!");
    } catch (e) {
      toast.error("Invalid format: " + (e as Error).message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResult = () => {
    const ext = mode === "json-to-csv" ? "csv" : "json";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted-data.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        <div className="space-y-6">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest"
            >
              <Database className="w-3.5 h-3.5" />
              Dev Data Studio
            </motion.div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight italic">
              Data <span className="text-primary not-italic">Converter.</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              Bidirectional JSON and CSV transformation. Industrial-grade parsing with zero-server privacy.
            </p>
            <PrivacyBadge />
          </div>

          <Card className="p-8 rounded-2xl bg-secondary/30 border-border space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                variant={mode === "json-to-csv" ? "default" : "outline"}
                className="h-10 rounded-2xl px-8 font-black gap-2"
                onClick={() => { setMode("json-to-csv"); setInput(""); setOutput(""); }}
              >
                <FileCode className="w-4 h-4" /> JSON → CSV
              </Button>
              <Button 
                variant={mode === "csv-to-json" ? "default" : "outline"}
                className="h-10 rounded-2xl px-8 font-black gap-2"
                onClick={() => { setMode("csv-to-json"); setInput(""); setOutput(""); }}
              >
                <Table className="w-4 h-4" /> CSV → JSON
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Input Matrix</Label>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-red-500" onClick={() => setInput("")}>
                      <Trash2 className="w-4 h-4" />
                   </Button>
                </div>
                <Textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === "json-to-csv" ? '[{"id": 1, "name": "Admin"}, ...]' : 'id,name\n1,Admin'}
                  className="min-h-[400px] rounded-xl bg-card border-border font-mono text-xs leading-relaxed text-muted-foreground/80 placeholder:text-white/10 p-6 focus-visible:ring-primary/20"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Output Matrix</Label>
                   <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={handleCopy} disabled={!output}>
                         {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground" onClick={downloadResult} disabled={!output}>
                         <Download className="w-4 h-4" />
                      </Button>
                   </div>
                </div>
                <div className="relative group min-h-[400px]">
                   <Textarea 
                     readOnly
                     value={output}
                     placeholder="Awaiting synthesis..."
                     className="absolute inset-0 rounded-xl bg-white/[0.01] border-border font-mono text-xs leading-relaxed text-primary/80 placeholder:text-white/10 p-6 resize-none"
                   />
                   {!output && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center opacity-5 pointer-events-none space-y-4">
                        <ArrowLeftRight className="w-16 h-11" />
                        <p className="font-black uppercase tracking-[0.3em] text-xs">Awaiting Matrix</p>
                     </div>
                   )}
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-9 rounded-lg bg-primary hover:bg-primary/90 text-foreground font-black text-lg gap-3 shadow-2xl shadow-primary/20 italic"
              onClick={convertData}
            >
              <Zap className="w-5 h-5" /> EXECUTE CONVERSION
            </Button>
          </Card>

          {/* Guide Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-12">
             <div className="space-y-6">
                <h3 className="text-2xl font-black italic flex items-center gap-3">
                   <Sparkles className="w-6 h-6 text-primary" /> How it Works
                </h3>
                <div className="space-y-4 text-muted-foreground font-medium text-sm leading-relaxed">
                   <p>SafeTools Data Converter uses high-performance local parsing to transform your data structures without ever sending them to a server.</p>
                   <ul className="space-y-2 list-disc list-inside marker:text-primary">
                      <li>JSON to CSV: Flattens object arrays into row-based tables.</li>
                      <li>CSV to JSON: Maps delimited rows back into structured objects.</li>
                      <li>100% Privacy: Processing happens entirely in your browser RAM.</li>
                   </ul>
                </div>
             </div>
             <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-center gap-3">
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-2xl bg-primary flex items-center justify-center">
                      <Database className="w-6 h-6 text-foreground" />
                   </div>
                   <h4 className="text-xl font-black uppercase tracking-tight">Enterprise Ready</h4>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                   Handles large datasets with ease. Designed for developers, data analysts, and privacy-conscious professionals who need to move data between platforms securely.
                </p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
