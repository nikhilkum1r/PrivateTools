"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FAQ } from "@/components/shared/FAQ";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/shared/ThemeProvider";
import { AdUnit } from "@/components/shared/AdUnit";

export default function PasswordGeneratorClient() {
  const t = useTranslations("passwordGenerator");
  const common = useTranslations("common");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const siteBg = isDark ? "/site-bg-dark.webp" : "/site-bg-light.webp";
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

  const generatePassword = useCallback(() => {
    const charsets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };

    let allowedChars = "";
    if (options.uppercase) allowedChars += charsets.uppercase;
    if (options.lowercase) allowedChars += charsets.lowercase;
    if (options.numbers) allowedChars += charsets.numbers;
    if (options.symbols) allowedChars += charsets.symbols;

    if (allowedChars === "") {
      setPassword("");
      return;
    }

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let result = "";
    for (let i = 0; i < length; i++) {
      result += allowedChars.charAt(array[i] % allowedChars.length);
    }
    setPassword(result);
    setCopied(false);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success(t("toast.copied" as any));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(common("toast.error"));
    }
  };

  const getStrength = () => {
    if (!password) return { label: t("engine.strengths.na"), color: "text-muted-foreground", bg: "bg-muted/10", score: 0 };
    
    let charsetSize = 0;
    if (options.uppercase) charsetSize += 26;
    if (options.lowercase) charsetSize += 26;
    if (options.numbers) charsetSize += 10;
    if (options.symbols) charsetSize += 32;

    const entropy = length * Math.log2(charsetSize);
    
    if (entropy > 100) return { label: t("engine.strengths.excellent"), color: "text-emerald-500", bg: "bg-emerald-500/10", score: 4 };
    if (entropy > 80) return { label: t("engine.strengths.vstrong"), color: "text-green-500", bg: "bg-green-500/10", score: 3 };
    if (entropy > 60) return { label: t("engine.strengths.strong"), color: "text-blue-500", bg: "bg-blue-500/10", score: 2 };
    if (entropy > 40) return { label: t("engine.strengths.fair"), color: "text-yellow-500", bg: "bg-yellow-500/10", score: 1 };
    return { label: t("engine.strengths.weak"), color: "text-red-500", bg: "bg-red-500/10", score: 0 };
  };

  const strength = getStrength();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground font-sans overflow-x-hidden">
      <Navbar />
      
      <main>
        {/* HERO SECTION with Generator */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat" style={{ backgroundImage: `url('${siteBg}')` }} />
          <div className="container mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              {/* Header */}
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/5">{t("hero.badge")}</Badge>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase font-heading leading-tight" dangerouslySetInnerHTML={{ __html: t.raw("hero.title") as string }} />
                <p className="text-xl text-muted-foreground font-medium">
                  {t("hero.description")}
                </p>
                
                <div className="flex justify-center gap-4 flex-wrap">
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-500/5">
                    <Lock className="w-4 h-4" /> <span>{t("hero.badges.local")}</span>
                  </Badge>
                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 py-2 px-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-blue-500/5">
                    <ShieldCheck className="w-4 h-4" /> <span>{t("hero.badges.zero")}</span>
                  </Badge>
                  <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 py-2 px-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-orange-500/5">
                    <Zap className="w-4 h-4" /> <span>{t("hero.badges.instant")}</span>
                  </Badge>
                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 py-2 px-6 rounded-2xl flex items-center gap-3 shadow-lg shadow-purple-500/5">
                    <Fingerprint className="w-4 h-4" /> <span>{t("hero.badges.csprng")}</span>
                  </Badge>
                </div>
              </div>

              {/* Tool Card Area with Ads */}
              <div className="max-w-2xl mx-auto space-y-8">
                <></>
                
                <div className="p-10 rounded-3xl glass-card shadow-2xl space-y-10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <KeyRound className="w-40 h-40" />
                  </div>

                  {/* Password Display */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("engine.label")}</Label>
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
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("engine.strength")}</span>
                        <Badge variant="outline" className={cn("rounded-full px-4 py-1 border-current border-opacity-20 font-semibold uppercase tracking-wider text-[9px]", strength.bg, strength.color)}>
                          {strength.label}
                        </Badge>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-500/60 flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5" /> {t("engine.api")}
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-border">
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{t("engine.complexity")}</Label>
                          <p className="text-[8px] font-bold text-primary uppercase tracking-wider">{t("engine.bits", { bits: length })}</p>
                        </div>
                        <span className="text-2xl font-bold text-primary font-heading">{length}</span>
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
                          {t("engine.tip")}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(options).map(([key, value]) => (
                        <div key={key} className="group/opt flex items-center justify-between p-4 rounded-2xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer" onClick={() => setOptions(prev => ({ ...prev, [key]: !value }))}>
                          <div className="flex flex-col">
                            <Label className="text-xs font-bold tracking-wider text-foreground group-hover/opt:text-primary transition-colors">{t(`engine.optionsLabels.${key}`)}</Label>
                            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                              {t(`engine.options.${key}`)}
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
                    className="w-full h-16 rounded-3xl gap-4 font-bold text-lg uppercase tracking-wider shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" 
                    onClick={generatePassword}
                  >
                    <RefreshCw className="w-6 h-6" />
                    {t("engine.button")}
                  </Button>
                </div>

                <></>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECURITY ARCHITECTURE SECTION */}
        <section className="py-32 border-t border-border relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-repeat" style={{ backgroundImage: `url('${siteBg}')` }} />
           <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-10">
                    <Badge className="bg-primary/10 text-primary border-primary/20 py-2 px-6 rounded-full uppercase tracking-wider text-[10px] font-bold">{t("landing.architecture.badge")}</Badge>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase font-heading" dangerouslySetInnerHTML={{ __html: t.raw("landing.architecture.title") as string }} />
                    <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                       {t("landing.architecture.description")}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {(Array.isArray(t.raw("landing.architecture.items")) ? (t.raw("landing.architecture.items") as any[]) : []).map((item, i) => {
                          const archIcons = [Zap, Cpu, Globe, Shield];
                          const Icon = archIcons[i % archIcons.length];
                          return (
                            <div key={i} className="flex gap-4">
                               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20"><Icon className="w-5 h-5 text-primary" /></div>
                               <div>
                                  <h4 className="text-sm font-bold">{item.t}</h4>
                                  <p className="text-xs text-muted-foreground mt-1">{item.d}</p>
                               </div>
                            </div>
                          );
                        })}
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
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t("landing.architecture.codeLabel")}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        <div className="container mx-auto px-6 py-8">
          <></>
        </div>

        {/* PRIVACY COMMITMENT */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto p-12 rounded-3xl glass-card text-center space-y-8">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-4xl font-bold font-heading">{t("landing.commitment.title")}</h3>
              <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed">
                {t("landing.commitment.quote")}
              </blockquote>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("landing.commitment.description")}
              </p>
            </div>
          </div>
        </section>

        {/* RELATED SECURITY TOOLS */}
        <section className="py-32 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                 <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase font-heading" dangerouslySetInnerHTML={{ __html: t.raw("landing.related.title") as string }} />
                <p className="text-lg text-muted-foreground font-medium">{t("landing.related.description")}</p>
              </div>

                {/* Related Security Tools Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(Array.isArray(t.raw("landing.related.items")) ? (t.raw("landing.related.items") as any[]) : []).map((tool, i) => {
                     const toolIcons = [Fingerprint, Lock, FileSearch, ShieldCheck];
                     const colors = ["text-blue-500 bg-blue-500/10", "text-emerald-500 bg-emerald-500/10", "text-orange-500 bg-orange-500/10", "text-purple-500 bg-purple-500/10"];
                     const localizedNames: any = {
                       "Password Checker": common("tools.passwordChecker"),
                       "File Encryption": common("tools.vault"),
                       "Secure Notes": common("tools.secureNotes"),
                       "Metadata Scrubber": common("tools.metadataCleaner")
                     };
                     const hrefs = ["/privacy/password-checker", "/privacy/vault", "/privacy/secure-notes", "/security/metadata-cleaner"];
                     const Icon = toolIcons[i % toolIcons.length];
                     const color = colors[i % colors.length];
                     return (
                       <Link key={i} href={hrefs[i]} className="p-8 rounded-2xl glass-card hover:border-primary/50 transition-all group">
                         <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", color)}>
                           <Icon className="w-6 h-6" />
                         </div>
                         <h4 className="text-xl font-bold mb-2">{localizedNames[tool.n] || tool.n}</h4>
                         <p className="text-sm text-muted-foreground leading-relaxed">{tool.d}</p>
                         <div className="pt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                           {t("landing.related.button")} <ArrowRight className="w-3 h-3" />
                         </div>
                       </Link>
                     );
                   })}
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO USE SECTION */}
        <section className="py-32 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto space-y-20">
              <div className="text-center space-y-4">
                 <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-[10px] font-semibold uppercase tracking-wider text-primary">{t("landing.guide.badge")}</Badge>
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase font-heading" dangerouslySetInnerHTML={{ __html: t.raw("landing.guide.title") as string }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 {(Array.isArray(t.raw("landing.guide.items")) ? (t.raw("landing.guide.items") as any[]) : []).map((item, i) => (
                  <div key={i} className="space-y-6 p-10 rounded-3xl glass-card relative overflow-hidden group hover:border-primary/40 transition-all">
                    <div className="text-6xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors font-heading">{item.s}</div>
                    <h3 className="text-2xl font-bold font-heading">{item.t}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-medium">{item.d}</p>
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
                 <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase font-heading" dangerouslySetInnerHTML={{ __html: t.raw("landing.comparison.title") as string }} />
                <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                  {t("landing.comparison.description")}
                </p>
                <div className="space-y-4">
                  {[
                    { feature: t("landing.comparison.features.source"), cloud: t("landing.comparison.cloud.source"), safe: t("landing.comparison.safe.source") },
                    { feature: t("landing.comparison.features.transmission"), cloud: t("landing.comparison.cloud.transmission"), safe: t("landing.comparison.safe.transmission") },
                    { feature: t("landing.comparison.features.storage"), cloud: t("landing.comparison.cloud.storage"), safe: t("landing.comparison.safe.storage") },
                    { feature: t("landing.comparison.features.offline"), cloud: t("landing.comparison.cloud.offline"), safe: t("landing.comparison.safe.offline") }
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b border-border">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{row.feature}</span>
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
                  <h3 className="text-2xl font-bold font-heading">{t("landing.comparison.advantage.title")}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                  {t("landing.comparison.advantage.description")}
                </p>
                <ul className="space-y-3">
                   {(Array.isArray(t.raw("landing.comparison.advantage.points")) ? (t.raw("landing.comparison.advantage.points") as string[]) : []).map((point, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-primary">
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
                 <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-[10px] font-semibold uppercase tracking-wider text-primary">{t("landing.entropy.badge")}</Badge>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase font-heading" dangerouslySetInnerHTML={{ __html: t.raw("landing.entropy.title") as string }} />
                <p className="text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                  {t("landing.entropy.description")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {(Array.isArray(t.raw("landing.entropy.items")) ? (t.raw("landing.entropy.items") as any[]) : []).map((item, i) => (
                  <div key={i} className="p-8 rounded-3xl glass-card space-y-4">
                    <div className={cn("text-2xl font-bold font-heading", 
                      i === 0 ? "text-red-500" : i === 1 ? "text-yellow-500" : i === 2 ? "text-blue-500" : "text-emerald-500"
                    )}>{item.l}</div>
                    <div className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">{item.b} Bits</div>
                    <div className="h-[1px] bg-border" />
                    <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">{item.d}</p>
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
                     <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase font-heading leading-tight" dangerouslySetInnerHTML={{ __html: t.raw("landing.hygiene.title") as string }} />
                   <p className="text-xl text-muted-foreground font-medium">{t("landing.hygiene.description")}</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 py-2 px-6 rounded-full font-semibold uppercase tracking-wider text-[10px]">{t("landing.hygiene.badge")}</Badge>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(Array.isArray(t.raw("landing.hygiene.items")) ? (t.raw("landing.hygiene.items") as any[]) : []).map((tip, i) => (
                    <div key={i} className="p-10 rounded-3xl bg-gradient-to-br from-card to-background border border-border hover:border-primary/30 transition-all group">
                       <div className="flex items-center gap-4 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><CheckCircle2 className="w-5 h-5" /></div>
                          <h3 className="text-2xl font-bold font-heading">{tip.t}</h3>
                       </div>
                       <p className="text-muted-foreground leading-relaxed font-medium">{tip.d}</p>
                    </div>
                 ))}
               </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-8">
          <></>
        </div>

        {/* FAQ SECTION */}
        <section className="py-32 border-t border-border">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
               <div className="mb-20 text-center space-y-4">
                   <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-[10px] font-semibold uppercase tracking-wider text-primary">{t("landing.faq.badge")}</Badge>
                  <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase font-heading" dangerouslySetInnerHTML={{ __html: t.raw("landing.faq.title") as string }} />
               </div>
                <FAQ 
                 items={(Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any[]) : []).map(f => ({ q: f.q, a: f.a }))}
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
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight font-heading" dangerouslySetInnerHTML={{ __html: t.raw("landing.cta.title") as string }} />
                 <p className="text-xl text-muted-foreground font-medium">{t("landing.cta.description")}</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Button size="lg" className="rounded-2xl h-16 px-10 font-semibold uppercase tracking-wider gap-3" render={<Link href="/privacy/password-checker" />} nativeButton={false}>
                        {t("landing.cta.check")} <Fingerprint className="w-5 h-5" />
                     </Button>
                     <Button size="lg" variant="outline" className="rounded-2xl h-16 px-10 font-semibold uppercase tracking-wider gap-3 border-border" render={<Link href="/privacy/vault" />} nativeButton={false}>
                        {t("landing.cta.vault")} <Lock className="w-5 h-5" />
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
