"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Cpu, Settings2, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ImageFile } from "@/store/useImageStore";
import { useTranslations } from "next-intl";

interface StudioHeaderProps {
  mode: "landing" | "studio";
  files: ImageFile[];
  currentFile: ImageFile | null;
  isMobileSettingsOpen: boolean;
  setIsMobileSettingsOpen: (open: boolean) => void;
  renderSettings: () => React.ReactNode;
}

export function StudioHeader({
  mode,
  files,
  currentFile,
  isMobileSettingsOpen,
  setIsMobileSettingsOpen,
  renderSettings
}: StudioHeaderProps) {
  const t = useTranslations("imageEditor");
  const router = useRouter();

  return (
    <header className="p-4 md:px-8 md:py-6 flex items-center justify-between studio-header relative z-30 border-b border-border/50 bg-background/50 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        {mode === "studio" && (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all active:scale-95 group"
            onClick={() => router.push("/image/editor")}
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
        )}
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] group relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
          <Cpu className="w-6 h-6 text-primary relative z-10" />
        </div>
        <div className="flex flex-col">
          <h2 className="font-bold text-lg md:text-xl tracking-tight uppercase flex items-center gap-2">
            {t("workspace.title")}
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </h2>
          <div className="flex items-center gap-3">
            <Badge className="text-[8px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              {t("workspace.session")}
            </Badge>
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider opacity-40 truncate max-w-[150px] md:max-w-[300px]">
              {currentFile?.file.name || t("workspace.standby")}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-6 px-6 py-2 rounded-2xl bg-secondary/20 border border-border/50">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-primary">{t("workspace.active")}</span>
          </div>
          <div className="w-[1px] h-6 bg-border/50" />
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-muted-foreground/40 tracking-wider">{t("workspace.ram")}</span>
            <span className="text-[10px] font-bold text-primary">0.2ms</span>
          </div>
          <div className="w-[1px] h-6 bg-border/50" />
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-muted-foreground/40 tracking-wider">{t("workspace.crypto")}</span>
            <span className="text-[10px] font-bold text-emerald-500">{t("workspace.verified")}</span>
          </div>
        </div>
        <Sheet open={isMobileSettingsOpen} onOpenChange={setIsMobileSettingsOpen}>
          <SheetTrigger className={cn(buttonVariants({ variant: "outline", size: "icon" }), "lg:hidden rounded-2xl border-border bg-secondary/50 h-12 w-12 shadow-xl")}>
            <Settings2 className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[320px] p-0 bg-card border-border rounded-l-xl flex flex-col h-full">
            <SheetHeader className="px-4 py-3 border-b border-border">
              <SheetTitle className="text-foreground flex items-center gap-3 text-2xl font-bold tracking-tight">
                <Wand2 className="w-6 h-6 text-primary" /> {t("workspace.control")}
              </SheetTitle>
            </SheetHeader>
            {renderSettings()}
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
