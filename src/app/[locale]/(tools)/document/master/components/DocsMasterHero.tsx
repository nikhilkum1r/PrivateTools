"use client";

import React, { useState } from "react";
import {
  FileText, CheckCircle2, ShieldCheck, Zap, Globe, Lock,
  FileSpreadsheet, Presentation, Code2, BookOpen, FileImage,
  ChevronDown, ChevronUp, Star, Sparkles, Eye, Download
} from "lucide-react";
import { DropZone } from "@/components/shared/DropZone";
import { AdUnit } from "@/components/shared/AdUnit";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DocsMasterHeroProps {
  t: any;
  handleFileDrop: (files: File[]) => void;
}

const FORMAT_GROUPS = [
  {
    label: "Word Processing",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    icon: FileText,
    formats: ["DOCX", "DOC", "RTF", "ODT", "TXT", "MD"],
  },
  {
    label: "Spreadsheets",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: FileSpreadsheet,
    formats: ["XLSX", "XLS", "CSV", "ODS"],
  },
  {
    label: "Presentations",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
    icon: Presentation,
    formats: ["PPTX", "PPT", "ODP"],
  },
  {
    label: "Documents & Code",
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    icon: Code2,
    formats: ["PDF", "JSON", "XML", "HTML"],
  },
];

const FEATURES = [
  {
    icon: Lock,
    title: "Zero-Upload Privacy",
    desc: "Documents are processed 100% locally in your browser using WebAssembly. Your files never leave your device.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Zap,
    title: "Blazing Fast WASM Engine",
    desc: "Hardware-accelerated WebAssembly rendering for instant document parsing, even for large, complex files.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Eye,
    title: "High-Fidelity Preview",
    desc: "Pixel-perfect rendering for DOCX, XLSX tables, PPTX slides, and native PDF embedding with zoom controls.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: FileSpreadsheet,
    title: "Live Spreadsheet Editing",
    desc: "Edit XLSX and CSV cells directly in-browser and export the updated file without needing Microsoft Office.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Metadata Scrubbing",
    desc: "Strip author, editor history, and personal metadata from documents before sharing for maximum privacy.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: Download,
    title: "Extract & Export",
    desc: "Extract individual PDF pages, export edited spreadsheets, and download original files — all offline.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

const FAQ = [
  {
    q: "Is my document uploaded to a server?",
    a: "No. Docs Master Pro uses WebAssembly (WASM) engines to process everything locally in your browser's memory. Your files never leave your device — there are zero server uploads.",
  },
  {
    q: "Which file formats are supported?",
    a: "The tool supports DOCX, DOC, RTF, ODT, TXT, MD (Word), XLSX, XLS, CSV, ODS (Spreadsheets), PPTX, PPT, ODP (Presentations), PDF, JSON, XML, and HTML files.",
  },
  {
    q: "Can I edit documents directly in the browser?",
    a: "Yes! XLSX and CSV files can be edited cell-by-cell with a built-in spreadsheet editor. DOCX documents have a rich-text editing mode that lets you modify content and print or save.",
  },
  {
    q: "How does metadata scrubbing work?",
    a: "When you enable the 'Scrub Metadata' toggle, the tool replaces author names, creation timestamps, editor history, and other personal identifiers from the exported file.",
  },
  {
    q: "Can I extract specific pages from a PDF?",
    a: "Yes. Use the PDF Page Extractor in the sidebar to specify which page you want, and the tool will export a single-page PDF using the pdf-lib WASM engine.",
  },
  {
    q: "Does this work on mobile devices?",
    a: "Yes. Docs Master is fully responsive and works on modern Android and iOS browsers, though the spreadsheet editor is best experienced on a larger screen.",
  },
];

const STEPS = [
  { step: "01", title: "Drop Your File", desc: "Drag & drop or click to upload any supported document format." },
  { step: "02", title: "Instant Analysis", desc: "The WASM engine parses and renders your document with full fidelity." },
  { step: "03", title: "View, Edit & Export", desc: "Browse, search, edit cells, and export — all in-browser, all private." },
];

export function DocsMasterHero({ t, handleFileDrop }: DocsMasterHeroProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Parse arrays from JSON if they exist, otherwise use fallback
  const formatGroups = t.raw("landing.formats.groups") || FORMAT_GROUPS.map(g => g.label);
  const featureItems = t.raw("landing.features.items") || FEATURES;
  const howItWorksSteps = t.raw("landing.howItWorks.steps") || STEPS;
  const professionalUseCases = t.raw("landing.professional.useCases") || [];
  const professionalStats = t.raw("landing.professional.stats") || [];
  const faqItems = t.raw("landing.faq.items") || FAQ;

  return (
    <div className="flex-grow flex flex-col overflow-y-auto">
      {/* Top Banner Ad */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8">
        <></>
      </div>

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center px-6 py-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 max-w-5xl w-full"
        >
          {/* Badge */}
          <div className="flex justify-center gap-3 flex-wrap">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-4 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> {t("hero.badges.privacy")}
            </Badge>
            <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold px-4 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> {t("hero.badges.engine")}
            </Badge>
            <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold px-4 py-1.5 rounded-full">
              <Star className="w-3.5 h-3.5 mr-1.5" /> {t("hero.badges.formats")}
            </Badge>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-600 p-[1px] mx-auto shadow-2xl shadow-emerald-500/20">
              <div className="w-full h-full rounded-[calc(1.5rem-1px)] bg-card flex items-center justify-center border border-border">
                <BookOpen className="w-10 h-10 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none">
              {t.rich("hero.title", {
                highlight: (chunks: any) => <span className="text-emerald-400">{chunks}</span>
              })}
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Drop Zone */}
          <div className="max-w-2xl mx-auto w-full">
            <DropZone
              onFilesDrop={handleFileDrop}
              accept=".docx,.doc,.xlsx,.xls,.pptx,.ppt,.csv,.txt,.json,.xml,.html,.md,.rtf,.odt,.ods,.odp"
              multiple={false}
              className="h-52 border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 rounded-3xl hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all group"
            />
            <p className="mt-3 text-xs text-muted-foreground font-medium">
              {t("hero.dropzone")}
            </p>
          </div>

          {/* Format Chips */}
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {["PDF", "DOCX", "XLSX", "PPTX", "CSV", "JSON", "XML", "HTML", "TXT", "MD", "RTF", "ODT", "ODS", "ODP", "DOC", "XLS", "PPT"].map((fmt) => (
              <span
                key={fmt}
                className="px-3 py-1 rounded-full bg-secondary/60 border border-border text-xs font-bold tracking-wider text-muted-foreground hover:text-foreground hover:border-emerald-500/30 transition-colors"
              >
                .{fmt}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Format Groups ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-16">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">{t("landing.formats.title")}</h2>
          <p className="text-muted-foreground text-sm font-medium">{t("landing.formats.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FORMAT_GROUPS.map((group, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn("p-6 rounded-3xl border space-y-4", group.bg)}
            >
              <div className={cn("flex items-center gap-3", group.color)}>
                <group.icon className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {formatGroups[idx] || group.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.formats.map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded-md bg-background/60 text-[11px] font-bold border border-border">
                    .{f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── In-article Ad ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto w-full px-6 pb-16">
        <></>
      </div>

      {/* ─── Features Grid ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-20">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">{t("landing.features.title")}</h2>
          <p className="text-muted-foreground font-medium max-w-xl mx-auto">
            {t("landing.features.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="p-8 rounded-3xl bg-card/50 border border-border hover:border-emerald-500/30 transition-all group"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform", feat.bg)}>
                <feat.icon className={cn("w-6 h-6", feat.color)} />
              </div>
              <h3 className="text-base font-bold mb-2 tracking-tight">
                {featureItems[i]?.title || feat.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {featureItems[i]?.desc || feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-20">
        <div className="p-12 rounded-[3rem] bg-gradient-to-br from-emerald-500/5 to-blue-500/5 border border-emerald-500/10">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">{t("landing.howItWorks.title")}</h2>
            <p className="text-muted-foreground font-medium">{t("landing.howItWorks.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step: any, i: number) => (
              <div key={i} className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-500/20">
                  {`0${i + 1}`}
                </div>
                <h3 className="font-bold text-base">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Use Cases ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto w-full px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">{t("landing.professional.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("landing.professional.desc")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {(professionalUseCases.length > 0 ? professionalUseCases : [
                "Legal document review", "Financial spreadsheet analysis", "Academic paper reading",
                "Client presentation prep", "Code file inspection", "Data export & conversion",
                "Privacy-first archiving", "Secure metadata removal"
              ]).map((use: string, i: number) => (
                <div key={i} className="flex items-center gap-2.5 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {use}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(professionalStats.length > 0 ? professionalStats : [
              { icon: Globe, title: "Works Everywhere", desc: "Any modern browser, any OS, no install needed.", color: "text-blue-400" },
              { icon: Lock, title: "Data Stays Local", desc: "Zero-server WASM processing keeps files on-device.", color: "text-emerald-400" },
              { icon: Zap, title: "Instant Load", desc: "WASM engines spin up in milliseconds.", color: "text-yellow-400" },
              { icon: FileImage, title: "Rich Rendering", desc: "Images, tables, fonts — all faithfully reproduced.", color: "text-purple-400" },
            ]).map((item: any, i: number) => {
              const Icons = [Globe, Lock, Zap, FileImage];
              const Colors = ["text-blue-400", "text-emerald-400", "text-yellow-400", "text-purple-400"];
              const Icon = Icons[i % Icons.length];
              return (
                <div key={i} className="p-5 rounded-2xl bg-card/50 border border-border hover:border-border/80 transition-all">
                  <Icon className={cn("w-5 h-5 mb-3", Colors[i % Colors.length])} />
                  <p className="text-xs font-bold mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto w-full px-6 pb-20">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">{t("landing.faq.title")}</h2>
          <p className="text-muted-foreground text-sm font-medium">{t("landing.faq.subtitle")}</p>
        </div>
        <div className="space-y-3">
          {faqItems.map((item: any, i: number) => (
            <div
              key={i}
              className="border border-border rounded-2xl overflow-hidden bg-card/30 hover:border-emerald-500/20 transition-colors"
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm font-semibold">{item.q}</span>
                {openFaq === i
                  ? <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                }
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer Multiplex Ad ───────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto w-full px-6 pb-16">
        <></>
      </div>
    </div>
  );
}
