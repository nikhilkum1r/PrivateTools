"use client";

import React from "react";
import { 
  Settings2, 
  Palette, 
  Sliders, 
  Sparkles, 
  FileCode, 
  Zap, 
  Smartphone, 
  Globe, 
  Apple, 
  Grid,
  RefreshCcw,
  CheckCircle2,
  Trash2,
  Download,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdUnit } from "@/components/shared/AdUnit";

interface IconSidebarProps {
  t: any;
  activeTab: 'basic' | 'style' | 'filters' | 'ai' | 'svg';
  setActiveTab: (tab: any) => void;
  zoom: number;
  setZoom: (val: number) => void;
  borderRadius: number;
  setBorderRadius: (val: number) => void;
  bgColor: string;
  setBgColor: (val: string) => void;
  bgType: 'solid' | 'gradient';
  setBgType: (val: 'solid' | 'gradient') => void;
  bgGradient: string;
  setBgGradient: (val: string) => void;
  shadow: number;
  setShadow: (val: number) => void;
  brightness: number;
  setBrightness: (val: number) => void;
  contrast: number;
  setContrast: (val: number) => void;
  exportFormat: string;
  setExportFormat: (val: string) => void;
  isProcessing: boolean;
  generateIcons: () => void;
  generateAdaptiveAndroid: () => void;
  palette: string[];
  isSvg: boolean;
  onClear: () => void;
  downloadAll: (items?: any) => void;
}

