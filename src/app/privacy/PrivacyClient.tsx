"use client";

import React from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { TrustLayer } from "@/components/shared/TrustLayer";
import { Fingerprint, Shield, EyeOff, ServerOff, Lock, UserCheck, Globe, WifiOff } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const policies = [
    {
      title: "Zero Data Collection",
      desc: "SafeTools does not collect, store, or transmit any of your files. All processing is strictly limited to your local browser session.",
      icon: EyeOff
    },
    {
      title: "No Server-Side Analytics",
      desc: "We don't use invasive tracking pixels or fingerprinting. Any analytics are completely anonymous and browser-based.",
      icon: ServerOff
    },
    {
      title: "No Account Required",
      desc: "Use every tool on our platform without ever creating an account or providing an email address. Total anonymity.",
      icon: UserCheck
    },
    {
      title: "GDPR & CCPA Compliant",
      desc: "By never possessing your personal data, we exceed all global privacy standards by default.",
      icon: Shield
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />

      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-5xl space-y-32">
          
          {/* Header */}
          <section className="text-center space-y-6 py-12">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Fingerprint className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-foreground">
                Privacy <span className="text-emerald-500">Manifesto</span>
              </h1>
              <p className="text-lg md:text-xl font-medium text-muted-foreground max-w-2xl mx-auto italic">
                Our tools are built on a simple premise: your data is yours alone.
              </p>
            </motion.div>
          </section>

          <TrustLayer />

          {/* Privacy Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {policies.map((policy, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] glass-card border border-border space-y-6 hover:border-emerald-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <policy.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black uppercase italic text-foreground leading-tight">
                  {policy.title}
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {policy.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Offline & PWA */}
          <section className="p-12 rounded-[3rem] glass-card bg-emerald-500/5 border border-emerald-500/20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-black uppercase italic text-foreground flex items-center gap-3">
                <WifiOff className="w-8 h-8 text-emerald-500" /> Works Offline
              </h2>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                SafeTools is a Progressive Web App (PWA). Once loaded, our tools work even without an internet connection. This ensures your workflow is never interrupted and your data is never "phoned home."
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-black/40 border border-border space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500">How to use offline:</h4>
              <ul className="space-y-3">
                <li className="text-sm font-bold text-muted-foreground flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">1</div>
                  Load the tool once while online
                </li>
                <li className="text-sm font-bold text-muted-foreground flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">2</div>
                  AI models and logic are cached locally
                </li>
                <li className="text-sm font-bold text-muted-foreground flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">3</div>
                  Disconnect and keep processing securely
                </li>
              </ul>
            </div>
          </section>

          {/* Legal Statement */}
          <section className="max-w-3xl mx-auto text-center space-y-8 pb-24">
            <h2 className="text-2xl font-black uppercase italic text-foreground tracking-tighter">Legal Transparency</h2>
            <p className="text-muted-foreground font-medium leading-relaxed italic">
              Because SafeTools never handles, stores, or sees your data, we are unable to sell it, leak it, or be forced to disclose it. Your privacy is protected by the very laws of our technical architecture.
            </p>
            <div className="flex justify-center gap-4">
              <div className="px-4 py-2 rounded-xl border border-border text-[10px] font-black uppercase text-muted-foreground">Zero Retention Policy</div>
              <div className="px-4 py-2 rounded-xl border border-border text-[10px] font-black uppercase text-muted-foreground">Local Encryption Only</div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
