"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Link } from "@/i18n/routing";

export function AdsClientView() {
  const t = useTranslations("ads");

  const renderTextWithLinks = (text: string) => {
    if (text.includes("At SafeTools")) {
      const parts = text.split("SafeTools");
      return (
        <>
          {parts[0]}
          <Link href="https://safetools.space?utm_source=chatgpt.com" className="text-primary hover:underline font-semibold">
            SafeTools
          </Link>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  const renderContent = (content: string, idx: number) => {
    // Bullet points
    if (content.startsWith("•") || content.startsWith("*")) {
      return (
        <li key={idx} className="list-none flex gap-4 items-start py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
          <span className="text-muted-foreground">{renderTextWithLinks(content.replace(/^[•*]\s*/, ""))}</span>
        </li>
      );
    }

    // Blockquote
    if (content.includes("Technology should empower people")) {
      return (
        <blockquote key={idx} className="relative py-10 px-8 md:px-12 my-12 bg-primary/[0.03] border-l-4 border-primary rounded-r-3xl overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-primary">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L21.017 3V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.9124 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H5.017C3.9124 8 3.017 7.10457 3.017 6V3L10.017 3V15C10.017 18.3137 7.33071 21 4.017 21H3.017Z" />
            </svg>
          </div>
          <p className="text-2xl md:text-3xl font-medium italic text-foreground leading-snug relative z-10">
            "{renderTextWithLinks(content)}"
          </p>
        </blockquote>
      );
    }

    return <p key={idx}>{renderTextWithLinks(content)}</p>;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 relative overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-violet-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-[30%] left-[20%] w-px h-[40%] bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-4xl">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              Our Philosophy
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground font-heading">
              {t("title")}
            </h1>
          </div>

          <div className="space-y-12">
            <div className="space-y-6 text-xl text-muted-foreground leading-relaxed">
              {t.raw("intro").map((p: string, idx: number) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="space-y-20 mt-16">
              {t.raw("sections").map((section: any, idx: number) => (
                <section key={idx} className="space-y-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading flex items-center gap-4">
                    <span className="w-8 h-1 bg-primary rounded-full hidden md:block" />
                    {section.heading}
                  </h2>
                  <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                    {section.content.map((c: string, cIdx: number) => (
                      <React.Fragment key={cIdx}>
                        {renderContent(c, cIdx)}
                      </React.Fragment>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
