"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Copy,
  RefreshCw,
  Lock,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  Zap,
  Shield,
  ArrowRight,
  DownloadCloud,
  Cpu,
  Layers,
  Smartphone,
  Check,
  Share2,
  Settings2
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ShareTool } from "@/components/shared/ShareTool";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SecurityToolsClient() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(32);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = () => {
    const charSets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    };

    let allowedChars = "";
    if (options.uppercase) allowedChars += charSets.uppercase;
    if (options.lowercase) allowedChars += charSets.lowercase;
    if (options.numbers) allowedChars += charSets.numbers;
    if (options.symbols) allowedChars += charSets.symbols;

    if (allowedChars === "") {
      setPassword("");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += allowedChars.charAt(array[i] % allowedChars.length);
    }
    // Use setTimeout to avoid synchronous setState during effect (React 18 recommendation)
    setTimeout(() => setPassword(result), 0);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    const entropy = length * Math.log2(
      (options.uppercase ? 26 : 0) +
      (options.lowercase ? 26 : 0) +
      (options.numbers ? 10 : 0) +
      (options.symbols ? 32 : 0)
    );
    if (entropy > 120) return { label: "Exceptional", color: "text-emerald-500", bg: "bg-emerald-500/10", score: 100 };
    if (entropy > 90) return { label: "Strong", color: "text-blue-500", bg: "bg-blue-500/10", score: 80 };
    if (entropy > 60) return { label: "Moderate", color: "text-yellow-500", bg: "bg-yellow-500/10", score: 50 };
    return { label: "Weak", color: "text-red-500", bg: "bg-red-500/10", score: 20 };
  };

  const strength = getStrength();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 custom-scrollbar">
      <Navbar />

      <main className="flex-grow container mx-auto px-8 py-16 md:py-24 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-primary/5 blur-[180px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-emerald-500/5 blur-[180px] rounded-full animate-pulse" />
          <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`, backgroundSize: '64px 64px' }} />
        </div>

        <div className="max-w-6xl mx-auto space-y-24 relative z-10">
          <Breadcrumbs />

          {/* Header */}
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]"
            >
              <Zap className="w-4 h-4" /> Cryptographic Entropy Lab
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none"
            >
              Security <span className="text-primary italic">Toolkit.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto font-medium italic leading-relaxed"
            >
              Generate high-entropy credentials using industry-standard random source APIs. <br className="hidden md:block" /> 100% local, no telemetry, absolute privacy.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Primary Generator Card */}
            <Card className="lg:col-span-8 p-12 bg-card border-border rounded-[4rem] shadow-xl dark:shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-5 transition-opacity">
                <Fingerprint className="w-48 h-48" />
              </div>

              <div className="space-y-12 relative z-10">
                {/* Password Display */}
                <div className="space-y-6">
                  <div className="relative">
                    <div className="flex items-center justify-between px-6 py-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">Generated Entropy String</span>
                       <Badge variant="outline" className={cn("text-[9px] px-4 py-1 rounded-full font-black uppercase tracking-widest italic transition-all", strength.bg, strength.color, "border-current border-opacity-20")}>
                         {strength.label} Strength
                       </Badge>
                    </div>
                    <div className="relative group/field">
                      <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-[2.5rem] blur opacity-0 group-hover/field:opacity-100 transition duration-1000" />
                      <div className="relative flex items-center gap-2 p-10 rounded-[2.5rem] bg-secondary/50 dark:bg-black/60 border border-border text-2xl md:text-4xl font-mono break-all min-h-[10rem] shadow-inner text-emerald-600 dark:text-emerald-400 group-hover/field:border-primary/40 transition-colors">
                        {password ? password : <span className="text-muted-foreground/20 italic">Configuration Void</span>}
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button size="icon" variant="ghost" onClick={generatePassword} className="w-12 h-12 rounded-2xl bg-background border border-border hover:bg-accent hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all">
                          <RefreshCw className="w-5 h-5" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={copyToClipboard} 
                          className={cn("w-12 h-12 rounded-2xl border transition-all", copied ? "bg-emerald-500 border-emerald-500 text-white" : "bg-background border-border hover:bg-accent hover:border-primary/40 text-primary")}
                        >
                          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Configuration Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-border">
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground italic">Entropy Length</Label>
                      <span className="font-mono font-black text-2xl text-primary italic">{length} BIT</span>
                    </div>
                    <Slider 
                      value={[length]} 
                      onValueChange={(v) => setLength(Array.isArray(v) ? v[0] : v)} 
                      max={64} 
                      min={8} 
                      step={1} 
                      className="py-4"
                    />
                    <div className="flex items-start gap-4 p-6 rounded-[2rem] bg-secondary/50 border border-border text-[10px] text-muted-foreground italic leading-relaxed">
                      <ShieldCheck className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                      <span>The NIST standard recommends a minimum of 16 characters for high-value accounts. Our lab supports up to 64-bit entropy sequences.</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <Label className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground italic mb-2">Character Protocols</Label>
                    {Object.entries(options).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/30 border border-border hover:border-primary/20 transition-all cursor-pointer" onClick={() => setOptions(prev => ({ ...prev, [key]: !value }))}>
                        <Label htmlFor={key} className="capitalize text-xs font-black tracking-widest text-muted-foreground cursor-pointer italic">
                          {key} Characters
                        </Label>
                        <Checkbox 
                          id={key} 
                          checked={value} 
                          onCheckedChange={(checked) => setOptions(prev => ({ ...prev, [key]: !!checked }))}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary h-5 w-5 rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full h-24 rounded-[2.5rem] bg-primary hover:bg-primary/90 text-white font-black text-xl gap-4 shadow-2xl shadow-primary/30 active:scale-95 transition-all group italic"
                  onClick={generatePassword}
                >
                  <RefreshCw className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" />
                  RE-GENERATE SECURE IDENTITY
                </Button>
              </div>
            </Card>

            {/* Side Info Panel */}
            <div className="lg:col-span-4 space-y-8">
               <Card className="p-8 bg-card border-border rounded-[3rem] space-y-8 shadow-lg">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                     <Settings2 className="w-4 h-4" /> Studio Matrix
                  </h3>
                  <div className="space-y-6">
                     {[
                       { label: "RNG Engine", value: "Web Crypto", icon: Cpu },
                       { label: "Algorithm", value: "CTR-DRBG", icon: Layers },
                       { label: "Data State", value: "Local Only", icon: ShieldCheck },
                       { label: "Sync Level", value: "Zero-Cloud", icon: RefreshCw },
                     ].map((stat, i) => (
                       <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border group">
                         <div className="flex items-center gap-3">
                           <stat.icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                           <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider italic">{stat.label}</span>
                         </div>
                         <span className="text-[10px] font-black text-foreground italic">{stat.value}</span>
                       </div>
                     ))}
                  </div>
               </Card>

               <div className="p-8 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 space-y-4 shadow-xl group">
                  <div className="flex items-center gap-3">
                    <Lock className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-black uppercase tracking-widest italic">Sovereign Protocol</h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-medium italic">
                    Unlike standard generators, SafeTools does not log, track, or even see your passwords. The bitstreams exist only in your browser's volatile RAM until you copy or refresh.
                  </p>
               </div>

              <ShareTool title="Security Toolkit Pro" />
            </div>
          </div>

          {/* SEO Content: FAQ & Information */}
          <section className="py-24 border-t border-border space-y-24">
            <div className="max-w-4xl mx-auto space-y-20">
              <div className="space-y-6 text-center">
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                  Security Engineering Knowledge
                </Badge>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-foreground">Entropy & <span className="text-primary">Intelligence.</span></h2>
                <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto italic leading-relaxed">Understanding the mathematics of high-fidelity password generation.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    q: "What makes a password 'High-Entropy'?",
                    a: "Entropy is a measure of randomness. A high-entropy password is statistically difficult for attackers to guess or brute-force. By using 24+ characters and mixing protocols, you ensure your password has 128+ bits of entropy, which would take billions of years to crack with current hardware."
                  },
                  {
                    q: "Why is local generation safer?",
                    a: "Online password generators transmit the generated password over the internet. Even if encrypted via HTTPS, the server itself has a copy of your password. SafeTools uses the 'window.crypto.getRandomValues' API to generate values directly on your local device."
                  },
                  {
                    q: "What is the Web Crypto API?",
                    a: "It is a standard browser API that provides cryptographically secure random number generators (CSPRNG). Unlike 'Math.random()', which is predictable, Web Crypto uses system-level entropy sources like hardware interrupts to ensure true randomness."
                  },
                  {
                    q: "Should I use the same password twice?",
                    a: "Never. Security experts recommend using a unique, high-entropy password for every single account. Combine our Security Toolkit with a local password manager for the highest level of protection."
                  }
                ].map((faq, i) => (
                  <div key={i} className="p-10 bg-card border border-border space-y-4 hover:border-primary/20 transition-all group rounded-[2rem] shadow-sm">
                    <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-primary transition-colors flex items-center gap-4 italic text-foreground">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs italic">Q</div>
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-medium pl-12 italic border-l border-border">{faq.a}</p>
                  </div>
                ))}
              </div>

              {/* Technical Analysis */}
              <div className="p-12 border border-border bg-gradient-to-br from-secondary/30 to-transparent rounded-[3rem] space-y-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent" />
                <div className="flex items-center gap-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic text-foreground">CSPRNG Thread Architecture</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed font-medium italic text-lg">
                  SafeTools utilizes a non-deterministic random number generator. By tapping into the underlying OS entropy pool via the **SubtleCrypto** layer, we generate bitstreams that are resistant to statistical analysis and side-channel attacks.
                  This ensures that every password generated in our laboratory is truly unique and impossible to reproduce.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Protocol</span>
                    <p className="text-sm font-black text-primary uppercase italic">CSPRNG</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Entropy Source</span>
                    <p className="text-sm font-black text-primary uppercase italic">Hardware Lab</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Storage</span>
                    <p className="text-sm font-black text-primary uppercase italic">Volatile RAM</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Privacy</span>
                    <p className="text-sm font-black text-primary uppercase italic">Absolute Zero</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* Structured Data: SoftwareApplication & FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Security Toolkit Pro",
            "operatingSystem": "Web-based",
            "applicationCategory": "SecurityApplication",
            "description": "Professional-grade secure password generator. Uses Web Crypto API for local, high-entropy credential generation.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Cryptographically Secure Generation",
              "High-Entropy Bitstreams",
              "100% Local Processing",
              "Web Crypto API Optimized",
              "Zero-Tracking Security"
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://safetools.space"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Security Tools",
                "item": "https://safetools.space/security"
              }
            ]
          })
        }}
      />
    </div>
  );
}
