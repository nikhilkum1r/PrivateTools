"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  ArrowRight, 
  Calendar,
  MessageSquare,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  Layout
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const updates = [
  {
    date: "May 8, 2026",
    title: "The Zero-Server AI Engine is Live",
    desc: "We've successfully integrated Transformers.js v3 into our production core. You can now perform background removal and image upscaling with 100% local compute.",
    category: "Architecture",
    icon: Cpu,
    color: "text-blue-500 bg-blue-500/10"
  },
  {
    date: "May 5, 2026",
    title: "New PDF Mastering Suite Launched",
    desc: "A comprehensive update to our document engine, supporting AES-256 encryption, bulk merging, and professional-grade compression.",
    category: "Product",
    icon: Layout,
    color: "text-emerald-500 bg-emerald-500/10"
  },
  {
    date: "May 2, 2026",
    title: "SafeTools 2.0 Architectural Pivot",
    desc: "We have officially removed all server-side endpoints. SafeTools is now a pure-edge platform, ensuring your data sovereignty by default.",
    category: "Security",
    icon: ShieldCheck,
    color: "text-purple-500 bg-purple-500/10"
  }
];

export default function UpdatesClient() {
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
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-black tracking-widest text-[10px]">Product Announcements</Badge>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic font-heading leading-none">
                   Latest <br /> <span className="text-primary italic">Updates.</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic">
                   Stay informed about new tools, architectural breakthroughs, and our ongoing mission to decentralize file processing.
                </p>
             </motion.div>
          </div>
        </section>

        {/* UPDATES FEED */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-5xl">
              <div className="space-y-12">
                 {updates.map((update, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="group relative"
                   >
                      <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-8 items-start">
                         <div className="pt-2">
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">{update.date}</div>
                            <Badge variant="outline" className={cn("rounded-full px-4 py-1 border-transparent font-black uppercase tracking-widest text-[9px]", update.color)}>
                               {update.category}
                            </Badge>
                         </div>
                         
                         <div className="p-8 md:p-12 rounded-[40px] bg-secondary/10 border border-border/50 hover:bg-card hover:border-primary/30 transition-all space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                               <update.icon className="w-32 h-32" />
                            </div>
                            
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase italic font-heading group-hover:text-primary transition-colors">{update.title}</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed font-medium italic max-w-3xl">{update.desc}</p>
                            
                            <Button variant="ghost" className="h-10 px-0 hover:bg-transparent text-primary font-black uppercase italic tracking-widest text-xs gap-2 group/btn">
                               Read Full Story <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                         </div>
                      </div>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* NEWSLETTER CTA */}
        <section className="py-40 bg-secondary/10">
           <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto rounded-[60px] bg-card border border-border p-16 md:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full" />
                 
                 <Bell className="w-16 h-16 mx-auto text-primary animate-bounce mb-4" />
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading leading-none">Stay in <br /> the Loop.</h2>
                 <p className="text-xl text-muted-foreground font-medium italic max-w-xl mx-auto">Join 5,000+ developers and privacy enthusiasts getting the latest engine updates delivered to their sanctuary.</p>
                 
                 <div className="max-w-md mx-auto flex flex-col md:flex-row gap-4 pt-6">
                    <Input placeholder="email@example.com" className="h-16 rounded-2xl bg-secondary/30 border-border px-6 text-lg italic" />
                    <Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase italic tracking-widest text-sm shadow-xl shadow-primary/20">
                       Subscribe
                    </Button>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
