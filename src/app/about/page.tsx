"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Zap, 
  Lock, 
  Database,
  CloudOff,
  UserCheck,
  ChevronRight,
  Fingerprint
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const pillars = [
    {
      icon: CloudOff,
      title: "Zero-Server Policy",
      desc: "Your files are never uploaded. We process everything locally in your browser using WebAssembly and Client-side JS.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Database,
      title: "No Data Persistence",
      desc: "Once you close the tab, your session and files are purged from memory. We don't use databases or server-side logs.",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      icon: Fingerprint,
      title: "Identity Protection",
      desc: "No tracking, no analytics, and no fingerprinting. We don't even know you're here—and we like it that way.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    }
  ];

  const technologies = [
    { name: "ffmpeg.wasm", desc: "Professional video & audio encoding in-browser." },
    { name: "pdf-lib", desc: "High-fidelity document manipulation." },
    { name: "ONNX Runtime", desc: "Client-side AI for image upscaling and OCR." },
    { name: "WebAssembly", desc: "Native performance via high-speed binaries." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white overflow-hidden">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 py-2 px-6 rounded-full uppercase tracking-[0.3em] text-[10px] font-black">
                Our Manifesto
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-none"
            >
              Privacy is a <br/> <span className="text-blue-500">Human Right.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed"
            >
              PrivateTools was built to bridge the gap between powerful professional utilities and absolute data sovereignty.
            </motion.p>
          </div>
        </section>

        {/* Pillars Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
              >
                <Card className="p-10 bg-white/[0.02] border-white/5 h-full rounded-[3rem] hover:bg-white/[0.04] transition-all group relative overflow-hidden">
                  <div className={`w-16 h-16 rounded-2xl ${pillar.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                    <pillar.icon className={`w-8 h-8 ${pillar.color}`} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Deep Dive */}
        <section className="py-32 px-4 relative">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6 rounded-full uppercase tracking-[0.3em] text-[10px] font-black">
                The Engine
              </Badge>
              <h2 className="text-5xl font-black tracking-tight leading-none">
                Hardware Performance. <br/> <span className="opacity-40 italic">Zero Server Latency.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                We utilize cutting-edge browser technologies to move processing power from the cloud to your local CPU and GPU. This ensures that even the most intensive tasks—like 4K video encoding or multi-image PDF merging—happen instantly without your files ever leaving your machine.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                {technologies.map(tech => (
                  <div key={tech.name} className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-black uppercase tracking-widest text-white/60">
                    {tech.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
               <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full" />
               <Card className="relative p-8 bg-black/40 border-white/10 backdrop-blur-3xl rounded-[3rem] shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase tracking-widest text-[10px] opacity-40">Performance Metrics</h4>
                      <p className="text-sm font-bold">Local Computing Engine v4.0</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                     {[
                       { label: "Data Leak Risk", value: "0%", color: "bg-emerald-500" },
                       { label: "Processing Speed", value: "Native", color: "bg-blue-500" },
                       { label: "Cloud Dependency", value: "None", color: "bg-purple-500" }
                     ].map(stat => (
                       <div key={stat.label} className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
                           <span>{stat.label}</span>
                           <span>{stat.value}</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: "100%" }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className={`h-full ${stat.color}`} 
                            />
                         </div>
                       </div>
                     ))}
                  </div>
               </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-12 bg-gradient-to-br from-blue-600 to-blue-800 p-20 rounded-[4rem] shadow-2xl shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12 scale-150">
              <ShieldCheck className="w-64 h-64" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-5xl font-black tracking-tight leading-none">Ready to take control?</h2>
              <p className="text-white/80 text-xl font-medium max-w-xl mx-auto">
                Explore our full suite of professional utilities and experience the power of private computing.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
                <Button size="lg" className="h-16 px-12 rounded-2xl bg-white text-blue-600 hover:bg-white/90 font-black text-lg gap-3" onClick={() => window.location.href = '/'}>
                  Get Started <ChevronRight className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-16 px-12 rounded-2xl border-white/20 hover:bg-white/10 text-white font-black text-lg">
                  View Source
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
