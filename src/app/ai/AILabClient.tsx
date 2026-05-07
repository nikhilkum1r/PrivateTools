"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Sparkles, ImageIcon, Wand2, PenLine } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const PLANNED = [
  { icon: ImageIcon, name: "AI Upscaler", desc: "Upscale images 2×/4× without quality loss using browser-based AI models.", tag: "Experimental" },
  { icon: Sparkles, name: "Anime Filter", desc: "Transform photos into anime-style artwork with one click.", tag: "Fun" },
  { icon: PenLine, name: "Smart Sketch", desc: "Convert photos into realistic pencil sketches or line art.", tag: "Creative" },
  { icon: Wand2, name: "Background Remover", desc: "Remove backgrounds from images instantly using AI segmentation.", tag: "Useful" },
];

export default function AILabClient() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (!email.includes("@")) { toast.error("Enter a valid email."); return; }
    setJoined(true);
    toast.success("You're on the waitlist!");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
              <Zap className="w-4 h-4" /> Coming Soon
            </div>
            <h1 className="text-5xl font-black tracking-tight">AI Creative Lab</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Experimental AI-powered image tools — all running locally in your browser. No GPU server required.
            </p>
          </div>

          {/* Planned tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLANNED.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-primary/10 bg-secondary/20 space-y-3 opacity-75"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="text-[10px] uppercase font-black">{tool.tag}</Badge>
                </div>
                <div>
                  <h3 className="font-black">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tool.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Waitlist */}
          <div className="p-8 rounded-2xl border border-primary/10 bg-primary/5 text-center space-y-4">
            <h2 className="text-2xl font-black">Get Early Access</h2>
            <p className="text-muted-foreground text-sm">Be the first to try AI tools when they launch.</p>
            {!joined ? (
              <div className="flex gap-2 max-w-sm mx-auto">
                <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl" onKeyDown={(e) => e.key === "Enter" && handleJoin()} />
                <Button className="gap-1 rounded-xl shrink-0" onClick={handleJoin}>Join <ArrowRight className="w-3 h-3" /></Button>
              </div>
            ) : (
              <p className="text-green-500 font-bold">You&apos;re on the list! 🎉</p>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
