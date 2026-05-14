"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  HelpCircle, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Lock, 
  Zap, 
  MessageCircle,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Info
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

import { useTranslations } from "next-intl";

export default function FaqClient() {
  const t = useTranslations("faq");
  const [search, setSearch] = useState("");

  const faqs = t.raw("faqs") as Array<{ category: string; questions: Array<{ q: string; a: string }> }>;

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(search.toLowerCase()) || 
      q.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <SEOStructuredData 
        name={t("seo.name")}
        description={t("seo.description")}
        url="https://safetools.space/faq"
        faqItems={faqs.flatMap(cat => cat.questions.map(q => ({ q: q.q, a: q.a })))}
      />

      <main id="main-content" className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--glow-secondary),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-2 px-6 rounded-full border-primary/30 text-primary font-semibold uppercase tracking-wider text-[10px]">{t("badge")}</Badge>
                <h1 className="text-6xl md:text-9xl font-extrabold tracking-tight uppercase font-heading leading-none">
                   {t.rich("title", {
                     br: () => <br />,
                     inquiries: (chunks: React.ReactNode) => <span className="text-primary">{chunks}</span>
                   })}
                </h1>
                
                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative group pt-8">
                   <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                   <div className="relative flex items-center">
                      <Search className="absolute left-6 w-5 h-5 text-muted-foreground" />
                      <Input 
                        placeholder={t("searchPlaceholder")} 
                        className="h-16 pl-14 pr-6 rounded-2xl bg-card border-border shadow-xl text-lg font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                   </div>
                </div>
             </motion.div>
          </div>
        </section>

        {/* FAQ CONTENT */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-4xl">
              {filteredFaqs.length > 0 ? (
                <div className="space-y-24">
                   {filteredFaqs.map((cat, ci) => (
                     <div key={ci} className="space-y-8">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              {ci === 0 ? <Lock className="w-5 h-5" /> : ci === 1 ? <Cpu className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                           </div>
                           <h2 className="text-2xl font-bold font-heading tracking-tight">{cat.category}</h2>
                        </div>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                           {cat.questions.map((item, qi) => (
                             <AccordionItem 
                               key={qi} 
                               value={`${ci}-${qi}`}
                               className="border border-border/50 bg-secondary/5 rounded-2xl px-8 overflow-hidden data-[state=open]:bg-card data-[state=open]:border-primary/20 transition-all shadow-sm hover:shadow-md"
                             >
                               <AccordionTrigger className="text-lg font-bold font-heading text-left hover:no-underline py-6">
                                  {item.q}
                                </AccordionTrigger>
                               <AccordionContent className="text-muted-foreground text-lg leading-relaxed font-medium pb-6">
                                  {item.a}
                               </AccordionContent>
                             </AccordionItem>
                           ))}
                        </Accordion>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="text-center py-32 space-y-6">
                   <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                      <Search className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-bold font-heading">{t("noResults")}</h3>
                </div>
              )}
           </div>
        </section>

        {/* STILL HAVE QUESTIONS? */}
        <section className="py-40">
           <div className="container mx-auto px-6">
              <div className="max-w-5xl mx-auto rounded-[60px] bg-primary p-20 text-primary-foreground relative overflow-hidden text-center space-y-10 shadow-2xl shadow-primary/20">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
                 <MessageCircle className="w-20 h-20 mx-auto opacity-50" />
                 <h2 className="text-6xl md:text-8xl font-extrabold tracking-tight uppercase font-heading leading-none">
                   {t.rich("cta.title", {
                     br: () => <br />,
                     right: (chunks: React.ReactNode) => <span className="italic">{chunks}</span>
                   })}
                 </h2>
                 <p className="text-xl font-medium opacity-80 max-w-2xl mx-auto">{t("cta.subtitle")}</p>
                 <div className="pt-6">
                    <Button size="lg" className="h-20 px-12 rounded-3xl bg-white text-primary hover:bg-white/90 font-bold tracking-wider text-sm group">
                       {t("cta.button")} <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
