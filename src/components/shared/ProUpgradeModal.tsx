"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Zap, Check, ArrowRight, Server } from "lucide-react";
import { formatBytes } from "@/lib/utils/fileSize";
import { FREE_LIMITS, PRO_LIMITS, type Module } from "@/lib/utils/limits";
import { toast } from "sonner";

interface ProUpgradeModalProps {
  open: boolean;
  onClose: () => void;
  module: Module;
  fileSize?: number;
  /** Custom reason shown in the modal */
  reason?: string;
}

const PRO_FEATURES = [
  "Files up to 10× larger",
  "Unlimited batch processing",
  "Priority server processing queue",
  "Shareable links (72h expiry)",
  "File history — last 50 jobs",
];

export function ProUpgradeModal({ open, onClose, module, fileSize, reason }: ProUpgradeModalProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const freeLimit = FREE_LIMITS[module];
  const proLimit = PRO_LIMITS[module];

  const handleWaitlist = () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    // Phase 1: just show confirmation. Phase 2: POST to /api/waitlist
    setSubmitted(true);
    toast.success("You're on the waitlist! We'll notify you when Pro launches.");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md rounded-xl border-primary/10 p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-violet-600/20 to-primary/10 px-8 py-8 space-y-4 text-center border-b border-primary/10">
          <div className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto shadow-xl shadow-primary/30">
            <Zap className="w-8 h-8 fill-current" />
          </div>
          <div>
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-2">Pro — Coming Soon</Badge>
            <DialogTitle className="text-2xl font-black">Unlock More Power</DialogTitle>
          </div>
        </div>

        {/* Context */}
        <div className="px-8 py-6 space-y-6">
          {/* Context-specific reason */}
          {(fileSize || reason) && (
            <div className="p-4 rounded-xl bg-secondary/50 border border-primary/5 space-y-1">
              {fileSize && (
                <p className="text-sm font-bold">
                  Your file: <span className="text-primary">{formatBytes(fileSize)}</span>
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {reason ?? `Free limit: ${formatBytes(freeLimit)} · Pro limit: ${formatBytes(proLimit)}`}
              </p>
            </div>
          )}

          {/* Feature list */}
          <div className="space-y-2">
            {PRO_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                {f}
              </div>
            ))}
            <div className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Server className="w-3 h-3" />
              </div>
              Server-side processing for heavy files
            </div>
          </div>

          {/* Waitlist CTA */}
          {!submitted ? (
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Join the waitlist — $8/mo at launch</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                  onKeyDown={(e) => e.key === "Enter" && handleWaitlist()}
                />
                <Button className="rounded-xl gap-1 shrink-0" onClick={handleWaitlist}>
                  Join <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-center">
              <p className="font-bold text-green-600">You&apos;re on the list! 🎉</p>
              <p className="text-xs text-muted-foreground mt-1">We&apos;ll email you when Pro launches.</p>
            </div>
          )}

          <Button variant="ghost" className="w-full text-muted-foreground text-xs" onClick={onClose}>
            Continue with free version
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
