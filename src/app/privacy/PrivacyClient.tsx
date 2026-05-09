"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  Lock, 
  EyeOff, 
  ServerOff, 
  CloudOff, 
  Search,
  ShieldCheck,
  Zap,
  Globe,
  Fingerprint,
  FileLock2,
  Trash2,
  WifiOff,
  Database,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const commitments = [
  {
    title: "Zero Server Knowledge",
    desc: "We don't just 'encrypt' your files; we never see them. Our servers only serve static code. Your data stays in your RAM, exactly where it belongs.",
    icon: ServerOff,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "No Surveillance Capitalism",
    desc: "We use no analytics, no cookies, and no trackers. We don't want to know who you are, where you are, or what you're processing.",
    icon: EyeOff,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Ephemeral by Default",
    desc: "Your data is processed in volatile memory. Once you close the tab, the state is wiped. There are no backups, because there is no storage.",
    icon: Trash2,
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Verified Isolation",
    desc: "SafeTools uses the highest browser security headers (COOP/COEP) to ensure that your processing session is strictly isolated from other web content.",
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-500"
  }
];

export default function PrivacyClient() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow">
        {/* CINEMATIC HERO */}
        <section className="relative pt-40 pb-32 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-secondary),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-10">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary uppercase font-black tracking-widest text-[10px]">The Privacy Manifesto</Badge>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic font-heading leading-[0.85]">
                   Privacy is a <br /> <span className="text-primary">Human Right.</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed italic">
                   Professional software shouldn't require your identity. SafeTools was built to prove that you can have world-class tools without the surveillance.
                </p>
             </motion.div>
          </div>
        </section>

        {/* THE THREE PILLARS */}
        <section className="py-32">
           <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 {[
                   { icon: WifiOff, title: "100% Offline Capable", desc: "Once the tool is loaded, you can disconnect your internet. The engine is now entirely yours." },
                   { icon: Database, title: "Zero Data Residency", desc: "We own no databases for user content. Your files never touch a hard drive outside your own." },
                   { icon: Lock, title: "RAM-Only Compute", desc: "All processing happens in high-speed, volatile memory. Closing the tab is equivalent to a secure wipe." }
                 ].map((pillar, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="space-y-6 text-center md:text-left"
                   >
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto md:mx-0">
                         <pillar.icon className="w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-black uppercase italic font-heading">{pillar.title}</h3>
                      <p className="text-muted-foreground font-medium italic leading-relaxed">{pillar.desc}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* THE 10-SECOND PROOF (Interactive-style static section) */}
        <section className="py-32 bg-background text-foreground relative overflow-hidden">
           <div className="absolute inset-0 bg-grid-white/[0.02]" />
           <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-6xl mx-auto">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-10">
                       <div className="space-y-6">
                          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading leading-tight">The 10-Second <br /> <span className="text-primary">Verification.</span></h2>
                          <p className="text-xl text-muted-foreground font-medium italic">We don't ask for your trust. We provide the tools for you to verify our claims in seconds.</p>
                       </div>
                       
                       <div className="space-y-8">
                          {[
                            { step: "01", title: "Open any Tool", desc: "Select any image or PDF utility from the home page." },
                            { step: "02", title: "Go Offline", desc: "Toggle your Airplane mode or disconnect your Ethernet." },
                            { step: "03", title: "Process Files", desc: "Upload and process your file. You'll notice it works at native speed with zero network activity." }
                          ].map((step, i) => (
                            <div key={i} className="flex gap-6 items-start">
                               <div className="text-3xl font-black italic text-primary/30 font-heading shrink-0">{step.step}</div>
                               <div>
                                  <div className="text-xl font-black uppercase italic font-heading mb-2">{step.title}</div>
                                  <div className="text-muted-foreground text-sm font-medium leading-relaxed">{step.desc}</div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    {/* Verification Card Visual */}
                    <div className="relative group">
                       <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                       <div className="relative bg-card border border-white/10 rounded-[40px] p-12 space-y-8 shadow-2xl">
                          <div className="flex items-center justify-between">
                             <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                             </div>
                             <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Network: 0.00 KB</Badge>
                          </div>
                          <div className="space-y-6">
                             <div className="h-4 w-3/4 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                  animate={{ width: ["0%", "100%", "100%"] }}
                                  transition={{ duration: 3, repeat: Infinity }}
                                  className="h-full bg-primary" 
                                />
                             </div>
                             <div className="space-y-3 font-mono text-xs text-muted-foreground">
                                <div className="flex justify-between"><span>[System]</span> <span>Initializing WASM...</span></div>
                                <div className="flex justify-between"><span>[System]</span> <span>Secure Sandbox Active</span></div>
                                <div className="flex justify-between"><span>[System]</span> <span>Network Connection: BLOCKED</span></div>
                                <div className="flex justify-between text-emerald-500"><span>[Success]</span> <span>Task Complete (Local)</span></div>
                             </div>
                          </div>
                          <div className="pt-4 flex items-center gap-3">
                             <ShieldCheck className="w-12 h-12 text-primary" />
                             <div>
                                <div className="font-black uppercase text-sm">Verified Zero-Server</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Hardware-level isolation</div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* CORE COMMITMENTS BENTO */}
        <section className="py-40">
           <div className="container mx-auto px-6">
              <div className="text-center space-y-6 mb-20">
                 <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary italic font-black uppercase tracking-widest text-[10px]">Data Sovereignty</Badge>
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading">Our Unbreakable <br /> <span className="text-primary">Commitments</span></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                 {commitments.map((c, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="p-12 rounded-[48px] bg-secondary/5 border border-border/50 hover:bg-card hover:border-primary/30 transition-all group"
                   >
                      <div className={cn("w-16 h-16 rounded-[24px] bg-gradient-to-br flex items-center justify-center text-foreground shadow-xl mb-10 group-hover:scale-110 transition-transform", c.color)}>
                         <c.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-black uppercase italic font-heading mb-4">{c.title}</h3>
                      <p className="text-muted-foreground text-lg font-medium leading-relaxed italic">{c.desc}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* DATA TYPES PROTECTION GRID */}
        <section className="py-32 bg-secondary/10">
           <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto space-y-16">
                 <div className="space-y-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading">Total Protection</h2>
                    <p className="text-xl text-muted-foreground font-medium italic">We apply the same zero-compromise logic to every data type.</p>
                 </div>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { icon: Fingerprint, label: "Biometrics" },
                      { icon: FileLock2, label: "Identity" },
                      { icon: Lock, label: "Passwords" },
                      { icon: ShieldAlert, label: "Metadata" }
                    ].map((item, i) => (
                      <div key={i} className="aspect-square rounded-3xl bg-card border border-border flex flex-col items-center justify-center gap-4 hover:border-primary/30 transition-all group">
                         <item.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* FINAL MANIFESTO BLOCK */}
        <section className="py-40 border-t border-border/50">
           <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto text-center space-y-12">
                 <h2 className="text-5xl font-black tracking-tighter uppercase italic font-heading">The Internet <br /> Should be Private.</h2>
                 <p className="text-xl text-muted-foreground font-medium leading-relaxed italic">
                    SafeTools is not just a product; it's a statement. In a world that wants to track every click, we provide a sanctuary of productivity. No accounts. No tracking. No compromise.
                 </p>
                 <div className="pt-6">
                    <Link href="/">
                       <Button size="lg" className="h-20 px-12 rounded-[24px] bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase italic tracking-widest text-sm group">
                          Back to the Suite <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                       </Button>
                    </Link>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
