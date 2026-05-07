"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield, ImageIcon, FileText, Lock,
  Video, Music, QrCode,
  Zap, Terminal, Search,
  Cpu, Layers, ShieldCheck, Database,
  Sparkles, ArrowRight, Palette, Key,
  Eye, FileCode, Fingerprint, Upload,
  X, CheckCircle2, AlertCircle, FileQuestion, Edit3,
  Binary, FileSearch, Table, CaseSensitive,
  AlignLeft, Hash, BookOpen, Clock,
  Presentation, StickyNote, Trash, Unlock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const CATEGORIES = ["All", "Creative", "Documents", "Media", "Security", "Dev"] as const;
type Category = typeof CATEGORIES[number];

const HOMEPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://safetools.space/#organization",
      "name": "SafeTools",
      "url": "https://safetools.space",
      "logo": {
        "@type": "ImageObject",
        "url": "https://safetools.space/android-chrome-512x512.png"
      },
      "description": "SafeTools provides 150+ free, privacy-first browser-based file utilities for PDF, image, video, audio, and document editing.",
      "foundingDate": "2024",
      "sameAs": ["https://safetools.space"]
    },
    {
      "@type": "WebSite",
      "@id": "https://safetools.space/#website",
      "url": "https://safetools.space",
      "name": "SafeTools",
      "publisher": { "@id": "https://safetools.space/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://safetools.space/?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Are SafeTools completely free to use?",
          "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every tool on SafeTools is 100% free with no account required. There are no hidden fees, subscriptions, or usage limits." }
        },
        {
          "@type": "Question",
          "name": "Do my files get uploaded to a server?",
          "acceptedAnswer": { "@type": "Answer", "text": "No. All processing happens locally in your browser using WebAssembly (WASM) engines. Your files never leave your device and are never uploaded to any server." }
        },
        {
          "@type": "Question",
          "name": "What file formats does SafeTools support?",
          "acceptedAnswer": { "@type": "Answer", "text": "SafeTools supports 150+ formats including PDF, DOCX, PPTX, XLSX, HEIC, WebP, AVIF, SVG, MP4, MP3, WAV, and many more. Every tool specifies its supported formats clearly." }
        },
        {
          "@type": "Question",
          "name": "Is SafeTools safe for sensitive documents?",
          "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. Because all processing is done locally with no server uploads, your sensitive documents — medical records, financial files, legal contracts — are processed with complete privacy. The Secure Vault also offers AES-256 GCM client-side encryption." }
        },
        {
          "@type": "Question",
          "name": "Do I need to install any software?",
          "acceptedAnswer": { "@type": "Answer", "text": "No installation needed. SafeTools runs entirely in modern browsers like Chrome, Firefox, Safari, and Edge. No plugins, no extensions, no downloads required." }
        }
      ]
    }
  ]
};

interface Tool {
  title: string;
  desc: string;
  href: string;
  icon: any;
  color: string;
  cat: Category;
  tags: string[];
}

