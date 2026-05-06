"use client";

import React from "react";
import { Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProBadgeProps {
  className?: string;
  variant?: "inline" | "banner";
}

export function ProBadge({ className, variant = "inline" }: ProBadgeProps) {
  if (variant === "banner") {
    return (
      <div className={cn("flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-sm font-bold", className)}>
        <Server className="w-4 h-4" />
        Processing on our secure server
      </div>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={cn("gap-1.5 bg-violet-500/10 text-violet-600 border-violet-500/20 font-bold", className)}
    >
      <Server className="w-3 h-3" />
      Pro — Server Processing
    </Badge>
  );
}
