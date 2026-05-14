"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { toast } from "sonner";
import Link from "next/link";
import { encryptVault, decryptVault } from "@/lib/privacy/crypto";
import { ExportManager } from "@/lib/export-manager";
import { useTranslations } from "next-intl";
import { ClientOnly } from "@/components/shared/ClientOnly";
import { Lock, Key, ShieldCheck, Trash2, Globe, Code2 } from "lucide-react";
import { AdUnit } from "@/components/shared/AdUnit";

// Modular Components
import { VaultHero } from "./components/VaultHero";
import { VaultEditor } from "./components/VaultEditor";
import { VaultLandingExtras } from "./components/VaultLandingExtras";

export default function VaultClient() {
  const t = useTranslations("vault");
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
        setResult({ blob: vaultBlob, name: `${file.name}.vault` });
        toast.success(t("toast.secured"));
      } else {
        const result = await decryptVault(file, password);
        if (result.success) {
          setProgress(90);
          setResult({ blob: result.blob, name: result.name });
          toast.success(t("toast.extracted"));
        } else {
          let errorKey = "toast.failed";
          if (result.code === "LEGACY") errorKey = "toast.legacyVersion";
          else if (result.code === "AUTH_FAILED") errorKey = "toast.invalidPassword";
          else if (result.code === "INVALID_FILE") errorKey = "toast.invalidFile";
          
          setError(t(errorKey));
          toast.error(t(errorKey));
          setProgress(0);
          return;
        }
      }
      setProgress(100);
    } catch (e: any) {
      console.error(e);
      toast.error(t("toast.failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadResult = () => {
    if (!result) return;
    ExportManager.downloadFile(result.blob, result.name);
  };

  const resetSession = () => {
    setFile(null);
    setResult(null);
    setPassword("");
    setError(null);
  };

  return (
    <ClientOnly fallback={<div className="min-h-screen bg-background animate-pulse" />}>
      <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
        <Navbar />
        <VaultHero t={t} />
        
        <div className="container mx-auto px-4 -mt-8 mb-12 max-w-6xl">
          <AdUnit slot="7890123456" type="banner" />
        </div>

        <main id="main-content" className="container mx-auto px-4 py-12 space-y-24 max-w-6xl">
          <VaultEditor 
            t={t}
            mode={mode}
            setMode={setMode}
            file={file}
            setFile={setFile}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            isProcessing={isProcessing}
            progress={progress}
            result={result}
            setResult={setResult}
            error={error}
            setError={setError}
            isHttps={isHttps}
            isDev={isDev}
            handleDrop={handleDrop}
            processFile={processFile}
            handleDownloadResult={handleDownloadResult}
            resetSession={resetSession}
          />

          <AdUnit slot="8901234567" type="in-article" />

          <VaultLandingExtras t={t} />

          <AdUnit slot="9012345678" type="in-feed" />

          {/* Related Tools */}
          <section className="space-y-12 pt-12 border-t border-border">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">{t("landing.related.title")}</h2>
              <p className="text-muted-foreground">{t("landing.related.subtitle")}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: useTranslations("common")("tools.secureNotes"), icon: Lock, href: "/privacy/secure-notes" },
                { name: useTranslations("common")("tools.passwordGenerator"), icon: Key, href: "/privacy/password-generator" },
                { name: useTranslations("common")("tools.passwordChecker"), icon: ShieldCheck, href: "/privacy/password-checker" },
                { name: useTranslations("common")("tools.metadataCleaner"), icon: Trash2, href: "/security/metadata-cleaner" },
                { name: useTranslations("common")("tools.steganography"), icon: Code2, href: "/security/steganography" },
                { name: useTranslations("common")("privacy"), icon: Globe, href: "/privacy" }
              ].map((tool, i) => (
                <Link key={i} href={tool.href} className="group">
                  <div className="p-4 rounded-3xl bg-card border border-border flex flex-col items-center gap-3 group-hover:border-[#3B82F6] transition-all group-hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center group-hover:scale-110 transition-transform">
                      <tool.icon className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <span className="text-[10px] font-bold tracking-tight text-foreground text-center">{tool.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <AdUnit slot="0123456789" type="multiplex" />
        </main>

        <footer className="mt-auto py-12 px-4 border-t border-border bg-background">
          <div className="container mx-auto text-center space-y-4">
            <p className="text-foreground font-bold text-lg">{t("footer.text")}</p>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">{t("footer.noTracking")}</p>
            <div className="pt-6">
              <Link href="/" className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                SAFTOOLS.SPACE © 2026
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </ClientOnly>
  );
}


