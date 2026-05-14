import React from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  className?: string;
  variant?: "outline" | "filled" | "ghost";
}

export function TrustBadge({ className, variant = "outline" }: TrustBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
      variant === "outline" && "border border-emerald-500/30 bg-emerald-500/5 text-emerald-500",
      variant === "filled" && "bg-emerald-500 text-white",
      variant === "ghost" && "text-emerald-500/70",
      className
    )}>
      <div className="relative">
        <ShieldCheck className="w-3 h-3" />
        <div className="absolute inset-0 animate-ping opacity-20 bg-current rounded-full" />
      </div>
      <span>100% Local Processing</span>
    </div>
  );
}
