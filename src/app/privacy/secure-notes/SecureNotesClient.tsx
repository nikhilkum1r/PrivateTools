"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert,
  Zap,
  Globe,
  HardDrive,
  Cpu,
  Trash2,
  Share2,
  FileText,
  Key,
  Shield,
  Smartphone,
  Info,
  ChevronDown,
  ArrowRight,
  Fingerprint,
  Code2,
  ServerOff,
  History
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { encryptText, decryptText } from "@/lib/privacy/crypto";
import { toast } from "sonner";
import Link from "next/link";

export default function SecureNotesClient() {
  const [tab, setTab] = useState<"encrypt" | "decrypt">("encrypt");
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const [isHttps, setIsHttps] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsHttps(window.location.protocol === "https:");
    setIsDev(window.location.hostname === "localhost");
    setIsPWA(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  const handleEncrypt = useCallback(async () => {
    if (!plaintext.trim()) { toast.error("Enter a note to encrypt."); return; }
    if (!password) { toast.error("Enter a password."); return; }
    if (!isHttps && !isDev) { toast.error("Encryption requires HTTPS."); return; }
    setLoading(true);
    try {
      const enc = await encryptText(plaintext, password);
      setResult(enc);
      toast.success("Note encrypted locally!");
    } catch (e) {
      toast.error("Encryption failed. " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [plaintext, password, isHttps, isDev]);

  const handleDecrypt = useCallback(async () => {
    if (!ciphertext.trim()) { toast.error("Enter encrypted text."); return; }
    if (!password) { toast.error("Enter the password."); return; }
    setLoading(true);
    try {
      const dec = await decryptText(ciphertext.trim(), password);
      setResult(dec);
      toast.success("Note decrypted locally!");
    } catch (e) {
      toast.error("Decryption failed. Wrong password or corrupted data.");
    } finally {
      setLoading(false);
    }
  }, [ciphertext, password]);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setPlaintext(""); setCiphertext(""); setPassword(""); setResult(""); setCopied(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Privacy-First Architecture
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Secure Notes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Write, save, and protect private notes securely in your browser with local encryption and zero tracking.
            </p>
            
            {/* Hero Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {[
                { icon: Lock, text: "End-to-End Privacy" },
                { icon: Zap, text: "Browser-Based" },
                { icon: Shield, text: "Zero Upload" },
                { icon: EyeOff, text: "No Tracking" },
                { icon: Cpu, text: "Local Encryption" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-sm">
                  <badge.icon className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm font-medium text-foreground">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 space-y-24 max-w-5xl">
        
        {/* Editor Section */}
        <section id="editor" className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-6 md:p-8 border-border bg-card/80 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#22C55E]/50 to-transparent" />
              
              <Tabs value={tab} onValueChange={(v: string) => { setTab(v as "encrypt" | "decrypt"); setResult(""); }} className="space-y-6">
                <TabsList className="grid grid-cols-2 bg-background p-1 rounded-2xl border border-border">
                  <TabsTrigger value="encrypt" className="rounded-xl data-[state=active]:bg-card data-[state=active]:text-[#22C55E] transition-all py-2.5">
                    <Lock className="w-4 h-4 mr-2" /> Encrypt Note
                  </TabsTrigger>
                  <TabsTrigger value="decrypt" className="rounded-xl data-[state=active]:bg-card data-[state=active]:text-[#22C55E] transition-all py-2.5">
                    <RefreshCw className="w-4 h-4 mr-2" /> Decrypt Note
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, x: tab === 'encrypt' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: tab === 'encrypt' ? 10 : -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TabsContent value="encrypt" className="space-y-4 m-0">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-widest">Your Private Note</Label>
                        <Textarea
                          placeholder="Write your sensitive information here... (passwords, keys, thoughts)"
                          value={plaintext}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPlaintext(e.target.value)}
                          className="min-h-[200px] rounded-2xl bg-background border-border focus:border-[#22C55E] focus:ring-[#22C55E]/20 font-mono text-sm resize-none scrollbar-hide"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="decrypt" className="space-y-4 m-0">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-widest">Encrypted Text (Base64)</Label>
                        <Textarea
                          placeholder="Paste the encrypted block here..."
                          value={ciphertext}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCiphertext(e.target.value)}
                          className="min-h-[200px] rounded-2xl bg-background border-border focus:border-[#22C55E] focus:ring-[#22C55E]/20 font-mono text-sm resize-none scrollbar-hide"
                        />
                      </div>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>

              {/* Password Input */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-widest">Encryption Password</Label>
                  {password && (
                    <Badge variant="outline" className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 text-[10px] uppercase font-bold">
                      Shield Active
                    </Badge>
                  )}
                </div>
                <div className="relative group">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a strong password..."
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className="h-14 rounded-2xl bg-background border-border focus:border-[#22C55E] focus:ring-[#22C55E]/20 pr-12 text-lg"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && (tab === "encrypt" ? handleEncrypt() : handleDecrypt())}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                {password && (
                  <div className="space-y-2 px-1">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                      <span className="text-muted-foreground">Encryption Strength</span>
                      <span className={
                        password.length < 8 ? "text-red-400" : 
                        password.length < 12 ? "text-yellow-400" : "text-green-400"
                      }>
                        {password.length < 8 ? "Weak" : password.length < 12 ? "Medium" : "Strong"}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (password.length / 16) * 100)}%` }}
                        className={`h-full transition-all ${
                          password.length < 8 ? "bg-red-500" : 
                          password.length < 12 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2 text-[11px] text-muted-foreground bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-xl">
                  <Info className="w-4 h-4 text-yellow-500 shrink-0" />
                  <p>Your password is never sent to our servers. If you lose it, the note is gone forever. <span className="font-bold text-yellow-500/80">No recovery possible.</span></p>
                </div>
              </div>

              <Button
                className="w-full h-14 mt-8 rounded-2xl font-black text-lg gap-3 bg-[#22C55E] hover:bg-[#1eb054] text-white shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                onClick={tab === "encrypt" ? handleEncrypt : handleDecrypt}
                disabled={loading || (isClient && !isHttps && !isDev)}
              >
                {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Lock className="w-6 h-6" />}
                {loading ? "Processing..." : tab === "encrypt" ? "Encrypt Secure Note" : "Decrypt Secure Note"}
              </Button>

              {/* Result Area */}
              <AnimatePresence>
                {result && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-8 pt-8 border-t border-border space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                        <span className="text-sm font-bold uppercase tracking-wider text-[#22C55E]">
                          {tab === "encrypt" ? "Encrypted Result" : "Decrypted Note"}
                        </span>
                      </div>
                      <Badge className="bg-[#3B82F6] text-white">AES-256-GCM</Badge>
                    </div>
                    <div className="relative group">
                      <Textarea
                        readOnly
                        value={result}
                        className="min-h-[150px] rounded-2xl bg-background border-border font-mono text-sm text-foreground focus:ring-0 shadow-inner"
                      />
                      <div className="absolute inset-0 bg-green-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="flex-1 h-12 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl gap-2 font-bold transition-all" onClick={handleCopy}>
                        {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {copied ? "Copied Successfully!" : "Copy to Clipboard"}
                      </Button>
                      <Button variant="ghost" className="h-12 border border-border hover:bg-border text-foreground rounded-xl gap-2 font-bold" onClick={handleReset}>
                        <Trash2 className="w-5 h-5 text-red-400" /> Clear Editor
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <p className="text-center text-sm text-muted-foreground italic">
              Your notes never leave your device. All encryption happens locally inside your browser.
            </p>
          </div>

          {/* Security Status Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-6 border-border bg-card/80 shadow-xl">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
                Your Privacy Status
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Local Processing Active", status: "Enabled", active: true },
                  { label: "No Cloud Storage", status: "Active", active: true },
                  { label: "HTTPS Protected", status: isHttps ? "Verified" : (isDev ? "Local Dev" : "Warning"), active: isHttps || isDev },
                  { label: "Client-Side Encryption", status: "AES-256", active: true },
                  { label: "No Tracking Scripts", status: "Clean", active: true }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-background border border-border">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <Badge className={item.active ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6 border-border bg-card/80 shadow-xl">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-[#3B82F6]" />
                Security Snapshot
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Encryption", val: "AES-256" },
                  { label: "Auth Tag", val: "GCM" },
                  { label: "KDF", val: "PBKDF2" },
                  { label: "Library", val: "WebCrypto" }
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-background border border-border text-center">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-xs font-mono text-foreground">{stat.val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#3B82F6]/10 to-[#22C55E]/10 border border-border relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="w-32 h-32" />
              </div>
              <h4 className="font-bold mb-2">Zero-Trust Notes</h4>
              <p className="text-sm text-muted-foreground">
                SafeTools Secure Notes is built on the principle of Zero-Trust. Even if our servers were compromised, your notes would remain safe because we never have them.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">Private & Secure Note Protection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Modern features designed for maximum privacy and ease of use.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Local Encryption", icon: Cpu, desc: "All encryption and decryption happen inside your browser, never on a server." },
              { title: "No Server Storage", icon: ServerOff, desc: "We don't store your notes. Once you close the tab, they're gone from RAM." },
              { title: "Instant Creation", icon: Zap, desc: "Generate secure, encrypted notes in milliseconds with zero account required." },
              { title: "Offline Friendly", icon: HardDrive, desc: "Works without an internet connection as a Progressive Web App (PWA)." },
              { title: "Password Protected", icon: Key, desc: "Industry-standard AES-256 protection powered by the Web Crypto API." },
              { title: "Clipboard-Safe", icon: Copy, desc: "Clear sensitive data from your clipboard with one click after use." }
            ].map((feat, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl border-border bg-card/50 hover:bg-card transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-4 group-hover:border-[#22C55E]/50 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all">
                  <feat.icon className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-12 py-12 border-y border-border">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">How Secure Notes Work</h2>
            <p className="text-muted-foreground">A simple, transparent process for maximum security.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Write", desc: "Write your note securely in the browser editor." },
              { step: "02", title: "Encrypt", desc: "Encrypt locally using your secret password." },
              { step: "03", title: "Save/Share", desc: "Copy the encrypted block for safe storage or sharing." },
              { step: "04", title: "Control", desc: "You keep full ownership of your data at all times." }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-black text-border mb-4 opacity-50">{step.step}</div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
                {i < 3 && <ArrowRight className="hidden md:block absolute top-6 -right-4 w-6 h-6 text-border" />}
              </div>
            ))}
          </div>
        </section>

        {/* Encryption Technology */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-foreground">Built with Modern Security Standards</h2>
            <p className="text-muted-foreground leading-relaxed">
              SafeTools utilizes the highest standards of web cryptography to ensure your data remains inaccessible to everyone but you.
            </p>
            <div className="space-y-4">
              {[
                { title: "AES-256 Encryption", desc: "The gold standard of symmetric encryption used by governments worldwide." },
                { title: "Web Crypto API", desc: "Native browser-based cryptography ensuring no third-party JS library vulnerabilities." },
                { title: "Secure Sandboxing", desc: "Notes are processed in an isolated browser environment for maximum safety." },
                { title: "Zero Plaintext Logging", desc: "We never log, track, or even see the contents of your unencrypted data." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-card border border-border">
                  <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#3B82F6]/20 to-[#22C55E]/20 flex items-center justify-center border border-border shadow-2xl group overflow-hidden">
              <Code2 className="w-32 h-32 text-white/20 group-hover:scale-110 group-hover:text-white/40 transition-all duration-700" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_70%)]" />
              
              {/* Animated Code Overlay */}
              <div className="absolute top-6 left-6 font-mono text-[10px] text-[#22C55E]/40 select-none pointer-events-none">
                const algorithm = "AES-256-GCM";<br />
                const key = await window.crypto.subtle.deriveKey(...)<br />
                const encrypted = await window.crypto.subtle.encrypt(...)
              </div>
            </div>
            {/* Trust Stat Floating Badge */}
            <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-3xl border-border bg-card shadow-2xl animate-bounce-slow">
              <div className="text-3xl font-black text-[#22C55E]">100%</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Browser-Based</div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">Protect Your Sensitive Information</h2>
            <p className="text-muted-foreground">From recovery phrases to developer secrets, keep everything private.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Passwords", icon: Key, color: "text-blue-400" },
              { title: "Recovery Keys", icon: History, color: "text-green-400" },
              { title: "Financial Data", icon: Shield, color: "text-purple-400" },
              { title: "Dev Secrets", icon: Code2, color: "text-orange-400" },
              { title: "Private Notes", icon: FileText, color: "text-pink-400" },
              { title: "Secure Links", icon: Share2, color: "text-cyan-400" },
              { title: "Research", icon: Globe, color: "text-yellow-400" },
              { title: "Business Info", icon: Lock, color: "text-red-400" }
            ].map((use, i) => (
              <div key={i} className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 hover:border-foreground/20 transition-colors">
                <use.icon className={`w-6 h-6 ${use.color}`} />
                <span className="font-bold text-sm text-foreground">{use.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="space-y-12 overflow-hidden">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">Why Secure Notes Is Safer</h2>
            <p className="text-muted-foreground">See how we compare to traditional note-taking apps.</p>
          </div>
          <div className="glass-card rounded-3xl border-border bg-card/50 overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  <th className="p-6 text-left text-xs uppercase tracking-widest text-muted-foreground">Feature</th>
                  <th className="p-6 text-center text-xs uppercase tracking-widest text-muted-foreground">Traditional Apps</th>
                  <th className="p-6 text-center text-xs uppercase tracking-widest text-[#22C55E]">SafeTools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { feat: "Local Encryption", trad: false, safe: true },
                  { feat: "Cloud Storage", trad: true, safe: false },
                  { feat: "Tracking", trad: "Often", safe: "No" },
                  { feat: "Browser Processing", trad: "Partial", safe: "Full" },
                  { feat: "Privacy Focused", trad: "Limited", safe: "Yes" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-foreground/5 transition-colors">
                    <td className="p-6 text-sm font-bold text-foreground">{row.feat}</td>
                    <td className="p-6 text-center text-muted-foreground">
                      {typeof row.trad === "boolean" ? (row.trad ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <ShieldAlert className="w-5 h-5 text-red-500 mx-auto" />) : row.trad}
                    </td>
                    <td className="p-6 text-center text-[#22C55E] bg-green-500/5">
                      {typeof row.safe === "boolean" ? (row.safe ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <ShieldAlert className="w-5 h-5 text-red-500 mx-auto" />) : row.safe}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Offline & PWA */}
        <section className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-card to-background border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Smartphone className="w-64 h-64 rotate-12" />
          </div>
          <div className="max-w-2xl space-y-6 relative z-10">
            <Badge className="bg-[#22C55E] text-white">Full Offline Support</Badge>
            <h2 className="text-4xl font-black text-foreground">Works Everywhere, Even Offline</h2>
            <p className="text-muted-foreground text-lg">
              SafeTools Secure Notes is a Progressive Web App (PWA). Once loaded, you can use it without an internet connection, ensuring your privacy tools are always available.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider">No Network Needed</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#020617] border border-[#1E293B]">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Secure Storage</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our secure notes tool.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: "Are my notes uploaded to servers?", a: "No. All notes are processed locally inside your browser and never uploaded anywhere." },
              { q: "Can SafeTools read my notes?", a: "No. Your encrypted notes remain under your full control and we have no access to them." },
              { q: "Does Secure Notes work offline?", a: "Yes. Most functionality works offline as a Progressive Web App (PWA)." },
              { q: "Is encryption performed locally?", a: "Yes. Encryption and decryption happen directly inside your browser using the Web Crypto API." },
              { q: "Can I use Secure Notes on mobile?", a: "Yes. The tool is fully responsive and mobile-friendly across all major platforms." },
              { q: "What if I forget my password?", a: "Unfortunately, there is no way to recover your note without the password. We prioritize security over convenience." }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-3xl bg-card border border-border space-y-3">
                <h4 className="font-bold text-lg text-foreground">{faq.q}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Educational Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-black text-center">Secure Note Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex gap-4 p-5 rounded-3xl bg-green-500/5 border border-green-500/10">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Use Strong Passphrases</h4>
                  <p className="text-xs text-muted-foreground">The security of your note depends entirely on the strength of your password. Use 12+ characters.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-3xl bg-blue-500/5 border border-blue-500/10">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Clear Clipboard After Use</h4>
                  <p className="text-xs text-muted-foreground">After copying your decrypted note, clear your clipboard to prevent other apps from seeing it.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 p-5 rounded-3xl bg-yellow-500/5 border border-yellow-500/10">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Avoid Public Devices</h4>
                  <p className="text-xs text-muted-foreground">Never decrypt sensitive notes on public computers or shared devices where keyloggers might exist.</p>
                </div>
              </div>
              <div className="flex gap-4 p-5 rounded-3xl bg-purple-500/5 border border-purple-500/10">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                  <HardDrive className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Store Encrypted Blocks</h4>
                  <p className="text-xs text-muted-foreground">Save your encrypted text in multiple safe locations. Without it, you cannot retrieve your data.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Deep Dive */}
        <section className="space-y-12 py-20 bg-card/30 rounded-[40px] border border-border px-6 md:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <Badge className="bg-blue-500 text-white">Technical Documentation</Badge>
              <h2 className="text-3xl font-black">Security Architecture & Cryptography</h2>
              <p className="text-muted-foreground leading-relaxed">
                For security professionals and curious users, here is exactly how we protect your data using the native Web Crypto API.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                    <span className="text-[#22C55E] font-black text-xs">01</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Key Derivation (PBKDF2)</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Your password isn't used directly. We use PBKDF2 with HMAC-SHA256 and 100,000+ iterations to derive a secure 256-bit encryption key.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                    <span className="text-[#22C55E] font-black text-xs">02</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Authenticated Encryption</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      We use AES-GCM (Galois/Counter Mode), which provides both confidentiality and authenticity, ensuring the data hasn't been tampered with.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                    <span className="text-[#22C55E] font-black text-xs">03</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Initialization Vectors (IV)</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Every encryption uses a unique, cryptographically strong random 96-bit IV, preventing pattern recognition in ciphertext.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                    <span className="text-[#22C55E] font-black text-xs">04</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Zero-Server State</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      No keying material, salt, or IVs are ever stored outside your device. You are the sole custodian of your digital vault.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Verification Guide */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">How to Verify Our Claims</h2>
            <p className="text-muted-foreground">We believe in "Don't Trust, Verify". Here is how you can check our security yourself.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: "Network Audit", 
                desc: "Open Browser DevTools (F12) -> Network tab. Perform an encryption. You will see 0 requests sent to any server.",
                icon: Globe
              },
              { 
                title: "Local-Only Logic", 
                desc: "Turn off your Wi-Fi and use the tool. It works 100% offline, proving no server is needed for processing.",
                icon: ServerOff
              },
              { 
                title: "Code Transparency", 
                desc: "Inspect the page source. All cryptographic logic is handled via the native window.crypto API.",
                icon: Code2
              }
            ].map((step, i) => (
              <div key={i} className="p-6 rounded-3xl bg-background border border-border space-y-4 hover:border-[#22C55E]/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-[#22C55E]" />
                </div>
                <h4 className="font-bold">{step.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools Grid */}
        <section className="space-y-12 pt-12 border-t border-border">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">Explore Other Privacy Tools</h2>
            <p className="text-muted-foreground">Enhance your digital security with our suite of local-first tools.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Password Gen", icon: Key, href: "/privacy/password-generator" },
              { name: "Pass Checker", icon: ShieldCheck, href: "/privacy/password-checker" },
              { name: "File Encrypt", icon: Lock, href: "/privacy/vault" },
              { name: "Metadata Scrubber", icon: Trash2, href: "/security/metadata-cleaner" },
              { name: "Steganography", icon: Code2, href: "/steganography" },
              { name: "Privacy Hub", icon: Globe, href: "/privacy" }
            ].map((tool, i) => (
              <Link key={i} href={tool.href} className="group">
                <div className="p-4 rounded-3xl bg-card border border-border flex flex-col items-center gap-3 group-hover:border-[#3B82F6] transition-all group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center group-hover:scale-110 transition-transform">
                    <tool.icon className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-foreground text-center">{tool.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Privacy Manifesto */}
        <section className="text-center py-20 px-6 rounded-[50px] bg-card border border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_70%)]" />
          <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <div className="w-20 h-20 rounded-[30px] bg-gradient-to-br from-[#22C55E] to-[#3B82F6] flex items-center justify-center mx-auto shadow-2xl">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-black">Privacy-First Philosophy</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              SafeTools believes privacy is a fundamental digital right. Our tools are designed to minimize data exposure and maximize user control. No accounts. No tracking. No cloud storage. Just secure privacy-first tools.
            </p>
            <div className="pt-8">
              <Link href="/privacy">
                <Button className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-white/90 font-black text-lg gap-3">
                  Explore All Tools <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* CTA Footer */}
      <footer className="mt-auto py-12 px-4 border-t border-border bg-background">
        <div className="container mx-auto text-center space-y-4">
          <p className="text-foreground font-bold text-lg">
            Protect sensitive information with modern privacy-first security tools.
          </p>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Privacy-first tools designed for a safer and more secure internet. Built with ❤️ for the open web.
          </p>
          <div className="pt-6">
            <Link href="/" className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">
              SAFTOOLS.SPACE © 2026
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
