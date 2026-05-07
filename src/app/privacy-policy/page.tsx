"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  CloudOff, 
  Database,
  FileSearch,
  Scale
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Data Processing Policy",
      icon: CloudOff,
      content: "SafeTools operates on a 'Zero-Server' architecture. All file processing—including image editing, video encoding, and PDF manipulation—happens locally in your browser's memory. We do not upload your files to our servers, and we do not have technical access to the data you process."
    },
    {
      title: "No Tracking & Cookies",
      icon: EyeOff,
      content: "We believe your browsing habits are your business. This site does not use tracking cookies, advertising beacons, or third-party analytics scripts (like Google Analytics). Your interaction with our tools is completely private."
    },
    {
      title: "Zero Data Persistence",
      icon: Database,
      content: "We do not store your files, metadata, or personal information. Once you close your browser tab or clear your browser cache, all session data and processed files are permanently purged from your device's memory."
    },
    {
      title: "Your Rights",
      icon: Scale,
      content: "Because we do not collect your data, we do not 'sell' or 'share' it. You maintain 100% ownership and sovereignty over every byte of information you process through our utility suite."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow pt-32 pb-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-6">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6 rounded-full uppercase tracking-[0.3em] text-[10px] font-black">
              Legal Transparency
            </Badge>
            <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none">
              Privacy <span className="text-emerald-500 italic">Guaranteed.</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
              Last Updated: May 6, 2026. This policy outlines our absolute commitment to your data sovereignty.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="p-8 bg-secondary/30 border-border rounded-2xl flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <section.icon className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black uppercase tracking-tight">{section.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                      {section.content}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-center space-y-4">
            <h4 className="text-xl font-black uppercase tracking-tight text-emerald-500">Security Audit</h4>
            <p className="text-sm font-medium text-emerald-500/80 italic">
              Our source code is open for inspection. We encourage security researchers to verify our local-first implementation.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
