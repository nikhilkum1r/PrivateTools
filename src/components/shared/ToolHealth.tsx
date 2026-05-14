"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Cpu, Shield, Wifi, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolHealthProps {
  status?: "idle" | "processing" | "done" | "complete" | "error";
  className?: string;
}

export const ToolHealth = ({ status = "idle", className }: ToolHealthProps) => {
  const t = useTranslations("common.systemHealth");
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const indicators = [
    { 
      label: t("localEngine"), 
      icon: Cpu, 
      active: status === "processing", 
      color: "text-emerald-500",
      description: t("localEngineDesc")
    },
    { 
      label: t("secureSession"), 
      icon: Shield, 
      active: true, 
      color: "text-blue-500",
      description: t("secureSessionDesc")
    },
    { 
      label: isOnline ? t("online") : t("offlineReady"), 
      icon: isOnline ? Zap : Wifi, 
      active: !isOnline, 
      color: isOnline ? "text-amber-500" : "text-emerald-500",
      description: isOnline ? t("onlineDesc") : t("offlineReadyDesc")
    },
    { 
      label: t("zeroTracking"), 
      icon: Lock, 
      active: true, 
      color: "text-purple-500",
      description: t("zeroTrackingDesc")
    },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-4 p-4 rounded-2xl glass-card border border-border/50 bg-secondary/5", className)}>
      <div className="flex items-center gap-2 mr-2">
        <div className={cn(
          "w-2 h-2 rounded-full animate-pulse",
          status === "processing" ? "bg-emerald-500" : (status === "done" || status === "complete" ? "bg-blue-500" : "bg-muted-foreground/30")
        )} />
        <span className="text-[10px] font-bold tracking-tight text-foreground">
          {t("title")}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {indicators.map((indicator, i) => (
          <div key={i} className="flex items-center gap-2 group relative">
            <indicator.icon className={cn("w-3.5 h-3.5", indicator.active ? indicator.color : "text-muted-foreground/40")} />
            <span className={cn(
              "text-[9px] font-semibold uppercase tracking-wider",
              indicator.active ? "text-foreground" : "text-muted-foreground/60"
            )}>
              {indicator.label}
            </span>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-popover border border-border text-[8px] font-bold text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
              {indicator.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
