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
  AlertCircle
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function SecurityToolsPage() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(24);
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
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    const entropy = length * Math.log2(
      (options.uppercase ? 26 : 0) + 
      (options.lowercase ? 26 : 0) + 
      (options.numbers ? 10 : 0) + 
      (options.symbols ? 32 : 0)
    );
    if (entropy > 100) return { label: "Exceptional", color: "text-green-500", bg: "bg-green-500/10" };
    if (entropy > 70) return { label: "Strong", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (entropy > 40) return { label: "Moderate", color: "text-yellow-500", bg: "bg-yellow-500/10" };
    return { label: "Weak", color: "text-red-500", bg: "bg-red-500/10" };
  };

  const strength = getStrength();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-4 text-center md:text-left pb-8 border-b border-primary/10 mb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center justify-center md:justify-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex flex-shrink-0 items-center justify-center shadow-inner border border-primary/20">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
                Security Tools
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl font-medium">
              Generate high-entropy passwords using cryptographically secure random values.
            </p>
          </div>

          <Card className="p-8 shadow-xl border-primary/10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Fingerprint className="w-24 h-24" />
            </div>

            {/* Password Display */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex items-center gap-2 p-6 rounded-xl bg-card border text-2xl font-mono break-all min-h-[5rem]">
                  {password ? password : <span className="text-muted-foreground italic">Select at least one option</span>}
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="icon" variant="ghost" onClick={generatePassword} className="rounded-full">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={copyToClipboard} className="rounded-full text-primary">
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-medium">Strength:</span>
                  <Badge variant="outline" className={`${strength.bg} ${strength.color} border-current border-opacity-20`}>
                    {strength.label}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground italic">Generated locally using Web Crypto API</span>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              <div className="space-y-6">
                <div className="flex justify-between">
                  <Label className="text-base">Password Length</Label>
                  <span className="font-mono font-bold text-primary">{length}</span>
                </div>
                <Slider 
                  value={[length]} 
                  onValueChange={(v) => setLength(Array.isArray(v) ? v[0] : v)} 
                  max={64} 
                  min={8} 
                  step={1} 
                />
                <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 text-[10px] text-muted-foreground">
                  <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Passwords over 16 characters are recommended for high security.
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {Object.entries(options).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl border hover:bg-secondary/20 transition-colors">
                    <Label htmlFor={key} className="capitalize text-sm font-medium cursor-pointer">
                      {key}
                    </Label>
                    <Checkbox 
                      id={key} 
                      checked={value} 
                      onCheckedChange={(checked) => setOptions(prev => ({ ...prev, [key]: !!checked }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button size="lg" className="w-full rounded-2xl gap-2 font-bold" onClick={generatePassword}>
              <RefreshCw className="w-5 h-5" />
              Generate New Password
            </Button>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
