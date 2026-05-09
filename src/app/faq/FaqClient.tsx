"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  HelpCircle, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Lock, 
  Zap, 
  MessageCircle,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Info
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

const faqs = [
  {
    category: "Privacy & Security",
    questions: [
      {
        q: "Does SafeTools ever see my files?",
        a: "Never. SafeTools is built on a 'Zero-Server' architecture. All processing happens locally in your browser's RAM using WebAssembly. Your files never leave your machine."
      },
      {
        q: "Can I use SafeTools while offline?",
        a: "Yes! Once the page is loaded, you can disconnect your internet and continue using most tools. The processing logic is entirely client-side."
      },
      {
        q: "What happens to my data after processing?",
        a: "Your data is stored in volatile memory (RAM) only during the processing session. Once you close the browser tab, the data is permanently wiped. We have no databases to store your content."
      }
    ]
  },
  {
    category: "Technical",
    questions: [
      {
        q: "What technologies power SafeTools?",
        a: "We leverage WebAssembly (WASM), Rust, FFmpeg.wasm, and Transformers.js to run high-performance server-grade logic directly in your browser's V8 engine."
      },
      {
        q: "Is there a file size limit?",
        a: "The limits are determined by your device's available RAM and the browser's memory constraints. Generally, we support files up to several hundred MBs comfortably."
      },
      {
        q: "Which browsers are supported?",
        a: "SafeTools works best on modern desktop browsers like Chrome, Edge, and Firefox. Safari is supported but may have limited performance on some WASM-heavy tools."
      }
    ]
  },
  {
    category: "General",
    questions: [
      {
        q: "Is SafeTools really free forever?",
        a: "Yes. Because we don't have server-side processing costs, we can keep the platform free for everyone. Optional support helps us fund domain and CDN costs."
      },
      {
        q: "Can I use SafeTools for commercial work?",
        a: "Absolutely. All tools are available for personal and commercial use with no watermarks or restrictions."
      }
    ]
  }
];

export default function FaqClient() {
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(search.toLowerCase()) || 
      q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <SEOStructuredData 
        name="SafeTools FAQ"
        description="Frequently asked questions about SafeTools' zero-server architecture, security, and browser-based tools."
        url="https://safetools.space/faq"
        faqItems={faqs.flatMap(cat => cat.questions.map(q => ({ question: q.q, answer: q.a })))}
      />

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
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-black tracking-widest text-[10px]">Knowledge Base</Badge>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic font-heading leading-none">
                   Common <br /> <span className="text-primary italic">Inquiries.</span>
                </h1>
                
                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative group pt-8">
                   <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                   <div className="relative flex items-center">
                      <Search className="absolute left-6 w-5 h-5 text-muted-foreground" />
                      <Input 
                        placeholder="Search for questions..." 
                        className="h-16 pl-14 pr-6 rounded-2xl bg-card border-border shadow-xl text-lg font-medium italic"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                   </div>
                </div>
             </motion.div>
          </div>
        </section>

        {/* FAQ CONTENT */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-4xl">
              {filteredFaqs.length > 0 ? (
                <div className="space-y-24">
                   {filteredFaqs.map((cat, ci) => (
                     <div key={ci} className="space-y-8">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              {cat.category === "Privacy & Security" ? <Lock className="w-5 h-5" /> : cat.category === "Technical" ? <Cpu className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                           </div>
                           <h2 className="text-2xl font-black uppercase italic font-heading tracking-tight">{cat.category}</h2>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                           {cat.questions.map((item, qi) => (
                             <AccordionItem 
                               key={qi} 
                               value={`${ci}-${qi}`}
                               className="border border-border/50 bg-secondary/5 rounded-[32px] px-8 overflow-hidden data-[state=open]:bg-card data-[state=open]:border-primary/20 transition-all shadow-sm hover:shadow-md"
                             >
                               <AccordionTrigger className="text-lg font-black uppercase italic font-heading text-left hover:no-underline py-6">
                                  {item.q}
                               </AccordionTrigger>
                               <AccordionContent className="text-muted-foreground text-lg leading-relaxed font-medium italic pb-6">
                                  {item.a}
                               </AccordionContent>
                             </AccordionItem>
                           ))}
                        </Accordion>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="text-center py-32 space-y-6">
                   <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                      <Search className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black uppercase italic font-heading">No results found</h3>
                   <p className="text-muted-foreground font-medium italic">Try adjusting your search terms or contact support.</p>
                </div>
              )}
           </div>
        </section>

        {/* STILL HAVE QUESTIONS? */}
        <section className="py-40">
           <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto rounded-[60px] bg-primary p-20 text-primary-foreground relative overflow-hidden text-center space-y-10 shadow-2xl shadow-primary/20">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                 <MessageCircle className="w-20 h-20 mx-auto opacity-50" />
                 <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic font-heading leading-none">Still have <br /> Questions?</h2>
                 <p className="text-xl font-medium opacity-80 max-w-2xl mx-auto italic">Our technical team is ready to help you with any specialized inquiries or architectural deep-dives.</p>
                 <div className="pt-6">
                    <Button size="lg" className="h-20 px-12 rounded-3xl bg-white text-primary hover:bg-white/90 font-black uppercase italic tracking-widest text-sm group">
                       Contact Support <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
