"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Star, 
  MessageSquare, 
  Heart, 
  ThumbsUp, 
  Zap, 
  ShieldCheck, 
  Send,
  Sparkles,
  ArrowRight,
  Smile,
  Meh,
  Frown
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function FeedbackClient() {
  const [rating, setRating] = useState<number | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.1),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-emerald-500/30 text-emerald-500 uppercase font-black tracking-widest text-[10px]">Community Voice</Badge>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic font-heading leading-none">
                   Shape the <br /> <span className="text-emerald-500 italic">Future.</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic">
                   Your feedback is our primary roadmap driver. Tell us what you love, what you hate, and what you want to see next.
                </p>
             </motion.div>
          </div>
        </section>

        {/* FEEDBACK FORM */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-4xl">
              <div className="relative group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[40px] blur opacity-10" />
                 <div className="relative bg-card border border-border p-10 md:p-20 rounded-[40px] space-y-16 shadow-2xl overflow-hidden">
                    {/* Background Visual */}
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] -rotate-12 translate-x-1/4 -translate-y-1/4">
                       <MessageSquare className="w-96 h-96 text-emerald-500" />
                    </div>

                    {/* Step 1: Mood */}
                    <div className="space-y-8 relative z-10 text-center md:text-left">
                       <div className="space-y-2">
                          <h3 className="text-3xl font-black uppercase italic font-heading">How was your session?</h3>
                          <p className="text-muted-foreground font-medium italic">Select your impression of our local-first engine.</p>
                       </div>
                       
                       <div className="grid grid-cols-3 gap-4">
                          {[
                            { icon: Frown, label: "Poor", val: 1, color: "text-red-500 bg-red-500/5 hover:bg-red-500/10 border-red-500/20" },
                            { icon: Meh, label: "Average", val: 3, color: "text-amber-500 bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20" },
                            { icon: Smile, label: "Excellent", val: 5, color: "text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20" }
                          ].map((mood, i) => (
                            <button 
                              key={i}
                              onClick={() => setRating(mood.val)}
                              className={cn(
                                "p-8 rounded-[32px] border transition-all flex flex-col items-center justify-center gap-4 group",
                                mood.color,
                                rating === mood.val && "scale-105 border-emerald-500/50 bg-emerald-500/10"
                              )}
                            >
                               <mood.icon className={cn("w-10 h-10 transition-transform group-hover:scale-110", rating === mood.val && "animate-bounce")} />
                               <span className="text-[10px] font-black uppercase tracking-widest">{mood.label}</span>
                            </button>
                          ))}
                       </div>
                    </div>

                    {/* Step 2: Detail */}
                    <div className="space-y-8 relative z-10">
                       <div className="space-y-2">
                          <h3 className="text-3xl font-black uppercase italic font-heading text-center md:text-left">The Details</h3>
                          <p className="text-muted-foreground font-medium italic text-center md:text-left">What specific features should we prioritize for v2.5?</p>
                       </div>
                       
                       <Textarea 
                         placeholder="I want more video formats... The UI could be faster... I love the privacy manifesto..." 
                         className="min-h-[200px] rounded-[32px] bg-secondary/20 border-border p-10 text-lg font-medium italic focus:ring-emerald-500/50"
                       />

                       <div className="flex flex-wrap items-center gap-4 pt-4">
                          {[ "UI/UX", "New Tools", "Performance", "Security", "Other" ].map(tag => (
                            <button key={tag} className="px-6 py-3 rounded-full bg-secondary/50 border border-border text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all">
                               {tag}
                            </button>
                          ))}
                       </div>
                    </div>

                    <Button className="w-full h-20 rounded-[32px] bg-emerald-500 hover:bg-emerald-600 font-black uppercase italic tracking-widest text-lg shadow-xl shadow-emerald-500/20 group relative overflow-hidden">
                       <span className="relative z-10 flex items-center justify-center gap-3 text-foreground">
                          Submit Feedback <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                       </span>
                    </Button>
                 </div>
              </div>
           </div>
        </section>

        {/* ROADMAP CTA */}
        <section className="py-40">
           <div className="container mx-auto px-6 text-center space-y-10">
              <Badge variant="outline" className="py-2 px-6 rounded-full border-emerald-500/30 text-emerald-500 uppercase font-black tracking-widest text-[10px]">What's Next</Badge>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading text-foreground">Live <span className="text-emerald-500">Roadmap</span></h2>
              <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto">See how your feedback translates into our future development cycles. Transparency at every step.</p>
              <div className="pt-6">
                 <Link href="/changelog">
                    <Button variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-border hover:bg-secondary/10 font-black uppercase italic tracking-widest text-sm group">
                       View Progress <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
