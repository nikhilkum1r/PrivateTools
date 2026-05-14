"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DisclaimerModalProps {
  open: boolean;
  title: string;
  body: string;
  onAccept: () => void;
  /** If true, user cannot close the dialog by clicking outside  they must accept */
  blocking?: boolean;
}

/**
 * DisclaimerModal  blocking consent gate for Steganography, Metadata Injector, File Shredder.
 * The user MUST click "I Understand" to proceed. Closing without accepting = no tool access.
 */
export function DisclaimerModal({
  open,
  title,
  body,
  onAccept,
  blocking = true,
}: DisclaimerModalProps) {
  const t = useTranslations("common.disclaimer");
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // When blocking=true, intercept and swallow close attempts.
        // The controlled `open` prop keeps it visible.
        if (blocking && !isOpen) return;
      }}
    >
      <DialogContent
        className="max-w-lg rounded-xl border-yellow-500/20 bg-background overflow-hidden p-0"
        showCloseButton={!blocking}
      >
        {/* Header stripe */}
        <div className="bg-yellow-500/10 px-8 py-6 flex gap-4 items-start border-b border-yellow-500/20">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold leading-tight text-yellow-700 dark:text-yellow-400">
              {title}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6">
          <DialogDescription className="text-sm leading-relaxed text-foreground/80">
            {body}
          </DialogDescription>

          <div className="flex flex-col gap-3">
            <Button
              className="w-full h-12 rounded-xl font-bold bg-yellow-500 hover:bg-yellow-600 text-foreground shadow-lg shadow-yellow-500/20"
              onClick={onAccept}
            >
              {t("understand")}
            </Button>
            <p className="text-center text-[10px] text-muted-foreground">
              {t("responsibility")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Hook to manage disclaimer state.
 * Usage: const { shown, accepted, showDisclaimer, accept } = useDisclaimer();
 */
export function useDisclaimer() {
  const [shown, setShown] = React.useState(false);
  const [accepted, setAccepted] = React.useState(false);

  const showDisclaimer = React.useCallback(() => {
    if (!accepted) setShown(true);
  }, [accepted]);

  const accept = React.useCallback(() => {
    setAccepted(true);
    setShown(false);
  }, []);

  return { shown, accepted, showDisclaimer, accept };
}