const tools: Tool[] = [
  {
    title: "Edit Images",
    desc: "Pro editor with OCR, filters, crop, and batch export.",
    href: "/image/editor",
    icon: ImageIcon,
    color: "from-blue-500 to-cyan-500",
    cat: "Creative",
    tags: ["crop", "resize", "filters", "ocr", "text", "editor", "photo", "batch"]
  },
  {
    title: "Extract Text from Image (OCR)",
    desc: "Extract text from images using neural recognition.",
    href: "/image/ocr",
    icon: FileSearch,
    color: "from-blue-400 to-indigo-500",
    cat: "Creative",
    tags: ["ocr", "image to text", "scan", "extract", "reading", "photo"]
  },
  {
    title: "Convert Image Format",
    desc: "Convert 150+ formats: HEIC, WebP, AVIF, RAW, PDF.",
    href: "/image/convert",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    cat: "Creative",
    tags: ["heic", "webp", "avif", "raw", "pdf", "jpg", "png", "svg", "convert", "transform"]
  },
  {
    title: "Compress Image (KB/MB)",
    desc: "Shrink any image up to 90% with target-size control.",
    href: "/image/compress",
    icon: Layers,
    color: "from-teal-500 to-green-500",
    cat: "Creative",
    tags: ["shrink", "optimize", "size", "kb", "mb", "compress", "quality", "tinify"]
  },
  {
    title: "Extract Colors from Image",
    desc: "Extract palettes, HEX, RGB, and HSL from any image.",
    href: "/image/colors",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    cat: "Creative",
    tags: ["palette", "hex", "rgb", "hsl", "picker", "extract", "design", "colors"]
  },
  {
    title: "Create App Icons & Favicons",
    desc: "Generate iOS, Android & PWA icon bundles instantly.",
    href: "/image/favicon",
    icon: FileCode,
    color: "from-indigo-500 to-purple-500",
    cat: "Dev",
    tags: ["favicon", "ios", "android", "pwa", "logo", "manifest", "assets", "mobile"]
  },
  {
    title: "PDF Merger",
    desc: "Combine multiple PDFs and images into one document.",
    href: "/pdf/merge",
    icon: FileText,
    color: "from-red-500 to-pink-500",
    cat: "Documents",
    tags: ["combine", "join", "pdf", "pages", "images", "merge"]
  },
  {
    title: "PDF Splitter",
    desc: "Extract specific pages or split into separate files.",
    href: "/pdf/split",
    icon: Layers,
    color: "from-orange-500 to-red-500",
    cat: "Documents",
    tags: ["extract", "pages", "split", "break", "separate", "pdf"]
  },
  {
    title: "Convert PDF to Word/PPT",
    desc: "Convert PDFs to PPTX, DOCX or images locally.",
    href: "/pdf/convert",
    icon: FileCode,
    color: "from-rose-500 to-red-500",
    cat: "Documents",
    tags: ["pptx", "docx", "word", "powerpoint", "images", "convert", "pdf"]
  },
  {
    title: "Unlock PDF",
    desc: "Remove password protection and security restrictions from PDFs.",
    href: "/pdf/unlock",
    icon: Unlock,
    color: "from-blue-600 to-indigo-700",
    cat: "Documents",
    tags: ["pdf", "unlock", "password", "security", "remove", "decryption"]
  },
  {
    title: "Lock PDF",
    desc: "Add strong password protection and encryption to your PDF files locally.",
    href: "/pdf/lock",
    icon: Lock,
    color: "from-indigo-600 to-blue-700",
    cat: "Documents",
    tags: ["pdf", "lock", "password", "security", "encryption", "protect"]
  },
  {
    title: "View & Edit Office Files",
    desc: "Universal viewer & editor for Office, PDF, and Data.",
    href: "/document/master",
    icon: Edit3,
    color: "from-emerald-500 to-cyan-500",
    cat: "Documents",
    tags: ["docx", "pptx", "xlsx", "csv", "pdf", "view", "edit", "office", "excel", "word"]
  },
  {
    title: "Case Converter",
    desc: "Transform text casing instantly with sentence, title, and dev modes.",
    href: "/document/text-tools/case-converter",
    icon: CaseSensitive,
    color: "from-blue-500 to-indigo-500",
    cat: "Documents",
    tags: ["text", "case", "converter", "upper", "lower", "camel", "snake", "title"]
  },
  {
    title: "Word Counter",
    desc: "Real-time character, word, and reading time analytics.",
    href: "/document/text-tools/word-counter",
    icon: AlignLeft,
    color: "from-teal-500 to-emerald-600",
    cat: "Documents",
    tags: ["text", "word", "count", "character", "length", "reading", "time"]
  },
  {
    title: "Compress & Convert Video",
    desc: "Compress and convert video with local WASM encoding.",
    href: "/video",
    icon: Video,
    color: "from-violet-500 to-purple-500",
    cat: "Media",
    tags: ["mp4", "mov", "webm", "compress", "video", "ffmpeg", "convert"]
  },
  {
    title: "Trim & Convert Audio",
    desc: "Trim, convert, and process audio files offline.",
    href: "/audio",
    icon: Music,
    color: "from-fuchsia-500 to-pink-500",
    cat: "Media",
    tags: ["mp3", "wav", "trim", "cut", "convert", "audio", "voice"]
  },
  {
    title: "Metadata & EXIF Remover",
    desc: "Strip EXIF and metadata from images and documents.",
    href: "/privacy/metadata",
    icon: ShieldCheck,
    color: "from-green-500 to-emerald-500",
    cat: "Security",
    tags: ["exif", "metadata", "gps", "location", "strip", "clean", "privacy", "secure"]
  },
  {
    title: "Encrypt & Decrypt Files",
    desc: "AES-256 GCM client-side file encryption. Zero-server.",
    href: "/privacy/vault",
    icon: Lock,
    color: "from-slate-600 to-gray-900",
    cat: "Security",
    tags: ["encrypt", "decrypt", "aes", "password", "lock", "secure", "privacy"]
  },
  {
    title: "Password Generator",
    desc: "Generate high-entropy, cryptographically secure passwords.",
    href: "/security",
    icon: Key,
    color: "from-blue-600 to-indigo-600",
    cat: "Security",
    tags: ["password", "generator", "random", "secure", "entropy", "key"]
  },
  {
    title: "Password Checker",
    desc: "Analyze password strength and vulnerability locally.",
    href: "/privacy/password-checker",
    icon: ShieldCheck,
    color: "from-emerald-500 to-green-600",
    cat: "Security",
    tags: ["password", "check", "strength", "secure", "privacy", "entropy", "leak"]
  },
  {
    title: "Hide Text inside Image",
    desc: "Hide secret messages invisibly inside images.",
    href: "/steganography",
    icon: Eye,
    color: "from-gray-500 to-slate-700",
    cat: "Security",
    tags: ["hidden", "secret", "message", "lsb", "stego", "privacy", "hide"]
  },
  {
    title: "Create & Scan QR Codes",
    desc: "Generate and scan QR codes with custom styling.",
    href: "/qr",
    icon: QrCode,
    color: "from-sky-500 to-blue-500",
    cat: "Dev",
    tags: ["qrcode", "scan", "generate", "link", "wifi", "contact"]
  },
  {
    title: "Developer Utilities",
    desc: "JSON formatter, Base64, hash generators and more.",
    href: "/devtools",
    icon: Terminal,
    color: "from-green-600 to-teal-600",
    cat: "Dev",
    tags: ["json", "base64", "hash", "md5", "sha256", "format", "developer"]
  },
  {
    title: "JSON & CSV Converter",
    desc: "Convert JSON to CSV and back with zero-server privacy.",
    href: "/devtools/data-converter",
    icon: Table,
    color: "from-orange-400 to-red-500",
    cat: "Dev",
    tags: ["json", "csv", "convert", "table", "data", "transform", "excel"]
  },
  {
    title: "Base64 Encoder & Decoder",
    desc: "Encode and decode text and images with zero-server privacy.",
    href: "/devtools/base64",
    icon: Binary,
    color: "from-blue-600 to-indigo-700",
    cat: "Dev",
    tags: ["base64", "encode", "decode", "binary", "image", "string", "developer"]
  },
  {
    title: "Image to PPTX",
    desc: "Transform images into professional PowerPoint presentations.",
    href: "/image/to-pptx",
    icon: Presentation,
    color: "from-orange-600 to-red-600",
    cat: "Creative",
    tags: ["pptx", "powerpoint", "slides", "presentation", "image", "convert"]
  },
  {
    title: "Word to PDF",
    desc: "Convert DOCX manuscripts to professional PDF documents.",
    href: "/document/word-to-pdf",
    icon: FileText,
    color: "from-blue-600 to-indigo-600",
    cat: "Documents",
    tags: ["word", "pdf", "docx", "convert", "document"]
  },
  {
    title: "PDF to Text",
    desc: "Extract text layers and character matrices from any PDF.",
    href: "/document/pdf-to-txt",
    icon: FileSearch,
    color: "from-teal-600 to-cyan-600",
    cat: "Documents",
    tags: ["pdf", "text", "extract", "ocr", "txt", "convert"]
  },
  {
    title: "Secret Self-Destruct Note",
    desc: "Create encrypted, self-destructing notes locally.",
    href: "/privacy/secure-note",
    icon: StickyNote,
    color: "from-yellow-500 to-amber-600",
    cat: "Security",
    tags: ["note", "encrypt", "secure", "private", "self-destruct"]
  },
  {
    title: "Permanently Delete Files",
    desc: "Permanently wipe sensitive files from memory.",
    href: "/privacy/shredder",
    icon: Trash,
    color: "from-red-600 to-rose-700",
    cat: "Security",
    tags: ["shred", "delete", "wipe", "secure", "privacy", "file"]
  },
];

