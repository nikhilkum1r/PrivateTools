"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Type, RefreshCw, Copy, CheckCircle2, Trash2, Zap, Sparkles, 
  CaseSensitive, CaseUpper, CaseLower, Code2, ShieldCheck, Globe, Star, FileText
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Footer } from "@/components/shared/Footer";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import { AdUnit } from "@/components/shared/AdUnit";

export default function CaseConverterClient() {
  const t = useTranslations("caseConverter");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = (mode: string) => {
    if (!input.trim()) return;
    let result = "";
    const str = input;
    switch (mode) {
      case "upper": result = str.toUpperCase(); break;
      case "lower": result = str.toLowerCase(); break;
      case "title": result = str.toLowerCase().split(/\s+/).map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' '); break;
      case "sentence": result = str.toLowerCase().replace(/(^\w|\.\s+\w)/gm, s => s.toUpperCase()); break;
      case "capitalized": result = str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase()); break;
      case "toggle": result = str.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''); break;
      case "camel": result = str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()); break;
      case "pascal": {
        const camel = str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        result = camel.charAt(0).toUpperCase() + camel.slice(1);
        break;
      }
      case "snake": result = str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_"); break;
      case "screaming_snake": result = str.toUpperCase().replace(/[^A-Z0-9]+/g, "_"); break;
      case "kebab": result = str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-"); break;
      case "train": result = str.toUpperCase().replace(/[^A-Z0-9]+/g, "-"); break;
      case "dot": result = str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "."); break;
      case "path": result = str.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "/"); break;
    }
    setInput(result);
    toast.success(t("toast.success"));
  };

  const handleCopy = () => {
    if (!input.trim()) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    toast.success(t("toast.copy"));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
      <Navbar />
      
      <main id="main-content" className="flex-grow flex flex-col relative overflow-y-auto">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[160px] rounded-full animate-pulse delay-1000" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        <div className="flex-grow flex flex-col relative z-10">
          {/* Top Banner Ad */}
          <div className="max-w-5xl mx-auto w-full px-6 pt-10 -mb-10">
            <></>
          </div>

          {/* Hero Section */}
          <div className="max-w-5xl w-full mx-auto px-6 py-20 space-y-12 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-[1px] mx-auto shadow-2xl shadow-indigo-500/20">
                <div className="w-full h-full rounded-[calc(1rem-1px)] bg-card flex items-center justify-center border border-border">
                  <CaseSensitive className="w-8 h-8 text-indigo-500" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase leading-none">
                  {t("title")} <span className="text-indigo-500">{t("subtitle")}</span>
                </h1>
                <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                  {t("description")}
                </p>
              </div>
            </motion.div>

            {/* Editor Workspace */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="p-4 sm:p-6 rounded-3xl bg-card/50 backdrop-blur-2xl border-border shadow-2xl relative overflow-hidden flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                
                <div className="relative z-10 space-y-6 flex-grow flex flex-col">
                  {/* Actions Bar */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {[
                      { name: t("modes.upper"), mode: "upper", icon: CaseUpper },
                      { name: t("modes.lower"), mode: "lower", icon: CaseLower },
                      { name: t("modes.title"), mode: "title", icon: Type },
                      { name: t("modes.sentence"), mode: "sentence", icon: CaseSensitive },
                      { name: t("modes.camel"), mode: "camel", icon: Code2 },
                      { name: t("modes.snake"), mode: "snake", icon: Code2 },
                      { name: t("modes.kebab"), mode: "kebab", icon: Code2 }
                    ].map((m) => (
                      <Button 
                        key={m.mode}
                        variant="outline"
                        className="h-10 rounded-xl font-bold text-[10px] uppercase tracking-wider border-border bg-secondary/30 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all flex gap-1"
                        onClick={() => convert(m.mode)}
                      >
                        <m.icon className="w-3.5 h-3.5" />
                        {m.name}
                      </Button>
                    ))}
                  </div>

                  {/* Textarea Area */}
                  <div className="flex flex-col flex-grow relative border border-border rounded-2xl overflow-hidden bg-background focus-within:ring-2 ring-indigo-500/20 transition-all group">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/30 backdrop-blur-md z-10">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("textInput")}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-indigo-500 hover:bg-indigo-500/10" onClick={handleCopy} disabled={!input}>
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
                      className="flex-grow min-h-[300px] sm:min-h-[400px] border-0 rounded-none bg-transparent font-mono text-sm leading-relaxed text-foreground p-6 focus-visible:ring-0 resize-none custom-scrollbar"
                      spellCheck={false}
                    />
                  </div>
                  
                  {/* Additional Coding Formats */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground/60 mr-2">{t("moreFormats")}</span>
                    {[
                      { name: t("modes.pascal"), mode: "pascal" },
                      { name: t("modes.capitalized"), mode: "capitalized" },
                      { name: t("modes.screaming_snake"), mode: "screaming_snake" },
                      { name: t("modes.train"), mode: "train" },
                      { name: t("modes.dot"), mode: "dot" },
                      { name: t("modes.path"), mode: "path" },
                      { name: t("modes.toggle"), mode: "toggle" }
                    ].map((m) => (
                      <Button 
                        key={m.mode}
                        variant="ghost"
                        size="sm"
                        className="h-7 px-3 rounded-lg font-bold text-[9px] uppercase tracking-wider text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors"
                        onClick={() => convert(m.mode)}
                      >
                        {m.name}
                      </Button>
                    ))}
                  </div>

                </div>
              </Card>
            </motion.div>

            {/* Trusted By / Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              {[
                { label: t("stats.privacy"), icon: ShieldCheck },
                { label: t("stats.instant"), icon: Zap },
                { label: t("stats.noUploads"), icon: Globe },
                { label: t("stats.devReady"), icon: Code2 }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-secondary/20 border border-border flex flex-col items-center gap-2">
                  <item.icon className="w-5 h-5 text-indigo-500" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Above Content Ad */}
            <div className="max-w-5xl mx-auto w-full px-6 py-12">
              <></>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full bg-secondary/10 border-y border-border backdrop-blur-3xl">
            <div className="max-w-5xl mx-auto px-6 py-24 space-y-24">
              
              {/* Free Online Case Converter Tool */}
              <section className="space-y-6 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight text-indigo-500">{t("content.mainTitle")}</h2>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                  {t("content.mainDesc1")}
                </p>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                  {t("content.mainDesc2")}
                </p>
              </section>

              {/* Supported Text Case Formats */}
              <section className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight">{t("content.formatsTitle")}</h2>
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-xs">{t("content.formatsSubtitle")}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-8 rounded-3xl bg-background/50 border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <Type className="w-5 h-5 text-indigo-500" />
                      </div>
                      <h3 className="text-lg font-bold tracking-tight">{t("content.standardTitle")}</h3>
                    </div>
                    <ul className="space-y-3">
                      {(Array.isArray(t.raw("content.standardList")) ? (t.raw("content.standardList") as string[]) : []).map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                  
                  <Card className="p-8 rounded-3xl bg-background/50 border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <Code2 className="w-5 h-5 text-indigo-500" />
                      </div>
                      <h3 className="text-lg font-bold tracking-tight">{t("content.devTitle")}</h3>
                    </div>
                    <ul className="space-y-3">
                      {(Array.isArray(t.raw("content.devList")) ? (t.raw("content.devList") as string[]) : []).map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-muted-foreground text-sm font-mono">
                          <CheckCircle2 className="w-4 h-4 text-indigo-500" />
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
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: t("content.feature1Title"), desc: t("content.feature1Desc"), icon: RefreshCw },
                    { title: t("content.feature2Title"), desc: t("content.feature2Desc"), icon: Code2 },
                    { title: t("content.feature3Title"), desc: t("content.feature3Desc"), icon: FileText },
                    { title: t("content.feature4Title"), desc: t("content.feature4Desc"), icon: ShieldCheck }
                  ].map((feature, i) => (
                    <Card key={i} className="p-6 rounded-3xl bg-background/50 border-border hover:border-indigo-500/30 transition-all group">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <feature.icon className="w-6 h-6 text-indigo-500" />
                      </div>
                      <h3 className="text-lg font-bold mb-3 tracking-tight">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </Card>
                  ))}
                </div>
              </section>

              {/* How to Convert */}
              <section className="space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold tracking-tight">{t("content.howTitle")}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { step: "1", title: t("content.step1"), desc: t("content.step1Desc") },
                    { step: "2", title: t("content.step2"), desc: t("content.step2Desc") },
                    { step: "3", title: t("content.step3"), desc: t("content.step3Desc") },
                    { step: "4", title: t("content.step4"), desc: t("content.step4Desc") }
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-secondary/20 border border-border">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 text-white font-bold text-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
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
