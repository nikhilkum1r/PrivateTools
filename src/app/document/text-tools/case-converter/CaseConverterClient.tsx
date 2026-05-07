"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Type, 
  RefreshCw, 
  Copy, 
  CheckCircle2, 
  Trash2,
  Zap,
  Sparkles,
  ArrowDownUp,
  CaseSensitive,
  CaseUpper,
  CaseLower
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function CaseConverterClient() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = (mode: "upper" | "lower" | "title" | "sentence" | "camel" | "snake") => {
    if (!input.trim()) return;
    let result = "";
    switch (mode) {
      case "upper": result = input.toUpperCase(); break;
      case "lower": result = input.toLowerCase(); break;
      case "title": result = input.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' '); break;
      case "sentence": result = input.toLowerCase().replace(/(^\w|\.\s+\w)/gm, s => s.toUpperCase()); break;
      case "camel": result = input.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()); break;
      case "snake": result = input.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_"); break;
    }
    setInput(result);
    toast.success(`${mode.charAt(0).toUpperCase() + mode.slice(1)} case applied!`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        <div className="space-y-12">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest"
            >
              <CaseSensitive className="w-3.5 h-3.5" />
              Linguistic Matrix Studio
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight italic">
              Case <span className="text-primary not-italic">Converter.</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              Transform text casing instantly. Sentence, Title, Camel, and Snake case with zero server telemetry.
            </p>
            <PrivacyBadge />
          </div>

          <Card className="p-8 rounded-[3rem] bg-secondary/30 border-border space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: "UPPER", mode: "upper", icon: CaseUpper },
                { name: "lower", mode: "lower", icon: CaseLower },
                { name: "Title Case", mode: "title", icon: Type },
                { name: "Sentence", mode: "sentence", icon: CaseSensitive },
                { name: "camelCase", mode: "camel", icon: Zap },
                { name: "snake_case", mode: "snake", icon: RefreshCw }
              ].map((m) => (
                <Button 
                  key={m.mode}
                  variant="outline"
                  className="h-12 rounded-xl font-bold text-[10px] uppercase tracking-wider border-border bg-secondary/30 hover:bg-primary hover:text-foreground transition-all"
                  onClick={() => convert(m.mode as any)}
                >
                  {m.name}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-2">
                 <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Text Matrix</Label>
                 <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={handleCopy} disabled={!input}>
                       {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 hover:text-red-500" onClick={() => setInput("")}>
                       <Trash2 className="w-4 h-4" />
                    </Button>
                 </div>
              </div>
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to transform..."
                className="min-h-[400px] rounded-[2rem] bg-card border-border font-mono text-sm leading-relaxed text-white/70 p-8 focus-visible:ring-primary/20"
              />
            </div>
          </Card>

          {/* Guide Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
             <div className="space-y-6">
                <h3 className="text-2xl font-black italic flex items-center gap-3">
                   <Sparkles className="w-6 h-6 text-primary" /> Case Mechanics
                </h3>
                <div className="space-y-4 text-muted-foreground font-medium text-sm leading-relaxed">
                   <p>SafeTools Case Converter provides a lightning-fast interface for textual transformation. All logic is executed in your browser's main thread.</p>
                   <ul className="space-y-2 list-disc list-inside marker:text-primary">
                      <li>Professional Utility: Perfect for developers and copywriters.</li>
                      <li>Camel & Snake: Optimized for variable naming conventions.</li>
                      <li>Zero Telemetry: Your text stays in your browser.</li>
                   </ul>
                </div>
             </div>
             <div className="p-8 rounded-[3rem] bg-primary/5 border border-primary/10 flex flex-col justify-center gap-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
                      <CaseSensitive className="w-6 h-6 text-foreground" />
                   </div>
                   <h4 className="text-xl font-black uppercase tracking-tight">Identity Safe</h4>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                   Process classified notes, passwords, or code snippets with absolute confidence. SafeTools is the only utility suite that guarantees zero server interaction.
                </p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