const stats = [
  { label: "Formats Supported", value: "150+", icon: Layers, color: "text-blue-400" },
  { label: "Privacy Rating", value: "GOD-TIER", icon: Shield, color: "text-primary" },
  { label: "Processing", value: "LOCAL WASM", icon: Cpu, color: "text-emerald-400" },
  { label: "Data Sent", value: "0 BYTES", icon: Database, color: "text-orange-400" },
];

export default function HomeClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Smart Routing State
  const [dragActive, setDragActive] = useState(false);
  const [smartRoutingFile, setSmartRoutingFile] = useState<File | null>(null);
  const [smartRoutingPreview, setSmartRoutingPreview] = useState<string | null>(null);
  const [isRoutingOpen, setIsRoutingOpen] = useState(false);

  useEffect(() => {
    if (smartRoutingFile && smartRoutingFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(smartRoutingFile);
      setSmartRoutingPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setSmartRoutingPreview(null);
    }
  }, [smartRoutingFile]);

  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const searchTerm = search.toLowerCase().trim();
      const matchSearch = searchTerm === "" ||
        t.title.toLowerCase().includes(searchTerm) ||
        t.desc.toLowerCase().includes(searchTerm) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchTerm));

      const matchCat = activeCategory === "All" || t.cat === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSmartRoutingFile(e.dataTransfer.files[0]);
      setIsRoutingOpen(true);
    }
  };

  const getSuggestedTools = (file: File | null) => {
    if (!file) return [];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const type = file.type;

    if (ext === 'pdf' || ['docx', 'pptx', 'xlsx', 'csv', 'txt', 'json'].includes(ext || '')) {
      return tools.filter(t => t.cat === 'Documents' || t.tags.includes('docx') || t.tags.includes('pdf'));
    }
    if (type.startsWith('image/') || ['heic', 'webp', 'avif', 'svg'].includes(ext || '')) {
      return tools.filter(t => t.cat === 'Creative' || t.tags.includes('image'));
    }
    if (type.startsWith('video/')) {
      return [tools.find(t => t.href === '/video')].filter(Boolean) as Tool[];
    }
    if (type.startsWith('audio/')) {
      return [tools.find(t => t.href === '/audio')].filter(Boolean) as Tool[];
    }
    return tools.slice(0, 3); // Fallback
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary selection:text-foreground"
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <Navbar />

      <main className="flex-grow relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full" />
          <div
            className="absolute inset-0 [mask-image:linear-gradient(180deg,var(--background),transparent)]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 0.05, transparent 0)`,
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        {/* Global Drag Overlay */}
        <AnimatePresence>
          {dragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-primary/20 backdrop-blur-xl flex items-center justify-center pointer-events-none"
            >
              <div className="p-8 rounded-3xl border-4 border-dashed border-primary/50 flex flex-col items-center gap-4 bg-card/90">
                <div className="w-12 h-12 rounded-3xl bg-primary flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)]">
                  <Upload className="w-12 h-12 text-foreground animate-bounce" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Drop to Route</h2>
                  <p className="text-xl font-medium opacity-60">We'll find the perfect tool for your file</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-24 pb-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >

              </motion.div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Privacy is <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary animate-gradient">
                  Not a Luxury.
                </span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                The world's most powerful collection of 150+ file utilities.
                Everything happens in your browser. No accounts. No servers. No limits.
              </p>
            </motion.div>



            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  whileHover={{ scale: 1.04, borderColor: "var(--primary)" }}
                  className="p-5 rounded-xl bg-secondary/50 border border-border space-y-2 cursor-default group transition-all"
                >
                  <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                    <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                    {s.label}
                  </div>
                  <div className={`text-base font-black tabular-nums ${s.color}`}>{s.value}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="container mx-auto px-4 pb-8 relative z-10">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                  activeCategory === cat
                    ? "bg-primary text-foreground shadow-lg shadow-primary/30"
                    : "bg-secondary text-muted-foreground border border-border hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="container mx-auto px-4 pb-8 relative z-10">
          <div className="max-w-6xl mx-auto mb-10">
            <h2 className="text-2xl md:text-xl font-black tracking-tight text-center">
              Browse <span className="text-primary">150+ Free Tools</span> — No Account Needed
            </h2>
            <p className="text-center text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
              Convert, compress, encrypt, and edit any file type — entirely offline in your browser.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            <AnimatePresence mode="popLayout">
              {filteredTools.map((tool, i) => (
                <motion.div
                  key={tool.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Link href={tool.href}>
                    <Card className={cn(
                      "group h-full p-7 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 relative overflow-hidden cursor-pointer shadow-sm",
                      hoveredIndex === i && "translate-y-[-8px] shadow-2xl shadow-primary/20"
                    )}>
                      {/* Animated shine on hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-[0.04]", tool.color)} />
                      </div>
                      {/* Shine sweep */}
                      <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent skew-x-12 group-hover:left-full transition-all duration-700 ease-in-out pointer-events-none" />

                      <div className="relative z-10 space-y-5">
                        <div className="flex items-start justify-between">
                          <div className={cn(
                            "w-10 h-10 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500",
                            tool.color
                          )}>
                            <tool.icon className="w-7 h-7 text-foreground" />
                          </div>
                          <ArrowRight className="w-4 h-4 text-primary opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest border-border bg-secondary/50">
                              {tool.cat}
                            </Badge>
                            {tool.cat === "Security" && (
                              <Badge className="text-[8px] uppercase font-black tracking-widest bg-emerald-500/10 text-emerald-500 border-emerald-500/20 border">
                                E2E
                              </Badge>
                            )}
                            {tool.cat === "Media" && (
                              <Badge className="text-[8px] uppercase font-black tracking-widest bg-violet-500/10 text-violet-400 border-violet-500/20 border">
                                WASM
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors duration-300">{tool.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                            {tool.desc}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-20 space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary border border-dashed border-border flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-muted-foreground/30" />
            </div>
              <div>
                <p className="text-xl font-bold">No results for "{search}"</p>
                <p className="text-muted-foreground mt-1">Try formats like 'PNG' or actions like 'Compress'</p>
              </div>
              <Button variant="outline" onClick={() => { setSearch(""); setActiveCategory("All"); }} className="rounded-full">
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 pb-24 relative z-10" aria-label="Frequently Asked Questions">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-xl font-black tracking-tight text-center mb-3">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-center text-muted-foreground text-sm mb-12">
              Everything you need to know about SafeTools and how it keeps your files private.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HOMEPAGE_SCHEMA["@graph"][2].mainEntity?.map((faq: any, i: number) => {
                const q = faq.name;
                const a = faq.acceptedAnswer.text;
                return (
                  <div key={i} className="p-6 rounded-2xl bg-secondary/50 border border-border hover:border-primary/20 transition-all group">
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors mb-2">{q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Smart Routing Dialog */}
        <Dialog open={isRoutingOpen} onOpenChange={setIsRoutingOpen}>
          <DialogContent className="sm:max-w-xl bg-background border-border p-0 overflow-hidden rounded-2xl">
            <div className="relative p-5 space-y-5">
              <div className="absolute top-0 right-0 p-5 opacity-5 rotate-12 scale-150">
                <Shield className="w-32 h-32" />
              </div>

              <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                {smartRoutingPreview ? (
                  <div className="w-32 h-32 rounded-xl border-4 border-border overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 mb-2">
                    <img src={smartRoutingPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center mb-2">
                    <FileQuestion className="w-10 h-10 text-primary" />
                  </div>
                )}
                <Badge className="bg-primary/10 text-primary border-primary/20">Smart File Routing</Badge>
                <DialogTitle className="text-xl font-black tracking-tight uppercase">Analyze & Process</DialogTitle>
                <p className="text-muted-foreground text-sm font-medium">
                  We've detected <span className="text-foreground font-bold">{smartRoutingFile?.name}</span>. <br />
                  What would you like to do with it?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 relative z-10">
                {getSuggestedTools(smartRoutingFile).map((tool) => (
                  <Button
                    key={tool.href}
                    variant="outline"
                    className="h-12 justify-start px-6 rounded-3xl border-border bg-secondary/50 hover:bg-secondary hover:border-primary/30 transition-all group"
                    onClick={() => {
                      // Note: In a real app, we'd pass the file to the tool's store here
                      router.push(tool.href);
                    }}
                  >
                    <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 mr-4 group-hover:scale-110 transition-transform", tool.color)}>
                      <tool.icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-base">{tool.title}</div>
                      <div className="text-xs text-muted-foreground font-medium">{tool.desc}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                ))}
              </div>

              <div className="text-center pt-4 opacity-40">
                <p className="text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Local Processing • Privacy Secured
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>


      </main>

      <Footer />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOMEPAGE_SCHEMA) }}
      />
    </div>
  );
}
