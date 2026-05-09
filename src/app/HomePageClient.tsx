"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
   Presentation, StickyNote, Trash, Unlock,
   Monitor, Smartphone, WifiOff, MousePointer2,
   Check, Info, ChevronDown, Rocket, Users,
   UploadCloud, Download, ScanText, Heart, History, Command
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { TrustLayer } from "@/components/shared/TrustLayer";
import { WhySafeTools } from "@/components/shared/WhySafeTools";
import { LocalProcessingGuide } from "@/components/shared/LocalProcessingGuide";
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
      title: "AI Background Remover",
      desc: "Remove image backgrounds instantly in-browser using local neural engines.",
      href: "/image/remove-background",
      icon: Sparkles,
      color: "from-emerald-500 to-teal-500",
      cat: "Creative",
      tags: ["background", "remover", "ai", "transparent", "image", "edit"]
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
      title: "Image to PPTX",
      desc: "Transform images into professional PowerPoint presentations.",
      href: "/image/to-pptx",
      icon: Presentation,
      color: "from-orange-600 to-red-600",
      cat: "Creative",
      tags: ["pptx", "powerpoint", "slides", "presentation", "image", "convert"]
   },
   {
      title: "App Icon & Favicon Studio",
      desc: "Generate professional iOS, Android, and PWA icon bundles instantly.",
      href: "/image/icons",
      icon: FileCode,
      color: "from-indigo-500 to-purple-500",
      cat: "Dev",
      tags: ["favicon", "ios", "android", "pwa", "logo", "manifest", "assets", "mobile", "icons"]
   },
   {
      title: "PDF Merger",
      desc: "Combine multiple PDFs and images into one document.",
      href: "/pdf/merge-pdf",
      icon: FileText,
      color: "from-red-500 to-pink-500",
      cat: "Documents",
      tags: ["combine", "join", "pdf", "pages", "images", "merge"]
   },
   {
      title: "PDF Splitter",
      desc: "Extract specific pages or split into separate files.",
      href: "/pdf/split-pdf",
      icon: Layers,
      color: "from-orange-500 to-red-500",
      cat: "Documents",
      tags: ["extract", "pages", "split", "break", "separate", "pdf"]
   },
   {
      title: "Compress PDF",
      desc: "Shrink PDF files locally without losing visual quality.",
      href: "/pdf/compress-pdf",
      icon: Zap,
      color: "from-orange-600 to-amber-500",
      cat: "Documents",
      tags: ["pdf", "compress", "shrink", "optimize", "size", "linearize"]
   },
   {
      title: "Unlock PDF",
      desc: "Remove password protection and security restrictions from PDFs.",
      href: "/pdf/unlock-pdf",
      icon: Unlock,
      color: "from-blue-600 to-indigo-700",
      cat: "Documents",
      tags: ["pdf", "unlock", "password", "security", "remove", "decryption"]
   },
   {
      title: "Protect PDF",
      desc: "Add strong password protection and encryption to your PDF files locally.",
      href: "/pdf/protect-pdf",
      icon: Lock,
      color: "from-indigo-600 to-blue-700",
      cat: "Documents",
      tags: ["pdf", "lock", "password", "security", "encryption", "protect"]
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
      title: "Metadata Cleaner",
      desc: "Remove hidden data, EXIF, and GPS tracking locally.",
      href: "/security/metadata-cleaner",
      icon: ShieldCheck,
      color: "from-green-500 to-emerald-500",
      cat: "Security",
      tags: ["exif", "metadata", "gps", "location", "strip", "clean", "privacy", "secure"]
   },
   {
      title: "Secure Vault (AES-256)",
      desc: "AES-256 GCM client-side file encryption. Zero-server.",
      href: "/security/vault",
      icon: Lock,
      color: "from-slate-600 to-gray-900",
      cat: "Security",
      tags: ["encrypt", "decrypt", "aes", "password", "lock", "secure", "privacy"]
   },
   {
      title: "Password Generator",
      desc: "Generate high-entropy, cryptographically secure passwords.",
      href: "/privacy/password-generator",
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
      title: "Secure Notes",
      desc: "Create encrypted, self-destructing notes locally.",
      href: "/privacy/secure-notes",
      icon: StickyNote,
      color: "from-yellow-500 to-amber-600",
      cat: "Security",
      tags: ["note", "encrypt", "secure", "private", "self-destruct"]
   },
   {
      title: "File Shredder",
      desc: "Permanently wipe sensitive files from memory.",
      href: "/security/file-shredder",
      icon: Trash,
      color: "from-red-600 to-rose-700",
      cat: "Security",
      tags: ["shred", "delete", "wipe", "secure", "privacy", "file"]
   },
   {
      title: "Hide Text inside Image",
      desc: "Hide secret messages invisibly inside images.",
      href: "/security/steganography",
      icon: Eye,
      color: "from-gray-500 to-slate-700",
      cat: "Security",
      tags: ["hidden", "secret", "message", "lsb", "stego", "privacy", "hide"]
   },
   {
      title: "QR Code Generator",
      desc: "Generate and scan QR codes with custom styling.",
      href: "/tools/qr-generator",
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
   }
];

