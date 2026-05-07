"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlignLeft, Copy, Download, RefreshCw, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { downloadBlob } from "@/lib/utils/download";
import { toast } from "sonner";

type Operation =
  | "word-count" | "char-count" | "line-count"
  | "remove-duplicates" | "remove-blanks" | "trim-lines"
  | "uppercase" | "lowercase" | "titlecase" | "sentencecase"
  | "base64-encode" | "base64-decode" | "url-encode" | "url-decode"
  | "reverse-lines" | "sort-lines";

const OPERATIONS: { label: string; value: Operation; group: string }[] = [
  { label: "Word Count", value: "word-count", group: "Stats" },
  { label: "Char Count", value: "char-count", group: "Stats" },
  { label: "Line Count", value: "line-count", group: "Stats" },
  { label: "UPPERCASE", value: "uppercase", group: "Case" },
  { label: "lowercase", value: "lowercase", group: "Case" },
  { label: "Title Case", value: "titlecase", group: "Case" },
  { label: "Sentence case", value: "sentencecase", group: "Case" },
  { label: "Remove Duplicate Lines", value: "remove-duplicates", group: "Clean" },
  { label: "Remove Blank Lines", value: "remove-blanks", group: "Clean" },
  { label: "Trim Each Line", value: "trim-lines", group: "Clean" },
  { label: "Sort Lines A→Z", value: "sort-lines", group: "Clean" },
  { label: "Reverse Line Order", value: "reverse-lines", group: "Clean" },
  { label: "Base64 Encode", value: "base64-encode", group: "Encode" },
  { label: "Base64 Decode", value: "base64-decode", group: "Encode" },
  { label: "URL Encode", value: "url-encode", group: "Encode" },
  { label: "URL Decode", value: "url-decode", group: "Encode" },
];

function applyOperation(text: string, op: Operation): string {
  const lines = text.split("\n");
  switch (op) {
    case "word-count":   return `Word count: ${text.trim().split(/\s+/).filter(Boolean).length}`;
    case "char-count":   return `Character count: ${text.length} (${text.replace(/\s/g, "").length} without spaces)`;
    case "line-count":   return `Line count: ${lines.length}`;
    case "uppercase":    return text.toUpperCase();
    case "lowercase":    return text.toLowerCase();
    case "titlecase":    return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    case "sentencecase": return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case "remove-duplicates": return [...new Set(lines)].join("\n");
    case "remove-blanks":     return lines.filter((l) => l.trim() !== "").join("\n");
    case "trim-lines":        return lines.map((l) => l.trim()).join("\n");
    case "sort-lines":        return [...lines].sort((a, b) => a.localeCompare(b)).join("\n");
    case "reverse-lines":     return [...lines].reverse().join("\n");
    case "base64-encode": return btoa(unescape(encodeURIComponent(text)));
    case "base64-decode": try { return decodeURIComponent(escape(atob(text.trim()))); } catch { return "Error: Invalid Base64 input."; }
    case "url-encode":    return encodeURIComponent(text);
    case "url-decode":    try { return decodeURIComponent(text); } catch { return "Error: Invalid URL-encoded input."; }
    default: return text;
  }
}

const GROUPS = ["Stats", "Case", "Clean", "Encode"];

export default function TextToolsClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleOp = (op: Operation) => {
    if (!input.trim()) { toast.error("Enter some text first."); return; }
    setOutput(applyOperation(input, op));
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true); toast.success("Copied!"); setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    downloadBlob(new Blob([output], { type: "text/plain" }), "output.txt");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="text-center space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto">
              <AlignLeft className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Text Utilities</h1>
            <p className="text-muted-foreground">Transform, analyze and encode text instantly in your browser.</p>
            <PrivacyBadge />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Input</span>
                <Badge variant="secondary">{input.length} chars</Badge>
              </div>
              <Textarea
                placeholder="Paste your text here…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[300px] rounded-xl font-mono text-sm"
              />
            </div>

            {/* Output */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Output</span>
                {output && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={handleCopy}>
                      {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={handleDownload}>
                      <Download className="w-3 h-3" /> Save
                    </Button>
                  </div>
                )}
              </div>
              <Textarea
                readOnly
                value={output}
                placeholder="Result will appear here…"
                className="min-h-[300px] rounded-xl font-mono text-sm bg-secondary/30"
              />
            </div>
          </div>

          {/* Operations */}
          <div className="space-y-4">
            {GROUPS.map((group) => (
              <div key={group} className="space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{group}</p>
                <div className="flex flex-wrap gap-2">
                  {OPERATIONS.filter((o) => o.group === group).map((op) => (
                    <Button
                      key={op.value}
                      variant="outline"
                      size="sm"
                      className="rounded-lg text-xs font-bold hover:border-primary/50 hover:bg-primary/5"
                      onClick={() => handleOp(op.value)}
                    >
                      {op.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {output && (
            <Button variant="ghost" className="gap-2 text-muted-foreground" onClick={() => { setInput(""); setOutput(""); }}>
              <RefreshCw className="w-4 h-4" /> Reset
            </Button>
          )}
        </motion.div>
      </main>
    </div>
  );
}
