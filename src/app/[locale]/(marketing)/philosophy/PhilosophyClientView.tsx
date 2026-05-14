"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export function PhilosophyClientView() {
  const t = useTranslations("philosophy");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-violet-500/20 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground font-heading">
              {t("title")}
            </h1>
          </div>

          <div className="space-y-16">
            {t.raw("sections").map((section: any, idx: number) => (
              <section key={idx} className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground font-heading border-b border-border/50 pb-4">
                  {section.heading}
                </h2>
                <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
                  {Array.isArray(section.content) ? (
                    section.content.map((p: string, pIdx: number) => (
                      <p key={pIdx}>{p}</p>
                    ))
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