export function IconSidebar({
  t,
  activeTab,
  setActiveTab,
  zoom,
  setZoom,
  borderRadius,
  setBorderRadius,
  bgColor,
  setBgColor,
  bgType,
  setBgType,
  bgGradient,
  setBgGradient,
  shadow,
  setShadow,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  exportFormat,
  setExportFormat,
  isProcessing,
  generateIcons,
  generateAdaptiveAndroid,
  palette,
  isSvg,
  onClear,
  downloadAll
}: IconSidebarProps) {
  return (
    <div className="w-full lg:w-96 flex flex-col glass-card border-l border-border/40 relative z-20 overflow-hidden">
      <div className="p-8 border-b border-border/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-widest">{t("sidebar.title")}</h2>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl text-rose-500 hover:bg-rose-500/10" onClick={onClear}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* PRIMARY ACTIONS - MOVED TO TOP & MADE COLORFUL */}
        <div className="space-y-3 pt-4">
          <Button
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-600 via-primary to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 group/gen transition-all border-none"
            disabled={isProcessing}
            onClick={generateIcons}
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {t("sidebar.generate")} <Zap className="w-4 h-4 ml-2 group-hover/gen:scale-125 transition-transform fill-current" />
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 rounded-2xl border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10 font-black uppercase tracking-widest text-[8px] transition-all"
            onClick={generateAdaptiveAndroid}
            disabled={isProcessing}
          >
            <Smartphone className="w-4 h-4 mr-2" /> {t("sidebar.adaptive")}
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-2 p-1 bg-secondary/20 rounded-2xl border border-border/40 mt-6">
          {[
            { id: 'basic', i: Grid, color: 'text-blue-500', bg: 'bg-blue-500' },
            { id: 'style', i: Palette, color: 'text-purple-500', bg: 'bg-purple-500' },
            { id: 'filters', i: Sliders, color: 'text-emerald-500', bg: 'bg-emerald-500' },
            { id: 'ai', i: Sparkles, color: 'text-rose-500', bg: 'bg-rose-500' },
            { id: 'svg', i: FileCode, color: 'text-amber-500', bg: 'bg-amber-500' }
          ].map(tab => (
            <Button
              key={tab.id}
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-xl transition-all duration-300",
                activeTab === tab.id 
                  ? cn(tab.bg, "text-white shadow-lg scale-110") 
                  : cn("hover:bg-secondary/40", tab.color)
              )}
              onClick={() => setActiveTab(tab.id as any)}
              disabled={tab.id === 'svg' && !isSvg}
            >
              <tab.i className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-grow p-8">
        <div className="space-y-10 pb-20">
          {activeTab === 'basic' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("sidebar.zoom")}</Label>
                  <span className="text-xs font-bold tabular-nums text-primary">{Math.round(zoom * 100)}%</span>
                </div>
                <Slider value={[zoom * 100]} min={20} max={150} step={1} onValueChange={(v) => setZoom((Array.isArray(v) ? v[0] : v) / 100)} />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("sidebar.radius")}</Label>
                  <span className="text-xs font-bold tabular-nums text-primary">{borderRadius}%</span>
                </div>
                <Slider value={[borderRadius]} min={0} max={100} step={1} onValueChange={(v) => setBorderRadius(Array.isArray(v) ? v[0] : v)} />
                <div className="grid grid-cols-4 gap-2">
                  {[0, 20, 50, 100].map(r => (
                    <Button key={r} variant="outline" size="sm" className="rounded-xl text-[10px] h-8" onClick={() => setBorderRadius(r)}>{r}%</Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("sidebar.export")}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'auto', l: 'Auto' },
                    { id: 'image/png', l: 'PNG' },
                    { id: 'image/webp', l: 'WebP' },
                    { id: 'image/jpeg', l: 'JPG' }
                  ].map(f => (
                    <Button
                      key={f.id}
                      variant="outline"
                      className={cn(
                        "rounded-xl h-10 text-[10px] font-bold tracking-wider transition-all",
                        exportFormat === f.id ? "border-primary bg-primary/5 text-primary" : "hover:border-primary/50"
                      )}
                      onClick={() => setExportFormat(f.id)}
                    >
                      {f.l}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("sidebar.background")}</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className={cn("flex-grow rounded-xl text-[10px] font-bold", bgType === 'solid' && "border-primary bg-primary/5")}
                    onClick={() => setBgType('solid')}
                  >
                    Solid
                  </Button>
                  <Button 
                    variant="outline" 
                    className={cn("flex-grow rounded-xl text-[10px] font-bold", bgType === 'gradient' && "border-primary bg-primary/5")}
                    onClick={() => setBgType('gradient')}
                  >
                    Gradient
                  </Button>
                </div>
                
                {bgType === 'solid' ? (
                  <div className="grid grid-cols-5 gap-3">
                    {['transparent', '#ffffff', '#000000', '#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#6366f1', '#ec4899'].map(c => (
                      <button
                        key={c}
                        className={cn(
                          "w-10 h-10 rounded-xl border-2 transition-all hover:scale-110 relative overflow-hidden",
                          bgColor === c ? "border-primary shadow-lg scale-110" : "border-border/40"
                        )}
                        style={{ background: c === 'transparent' ? 'repeating-conic-gradient(#555 0% 25%, #333 0% 50%) 50% / 8px 8px' : c }}
                        onClick={() => setBgColor(c)}
                      >
                        {c === 'transparent' && <div className="absolute inset-0 flex items-center justify-center text-[6px] font-bold text-white uppercase tracking-tighter">X</div>}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                      'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
                      'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
                      'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
                    ].map(g => (
                      <button
                        key={g}
                        className={cn(
                          "h-12 rounded-xl border-2 transition-all hover:scale-105",
                          bgGradient === g ? "border-primary shadow-lg" : "border-border/40"
                        )}
                        style={{ background: g }}
                        onClick={() => { setBgType('gradient'); setBgGradient(g); if (bgColor === 'transparent') setBgColor('#ffffff'); }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {palette.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("sidebar.imagePalette")}</Label>
                  <div className="flex flex-wrap gap-2">
                    {palette.map(c => (
                      <button
                        key={c}
                        className={cn(
                          "w-8 h-8 rounded-lg border transition-all hover:scale-110",
                          bgColor === c ? "border-primary scale-110 shadow-md" : "border-border/40"
                        )}
                        style={{ background: c }}
                        onClick={() => setBgColor(c)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("sidebar.shadow")}</Label>
                  <span className="text-xs font-bold tabular-nums text-primary">{shadow}%</span>
                </div>
                <Slider value={[shadow]} min={0} max={100} step={1} onValueChange={(v) => setShadow(Array.isArray(v) ? v[0] : v)} />
              </div>
            </div>
          )}

          {activeTab === 'filters' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("sidebar.brightness")}</Label>
                    <span className="text-xs font-bold tabular-nums text-primary">{brightness}%</span>
                  </div>
                  <Slider value={[brightness]} min={50} max={200} step={1} onValueChange={(v) => setBrightness(Array.isArray(v) ? v[0] : v)} />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("sidebar.contrast")}</Label>
                    <span className="text-xs font-bold tabular-nums text-primary">{contrast}%</span>
                  </div>
                  <Slider value={[contrast]} min={50} max={200} step={1} onValueChange={(v) => setContrast(Array.isArray(v) ? v[0] : v)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/20 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-primary">{t("sidebar.ai_coming")}</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">{t("sidebar.ai_desc")}</p>
                <Button className="w-full rounded-xl bg-primary/20 text-primary border-none hover:bg-primary/30" disabled>
                   Join Waitlist
                </Button>
              </div>
            </div>
          )}
          
          <div className="pt-10">
            <AdUnit slot="1234567890" className="w-full" />
          </div>
        </div>
      </ScrollArea>

      <div className="p-8 border-t border-border/40 bg-secondary/5 text-center">
        <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-[0.3em]">{t("sidebar.secure_protocol")}</p>
      </div>
    </div>
  );
}
