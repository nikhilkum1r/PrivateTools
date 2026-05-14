"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Lock, Unlock, FileLock2, Trash2, EyeOff, Eye, RefreshCcw, 
  Download, ShieldAlert, ShieldCheck, Globe, Fingerprint, 
  HardDrive, Key, Info 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface VaultEditorProps {
  t: any;
  mode: "encrypt" | "decrypt";
  setMode: (m: "encrypt" | "decrypt") => void;
  file: File | null;
  setFile: (f: File | null) => void;
  password: string;
  setPassword: (p: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  isProcessing: boolean;
  progress: number;
  result: { blob: Blob; name: string } | null;
  setResult: (v: any) => void;
  error: string | null;
  setError: (v: string | null) => void;
  isHttps: boolean;
  isDev: boolean;
  handleDrop: (files: File[]) => void;
  processFile: () => void;
  handleDownloadResult: () => void;
  resetSession: () => void;
}

export function VaultEditor({
  t, mode, setMode, file, setFile, password, setPassword,
  showPassword, setShowPassword, isProcessing, progress,
  result, setResult, error, setError, isHttps, isDev,
  handleDrop, processFile, handleDownloadResult, resetSession
}: VaultEditorProps) {

  return (
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
              className={cn("flex-1 h-12 rounded-xl font-bold gap-2 transition-all", mode === "encrypt" ? "bg-card text-[#22C55E] shadow-sm" : "text-muted-foreground")}
              onClick={() => { setMode("encrypt"); setFile(null); setResult(null); setError(null); }}
            >
              <Lock className="w-4 h-4" /> {t("engine.mode.secure")}
            </Button>
            <Button 
              variant="ghost"
              className={cn("flex-1 h-12 rounded-xl font-bold gap-2 transition-all", mode === "decrypt" ? "bg-card text-[#22C55E] shadow-sm" : "text-muted-foreground")}
              onClick={() => { setMode("decrypt"); setFile(null); setResult(null); setError(null); }}
            >
              <Unlock className="w-4 h-4" /> {t("engine.mode.extract")}
            </Button>
          </div>

          {!file ? (
            <DropZone 
              onFilesDrop={handleDrop} 
              className="h-80 bg-background/50 border-dashed border-border rounded-3xl hover:border-[#22C55E]/50 transition-colors"
              accept={mode === "encrypt" ? "*/*" : ".vault"}
              title={mode === "encrypt" ? t("engine.dropzone.title.encrypt") : t("engine.dropzone.title.decrypt")}
              description={mode === "encrypt" ? t("engine.dropzone.desc.encrypt") : t("engine.dropzone.desc.decrypt")}
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
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {t("engine.ready")}
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
                  <Label className="text-muted-foreground font-semibold text-xs uppercase tracking-wider">{t("engine.label.key")}</Label>
                  {password && (
                    <Badge variant="outline" className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20 text-[10px] uppercase font-bold">
                      {t("engine.label.keyLoaded")}
                    </Badge>
                  )}
                </div>
                <div className="relative group">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("engine.label.placeholder")}
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
                    <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider">
                      <span className="text-muted-foreground">{t("engine.entropy.label")}</span>
                      <span className={password.length < 12 ? "text-yellow-400" : "text-green-400"}>
                        {password.length < 12 ? t("engine.entropy.vulnerable") : t("engine.entropy.secure")}
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
                  <div className="flex justify-between text-[10px] font-semibold uppercase tracking-wider text-[#22C55E]">
                    <span>{mode === "encrypt" ? t("engine.processing.encrypting") : t("engine.processing.decrypting")}...</span>
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
                  className="w-full h-14 rounded-2xl font-bold text-lg gap-3 bg-[#22C55E] hover:bg-[#1eb054] text-white shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                  onClick={processFile}
                  disabled={isProcessing || !password || (typeof window !== 'undefined' && !isHttps && !isDev)}
                >
                  {isProcessing ? <RefreshCcw className="w-6 h-6 animate-spin" /> : (mode === "encrypt" ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />)}
                  {mode === "encrypt" ? t("engine.button.encrypt") : t("engine.button.decrypt")}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button 
                    className="w-full h-14 rounded-2xl font-bold text-lg gap-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
                    onClick={handleDownloadResult}
                  >
                    <Download className="w-6 h-6" />
                    {t("engine.button.download")} {mode === "encrypt" ? t("engine.button.vault") : t("engine.button.file")}
                  </Button>
                  <Button 
                    variant="ghost"
                    className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground font-bold"
                    onClick={resetSession}
                  >
                    {t("engine.button.newSession")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
        
        <p className="text-center text-sm text-muted-foreground">
          {t("hero.footer")}
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
            {(Array.isArray(t.raw("status.items")) ? (t.raw("status.items") as any[]) : []).map((item: any, i: number) => {
              let status = item.s;
              let active = true;
              if (item.l.includes("HTTPS")) {
                status = isHttps ? t("status.verified") : (isDev ? t("status.localDev") : t("status.warning"));
                active = isHttps || isDev;
              }
              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-background border border-border">
                  <span className="text-sm text-muted-foreground">{item.l}</span>
                  <Badge className={active ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                    {status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border-border bg-card/80 shadow-xl">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t("status.blocked.title")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(t.raw("status.blocked.trackers")) ? (t.raw("status.blocked.trackers") as any[]) : []).map((tracker: string, i: number) => (
              <div key={i} className="px-3 py-1 rounded-full bg-background border border-border text-[10px] font-bold text-muted-foreground flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-red-500" />
                <span className="line-through opacity-50">{tracker}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-4 leading-relaxed">
            {t("status.blocked.note")}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border-border bg-card/80 shadow-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-[#3B82F6]" />
            {t("status.snapshot.title")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(Array.isArray(t.raw("status.snapshot.items")) ? (t.raw("status.snapshot.items") as any[]) : []).map((stat: any, i: number) => (
              <div key={i} className="p-3 rounded-2xl bg-background border border-border text-center">
                <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">{stat.l}</div>
                <div className="text-xs font-mono text-foreground">{stat.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#3B82F6]/10 to-[#22C55E]/10 border border-border relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <ShieldCheck className="w-32 h-32" />
          </div>
          <h4 className="font-bold mb-2">{t("status.zeroServer.title")}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("status.zeroServer.desc")}
          </p>
        </div>
      </div>
    </section>
  );
}
