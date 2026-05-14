"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileText, 
  Files, 
  Scissors, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  FileSearch,
  Lock,
  Unlock,
  Zap
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useTranslations } from "next-intl";

export default function PDFHubClient() {
  const t = useTranslations("pdfHub");

  const docTools = [
    {
      title: t("tools.merger.title"),
      desc: t("tools.merger.desc"),
      icon: Files,
      href: "/pdf/merge-pdf",
      color: "from-red-500 to-orange-500",
      tags: t.raw("tools.merger.tags") as string[]
    },
    {
      title: t("tools.splitter.title"),
      desc: t("tools.splitter.desc"),
      icon: Scissors,
      href: "/pdf/split-pdf",
      color: "from-blue-500 to-indigo-500",
      tags: t.raw("tools.splitter.tags") as string[]
    },
    {
      title: t("tools.compressor.title"),
      desc: t("tools.compressor.desc"),
      icon: Zap,
      href: "/pdf/compress-pdf",
      color: "from-orange-500 to-red-600",
      tags: t.raw("tools.compressor.tags") as string[]
    },
    {
      title: t("tools.unlock.title"),
      desc: t("tools.unlock.desc"),
      icon: Unlock,
      href: "/pdf/unlock-pdf",
      color: "from-blue-600 to-indigo-700",
      tags: t.raw("tools.unlock.tags") as string[]
    },
    {
      title: t("tools.protect.title"),
      desc: t("tools.protect.desc"),
      icon: Lock,
      href: "/pdf/protect-pdf",
      color: "from-indigo-600 to-blue-700",
      tags: t.raw("tools.protect.tags") as string[]
    },
    {
      title: t("tools.scrubber.title"),
      desc: t("tools.scrubber.desc"),
      icon: Lock,
      href: "/security/metadata-cleaner",
      color: "from-green-500 to-emerald-500",
      tags: t.raw("tools.scrubber.tags") as string[]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main id="main-content" className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold"
            >
              <FileSearch className="w-4 h-4" />
              {t("hero.badge")}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl md:text-2xl font-bold tracking-tight"
            >
              {t.rich("hero.title", {
                span: (chunks) => <span className="text-primary">{chunks}</span>
              })}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium"
            >
              {t("hero.description")}
            </motion.p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {docTools.map((tool, i) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link href={tool.href}>
                  <Card className="h-full p-8 flex flex-col justify-between border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-card/50 backdrop-blur-sm relative overflow-hidden">
                    <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 blur-3xl -mr-16 -mt-6 group-hover:opacity-10 transition-opacity", tool.color)} />
                    
                    <div className="space-y-6 relative z-10">
                      <div className={cn("w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center text-foreground shadow-lg group-hover:scale-110 transition-transform duration-500", tool.color)}>
                        <tool.icon className="w-8 h-8" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {tool.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[9px] uppercase tracking-wider font-bold px-2 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">{tool.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {tool.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-primary font-bold text-sm">
                      {t("tools.cta")}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Feature List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-12">
            <div className="space-y-4">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                {t("features.zk.title")}
              </h4>
              <p className="text-muted-foreground text-sm">
                {t("features.zk.desc")}
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {t("features.fidelity.title")}
              </h4>
              <p className="text-muted-foreground text-sm">
                {t("features.fidelity.desc")}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
