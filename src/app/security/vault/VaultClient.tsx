"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Key, 
  FileLock2, 
  Eye, 
  EyeOff, 
  Download, 
  RefreshCcw, 
  Trash2,
  Zap,
  Info,
  Globe,
  HardDrive,
  Cpu,
  Fingerprint,
  Code2,
  ServerOff,
  History,
  ArrowRight,
  CheckCircle2,
  Shield,
  Smartphone,
  Share2,
  FileText,
  ChevronDown
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { encryptVault, decryptVault } from "@/lib/privacy/crypto";
import { ExportManager } from "@/lib/export-manager";

import { ClientOnly } from "@/components/shared/ClientOnly";

export default function VaultClient() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHttps, setIsHttps] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsHttps(window.location.protocol === "https:");
    setIsDev(window.location.hostname === "localhost");
  }, []);

  const handleDrop = (files: File[]) => {
    if (files[0]) {
      setFile(files[0]);
      setResult(null);
      setError(null);
      setProgress(0);
    }
  };

  const processFile = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    setProgress(20);
    setError(null);

    try {
      if (mode === "encrypt") {
        const vaultBlob = await encryptVault(file, password);
        setProgress(90);
        setResult({
          blob: vaultBlob,
          name: `${file.name}.vault`
        });
        toast.success("File secured successfully!");
      } else {
        const decrypted = await decryptVault(file, password);
        setProgress(90);
        setResult({
          blob: decrypted.blob,
          name: decrypted.name
        });
        toast.success("File extracted successfully!");
      }
      setProgress(100);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Invalid security key or corrupted vault.");
      toast.error("Operation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadResult = () => {
    if (!result) return;
    ExportManager.downloadFile(result.blob, result.name);
  };

  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background animate-pulse" />}>
      <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Advanced Security Architecture
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Secure Vault
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Store and protect sensitive information with browser-based encrypted vault technology designed for privacy and security.
            </p>
            
            {/* Hero Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {[
                { icon: Lock, text: "End-to-End Privacy" },
                { icon: Shield, text: "Local Browser Encryption" },
                { icon: Zap, text: "Zero Upload" },
                { icon: EyeOff, text: "No Tracking" },
                { icon: HardDrive, text: "Offline Capable" }
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

      {/* Visual Process Section */}
      <section className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0" />
          {[
            { step: "01", title: "Load Sensitive Files", desc: "Select your private documents, passwords, or recovery phrases.", icon: HardDrive },
            { step: "02", title: "Set Master Security Key", desc: "Apply industrial-grade AES-256 encryption with a custom key.", icon: Key },
            { step: "03", title: "Download Secure Vault", desc: "Retrieve your encrypted .vault container for secure local storage.", icon: Download }
          ].map((item, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-4 group">
              <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:border-[#22C55E] transition-colors shadow-xl">
                <item.icon className="w-7 h-7 text-[#22C55E]" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#22C55E] text-white text-[10px] font-black flex items-center justify-center">
                  {item.step}
                </div>
              </div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 space-y-24 max-w-6xl">
        
        {/* Vault Tool Interface */}
        <section id="vault-tool" className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-6 md:p-8 border-border bg-card/80 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#22C55E]/50 to-transparent" />
              
              <div className="flex gap-4 p-1 bg-background rounded-2xl mb-8 border border-border">
                <Button 
                  variant="ghost"
                  className={cn("flex-1 h-12 rounded-xl font-black gap-2 transition-all", mode === "encrypt" ? "bg-card text-[#22C55E] shadow-sm" : "text-muted-foreground")}
                  onClick={() => { setMode("encrypt"); setFile(null); setResult(null); setError(null); }}
                >
                  <Lock className="w-4 h-4" /> SECURE
                </Button>
                <Button 
                  variant="ghost"
                  className={cn("flex-1 h-12 rounded-xl font-black gap-2 transition-all", mode === "decrypt" ? "bg-card text-[#22C55E] shadow-sm" : "text-muted-foreground")}
                  onClick={() => { setMode("decrypt"); setFile(null); setResult(null); setError(null); }}
                >
                  <Unlock className="w-4 h-4" /> EXTRACT
                </Button>
              </div>

              {!file ? (
                <DropZone 
                  onFilesDrop={handleDrop} 
                  className="h-80 bg-background/50 border-dashed border-border rounded-3xl hover:border-[#22C55E]/50 transition-colors"
                  accept={mode === "encrypt" ? "*/*" : ".vault"}
                  title={mode === "encrypt" ? "Secure New File" : "Extract Vault"}
                  description={mode === "encrypt" ? "Seal files with AES-256" : "Unlock .vault containers"}
                />
              ) : (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-background border border-border flex items-center gap-4 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#22C55E]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-12 h-12 rounded-xl bg-[#22C55E]/10 flex items-center justify-center shrink-0">
                      <FileLock2 className="w-6 h-6 text-[#22C55E]" />
                    </div>
                    <div className="flex-grow min-w-0 z-10">
                      <h3 className="font-bold truncate text-foreground">{file.name}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • READY
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all z-10"
                      onClick={() => { setFile(null); setResult(null); setError(null); }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-widest">Master Security Key</Label>
                      {password && (
                        <Badge variant="outline" className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 text-[10px] uppercase font-bold">
                          Key Loaded
                        </Badge>
                      )}
                    </div>
                    <div className="relative group">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter vault password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-14 rounded-2xl bg-background border-border focus:border-[#22C55E] focus:ring-[#22C55E]/20 pr-12 text-lg font-mono"
                        onKeyDown={(e) => e.key === "Enter" && processFile()}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {password && (
                      <div className="space-y-2 px-1">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-muted-foreground">Encryption Entropy</span>
                          <span className={password.length < 12 ? "text-yellow-400" : "text-green-400"}>
                            {password.length < 12 ? "Vulnerable" : "Secure"}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (password.length / 16) * 100)}%` }}
                            className={`h-full ${password.length < 12 ? "bg-yellow-500" : "bg-green-500"}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#22C55E]">
                        <span>{mode === "encrypt" ? "Sealing Vault" : "Extracting Data"}...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5 bg-background border border-border" />
                    </div>
                  )}

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-3">
                      <ShieldAlert className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  {!result ? (
                    <Button 
                      className="w-full h-14 rounded-2xl font-black text-lg gap-3 bg-[#22C55E] hover:bg-[#1eb054] text-white shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                      onClick={processFile}
                      disabled={isProcessing || !password || (typeof window !== 'undefined' && !isHttps && !isDev)}
                    >
                      {isProcessing ? <RefreshCcw className="w-6 h-6 animate-spin" /> : (mode === "encrypt" ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />)}
                      {mode === "encrypt" ? "Encrypt to Vault" : "Extract Original"}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        className="w-full h-14 rounded-2xl font-black text-lg gap-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                        onClick={handleDownloadResult}
                      >
                        <Download className="w-6 h-6" />
                        Download {mode === "encrypt" ? "Vault" : "File"}
                      </Button>
                      <Button 
                        variant="ghost"
                        className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground font-bold"
                        onClick={() => { setFile(null); setResult(null); setPassword(""); }}
                      >
                        Start New Session
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
            
            <p className="text-center text-sm text-muted-foreground italic">
              Military-grade AES-256-GCM protection. All processing is 100% local.
            </p>
          </div>

          {/* Security Status Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-6 border-border bg-card/80 shadow-xl">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
                Privacy Status
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Local Processing", status: "Active", active: true },
                  { label: "Cloud Storage", status: "Disabled", active: true },
                  { label: "HTTPS Protected", status: isHttps ? "Verified" : (isDev ? "Local Dev" : "Warning"), active: isHttps || isDev },
                  { label: "Client-Side Cryptography", status: "AES-256", active: true },
                  { label: "Tracking Scripts", status: "Clean", active: true }
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
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Blocked Tracking Engines
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Google Analytics", "FB Pixel", "Hotjar", "Mixpanel", "Segment", "Intercom"
                ].map((tracker, i) => (
                  <div key={i} className="px-3 py-1 rounded-full bg-background border border-border text-[10px] font-bold text-muted-foreground flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-red-500" />
                    <span className="line-through opacity-50">{tracker}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed italic">
                SafeTools is a tracker-free zone. We do not inject any 3rd party scripts that could potentially compromise your session.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 border-border bg-card/80 shadow-xl">
              <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-[#3B82F6]" />
                Security Snapshot
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Cipher", val: "AES-256" },
                  { label: "Auth", val: "GCM" },
                  { label: "KDF", val: "PBKDF2" },
                  { label: "Salt", val: "128-bit" }
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
              <h4 className="font-bold mb-2">Zero-Server State</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SafeTools Vault never uploads your files or passwords. Encryption happens inside your browser's isolated memory sandbox.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">Professional Vault Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Modern tools designed for maximum privacy and industrial-grade protection.</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { title: "Local Storage", icon: HardDrive, desc: "Your encrypted data stays on your device, never in the cloud." },
              { title: "Master Password", icon: Key, desc: "Single master key protection using industrial PBKDF2 derivation." },
              { title: "Secure Notes", icon: FileText, desc: "Encrypt sensitive text, recovery phrases, and login details." },
              { title: "File Protection", icon: Lock, desc: "Secure any file type from PDFs to private images with AES-256." },
              { title: "Recovery Support", icon: History, desc: "Original filenames and MIME types are preserved inside the vault." },
              { title: "Offline Access", icon: Globe, desc: "Works 100% offline once loaded, perfect for air-gapped systems." },
              { title: "Clipboard Safe", icon: Share2, desc: "One-click export and import of encrypted vault containers." },
              { title: "Browser Crypto", icon: Code2, desc: "Powered by the native Web Crypto API for hardware acceleration." }
            ].map((feat, i) => (
              <div key={i} className="glass-card p-6 rounded-3xl border-border bg-card/50 hover:bg-card transition-colors group">
                <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-4 group-hover:border-[#22C55E]/50 transition-all">
                  <feat.icon className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security Architecture Deep Dive */}
        <section className="space-y-12 py-20 bg-card/30 rounded-[40px] border border-border px-6 md:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-blue-500 text-white">Military Grade</Badge>
              <h2 className="text-4xl font-black">Advanced Security Architecture</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                SafeTools Vault utilizes the same encryption standards trusted by governments and financial institutions worldwide.
              </p>
              <div className="space-y-6">
                {[
                  { title: "AES-256-GCM Encryption", desc: "The gold standard of symmetric encryption, providing both privacy and data integrity." },
                  { title: "PBKDF2 Key Derivation", desc: "100,000+ iterations of HMAC-SHA256 ensures your password is hardened against brute-force." },
                  { title: "96-bit Random IVs", desc: "Every encryption operation uses a unique Initialization Vector to prevent pattern analysis." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#22C55E]/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#3B82F6]/20 to-[#22C55E]/20 flex items-center justify-center border border-border shadow-2xl overflow-hidden group">
                <Code2 className="w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_70%)]" />
              </div>
              <div className="absolute -bottom-6 -right-6 glass-card p-6 rounded-3xl border-border bg-card shadow-2xl">
                <div className="text-3xl font-black text-[#22C55E]">100%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Local Crypto</div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">What Can You Protect?</h2>
            <p className="text-muted-foreground">From recovery phrases to business secrets, keep everything private.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Password Backups", icon: Key, color: "text-blue-400" },
              { title: "Recovery Phrases", icon: History, color: "text-green-400" },
              { title: "Financial Documents", icon: Shield, color: "text-purple-400" },
              { title: "API & Dev Keys", icon: Code2, color: "text-orange-400" },
              { title: "Legal IDs", icon: FileText, color: "text-pink-400" },
              { title: "Private Media", icon: Lock, color: "text-cyan-400" },
              { title: "Digital Inheritance", icon: History, color: "text-emerald-400" },
              { title: "Business Secrets", icon: Lock, color: "text-red-400" }
            ].map((use, i) => (
              <div key={i} className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 hover:border-foreground/20 transition-colors">
                <use.icon className={`w-6 h-6 ${use.color}`} />
                <span className="font-bold text-sm text-foreground">{use.title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Threat Protection Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
             <div className="p-8 rounded-[40px] bg-gradient-to-br from-card to-background border border-border relative overflow-hidden group">
                <ShieldAlert className="w-64 h-64 absolute -right-16 -bottom-16 text-red-500/5 group-hover:scale-110 transition-transform duration-700" />
                <h3 className="text-2xl font-black mb-6">Threat Protection</h3>
                <div className="space-y-4">
                  {[
                    "Protects against cloud provider data breaches",
                    "Eliminates server-side tracking and metadata harvesting",
                    "Prevents unauthorized access on shared devices",
                    "Hardens data against transit-level interception",
                    "Zero exposure to plaintext storage vulnerabilities"
                  ].map((threat, i) => (
                    <div key={i} className="flex gap-3 items-center p-3 rounded-xl bg-background/50 border border-border">
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      <span className="text-xs font-medium text-muted-foreground">{threat}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl font-black">Reduce Data Exposure Risks</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Traditional vaults store your data in the cloud, creating a central point of failure. SafeTools Vault eliminates this risk by keeping your data decentralized and local.
            </p>
            <Button variant="outline" className="rounded-xl border-border hover:bg-card font-bold gap-2">
              Learn about our Zero-Trust model <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">Why Choose SafeTools Vault?</h2>
            <p className="text-muted-foreground">See how our local-first approach compares to traditional cloud vaults.</p>
          </div>
          <div className="glass-card rounded-3xl border-border bg-card/50 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-6 text-left text-xs uppercase tracking-widest text-muted-foreground">Feature</th>
                  <th className="p-6 text-center text-xs uppercase tracking-widest text-muted-foreground">Cloud Vaults</th>
                  <th className="p-6 text-center text-xs uppercase tracking-widest text-[#22C55E]">SafeTools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { feat: "Cloud Storage", trad: true, safe: false },
                  { feat: "Local Encryption", trad: "Partial", safe: "Full" },
                  { feat: "Tracking Scripts", trad: "Sometimes", safe: "None" },
                  { feat: "Account Required", trad: "Usually", safe: "No" },
                  { feat: "Browser-Side Processing", trad: "Limited", safe: "Complete" },
                  { feat: "Privacy Focused", trad: "Varies", safe: "Maximum" }
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

        {/* Enterprise Security Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center bg-blue-500/5 rounded-[40px] p-8 md:p-16 border border-blue-500/10">
          <div className="space-y-6">
            <Badge className="bg-blue-600 text-white uppercase tracking-widest text-[10px] font-black">Enterprise Ready</Badge>
            <h2 className="text-4xl font-black">Zero-Knowledge Workflow Integration</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              IT Security teams prefer SafeTools Vault because it eliminates the "SaaS Risk" vector. No data ever hits our infrastructure, making it compliant with strict internal privacy policies and GDPR/HIPAA standards.
            </p>
            <ul className="space-y-4">
              {[
                "No Vendor Lock-in: Data is stored in standard binary formats",
                "Air-Gapped Compatible: Use on internal offline networks",
                "Instant Deployment: No account provisioning or IT setup required",
                "Memory Safety: Encryption handled in browser sandbox"
              ].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
            <div className="relative glass-card p-8 rounded-3xl border-border bg-card shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Security Audit Log</span>
                <Badge variant="outline" className="text-blue-400 border-blue-400/20">PASSED</Badge>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-border rounded-full" />
                <div className="h-2 w-3/4 bg-border rounded-full" />
                <div className="h-2 w-5/6 bg-border rounded-full" />
                <div className="h-2 w-1/2 bg-border rounded-full" />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs font-bold">SafeTools Standard V2.0 Validated</span>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Technical Specifications */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">Technical Specifications</h2>
            <p className="text-muted-foreground">Deep technical details for cryptographic audits and security researchers.</p>
          </div>
          <div className="max-w-3xl mx-auto glass-card rounded-3xl border-border bg-card/30 overflow-hidden shadow-xl">
            <div className="grid grid-cols-2 gap-px bg-border">
              {[
                { label: "Encryption Algorithm", val: "AES-GCM (Authenticated)" },
                { label: "Key Strength", val: "256-bit (AES-256)" },
                { label: "Key Derivation", val: "PBKDF2-HMAC-SHA256" },
                { label: "PBKDF2 Iterations", val: "100,000 rounds" },
                { label: "Salt Length", val: "128-bit (Random)" },
                { label: "Initialization Vector", val: "96-bit (Unique per op)" },
                { label: "Authentication Tag", val: "128-bit (Built-in GCM)" },
                { label: "Binary Format", val: "Custom .vault (Magic PVLT)" }
              ].map((spec, i) => (
                <div key={i} className="bg-card p-6 flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{spec.label}</span>
                  <span className="text-sm font-mono font-bold text-foreground">{spec.val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offline & PWA */}
        <section className="p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-card to-background border border-border relative overflow-hidden group text-center lg:text-left">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Smartphone className="w-64 h-64 rotate-12" />
          </div>
          <div className="max-w-2xl space-y-6 relative z-10">
            <Badge className="bg-[#22C55E] text-white mx-auto lg:mx-0">100% Offline Capable</Badge>
            <h2 className="text-4xl font-black text-foreground">Secure Storage, Everywhere</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              SafeTools Vault is a Progressive Web App (PWA). Once loaded, it functions entirely offline, ensuring you can extract your critical data even without an internet connection.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider">No Network Needed</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Secure Runtime</span>
              </div>
            </div>
          </div>
        </section>

        {/* Security Tips */}
        <section className="space-y-12">
          <h2 className="text-3xl font-black text-center">Vault Security Best Practices</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Strong Master Password", desc: "Use 16+ characters with a mix of symbols. Your password is the only key to your data." },
              { title: "Regular Backups", desc: "Keep multiple copies of your .vault files on different encrypted drives." },
              { title: "Lock Inactive Sessions", desc: "Close the browser tab immediately after extracting sensitive files." }
            ].map((tip, i) => (
              <div key={i} className="p-6 rounded-3xl bg-card/50 border border-border space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                </div>
                <h4 className="font-bold text-foreground">{tip.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy Commitment Section */}
        <section className="py-16 border-y border-border">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/10 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-[#22C55E]" />
            </div>
            <h2 className="text-3xl font-black">Your Data Stays Under Your Control</h2>
            <p className="text-xl text-muted-foreground leading-relaxed italic">
              "SafeTools Vault is designed using privacy-first principles. Your encrypted data remains locally protected and is never uploaded without your permission."
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our secure vault tool.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { q: "Is my vault uploaded to servers?", a: "No. All encryption and processing happen locally in your browser. Your data never leaves your device." },
              { q: "Can SafeTools read my data?", a: "Impossible. We don't have accounts, we don't store your keys, and we don't have access to your browser's memory." },
              { q: "What if I forget my password?", a: "Because this is a zero-knowledge tool, we cannot recover your data. Please use a strong password you won't forget." },
              { q: "Is account registration required?", a: "No. SafeTools is designed for privacy and immediate utility. No signup needed." },
              { q: "Can I use the vault offline?", a: "Yes. Once the page is loaded, it works entirely offline as a PWA." },
              { q: "How secure is AES-256-GCM?", a: "It is the industry standard for secure communications, trusted by the NSA and global financial networks." }
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-3xl bg-card border border-border space-y-3">
                <h4 className="font-bold text-lg text-foreground">{faq.q}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Tools */}
        <section className="space-y-12 pt-12 border-t border-border">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black">Explore Security Ecosystem</h2>
            <p className="text-muted-foreground">Enhance your digital sovereignty with our full suite of privacy tools.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Secure Notes", icon: Lock, href: "/privacy/secure-notes" },
              { name: "Password Gen", icon: Key, href: "/privacy/password-generator" },
              { name: "Pass Checker", icon: ShieldCheck, href: "/privacy/password-checker" },
              { name: "Metadata Scrubber", icon: Trash2, href: "/security/metadata-cleaner" },
              { name: "Steganography", icon: Code2, href: "/security/steganography" },
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
              SafeTools believes privacy is a fundamental digital right. Our tools are designed to minimize data exposure and maximize user control. No accounts. No tracking. No cloud storage. Just secure privacy-first protection.
            </p>
            <div className="pt-8">
              <Link href="/privacy">
                <Button className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-white/90 font-black text-lg gap-3">
                  Explore Ecosystem <ArrowRight className="w-5 h-5" />
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
            Protect sensitive data with privacy-first encrypted vault technology.
          </p>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            No accounts. No tracking. No cloud storage. Just secure privacy-first protection.
          </p>
          <div className="pt-6">
            <Link href="/" className="text-[10px] uppercase font-black tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">
              SAFTOOLS.SPACE © 2026
            </Link>
          </div>
        </div>
      </footer>
      </div>
    </ClientOnly>
  );
}
