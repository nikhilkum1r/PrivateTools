"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Copy, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";
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

export default function SecureNoteClient() {
  const [tab, setTab] = useState<"encrypt" | "decrypt">("encrypt");
  const [plaintext, setPlaintext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const isDev = typeof window !== "undefined" && window.location.hostname === "localhost";

  const handleEncrypt = useCallback(async () => {
    if (!plaintext.trim()) { toast.error("Enter a note to encrypt."); return; }
    if (!password) { toast.error("Enter a password."); return; }
    if (!isHttps && !isDev) { toast.error("Encryption requires HTTPS."); return; }
    setLoading(true);
    try {
      const enc = await encryptText(plaintext, password);
      setResult(enc);
      toast.success("Note encrypted!");
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
      toast.success("Note decrypted!");
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Secure Note</h1>
              <p className="text-muted-foreground mt-2">Encrypt and decrypt private notes locally using AES-256-GCM. Nothing is stored.</p>
            </div>
            <PrivacyBadge />
          </div>

          {!isHttps && !isDev && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium flex gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              Encryption requires HTTPS. This feature is disabled on HTTP connections.
            </div>
          )}

          {/* Tabs */}
          <Tabs value={tab} onValueChange={(v) => { setTab(v as "encrypt" | "decrypt"); setResult(""); }}>
            <TabsList className="w-full rounded-xl">
              <TabsTrigger value="encrypt" className="flex-1">Encrypt</TabsTrigger>
              <TabsTrigger value="decrypt" className="flex-1">Decrypt</TabsTrigger>
            </TabsList>

            <TabsContent value="encrypt" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Your Note</Label>
                <Textarea
                  placeholder="Write your secret note here…"
                  value={plaintext}
                  onChange={(e) => setPlaintext(e.target.value)}
                  className="min-h-[150px] rounded-xl font-mono text-sm"
                />
              </div>
            </TabsContent>

            <TabsContent value="decrypt" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Encrypted Text (Base64)</Label>
                <Textarea
                  placeholder="Paste your encrypted note here…"
                  value={ciphertext}
                  onChange={(e) => setCiphertext(e.target.value)}
                  className="min-h-[150px] rounded-xl font-mono text-sm"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Password */}
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter encryption password…"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl pr-10"
                onKeyDown={(e) => e.key === "Enter" && (tab === "encrypt" ? handleEncrypt() : handleDecrypt())}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">⚠️ Lost password = unrecoverable. We cannot help you recover it.</p>
          </div>

          <Button
            className="w-full h-12 rounded-xl font-bold gap-2"
            onClick={tab === "encrypt" ? handleEncrypt : handleDecrypt}
            disabled={loading || (!isHttps && !isDev)}
          >
            <Lock className="w-4 h-4" />
            {loading ? "Processing…" : tab === "encrypt" ? "Encrypt Note" : "Decrypt Note"}
          </Button>

          {/* Result */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  {tab === "encrypt" ? "Encrypted Output" : "Decrypted Note"}
                </Label>
                <Badge variant="secondary" className="text-xs">AES-256-GCM</Badge>
              </div>
              <div className="relative">
                <Textarea
                  readOnly
                  value={result}
                  className="min-h-[120px] rounded-xl font-mono text-sm bg-secondary/30"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2 rounded-xl" onClick={handleCopy}>
                  {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>
                <Button variant="ghost" className="gap-2 rounded-xl" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4" /> Reset
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
