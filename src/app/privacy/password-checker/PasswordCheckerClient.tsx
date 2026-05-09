"use client";

import React, { useState, useCallback, useTransition } from "react";
import { motion } from "framer-motion";
import { 
  KeyRound, Eye, EyeOff, ShieldCheck, ShieldAlert, 
  Shield, ShieldX, Info, Zap, Lock, Globe, 
  FileSearch, ChevronDown, CheckCircle2, AlertTriangle, Cpu, ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import Link from "next/link";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { checkPassword, type PasswordStrengthResult } from "@/lib/privacy/passwordStrength";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/shared/Footer";
import { FAQ } from "@/components/shared/FAQ";
import { PASSWORD_CHECKER_FAQ } from "@/lib/faq-content";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

const SCORE_ICONS = [ShieldX, ShieldAlert, Shield, ShieldCheck, ShieldCheck];
const SCORE_BG = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"];

export default function PasswordCheckerClient() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<PasswordStrengthResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback((val: string) => {
    setPassword(val);
    if (!val) { setResult(null); return; }
    startTransition(async () => {
      const r = await checkPassword(val);
      setResult(r);
    });
  }, []);

  const ScoreIcon = result ? SCORE_ICONS[result.score] : Shield;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />
      
      <main className="flex-grow relative z-10">
        {/* HERO / TOOL SECTION */}
        <section className="pt-12 pb-32 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-12"
            >
              {/* Header */}
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-xs font-black uppercase tracking-[0.2em] text-primary bg-primary/5">Privacy-First Security Tool</Badge>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic font-heading leading-tight">
                  Password Strength <span className="text-primary">Checker</span>
                </h1>
                <p className="text-xl text-muted-foreground font-medium">
                  Analyze password strength securely in your browser with zero uploads, zero tracking, and privacy-first protection.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-500/5">
                    <Lock className="w-4 h-4" /> <span>Local Processing</span>
                  </Badge>
                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 py-2 px-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-blue-500/5">
                    <ShieldCheck className="w-4 h-4" /> <span>Zero Upload</span>
                  </Badge>
                  <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 py-2 px-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-orange-500/5">
                    <Zap className="w-4 h-4" /> <span>Instant Analysis</span>
                  </Badge>
                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 py-2 px-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-purple-500/5">
                    <EyeOff className="w-4 h-4" /> <span>No Tracking</span>
                  </Badge>
                </div>
              </div>

              {/* Tool Card */}
              <div className="max-w-xl mx-auto p-8 rounded-[40px] glass-card border border-border shadow-2xl space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <Lock className="w-32 h-32" />
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Enter a Password to Analyze</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Type any password…"
                      value={password}
                      onChange={(e) => handleChange(e.target.value)}
                      className="rounded-2xl h-14 text-lg pr-14 bg-muted/20 border-border/50 focus:border-primary/50 transition-all text-foreground"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 flex items-center gap-1.5">
                      <Cpu className="w-3 h-3" /> Browser-Side Computation
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500/60 flex items-center gap-1.5">
                      <Globe className="w-3 h-3" /> Works Offline
                    </span>
                  </div>
                </div>

                {/* Result Display */}
                {result ? (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-8 pt-4">
                    {/* Score bar */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-xl bg-opacity-10", SCORE_BG[result.score].replace('bg-', 'text-'))}>
                            <ScoreIcon className="w-6 h-6" style={{ color: result.color }} />
                          </div>
                          <span className="font-black text-2xl uppercase italic tracking-tighter" style={{ color: result.color }}>{result.label}</span>
                        </div>
                        <span className="text-sm font-mono text-muted-foreground font-bold">ENTROPY: ~{result.entropy} BITS</span>
                      </div>
                      <div className="flex gap-2">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-3 flex-1 rounded-full transition-all duration-700 ${i <= result.score ? SCORE_BG[result.score] : "bg-muted/20"}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-6 rounded-3xl bg-muted/10 border border-border/50 space-y-2 group/stat">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Crack Time</p>
                          <Zap className="w-3.5 h-3.5 text-primary opacity-50" />
                        </div>
                        <p className="text-xl font-black italic tracking-tight uppercase tracking-widest">{result.crackTime}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase">Brute Force Resistance</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-muted/10 border border-border/50 space-y-2 group/stat">
                         <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Complexity</p>
                          <Shield className="w-3.5 h-3.5 text-primary opacity-50" />
                        </div>
                        <p className="text-xl font-black italic tracking-tight uppercase tracking-widest">{result.score >= 3 ? 'Professional' : 'Basic'}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase">Pattern Analysis</p>
                      </div>
                    </div>

                    {/* Feedback */}
                    {(result.warning || result.suggestions.length > 0) && (
                      <div className="p-6 rounded-3xl bg-background/50 border border-border/50 space-y-4">
                        {result.warning && (
                          <div className="flex gap-3 text-sm font-bold text-[#F59E0B] italic">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            {result.warning}
                          </div>
                        )}
                        {result.suggestions.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Security Roadmap</p>
                            <ul className="space-y-2">
                              {result.suggestions.map((s, i) => (
                                <li key={i} className="flex gap-3 text-xs font-bold text-foreground">
                                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="py-12 text-center space-y-4 opacity-30 group-hover:opacity-100 transition-opacity">
                    <div className="w-20 h-20 rounded-[30px] bg-secondary flex items-center justify-center mx-auto mb-4">
                      <KeyRound className="w-10 h-10" />
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest italic">Awaiting Password Input</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* PROFESSIONAL CONTENT: FEATURES & PRIVACY */}
        <section className="py-32 bg-card/40 backdrop-blur-sm border-y border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
               {/* Features */}
               <div className="space-y-8 p-10 rounded-[40px] glass-card border border-border">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Zap className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-black uppercase italic font-heading">Core Features</h3>
                  <ul className="space-y-4">
                    {[
                      "Real-time strength analysis",
                      "Entropy and complexity scoring",
                      "Common pattern detection",
                      "Local browser-side processing",
                      "Zero password storage",
                      "Breach indicators check"
                    ].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {f}
                      </li>
                    ))}
                  </ul>
               </div>

               {/* Privacy Protection */}
               <div className="space-y-8 p-10 rounded-[40px] bg-primary/5 border border-primary/20">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><ShieldCheck className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-black uppercase italic font-heading">Privacy Protection</h3>
                  <ul className="space-y-4">
                    {[
                      "Passwords never leave your device",
                      "No server-side logging",
                      "No analytics tracking on input",
                      "All calculations performed locally",
                      "Open-source local algorithm",
                      "Works offline as a PWA"
                    ].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
               </div>

               {/* What We Analyze */}
               <div className="space-y-8 p-10 rounded-[40px] glass-card border border-border">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><FileSearch className="w-6 h-6" /></div>
                  <h3 className="text-2xl font-black uppercase italic font-heading">What We Analyze</h3>
                  <ul className="space-y-4">
                    {[
                      "Password length & entropy",
                      "Character diversity",
                      "Predictable patterns",
                      "Dictionary word usage",
                      "Repeated sequences",
                      "Estimated crack time"
                    ].map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                        <ArrowRight className="w-4 h-4 text-primary/40" /> {f}
                      </li>
                    ))}
                  </ul>
               </div>
            </div>
          </div>
        </section>

        {/* SECURITY ARCHITECTURE & BEST PRACTICES */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
               {/* Best Practices */}
               <div className="space-y-10">
                  <div className="space-y-4 text-left">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6 rounded-full uppercase tracking-widest text-[10px] font-black italic">Expert Guidance</Badge>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading">Best Practices for <br /> <span className="text-primary">Strong Passwords</span></h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                      { title: "Length First", desc: "Use at least 14–16 characters for maximum entropy." },
                      { title: "No Reuse", desc: "Unique passwords for every service prevent cascade breaches." },
                      { title: "Passphrases", desc: "Prefer long passphrases over complex but short strings." },
                      { title: "MFA Active", desc: "Always enable multi-factor authentication as a secondary layer." }
                    ].map((item, i) => (
                      <div key={i} className="space-y-3 p-6 rounded-3xl glass-card border border-border">
                        <h4 className="font-black uppercase italic text-sm text-primary">{item.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                    <div>
                      <h4 className="text-sm font-black uppercase text-red-500 mb-1">Important Notice</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        No online password checker can guarantee complete security. For highly sensitive credentials, always use offline password management and hardened security tools.
                      </p>
                    </div>
                  </div>
               </div>

               {/* Security Architecture */}
               <div className="space-y-10">
                  <div className="p-10 rounded-[40px] glass-card border border-border space-y-8">
                    <h3 className="text-3xl font-black uppercase italic font-heading">Security Architecture</h3>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                      SafeTools is built using privacy-first principles to ensure maximum data sovereignty.
                    </p>
                    <div className="space-y-6">
                      {[
                        { title: "Browser-side computation", icon: Cpu },
                        { title: "Secure cryptographic methods", icon: Lock },
                        { title: "No plaintext password storage", icon: ShieldCheck },
                        { title: "Minimal external requests", icon: Globe },
                        { title: "Hardened frontend validation", icon: Zap }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 border-b border-border pb-4 last:border-0">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><item.icon className="w-5 h-5" /></div>
                          <p className="text-sm font-black uppercase italic tracking-tight">{item.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 rounded-[32px] bg-muted/10 border border-border space-y-4">
                    <h4 className="text-sm font-black uppercase italic">Deployment Standard</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {["HTTPS Enforced", "Strict CSP", "CSRF Protected", "No Secrets in Frontend"].map((s, i) => (
                        <li key={i} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
               </div>
            </div>
          </div>
        </section>
        {/* WHY IT MATTERS SECTION */}
        <section className="py-32 bg-gradient-to-b from-transparent to-card/20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading">Why Password Strength <br /> <span className="text-primary">Actually Matters</span></h2>
                <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">In an era of automated brute-force attacks and sophisticated credential stuffing, your password is the first and often only line of defense for your digital identity.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-[32px] glass-card border border-border space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500"><AlertTriangle className="w-5 h-5" /></div>
                  <h4 className="text-xl font-black uppercase italic">Brute Force Resistance</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Modern computers can test billions of password combinations per second. A 6-character password can be cracked almost instantly, while a 12-character password with high entropy could take centuries.</p>
                </div>
                <div className="p-8 rounded-[32px] glass-card border border-border space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><Globe className="w-5 h-5" /></div>
                  <h4 className="text-xl font-black uppercase italic">Credential Stuffing</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Hackers use databases of leaked passwords from previous breaches to 'stuff' into other services. If you reuse a password, one breach on a small site can compromise your entire digital life.</p>
                </div>
                <div className="p-8 rounded-[32px] glass-card border border-border space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><ShieldCheck className="w-5 h-5" /></div>
                  <h4 className="text-xl font-black uppercase italic">Entropy over Complexity</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Complexity (using @, #, $) is good, but length (entropy) is better. A 20-character passphrase of simple words is mathematically more secure than an 8-character 'complex' password.</p>
                </div>
                <div className="p-8 rounded-[32px] glass-card border border-border space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500"><Lock className="w-5 h-5" /></div>
                  <h4 className="text-xl font-black uppercase italic">Zero-Trust Security</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">By using a local-only checker like SafeTools, you ensure that even the tool you use to test your security isn't a point of failure. Your password stays in your RAM, never on a server.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRIVACY COMMITMENT */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto p-12 rounded-[40px] bg-background/60 backdrop-blur-3xl border border-primary/20 text-center space-y-8">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-4xl font-black uppercase italic font-heading">Our Privacy Commitment</h3>
              <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed italic">
                "Your password never leaves your device. All analysis happens locally inside your browser."
              </blockquote>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We believe security tools should never be a point of compromise. SafeTools is built on a zero-server architecture, 
                meaning we couldn't see your passwords even if we wanted to.
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: "Password Generator", desc: "Generate secure, high-entropy keys.", href: "/privacy/password-generator", icon: Zap, color: "text-blue-500 bg-blue-500/10" },
                  { title: "File Encryption", desc: "Military-grade AES-256 Vault.", href: "/privacy/vault", icon: Lock, color: "text-emerald-500 bg-emerald-500/10" },
                  { title: "Secure Notes", desc: "Self-destructing encrypted notes.", href: "/privacy/secure-notes", icon: FileSearch, color: "text-orange-500 bg-orange-500/10" },
                  { title: "Metadata Scrubber", desc: "Remove EXIF and tracking data.", href: "/security/metadata-cleaner", icon: ShieldCheck, color: "text-purple-500 bg-purple-500/10" }
                ].map((tool) => (
                  <Link key={tool.title} href={tool.href} className="p-8 rounded-[32px] glass-card border border-border hover:border-primary/50 transition-all group">
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

        {/* FAQ SECTION */}
        <section className="py-32 border-t border-border">
          <div className="container mx-auto px-6">
             <div className="max-w-4xl mx-auto">
                <div className="mb-16 text-center space-y-4">
                  <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-[10px] font-black uppercase tracking-[0.2em] text-primary">Intelligence Hub</Badge>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic font-heading">Frequently Asked <span className="text-primary">Questions</span></h2>
                </div>
                <FAQ items={PASSWORD_CHECKER_FAQ} />
             </div>
          </div>
        </section>

        {/* LINK CLOUD / SEO FOOTER */}
        <section className="py-20 bg-black/20 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">Related Security Protocols</h4>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  "Password Strength Meter", "Brute Force Estimator", "Entropy Calculator", 
                  "Local Password Audit", "Privacy-First Security", "Secure Passphrase Generator",
                  "Zero-Knowledge Testing", "Browser-Side Cryptography"
                ].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-xl bg-secondary/20 border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary hover:border-primary/30 transition-all cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
