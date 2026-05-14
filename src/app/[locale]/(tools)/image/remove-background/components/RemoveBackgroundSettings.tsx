"use client";

import React from "react";
import { 
  Settings2, 
  ImageIcon, 
  Download, 
  Copy, 
  CheckCircle2,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RemoveBackgroundSettingsProps {
  t: any;
  bgPresets: { name: string; value: string }[];
  bgColor: string;
  setBgColor: (color: string) => void;
  customBgPreview: string | null;
  handleCustomBgUpload: (e: any) => void;
  setCustomBgPreview: (preview: string | null) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: any) => void;
  exportFormat: string;
  setExportFormat: (format: any) => void;
  autoTrim: boolean;
  setAutoTrim: (val: boolean) => void;
  hasShadow: boolean;
  setHasShadow: (val: boolean) => void;
  isWorking: boolean;
  handleExport: () => void;
  handleCopy: () => void;
  status?: string;
}

export function RemoveBackgroundSettings({
  t,
  bgPresets,
  bgColor,
  setBgColor,
  customBgPreview,
  handleCustomBgUpload,
  setCustomBgPreview,
  aspectRatio,
  setAspectRatio,
  exportFormat,
  setExportFormat,
  autoTrim,
  setAutoTrim,
  hasShadow,
  setHasShadow,
  isWorking,
  handleExport,
  handleCopy,
  status
}: RemoveBackgroundSettingsProps) {
  return (
    <aside className="w-full lg:w-[360px] flex flex-col shrink-0 bg-black/10 relative z-10 border-l border-border">
      <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-black tracking-[0.4em] text-emerald-500 flex items-center gap-3 uppercase italic">
            <Settings2 className="w-4 h-4" /> {t("settings.title")}
          </h3>
          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-1">{t("settings.engine")}</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Background Presets */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between">
            {t("settings.background")} <span className="opacity-40">{t("settings.alpha")}</span>
          </p>
          <div className="grid grid-cols-4 gap-3">
            {bgPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => { setBgColor(preset.value); setCustomBgPreview(null); }}
                className={cn(
                  "aspect-square rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden",
                  bgColor === preset.value && !customBgPreview ? "border-emerald-500 scale-105 shadow-lg shadow-emerald-500/20" : "border-transparent hover:border-border"
                )}
                title={preset.name}
              >
                {preset.value === "transparent" ? (
                  <div className="w-full h-full bg-[#1e293b] relative opacity-50 flex items-center justify-center" style={{ backgroundImage: "linear-gradient(45deg, #0f172a 25%, transparent 25%), linear-gradient(-45deg, #0f172a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #0f172a 75%), linear-gradient(-45deg, transparent 75%, #0f172a 75%)", backgroundSize: "10px 10px", backgroundPosition: "0 0, 0 5px, 5px -5px, -5px 0px" }}>
                    <div className="w-full h-[1px] bg-red-500 rotate-45" />
                  </div>
                ) : (
                  <div className="w-full h-full" style={{ backgroundColor: preset.value }} />
                )}
              </button>
            ))}
            <div className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-emerald-500 transition-all flex items-center justify-center relative overflow-hidden group">
               <input 
                 type="color" 
                 value={bgColor === "transparent" || customBgPreview ? "#ffffff" : bgColor} 
                 onChange={(e) => { setBgColor(e.target.value); setCustomBgPreview(null); }} 
                 className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20" 
               />
               <div 
                 className="w-6 h-6 rounded-full border border-border pointer-events-none flex items-center justify-center shadow-inner" 
                 style={{ backgroundColor: (!customBgPreview && bgColor !== "transparent") ? bgColor : "#fff" }}
               />
            </div>
            <div className={cn("aspect-square rounded-xl border-2 transition-all flex items-center justify-center relative overflow-hidden group", customBgPreview ? "border-emerald-500" : "border-dashed border-border hover:border-emerald-500")}>
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={handleCustomBgUpload} 
                 className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-20" 
               />
               {customBgPreview ? (
                 <img src={customBgPreview} className="w-full h-full object-cover pointer-events-none" alt="Custom background preview" />
               ) : (
                 <ImageIcon className="w-5 h-5 text-muted-foreground pointer-events-none" />
               )}
            </div>
          </div>
        </div>

        {/* Social Canvas */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("settings.resizer")}</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "original", label: t("aspectRatios.original") },
              { id: "1:1", label: t("aspectRatios.1:1") },
              { id: "4:5", label: t("aspectRatios.4:5") },
              { id: "9:16", label: t("aspectRatios.9:16") },
            ].map((r) => (
              <button key={r.id} onClick={() => setAspectRatio(r.id as any)} className={cn("py-2 px-1 text-[9px] font-black rounded-lg border transition-all uppercase tracking-tighter", aspectRatio === r.id ? "bg-emerald-500 text-white border-emerald-500" : "border-border text-muted-foreground hover:border-emerald-500/50")}>{r.label}</button>
            ))}
          </div>
        </div>

        {/* Visual Polish */}
        <div className="space-y-4 pt-4 border-t border-border/40">
           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("settings.visualPolish")}</p>
           <div className="grid grid-cols-1 gap-3">
              <button onClick={() => setAutoTrim(!autoTrim)} className={cn("flex items-center justify-between p-4 rounded-2xl border transition-all", autoTrim ? "bg-emerald-500/10 border-emerald-500/30" : "border-border/40 hover:bg-white/5")}>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500"><CheckCircle2 className="w-4 h-4" /></div>
                    <div className="text-left">
                       <p className="text-[10px] font-black uppercase italic tracking-widest">{t("settings.autoTrim")}</p>
                       <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{t("settings.autoTrimDesc")}</p>
                    </div>
                 </div>
                 <div className={cn("w-10 h-5 rounded-full relative transition-colors", autoTrim ? "bg-emerald-500" : "bg-white/10")}>
                    <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", autoTrim ? "left-6" : "left-1")} />
                 </div>
              </button>
              <button onClick={() => setHasShadow(!hasShadow)} className={cn("flex items-center justify-between p-4 rounded-2xl border transition-all", hasShadow ? "bg-emerald-500/10 border-emerald-500/30" : "border-border/40 hover:bg-white/5")}>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500"><Zap className="w-4 h-4" /></div>
                    <div className="text-left">
                       <p className="text-[10px] font-black uppercase italic tracking-widest">{t("settings.dropShadow")}</p>
                       <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-60">{t("settings.shadowDesc")}</p>
                    </div>
                 </div>
                 <div className={cn("w-10 h-5 rounded-full relative transition-colors", hasShadow ? "bg-emerald-500" : "bg-white/10")}>
                    <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", hasShadow ? "left-6" : "left-1")} />
                 </div>
              </button>
           </div>
        </div>

        {/* Format */}
        <div className="space-y-4 pt-4 border-t border-border/40">
           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("settings.format")}</p>
           <div className="grid grid-cols-3 gap-2">
              {["image/png", "image/webp", "image/jpeg"].map((fmt) => (
                 <button key={fmt} onClick={() => setExportFormat(fmt as any)} className={cn("py-2 text-[10px] font-black rounded-lg border transition-all uppercase tracking-widest", exportFormat === fmt ? "bg-emerald-500 text-white border-emerald-500" : "border-border text-muted-foreground hover:border-emerald-500/50")}>
                    {fmt.split("/")[1]}
                 </button>
              ))}
           </div>
        </div>
      </div>

      <div className="p-6 bg-black/40 border-t border-border space-y-3 shrink-0">
         <Button 
           className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-[0.2em] italic text-xs shadow-xl shadow-emerald-500/20 gap-3 group/dl transition-all" 
           onClick={handleExport}
           disabled={isWorking || status !== "done"}
         >
            <Download className="w-5 h-5 group-hover/dl:translate-y-1 transition-transform" /> {t("tools.download")}
         </Button>
         <Button 
           variant="outline" 
           className="w-full h-12 rounded-2xl border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500 font-black uppercase tracking-[0.1em] italic text-[10px] gap-2 transition-all" 
           onClick={handleCopy}
           disabled={isWorking || status !== "done"}
         >
            <Copy className="w-4 h-4" /> {t("tools.copy")}
         </Button>
      </div>
    </aside>
  );
}