export default function HomePageClient() {
   const router = useRouter();
   const [search, setSearch] = useState("");
   const [activeCategory, setActiveCategory] = useState<Category>("All");

   const [dragActive, setDragActive] = useState(false);
   const [smartRoutingFile, setSmartRoutingFile] = useState<File | null>(null);
   const [isRoutingOpen, setIsRoutingOpen] = useState(false);

   // --- BIG UPGRADE: COMMAND PALETTE & RETENTION ---
   const [isCommandOpen, setIsCommandOpen] = useState(false);
   const [commandSearch, setCommandSearch] = useState("");
   const [favorites, setFavorites] = useState<string[]>([]);
   const [recentTools, setRecentTools] = useState<string[]>([]);

   useEffect(() => {
      // Load retention data
      const savedFavs = localStorage.getItem("safetools-favs");
      const savedRecent = localStorage.getItem("safetools-recent");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
      if (savedRecent) setRecentTools(JSON.parse(savedRecent));

      // Keyboard shortcut for Command Palette
      const handleKeyDown = (e: KeyboardEvent) => {
         if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            setIsCommandOpen(prev => !prev);
         }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, []);

   const toggleFavorite = (href: string) => {
      const newFavs = favorites.includes(href)
         ? favorites.filter(f => f !== href)
         : [...favorites, href];
      setFavorites(newFavs);
      localStorage.setItem("safetools-favs", JSON.stringify(newFavs));
   };

   const trackUsage = (href: string) => {
      const newRecent = [href, ...recentTools.filter(t => t !== href)].slice(0, 4);
      setRecentTools(newRecent);
      localStorage.setItem("safetools-recent", JSON.stringify(newRecent));
   };

   const filteredCommandTools = useMemo(() => {
      if (!commandSearch) return tools.slice(0, 10);
      return tools.filter(t =>
         t.title.toLowerCase().includes(commandSearch.toLowerCase()) ||
         t.tags.some(tag => tag.toLowerCase().includes(commandSearch.toLowerCase()))
      ).slice(0, 10);
   }, [commandSearch, tools]);

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
         className="flex flex-col min-h-screen bg-background text-foreground relative"
         onDragEnter={handleDrag}
         onDragOver={handleDrag}
         onDragLeave={handleDrag}
         onDrop={handleDrop}
      >
         <Navbar />

         <main className="flex-grow relative z-10">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-12 pb-32 lg:pt-16 lg:pb-48 mesh-gradient bg-transparent">
               {/* FULL HERO BACKGROUND IMAGE */}
               <div className="absolute inset-0 z-0">
                  <div
                     className="absolute inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-30 dark:opacity-40"
                     style={{ backgroundAttachment: 'fixed' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

                  {/* Glowing Secure Nodes */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                     <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 blur-[140px] rounded-full"
                     />
                     <motion.div
                        animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.15, 0.05] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/20 blur-[140px] rounded-full"
                     />
                  </div>
               </div>

               <div className="container mx-auto px-6 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                     <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:col-span-7 space-y-8 text-left"
                     >
                        <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 bg-primary/5 text-xs font-black uppercase tracking-[0.2em] text-primary">
                           150+ Privacy-First Online File Tools
                        </Badge>
                        <h1 className="text-[clamp(3rem,8vw,5.5rem)] font-black tracking-[-0.04em] leading-[1] text-foreground font-heading">
                           Powerful File Tools Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-blue-600 dark:from-primary dark:to-blue-400">Privacy & Speed</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
                           Convert, compress, edit, and optimize JPG, PNG, WEBP, SVG, AVIF, HEIC, GIF, and many more modern image formats securely with zero uploads.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                           <Link href="/tools">
                              <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase italic tracking-widest text-sm shadow-xl shadow-primary/20 group">
                                 Explore 150+ Tools <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              </Button>
                           </Link>
                        </div>

                        <div className="pt-8">
                           <TrustLayer />
                        </div>

                        {/* BIG UPGRADE: RETENTION BAR (Recently Used & Favorites) */}
                        <AnimatePresence>
                           {(favorites.length > 0 || recentTools.length > 0) && (
                              <motion.div
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 className="pt-12 flex flex-wrap items-center gap-8 border-t border-border/50"
                              >
                                 {recentTools.length > 0 && (
                                    <div className="flex items-center gap-4">
                                       <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 italic">
                                          <Clock className="w-3 h-3" /> Recent
                                       </div>
                                       <div className="flex gap-2">
                                          {recentTools.map(href => {
                                             const tool = tools.find(t => t.href === href);
                                             if (!tool) return null;
                                             return (
                                                <Link key={href} href={href} className="px-3 py-1.5 rounded-lg glass-card border border-border hover:border-primary/30 transition-all flex items-center gap-2 group">
                                                   <div className={cn("w-5 h-5 rounded bg-gradient-to-br flex items-center justify-center text-foreground text-[8px]", tool.color)}>
                                                      <tool.icon className="w-2.5 h-2.5" />
                                                   </div>
                                                   <span className="text-[10px] font-black uppercase italic font-heading group-hover:text-primary transition-colors">{tool.title}</span>
                                                </Link>
                                             );
                                          })}
                                       </div>
                                    </div>
                                 )}

                                 {favorites.length > 0 && (
                                    <div className="flex items-center gap-4">
                                       <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 italic">
                                          <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> Favorites
                                       </div>
                                       <div className="flex gap-2">
                                          {favorites.map(href => {
                                             const tool = tools.find(t => t.href === href);
                                             if (!tool) return null;
                                             return (
                                                <Link key={href} href={href} className="px-3 py-1.5 rounded-lg glass-card border border-border hover:border-primary/30 transition-all flex items-center gap-2 group">
                                                   <div className={cn("w-5 h-5 rounded bg-gradient-to-br flex items-center justify-center text-foreground text-[8px]", tool.color)}>
                                                      <tool.icon className="w-2.5 h-2.5" />
                                                   </div>
                                                   <span className="text-[10px] font-black uppercase italic font-heading group-hover:text-primary transition-colors">{tool.title}</span>
                                                </Link>
                                             );
                                          })}
                                       </div>
                                    </div>
                                 )}
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </motion.div>

                     {/* PREMIUM 3D ENGINE VISUAL */}
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="lg:col-span-5 relative hidden lg:block"
                     >
                        <div className="relative group">
                           {/* Background Glows */}
                           <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full opacity-50 animate-pulse" />
                           <div className="absolute -inset-10 bg-blue-500/10 blur-[120px] rounded-full opacity-30 animate-pulse delay-700" />

                           {/* Main Image with Glass Container */}
                           <div className="relative rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-4 shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                              <Image
                                 src="/hero-engine.png"
                                 alt="SafeTools Futuristic Privacy Engine"
                                 width={600}
                                 height={600}
                                 className="rounded-[32px] object-cover shadow-2xl brightness-110 contrast-110"
                                 priority
                              />
                              {/* Scanning Line Effect */}
                              <motion.div
                                 animate={{ top: ["0%", "100%", "0%"] }}
                                 transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                 className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent z-10 pointer-events-none"
                              />
                           </div>

                           {/* Floating Tech Badges */}
                           <motion.div
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="absolute -top-6 -right-6 px-6 py-3 rounded-2xl bg-background/80 backdrop-blur-xl border border-primary/20 shadow-xl z-20 flex items-center gap-3"
                           >
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[10px] font-black uppercase tracking-widest italic">Engine v2.0 Live</span>
                           </motion.div>

                           <motion.div
                              animate={{ y: [0, 10, 0] }}
                              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                              className="absolute -bottom-8 -left-8 px-6 py-3 rounded-2xl bg-background/80 backdrop-blur-xl border border-blue-500/20 shadow-xl z-20 flex items-center gap-3"
                           >
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="text-[10px] font-black uppercase tracking-widest italic">100% Local Processing</span>
                           </motion.div>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* TRUST BAR */}
            <section className="py-12 border-b border-border glass-card/30 backdrop-blur-3xl relative z-20">
               <div className="container mx-auto px-6">
                  <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                     {[
                        { name: "GDPR Compliant", desc: "No data collection" },
                        { name: "AES-256 GCM", desc: "Military-grade encryption" },
                        { name: "Sandboxed", desc: "Isolated browser execution" },
                        { name: "WASM Native", desc: "Zero-latency performance" },
                        { name: "Open Core", desc: "Transparent processing" }
                     ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                           <div className="text-xl font-black uppercase tracking-tighter italic font-heading">{item.name}</div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">{item.desc}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* TECHNICAL INFRASTRUCTURE SECTION */}
            <section className="py-24 relative overflow-hidden">
               <div className="container mx-auto px-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                     {[
                        {
                           icon: Cpu,
                           title: "WebAssembly Engine",
                           desc: "High-performance processing logic running natively in your browser. No server overhead."
                        },
                        {
                           icon: ShieldCheck,
                           title: "Zero-Knowledge Architecture",
                           desc: "Your data is never decrypted or viewed by any third party. Pure local compute."
                        },
                        {
                           icon: Zap,
                           title: "Instant Processing",
                           desc: "Eliminate upload and download wait times. Process GBs of data in seconds."
                        }
                     ].map((item, i) => (
                        <motion.div
                           key={i}
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: i * 0.1 }}
                           className="p-8 rounded-[32px] glass-card border border-border/50 hover:border-primary/30 transition-all group"
                        >
                           <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                              <item.icon className="w-7 h-7 text-primary" />
                           </div>
                           <h3 className="text-xl font-black uppercase italic tracking-tight mb-4 font-heading">{item.title}</h3>
                           <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* BENTO GRID FEATURES */}
            <section className="py-32 bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm">
               <div className="container mx-auto px-6">
                  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[700px]">
                     {/* Large Feature 1 */}
                     <div className="md:col-span-2 md:row-span-2 p-10 rounded-[40px] glass-card border border-border/50 flex flex-col justify-between group hover:border-primary/40 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000 text-primary">
                           <ShieldCheck className="w-64 h-64" />
                        </div>
                        <div className="space-y-6 relative z-10 text-left">
                           <Badge className="bg-primary/10 text-primary border-primary/20 py-1 px-4 text-[10px] font-black uppercase tracking-widest">Core Privacy</Badge>
                           <h3 className="text-4xl font-black uppercase italic font-heading">Zero-Knowledge <br /> Architecture</h3>
                           <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-md">Our "local-first" philosophy ensures your files are never uploaded, scanned, or stored on any remote server. Your privacy is mathematically guaranteed by the architecture itself.</p>
                        </div>
                        <div className="pt-8 text-left">
                           <div className="flex gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-muted/40 backdrop-blur-sm flex items-center justify-center text-primary"><Lock className="w-6 h-6" /></div>
                              <div className="w-12 h-12 rounded-2xl bg-muted/40 backdrop-blur-sm flex items-center justify-center text-primary"><Fingerprint className="w-6 h-6" /></div>
                              <div className="w-12 h-12 rounded-2xl bg-muted/40 backdrop-blur-sm flex items-center justify-center text-primary"><Shield className="w-6 h-6" /></div>
                           </div>
                        </div>
                     </div>

                     {/* Medium Feature 1 */}
                     <div className="md:col-span-2 p-10 rounded-[40px] glass-card border border-border/50 flex flex-col justify-between group hover:border-primary/40 transition-all relative overflow-hidden text-left">
                        <div className="absolute -bottom-10 -right-10 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform text-primary">
                           <Zap className="w-48 h-48" />
                        </div>
                        <div className="space-y-4">
                           <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 py-1 px-4 text-[10px] font-black uppercase tracking-widest">Performance</Badge>
                           <h3 className="text-3xl font-black uppercase italic font-heading">Sub-Second Latency</h3>
                           <p className="text-muted-foreground font-medium text-sm leading-relaxed">By eliminating the upload/download cycle, SafeTools delivers near-instant processing even for large files.</p>
                        </div>
                     </div>

                     {/* Small Feature 1 */}
                     <div className="p-8 rounded-[40px] glass-card border border-border/50 flex flex-col gap-4 group hover:border-primary/40 transition-all text-left">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Monitor className="w-6 h-6" /></div>
                        <h3 className="text-xl font-black uppercase italic font-heading leading-tight">Cross <br /> Platform</h3>
                        <p className="text-muted-foreground text-xs font-medium">Desktop, Mobile, Tablet. Perfect sync across all your devices.</p>
                     </div>

                     {/* Small Feature 2 */}
                     <div className="p-8 rounded-[40px] glass-card border border-border/50 flex flex-col gap-4 group hover:border-primary/40 transition-all text-left">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><WifiOff className="w-6 h-6" /></div>
                        <h3 className="text-xl font-black uppercase italic font-heading leading-tight">Offline <br /> First</h3>
                        <p className="text-muted-foreground text-xs font-medium">Load once, use forever. No internet required for most tools.</p>
                     </div>
                  </div>
               </div>
            </section>

            <WhySafeTools />

            <LocalProcessingGuide />

            {/* MODERN WORKFLOW SECTION */}
            <section className="py-32 bg-secondary/80 backdrop-blur-sm relative">
               <div className="container mx-auto px-6">
                  <div className="flex flex-col lg:flex-row items-center gap-20 max-w-6xl mx-auto">
                     <div className="flex-1 space-y-8">
                        <h2 className="text-5xl font-black tracking-tighter uppercase italic font-heading">Designed for <br /> <span className="text-primary">Professional Workflows</span></h2>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                           SafeTools isn't just a collection of utilities. It's a professional workspace designed for speed and privacy.
                        </p>
                        <div className="space-y-6">
                           {[
                              { title: "Batch Processing", desc: "Handle hundreds of files simultaneously without breaking a sweat." },
                              { title: "Smart File Routing", desc: "Drop any file and we'll automatically suggest the best tools." },
                              { title: "Offline Capabilities", desc: "Work from anywhere, even without an active internet connection." }
                           ].map((item, i) => (
                              <div key={i} className="flex gap-4">
                                 <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                 </div>
                                 <div>
                                    <div className="font-black uppercase tracking-tight italic font-heading">{item.title}</div>
                                    <div className="text-muted-foreground text-sm font-medium">{item.desc}</div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="flex-1 w-full max-w-xl">
                        <div className="relative aspect-video rounded-3xl border border-border/50 overflow-hidden shadow-2xl group">
                           <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <motion.div
                                 animate={{ scale: [1, 1.05, 1] }}
                                 transition={{ duration: 4, repeat: Infinity }}
                                 className="p-8 rounded-full bg-primary/10 backdrop-blur-xl border border-primary/30"
                              >
                                 <Zap className="w-12 h-12 text-primary" />
                              </motion.div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* SEARCH & FILTER SECTION */}
            <section id="tools" className="py-24 bg-secondary/80 backdrop-blur-sm border-y border-border">
               <div className="container mx-auto px-6">
                  <div className="max-w-4xl mx-auto text-center space-y-8">
                     <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-[-0.03em] leading-[1.1] uppercase italic font-heading">Find Your <span className="text-primary">Tool</span></h2>

                     <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center glass-card border border-border rounded-2xl p-2 pr-4 shadow-xl">
                           <div className="pl-6 text-muted-foreground"><Search className="w-6 h-6" /></div>
                           <Input
                              placeholder="Search 150+ tools (e.g. 'HEIC to PNG', 'PDF Merge')..."
                              className="bg-transparent border-none focus-visible:ring-0 text-xl h-16 font-medium"
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                           />
                           <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-secondary/80 backdrop-blur-sm rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                              <Command className="w-3 h-3" /> K
                           </div>
                        </div>
                     </div>

                     {/* BIG UPGRADE: PRIVACY COMMAND CENTER (Live Feed) */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                        <div className="md:col-span-2 p-8 rounded-[32px] glass-card/40 backdrop-blur-3xl border border-border/50 text-left space-y-6 relative overflow-hidden group">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                 <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Privacy Engine v2.0 // Live Feed</div>
                              </div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-primary italic font-heading">Security Verified</div>
                           </div>
                           <div className="space-y-3 font-mono text-[11px] leading-relaxed opacity-80">
                              <div className="flex gap-4">
                                 <span className="text-primary/40 shrink-0">[10:31:02]</span>
                                 <span>Initializing WASM Security Sandbox... <span className="text-emerald-500">READY</span></span>
                              </div>
                              <div className="flex gap-4">
                                 <span className="text-primary/40 shrink-0">[10:31:05]</span>
                                 <span>Network Request Intercepted: <span className="text-red-500">BLOCKED</span> (Local-Only Mode Enabled)</span>
                              </div>
                              <div className="flex gap-4">
                                 <span className="text-primary/40 shrink-0">[10:31:08]</span>
                                 <span>Allocating Buffer: 256MB Secure Client-Side Memory... <span className="text-emerald-500">SUCCESS</span></span>
                              </div>
                              <div className="flex gap-4">
                                 <span className="text-primary/40 shrink-0">[10:31:12]</span>
                                 <span>AES-256 GCM Key Rotation Complete. Listening for local file events...</span>
                              </div>
                           </div>
                           <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                              <Cpu className="w-64 h-64" />
                           </div>
                        </div>
                        <div className="p-8 rounded-[32px] bg-primary text-primary-foreground space-y-6 flex flex-col justify-between text-left relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                              <ShieldCheck className="w-32 h-32" />
                           </div>
                           <div className="space-y-4">
                              <div className="text-3xl font-black uppercase italic font-heading tracking-tighter leading-none">Your Data Is <br /> Sovereign</div>
                              <p className="text-xs font-medium opacity-80 leading-relaxed">Unlike cloud-based tools, SafeTools operates entirely within your browser's private sandbox. We don't just protect your data; we never see it.</p>
                           </div>
                           <Button variant="outline" className="w-full bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground font-black uppercase tracking-widest text-[10px] rounded-2xl">Verify Architecture</Button>
                        </div>
                     </div>

                     <div className="flex flex-wrap items-center justify-center gap-2">
                        {CATEGORIES.map((cat) => (
                           <motion.button
                              key={cat}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setActiveCategory(cat)}
                              className={cn(
                                 "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                 activeCategory === cat ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "glass-card text-muted-foreground border border-border hover:bg-secondary/80 backdrop-blur-sm"
                              )}
                           >
                              {activeCategory === cat && <Sparkles className="w-3.5 h-3.5 animate-pulse" />}
                              {cat}
                           </motion.button>
                        ))}
                     </div>

                     <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12"
                     >
                        {filteredTools.map((tool, i) => (
                           <motion.div
                              key={tool.title}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 }}
                           >
                              <Card className="group h-full p-8 rounded-[32px] glass-card border-border hover:border-primary/40 transition-all hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)] relative overflow-hidden text-left">
                                 <button
                                    onClick={(e) => {
                                       e.preventDefault();
                                       e.stopPropagation();
                                       toggleFavorite(tool.href);
                                    }}
                                    className="absolute top-8 right-8 z-20 w-10 h-10 rounded-xl bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/50 flex items-center justify-center hover:bg-pink-500/10 hover:text-pink-500 transition-all"
                                 >
                                    <Heart className={cn("w-5 h-5 transition-all", favorites.includes(tool.href) ? "fill-pink-500 text-pink-500" : "text-muted-foreground")} />
                                 </button>

                                 <Link href={tool.href} onClick={() => trackUsage(tool.href)}>
                                    <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg", tool.color)}>
                                       <tool.icon className="w-7 h-7 text-foreground" />
                                    </div>
                                    <div className="space-y-4">
                                       <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/50 border-border/50">{tool.cat}</Badge>
                                          {tool.cat === "Security" && (
                                             <Badge className="text-[9px] uppercase font-black tracking-widest bg-emerald-500/10 text-emerald-500 border-emerald-500/20 border">E2E</Badge>
                                          )}
                                          {tool.cat === "Media" && (
                                             <Badge className="text-[9px] uppercase font-black tracking-widest bg-violet-500/10 text-violet-400 border-violet-500/20 border">WASM</Badge>
                                          )}
                                       </div>
                                       <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors font-heading italic">{tool.title}</h3>
                                       <p className="text-muted-foreground font-medium leading-relaxed">{tool.desc}</p>
                                    </div>
                                    <div className="pt-6 mt-6 border-t border-border/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                       <span className="text-[10px] font-black uppercase tracking-widest text-primary">Open Tool</span>
                                       <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                                    </div>
                                 </Link>
                              </Card>
                           </motion.div>
                        ))}
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* FEATURED CATEGORIES SECTION */}
            <section id="features" className="py-32">
               <div className="container mx-auto px-6">
                  <div className="text-center space-y-4 mb-20">
                     <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Everything You Need in One <span className="text-primary">Secure Platform</span></h2>
                     <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Professional-grade utilities across five core categories.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {[
                        {
                           title: "Image Tools",
                           desc: "Professional image processing tools optimized for speed and privacy.",
                           icon: ImageIcon,
                           items: ["PNG to JPG", "WebP Converter", "AVIF Converter", "Background Remover", "AI Image Enhancement", "Batch Compression", "Metadata Removal"]
                        },
                        {
                           title: "PDF Tools",
                           desc: "Powerful PDF utilities without compromising sensitive documents.",
                           icon: FileText,
                           items: ["Merge PDF", "Split PDF", "Compress PDF", "Unlock PDF", "OCR Processing", "Convert PDF to Word", "Digital Signature"]
                        },
                        {
                           title: "Universal File Conversion",
                           desc: "Convert files across multiple formats instantly.",
                           icon: Layers,
                           items: ["DOCX Converter", "EPUB Tools", "ZIP & Archive", "Spreadsheet Tools", "Video Transcoder", "Audio Toolkit", "Universal Viewer"]
                        },
                        {
                           title: "Privacy & Security",
                           desc: "Built for users who care about digital security.",
                           icon: Shield,
                           items: ["File Encryption", "Metadata Cleaner", "QR Code Generator", "Hash Generator", "Secure File Sharing", "Password Protection", "Base64 Suite"]
                        },
                        {
                           title: "Developer Utilities",
                           desc: "Fast, sandboxed tools for modern development workflows.",
                           icon: Terminal,
                           items: ["JSON Formatter", "JWT Decoder", "Base64 Suite", "Regex Tester", "SQL Formatter", "Color Studio", "Cron Generator", "CSV to JSON", "Unit Converter"]
                        }
                     ].map((cat, i) => (
                        <Card key={i} className="p-8 rounded-3xl glass-card/40 backdrop-blur-3xl border-border hover:border-primary/30 transition-all flex flex-col h-full">
                           <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                              <cat.icon className="w-8 h-8 text-primary" />
                           </div>
                           <h3 className="text-2xl font-black uppercase mb-4">{cat.title}</h3>
                           <p className="text-muted-foreground mb-8 text-sm leading-relaxed">{cat.desc}</p>
                           <ul className="space-y-3 mt-auto">
                              {cat.items.map((item, j) => (
                                 <li key={j} className="flex items-center gap-3 text-sm font-bold text-foreground/80">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {item}
                                 </li>
                              ))}
                           </ul>
                        </Card>
                     ))}
                  </div>
               </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section className="py-24 bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm border-y border-border relative overflow-hidden">
               <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
                  <Zap className="w-64 h-64" />
               </div>
               <div className="container mx-auto px-6">
                  <div className="max-w-4xl mx-auto text-center space-y-4 mb-20">
                     <Badge className="bg-primary/10 text-primary border-primary/20 py-2 px-6 rounded-full uppercase tracking-widest text-[10px] font-black">Simple Process</Badge>
                     <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading">How It <span className="text-primary">Works</span></h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                     {[
                        { step: "01", title: "Drop Your File", desc: "Select any file from your device. Our system instantly detects the file type without uploading.", icon: UploadCloud },
                        { step: "02", title: "Local Processing", desc: "Advanced WebAssembly engines process your file directly inside your browser sandbox.", icon: Cpu },
                        { step: "03", title: "Secure Result", desc: "Download your processed file instantly. Pure, private, and 100% local.", icon: Download }
                     ].map((item, i) => (
                        <div key={i} className="relative group p-10 rounded-[40px] glass-card border border-border/50 hover:border-primary/40 transition-all shadow-xl">
                           <div className="absolute -top-6 -left-6 w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black italic text-2xl shadow-xl rotate-[-12deg] group-hover:rotate-0 transition-transform">{item.step}</div>
                           <div className="space-y-4 pt-4">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4"><item.icon className="w-6 h-6" /></div>
                              <h3 className="text-2xl font-black uppercase italic font-heading">{item.title}</h3>
                              <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* PERFORMANCE STATS BANNER */}
            <section className="py-16 bg-primary text-primary-foreground overflow-hidden relative">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--color-primary-rgb),0.1),transparent_70%)]" />
               <div className="container mx-auto px-6 relative z-10">
                  <div className="flex flex-col md:flex-row items-center justify-around gap-12 text-center">
                     <div className="space-y-1">
                        <div className="text-6xl font-black italic tracking-tighter font-heading">0ms</div>
                        <div className="text-xs font-black uppercase tracking-widest opacity-60">Server Latency</div>
                     </div>
                     <div className="space-y-1">
                        <div className="text-6xl font-black italic tracking-tighter font-heading">100%</div>
                        <div className="text-xs font-black uppercase tracking-widest opacity-60">Local Processing</div>
                     </div>
                     <div className="space-y-1">
                        <div className="text-6xl font-black italic tracking-tighter font-heading">150+</div>
                        <div className="text-xs font-black uppercase tracking-widest opacity-60">Secure Tools</div>
                     </div>
                     <div className="space-y-1">
                        <div className="text-6xl font-black italic tracking-tighter font-heading">∞</div>
                        <div className="text-xs font-black uppercase tracking-widest opacity-60">Usage Freedom</div>
                     </div>
                  </div>
               </div>
            </section>

            {/* BIG UPGRADE: PRIVACY ENGINE HEARTBEAT */}
            <section className="py-32 relative overflow-hidden glass-card/30 border-y border-border">
               <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,var(--glow-secondary),transparent_70%)]" />
               <div className="container mx-auto px-6 relative z-10">
                  <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                     <div className="flex-1 space-y-10">
                        <div className="space-y-6">
                           <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6 rounded-full uppercase tracking-widest text-[10px] font-black">System Status: Active</Badge>
                           <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic font-heading leading-[0.85]">Engineered for <br /> <span className="text-emerald-600 dark:text-emerald-500">Absolute Privacy</span></h2>
                           <p className="text-xl text-muted-foreground font-medium leading-relaxed italic">The SafeTools Privacy Engine runs 100% locally. No data packets ever leave your device's memory buffer.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                           {[
                              { label: "Data Transmission", val: "0.00%", icon: WifiOff },
                              { label: "Local Encryption", val: "AES-256", icon: Lock },
                              { label: "Worker Status", val: "Sandboxed", icon: Terminal },
                              { label: "Cloud Dependency", val: "None", icon: CloudOff }
                           ].map((stat, i) => (
                              <div key={i} className="space-y-2">
                                 <div className="flex items-center gap-2 text-emerald-500">
                                    <stat.icon className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                                 </div>
                                 <div className="text-3xl font-black italic tracking-tighter font-heading">{stat.val}</div>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="flex-1 relative">
                        <div className="aspect-square rounded-[60px] border border-border/50 bg-background/50 backdrop-blur-3xl flex items-center justify-center relative group overflow-hidden">
                           {/* Pulse Animation */}
                           <motion.div
                              animate={{
                                 scale: [1, 1.1, 1],
                                 opacity: [0.3, 0.6, 0.3]
                              }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute inset-0 bg-emerald-500/5 rounded-full blur-3xl"
                           />
                           <div className="relative z-10 flex flex-col items-center gap-6">
                              <div className="w-40 h-40 rounded-[40px] bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 relative overflow-hidden">
                                 <motion.div
                                    animate={{ y: [-100, 100] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent w-full h-20"
                                 />
                                 <ShieldCheck className="w-20 h-20 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                              </div>
                              <div className="text-center">
                                 <div className="text-2xl font-black uppercase tracking-tighter italic font-heading">Secure Node Active</div>
                                 <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/60 flex items-center justify-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    WASM Engine Heartbeat
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* PRIVACY SECTION */}
            <section id="privacy" className="py-32 bg-primary text-primary-foreground overflow-hidden relative">
               <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-foreground/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />

               <div className="container mx-auto px-6 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div className="space-y-8">
                        <Badge className="bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 py-2 px-6 rounded-full uppercase tracking-widest text-[10px] font-black">Privacy First</Badge>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase italic">Your Files Stay on <br /> <span className="opacity-60">Your Device</span></h2>
                        <p className="text-xl opacity-90 leading-relaxed font-medium">
                           Most online tools upload your files to remote servers where your data can be stored, analyzed, and monetized. SafeTools works differently.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                           {[
                              "Files never leave your device",
                              "No cloud uploads required",
                              "No server-side processing",
                              "No hidden scanning systems",
                              "No AI training on your data",
                              "No invasive tracking"
                           ].map((item, i) => (
                              <div key={i} className="flex items-center gap-3 font-bold text-lg">
                                 <CheckCircle2 className="w-6 h-6 shrink-0" />
                                 {item}
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="bg-primary-foreground/5 backdrop-blur-3xl p-12 rounded-[40px] border border-primary-foreground/10 space-y-6">
                        <h3 className="text-2xl font-black uppercase tracking-tight">The Foundation</h3>
                        <p className="text-lg opacity-80 leading-relaxed italic">
                           Every supported operation runs locally inside your browser using secure client-side technologies. Your privacy is not a feature — it is the foundation of the platform.
                        </p>
                        <div className="pt-8 flex items-center gap-4">
                           <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center"><Verified className="w-10 h-10" /></div>
                           <div>
                              <div className="text-sm font-black uppercase tracking-widest">Sovereign Computing</div>
                              <div className="text-xs opacity-60">Verified Browser Isolation</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* PERFORMANCE SECTION */}
            <section className="py-32 bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/5 backdrop-blur-sm">
               <div className="container mx-auto px-6">
                  <div className="text-center space-y-4 mb-20">
                     <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-xs font-black uppercase tracking-[0.2em] text-primary">Performance</Badge>
                     <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">Engineered for <span className="text-primary">Extreme Speed</span></h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                     {[
                        { icon: Zap, title: "Lightweight Architecture", desc: "Optimized bundles reduce loading times dramatically." },
                        { icon: Globe, title: "Low Bandwidth Friendly", desc: "Designed to work smoothly even on weak internet connections." },
                        { icon: Smartphone, title: "Mobile Optimized", desc: "Responsive design with touch-friendly interactions." },
                        { icon: Database, title: "Smart Browser Caching", desc: "Faster repeat visits with intelligent asset caching." },
                        { icon: Cpu, title: "WebAssembly Processing", desc: "High-performance local execution directly in the browser." },
                        { icon: Rocket, title: "PWA Support", desc: "Install SafeTools like a native application." }
                     ].map((advantage, i) => (
                        <div key={i} className="p-8 glass-card border border-border rounded-3xl space-y-4 hover:border-primary/30 transition-all group">
                           <div className="w-12 h-12 rounded-xl bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                              <advantage.icon className="w-6 h-6 text-primary" />
                           </div>
                           <h3 className="text-xl font-black uppercase">{advantage.title}</h3>
                           <p className="text-muted-foreground text-sm leading-relaxed">{advantage.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* WHY SAFETOOLS SECTION (COMPARISON TABLE) */}
            <section className="py-32 bg-background/50 backdrop-blur-sm">
               <div className="container mx-auto px-6">
                  <div className="max-w-4xl mx-auto">
                     <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">Why Future Users Will <span className="text-primary">Choose Us</span></h2>
                     </div>

                     <div className="overflow-hidden rounded-[32px] border border-border glass-card shadow-2xl">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/50 border-b border-border">
                                 <th className="p-8 text-sm font-black uppercase tracking-widest text-muted-foreground">Feature</th>
                                 <th className="p-8 text-sm font-black uppercase tracking-widest text-primary text-center">SafeTools</th>
                                 <th className="p-8 text-sm font-black uppercase tracking-widest text-muted-foreground text-center">Traditional Tools</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-border">
                              {[
                                 { feature: "Local Browser Processing", safe: true, trad: false },
                                 { feature: "Upload-Free Workflow", safe: true, trad: false },
                                 { feature: "Privacy Focused", safe: true, trad: false },
                                 { feature: "Offline Support", safe: true, trad: false },
                                 { feature: "Fast on Slow Networks", safe: true, trad: "warn" },
                                 { feature: "Minimal Data Collection", safe: true, trad: false },
                                 { feature: "Lightweight Performance", safe: true, trad: "warn" },
                                 { feature: "Cross Platform", safe: true, trad: true },
                                 { feature: "Modern Security Standards", safe: true, trad: "warn" }
                              ].map((row, i) => (
                                 <tr key={i} className="hover:bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/30 transition-colors">
                                    <td className="p-8 font-bold text-foreground italic">{row.feature}</td>
                                    <td className="p-8 text-center"><Check className="mx-auto w-6 h-6 text-emerald-500" /></td>
                                    <td className="p-8 text-center">
                                       {row.trad === true ? <Check className="mx-auto w-6 h-6 text-emerald-500" /> :
                                          row.trad === false ? <X className="mx-auto w-6 h-6 text-rose-500" /> :
                                             <AlertCircle className="mx-auto w-6 h-6 text-amber-500" />}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </section>

            {/* SECURITY SECTION */}
            <section className="py-32 bg-foreground text-background relative overflow-hidden">
               <div className="absolute inset-0 z-0 opacity-20">
                  <div className="absolute top-0 left-0 w-full h-full opacity-100" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(var(--background-rgb), 0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[160px] rounded-full" />
               </div>

               <div className="container mx-auto px-6 relative z-10">
                  <div className="max-w-5xl mx-auto">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                           <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase italic">Built with Modern <br /> <span className="text-primary">Security Standards</span></h2>
                           <p className="text-xl text-background/70 leading-relaxed font-medium">
                              SafeTools is designed using secure modern web technologies to ensure safe and reliable browser-based processing.
                           </p>
                           <div className="space-y-4 pt-4">
                              {[
                                 "HTTPS Everywhere",
                                 "Strict Content Security Policies",
                                 "Browser Isolation Support",
                                 "Secure Local Processing",
                                 "Permission Transparency",
                                 "Sandboxed Execution",
                                 "Privacy-Focused Architecture"
                              ].map((item, i) => (
                                 <div key={i} className="flex items-center gap-3 font-bold text-lg">
                                    <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                                    {item}
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="relative">
                           <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
                           <div className="relative bg-background/5 border border-background/10 p-12 rounded-[48px] backdrop-blur-3xl shadow-2xl space-y-8">
                              <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40"><Shield className="w-10 h-10" /></div>
                              <div className="space-y-4">
                                 <h3 className="text-3xl font-black uppercase tracking-tighter italic">Zero Trust Arch</h3>
                                 <p className="text-lg text-background/60 leading-relaxed">
                                    We don't trust our own servers because we don't have any. Your browser is the secure sandbox.
                                 </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="p-4 rounded-2xl bg-background/5 border border-background/5 text-center">
                                    <div className="text-2xl font-black text-primary">AES-256</div>
                                    <div className="text-[10px] uppercase font-black tracking-widest text-background/40">Encryption</div>
                                 </div>
                                 <div className="p-4 rounded-2xl bg-background/5 border border-background/5 text-center">
                                    <div className="text-2xl font-black text-primary">TLS 1.3</div>
                                    <div className="text-[10px] uppercase font-black tracking-widest text-background/40">Protocol</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* BIG UPGRADE: TECHNOLOGY MARQUEE */}
            <section className="py-24 glass-card/50 border-y border-border overflow-hidden">
               <div className="container mx-auto px-6 mb-12">
                  <div className="text-center space-y-4">
                     <Badge className="bg-primary/10 text-primary border-primary/20 py-2 px-6 rounded-full uppercase tracking-widest text-[10px] font-black italic">Open-Source Engines</Badge>
                     <h2 className="text-4xl font-black tracking-tighter uppercase italic font-heading">Powered by <span className="text-primary">Next-Gen Tech</span></h2>
                  </div>
               </div>
               <div className="flex gap-12 animate-marquee whitespace-nowrap py-4">
                  {[
                     { name: "Transformers.js", desc: "Local AI Models" },
                     { name: "FFmpeg.wasm", desc: "Video Processing" },
                     { name: "Sharp.js", desc: "Image Engine" },
                     { name: "PDF.js", desc: "Document Rendering" },
                     { name: "WebAssembly", desc: "Native Performance" },
                     { name: "React 19", desc: "Modern UI" },
                     { name: "Tailwind 4", desc: "Design System" },
                     { name: "Tesseract.js", desc: "OCR Processing" }
                  ].map((tech, i) => (
                     <div key={i} className="inline-flex items-center gap-4 px-10 py-6 rounded-[32px] bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/30 border border-border/50">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black italic shadow-lg">{tech.name[0]}</div>
                        <div>
                           <div className="font-black uppercase tracking-tight italic font-heading text-lg">{tech.name}</div>
                           <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{tech.desc}</div>
                        </div>
                     </div>
                  ))}
                  {/* Duplicate for infinite loop */}
                  {[
                     { name: "Transformers.js", desc: "Local AI Models" },
                     { name: "FFmpeg.wasm", desc: "Video Processing" },
                     { name: "Sharp.js", desc: "Image Engine" },
                     { name: "PDF.js", desc: "Document Rendering" },
                     { name: "WebAssembly", desc: "Native Performance" },
                     { name: "React 19", desc: "Modern UI" },
                     { name: "Tailwind 4", desc: "Design System" },
                     { name: "Tesseract.js", desc: "OCR Processing" }
                  ].map((tech, i) => (
                     <div key={i} className="inline-flex items-center gap-4 px-10 py-6 rounded-[32px] bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/30 border border-border/50">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black italic shadow-lg">{tech.name[0]}</div>
                        <div>
                           <div className="font-black uppercase tracking-tight italic font-heading text-lg">{tech.name}</div>
                           <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{tech.desc}</div>
                        </div>
                     </div>
                  ))}
               </div>
            </section>


            {/* FAQ SECTION */}
            <section id="faq" className="py-40 relative">
               <div className="container mx-auto px-6">
                  <div className="max-w-4xl mx-auto space-y-20">
                     <div className="text-center space-y-6">
                        <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-black tracking-widest text-[10px]">Support</Badge>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading">Common <span className="text-primary">Inquiries</span></h2>
                     </div>

                     <div className="grid grid-cols-1 gap-6">
                        {[
                           { q: "Are my files uploaded to servers?", a: "No. Supported tools process files locally inside your browser using WebAssembly. Your data never leaves your device." },
                           { q: "Does SafeTools collect personal data?", a: "SafeTools is designed with minimal data collection principles. We don't use accounts or tracking pixels." },
                           { q: "Can I use SafeTools on mobile devices?", a: "Yes. SafeTools works perfectly across desktop, mobile, and tablets." },
                           { q: "Does SafeTools work offline?", a: "Many tools continue functioning after initial loading as the logic is stored in your browser." },
                           { q: "Is SafeTools free?", a: "Most tools are available for free with optional advanced features planned for the future." },
                           { q: "Is registration required?", a: "No account is required for core functionality. Just drop your file and start working." }
                        ].map((faq, i) => (
                           <div key={i} className="p-10 glass-card/50 backdrop-blur-xl border border-border/50 rounded-[40px] space-y-4 hover:border-primary/20 transition-all group">
                              <h4 className="text-2xl font-black uppercase tracking-tight flex items-center gap-6 italic font-heading">
                                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-sm shrink-0 shadow-lg group-hover:scale-110 transition-transform">Q</div>
                                 {faq.q}
                              </h4>
                              <p className="text-muted-foreground font-medium leading-relaxed text-lg pl-18 opacity-80 group-hover:opacity-100 transition-opacity">
                                 {faq.a}
                              </p>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </section>

            {/* FEATURE COMPARISON SECTION */}
            <section className="py-32 bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/5 border-y border-border">
               <div className="container mx-auto px-6">
                  <div className="max-w-4xl mx-auto text-center space-y-8 mb-20">
                     <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading">Why Choose <span className="text-primary">SafeTools</span></h2>
                     <p className="text-muted-foreground font-medium">See how we stack up against traditional cloud converters.</p>
                  </div>

                  <div className="max-w-5xl mx-auto overflow-hidden rounded-[40px] border border-border glass-card shadow-2xl">
                     <div className="grid grid-cols-3 bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/50 p-8 border-b border-border font-black uppercase tracking-widest text-xs">
                        <div>Feature</div>
                        <div className="text-primary">SafeTools</div>
                        <div className="opacity-40">Cloud Tools</div>
                     </div>
                     {[
                        { f: "Local Browser Processing", s: true, c: false },
                        { f: "Zero File Uploads", s: true, c: false },
                        { f: "Offline Functionality", s: true, c: false },
                        { f: "Sub-Second Latency", s: true, c: false },
                        { f: "Privacy Sovereignty", s: true, c: false },
                        { f: "Unlimited File Sizes", s: true, c: false },
                        { f: "Advanced AI Enhancement", s: "Soon", c: "Cloud" }
                     ].map((row, i) => (
                        <div key={i} className="grid grid-cols-3 p-8 border-b border-border/50 items-center hover:bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/20 transition-colors">
                           <div className="font-bold text-sm">{row.f}</div>
                           <div>
                              {row.s === true ? <CheckCircle2 className="text-emerald-500 w-6 h-6" /> : <Badge variant="outline" className="text-[8px] uppercase">{row.s}</Badge>}
                           </div>
                           <div>
                              {row.c === false ? <X className="text-red-500/40 w-6 h-6" /> : <span className="text-xs font-medium opacity-40">{row.c}</span>}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* BIG UPGRADE: THE MANIFESTO */}
            <section className="py-40 relative">
               <div className="container mx-auto px-6">
                  <div className="max-w-4xl mx-auto text-center space-y-12">
                     <Badge className="bg-primary/10 text-primary border-primary/20 py-2 px-6 rounded-full uppercase tracking-widest text-[10px] font-black italic">The Manifesto</Badge>
                     <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic font-heading leading-[0.8]">Privacy is not a <br /> <span className="text-primary">Feature.</span></h2>
                     <p className="text-2xl md:text-4xl font-medium tracking-tight leading-tight opacity-80 italic max-w-4xl mx-auto">It is a fundamental human right, encoded into every line of the SafeTools architecture.</p>
                  </div>
               </div>
            </section>

            {/* BIG UPGRADE: SAFETOOLS DESKTOP EXPERIENCE */}
            <section className="py-40 glass-card border-y border-border relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--glow-secondary),transparent_60%)]" />
               <div className="container mx-auto px-6 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
                     <div className="space-y-10 order-2 lg:order-1">
                        <div className="space-y-6">
                           <Badge className="bg-primary/10 text-primary border-primary/20 py-2 px-6 rounded-full uppercase tracking-widest text-[10px] font-black italic">Platform Expansion</Badge>
                           <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic font-heading leading-[0.85]">SafeTools <br /> <span className="text-primary">Everywhere</span></h2>
                           <p className="text-xl text-muted-foreground font-medium leading-relaxed italic">The ultimate privacy suite, now moving beyond the browser. Native power with local-first DNA.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                           <div className="space-y-4">
                              <div className="w-12 h-12 rounded-2xl bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm flex items-center justify-center text-primary shadow-xl"><Monitor className="w-6 h-6" /></div>
                              <div className="font-black uppercase tracking-tight italic font-heading text-lg">Desktop App</div>
                              <p className="text-xs text-muted-foreground font-medium leading-relaxed">Native performance for Windows, macOS, and Linux. No internet required. Forever.</p>
                           </div>
                           <div className="space-y-4">
                              <div className="w-12 h-12 rounded-2xl bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm flex items-center justify-center text-primary shadow-xl"><Smartphone className="w-6 h-6" /></div>
                              <div className="font-black uppercase tracking-tight italic font-heading text-lg">Mobile Studio</div>
                              <p className="text-xs text-muted-foreground font-medium leading-relaxed">Pro-grade file tools in your pocket. Optimized for mobile silicon and zero-latency.</p>
                           </div>
                        </div>

                        <div className="pt-6">
                           <Button size="lg" className="h-16 px-10 rounded-[20px] bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-xs italic group">
                              Join Desktop Waitlist <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                           </Button>
                        </div>
                     </div>

                     <div className="relative order-1 lg:order-2">
                        <div className="relative z-10 aspect-[4/3] rounded-[48px] border-[12px] border-secondary bg-background shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden group">
                           <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10" />
                           <div className="p-8 h-full flex flex-col gap-6">
                              <div className="flex items-center justify-between border-b border-border/50 pb-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg"><Shield className="w-5 h-5" /></div>
                                    <div className="font-black uppercase tracking-tighter italic font-heading text-sm">SafeTools Desktop</div>
                                 </div>
                                 <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                                 </div>
                              </div>
                              <div className="flex-1 grid grid-cols-3 gap-4">
                                 {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="rounded-2xl border border-border/50 glass-card p-4 flex flex-col gap-3 group-hover:border-primary/30 transition-all">
                                       <div className="w-8 h-8 rounded-lg bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm" />
                                       <div className="h-2 w-12 bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm rounded-full" />
                                       <div className="h-1.5 w-8 bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/50 rounded-full" />
                                    </div>
                                 ))}
                              </div>
                              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <div className="text-[10px] font-black uppercase tracking-widest text-primary">Native Engine Active</div>
                                 </div>
                                 <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Build 0.4.1</div>
                              </div>
                           </div>
                        </div>
                        <div className="absolute -inset-10 bg-primary/20 blur-[100px] rounded-full opacity-50 z-0" />
                     </div>
                  </div>
               </div>
            </section>

            {/* USE CASES SECTION */}
            <section className="py-32 relative">
               <div className="container mx-auto px-6">
                  <div className="flex flex-col lg:flex-row gap-20 items-center max-w-6xl mx-auto">
                     <div className="flex-1 space-y-8">
                        <h2 className="text-5xl font-black tracking-tighter uppercase italic font-heading">Designed for <br /> <span className="text-primary">Everyone</span></h2>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed">Whether you're a developer handling sensitive code or a student organizing assignments, SafeTools provides the power you need.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           {[
                              { title: "Developers", desc: "JSON formatting, JWT decoding, and base64 utilities in one fast workspace.", icon: Terminal },
                              { title: "Designers", desc: "Batch compress images and remove backgrounds without losing quality.", icon: Palette },
                              { title: "Students", desc: "Organize PDFs, convert documents, and optimize files for submission.", icon: BookOpen },
                              { title: "Businesses", desc: "Handle sensitive client data with 100% local, secure processing.", icon: ShieldCheck }
                           ].map((item, i) => (
                              <div key={i} className="p-6 rounded-3xl bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm border border-border/50 space-y-3">
                                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><item.icon className="w-5 h-5" /></div>
                                 <h4 className="font-black uppercase italic text-sm font-heading">{item.title}</h4>
                                 <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="flex-1 relative">
                        <div className="aspect-square rounded-[60px] bg-gradient-to-br from-primary/20 via-blue-500/10 to-transparent border border-primary/20 flex items-center justify-center overflow-hidden">
                           <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 opacity-10"
                           >
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] border-[2px] border-dashed border-primary rounded-full" />
                           </motion.div>
                           <Users className="w-40 h-40 text-primary/40" />
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* DEVELOPER EXPERIENCE SECTION */}
            <section className="py-32 bg-background relative overflow-hidden">
               <div className="container mx-auto px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
                     <div className="space-y-8 text-left">
                        <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-black tracking-widest text-[10px]">Developer First</Badge>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading">Built for <span className="text-primary">Performance</span></h2>
                        <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                           SafeTools exposes high-performance local processing modules via a clean, unified engine architecture. Whether you're using our studio apps or building your own, privacy is the default.
                        </p>
                        <div className="grid grid-cols-2 gap-8">
                           <div>
                              <div className="text-4xl font-black italic tracking-tighter text-foreground font-heading">0ms</div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-primary">In-Memory Latency</div>
                           </div>
                           <div>
                              <div className="text-4xl font-black italic tracking-tighter text-foreground font-heading">100%</div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-primary">JavaScript/WASM</div>
                           </div>
                        </div>
                     </div>

                     <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative glass-card rounded-[40px] border border-border overflow-hidden shadow-2xl">
                           <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/30">
                              <div className="flex gap-2">
                                 <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                 <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                 <div className="w-3 h-3 rounded-full bg-green-500/20" />
                              </div>
                              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">safe-tools-engine.ts</div>
                           </div>
                           <div className="p-8 font-mono text-sm leading-relaxed overflow-x-auto text-left">
                              <div className="flex gap-4">
                                 <span className="opacity-30">01</span>
                                 <span className="text-blue-400">import</span> <span className="text-foreground">{`{ WorkerPool }`}</span> <span className="text-blue-400">from</span> <span className="text-emerald-400">"@safetools/core"</span>;
                              </div>
                              <div className="flex gap-4">
                                 <span className="opacity-30">02</span>
                                 <span></span>
                              </div>
                              <div className="flex gap-4">
                                 <span className="opacity-30">03</span>
                                 <span className="text-blue-400">const</span> <span className="text-yellow-400">engine</span> <span className="text-foreground">=</span> <span className="text-blue-400">new</span> <span className="text-yellow-400">WorkerPool</span>({`{`}
                              </div>
                              <div className="flex gap-4">
                                 <span className="opacity-30">04</span>
                                 <span className="pl-4 text-foreground">strategy:</span> <span className="text-emerald-400">"local-only"</span>,
                              </div>
                              <div className="flex gap-4">
                                 <span className="opacity-30">05</span>
                                 <span className="pl-4 text-foreground">sandbox:</span> <span className="text-blue-400">true</span>,
                              </div>
                              <div className="flex gap-4">
                                 <span className="opacity-30">06</span>
                                 <span className="text-foreground">{`});`}</span>
                              </div>
                              <div className="flex gap-4">
                                 <span className="opacity-30">07</span>
                                 <span></span>
                              </div>
                              <div className="flex gap-4">
                                 <span className="opacity-30">08</span>
                                 <span className="text-blue-400">const</span> <span className="text-yellow-400">result</span> <span className="text-foreground">=</span> <span className="text-blue-400">await</span> <span className="text-yellow-400">engine</span>.<span className="text-yellow-400">process</span>(file);
                              </div>
                              <div className="flex gap-4">
                                 <span className="opacity-30">09</span>
                                 <span className="text-pink-400">// Processing complete. 0 bytes uploaded.</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* SECURITY ARCHITECTURE SECTION */}
            <section className="py-32 bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm">
               <div className="container mx-auto px-6">
                  <div className="max-w-5xl mx-auto">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                           <div className="relative rounded-[40px] overflow-hidden border border-border shadow-2xl group">
                              <Image
                                 src="/images/visuals/secure_local_processing.png"
                                 alt="Secure Local Processing"
                                 width={800}
                                 height={800}
                                 className="w-full h-auto group-hover:scale-105 transition-transform duration-1000"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                              <div className="absolute bottom-8 left-8 right-8 p-6 glass-card rounded-2xl border-white/10">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500"><ShieldCheck className="w-6 h-6" /></div>
                                    <div className="text-xs font-black uppercase tracking-widest text-foreground">Encrypted & Isolated Workspace</div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                           <h2 className="text-5xl font-black tracking-tighter uppercase italic font-heading">Security <br /> <span className="text-primary">Infrastructure</span></h2>
                           <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                              SafeTools is built on a foundation of modern security standards. We implement strict Content Security Policies and sandboxed execution environments to ensure your files never touch a remote server.
                           </p>
                           <Button variant="outline" className="rounded-full px-8 h-14 border-primary/30 text-primary font-black uppercase tracking-widest italic group">
                              View Security Whitepaper
                              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                           </Button>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* ZERO-SERVER TECHNOLOGY MARQUEE */}
            <section className="py-24 glass-card border-y border-border relative overflow-hidden">
               <div className="container mx-auto px-6">
                  <div className="flex flex-wrap justify-center items-center gap-x-20 gap-y-12">
                     {[
                        { name: "WebAssembly", desc: "Native speed in browser", icon: Cpu },
                        { name: "Transformers.js", desc: "Local AI execution", icon: Sparkles },
                        { name: "FFmpeg.wasm", desc: "High-perf video/audio", icon: Video },
                        { name: "Sharp.js", desc: "Local image processing", icon: ImageIcon },
                        { name: "Tesseract.js", icon: ScanText, desc: "Local OCR engine" }
                     ].map((tech, i) => (
                        <motion.div
                           key={i}
                           whileHover={{ y: -5 }}
                           className="flex flex-col items-center text-center space-y-3 group"
                        >
                           <div className="w-12 h-12 rounded-2xl bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                              <tech.icon className="w-6 h-6" />
                           </div>
                           <div>
                              <div className="text-2xl font-black uppercase tracking-tighter italic font-heading">{tech.name}</div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-primary/40 group-hover:text-primary transition-colors">{tech.desc}</div>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="py-32">
               <div className="container mx-auto px-6">
                  <div className="text-center space-y-4 mb-20">
                     <h2 className="text-5xl font-black tracking-tighter uppercase italic font-heading">Loved by <span className="text-primary">Professionals</span></h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                     {[
                        { q: "Finally, a file tool platform that respects user privacy. The speed is incredible.", n: "Alex Rivers", r: "DevOps Engineer" },
                        { q: "The local processing is a game changer for handling sensitive medical documents.", n: "Sarah Chen", r: "Data Analyst" },
                        { q: "SafeTools feels like a native desktop app inside my browser. Smooth and reliable.", n: "Marcus Thorne", r: "Creative Director" }
                     ].map((t, i) => (
                        <div key={i} className="p-10 rounded-[40px] glass-card border border-border/50 space-y-8 relative group h-full">
                           <div className="text-primary opacity-20 group-hover:opacity-100 transition-opacity absolute top-10 right-10">
                              <Sparkles className="w-8 h-8" />
                           </div>
                           <p className="text-lg font-medium leading-relaxed italic opacity-80">"{t.q}"</p>
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm" />
                              <div>
                                 <div className="font-black uppercase italic tracking-tight text-sm font-heading">{t.n}</div>
                                 <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{t.r}</div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </section>

            {/* COMMUNITY STATS BANNER */}
            <section className="py-24 bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/5 border-y border-border">
               <div className="container mx-auto px-6">
                  <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                     <div className="space-y-4 text-center md:text-left">
                        <h2 className="text-4xl font-black tracking-tighter uppercase italic font-heading">Trusted by <span className="text-primary">Thousands</span></h2>
                        <p className="text-muted-foreground font-medium max-w-md">SafeTools is the go-to platform for privacy-conscious professionals worldwide.</p>
                     </div>
                     <div className="grid grid-cols-2 gap-12">
                        <div className="text-center">
                           <div className="text-5xl font-black italic tracking-tighter font-heading">1M+</div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-primary">Files Processed</div>
                        </div>
                        <div className="text-center">
                           <div className="text-5xl font-black italic tracking-tighter font-heading">50k+</div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-primary">Monthly Users</div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* FINAL CTA SECTION */}
            <section className="py-40 relative overflow-hidden bg-primary text-primary-foreground">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--primary-rgb),0.2),transparent_50%)]" />
               <div className="container mx-auto px-6 relative z-10 text-center space-y-12">
                  <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic font-heading">Experience the <span className="opacity-60">Future</span></h2>
                  <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto opacity-80">
                     Use professional browser-based tools without sacrificing privacy or performance. 100% Free. 100% Secure.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                     <Button className="h-16 px-12 rounded-2xl bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-xl font-black uppercase tracking-widest italic shadow-2xl">
                        Launch SafeTools
                     </Button>
                     <Button variant="outline" className="h-16 px-12 rounded-2xl border-primary-foreground/20 hover:bg-primary-foreground/10 text-xl font-black uppercase tracking-widest italic backdrop-blur-xl">
                        All 150+ Tools
                     </Button>
                  </div>
               </div>
            </section>

            {/* FREE FOREVER SECTION */}
            <section id="pricing" className="py-32 relative overflow-hidden bg-background/50 backdrop-blur-sm">
               <div className="container mx-auto px-6">
                  <div className="max-w-4xl mx-auto rounded-[50px] bg-gradient-to-br from-secondary/30 to-secondary/10 border border-border/50 p-12 md:p-20 text-center space-y-8 relative">
                     <div className="absolute top-0 right-0 p-12 opacity-5">
                        <Rocket className="w-40 h-40" />
                     </div>
                     <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6">Free Forever</Badge>
                     <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading">Privacy Should Be <br /> <span className="text-primary">Accessible to All</span></h2>
                     <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                        SafeTools is 100% free with no account required. No hidden fees, no subscriptions, and no usage limits. Our mission is to make secure browser computing the global standard.
                     </p>
                     <div className="pt-8">
                        <Button className="h-16 px-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 text-xl font-black uppercase tracking-widest italic shadow-2xl shadow-primary/20">
                           Start Using SafeTools
                        </Button>
                     </div>
                  </div>
               </div>
            </section>

            {/* Smart File Routing Dialog */}
            <Dialog open={isRoutingOpen} onOpenChange={setIsRoutingOpen}>
               <DialogContent className="sm:max-w-xl bg-background/80 border-border p-5 rounded-2xl shadow-2xl backdrop-blur-3xl">
                  <DialogHeader>
                     <DialogTitle className="text-xl font-black tracking-tighter uppercase text-center mb-4 italic">Smart File Routing</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 gap-4">
                     {getSuggestedTools(smartRoutingFile).map((tool) => (
                        <Button key={tool.href} variant="outline" className="h-12 justify-start px-6 rounded-3xl border-border bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/30 hover:bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/50 group transition-all" onClick={() => router.push(tool.href)}>
                           <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mr-4 shadow-lg group-hover:scale-105 transition-transform", tool.color)}><tool.icon className="w-6 h-6 text-foreground" /></div>
                           <div className="text-left font-black uppercase tracking-tight text-base italic">{tool.title}</div>
                        </Button>
                     ))}
                  </div>
               </DialogContent>
            </Dialog>

            {/* BIG UPGRADE: COMMAND PALETTE OVERLAY */}
            <AnimatePresence>
               {isCommandOpen && (
                  <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCommandOpen(false)}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                     />
                     <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl glass-card border border-border shadow-2xl rounded-3xl overflow-hidden backdrop-blur-3xl"
                     >
                        <div className="flex items-center px-6 py-6 border-b border-border gap-4">
                           <Command className="w-6 h-6 text-primary" />
                           <input
                              autoFocus
                              type="text"
                              value={commandSearch}
                              onChange={(e) => setCommandSearch(e.target.value)}
                              placeholder="Search across 150+ tools..."
                              className="flex-1 bg-transparent border-none outline-none text-xl font-bold placeholder:opacity-30 placeholder:italic"
                           />
                           <div className="text-[10px] font-black uppercase tracking-widest opacity-40 px-3 py-1 rounded-lg bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm">ESC</div>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 no-scrollbar">
                           {filteredCommandTools.length > 0 ? filteredCommandTools.map(tool => (
                              <button
                                 key={tool.href}
                                 onClick={() => {
                                    trackUsage(tool.href);
                                    router.push(tool.href);
                                    setIsCommandOpen(false);
                                 }}
                                 className="w-full flex items-center gap-6 p-4 rounded-2xl hover:bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/50 transition-all text-left group"
                              >
                                 <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-foreground shadow-lg group-hover:scale-105 transition-transform", tool.color)}>
                                    <tool.icon className="w-6 h-6" />
                                 </div>
                                 <div className="flex-1">
                                    <div className="font-black uppercase italic tracking-tight font-heading group-hover:text-primary transition-colors">{tool.title}</div>
                                    <div className="text-xs text-muted-foreground opacity-60 line-clamp-1">{tool.desc}</div>
                                 </div>
                                 <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                              </button>
                           )) : (
                              <div className="p-12 text-center space-y-4">
                                 <div className="text-4xl">🔎</div>
                                 <div className="text-sm font-black uppercase tracking-widest opacity-40 italic">No tools found matching "{commandSearch}"</div>
                              </div>
                           )}
                        </div>
                        <div className="px-6 py-4 bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm/30 border-t border-border flex items-center justify-between">
                           <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                                 <span className="p-1 rounded bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm border border-border">↑↓</span> Navigate
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                                 <span className="p-1 rounded bg-secondary/80 dark:bg-secondary/80 dark:bg-secondary/40 backdrop-blur-sm border border-border">ENTER</span> Launch
                              </div>
                           </div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-primary italic">SafeTools v2.0</div>
                        </div>
                     </motion.div>
                  </div>
               )}
            </AnimatePresence>
         </main>
         <Footer />
      </div>
   );
}
