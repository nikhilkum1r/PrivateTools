"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  FileText, RefreshCw, Copy, CheckCircle2, Trash2, Zap, Sparkles, 
  AlignLeft, Type, Hash, Clock, BookOpen, ShieldCheck, Globe, Star, Users
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/lib/utils";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import { AdUnit } from "@/components/shared/AdUnit";

export default function WordCounterClient() {
  const t = useTranslations("wordCounter");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const text = input.trim();
    const words = text === "" ? 0 : text.split(/\s+/).length;
    const chars = input.length;
    const charsNoSpace = input.replace(/\s+/g, "").length;
    const sentences = text === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text === "" ? 0 : text.split(/\n+/).filter(Boolean).length;
    const lines = text === "" ? 0 : text.split(/\n/).length;
    
    const readingTime = Math.ceil(words / 200); // Average reading speed 200 wpm
    const speakingTime = Math.ceil(words / 130); // Average speaking speed 130 wpm

    return [
      { label: t("stats.words"), value: words, icon: AlignLeft, color: "text-blue-400" },
      { label: t("stats.chars"), value: chars, icon: Type, color: "text-emerald-400" },
      { label: t("stats.noSpaces"), value: charsNoSpace, icon: Hash, color: "text-orange-400" },
      { label: t("stats.sentences"), value: sentences, icon: FileText, color: "text-indigo-400" },
      { label: t("stats.paragraphs"), value: paragraphs, icon: AlignLeft, color: "text-violet-400" },
      { label: t("stats.lines"), value: lines, icon: Hash, color: "text-rose-400" },
      { label: t("stats.readTime"), value: `${readingTime} m`, icon: BookOpen, color: "text-purple-400" },
      { label: t("stats.speakTime"), value: `${speakingTime} m`, icon: Clock, color: "text-pink-400" },
    ];
  }, [input, t]);

  const handleCopy = () => {
    if (!input.trim()) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    toast.success(t("toast.copy"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      <Navbar />
      
      <main id="main-content" className="flex-grow flex flex-col relative overflow-y-auto">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-teal-600/10 blur-[160px] rounded-full animate-pulse delay-1000" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        <div className="flex-grow flex flex-col relative z-10">
          {/* Top Banner Ad */}
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-10 -mb-10">
            <></>
          </div>

          {/* Hero Section */}
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-20 space-y-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-[1px] mx-auto shadow-2xl shadow-emerald-500/20">
                <div className="w-full h-full rounded-[calc(1rem-1px)] bg-card flex items-center justify-center border border-border">
                  <AlignLeft className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-none">
                  {t("title")} <span className="text-emerald-500">{t("subtitle")}</span>
                </h1>
                <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                  {t("description")}
                </p>
              </div>
            </motion.div>

            {/* Editor & Stats Workspace */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Input Section */}
                <div className="lg:col-span-3">
                  <Card className="p-4 sm:p-6 rounded-3xl bg-card/50 backdrop-blur-2xl border-border shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[500px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex-grow flex flex-col">
                      <div className="flex flex-col flex-grow relative border border-border rounded-2xl overflow-hidden bg-background focus-within:ring-2 ring-emerald-500/20 transition-all group h-full">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30 backdrop-blur-md z-10 shrink-0">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("textInputArea")}</span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-500 hover:bg-emerald-500/10" onClick={handleCopy} disabled={!input}>
                              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10" onClick={() => setInput("")} disabled={!input}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                        <Textarea 
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder={t("inputPlaceholder")}
                          className="flex-grow min-h-0 border-0 rounded-none bg-transparent font-mono text-sm leading-relaxed text-foreground p-6 focus-visible:ring-0 resize-none custom-scrollbar"
                          spellCheck={false}
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4 h-full">
                    {stats.map((s, i) => (
                      <Card
                        key={i}
                        className="p-4 rounded-3xl bg-card/50 backdrop-blur-2xl border-border shadow-lg flex flex-col justify-center gap-1 group hover:border-emerald-500/30 transition-all relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                          <s.icon className={cn("w-3.5 h-3.5", s.color)} />
                          {s.label}
                        </div>
                        <div className={cn("relative z-10 text-2xl font-bold tabular-nums group-hover:scale-105 transition-transform origin-left", s.color)}>
                          {s.value}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trusted By / Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              {[
                { label: t("stats.privacy"), icon: ShieldCheck },
                { label: t("stats.instant"), icon: Zap },
                { label: t("stats.noUploads"), icon: Globe },
                { label: t("stats.seo"), icon: Star }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-secondary/20 border border-border flex flex-col items-center gap-2">
                  <item.icon className="w-5 h-5 text-emerald-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Above Content Ad */}
            <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-12">
              <></>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full bg-secondary/10 border-y border-border backdrop-blur-3xl">
            <div className="max-w-5xl mx-auto px-6 py-24 space-y-24">
              
              {/* Free Online Word Counter Tool */}
              <section className="space-y-6 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight text-emerald-500">{t("content.mainTitle")}</h2>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                  {t("content.mainDesc1")}
                </p>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                  {t("content.mainDesc2")}
                </p>
              </section>

              {/* What Can the Word Counter Measure? */}
              <section className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight">{t("content.measureTitle")}</h2>
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">{t("content.measureSubtitle")}</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  <Card className="p-8 rounded-3xl bg-background/50 border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Hash className="w-5 h-5 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-bold tracking-tight">{t("content.textStatsTitle")}</h3>
                    </div>
                    <ul className="space-y-3">
                      {(Array.isArray(t.raw("content.textStatsList")) ? (t.raw("content.textStatsList") as string[]) : []).map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                  
                  <Card className="p-8 rounded-3xl bg-background/50 border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-bold tracking-tight">{t("content.readingTitle")}</h3>
                    </div>
                    <ul className="space-y-3">
                      {(Array.isArray(t.raw("content.readingList")) ? (t.raw("content.readingList") as string[]) : []).map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-8 rounded-3xl bg-background/50 border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-bold tracking-tight">{t("content.writingTitle")}</h3>
                    </div>
                    <ul className="space-y-3">
                      {(Array.isArray(t.raw("content.writingList")) ? (t.raw("content.writingList") as string[]) : []).map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </section>

              {/* Middle Section Ad */}
              <></>

              {/* Key Features / Why Use */}
              <section className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight">{t("content.featuresTitle")}</h2>
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">{t("content.featuresSubtitle")}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: t("content.feature1Title"), desc: t("content.feature1Desc"), icon: Zap },
                    { title: t("content.feature2Title"), desc: t("content.feature2Desc"), icon: Type },
                    { title: t("content.feature3Title"), desc: t("content.feature3Desc"), icon: BookOpen },
                    { title: t("content.feature4Title"), desc: t("content.feature4Desc"), icon: Clock },
                    { title: t("content.feature5Title"), desc: t("content.feature5Desc"), icon: Star },
                    { title: t("content.feature6Title"), desc: t("content.feature6Desc"), icon: ShieldCheck }
                  ].map((feature, i) => (
                    <Card key={i} className="p-6 rounded-3xl bg-background/50 border-border hover:border-emerald-500/30 transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <feature.icon className="w-6 h-6 text-emerald-500" />
                      </div>
                      <h3 className="text-lg font-bold mb-3 tracking-tight">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Common Use Cases & Benefits */}
              <section className="space-y-12">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-grow space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight">{t("content.useCasesTitle")}</h2>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                      {t("content.useCasesDesc")}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      {(Array.isArray(t.raw("content.useCasesList")) ? (t.raw("content.useCasesList") as string[]) : []).map((use, i) => (
                        <div key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-secondary/30 transition-colors group border border-transparent hover:border-border">
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 text-emerald-500 group-hover:text-white transition-all mt-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                          </div>
                          <p className="text-sm font-bold tracking-tight text-muted-foreground group-hover:text-foreground transition-colors">{use}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* How to Use */}
              <section className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight">{t("content.howTitle")}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { step: "1", title: t("content.step1Title"), desc: t("content.step1Desc") },
                    { step: "2", title: t("content.step2Title"), desc: t("content.step2Desc") },
                    { step: "3", title: t("content.step3Title"), desc: t("content.step3Desc") },
                    { step: "4", title: t("content.step4Title"), desc: t("content.step4Desc") }
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-secondary/20 border border-border">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        {s.step}
                      </div>
                      <h4 className="font-bold tracking-tight">{s.title}</h4>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer Area Multiplex Ad */}
              <div className="max-w-5xl mx-auto w-full py-12 border-t border-border/50">
                <></>
              </div>

              {/* FAQ Section */}
              <section className="space-y-12 max-w-3xl mx-auto">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight">{t("faq.title")}</h2>
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">{t("faq.description")}</p>
                </div>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {(Array.isArray(t.raw("faq.items")) ? (t.raw("faq.items") as any[]) : []).map((item, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-2xl px-6 bg-background/50">
                      <AccordionTrigger className="hover:no-underline font-semibold text-sm text-left">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
