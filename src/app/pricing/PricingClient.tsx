"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  Heart, 
  Coffee, 
  Globe, 
  Zap, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Layers,
  Infinity as InfinityIcon,
  ZapOff,
  Clock,
  ExternalLink
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { cn } from "@/lib/utils";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const freeFeatures = [
  "150+ Professional Tools",
  "Unlimited File Processing",
  "Zero File Size Limits",
  "Hardware-Accelerated Speed",
  "100% Private & Local",
  "No Account Required",
  "No Ads or Trackers",
  "Full Local Engine Access"
];

const supportOptions = [
  {
    title: "Buy a Coffee",
    desc: "A small, one-time gesture to keep the engine running.",
    icon: Coffee,
    action: "Support now",
    color: "from-amber-500 to-orange-600"
  },
  {
    title: "GitHub Sponsor",
    desc: "Support our open-source mission on a recurring basis.",
    icon: GithubIcon,
    action: "Sponsor Dev",
    color: "from-slate-700 to-slate-900"
  },
  {
    title: "Spread the Word",
    desc: "Sharing SafeTools with your team is the best support.",
    icon: Globe,
    action: "Share Tool",
    color: "from-blue-500 to-cyan-500"
  }
];

export default function PricingClient() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow">
        {/* HERO - ANTI-SAAS STATEMENT */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-secondary),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-black tracking-widest text-[10px]">The Fair Access Policy</Badge>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic font-heading leading-none">
                   Free for <br /> <span className="text-primary italic">Everyone.</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto italic">
                   We believe privacy shouldn't be a premium feature. It should be the default state of the web.
                </p>
             </motion.div>
          </div>
        </section>

        {/* THE "INFINITY" PLAN CARD */}
        <section className="py-20">
           <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="relative group"
                 >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-[60px] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-card border border-border rounded-[60px] p-12 md:p-20 shadow-2xl overflow-hidden">
                       <div className="absolute top-0 right-0 p-12 opacity-5 -rotate-12">
                          <InfinityIcon className="w-64 h-64" />
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                          <div className="space-y-10">
                             <div className="space-y-4">
                                <h2 className="text-4xl font-black uppercase italic font-heading">The Sovereign Plan</h2>
                                <div className="flex items-baseline gap-2">
                                   <span className="text-7xl font-black tracking-tighter font-heading">$0</span>
                                   <span className="text-muted-foreground font-bold italic">/ forever</span>
                                </div>
                             </div>
                             <p className="text-lg text-muted-foreground font-medium italic leading-relaxed">
                                Access the entire SafeTools infrastructure with zero compromises. No subscriptions, no hidden limits, and no credit card required.
                             </p>
                             <div className="pt-4">
                                <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-sm italic w-full md:w-auto">
                                   Start Using Free <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                             </div>
                          </div>

                          <div className="space-y-6">
                             <div className="text-[10px] font-black uppercase tracking-widest text-primary italic font-heading">What's Included</div>
                             <div className="grid grid-cols-1 gap-4">
                                {freeFeatures.map((feat, i) => (
                                  <div key={i} className="flex items-center gap-3 text-sm font-bold">
                                     <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Check className="w-3 h-3" />
                                     </div>
                                     {feat}
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* COMPARISON RECAP */}
        <section className="py-40 bg-secondary/10">
           <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto space-y-16">
                 <div className="text-center space-y-4">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading">Why is it <span className="text-primary">Free?</span></h2>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic">Traditional tools have servers. Servers cost money. <br /> SafeTools uses <b>your</b> hardware to do the work.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 rounded-[40px] bg-card border border-border space-y-6 relative overflow-hidden group">
                       <ZapOff className="absolute -top-4 -right-4 w-32 h-32 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform" />
                       <h3 className="text-2xl font-black uppercase italic font-heading">Cloud "Free" Tools</h3>
                       <ul className="space-y-4">
                          <li className="flex items-center gap-3 text-sm text-muted-foreground line-through">Unlimited processing</li>
                          <li className="flex items-center gap-3 text-sm text-muted-foreground">Limited to 10MB files</li>
                          <li className="flex items-center gap-3 text-sm text-muted-foreground">Queue times & waitlists</li>
                          <li className="flex items-center gap-3 text-sm text-muted-foreground">Watermarks on exports</li>
                          <li className="flex items-center gap-3 text-sm text-muted-foreground">Aggressive email marketing</li>
                       </ul>
                    </div>
                    <div className="p-10 rounded-[40px] bg-primary text-primary-foreground space-y-6 relative overflow-hidden group shadow-2xl">
                       <InfinityIcon className="absolute -top-4 -right-4 w-32 h-32 opacity-10 -rotate-12 group-hover:rotate-0 transition-transform" />
                       <h3 className="text-2xl font-black uppercase italic font-heading">SafeTools</h3>
                       <ul className="space-y-4">
                          <li className="flex items-center gap-3 text-sm font-bold"><Check className="w-4 h-4" /> 100% Free Forever</li>
                          <li className="flex items-center gap-3 text-sm font-bold"><Check className="w-4 h-4" /> No file size limits</li>
                          <li className="flex items-center gap-3 text-sm font-bold"><Check className="w-4 h-4" /> Zero queue / Instant local</li>
                          <li className="flex items-center gap-3 text-sm font-bold"><Check className="w-4 h-4" /> No watermarks / Full quality</li>
                          <li className="flex items-center gap-3 text-sm font-bold"><Check className="w-4 h-4" /> No accounts / Total anonymity</li>
                       </ul>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* OPTIONAL SUPPORT SECTION */}
        <section className="py-40">
           <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto space-y-20">
                 <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20 text-[10px] font-black uppercase tracking-widest italic">Optional Contribution</div>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic font-heading">Support the <span className="text-pink-500">Mission</span></h2>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic">SafeTools will always be free. If you find value in our work and want to help fuel future development, your support is deeply appreciated.</p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {supportOptions.map((opt, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ y: -10 }}
                        className="p-10 rounded-[40px] bg-secondary/5 border border-border/50 hover:bg-card hover:border-pink-500/30 transition-all group flex flex-col items-center text-center"
                      >
                         <div className={cn("w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center text-foreground shadow-xl mb-8 group-hover:scale-110 transition-transform", opt.color)}>
                            <opt.icon className="w-10 h-10" />
                         </div>
                         <h3 className="text-2xl font-black uppercase italic font-heading mb-4">{opt.title}</h3>
                         <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8">{opt.desc}</p>
                         <div className="mt-auto w-full">
                            <Button variant="outline" className="w-full h-14 rounded-2xl border-pink-500/20 text-pink-500 hover:bg-pink-500 hover:text-foreground font-black uppercase tracking-widest text-[10px] italic">
                               {opt.action}
                            </Button>
                         </div>
                      </motion.div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* DONATION FAQ / TRANSPARENCY */}
        <section className="py-20 border-t border-border/50">
           <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-muted-foreground font-medium italic">
                 <div className="space-y-4">
                    <h4 className="text-foreground font-black uppercase italic">Where does the money go?</h4>
                    <p>100% of contributions are used to cover CDN costs, domain renewals, and to fund the development of complex new WASM engines.</p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="text-foreground font-black uppercase italic">Can I cancel anytime?</h4>
                    <p>Of course. Recurring support through GitHub Sponsors is entirely voluntary and can be adjusted or stopped at any moment with one click.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* FINAL MANIFESTO CALL */}
        <section className="py-40 bg-secondary/30">
           <div className="container mx-auto px-6 text-center space-y-10">
              <Sparkles className="w-16 h-16 mx-auto text-primary opacity-50" />
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading leading-none">Privacy is <br /> Non-Negotiable.</h2>
              <p className="text-xl text-muted-foreground font-medium italic">Thank you for helping us keep SafeTools free and secure for everyone.</p>
              <div className="pt-10 flex flex-wrap justify-center gap-6">
                 <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-background border border-border">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Proudly Independent</span>
                 </div>
                 <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-background border border-border">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Zero-Server Compute</span>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
