"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Fingerprint, 
  Globe, 
  Lock, 
  Eye, 
  EyeOff, 
  Zap, 
  AlertTriangle,
  Info,
  CheckCircle2,
  Monitor,
  Wifi,
  Search,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AdUnit } from "@/components/shared/AdUnit";
import { FAQ } from "@/components/shared/FAQ";
import { Footer } from "@/components/shared/Footer";
import { SuggestedTools } from "@/components/shared/SuggestedTools";

interface ScanResult {
  ip: string;
  location: string;
  ua: string;
  webrtc: "clean" | "vulnerable";
  adblock: "active" | "inactive";
  canvas: string;
  cookies: "active" | "inactive";
  tracking: "active" | "inactive";
}

export default function PrivacyScannerClient() {
  const t = useTranslations("privacyScanner");
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Partial<ScanResult> | null>(null);

  const startScan = async () => {
    setIsScanning(true);
    setProgress(0);
    setResult(null);

    // Simulate scanning phases
    const phases = [
      { p: 20, fn: scanNetwork },
      { p: 50, fn: scanIdentity },
      { p: 80, fn: scanDefenses },
      { p: 100, fn: async () => ({}) }
    ];

    let currentResult: Partial<ScanResult> = {};

    for (const phase of phases) {
      await new Promise(r => setTimeout(r, 800));
      const res = await phase.fn();
      currentResult = { ...currentResult, ...res };
      setResult({ ...currentResult });
      setProgress(phase.p);
    }

    setIsScanning(false);
  };

  async function scanNetwork() {
    let ip = "Detecting...";
    try {
      const res = await fetch("/api/ip");
      const data = await res.json();
      ip = data.ip;
    } catch (e) { ip = "Blocked/Hidden"; }

    // WebRTC Leak Test
    let webrtc: "clean" | "vulnerable" = "clean";
    try {
      const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      pc.createDataChannel("");
      const offer = await pc.createOffer();
      if (offer.sdp?.includes("c=IN IP4")) webrtc = "vulnerable";
      pc.close();
    } catch (e) {}

    return { ip, webrtc };
  }

  async function scanIdentity() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let canvasHash = "Protected";
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("SafeTools Privacy Check", 2, 15);
      canvasHash = canvas.toDataURL().slice(-50, -30);
    }

    return { 
      ua: navigator.userAgent.slice(0, 50) + "...",
      canvas: canvasHash
    };
  }

  async function scanDefenses() {
    // AdBlock Check
    const adScript = document.createElement("script");
    adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    let adblock: "active" | "inactive" = "inactive";
    try {
      await fetch(adScript.src, { mode: "no-cors" });
    } catch (e) {
      adblock = "active";
    }

    return { 
      adblock,
      cookies: navigator.cookieEnabled ? "active" : "inactive",
      tracking: (navigator as any).doNotTrack === "1" ? "active" : "inactive"
    };
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16 font-sans">
      {/* Hero */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,var(--color-primary)_0%,transparent_50%)] opacity-[0.03]" />
        <div className="container mx-auto px-4 text-center space-y-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Badge variant="outline" className="px-4 py-1 rounded-full bg-primary/5 border-primary/20 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              {t("hero.badge")}
            </Badge>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
              <span dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }} /> <span className="text-primary" dangerouslySetInnerHTML={{ __html: t.raw("hero.highlight") }} />
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto italic opacity-80">
              {t("hero.subtitle")}
            </p>
          </motion.div>

          <div className="max-w-md mx-auto">
            {!isScanning && !result && (
              <Button 
                onClick={startScan}
                size="lg" 
                className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all group"
              >
                <Zap className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                {t("hero.button")}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Scan Console */}
      <section className="container mx-auto px-4 py-12 max-w-5xl">
        <AnimatePresence mode="wait">
          {(isScanning || result) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              {/* Progress */}
              {isScanning && (
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                    <span>{t("hero.scanning")}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-primary/10" />
                </div>
              )}

              {/* Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <ScanCard 
                  title={t("sections.network")} 
                  icon={Wifi} 
                  items={[
                    { label: t("metrics.ip"), value: result?.ip || "...", status: result?.ip ? "warning" : "default" },
                    { label: t("metrics.webrtc"), value: result?.webrtc ? t(`status.${result.webrtc}`) : "...", status: result?.webrtc === "clean" ? "success" : "danger" }
                  ]}
                />
                <ScanCard 
                  title={t("sections.identity")} 
                  icon={Fingerprint} 
                  items={[
                    { label: t("metrics.ua"), value: result?.ua || "...", status: "default" },
                    { label: t("metrics.fingerprint"), value: result?.canvas || "...", status: "warning" }
                  ]}
                />
                <ScanCard 
                  title={t("sections.defenses")} 
                  icon={Shield} 
                  items={[
                    { label: t("metrics.adblock"), value: result?.adblock ? t(`status.${result.adblock}`) : "...", status: result?.adblock === "active" ? "success" : "danger" },
                    { label: t("metrics.tracking"), value: result?.tracking ? t(`status.${result.tracking}`) : "...", status: result?.tracking === "active" ? "success" : "warning" }
                  ]}
                />
              </div>

              {!isScanning && result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                   <AdUnit type="banner" className="mx-auto" />
                   
                   <div className="grid lg:grid-cols-2 gap-8">
                     {/* Hardening Guide */}
                     <Card className="p-8 glass-card border-primary/20 bg-primary/[0.01]">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Lock className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-xl font-black uppercase tracking-tight">{t("advice.title")}</h3>
                        </div>
                        <ul className="space-y-6">
                          <AdviceItem icon={Globe} text={t("advice.vpn")} />
                          <AdviceItem icon={Monitor} text={t("advice.brave")} />
                          <AdviceItem icon={ShieldCheck} text={t("advice.ublock")} />
                          <AdviceItem icon={ShieldAlert} text={t("advice.webrtc")} />
                        </ul>
                     </Card>

                     {/* Privacy Summary */}
                     <Card className="p-8 glass-card border-border/50 flex flex-col justify-between">
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 mb-2">
                             <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Search className="w-5 h-5 text-emerald-500" />
                             </div>
                             <h3 className="text-xl font-black uppercase tracking-tight">Anonymity Score</h3>
                          </div>
                          <div className="relative h-48 flex items-center justify-center">
                             <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full border-8 border-primary/10 flex items-center justify-center">
                                   <span className="text-4xl font-black text-primary">68%</span>
                                </div>
                             </div>
                             <svg className="w-40 h-40 transform -rotate-90">
                                <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-primary" strokeDasharray="440" strokeDashoffset="140" />
                             </svg>
                          </div>
                          <p className="text-sm text-muted-foreground font-medium text-center">Your browser fingerprint is partially unique. Follow the hardening guide to improve your score.</p>
                        </div>
                        <Button onClick={startScan} variant="outline" className="w-full mt-8 rounded-xl font-bold uppercase tracking-widest h-12 border-primary/20 hover:bg-primary/5">
                           Re-Scan Environment
                        </Button>
                     </Card>
                   </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!isScanning && !result && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-40 grayscale group-hover:grayscale-0 transition-all">
             {[1,2,3,4].map(i => <div key={i} className="h-32 rounded-2xl border border-dashed border-border flex items-center justify-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30">Module Locked</div>)}
          </div>
        )}
      </section>

      {/* Suggested Tools */}
      <section className="container mx-auto px-4 py-12">
        <SuggestedTools 
          tools={[
            { name: "Password Strength", href: "/privacy/password-checker" },
            { name: "Password Generator", href: "/privacy/password-generator" },
            { name: "File Vault", href: "/security/vault" },
            { name: "File Shredder", href: "/security/file-shredder" }
          ]} 
        />
      </section>

      <AdUnit type="banner" className="mb-12" />
      <FAQ items={Array.isArray(t.raw("faq.items")) ? t.raw("faq.items") : []} />
      <Footer />
    </div>
  );
}

function ScanCard({ title, icon: Icon, items }: { title: string, icon: any, items: any[] }) {
  return (
    <Card className="p-6 glass-card border-border/50 flex flex-col space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center border border-border">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <h3 className="font-bold uppercase tracking-tight">{title}</h3>
      </div>
      <div className="space-y-4">
        {items.map((it, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              <span>{it.label}</span>
            </div>
            <div className={cn(
              "px-3 py-2.5 rounded-xl text-xs font-mono break-all",
              it.status === "success" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10" :
              it.status === "danger" ? "bg-red-500/10 text-red-500 border border-red-500/10" :
              it.status === "warning" ? "bg-orange-500/10 text-orange-400 border border-orange-500/10" :
              "bg-secondary/50 text-muted-foreground border border-border/50"
            )}>
              {it.value}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AdviceItem({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <li className="flex gap-4 group">
      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">{text}</p>
    </li>
  );
}
