"use client";

import React from "react";
import { Video as VideoIcon } from "lucide-react";
import { DropZone } from "@/components/shared/DropZone";

interface VideoHeroProps {
  t: any;
  handleFileDrop: (files: File[]) => void;
}

export function VideoHero({ t, handleFileDrop }: VideoHeroProps) {
  return (
    <div className="flex-grow flex items-center justify-center p-8 relative z-10">
      <div className="max-w-xl w-full space-y-6 text-center">
        <div className="space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/20 flex items-center justify-center mx-auto shadow-2xl relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <VideoIcon className="w-10 h-10 text-primary relative z-10" />
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl md:text-2xl font-extrabold tracking-tight uppercase leading-none" dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }} />
            <p className="text-muted-foreground/60 text-xl font-medium max-w-md mx-auto leading-relaxed">{t("hero.subtitle")}</p>
          </div>
        </div>
        <DropZone onFilesDrop={handleFileDrop} accept="video/*" multiple={false} className="h-64 border-dashed border-border bg-muted/10 rounded-3xl hover:bg-muted/20 hover:border-primary/40 transition-all group" />
      </div>
    </div>
  );
}
