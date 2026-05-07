"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Scale, 
  Gavel,
  ShieldCheck,
  Cpu,
  Database,
  CloudOff,
  AlertTriangle,
  History,
  Lock,
  ChevronRight
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TermsOfServicePage() {
  const sections = [
    {
      title: "1. The Local-First Covenant",
      icon: CloudOff,
      content: "By using SafeTools, you understand and agree that this is a client-side execution platform. We provide the 'Architectural Blueprint' (the code), but the 'Construction' (data processing) happens entirely on your local hardware. We do not provide a hosting service for your data; we provide a local execution environment."
    },
    {
      title: "2. Absolute Data Sovereignty",
      icon: Database,
      content: "Your files remain your property and never leave your machine. SafeTools claims zero rights to your assets. Because we never see your data, we cannot fulfill 'Data Deletion' requests—as we have nothing to delete. You are the sole custodian of your digital assets."
    },
    {
      title: "3. Hardware Execution & Limits",
      icon: Cpu,
      content: "Processing heavy media (e.g., 4K video or multi-page PDFs) consumes your local CPU, GPU, and RAM. Performance is dependent on your device's capabilities. SafeTools is not responsible for browser crashes, memory overflows, or thermal throttling resulting from intensive local processing."
    },
    {
      title: "4. No Persistence & Recovery",
      icon: History,
      content: "This is a stateless application. We do not maintain user accounts, databases, or cloud storage. Once you close your browser tab or clear your cache, your progress is permanently lost. It is your responsibility to download and backup your assets immediately after processing."
    },
    {
      title: "5. Security & Transparency",
      icon: ShieldCheck,
      content: "We encourage the audit of our client-side logic. You are prohibited from using our tools for malicious purposes, including but not limited to: generating illegal content, unauthorized metadata injection, or attempting to reverse-engineer our proprietary UI elements for commercial distribution."
    },
    {
      title: "6. Limitation of Liability",
      icon: AlertTriangle,
      content: "SafeTools is provided 'as-is'. We do not guarantee 100% accuracy in file conversion or metadata stripping. We are not liable for any data loss, corruption, or consequential damages arising from the use of our browser-local utilities."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      <main className="flex-grow pt-32 pb-8 px-4 relative">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-4 relative z-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 py-2 px-6 rounded-full uppercase tracking-[0.3em] text-[10px] font-black">
                Legal Framework v4.0
              </Badge>
            </motion.div>
            
            <h1 className="text-2xl md:text-xl font-black tracking-tighter leading-none">
              Service <br/> <span className="text-purple-500 italic">Covenant.</span>
            </h1>
            
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Our terms are simple: Your device, your data, your control. We provide the tools; you provide the sovereignty.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="p-5 h-full bg-secondary/30 border-border rounded-2xl hover:bg-secondary/50 transition-all group overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                      <section.icon className="w-32 h-32" />
                   </div>
                   <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4 shadow-inner shadow-purple-500/10">
                     <section.icon className="w-7 h-7 text-purple-500" />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{section.title}</h3>
                   <p className="text-muted-foreground leading-relaxed font-medium">
                     {section.content}
                   </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Final Clause */}
          <div className="p-5 md:p-8 rounded-3xl bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-transparent border border-border relative overflow-hidden text-center space-y-4">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-secondary/50 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              <Lock className="w-3 h-3 text-purple-500" /> End-to-End Privacy
            </div>
            <h2 className="text-2xl md:text-xl font-black tracking-tight">Need a custom agreement?</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium leading-relaxed">
              For enterprise deployments or specialized security audits, our technical team is available for consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
               <Button className="h-10 px-5 rounded-2xl bg-purple-600 hover:bg-purple-700 font-black gap-2">
                 Contact Legal <ChevronRight className="w-4 h-4" />
               </Button>
               <Button variant="ghost" className="h-10 px-5 rounded-2xl font-black border border-border">
                 Archive (v3.0)
               </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
