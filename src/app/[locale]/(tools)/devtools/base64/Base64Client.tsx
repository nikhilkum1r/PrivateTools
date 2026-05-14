"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  Binary, 
  RefreshCw, 
  Copy, 
  CheckCircle2, 
  Trash2,
  Zap,
  Sparkles,
  ArrowRightLeft,
  ImageIcon,
  Type
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DropZone } from "@/components/shared/DropZone";
import { FAQ } from "@/components/shared/FAQ";
import { AdUnit } from "@/components/shared/AdUnit";

export default function Base64Client() {
  const t = useTranslations("base64");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [type, setType] = useState<"text" | "image">("text");
  const [copied, setCopied] = useState(false);

  const processData = () => {
    if (!input.trim() && type === "text") { toast.error(t("messages.text_empty")); return; }

    try {
      if (mode === "encode") {
        setOutput(btoa(input));
      } else {
        setOutput(atob(input));
      }
      toast.success(t("messages.success"));
    } catch (e) {
      toast.error(t("messages.error"));
    }
  };

  const handleImageDrop = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setOutput(base64);
      toast.success(t("messages.image_success"));
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success(t("messages.copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main id="main-content" className="flex-grow container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        <div className="space-y-6">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-semibold uppercase tracking-wider"
            >
              <Binary className="w-3.5 h-3.5" />
              {t("hero.badge")}
            </motion.div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight" dangerouslySetInnerHTML={{ __html: t("hero.title") }} />
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              {t("hero.subtitle")}
            </p>
            <PrivacyBadge />
          </div>

          <Card className="p-8 rounded-2xl bg-secondary/30 border-border space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button 
                variant={type === "text" ? "default" : "outline"}
                className="h-10 rounded-2xl px-8 font-bold gap-2"
                onClick={() => { setType("text"); setInput(""); setOutput(""); }}
              >
                <Type className="w-4 h-4" /> {t("modes.text")}
              </Button>
              <Button 
                variant={type === "image" ? "default" : "outline"}
                className="h-10 rounded-2xl px-8 font-bold gap-2"
                onClick={() => { setType("image"); setInput(""); setOutput(""); }}
              >
                <ImageIcon className="w-4 h-4" /> {t("modes.image")}
              </Button>
            </div>

            {type === "text" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                     <div className="flex gap-4">
                        <button 
                          className={cn("text-[10px] font-semibold uppercase tracking-wider transition-colors", mode === "encode" ? "text-primary" : "text-muted-foreground/40")}
                          onClick={() => setMode("encode")}
                        >
                          {t("modes.encode")}
                        </button>
                        <button 
                          className={cn("text-[10px] font-semibold uppercase tracking-wider transition-colors", mode === "decode" ? "text-primary" : "text-muted-foreground/40")}
                          onClick={() => setMode("decode")}
                        >
                          {t("modes.decode")}
                        </button>
                     </div>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-red-500" onClick={() => setInput("")}>
                        <Trash2 className="w-4 h-4" />
                     </Button>
                  </div>
                  <Textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === "encode" ? t("placeholders.text_encode") : t("placeholders.text_decode")}
                    className="min-h-[300px] rounded-xl bg-card border-border font-mono text-xs leading-relaxed text-muted-foreground/80 p-6"
                  />
                  <Button className="w-full h-10 rounded-2xl bg-primary font-bold gap-2" onClick={processData}>
                     <Zap className="w-4 h-4" /> {t("buttons.execute", { mode: mode.toUpperCase() })}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-2">
                     <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("labels.result")}</Label>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={handleCopy} disabled={!output}>
                        {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                     </Button>
                  </div>
                  <div className="relative group min-h-[300px]">
                     <Textarea 
                       readOnly
                       value={output}
                       placeholder={t("placeholders.awaiting_synthesis")}
                       className="absolute inset-0 rounded-xl bg-white/[0.01] border-border font-mono text-xs leading-relaxed text-primary/80 p-6 resize-none"
                     />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <DropZone onFilesDrop={handleImageDrop} accept="image/*" multiple={false} className="h-80 rounded-2xl border-dashed border-border bg-secondary/50" />
                   <div className="relative group h-80">
                      <Textarea 
                        readOnly
                        value={output}
                        placeholder={t("placeholders.awaiting_image")}
                        className="absolute inset-0 rounded-2xl bg-white/[0.01] border-border font-mono text-xs leading-relaxed text-primary/80 p-8 resize-none"
                      />
                      {output && (
                        <Button 
                          className="absolute bottom-6 right-6 h-10 rounded-xl bg-primary gap-2 font-bold" 
                          onClick={handleCopy}
                        >
                          {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {t("buttons.copy_string")}
                        </Button>
                      )}
                   </div>
                </div>
                {output && output.startsWith('data:image') && (
                  <div className="p-8 rounded-2xl bg-secondary/30 border border-border flex flex-col items-center gap-3">
                     <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("labels.preview")}</Label>
                     <div className="max-w-md w-full aspect-video rounded-2xl overflow-hidden border border-border bg-black">
                        <img src={output} className="w-full h-full object-contain" alt={t("labels.preview")} />
                     </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Guide Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-12">
             <div className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                   <Sparkles className="w-6 h-6 text-primary" /> {t("guide.title")}
                </h3>
                <div className="space-y-4 text-muted-foreground font-medium text-sm leading-relaxed">
                   <p>{t("guide.content")}</p>
                   <ul className="space-y-2 list-disc list-inside marker:text-primary">
                      {(Array.isArray(t.raw("guide.list")) ? (t.raw("guide.list") as any[]) : []).map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                   </ul>
                </div>
             </div>
             <div className="p-8 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-center gap-3">
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-2xl bg-primary flex items-center justify-center">
                      <Binary className="w-6 h-6 text-foreground" />
                   </div>
                   <h4 className="text-xl font-bold tracking-tight">{t("guide.precision_title")}</h4>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                   {t("guide.precision_content")}
                </p>
             </div>
          </div>

          <div className="pt-12">
            <AdUnit type="in-article" />
          </div>

          {t.raw("faq") && (
            <FAQ 
              items={t.raw("faq.items")} 
              title={t("faq.title")} 
              description={t("faq.description")} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
