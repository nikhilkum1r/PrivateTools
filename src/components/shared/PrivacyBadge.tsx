import React from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function PrivacyBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold select-none",
        className
      )}
    >
      <ShieldCheck className="w-4 h-4" />
      <span>No data leaves your device</span>
    </div>
  );
}
