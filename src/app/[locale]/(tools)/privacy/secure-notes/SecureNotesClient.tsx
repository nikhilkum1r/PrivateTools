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
import { useTranslations } from "next-intl";
import { AdUnit } from "@/components/shared/AdUnit";
export default function SecureNotesClient() {
  const t = useTranslations("secureNotes");
  const common = useTranslations("common");
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
    if (!plaintext.trim()) { toast.error(t("editor.plaintextPlaceholder")); return; }
    if (!password) { toast.error(t("editor.passwordPlaceholder")); return; }
    if (!isHttps && !isDev) { toast.error("Encryption requires HTTPS."); return; }
    setLoading(true);
    try {
      const enc = await encryptText(plaintext, password);
      setResult(enc);
      toast.success(t("status.statuses.active"));
    } catch (e) {
      toast.error("Encryption failed. " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [plaintext, password, isHttps, isDev, t]);

  const handleDecrypt = useCallback(async () => {
    if (!ciphertext.trim()) { toast.error(t("editor.ciphertextPlaceholder")); return; }
    if (!password) { toast.error(t("editor.passwordPlaceholder")); return; }
    setLoading(true);
    try {
      const dec = await decryptText(ciphertext.trim(), password);
      setResult(dec);
      toast.success(t("status.statuses.active"));
    } catch (e) {
      toast.error("Decryption failed. Wrong password or corrupted data.");
    } finally {
      setLoading(false);
    }
  }, [ciphertext, password, t]);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success(t("result.copied"));
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t("hero.badge")}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground" dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }} />
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("hero.description")}
            </p>
            
            {/* Hero Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {[
                { icon: Lock, text: t("hero.badges.privacy") },
                { icon: Zap, text: t("hero.badges.browser") },
                { icon: Shield, text: t("hero.badges.zero") },
                { icon: EyeOff, text: t("hero.badges.tracking") },
                { icon: Cpu, text: t("hero.badges.local") }
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

      <div className="container mx-auto px-4 max-w-5xl">
        <AdUnit type="banner" />
      </div>

      <main id="main-content" className="container mx-auto px-4 py-12 space-y-24 max-w-5xl">
        
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
                    <Lock className="w-4 h-4 mr-2" /> {t("editor.encryptTab")}
                  </TabsTrigger>
                  <TabsTrigger value="decrypt" className="rounded-xl data-[state=active]:bg-card data-[state=active]:text-[#22C55E] transition-all py-2.5">
                    <RefreshCw className="w-4 h-4 mr-2" /> {t("editor.decryptTab")}
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
                        <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">{t("editor.plaintextLabel")}</Label>
                        <Textarea
                          placeholder={t("editor.plaintextPlaceholder")}
                          value={plaintext}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPlaintext(e.target.value)}
                          className="min-h-[200px] rounded-2xl bg-background border-border focus:border-[#22C55E] focus:ring-[#22C55E]/20 font-mono text-sm resize-none scrollbar-hide"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="decrypt" className="space-y-4 m-0">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">{t("editor.ciphertextLabel")}</Label>
                        <Textarea
                          placeholder={t("editor.ciphertextPlaceholder")}
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
                  <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">{t("editor.passwordLabel")}</Label>
                  {password && (
                    <Badge variant="outline" className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 text-[10px] uppercase font-bold">
                      {t("editor.passwordActive")}
                    </Badge>
                  )}
                </div>
                <div className="relative group">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("editor.passwordPlaceholder")}
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
                    <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider">
                      <span className="text-muted-foreground">{t("editor.strengthLabel")}</span>
                      <span className={
                        password.length < 8 ? "text-red-400" : 
                        password.length < 12 ? "text-yellow-400" : "text-green-400"
                      }>
                        {password.length < 8 ? t("editor.strengthLevels.weak") : password.length < 12 ? t("editor.strengthLevels.medium") : t("editor.strengthLevels.strong")}
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
                  <p dangerouslySetInnerHTML={{ __html: t.raw("editor.warning") }} />
                </div>
              </div>

              <Button
                className="w-full h-14 mt-8 rounded-2xl font-bold text-lg gap-3 bg-[#22C55E] hover:bg-[#1eb054] text-white shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                onClick={tab === "encrypt" ? handleEncrypt : handleDecrypt}
                disabled={loading || (isClient && !isHttps && !isDev)}
              >
                {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Lock className="w-6 h-6" />}
                {loading ? t("editor.processing") : tab === "encrypt" ? t("editor.encryptButton") : t("editor.decryptButton")}
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
                        <span className="text-sm font-semibold uppercase tracking-wider text-[#22C55E]">
                          {tab === "encrypt" ? t("result.encryptTitle") : t("result.decryptTitle")}
                        </span>
                      </div>
                      <Badge className="bg-[#3B82F6] text-white">{t("result.algorithm")}</Badge>
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
                        {copied ? t("result.copied") : t("result.copy")}
                      </Button>
                      <Button variant="ghost" className="h-12 border border-border hover:bg-border text-foreground rounded-xl gap-2 font-bold" onClick={handleReset}>
                        <Trash2 className="w-5 h-5 text-red-400" /> {t("result.clear")}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <p className="text-center text-sm text-muted-foreground">
              {t("editor.footer")}
            </p>
          </div>

          {/* Security Status Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-6 border-border bg-card/80 shadow-xl">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
                {t("status.title")}
              </h3>
              <div className="space-y-4">
                {[
                  { label: t("status.items.local"), status: t("status.statuses.enabled"), active: true },
                  { label: t("status.items.cloud"), status: t("status.statuses.active"), active: true },
                  { label: t("status.items.https"), status: isHttps ? t("status.statuses.verified") : (isDev ? t("status.statuses.localDev") : t("status.statuses.warning")), active: isHttps || isDev },
                  { label: t("status.items.encryption"), status: t("status.statuses.aes"), active: true },
                  { label: t("status.items.tracking"), status: t("status.statuses.clean"), active: true }
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
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-[#3B82F6]" />
                {t("status.snapshot")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t("status.stats.encryption"), val: "AES-256" },
                  { label: t("status.stats.auth"), val: "GCM" },
                  { label: t("status.stats.kdf"), val: "PBKDF2" },
                  { label: t("status.stats.library"), val: "WebCrypto" }
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
              <h4 className="font-bold mb-2">{t("status.zeroTrustTitle")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("status.zeroTrustDesc")}
              </p>
            </div>
          </div>
        </section>

        <AdUnit type="in-feed" />

        {/* Features Grid */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{t("features.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("features.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {(Array.isArray(t.raw("features.items")) ? (t.raw("features.items") as any[]) : []).map((feat, i) => {
              const icons = [Cpu, ServerOff, Zap, HardDrive, Key, Copy];
              const Icon = icons[i % icons.length];
              return (
                <div key={i} className="glass-card p-6 rounded-3xl border-border bg-card/50 hover:bg-card transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center mb-4 group-hover:border-[#22C55E]/50 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all">
                    <Icon className="w-6 h-6 text-[#22C55E]" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="space-y-12 py-12 border-y border-border">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{t("howItWorks.title")}</h2>
            <p className="text-muted-foreground">{t("howItWorks.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {(Array.isArray(t.raw("howItWorks.steps")) ? (t.raw("howItWorks.steps") as any[]) : []).map((step, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-bold text-border mb-4 opacity-50">{step.step}</div>
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
            <h2 className="text-3xl font-bold text-foreground">{t("standards.title")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("standards.subtitle")}
            </p>
            <div className="space-y-4">
              {(Array.isArray(t.raw("standards.items")) ? (t.raw("standards.items") as any[]) : []).map((item, i) => (
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
              <div className="text-3xl font-bold text-[#22C55E]">{t("standards.badge")}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("standards.badgeText")}</div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{t("useCases.title")}</h2>
            <p className="text-muted-foreground">{t("useCases.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Array.isArray(t.raw("useCases.items")) ? (t.raw("useCases.items") as any[]) : []).map((use, i) => {
              const icons = [Key, History, Shield, Code2, FileText, Share2, Globe, Lock];
              const Icon = icons[i % icons.length];
              const colors = ["text-blue-400", "text-green-400", "text-purple-400", "text-orange-400", "text-pink-400", "text-cyan-400", "text-yellow-400", "text-red-400"];
              return (
                <div key={i} className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 hover:border-foreground/20 transition-colors">
                  <Icon className={`w-6 h-6 ${colors[i % colors.length]}`} />
                  <span className="font-bold text-sm text-foreground">{use.title}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="space-y-12 overflow-hidden">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{t("comparison.title")}</h2>
            <p className="text-muted-foreground">{t("comparison.subtitle")}</p>
          </div>
          <div className="glass-card rounded-3xl border-border bg-card/50 overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#1E293B]">
                  <th className="p-6 text-left text-xs uppercase tracking-wider text-muted-foreground">{t("comparison.headers.0")}</th>
                  <th className="p-6 text-center text-xs uppercase tracking-wider text-muted-foreground">{t("comparison.headers.1")}</th>
                  <th className="p-6 text-center text-xs uppercase tracking-wider text-[#22C55E]">{t("comparison.headers.2")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(Array.isArray(t.raw("comparison.rows")) ? (t.raw("comparison.rows") as any[]) : []).map((row, i) => (
                  <tr key={i} className="hover:bg-foreground/5 transition-colors">
                    <td className="p-6 text-sm font-bold text-foreground">{row.feat}</td>
                    <td className="p-6 text-center text-muted-foreground">
                      {i === 0 || i === 1 ? <ShieldAlert className="w-5 h-5 text-red-500 mx-auto" /> : (i === 2 ? t("comparison.trad.often") : (i === 3 ? t("comparison.trad.partial") : t("comparison.trad.limited")))}
                    </td>
                    <td className="p-6 text-center text-[#22C55E] bg-green-500/5">
                      {i === 0 ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : (i === 1 ? <ShieldAlert className="w-5 h-5 text-red-500 mx-auto" /> : (i === 2 ? t("comparison.safe.no") : (i === 3 ? t("comparison.safe.full") : t("comparison.safe.yes"))))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Offline & PWA */}
        <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-card to-background border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Smartphone className="w-64 h-64 rotate-12" />
          </div>
          <div className="max-w-2xl space-y-6 relative z-10">
            <Badge className="bg-[#22C55E] text-white">{t("offline.badge")}</Badge>
            <h2 className="text-4xl font-bold text-foreground">{t("offline.title")}</h2>
            <p className="text-muted-foreground text-lg">
              {t("offline.desc")}
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background border border-border">
                <Globe className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold uppercase tracking-wider">{t("offline.noNetwork")}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#020617] border border-[#1E293B]">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold uppercase tracking-wider">{t("offline.secureStorage")}</span>
              </div>
            </div>
          </div>
        </section>

        <AdUnit type="in-article" />

        {/* FAQ Section */}
        <section className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{t("faq.title")}</h2>
            <p className="text-muted-foreground">{t("faq.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {(Array.isArray(t.raw("faq.items")) ? (t.raw("faq.items") as any[]) : []).map((faq, i) => (
              <div key={i} className="p-6 rounded-3xl bg-card border border-border space-y-3">
                <h4 className="font-bold text-lg text-foreground">{faq.q}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Educational Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">{t("bestPractices.title")}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {(t.raw("bestPractices.items") as any[]).slice(0, 2).map((item, i) => {
              const icons = [CheckCircle2, Fingerprint];
              const Icon = icons[i];
              const colors = ["bg-green-500/20 text-green-500", "bg-blue-500/20 text-blue-500"];
              return (
                <div key={i} className={`flex gap-4 p-5 rounded-3xl ${i === 0 ? "bg-green-500/5 border border-green-500/10" : "bg-blue-500/5 border border-blue-500/10"}`}>
                  <div className={`w-10 h-10 rounded-xl ${colors[i]} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              );
            })}
            {(t.raw("bestPractices.items") as any[]).slice(2, 4).map((item, i) => {
              const icons = [ShieldAlert, HardDrive];
              const Icon = icons[i];
              const colors = ["bg-yellow-500/20 text-yellow-500", "bg-purple-500/20 text-purple-500"];
              return (
                <div key={i} className={`flex gap-4 p-5 rounded-3xl ${i === 0 ? "bg-yellow-500/5 border border-yellow-500/10" : "bg-purple-500/5 border border-purple-500/10"}`}>
                  <div className={`w-10 h-10 rounded-xl ${colors[i]} flex items-center justify-center shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Technical Deep Dive */}
        <section className="space-y-12 py-20 bg-card/30 rounded-3xl border border-border px-6 md:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <Badge className="bg-blue-500 text-white">{t("technical.badge")}</Badge>
              <h2 className="text-3xl font-bold">{t("technical.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("technical.desc")}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {(Array.isArray(t.raw("technical.steps")) ? (t.raw("technical.steps") as any[]) : []).map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center shrink-0">
                    <span className="text-[#22C55E] font-bold text-xs">{`0${i + 1}`}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mt-2">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verification Guide */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{t("verification.title")}</h2>
            <p className="text-muted-foreground">{t("verification.subtitle")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {(Array.isArray(t.raw("verification.items")) ? (t.raw("verification.items") as any[]) : []).map((step, i) => {
              const icons = [Globe, ServerOff, Code2];
              const Icon = icons[i];
              return (
                <div key={i} className="p-6 rounded-3xl bg-background border border-border space-y-4 hover:border-[#22C55E]/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <h4 className="font-bold">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Related Tools Grid */}
        <section className="space-y-12 pt-12 border-t border-border">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">{t("related.title")}</h2>
            <p className="text-muted-foreground">{t("related.subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {(Array.isArray(t.raw("related.items")) ? (t.raw("related.items") as any[]) : []).map((tool, i) => {
              const icons = [Key, ShieldCheck, Lock, Trash2, Code2, Globe];
              const Icon = icons[i % icons.length];
               const localizedNames: any = {
                 "Password Gen": common("tools.passwordGenerator"),
                 "Pass Checker": common("tools.passwordChecker"),
                 "File Encrypt": common("tools.vault"),
                 "Metadata Scrubber": common("tools.metadataCleaner"),
                 "Steganography": common("tools.steganography"),
                 "Privacy Hub": common("privacy")
               };
              const hrefs = ["/privacy/password-generator", "/privacy/password-checker", "/security/vault", "/security/metadata-cleaner", "/security/steganography", "/privacy"];
              return (
                <Link key={i} href={hrefs[i]} className="group">
                  <div className="p-4 rounded-3xl bg-card border border-border flex flex-col items-center gap-3 group-hover:border-[#3B82F6] transition-all group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <span className="text-[10px] font-bold tracking-tight text-foreground text-center">{localizedNames[tool.name] || tool.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Privacy Manifesto */}
        <section className="text-center py-20 px-6 rounded-[50px] bg-card border border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_70%)]" />
          <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <div className="w-20 h-20 rounded-[30px] bg-gradient-to-br from-[#22C55E] to-[#3B82F6] flex items-center justify-center mx-auto shadow-2xl">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold" dangerouslySetInnerHTML={{ __html: t.raw("manifesto.title") }} />
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t("manifesto.desc")}
            </p>
            <div className="pt-8">
              <Link href="/privacy">
                <Button className="h-14 px-10 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-lg gap-3">
                  {t("manifesto.button")} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <AdUnit type="multiplex" />

      </main>

      {/* CTA Footer */}
      <footer className="mt-auto py-12 px-4 border-t border-border bg-background">
        <div className="container mx-auto text-center space-y-4">
          <p className="text-foreground font-bold text-lg">
            {t("footer.line1")}
          </p>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            {t("footer.line2")}
          </p>
          <div className="pt-6">
            <Link href="/" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
              SAFTOOLS.SPACE © 2026
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
