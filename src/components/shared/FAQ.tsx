"use client";

import React from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AdUnit } from "@/components/shared/AdUnit";
import { useTranslations } from "next-intl";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  description?: string;
  className?: string;
}

export function FAQ({ items, title, description, className }: FAQProps) {
  const common = useTranslations("common");
  return (
    <section className={cn("py-16 md:py-24", className)} aria-label={common("aria.faq")}>
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto border border-primary/20 shadow-xl shadow-primary/5"
          >
            <HelpCircle className="w-6 h-6 text-primary" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70" dangerouslySetInnerHTML={{ __html: title || common.raw("faq.title") }} />
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base font-medium" dangerouslySetInnerHTML={{ __html: description || common.raw("faq.description") }} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-4"
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {Array.isArray(items) && items.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border/50 bg-secondary/10 rounded-2xl px-6 transition-all data-[state=open]:bg-secondary/20 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="hover:no-underline py-6">
                  <span className="text-left font-bold text-base md:text-lg group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: item.q }} />
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-muted-foreground leading-relaxed text-sm md:text-base">
                  <div dangerouslySetInnerHTML={{ __html: item.a }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
        
        {/* Ad Placement: FAQ Section (Allowed) */}
        <div className="mt-12">
          <AdUnit type="in-article" />
        </div>
      </div>

      {/* FAQ Schema for SEO Authority */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": (Array.isArray(items) ? items : []).map((item) => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
