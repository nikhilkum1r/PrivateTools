"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Eye,
  EyeOff,
  Lock,
  Clock,
  Zap,
  Globe,
  Server,
  AlertTriangle,
  CheckCircle2,
  Info,
  ArrowRight,
  Cpu,
  Layers,
  Atom,
  Binary,
  Type,
  Hash as HashIcon,
  Sparkles,
  Search,
  Activity
} from "lucide-react";
import zxcvbn from "zxcvbn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AdUnit } from "@/components/shared/AdUnit";
import { FAQ } from "@/components/shared/FAQ";
import { Footer } from "@/components/shared/Footer";
import { SuggestedTools } from "@/components/shared/SuggestedTools";

const STRENGTH_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-emerald-500",
];

const STRENGTH_TEXTS = [
  "very_weak",
  "weak",
  "medium",
  "strong",
  "very_strong",
];

const formatTime = (seconds: number) => {
  if (seconds < 1) return "Instantly";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)}d`;
  if (seconds < 315360000) return `${Math.round(seconds / 31536000)}y`;
  if (seconds < 3153600000) return "Decades";
  return "Centuries";
};

export default function PasswordCheckerClient() {
  const t = useTranslations("passwordChecker");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPwned, setIsPwned] = useState<boolean | null>(null);
  const [pwnedCount, setPwnedCount] = useState(0);

  const result = useMemo(() => zxcvbn(password), [password]);

  // Safe Pwned Check (k-Anonymity)
  useEffect(() => {
    if (password.length < 3) {
      setIsPwned(null);
      return;
    }

    const checkPwned = async () => {
      try {
        const msgUint8 = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();

        const prefix = hashHex.slice(0, 5);
        const suffix = hashHex.slice(5);

        const res = await fetch(`/api/pwned/${prefix}`);
        if (!res.ok) throw new Error("API response not ok");
        const data = await res.text();

        const lines = data.split("\n");
        const match = lines.find(line => line.startsWith(suffix));

        if (match) {
          setIsPwned(true);
          setPwnedCount(parseInt(match.split(":")[1]));
        } else {
          setIsPwned(false);
        }
      } catch (err) {
        console.error("Pwned check failed", err);
        setIsPwned(null);
      }
    };

    const timer = setTimeout(checkPwned, 500);
    return () => clearTimeout(timer);
  }, [password]);

  const entropy = Math.round(Math.log2(result.guesses));
  const charsetStatus = {
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/5 border-primary/20 text-primary font-bold text-xs uppercase tracking-widest animate-pulse">
              {t("hero.badge")}
            </Badge>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              <span dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }} /> <span className="text-primary" dangerouslySetInnerHTML={{ __html: t.raw("hero.highlight") }} />
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Tool */}
      <section className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid lg:grid-cols-[1fr,350px] gap-8">
          <div className="space-y-6">
            {/* Input Area */}
            <Card className="p-8 glass-card border-border/50 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative space-y-6">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                    <Lock className="w-5 h-5" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("hero.inputPlaceholder")}
                    className="h-20 pl-12 pr-12 text-2xl font-mono tracking-wider rounded-2xl bg-background/50 border-border/50 focus:ring-primary/20 transition-all shadow-inner"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Character Sets */}
                <div className="flex flex-wrap gap-2">
                  <CharsetBadge active={charsetStatus.upper} label="ABC" />
                  <CharsetBadge active={charsetStatus.lower} label="abc" />
                  <CharsetBadge active={charsetStatus.number} label="123" />
                  <CharsetBadge active={charsetStatus.symbol} label="#$!" />
                </div>

                {/* Strength Meter */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{t("hero.strength")}</span>
                    <span className={cn(
                      "text-sm font-black uppercase tracking-tight",
                      password ? STRENGTH_COLORS[result.score].replace("bg-", "text-") : "text-muted-foreground/40"
                    )}>
                      {password ? t(`metrics.score.${STRENGTH_TEXTS[result.score]}`) : "---"}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex-grow h-full transition-all duration-500",
                          password && i <= result.score ? STRENGTH_COLORS[result.score] : "bg-muted/20"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <AdUnit type="banner" className="mx-auto" />

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 glass-card bg-emerald-500/[0.02] border-emerald-500/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <Clock className="w-5 h-5 text-emerald-500" />
                    </div>
                    <h3 className="font-bold uppercase tracking-tight">{t("hero.crackTime")}</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <CrackTimeRow icon={Globe} label={t("cracking.online_throttled")} time={String(result.crack_times_display.online_throttling_100_per_hour)} />
                  <CrackTimeRow icon={Cpu} label={t("cracking.regular_pc")} time={formatTime(result.guesses / 1e10)} />
                  <CrackTimeRow icon={Layers} label={t("cracking.supercomputer")} time={formatTime(result.guesses / 1e15)} />
                  <CrackTimeRow icon={Atom} label={t("cracking.quantum")} time={formatTime(Math.sqrt(result.guesses) / 1e6)} />
                </div>
              </Card>

              <Card className="p-6 glass-card bg-primary/[0.02] border-primary/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold uppercase tracking-tight">{t("metrics.securityMetrics")}</h3>
                </div>
                <div className="space-y-4">
                  <MetricRow icon={HashIcon} label={t("metrics.entropy")} value={`${entropy} bits`} />
                  <MetricRow icon={Type} label={t("metrics.length")} value={`${password.length} chars`} />
                  <MetricRow icon={Sparkles} label={t("metrics.complexity")} value={`${Math.min(100, Math.round((entropy / 128) * 100))}%`} />

                  <div className="pt-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-2">
                      <span>{t("metrics.entropySpread")}</span>
                      <span>{entropy}/128</span>
                    </div>
                    <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (entropy / 128) * 100)}%` }}
                        className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className={cn(
              "p-6 glass-card border-border/50",
              isPwned ? "bg-red-500/[0.03] border-red-500/20" : isPwned === false ? "bg-emerald-500/[0.03] border-emerald-500/20" : ""
            )}>
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
                  isPwned ? "bg-red-500/10 border-red-500/20" : isPwned === false ? "bg-emerald-500/10 border-emerald-500/20" : "bg-muted/10 border-border"
                )}>
                  {isPwned ? <ShieldAlert className="w-5 h-5 text-red-500" /> : isPwned === false ? <ShieldCheck className="w-5 h-5 text-emerald-500" /> : <Shield className="w-5 h-5 text-muted-foreground/30" />}
                </div>
                <h3 className="font-bold uppercase tracking-tight">{t("breach.title")}</h3>
              </div>

              <AnimatePresence mode="wait">
                {isPwned ? (
                  <motion.div key="pwned" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                    <p className="text-sm font-bold text-red-500 uppercase leading-snug">{t("feedback.warning_pwned")}</p>
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <span className="text-2xl font-black text-red-500">{pwnedCount.toLocaleString()}</span>
                      <span className="text-[10px] font-bold text-red-500/70 uppercase ml-2 tracking-widest">{t("breach.occurrences")}</span>
                    </div>
                  </motion.div>
                ) : isPwned === false ? (
                  <motion.div key="safe" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                    <p className="text-sm font-bold text-emerald-500 uppercase">{t("breach.safeTitle")}</p>
                    <p className="text-xs text-muted-foreground font-medium">{t("breach.safeDesc")}</p>
                  </motion.div>
                ) : (
                  <motion.div key="idle" className="text-center py-4">
                    <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">{t("breach.idle")}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Sidebar - Feedback */}
          <div className="space-y-6">
            <Card className="p-6 glass-card bg-primary/[0.02] border-primary/10 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Info className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-primary">{t("feedback.title")}</h3>
              </div>

              <div className="space-y-6">
                {result.feedback.warning && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-orange-500/60">{t("feedback.warning")}</p>
                    <p className="text-sm font-bold text-orange-500 leading-tight bg-orange-500/10 p-3 rounded-xl border border-orange-500/20">{result.feedback.warning}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{t("feedback.suggestions")}</p>
                  <ul className="space-y-2">
                    {result.feedback.suggestions.length > 0 ? (
                      result.feedback.suggestions.map((s, i) => (
                        <li key={i} className="flex gap-2 text-sm font-medium text-muted-foreground">
                          <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex gap-2 text-sm font-medium text-emerald-500">
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                          Excellent password length
                        </li>
                        <li className="flex gap-2 text-sm font-medium text-emerald-500">
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                          Good use of special characters
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <AdUnit type="sidebar" className="my-0 scale-90 -mx-4" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Suggested Tools */}
      <section className="container mx-auto px-4 py-12">
        <SuggestedTools
          tools={[
            { name: "Password Generator", href: "/privacy/password-generator" },
            { name: "Privacy Scanner", href: "/privacy/privacy-scanner" },
            { name: "Secure Notes", href: "/privacy/secure-notes" },
            { name: "Metadata Cleaner", href: "/security/metadata-cleaner" }
          ]}
        />
      </section>

      {/* Educational Section */}
      <section className="container mx-auto px-4 py-24 border-t border-border max-w-4xl">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Why check your strength?</h2>
            <p className="text-muted-foreground font-medium">Simple passwords are the #1 entry point for cyber attacks. Here's how we analyze yours.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <EduCard
              icon={Hash}
              title="Entropy"
              desc="We calculate the mathematical randomness of your password in bits."
            />
            <EduCard
              icon={Clock}
              title="Time-to-Crack"
              desc="Estimates how long it would take for modern GPUs to brute-force your key."
            />
            <EduCard
              icon={Globe}
              title="Pwned Check"
              desc="We securely check if your password exists in billions of leaked records."
            />
          </div>
        </div>
      </section>

      <AdUnit type="banner" className="mb-12" />
      <FAQ items={Array.isArray(t.raw("faq.items")) ? t.raw("faq.items") : []} />
      <Footer />
    </div>
  );
}

function CrackTimeRow({ icon: Icon, label, time }: { icon: any, label: string, time: string }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.02] transition-colors group">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-xs font-bold uppercase tracking-tight text-foreground">{time}</span>
    </div>
  );
}

function EduCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-secondary/30 flex items-center justify-center mx-auto border border-border/50">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function CharsetBadge({ active, label }: { active: boolean, label: string }) {
  return (
    <div className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-all duration-500",
      active ? "bg-primary/10 border-primary/20 text-primary shadow-[0_0_10px_rgba(var(--primary),0.1)]" : "bg-muted/5 border-border/50 text-muted-foreground/30 grayscale"
    )}>
      {label}
    </div>
  );
}

function MetricRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-black tracking-tight text-foreground">{value}</span>
    </div>
  );
}

const Hash = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);
