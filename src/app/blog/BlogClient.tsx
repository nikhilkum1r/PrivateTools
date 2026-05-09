"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, 
  Search, 
  ArrowRight, 
  Clock, 
  Calendar, 
  User, 
  Tag,
  ChevronRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Zap,
  Cpu
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const posts = [
  {
    slug: "why-zero-server-processing-is-the-future",
    title: "Why Zero-Server Processing is the Future of File Utilities",
    excerpt: "In an era of data breaches and mass surveillance, local-first computing offers a sanctuary for sensitive user data. Explore how WebAssembly is changing the web.",
    date: "May 8, 2026",
    readTime: "6 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800",
    color: "from-blue-500 to-indigo-600"
  },
  {
    slug: "securing-your-digital-workflow-in-2026",
    title: "Securing Your Digital Workflow: A Guide to Local-First Tools",
    excerpt: "From encryption to metadata removal, learn how to build a production workflow that never leaks a single byte to external servers.",
    date: "May 6, 2026",
    readTime: "8 min read",
    category: "Security",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    color: "from-emerald-500 to-teal-600"
  },
  {
    slug: "mastering-webassembly-for-high-performance-apps",
    title: "Mastering WebAssembly for High-Performance Browser Applications",
    excerpt: "A deep dive into how we built the SafeTools engine using Rust and WASM to achieve near-native performance for image and video processing.",
    date: "May 4, 2026",
    readTime: "12 min read",
    category: "Engineering",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    color: "from-purple-500 to-pink-600"
  }
];

export default function BlogClient() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow">
        {/* HERO */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.1),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-black tracking-widest text-[10px]">Technical Journal</Badge>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic font-heading leading-none">
                   The Safe <br /> <span className="text-primary italic">Journal.</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic leading-relaxed">
                   Deep dives into privacy architecture, browser-based computing, and the future of secure file processing.
                </p>
                
                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative group pt-8">
                   <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                   <div className="relative flex items-center">
                      <Search className="absolute left-6 w-5 h-5 text-muted-foreground" />
                      <Input 
                        placeholder="Search articles & guides..." 
                        className="h-16 pl-14 pr-6 rounded-2xl bg-card border-border shadow-xl text-lg font-medium italic"
                      />
                   </div>
                </div>
             </motion.div>
          </div>
        </section>

        {/* FEATURED POSTS */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {posts.map((post, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="group"
                   >
                      <Link href={`/blog/${post.slug}`}>
                         <div className="relative overflow-hidden rounded-[40px] aspect-[4/5] bg-secondary/10 border border-border/50 group-hover:border-primary/30 transition-all shadow-xl group-hover:shadow-primary/5">
                            {/* Image Placeholder with Gradient */}
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity", post.color)} />
                            <img 
                              src={post.image} 
                              alt={post.title} 
                              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                            />
                            
                            {/* Content Overlay */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-4 bg-gradient-to-t from-background via-background/20 to-transparent">
                               <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary">
                                  <span>{post.category}</span>
                                  <span className="w-1 h-1 rounded-full bg-border" />
                                  <span className="text-muted-foreground">{post.readTime}</span>
                               </div>
                               <h3 className="text-3xl font-black tracking-tight uppercase italic font-heading leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                               <p className="text-muted-foreground text-sm font-medium leading-relaxed italic line-clamp-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                  {post.excerpt}
                               </p>
                               <div className="pt-4 flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                                  Read Article <ArrowRight className="w-4 h-4" />
                               </div>
                            </div>
                         </div>
                      </Link>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* TOPICS SECTION */}
        <section className="py-32 bg-secondary/10 border-y border-border/50">
           <div className="container mx-auto px-6 max-w-5xl text-center space-y-12">
              <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-black tracking-widest text-[10px]">Knowledge Base</Badge>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading">Explore <span className="text-primary">Topics.</span></h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { label: "WebAssembly", icon: Cpu },
                   { label: "Cryptography", icon: ShieldCheck },
                   { label: "UX Design", icon: Sparkles },
                   { label: "Edge Computing", icon: Zap }
                 ].map((topic, i) => (
                   <button key={i} className="p-8 rounded-[32px] bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all space-y-4 group">
                      <topic.icon className="w-8 h-8 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                      <div className="text-[10px] font-black uppercase tracking-widest">{topic.label}</div>
                   </button>
                 ))}
              </div>
           </div>
        </section>

        {/* CTA */}
        <section className="py-40">
           <div className="container mx-auto px-6 text-center space-y-10">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading">The Mission <br /> <span className="text-primary">Continues.</span></h2>
              <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto leading-relaxed">
                 SafeTools is an open dialogue on the future of private computing. Join the conversation and help us redefine the modern web.
              </p>
              <div className="pt-6">
                 <Link href="/contact">
                    <Button className="h-20 px-12 rounded-[32px] bg-primary hover:bg-primary/90 font-black uppercase italic tracking-widest text-sm shadow-2xl shadow-primary/20 group">
                       Contact Editorial <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
