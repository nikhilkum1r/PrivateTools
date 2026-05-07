"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  RefreshCw, 
  Copy, 
  CheckCircle2, 
  Trash2,
  Zap,
  Sparkles,
  AlignLeft,
  Type,
  Hash,
  Clock,
  BookOpen
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

export default function WordCounterClient() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const text = input.trim();
    const words = text === "" ? 0 : text.split(/\s+/).length;
    const chars = input.length;
    const charsNoSpace = input.replace(/\s+/g, "").length;
    const sentences = text === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
    const readingTime = Math.ceil(words / 200); // Average reading speed 200 wpm
    const speakingTime = Math.ceil(words / 130); // Average speaking speed 130 wpm

    return [
      { label: "Words", value: words, icon: AlignLeft, color: "text-blue-400" },
      { label: "Characters", value: chars, icon: Type, color: "text-primary" },
      { label: "Sentences", value: sentences, icon: FileText, color: "text-emerald-400" },
      { label: "No Spaces", value: charsNoSpace, icon: Hash, color: "text-orange-400" },
      { label: "Read Time", value: `${readingTime} min`, icon: BookOpen, color: "text-purple-400" },
      { label: "Speak Time", value: `${speakingTime} min`, icon: Clock, color: "text-pink-400" },
    ];
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <div className="space-y-12">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest"
            >
              <AlignLeft className="w-3.5 h-3.5" />
              Linguistic Analytics Engine
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight italic">
              Word <span className="text-primary not-italic">Counter.</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              Professional real-time text analytics. Count words, characters, and reading time with 100% local privacy.
            </p>
            <PrivacyBadge />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="p-8 rounded-[3rem] bg-secondary/30 border-border space-y-6">
                <div className="flex justify-between items-center px-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Source Content</Label>
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
                  placeholder="Paste your manuscript here..."
                  className="min-h-[500px] rounded-[2rem] bg-card border-border font-mono text-base leading-relaxed text-white/70 p-8 focus-visible:ring-primary/20 transition-all"
                />
              </Card>
            </div>

            {/* Stats Section */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 rounded-[2rem] bg-secondary/30 border border-border flex flex-col gap-1 group hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                      <s.icon className={cn("w-3.5 h-3.5", s.color)} />
                      {s.label}
                    </div>
                    <div className={cn("text-2xl font-black tabular-nums group-hover:scale-105 transition-transform origin-left", s.color)}>{s.value}</div>
                  </motion.div>
                ))}
              </div>

              <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-widest text-primary italic">Pro Tip</h4>
                 <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    SafeTools analyzes your text in real-time. No character ever touches our infrastructure. Perfect for classified reports and creative manuscripts.
                 </p>
              </div>
            </div>
          </div>

          {/* FAQ/Content Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-border">
             <div className="space-y-6">
                <h3 className="text-2xl font-black italic">Advanced Text Analytics</h3>
                <div className="space-y-4 text-muted-foreground font-medium text-sm leading-relaxed">
                   <p>SafeTools Word Counter is designed for precision. Whether you're hitting an essay limit or optimizing copy for social media, our engine provides instant feedback.</p>
                   <ul className="space-y-2 list-disc list-inside marker:text-primary">
                      <li>Twitter Limit: 280 characters</li>
                      <li>LinkedIn Limit: 3000 characters</li>
                      <li>Meta Description: 155-160 characters</li>
                   </ul>
                </div>
             </div>
             <div className="space-y-6">
                <h3 className="text-2xl font-black italic">Absolute Confidentiality</h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                   Conventional word counters log your text to improve their "AI models." SafeTools does the opposite. 
                   We give you the power of analysis without the risk of surveillance. Every count is processed 
                   locally in your browser's RAM and wiped the moment you refresh.
                </p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
