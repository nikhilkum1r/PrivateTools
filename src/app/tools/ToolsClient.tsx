"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Search, 
  ImageIcon, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Video, 
  Lock, 
  FileSearch, 
  Languages, 
  QrCode, 
  Type,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Filter,
  Grid
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Image Studio",
    icon: ImageIcon,
    color: "text-blue-500 bg-blue-500/10",
    tools: [
      { name: "Image Editor", desc: "Professional local-first editing suite.", href: "/image/editor" },
      { name: "Background Remover", desc: "AI-powered subject extraction.", href: "/image/background-remover" },
      { name: "Format Converter", desc: "Bulk convert between 20+ formats.", href: "/image/convert" },
      { name: "Image Upscaler", desc: "AI super-resolution scaling.", href: "/image/upscale" },
      { name: "Metadata Stripper", desc: "Remove EXIF and GPS data.", href: "/image/metadata" }
    ]
  },
  {
    name: "PDF & Document",
    icon: FileText,
    color: "text-emerald-500 bg-emerald-500/10",
    tools: [

      { name: "Word to PDF", href: "/document/word-to-pdf", desc: "High-fidelity local conversion." },
      { name: "PDF Compressor", href: "/pdf/compress-pdf", desc: "Optimize file size without loss." },
      { name: "PDF Merger", href: "/pdf/merge-pdf", desc: "Combine multiple docs locally." },
      { name: "Docx Editor", href: "/document/editor", desc: "Edit Word files in the browser." }
    ]
  },
  {
    name: "Security & Privacy",
    icon: ShieldCheck,
    color: "text-purple-500 bg-purple-500/10",
    tools: [
      { name: "Secure Vault", href: "/privacy/vault", desc: "AES-256 GCM local encryption." },
      { name: "Steganography", href: "/steganography", desc: "Hide secrets inside images." },
      { name: "Password Checker", href: "/privacy/password-checker", desc: "Analyze strength & leak vulnerability." },
      { name: "Password Generator", href: "/privacy/password-generator", desc: "High-entropy local generator." },
      { name: "Privacy Hub", href: "/privacy", desc: "Manage your local data sanctuary." }
    ]
  },
  {
    name: "Media & Utilities",
    icon: Zap,
    color: "text-amber-500 bg-amber-500/10",
    tools: [
      { name: "QR Generator", href: "/tools/qr-generator", desc: "Secure, non-tracking QR codes." },

      { name: "Dev Tools", href: "/devtools", desc: "Advanced browser debugging utilities." }
    ]
  }
];

export default function ToolsClient() {
  const [search, setSearch] = useState("");

  const filteredCategories = categories.map(cat => ({
    ...cat,
    tools: cat.tools.filter(tool => 
      tool.name.toLowerCase().includes(search.toLowerCase()) || 
      tool.desc.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.tools.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow">
        {/* HERO */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-secondary),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-black tracking-widest text-[10px]">Infinite Utility Hub</Badge>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic font-heading leading-none">
                   The Tool <br /> <span className="text-primary italic">Directory.</span>
                </h1>
                
                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative group pt-8">
                   <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                   <div className="relative flex items-center">
                      <Search className="absolute left-6 w-5 h-5 text-muted-foreground" />
                      <Input 
                        placeholder="Search 150+ local tools..." 
                        className="h-16 pl-14 pr-6 rounded-2xl bg-card border-border shadow-xl text-lg font-medium italic"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                   </div>
                </div>
             </motion.div>
          </div>
        </section>

        {/* TOOLS GRID */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-7xl">
              <div className="space-y-32">
                 {filteredCategories.map((cat, ci) => (
                   <div key={ci} className="space-y-12">
                      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-8">
                         <div className="flex items-center gap-6">
                            <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center shadow-xl", cat.color)}>
                               <cat.icon className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                               <h2 className="text-4xl font-black uppercase italic font-heading tracking-tight">{cat.name}</h2>
                               <p className="text-muted-foreground font-medium italic">Local-First High Performance Processing</p>
                            </div>
                         </div>
                         <Badge variant="outline" className="py-2 px-6 rounded-full border-border text-muted-foreground uppercase font-black tracking-widest text-[10px]">{cat.tools.length} Tools Available</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {cat.tools.map((tool, ti) => (
                           <Link key={ti} href={tool.href}>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: ti * 0.05 }}
                                className="p-8 rounded-[40px] bg-secondary/5 border border-border/50 hover:bg-card hover:border-primary/30 transition-all group relative overflow-hidden h-full flex flex-col"
                              >
                                 <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                    <cat.icon className="w-24 h-24" />
                                 </div>
                                 
                                 <div className="space-y-4 relative z-10 flex-grow">
                                    <h3 className="text-2xl font-black uppercase italic font-heading group-hover:text-primary transition-colors">{tool.name}</h3>
                                    <p className="text-muted-foreground text-sm font-medium italic leading-relaxed">{tool.desc}</p>
                                 </div>
                                 
                                 <div className="pt-8 relative z-10">
                                    <div className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                       Launch Tool <ArrowRight className="w-4 h-4" />
                                    </div>
                                 </div>
                              </motion.div>
                           </Link>
                         ))}
                      </div>
                   </div>
                 ))}
              </div>

              {filteredCategories.length === 0 && (
                <div className="text-center py-40 space-y-8">
                   <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                      <Search className="w-10 h-10" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-3xl font-black uppercase italic font-heading">No tools matching "{search}"</h3>
                      <p className="text-muted-foreground text-lg font-medium italic">Try checking another category or suggest a tool via feedback.</p>
                   </div>
                   <Link href="/feedback">
                      <Button className="h-16 px-10 rounded-2xl bg-primary font-black uppercase italic tracking-widest text-sm">Suggest a Tool</Button>
                   </Link>
                </div>
              )}
           </div>
        </section>

        {/* CTA */}
        <section className="py-40 bg-secondary/10">
           <div className="container mx-auto px-6 text-center space-y-10">
              <Sparkles className="w-16 h-16 mx-auto text-primary animate-pulse" />
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading">Missing Something?</h2>
              <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto">SafeTools is expanding every week. If you need a specific privacy-first utility, let our architecture team know.</p>
              <div className="pt-6">
                 <Link href="/contact">
                    <Button variant="outline" size="lg" className="h-20 px-12 rounded-[32px] border-border hover:bg-background font-black uppercase italic tracking-widest text-sm group">
                       Contact Technical Team <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                 </Link>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
