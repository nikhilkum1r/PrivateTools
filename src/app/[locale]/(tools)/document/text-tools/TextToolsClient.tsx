"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlignLeft, Copy, Download, RefreshCw, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ExportManager } from "@/lib/export-manager";
import { useTranslations } from "next-intl";

type Operation =
  | "word-count" | "char-count" | "line-count"
  | "remove-duplicates" | "remove-blanks" | "trim-lines"
  | "uppercase" | "lowercase" | "titlecase" | "sentencecase"
  | "base64-encode" | "base64-decode" | "url-encode" | "url-decode"
  | "reverse-lines" | "sort-lines";

export default function TextToolsClient() {
  const t = useTranslations("textTools");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const applyOperation = (text: string, op: Operation): string => {
    const lines = text.split("\n");
    switch (op) {
      case "word-count":   return t("operations.results.word-count", { count: text.trim().split(/\s+/).filter(Boolean).length });
      case "char-count":   return t("operations.results.char-count", { total: text.length, noSpaces: text.replace(/\s/g, "").length });
      case "line-count":   return t("operations.results.line-count", { count: lines.length });
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
      case "base64-decode": try { return decodeURIComponent(escape(atob(text.trim()))); } catch { return t("operations.results.error-base64"); }
      case "url-encode":    return encodeURIComponent(text);
      case "url-decode":    try { return decodeURIComponent(text); } catch { return t("operations.results.error-url"); }
      default: return text;
    }
  };

  const handleOp = (op: Operation) => {
    if (!input.trim()) { 
      import("sonner").then(m => m.toast.error(t("status.empty"))); 
      return; 
    }
    setOutput(applyOperation(input, op));
  };

  const handleCopy = async () => {
    if (!output) return;
    await ExportManager.copyText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    ExportManager.downloadFile(new Blob([output], { type: "text/plain" }), "output.txt");
  };

  const GROUPS = ["Stats", "Case", "Clean", "Encode"];
  const OPERATIONS: { label: string; value: Operation; group: string }[] = [
    { label: t("operations.labels.word-count"), value: "word-count", group: "Stats" },
    { label: t("operations.labels.char-count"), value: "char-count", group: "Stats" },
    { label: t("operations.labels.line-count"), value: "line-count", group: "Stats" },
    { label: t("operations.labels.uppercase"), value: "uppercase", group: "Case" },
    { label: t("operations.labels.lowercase"), value: "lowercase", group: "Case" },
    { label: t("operations.labels.titlecase"), value: "titlecase", group: "Case" },
    { label: t("operations.labels.sentencecase"), value: "sentencecase", group: "Case" },
    { label: t("operations.labels.remove-duplicates"), value: "remove-duplicates", group: "Clean" },
    { label: t("operations.labels.remove-blanks"), value: "remove-blanks", group: "Clean" },
    { label: t("operations.labels.trim-lines"), value: "trim-lines", group: "Clean" },
    { label: t("operations.labels.sort-lines"), value: "sort-lines", group: "Clean" },
    { label: t("operations.labels.reverse-lines"), value: "reverse-lines", group: "Clean" },
    { label: t("operations.labels.base64-encode"), value: "base64-encode", group: "Encode" },
    { label: t("operations.labels.base64-decode"), value: "base64-decode", group: "Encode" },
    { label: t("operations.labels.url-encode"), value: "url-encode", group: "Encode" },
    { label: t("operations.labels.url-decode"), value: "url-decode", group: "Encode" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main id="main-content" className="flex-grow container mx-auto px-4 py-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="text-center space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto">
              <AlignLeft className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
            <PrivacyBadge />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="rounded-none uppercase tracking-wider text-[9px] font-bold">{t("input.label")}</Badge>
                <span className="text-[9px] uppercase font-bold text-muted-foreground">{t("input.stats", { count: input.length })}</span>
              </div>
              <Textarea
                placeholder={t("input.placeholder")}
                className="min-h-[300px] font-mono text-sm leading-relaxed rounded-none border-border bg-secondary/20"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-[10px] font-semibold uppercase tracking-wider h-8" onClick={() => setInput("")}>
                  {t("status.reset")}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="rounded-none uppercase tracking-wider text-[9px] font-bold">{t("output.label")}</Badge>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] font-semibold uppercase tracking-wider" onClick={handleCopy}>
                    {copied ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    <span className="ml-1">{t("output.copy")}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] font-semibold uppercase tracking-wider" onClick={handleDownload}>
                    <Download className="w-3 h-3" />
                    <span className="ml-1">{t("output.save")}</span>
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder={t("output.placeholder")}
                className="min-h-[300px] font-mono text-sm leading-relaxed rounded-none border-border bg-secondary/20"
                value={output}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-6 pt-4">
            {GROUPS.map((group) => (
              <div key={group} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-grow bg-border" />
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground/60">{t(`operations.groups.${group}`)}</span>
                  <div className="h-px flex-grow bg-border" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {OPERATIONS.filter((o) => o.group === group).map((op) => (
                    <Button
                      key={op.value}
                      variant="outline"
                      className="h-10 rounded-none border-border/50 bg-secondary/5 hover:bg-green-500 hover:text-white hover:border-green-500 text-[10px] font-semibold uppercase tracking-wider transition-all"
                      onClick={() => handleOp(op.value)}
                    >
                      {op.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
