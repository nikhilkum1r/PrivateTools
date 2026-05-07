"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
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
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function VaultClient() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const derivationIterations = 100000;
  const vaultPrefix = "PVLT"; // Magic bytes for validation

  const handleDrop = (files: File[]) => {
    if (files[0]) {
      setFile(files[0]);
      setResult(null);
      setError(null);
      setProgress(0);
    }
  };

  const deriveKey = async (password: string, salt: Uint8Array) => {
    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

    // Force salt to be a non-shared buffer to satisfy SubtleCrypto security requirements
    const nonSharedSalt = new Uint8Array(salt.byteLength);
    nonSharedSalt.set(new Uint8Array(salt));

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: nonSharedSalt,
        iterations: derivationIterations,
        hash: "SHA-256",
      },
      passwordKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  };

  const processFile = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    setProgress(10);
    setError(null);

    try {
      const fileData = await file.arrayBuffer();
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      
      if (mode === "encrypt") {
        setProgress(30);
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const key = await deriveKey(password, salt);

        setProgress(60);
        // Metadata: [Magic(4)][FileNameLength(4)][FileName(N)][FileTypeLength(4)][FileType(M)]
        const nameBytes = encoder.encode(file.name);
        const typeBytes = encoder.encode(file.type || "application/octet-stream");
        
        const metadataHeader = new Uint8Array(12 + nameBytes.length + typeBytes.length);
        metadataHeader.set(encoder.encode(vaultPrefix), 0);
        new DataView(metadataHeader.buffer).setUint32(4, nameBytes.length, false);
        metadataHeader.set(nameBytes, 8);
        new DataView(metadataHeader.buffer).setUint32(8 + nameBytes.length, typeBytes.length, false);
        metadataHeader.set(typeBytes, 12 + nameBytes.length);

        const encryptedContent = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          key,
          fileData
        );

        setProgress(90);
        const combined = new Uint8Array(salt.length + iv.length + metadataHeader.length + encryptedContent.byteLength);
        combined.set(salt, 0);
        combined.set(iv, 16);
        combined.set(metadataHeader, 28);
        combined.set(new Uint8Array(encryptedContent), 28 + metadataHeader.length);

        setResult({
          blob: new Blob([combined], { type: "application/octet-stream" }),
          name: `${file.name}.vault`
        });
      } else {
        setProgress(20);
        const fullData = new Uint8Array(fileData);
        const salt = fullData.slice(0, 16);
        const iv = fullData.slice(16, 28);
        const key = await deriveKey(password, salt);

        setProgress(50);
        // Read Metadata
        const magic = decoder.decode(fullData.slice(28, 32));
        if (magic !== vaultPrefix) throw new Error("Not a valid Private Vault file.");

        const nameLen = new DataView(fullData.buffer).getUint32(32, false);
        const originalName = decoder.decode(fullData.slice(36, 36 + nameLen));
        
        const typeLenPos = 36 + nameLen;
        const typeLen = new DataView(fullData.buffer).getUint32(typeLenPos, false);
        const originalType = decoder.decode(fullData.slice(typeLenPos + 4, typeLenPos + 4 + typeLen));

        const payloadStart = typeLenPos + 4 + typeLen;
        const encryptedContentRaw = fullData.slice(payloadStart);
        
        // Ensure non-shared buffer for decryption payload
        const encryptedContent = new Uint8Array(encryptedContentRaw.byteLength);
        encryptedContent.set(encryptedContentRaw);

        // Ensure non-shared buffer for IV
        const ivSafe = new Uint8Array(iv.byteLength);
        ivSafe.set(iv);

        try {
          setProgress(80);
          const decryptedContent = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: ivSafe },
            key,
            encryptedContent
          );

          setResult({
            blob: new Blob([decryptedContent], { type: originalType }),
            name: originalName
          });
        } catch (e) {
          throw new Error("Invalid password or corrupted vault file.");
        }
      }
      setProgress(100);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-6">
            <Badge className="bg-red-500/10 text-red-500 border-red-500/20 py-2 px-6 rounded-full uppercase tracking-[0.3em] text-[10px] font-black">
              Military-Grade Cryptography
            </Badge>
            <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-none">
              Secure <span className="text-red-500">Vault.</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              Hardware-accelerated AES-GCM 256-bit extraction. Recover original files with zero metadata loss.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-8">
              <Card className="p-8 bg-secondary/30 border-border rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="flex gap-4 p-1 bg-muted/40 rounded-2xl mb-8 border border-border">
                  <Button 
                    className={cn("flex-1 h-12 rounded-xl font-black gap-2 transition-all", mode === "encrypt" ? "bg-red-600 text-foreground" : "bg-transparent text-muted-foreground")}
                    onClick={() => { setMode("encrypt"); setResult(null); setFile(null); }}
                  >
                    <Lock className="w-4 h-4" /> SECURE
                  </Button>
                  <Button 
                    className={cn("flex-1 h-12 rounded-xl font-black gap-2 transition-all", mode === "decrypt" ? "bg-red-600 text-foreground" : "bg-transparent text-muted-foreground")}
                    onClick={() => { setMode("decrypt"); setResult(null); setFile(null); }}
                  >
                    <Unlock className="w-4 h-4" /> EXTRACT
                  </Button>
                </div>

                {!file ? (
                  <DropZone 
                    onFilesDrop={handleDrop} 
                    className="h-80 bg-secondary/50 border-dashed border-border rounded-3xl"
                    accept={mode === "encrypt" ? "*/*" : ".vault"}
                  />
                ) : (
                  <div className="space-y-8">
                    <div className="p-8 rounded-[2rem] bg-muted/60 border border-border flex items-center gap-6 relative group/file">
                      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
                        <FileLock2 className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-lg font-black truncate">{file.name}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                          {((file.size || 0) / 1024 / 1024).toFixed(2)} MB • READY
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl text-muted-foreground hover:text-red-500 transition-colors"
                        onClick={() => { setFile(null); setResult(null); }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                          <Key className="w-3 h-3" /> Security Key
                        </Label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-[9px] font-black uppercase tracking-tighter text-muted-foreground/50 hover:text-red-500 hover:bg-red-500/10 rounded-full px-3"
                          onClick={() => window.open('/security', '_blank')}
                        >
                          Need a password?
                        </Button>
                      </div>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter vault password..." 
                          className="h-16 bg-secondary/50 border-border rounded-2xl px-6 font-mono text-lg focus:ring-red-500/20 focus:border-red-500/40 pr-16 text-foreground"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </Button>
                      </div>
                    </div>

                    {isProcessing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-red-500">
                          <span>{mode === "encrypt" ? "Sealing" : "Extracting"}...</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-secondary/50 overflow-hidden" />
                      </div>
                    )}

                    {error && (
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-3">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}

                    {!result ? (
                      <Button 
                        className="w-full h-16 rounded-2xl font-black gap-3 text-xl shadow-2xl shadow-red-500/20 bg-red-600 hover:bg-red-700 text-foreground transition-all hover:scale-[1.02]"
                        disabled={isProcessing || !password}
                        onClick={processFile}
                      >
                        {isProcessing ? <RefreshCcw className="w-6 h-6 animate-spin" /> : (mode === "encrypt" ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />)}
                        {mode === "encrypt" ? "Encrypt to .vault" : "Extract Original"}
                      </Button>
                    ) : (
                      <Button 
                        className="w-full h-16 rounded-2xl font-black gap-3 text-xl shadow-2xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-foreground transition-all hover:scale-[1.02]"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = URL.createObjectURL(result.blob);
                          a.download = result.name;
                          a.click();
                        }}
                      >
                        <Download className="w-6 h-6" />
                        Download Result
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <Card className="p-8 bg-secondary/30 border-border rounded-[2.5rem] space-y-8">
                <div className="flex items-center gap-4 text-red-500">
                  <ShieldAlert className="w-6 h-6" />
                  <h3 className="text-xs font-black uppercase tracking-widest">Vault Protocol</h3>
                </div>

                <div className="space-y-6">
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest mb-1 text-foreground/80">Full Metadata Restoration</h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">Unlike basic encryption, our vault stores original filenames and MIME types securely, restoring files perfectly upon extraction.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest mb-1 text-foreground/80">Magic-Byte Validation</h4>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">Automatic vault verification ensures you only attempt to decrypt valid Private Vault containers.</p>
                      </div>
                   </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
