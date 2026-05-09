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
  Eye,
  EyeOff,
  Zap,
  Globe,
  Cpu,
  ArrowRight,
  Shield,
  FileSearch,
  KeyRound
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FAQ } from "@/components/shared/FAQ";
import { PASSWORD_GENERATOR_FAQ } from "@/lib/faq-content";

export default function PasswordGeneratorClient() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(24);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
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
    setTimeout(() => setPassword(result), 0);
  };

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    const charsetSize = 
      (options.uppercase ? 26 : 0) + 
      (options.lowercase ? 26 : 0) + 
      (options.numbers ? 10 : 0) + 
      (options.symbols ? 32 : 0);
    
    if (charsetSize === 0) return { label: "N/A", color: "text-muted-foreground", bg: "bg-muted/10", score: 0 };

    const entropy = length * Math.log2(charsetSize);
    
    if (entropy > 100) return { label: "Excellent", color: "text-emerald-500", bg: "bg-emerald-500/10", score: 4 };
    if (entropy > 80) return { label: "Very Strong", color: "text-green-500", bg: "bg-green-500/10", score: 3 };
    if (entropy > 60) return { label: "Strong", color: "text-blue-500", bg: "bg-blue-500/10", score: 2 };
    if (entropy > 40) return { label: "Fair", color: "text-yellow-500", bg: "bg-yellow-500/10", score: 1 };
    return { label: "Weak", color: "text-red-500", bg: "bg-red-500/10", score: 0 };
  };

  const strength = getStrength();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />

      <main className="flex-grow relative z-10">
        {/* HERO SECTION */}
        <section className="pt-12 pb-32 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-12"
            >
              {/* Header */}
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-xs font-black uppercase tracking-[0.2em] text-primary bg-primary/5">Advanced Security Engineering</Badge>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading leading-tight">
                  Secure Password <span className="text-primary">Generator</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium">
                  Generate high-entropy passwords securely in your browser with cryptographically strong random values.
                </p>
                
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-500/5">
                    <Lock className="w-4 h-4" /> <span>Local Processing</span>
                  </Badge>
                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 py-2 px-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-blue-500/5">
                    <ShieldCheck className="w-4 h-4" /> <span>Zero Upload</span>
                  </Badge>
                  <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 py-2 px-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-orange-500/5">
                    <Zap className="w-4 h-4" /> <span>Instant Speed</span>
                  </Badge>
                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 py-2 px-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-purple-500/5">
                    <Fingerprint className="w-4 h-4" /> <span>CSPRNG Engine</span>
                  </Badge>
                </div>
              </div>

              {/* Tool Card */}
              <div className="max-w-2xl mx-auto p-10 rounded-[40px] glass-card shadow-2xl space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <KeyRound className="w-40 h-40" />
                </div>

                {/* Password Display */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Generated Secret</Label>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setShowPassword(!showPassword)} className="text-primary hover:text-primary/80 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={generatePassword} className="text-primary hover:text-primary/80 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative group/field">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[28px] blur opacity-10 group-hover/field:opacity-25 transition duration-1000" />
                    <div 
                      className={cn(
                        "relative flex items-center justify-between p-8 rounded-[24px] bg-card/50 border border-border/50 text-3xl font-mono break-all min-h-[6rem] transition-all",
                        !showPassword && "blur-md select-none"
                      )}
                    >
                      <span className="flex-grow">{password || "..."}</span>
                    </div>
                    <Button 
                       onClick={copyToClipboard}
                       className={cn(
                         "absolute right-4 top-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl shadow-2xl transition-all",
                         copied ? "bg-emerald-500 hover:bg-emerald-600 text-emerald-50" : "bg-primary hover:bg-primary/90 text-primary-foreground"
                       )}
                     >
                       {copied ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                     </Button>
                  </div>

                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Strength:</span>
                      <Badge variant="outline" className={cn("rounded-full px-4 py-1 border-current border-opacity-20 font-black uppercase tracking-widest text-[9px]", strength.bg, strength.color)}>
                        {strength.label}
                      </Badge>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/60 flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5" /> Web Crypto API (CSPRNG)
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-border">
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col gap-1">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Complexity</Label>
                        <p className="text-[8px] font-black text-primary uppercase tracking-widest italic">Length: {length} Bits</p>
                      </div>
                      <span className="text-2xl font-black text-primary italic font-heading">{length}</span>
                    </div>
                    <Slider 
                      value={[length]} 
                      onValueChange={(v) => setLength(Array.isArray(v) ? v[0] : v)} 
                      max={64} 
                      min={8} 
                      step={1} 
                      className="py-4"
                    />
                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex gap-4">
                      <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                      <p className="text-[10px] text-muted-foreground font-medium leading-relaxed uppercase tracking-wider">
                        Industry standards recommend at least 16 characters with a mix of charsets for sensitive accounts.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(options).map(([key, value]) => (
                      <div key={key} className="group/opt flex items-center justify-between p-4 rounded-2xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer" onClick={() => setOptions(prev => ({ ...prev, [key]: !value }))}>
                        <div className="flex flex-col">
                          <Label className="capitalize text-xs font-black tracking-widest text-foreground group-hover/opt:text-primary transition-colors">{key}</Label>
                          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                            {key === 'uppercase' && 'A-Z characters'}
                            {key === 'lowercase' && 'a-z characters'}
                            {key === 'numbers' && '0-9 digits'}
                            {key === 'symbols' && '!@#$%^&* special'}
                          </span>
                        </div>
                        <Checkbox 
                          id={key} 
                          checked={value} 
                          onCheckedChange={(checked) => setOptions(prev => ({ ...prev, [key]: !!checked }))}
                          className="w-6 h-6 rounded-lg data-[state=checked]:bg-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full h-16 rounded-3xl gap-4 font-black text-lg uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" 
                  onClick={generatePassword}
                >
                  <RefreshCw className="w-6 h-6" />
                  Regenerate Identity
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECURITY ARCHITECTURE SECTION */}
        <section className="py-32 border-t border-border relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('/site-bg.webp')] bg-repeat" />
           <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-10">
                    <Badge className="bg-primary/10 text-primary border-primary/20 py-2 px-6 rounded-full uppercase tracking-widest text-[10px] font-black italic">Next-Gen Privacy</Badge>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading">The Science of <br /><span className="text-primary">True Randomness</span></h2>
                    <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                       SafeTools doesn't just shuffle characters. We leverage the **Web Crypto API (CSPRNG)**, 
                       the most secure way to generate random values in a browser environment.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       {[
                          { title: "Non-Deterministic", desc: "Values are mathematically impossible to predict.", icon: Zap },
                          { title: "Entropy Focused", desc: "Maximum variability per character byte.", icon: Cpu },
                          { title: "Offline First", desc: "Zero network latency, 100% security.", icon: Globe },
                          { title: "Browser Isolated", desc: "Memory is cleared after generation.", icon: Shield }
                       ].map((item, i) => (
                          <div key={i} className="flex gap-4">
                             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20"><item.icon className="w-5 h-5 text-primary" /></div>
                             <div>
                                <h4 className="text-sm font-black uppercase italic">{item.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
                 <div className="relative">
                    <div className="absolute -inset-10 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="relative p-10 rounded-[50px] glass-card border border-border shadow-2xl">
                       <pre className="text-[10px] font-mono text-primary/60 leading-relaxed overflow-x-auto">
{`const array = new Uint32Array(length);
window.crypto.getRandomValues(array);

// High-Entropy Byte Mapping
for (let i = 0; i < length; i++) {
  result += allowedChars.charAt(
    array[i] % allowedChars.length
  );
}`}
                       </pre>
                       <div className="mt-8 p-6 rounded-3xl bg-primary/10 border border-primary/20">
                          <p className="text-xs font-black uppercase tracking-widest text-primary italic">Developer Verified Architecture</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* PRIVACY COMMITMENT */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto p-12 rounded-[40px] glass-card text-center space-y-8">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-4xl font-black uppercase italic font-heading">Our Privacy Commitment</h3>
              <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed italic">
                "Your generated secrets never leave your device. All randomness is extracted locally inside your browser."
              </blockquote>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Unlike cloud-based password generators, SafeTools provides a true "Zero-Server" experience. 
                Your security is maintained within the isolation of your local browser environment.
              </p>
            </div>
          </div>
        </section>

        {/* RELATED SECURITY TOOLS */}
        <section className="py-32 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading">Related <span className="text-primary">Security Tools</span></h2>
                <p className="text-lg text-muted-foreground font-medium">Protect your accounts with stronger passwords and privacy-first security tools.</p>
              </div>

                {/* Related Security Tools Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { title: "Password Checker", desc: "Analyze strength and entropy.", href: "/privacy/password-checker", icon: Fingerprint, color: "text-blue-500 bg-blue-500/10" },
                    { title: "File Encryption", desc: "Military-grade AES-256 Vault.", href: "/privacy/vault", icon: Lock, color: "text-emerald-500 bg-emerald-500/10" },
                    { title: "Secure Notes", desc: "Self-destructing encrypted notes.", href: "/privacy/secure-notes", icon: FileSearch, color: "text-orange-500 bg-orange-500/10" },
                    { title: "Metadata Scrubber", desc: "Remove EXIF and tracking data.", href: "/security/metadata-cleaner", icon: ShieldCheck, color: "text-purple-500 bg-purple-500/10" }
                  ].map((tool) => (
                    <Link key={tool.title} href={tool.href} className="p-8 rounded-[32px] glass-card hover:border-primary/50 transition-all group">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", tool.color)}>
                      <tool.icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-black uppercase italic mb-2">{tool.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.desc}</p>
                    <div className="pt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Tool <ArrowRight className="w-3 h-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO USE SECTION */}
        <section className="py-32 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto space-y-20">
              <div className="text-center space-y-4">
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-[10px] font-black uppercase tracking-[0.2em] text-primary">Operational Guide</Badge>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading">How to Generate <br /><span className="text-primary">Perfect Secrets</span></h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { step: "01", title: "Configure Payload", desc: "Select the character sets required by your target platform. We recommend enabling all options for maximum entropy." },
                  { step: "02", title: "Set Bit Length", desc: "Use the slider to define your password's length. 24+ characters provide professional-grade protection against brute force." },
                  { step: "03", title: "Local Extraction", desc: "Click regenerate to extract a fresh secret. Copy it instantly to your clipboard—it never touches our servers." }
                ].map((item, i) => (
                  <div key={i} className="space-y-6 p-10 rounded-[40px] glass-card relative overflow-hidden group hover:border-primary/40 transition-all">
                    <div className="text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors italic font-heading">{item.step}</div>
                    <h3 className="text-2xl font-black uppercase italic font-heading">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON HUB */}
        <section className="py-32 bg-primary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading">SafeTools vs. <br /><span className="text-primary">Cloud Generators</span></h2>
                <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                  Most online password generators are "Black Boxes." You have no way of knowing if your generated password is being logged on a remote server.
                </p>
                <div className="space-y-4">
                  {[
                    { feature: "Randomness Source", cloud: "Server-Side Software", safe: "Hardware-Level CSPRNG" },
                    { feature: "Data Transmission", cloud: "Sent over HTTP/S", safe: "0 Bytes Transmitted" },
                    { feature: "Storage Policy", cloud: "Unknown/Logged", safe: "Volatile Memory Only" },
                    { feature: "Offline Access", cloud: "Requires Internet", safe: "Works 100% Offline" }
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-border">
                      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{row.feature}</span>
                      <div className="flex gap-4 items-center">
                        <span className="text-[10px] line-through text-red-500/50 font-bold uppercase">{row.cloud}</span>
                        <ArrowRight className="w-3 h-3 text-primary" />
                        <span className="text-[10px] text-emerald-500 font-bold uppercase">{row.safe}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative p-10 rounded-[50px] glass-card shadow-2xl space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><ShieldCheck className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-black uppercase italic font-heading">The Browser Advantage</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  By using the **Web Crypto API**, SafeTools ensures that your password is never even "seen" by our own application code in a readable state on a server. The extraction happens in a sandbox environment that is destroyed the moment you close the tab.
                </p>
                <ul className="space-y-3">
                  {["Zero logging risk", "No Man-in-the-Middle attacks", "Mathematically verifiable randomness"].map((point, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ENTROPY SCALE SECTION */}
        <section className="py-32 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-16 text-center">
              <div className="space-y-4">
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-[10px] font-black uppercase tracking-[0.2em] text-primary">Technical Specifications</Badge>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic font-heading">The Entropy <span className="text-primary">Scale</span></h2>
                <p className="text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                  Entropy measures the absolute unpredictability of a secret. The higher the bit-count, the more centuries it would take modern supercomputers to crack your password.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Weak", bits: "0 - 40", desc: "Cracked in seconds.", color: "text-red-500" },
                  { label: "Fair", bits: "41 - 60", desc: "Vulnerable to clusters.", color: "text-yellow-500" },
                  { label: "Strong", bits: "61 - 100", desc: "Resistant for years.", color: "text-blue-500" },
                  { label: "Excellent", bits: "100+", desc: "Mathematically safe.", color: "text-emerald-500" }
                ].map((item, i) => (
                  <div key={i} className="p-8 rounded-3xl glass-card space-y-4">
                    <div className={cn("text-2xl font-black italic font-heading", item.color)}>{item.label}</div>
                    <div className="text-xs font-mono font-black text-muted-foreground uppercase tracking-widest">{item.bits} Bits</div>
                    <div className="h-[1px] bg-border" />
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PASSWORD HYGIENE SECTION */}
        <section className="py-32 bg-background relative">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto space-y-20">
               <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="space-y-6 max-w-2xl">
                     <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading leading-tight">Mastering Password <br /><span className="text-primary">Hygiene</span></h2>
                     <p className="text-xl text-muted-foreground font-medium">A secure password is only the first step. Follow these industry standards to protect your digital footprint.</p>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6 rounded-full uppercase tracking-widest text-[10px] font-black">2026 Security Standards</Badge>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                     { title: "Unique for Every Site", desc: "Never reuse a password. If one service is breached, your entire identity becomes vulnerable. Use a generator for every new account." },
                     { title: "Enable Multi-Factor (MFA)", desc: "A strong password is your first line of defense, but MFA (TOTP, Security Keys) provides a critical second layer." },
                     { title: "Avoid Personal Data", desc: "Never include birthdays, pet names, or addresses. Our generator eliminates these predictable patterns entirely." },
                     { title: "Use a Password Manager", desc: "Store your high-entropy SafeTools passwords in a reputable, encrypted manager so you never have to remember them." }
                  ].map((tip, i) => (
                     <div key={i} className="p-10 rounded-[40px] bg-gradient-to-br from-card to-background border border-border hover:border-primary/30 transition-all group">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><CheckCircle2 className="w-5 h-5" /></div>
                           <h3 className="text-2xl font-black uppercase italic font-heading">{tip.title}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed font-medium">{tip.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-32 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
               <div className="mb-20 text-center space-y-4">
                  <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-[10px] font-black uppercase tracking-[0.2em] text-primary">Intelligence Hub</Badge>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading">Frequently Asked <span className="text-primary">Questions</span></h2>
               </div>
               <FAQ 
                 items={PASSWORD_GENERATOR_FAQ || []}
                 title=""
                 description=""
               />
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-32 relative overflow-hidden">
           <div className="absolute inset-0 bg-primary opacity-[0.02] pointer-events-none" />
           <div className="container mx-auto px-6 text-center">
              <div className="max-w-3xl mx-auto space-y-10">
                 <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic font-heading">Ready for <span className="text-primary">Maximum Security?</span></h2>
                 <p className="text-xl text-muted-foreground font-medium">Protect your digital identity with tools that respect your privacy.</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="rounded-2xl h-16 px-10 font-black uppercase tracking-widest gap-3" render={<Link href="/privacy/password-checker" />} nativeButton={false}>
                       Check Strength <Fingerprint className="w-5 h-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-2xl h-16 px-10 font-black uppercase tracking-widest gap-3 border-border" render={<Link href="/privacy/vault" />} nativeButton={false}>
                       Open Secure Vault <Lock className="w-5 h-5" />
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
