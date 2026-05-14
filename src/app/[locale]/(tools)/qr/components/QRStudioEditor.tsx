"use client";

import React from "react";
import { 
  Layers, Play, Smartphone, Link as LinkIcon, Wifi, Phone, MessageSquare, AlertCircle, 
  Zap, Download, FileDown, QrCode, CheckCircle2, 
  Copy, Sparkles, Settings2, Cpu, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";

interface QRStudioEditorProps {
  t: any;
  value: string;
  handleValueChange: (v: string) => void;
  urlValid: boolean;
  logoFile: string | null;
  setLogoFile: (v: string | null) => void;
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fgColor: string;
  setFgColor: (v: string) => void;
  bgColor: string;
  setBgColor: (v: string) => void;
  size: number;
  level: "L" | "M" | "Q" | "H";
  setLevel: (v: "L" | "M" | "Q" | "H") => void;
  includeMargin: boolean;
  setIncludeMargin: (v: boolean) => void;
  copied: boolean;
  copyToClipboard: () => void;
  downloadQR: (format: "png" | "svg") => void;
  qrRef: React.RefObject<HTMLDivElement | null>;
  colorPresets: { name: string; fg: string; bg: string }[];
}

export function QRStudioEditor({
  t, value, handleValueChange, urlValid, logoFile, setLogoFile,
  handleLogoUpload, fgColor, setFgColor, bgColor, setBgColor,
  size, level, setLevel, includeMargin, setIncludeMargin,
  copied, copyToClipboard, downloadQR, qrRef, colorPresets
}: QRStudioEditorProps) {

  return (
    <div className="flex flex-col lg:flex-row flex-grow w-full h-full">
      {/* Left Sidebar - Identity Engine */}
      <aside className="flex w-full lg:w-[380px] border-b lg:border-b-0 lg:border-r border-border glass-card flex-col shrink-0 relative z-10 shadow-2xl min-h-0 lg:h-full">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-secondary/30 backdrop-blur-xl shrink-0">
          <div className="flex flex-col gap-1">
            <h3 className="text-[10px] font-bold tracking-wider text-primary flex items-center gap-2">
              <Layers className="w-4 h-4" /> {t("identity.title")}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">{t("identity.protocol")}</p>
              <div className="flex gap-1.5 opacity-30">
                <Play className="w-2 h-2 text-primary fill-primary" />
                <div className="w-2 h-2 rounded-full border border-foreground/20" />
                <Smartphone className="w-2 h-2" />
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] border-border bg-secondary/50 text-muted-foreground/60 px-4 py-1.5 rounded-full font-bold">{t("identity.status")}</Badge>
        </div>

        <ScrollArea className="flex-grow min-h-0">
          <div className="p-4 space-y-4">
            <div className="space-y-6">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">{t("identity.protocol")}</h4>
              <Tabs defaultValue="link" className="w-full">
                <TabsList className="w-full grid grid-cols-4 h-12 mb-6 bg-secondary/50 border border-border rounded-xl p-1">
                  <TabsTrigger value="link" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><LinkIcon className="w-3.5 h-3.5" /></TabsTrigger>
                  <TabsTrigger value="wifi" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Wifi className="w-3.5 h-3.5" /></TabsTrigger>
                  <TabsTrigger value="vcard" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Phone className="w-3.5 h-3.5" /></TabsTrigger>
                  <TabsTrigger value="text" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><MessageSquare className="w-3.5 h-3.5" /></TabsTrigger>
                </TabsList>

                <TabsContent value="link" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-semibold uppercase text-muted-foreground/60 tracking-wider">{t("identity.uriLabel")}</Label>
                    <Input 
                      value={value} 
                      onChange={(e) => handleValueChange(e.target.value)}
                      className={cn(
                        "bg-secondary/50 border-border rounded-2xl h-10 font-bold text-primary tracking-tight transition-all",
                        !urlValid && "border-red-500/50 bg-red-500/5"
                      )}
                      placeholder={t("identity.uriPlaceholder")}
                    />
                    <div className="flex justify-between items-center mt-2">
                      {!urlValid ? (
                        <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider flex items-center gap-2">
                          <AlertCircle className="w-3 h-3" /> {t("identity.uriInvalid")}
                        </p>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full", value.length > 200 ? "bg-orange-500" : "bg-emerald-500")} />
                          <p className="text-[9px] text-muted-foreground/50 font-semibold uppercase tracking-wider">{t("preview.status", { bytes: value.length })}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="wifi" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[9px] font-semibold uppercase text-muted-foreground/60 tracking-wider">{t("identity.ssid")}</Label>
                      <Input placeholder="MATRIX_NET" className="bg-secondary/50 border-border rounded-xl h-12" onChange={(e) => handleValueChange(`WIFI:S:${e.target.value};`)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[9px] font-semibold uppercase text-muted-foreground/60 tracking-wider">{t("identity.password")}</Label>
                      <Input type="password" placeholder="••••••••" className="bg-secondary/50 border-border rounded-xl h-12" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="vcard" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-semibold uppercase text-muted-foreground/60 tracking-wider">{t("identity.contact")}</Label>
                    <Input placeholder="Full Name" className="bg-secondary/50 border-border rounded-xl h-12" onChange={(e) => handleValueChange(`MECARD:N:${e.target.value};`)} />
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[9px] font-semibold uppercase text-muted-foreground/60 tracking-wider">{t("identity.textLabel")}</Label>
                    <Input value={value} onChange={(e) => handleValueChange(e.target.value)} className="bg-secondary/50 border-border rounded-xl h-12" />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">{t("identity.brand")}</h4>
              <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider opacity-60">{t("identity.centerLogo")}</Label>
                  {logoFile && <Button variant="ghost" size="sm" className="h-6 text-[8px] uppercase text-red-400" onClick={() => setLogoFile(null)}>{t("identity.remove")}</Button>}
                </div>
                <div className="relative group">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
                  <label htmlFor="logo-upload" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                    {logoFile ? (
                      <img src={logoFile} className="w-12 h-12 object-contain rounded-lg shadow-xl" alt="Uploaded logo preview" />
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6 text-foreground/10 mb-2 group-hover:text-primary transition-colors" />
                        <span className="text-[9px] font-bold text-muted-foreground/40">{t("identity.dropIcon")}</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <h4 className="text-xs font-semibold uppercase tracking-wider">{t("features.title")}</h4>
              </div>
              <p className="text-[10px] text-muted-foreground/50 leading-relaxed font-medium">
                {t("features.subtitle")}
              </p>
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-border bg-muted/40 shrink-0 flex flex-col gap-3">
          <Button 
            className="w-full h-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm gap-2 shadow-2xl shadow-primary/20 active:scale-95 transition-all"
            onClick={() => downloadQR("png")}
          >
            <Download className="w-4 h-4" />
            {t("export.png")}
          </Button>
          <Button 
            variant="outline"
            className="w-full h-10 rounded-xl border-border bg-secondary/50 text-muted-foreground/60 hover:text-foreground hover:bg-secondary font-bold text-[10px] gap-2 transition-all"
            onClick={() => downloadQR("svg")}
          >
            <FileDown className="w-4 h-4" />
            {t("export.svg")}
          </Button>
        </div>
      </aside>

      {/* Center - QR Workspace */}
      <section className="flex-grow bg-transparent relative flex flex-col shrink-0 lg:shrink min-h-[600px] lg:min-h-0">
        <header className="p-8 flex items-center justify-between bg-muted/40 backdrop-blur-3xl border-b border-border relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-11 h-9 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="font-bold text-2xl tracking-tight uppercase truncate max-w-[200px] md:max-w-md">
                {t("preview.title")}
              </h2>
              <div className="flex items-center gap-4">
                <Badge className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1 rounded-full font-semibold uppercase tracking-wider">
                  {t("hero.badge")}
                </Badge>
                <span className="text-[10px] text-muted-foreground/40 font-semibold uppercase tracking-wider truncate max-w-[200px]">
                  {value.length > 30 ? value.substring(0, 30) + "..." : value}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="h-10 rounded-2xl px-8 border-border bg-secondary/50 text-foreground font-bold gap-2 shadow-xl hover:bg-secondary transition-all" onClick={copyToClipboard}>
            {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            {t("preview.copy")}
          </Button>
        </header>

        <div className="flex-grow relative flex items-center justify-center p-8 lg:p-5 overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(40,minmax(0,1fr))] pointer-events-none opacity-[0.03]">
            {Array.from({ length: 1600 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-foreground/10" />
            ))}
          </div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="relative group"
          >
              <div ref={qrRef} className="p-5 rounded-3xl bg-white shadow-[0_80px_150px_-30px_rgba(0,0,0,1)] border border-border transition-transform group-hover:scale-[1.02] duration-700 relative">
                <QRCodeSVG 
                  value={value} 
                  size={size} 
                  fgColor={fgColor} 
                  bgColor={bgColor} 
                  includeMargin={includeMargin}
                  level={level}
                  imageSettings={logoFile ? {
                    src: logoFile,
                    x: undefined,
                    y: undefined,
                    height: size * 0.2,
                    width: size * 0.2,
                    excavate: true,
                  } : undefined}
                />
              </div>
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <Sparkles className="w-4 h-4 text-primary" />
                <p className="text-[10px] font-semibold tracking-wider text-primary">{t("hero.subtitle")}</p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Right Sidebar - Studio Matrix */}
      <aside className="flex w-full lg:w-[380px] border-t lg:border-t-0 lg:border-l border-border glass-card shrink-0 flex-col relative z-10 shadow-2xl h-[600px] lg:h-full">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-secondary/30 backdrop-blur-xl shrink-0">
          <div className="flex flex-col gap-1">
            <h3 className="text-[10px] font-bold tracking-[0.4em] text-primary flex items-center gap-3">
              <Settings2 className="w-4 h-4" /> {t("design.title")}
            </h3>
            <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-wider leading-none mt-1">{t("design.chromatic")}</p>
          </div>
          <Badge variant="outline" className="text-[10px] border-border bg-secondary/50 text-muted-foreground/60 px-4 py-1.5 rounded-full font-bold">{t("identity.status")}</Badge>
        </div>

        <ScrollArea className="flex-grow min-h-0">
          <div className="p-4 space-y-4">
            <div className="space-y-6">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">{t("design.chromatic")}</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-3 p-4 rounded-2xl bg-secondary/30 border border-border">
                  <Label className="text-[9px] font-semibold uppercase text-muted-foreground/60 tracking-wider">{t("design.foreground")}</Label>
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl border border-border shadow-lg" style={{ backgroundColor: fgColor }} />
                    <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="bg-secondary/50 border-border rounded-lg h-9 font-mono uppercase text-xs" />
                  </div>
                </div>
                <div className="space-y-3 p-4 rounded-2xl bg-secondary/30 border border-border">
                  <Label className="text-[9px] font-semibold uppercase text-muted-foreground/60 tracking-wider">{t("design.background")}</Label>
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl border border-border shadow-lg" style={{ backgroundColor: bgColor }} />
                    <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="bg-secondary/50 border-border rounded-lg h-9 font-mono uppercase text-xs" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[9px] font-semibold uppercase text-muted-foreground/60 tracking-wider">{t("design.presets")}</Label>
                  <div className="flex flex-wrap gap-2">
                    {colorPresets.map(p => (
                      <button
                        key={p.name}
                        onClick={() => { setFgColor(p.fg); setBgColor(p.bg); }}
                        className="px-4 py-2 rounded-xl border border-border bg-secondary/50 text-[9px] font-bold hover:border-primary/50 hover:text-primary transition-all"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">{t("design.config")}</h4>
              <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border">
                     <span className="text-[10px] font-bold text-muted-foreground/80 tracking-wider">{t("design.errorCorrection")}</span>
                     <select 
                      className="bg-secondary/50 border border-border text-primary text-[10px] font-bold px-2 py-1 rounded-lg"
                      value={level}
                      onChange={(e) => setLevel(e.target.value as any)}
                    >
                      <option value="L">L</option>
                      <option value="M">M</option>
                      <option value="Q">Q</option>
                      <option value="H">H</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border">
                     <span className="text-[10px] font-bold text-muted-foreground/80 tracking-wider">{t("design.margin")}</span>
                     <input type="checkbox" checked={includeMargin} onChange={(e) => setIncludeMargin(e.target.checked)} className="w-4 h-4 accent-primary" />
                  </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-secondary/30 border border-border space-y-4">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-primary" />
                <h4 className="text-xs font-semibold uppercase tracking-wider">{t("features.offline")}</h4>
              </div>
              <p className="text-[10px] text-muted-foreground/50 leading-relaxed font-medium">
                {t("edu.privacy.footer")}
              </p>
            </div>
          </div>
        </ScrollArea>
        
        <div className="p-8 border-t border-border bg-muted/40 shrink-0">
           <div className="flex items-center justify-center gap-3 text-[10px] font-bold tracking-wider text-muted-foreground/40">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> {t("design.secured")}
           </div>
        </div>
      </aside>
    </div>
  );
}
