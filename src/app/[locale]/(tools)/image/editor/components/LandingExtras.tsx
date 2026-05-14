"use client";

import React from "react";
import { WhySafeTools } from "@/components/shared/WhySafeTools";
import { FAQ } from "@/components/shared/FAQ";
import { SuggestedTools } from "@/components/shared/SuggestedTools";
import { TrustLayer } from "@/components/shared/TrustLayer";
import { useTranslations } from "next-intl";

interface LandingExtrasProps {
  faqItems: any;
  t_tools: any;
  currentStatus: string;
}

export function LandingExtras({ faqItems, t_tools, currentStatus }: LandingExtrasProps) {
  const t = useTranslations("imageEditor");

  return (
    <div className="space-y-24 pb-24">
      <section className="container mx-auto px-4">
        <FAQ items={faqItems} />
      </section>

      <section className="container mx-auto px-4">
        <SuggestedTools 
          title={t("landing.relatedTools.title")}
          tools={[
            { name: t("landing.relatedTools.compress"), href: "/image/compress" },
            { name: t("landing.relatedTools.convert"), href: "/image/convert" },
            { name: t("landing.relatedTools.removeBg"), href: "/image/remove-background" },
            { name: t("landing.relatedTools.ocr"), href: "/image/ocr" }
          ]}
        />
      </section>
    </div>
  );
}
