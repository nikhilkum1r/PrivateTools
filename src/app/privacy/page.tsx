"use client";

import React from "react";
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
  Globe
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const principles = [
  {
    title: "Zero Server Knowledge",
    desc: "We don't just 'encrypt' your files; we never see them. Our servers only serve static code. Your data stays in your RAM.",
    icon: ServerOff,
  },
  {
    title: "Offline-First Integrity",
    desc: "Every tool in this suite is designed to work without an internet connection once loaded. Privacy is not a promise; it's a technical constraint.",
    icon: CloudOff,
  },
  {
    title: "No Tracking, Ever",
    desc: "We use no analytics, no cookies, and no trackers. We don't want to know who you are or what you're processing.",
    icon: EyeOff,
  },
  {
    title: "Open & Auditable",
    desc: "Transparency is the bedrock of trust. Our processing logic is entirely client-side, allowing anyone to inspect how their data is handled.",
    icon: Search,
  }
];

export default function PrivacyManifestoPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-24">
          {/* Hero */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-bold"
            >
              <ShieldCheck className="w-4 h-4" />
              The Privacy First Standard
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              Privacy is a <span className="text-primary italic">Human Right.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              In an age of surveillance capitalism, we believe your files should remain yours. 
              PrivateTools was built to prove that professional software doesn't need your data.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 h-full bg-secondary/20 border-primary/5 hover:border-primary/20 transition-colors">
                  <p.icon className="w-10 h-10 text-primary mb-6" />
                  <h3 className="text-2xl font-bold mb-4">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {p.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tech Explanation */}
          <div className="p-12 rounded-3xl bg-primary/5 border border-primary/10 space-y-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">The Technical Truth</h2>
              <p className="text-muted-foreground leading-relaxed">
                When you use a standard online converter, your file is uploaded to a server, processed, 
                and then stored (even if temporarily). This creates a vulnerability. 
                <br /><br />
                PrivateTools uses <strong>WebAssembly (WASM)</strong> and the <strong>Web Canvas API</strong> 
                to bring the processing engine TO your file, rather than sending your file to the engine.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-primary" />
                <span className="font-bold">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-primary" />
                <span className="font-bold">Encrypted Local Storage</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-primary" />
                <span className="font-bold">Universal Accessibility</span>
              </div>
            </div>
          </div>

          {/* Final Call */}
          <div className="text-center py-12">
            <h2 className="text-4xl font-black mb-8">Ready to work securely?</h2>
            <div className="flex justify-center gap-4">
              <a href="/">
                <Button size="lg" className="rounded-2xl h-14 px-8 font-bold text-lg">
                  Launch the Suite
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
