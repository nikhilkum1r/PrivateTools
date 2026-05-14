"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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



export function ProUpgradeModal({ open, onClose, module, fileSize, reason }: ProUpgradeModalProps) {
  const t = useTranslations("common.pro");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const freeLimit = FREE_LIMITS[module];
  const proLimit = PRO_LIMITS[module];

  const PRO_FEATURES = [
    t("features.largerFiles"),
    t("features.batch"),
    t("features.priority"),
    t("features.share"),
    t("features.history"),
  ];

  const handleWaitlist = () => {
    if (!email.includes("@")) {
      toast.error(t("validEmail"));
      return;
    }
    // Phase 1: just show confirmation. Phase 2: POST to /api/waitlist
    setSubmitted(true);
    toast.success(t("waitlistSuccess"));
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
            <Badge className="bg-primary/10 text-primary border-primary/20 mb-2">{t("comingSoon")}</Badge>
            <DialogTitle className="text-2xl font-extrabold tracking-tight">{t("unlockPower")}</DialogTitle>
            <DialogDescription className="sr-only">
              {t("unlockPower")}
            </DialogDescription>
          </div>
        </div>

        {/* Context */}
        <div className="px-8 py-6 space-y-6">
          {/* Context-specific reason */}
          {(fileSize || reason) && (
            <div className="p-4 rounded-xl bg-secondary/50 border border-primary/5 space-y-1">
              {fileSize && (
                <p className="text-sm font-bold">
                  {t("yourFile", { size: formatBytes(fileSize) })}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {reason ?? `${t("freeLimit", { limit: formatBytes(freeLimit) })} · ${t("proLimit", { limit: formatBytes(proLimit) })}`}
              </p>
            </div>
          )}

          {/* Feature list */}
          <div className="space-y-4">
            {(t.raw("features") as string[]).map((feature, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm font-semibold text-muted-foreground/80 group-hover:text-primary transition-colors">{feature}</span>
              </div>
            ))}
          </div>

          {/* Waitlist CTA */}
          {!submitted ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("waitlist")}</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                  onKeyDown={(e) => e.key === "Enter" && handleWaitlist()}
                />
                <Button className="rounded-xl gap-1 shrink-0" onClick={handleWaitlist}>
                  {t("join")} <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-center">
              <p className="font-bold text-green-600">{t("successTitle")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("successDesc")}</p>
            </div>
          )}

          <Button variant="ghost" className="w-full text-muted-foreground text-xs" onClick={onClose}>
            {t("continueFree")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
