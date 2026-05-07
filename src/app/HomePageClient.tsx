"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Globe, ShieldAlert, Award, Verified, List, CloudOff,
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
  { label: "Formats Supported", value: "150+", icon: Layers, color: "text-blue-500 dark:text-blue-400" },
  { label: "Privacy Rating", value: "GOD-TIER", icon: Shield, color: "text-primary" },
  { label: "Processing", value: "LOCAL WASM", icon: Cpu, color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Data Sent", value: "0 BYTES", icon: Database, color: "text-orange-600 dark:text-orange-400" },
];

export default function HomePageClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
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
    if (ext === 'pdf' || ['docx', 'pptx', 'xlsx', 'csv', 'txt', 'json'].includes(ext || '')) return tools.filter(t => t.cat === 'Documents');
    if (type.startsWith('image/')) return tools.filter(t => t.cat === 'Creative');
    if (type.startsWith('video/')) return [tools.find(t => t.href === '/video')].filter(Boolean) as Tool[];
    return tools.slice(0, 3);
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
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[140px] rounded-full" />
          <div 
            className="absolute inset-0 opacity-[0.3] dark:opacity-[0.4] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--foreground-rgb, 0, 0, 0), 0.05) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} 
          />
        </div>

        <AnimatePresence>
          {dragActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-primary/20 backdrop-blur-xl flex items-center justify-center pointer-events-none"
            >
              <div className="p-8 rounded-3xl border-4 border-dashed border-primary/50 flex flex-col items-center gap-4 bg-card/80 backdrop-blur-2xl shadow-2xl">
                <div className="w-12 h-12 rounded-3xl bg-primary flex items-center justify-center shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)]">
                  <Upload className="w-12 h-12 text-foreground animate-bounce" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">Drop to Route</h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto px-4 pt-24 pb-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <div className="space-y-6">
              <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 bg-primary/5 text-[10px] font-black uppercase tracking-[0.3em] text-primary shadow-lg shadow-primary/10">
                Universal Engine · {tools.length} Tools Armed
              </Badge>
              <h1 className="text-2xl md:text-xl font-black tracking-tight leading-[0.9] uppercase italic">
                Privacy is <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary animate-gradient">
                  Not a Luxury.
                </span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed italic">
                The world's most powerful collection of 150+ file utilities. <br className="hidden md:block"/>
                Everything happens in your browser. No accounts. No servers. No limits.
              </p>
            </div>

            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-card/40 backdrop-blur-3xl border border-border rounded-xl p-2 pr-4 shadow-2xl focus-within:border-primary/50 transition-all">
                <div className="pl-4 text-primary"><Search className="w-6 h-6" /></div>
                <Input 
                  placeholder="Find a tool (e.g. 'HEIC to PDF', 'OCR')..." 
                  className="bg-transparent border-none focus-visible:ring-0 text-lg h-10 font-black uppercase italic"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {stats.map((s, i) => (
                <div key={i} className="p-5 rounded-xl bg-card/40 backdrop-blur-xl border border-border space-y-2 group transition-all hover:border-primary/30">
                  <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                    <s.icon className={`w-3.5 h-3.5 ${s.color}`} /> {s.label}
                  </div>
                  <div className={`text-base font-black tabular-nums ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8 relative z-10">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={cn("px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300", activeCategory === cat ? "bg-primary text-foreground shadow-lg shadow-primary/30" : "bg-card/40 text-muted-foreground/60 border border-border hover:bg-card/60 hover:text-foreground")}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 pb-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-6xl mx-auto" role="list">
            {filteredTools.map((tool, i) => (
              <div key={tool.title} role="listitem">
                <Link href={tool.href} aria-label={`Open ${tool.title}: ${tool.desc}`}>
                  <Card className="group h-full p-8 rounded-2xl bg-card/40 backdrop-blur-3xl border border-border hover:border-primary/30 transition-all duration-500 relative overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-primary/5">
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-start justify-between">
                        <div className={cn("w-10 h-10 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500", tool.color)}>
                          <tool.icon className="w-7 h-7 text-foreground" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="space-y-3">
                        <Badge variant="outline" className="text-[9px] uppercase font-black tracking-widest border-border bg-secondary/30 text-muted-foreground/60">{tool.cat}</Badge>
                        <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors uppercase text-foreground">{tool.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed font-medium italic">{tool.desc}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <section className="container mx-auto px-4 py-32 border-t border-border relative z-10">
          <div className="max-w-4xl mx-auto space-y-24">
            <div className="space-y-4 text-center">
              <Badge className="bg-primary/10 text-primary border-primary/20 py-2 px-6 rounded-full uppercase tracking-[0.3em] text-[10px] font-black">Private Advantage</Badge>
              <h2 className="text-xl md:text-2xl font-black tracking-tighter leading-none uppercase italic text-foreground">Why choose <br/> <span className="text-primary">Safe Computing?</span></h2>
              <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto leading-relaxed italic">Hardware performance meets data sovereignty. We process everything in your browser's RAM.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               {[
                 { icon: CloudOff, title: "Zero Server Uploads", desc: "Most 'online' tools upload your files. SafeTools uses WebAssembly to process files locally. No data ever leaves your machine." },
                 { icon: Zap, title: "Instant Processing", desc: "No upload/download wait times. Experience native performance right in your browser tab." },
                 { icon: Verified, title: "Verified Privacy", desc: "Open architecture. No tracking pixels, no analytics. Absolute data sovereignty by design." },
                 { icon: Award, title: "Pro Quality", desc: "High-performance engines like FFmpeg and PDF-lib running locally on your hardware." }
               ].map((item, i) => (
                 <div key={i} className="flex gap-3 items-start group">
                   <div className="w-10 h-10 rounded-2xl bg-secondary/50 border border-border flex items-center justify-center shrink-0 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                     <item.icon className="w-6 h-6 text-primary" />
                   </div>
                   <div className="space-y-3">
                     <h3 className="text-xl font-black uppercase tracking-tight text-foreground italic">{item.title}</h3>
                     <p className="text-muted-foreground font-medium italic leading-relaxed">{item.desc}</p>
                   </div>
                 </div>
               ))}
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
               <div className="text-center space-y-4">
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">Frequently Asked <span className="text-primary">Questions.</span></h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { q: "Is SafeTools really free?", a: "Yes. All our tools are free with no limits. We pass the savings of zero-server infrastructure directly to you." },
                    { q: "Do I need an account?", a: "Never. Just drop your file and go. We don't want your personal data." }
                  ].map((faq, i) => (
                    <div key={i} className="p-5 bg-card/40 backdrop-blur-xl border border-border rounded-2xl space-y-4 shadow-sm hover:border-primary/20 transition-colors">
                       <h4 className="font-black text-lg uppercase tracking-tight flex items-center gap-3 text-foreground italic">
                         <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px]">Q</div> {faq.q}
                       </h4>
                       <p className="text-muted-foreground font-medium leading-relaxed italic border-l-2 border-border pl-8">{faq.a}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Technical Directory - Long Tail Keyword SEO */}
            <div className="space-y-4 pt-6 border-t border-border">
               <div className="flex items-center gap-3">
                 <List className="w-5 h-5 text-primary" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 italic">Technical Utility Directory</h3>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/30">
                  {["HEIC to PDF", "WebP to JPG", "AVIF Compressor", "MP4 to GIF", "PDF to DOCX", "PDF to PPTX", "EXIF Cleaner", "AES Encryptor", "SVG Editor", "JSON Formatter", "Base64 Encoder", "QR Generator", "PNG to WebP", "JPG to SVG", "HEIC to PNG", "PDF Merger", "PDF Splitter", "Video Trimmer", "Audio Converter", "Frame Extractor"].map(tool => (
                    <div key={tool} className="hover:text-primary cursor-default transition-colors">· {tool}</div>
                  ))}
               </div>
            </div>
          </div>
        </section>

        <Dialog open={isRoutingOpen} onOpenChange={setIsRoutingOpen}>
          <DialogContent className="sm:max-w-xl bg-card border-border p-5 rounded-2xl shadow-2xl backdrop-blur-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black tracking-tighter uppercase text-center mb-4 text-foreground italic">Smart File Routing</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4">
              {getSuggestedTools(smartRoutingFile).map((tool) => (
                <Button key={tool.href} variant="outline" className="h-12 justify-start px-6 rounded-3xl border-border bg-secondary/30 hover:bg-secondary/50 group transition-all" onClick={() => router.push(tool.href)}>
                  <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mr-4 shadow-lg group-hover:scale-105 transition-transform", tool.color)}><tool.icon className="w-6 h-6 text-foreground" /></div>
                  <div className="text-left font-black uppercase tracking-tight text-base text-foreground italic">{tool.title}</div>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}

