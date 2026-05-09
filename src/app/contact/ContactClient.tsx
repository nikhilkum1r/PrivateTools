"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  Globe,
  ArrowRight,
  Send,
  Lock,
  Headphones
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function ContactClient() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-secondary),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-black tracking-widest text-[10px]">Communication Hub</Badge>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic font-heading leading-none">
                   Get in <br /> <span className="text-primary italic">Touch.</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic">
                   Have a feature request, architectural question, or just want to say hi? We're always listening to our community.
                </p>
             </motion.div>
          </div>
        </section>

        {/* CONTACT GRID */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                 {/* Left Side: Info */}
                 <div className="space-y-12">
                    <div className="space-y-6">
                       <h2 className="text-4xl font-black uppercase italic font-heading tracking-tight">Prefer a <br /> <span className="text-primary">Direct Channel?</span></h2>
                       <p className="text-muted-foreground text-lg font-medium italic leading-relaxed">Choose the platform that works best for your workflow. We're active across all major developer communities.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {[
                         { icon: GithubIcon, label: "GitHub", val: "Issue Tracker", href: "https://github.com/nikhilkum1r/SafeTools", color: "text-foreground bg-slate-900" },
                         { icon: TwitterIcon, label: "Twitter", val: "@SafeTools", href: "#", color: "text-foreground bg-blue-400" },
                         { icon: Mail, label: "Email", val: "hello@safetools.space", href: "mailto:hello@safetools.space", color: "text-foreground bg-primary" },
                         { icon: Headphones, label: "Support", val: "Discord Server", href: "#", color: "text-foreground bg-indigo-500" }
                       ].map((item, i) => (
                         <a 
                           key={i} 
                           href={item.href}
                           className="p-6 rounded-3xl bg-secondary/10 border border-border/50 hover:bg-card hover:border-primary/30 transition-all flex items-center gap-4 group"
                         >
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform", item.color)}>
                               <item.icon className="w-6 h-6" />
                            </div>
                            <div>
                               <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{item.label}</div>
                               <div className="font-black uppercase italic text-sm">{item.val}</div>
                            </div>
                         </a>
                       ))}
                    </div>

                    {/* Security Tip */}
                    <div className="p-8 rounded-[40px] bg-emerald-500/5 border border-emerald-500/20 space-y-4">
                       <div className="flex items-center gap-3 text-emerald-500">
                          <Lock className="w-5 h-5" />
                          <span className="text-[10px] font-black uppercase tracking-widest italic">Privacy Guard</span>
                       </div>
                       <p className="text-sm font-medium italic text-emerald-500/80 leading-relaxed">
                          <strong>Note:</strong> Do not send sensitive files via email or this form. If you need to process private data, use our local-first tools directly in the browser.
                       </p>
                    </div>
                 </div>

                 {/* Right Side: Form */}
                 <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[40px] blur opacity-10" />
                    <div className="relative bg-card border border-border p-10 md:p-14 rounded-[40px] space-y-8 shadow-2xl">
                       <div className="space-y-2">
                          <h3 className="text-3xl font-black uppercase italic font-heading">Send a Message</h3>
                          <p className="text-muted-foreground text-sm font-medium italic">We typically respond within 24-48 hours.</p>
                       </div>

                       <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-1">Full Name</label>
                                <Input placeholder="John Doe" className="h-14 rounded-2xl bg-secondary/20 border-border" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest ml-1">Email Address</label>
                                <Input placeholder="john@example.com" type="email" className="h-14 rounded-2xl bg-secondary/20 border-border" />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest ml-1">Subject</label>
                             <Input placeholder="Feature Request" className="h-14 rounded-2xl bg-secondary/20 border-border" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest ml-1">Your Message</label>
                             <Textarea placeholder="How can we help?" className="min-h-[150px] rounded-2xl bg-secondary/20 border-border p-6" />
                          </div>
                          <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase italic tracking-widest text-sm shadow-xl shadow-primary/20">
                             Dispatch Message <Send className="ml-2 w-5 h-5" />
                          </Button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* FAQ CTA */}
        <section className="py-40 bg-secondary/10">
           <div className="container mx-auto px-6 text-center space-y-10">
              <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-black tracking-widest text-[10px]">Instant Answers</Badge>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading">Check the <span className="text-primary">FAQ</span> First</h2>
              <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto">We might have already answered your question. Our knowledge base is extensive and technically detailed.</p>
              <div className="pt-6">
                 <Link href="/faq">
                    <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-border hover:bg-background font-black uppercase italic tracking-widest text-sm group">
                       Go to FAQ <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
