"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Monitor, 
  Smartphone, 
  Apple, 
  Bell, 
  Menu, 
  Settings2,
  ChevronRight,
  Search,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IconPreviewAreaProps {
  t: any;
  preview: string;
  zoom: number;
  borderRadius: number;
  bgColor: string;
  bgType: 'solid' | 'gradient';
  bgGradient: string;
  shadow: number;
  brightness: number;
  contrast: number;
  previewTheme: 'light' | 'dark';
  setPreviewTheme: (theme: 'light' | 'dark') => void;
  previewContext: 'home' | 'settings' | 'notifications';
  setPreviewContext: (ctx: 'home' | 'settings' | 'notifications') => void;
  isSvg: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function IconPreviewArea({
  t,
  preview,
  zoom,
  borderRadius,
  bgColor,
  bgType,
  bgGradient,
  shadow,
  brightness,
  contrast,
  previewTheme,
  setPreviewTheme,
  previewContext,
  setPreviewContext,
  isSvg,
  canvasRef
}: IconPreviewAreaProps) {
  const renderIcon = (className?: string) => (
    <div 
      className={cn("relative overflow-hidden transition-all duration-300", className)}
      style={{
        borderRadius: `${borderRadius / 2}%`,
        background: bgType === 'gradient' ? bgGradient : bgColor,
        boxShadow: shadow > 0 ? `0 ${shadow / 5}px ${shadow / 2}px rgba(0,0,0,0.3)` : 'none',
        filter: `brightness(${brightness}%) contrast(${contrast}%)`
      }}
    >
      <img 
        src={preview} 
        alt="Preview" 
        className="absolute inset-0 w-full h-full object-contain"
        style={{ transform: `scale(${zoom})` }}
      />
    </div>
  );

  return (
    <div className="flex-grow flex flex-col relative overflow-hidden bg-secondary/5">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-1 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl">
        {[
          { id: 'light', l: 'Light' },
          { id: 'dark', l: 'Dark' }
        ].map(theme => (
          <Button
            key={theme.id}
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-xl text-[8px] font-bold uppercase tracking-widest px-4 h-8",
              previewTheme === theme.id ? "bg-primary text-white" : "text-white/40 hover:text-white"
            )}
            onClick={() => setPreviewTheme(theme.id as any)}
          >
            {theme.l}
          </Button>
        ))}
        <div className="w-[1px] h-4 bg-white/10 mx-2" />
        {[
          { id: 'home', i: Monitor },
          { id: 'settings', i: Settings2 },
          { id: 'notifications', i: Bell }
        ].map(ctx => (
          <Button
            key={ctx.id}
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-xl w-8 h-8",
              previewContext === ctx.id ? "bg-primary/20 text-primary" : "text-white/40 hover:text-white"
            )}
            onClick={() => setPreviewContext(ctx.id as any)}
          >
            <ctx.i className="w-3.5 h-3.5" />
          </Button>
        ))}
      </div>

      <div className={cn(
        "flex-grow flex items-center justify-center p-12 transition-colors duration-700 relative",
        previewTheme === 'dark' ? "bg-[#0a0a0a]" : "bg-white"
      )}
      style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, ${previewTheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }}>
        <AnimatePresence mode="wait">
          {previewContext === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="relative"
            >
              <div className={cn(
                "w-[320px] h-[640px] rounded-[3rem] border-[8px] relative overflow-hidden shadow-2xl transition-colors duration-500",
                previewTheme === 'dark' ? "border-[#1a1a1a] bg-black" : "border-[#f0f0f0] bg-white"
              )}>
                <div className="absolute top-0 inset-x-0 h-8 flex items-center justify-center">
                  <div className="w-20 h-4 bg-current/10 rounded-full" />
                </div>
                
                <div className="mt-20 px-6 grid grid-cols-4 gap-x-4 gap-y-8">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="space-y-1 text-center opacity-40">
                      <div className={cn("aspect-square rounded-2xl", previewTheme === 'dark' ? "bg-white/5" : "bg-black/5")} />
                      <div className={cn("h-1.5 w-8 mx-auto rounded-full", previewTheme === 'dark' ? "bg-white/10" : "bg-black/10")} />
                    </div>
                  ))}
                  <div className="space-y-1 text-center">
                    {renderIcon("w-full aspect-square")}
                    <div className={cn("h-1.5 w-10 mx-auto rounded-full bg-primary/40")} />
                  </div>
                </div>

                <div className="absolute bottom-6 inset-x-6 h-20 rounded-[2rem] bg-current/5 border border-current/10 backdrop-blur-md flex items-center justify-around px-4">
                  {[Monitor, Globe, Search, Apple].map((I, i) => (
                    <I key={i} className="w-5 h-5 opacity-20" />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {previewContext === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-lg space-y-6"
            >
              <div className={cn(
                "rounded-[2.5rem] border overflow-hidden shadow-2xl transition-colors duration-500",
                previewTheme === 'dark' ? "bg-[#111] border-white/5" : "bg-white border-black/5"
              )}>
                <div className="p-8 border-b border-current/5 flex items-center justify-between">
                  <h3 className={cn("text-xl font-bold", previewTheme === 'dark' ? "text-white" : "text-black")}>Settings</h3>
                  <div className="w-8 h-8 rounded-full bg-primary/20" />
                </div>
                <div className="p-4 space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 flex items-center gap-4 rounded-2xl hover:bg-current/5 transition-colors group">
                      <div className={cn("w-10 h-10 rounded-xl", previewTheme === 'dark' ? "bg-white/5" : "bg-black/5")} />
                      <div className="flex-grow space-y-2">
                        <div className={cn("h-3 w-32 rounded-full", previewTheme === 'dark' ? "bg-white/10" : "bg-black/10")} />
                        <div className={cn("h-2 w-48 rounded-full", previewTheme === 'dark' ? "bg-white/5" : "bg-black/5")} />
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-20" />
                    </div>
                  ))}
                  <div className="p-4 flex items-center gap-4 rounded-2xl bg-primary/5 border border-primary/10">
                    {renderIcon("w-10 h-10")}
                    <div className="flex-grow space-y-2">
                      <div className="h-3 w-40 rounded-full bg-primary/40" />
                      <div className="h-2 w-32 rounded-full bg-primary/20" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {previewContext === 'notifications' && (
            <motion.div 
              key="notifications"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full max-w-md space-y-4"
            >
              {[1, 2].map(i => (
                <div key={i} className={cn(
                  "p-6 rounded-[2rem] border flex items-center gap-6 shadow-xl opacity-40",
                  previewTheme === 'dark' ? "bg-[#111] border-white/5" : "bg-white border-black/5"
                )}>
                  <div className={cn("w-12 h-12 rounded-2xl", previewTheme === 'dark' ? "bg-white/10" : "bg-black/10")} />
                  <div className="space-y-2 flex-grow">
                    <div className={cn("h-3 w-32 rounded-full", previewTheme === 'dark' ? "bg-white/10" : "bg-black/10")} />
                    <div className={cn("h-2 w-full rounded-full", previewTheme === 'dark' ? "bg-white/5" : "bg-black/5")} />
                  </div>
                </div>
              ))}
              <div className={cn(
                "p-6 rounded-[2rem] border flex items-center gap-6 shadow-2xl relative overflow-hidden",
                previewTheme === 'dark' ? "bg-[#111] border-primary/20" : "bg-white border-primary/20"
              )}>
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                {renderIcon("w-12 h-12")}
                <div className="space-y-3 flex-grow">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-32 rounded-full bg-primary/40" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-primary">Now</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-primary/10" />
                  <div className="h-2 w-2/3 rounded-full bg-primary/5" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="hidden">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
