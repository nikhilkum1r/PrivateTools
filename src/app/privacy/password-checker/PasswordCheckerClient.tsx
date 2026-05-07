"use client";

import React, { useState, useCallback, useTransition } from "react";
import { motion } from "framer-motion";
import { KeyRound, Eye, EyeOff, ShieldCheck, ShieldAlert, Shield, ShieldX, Info } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkPassword, type PasswordStrengthResult } from "@/lib/privacy/passwordStrength";

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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-4 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">Password Checker</h1>
              <p className="text-muted-foreground mt-2">Check strength and crack time offline. Your password is never sent anywhere.</p>
            </div>
            <PrivacyBadge />
          </div>

          {/* Input */}
          <div className="space-y-2">
            <Label>Enter a Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Type any password to analyze…"
                value={password}
                onChange={(e) => handleChange(e.target.value)}
                className="rounded-xl h-10 text-base pr-12"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Score bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ScoreIcon className="w-5 h-5" style={{ color: result.color }} />
                    <span className="font-black text-lg" style={{ color: result.color }}>{result.label}</span>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">Score: {result.score}/4</span>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full transition-all duration-500 ${i <= result.score ? SCORE_BG[result.score] : "bg-secondary"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-secondary/50 border border-primary/5 space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Crack Time</p>
                  <p className="font-bold text-sm">{result.crackTime}</p>
                  <p className="text-[10px] text-muted-foreground">Offline slow hash</p>
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-primary/5 space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Entropy</p>
                  <p className="font-bold text-sm">~{result.entropy} bits</p>
                  <p className="text-[10px] text-muted-foreground">Estimated</p>
                </div>
              </div>

              {/* Warning */}
              {result.warning && (
                <div className="flex gap-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-sm">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  {result.warning}
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Suggestions</p>
                  <ul className="space-y-1.5">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">→</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {!password && (
            <div className="text-center py-8 text-muted-foreground/40 space-y-2">
              <KeyRound className="w-12 h-12 mx-auto" />
              <p className="text-sm">Start typing to see your password strength</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
