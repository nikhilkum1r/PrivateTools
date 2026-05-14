"use client";

import React from "react";
import { 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Search, 
  Smartphone, 
  Briefcase
} from "lucide-react";
import { WhySafeTools } from "@/components/shared/WhySafeTools";
import { LocalProcessingGuide } from "@/components/shared/LocalProcessingGuide";
import { SuggestedTools } from "@/components/shared/SuggestedTools";
import { FAQ } from "@/components/shared/FAQ";

interface RemoveBackgroundLandingExtrasProps {
  t: any;
  common: any;
}

export function RemoveBackgroundLandingExtras({ t, common }: RemoveBackgroundLandingExtrasProps) {
  return (
    <div className="space-y-32 py-32 bg-black/5">
      {/* Feature Grid */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Cpu, title: t("features.ai_engine"), desc: t("features.ai_engine_desc") },
            { icon: Layers, title: t("features.batch"), desc: t("features.batch_desc") },
            { icon: ShieldCheck, title: t("features.privacy"), desc: t("features.privacy_desc") },
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/20 transition-all group bg-black/20 backdrop-blur-3xl">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <feature.icon className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-bold text-sm uppercase opacity-70 tracking-tight">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <WhySafeTools />
      <LocalProcessingGuide />

      {/* Deep Manifesto */}
      <section className="container mx-auto px-4 max-w-4xl text-center space-y-16">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none italic">{t("manifesto.title")}</h2>
          <div className="w-32 h-1.5 bg-emerald-500 mx-auto rounded-full" />
        </div>
        <div className="grid gap-8 text-left">
          {[
            { icon: Briefcase, title: t("manifesto.pro_workflow"), desc: t("manifesto.pro_workflow_desc") },
            { icon: Search, title: t("manifesto.seo"), desc: t("manifesto.seo_desc") },
            { icon: Smartphone, title: t("manifesto.social"), desc: t("manifesto.social_desc") }
          ].map((item, i) => (
             <div key={i} className="flex gap-8 items-start glass-card p-8 rounded-[2rem] border border-white/5 bg-black/10 backdrop-blur-2xl">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/10"><item.icon className="w-7 h-7 text-emerald-500" /></div>
                <div className="space-y-3">
                   <h4 className="font-black uppercase tracking-tighter text-xl italic">{item.title}</h4>
                   <p className="text-muted-foreground leading-relaxed font-bold text-sm uppercase opacity-80">{item.desc}</p>
                </div>
             </div>
          ))}
        </div>
      </section>

      <SuggestedTools
        tools={[
          { name: common("tools.imageCompressor"), href: "/image/compress" },
          { name: common("tools.formatConverter"), href: "/image/convert" },
          { name: common("tools.colorLab"), href: "/image/colors" },
          { name: common("tools.steganography"), href: "/security/steganography" },
        ]}
      />
      <FAQ
        items={Array.isArray(t.raw("faq.items")) ? (t.raw("faq.items") as any) : []}
        title={t("faq.title")}
        description={t("faq.description")}
      />
    </div>
  );
}
