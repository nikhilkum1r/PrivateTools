import {
   Shield, ImageIcon, FileText, Lock,
   Video, Music, QrCode,
   Zap, Terminal, Search,
   Cpu, Layers, ShieldCheck, Database,
   Sparkles, ArrowRight, Palette, Key,
   Eye, FileCode, Fingerprint, Upload,
   CheckCircle2, AlertCircle, FileQuestion, Edit3,
   Binary, FileSearch, Table, CaseSensitive,
   AlignLeft, Hash, BookOpen, Clock,
   Presentation, StickyNote, Trash, Unlock,
   Monitor, Smartphone, WifiOff, MousePointer2,
   Check, Info, ChevronDown, Rocket, Users,
   UploadCloud, Download, ScanText, Heart, History, Command, Wand2
} from "lucide-react";

export const CATEGORIES = ["All", "Creative", "Documents", "Media", "Security", "Dev"] as const;
export type Category = typeof CATEGORIES[number];

export interface Tool {
   title: string;
   desc: string;
   href: string;
   icon: any;
   color: string;
   cat: Category;
   tags: string[];
}

export const tools: Tool[] = [
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
