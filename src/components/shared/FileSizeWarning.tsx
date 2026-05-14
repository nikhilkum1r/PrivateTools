"use client";

import React from "react";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { formatBytes } from "@/lib/utils/fileSize";
import { FREE_LIMITS, type Module } from "@/lib/utils/limits";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileSizeWarningProps {
  fileSize: number;
  module: Module;
  className?: string;
  onUpgrade?: () => void;
}

/**
 * Shows a warning banner when a file approaches or exceeds the free size limit.
 * Renders nothing if the file is within limits.
 */
export function FileSizeWarning({ fileSize, module, className, onUpgrade }: FileSizeWarningProps) {
  const limit = FREE_LIMITS[module];
  const pct = (fileSize / limit) * 100;

  if (pct < 80) return null; // Only show when >= 80% of limit

  const exceeded = fileSize > limit;
  const limitStr = formatBytes(limit);
  const sizeStr = formatBytes(fileSize);

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border text-sm",
        exceeded
          ? "bg-red-500/5 border-red-500/20 text-red-600 dark:text-red-400"
          : "bg-yellow-500/5 border-yellow-500/20 text-yellow-700 dark:text-yellow-400",
        className
      )}
    >
      <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
      <div className="flex-grow space-y-1">
        {exceeded ? (
          <>
            <p className="font-bold">File too large for free processing</p>
            <p className="text-xs opacity-80">
              Your file is {sizeStr}  the free limit is {limitStr}. Pro processes files up to {formatBytes(FREE_LIMITS[module] * 10)}.
            </p>
          </>
        ) : (
          <>
            <p className="font-bold">Large file  may be slow</p>
            <p className="text-xs opacity-80">
              {sizeStr} of {limitStr} free limit used. Processing may take longer than usual.
            </p>
          </>
        )}
      </div>
      {exceeded && onUpgrade && (
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 gap-1 text-xs border-red-500/30 text-red-600 hover:bg-red-500/10"
          onClick={onUpgrade}
        >
          Pro <ArrowRight className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
