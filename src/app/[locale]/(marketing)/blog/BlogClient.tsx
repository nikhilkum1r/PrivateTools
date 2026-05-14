"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { 
  Search, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Zap,
  Cpu
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  "Technology": "from-blue-500 to-indigo-600",
  "Security": "from-emerald-500 to-teal-600",
  "Engineering": "from-purple-500 to-pink-600"
};

const categoryIcons: Record<string, any> = {
  "WebAssembly": Cpu,
  "Cryptography": ShieldCheck,
  "UX Design": Sparkles,
  "Edge Computing": Zap
};

export default function BlogClient() {
  const t = useTranslations("blog");

  const posts = t.raw("posts") as Array<{
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    category: string;
  }>;

  const topics = t.raw("topics") as Array<{ label: string }>;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* HERO */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.1),transparent_50%)]" />
          <div className="container mx-auto px-6 relative z-10 text-center space-y-8">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <Badge variant="outline" className="py-1.5 px-4 rounded-full border-primary/20 text-primary font-semibold uppercase tracking-wider text-[10px]">{t("hero.badge")}</Badge>
                <h1 
                  className="text-5xl md:text-8xl font-extrabold tracking-tight font-heading leading-none"
                  dangerouslySetInnerHTML={{ __html: t.raw("hero.title") }}
                />
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                   {t("hero.subtitle")}
                </p>
                
                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative group pt-8">
                   <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                   <div className="relative flex items-center">
                      <Search className="absolute left-6 w-5 h-5 text-muted-foreground" />
                      <Input 
                        placeholder={t("hero.searchPlaceholder")} 
                        className="h-14 pl-14 pr-6 rounded-xl bg-card border-border shadow-lg text-base"
                      />
                   </div>
                </div>
             </motion.div>
          </div>
        </section>

        {/* FEATURED POSTS */}
        <section className="py-20">
           <div className="container mx-auto px-6 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {posts.map((post, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="group"
                   >
                      <Link href={`/blog/${post.slug}`}>
                         <div className="relative overflow-hidden rounded-3xl aspect-[4/5] bg-secondary/10 border border-border/50 group-hover:border-primary/30 transition-all shadow-xl group-hover:shadow-primary/5">
                            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity", categoryColors[post.category] || "from-primary to-blue-600")} />
                            <Image
                              src={`https://images.unsplash.com/photo-${i === 0 ? "1639322537228-f710d846310a" : i === 1 ? "1550751827-4bd374c3f58b" : "1517694712202-14dd9538aa97"}?auto=format&fit=crop&q=80&w=800`} 
                              alt={post.title} 
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="absolute inset-0 object-cover mix-blend-overlay grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                            />
                            
                            {/* Content Overlay */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-4 bg-gradient-to-t from-background via-background/20 to-transparent">
                               <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-wider text-primary">
                                  <span>{post.category}</span>
                                  <span className="w-1 h-1 rounded-full bg-border" />
                                  <span className="text-muted-foreground">{post.readTime}</span>
                               </div>
                               <h3 className="text-2xl font-bold tracking-tight font-heading leading-tight group-hover:text-primary transition-colors">{post.title}</h3>
                               <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                  {post.excerpt}
                               </p>
                               <div className="pt-4 flex items-center gap-2 text-primary text-[10px] font-semibold uppercase tracking-wider">
                                  {t("readMore")} <ArrowRight className="w-4 h-4" />
                               </div>
                            </div>
                         </div>
                      </Link>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* TOPICS SECTION */}
        <section className="py-32 bg-secondary/10 border-y border-border/50">
           <div className="container mx-auto px-6 max-w-5xl text-center space-y-12">
              <Badge variant="outline" className="py-1.5 px-4 rounded-full border-primary/20 text-primary font-semibold uppercase tracking-wider text-[10px]">{t("sections.topics")}</Badge>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading" dangerouslySetInnerHTML={{ __html: t.raw("sections.topics") }} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {topics.map((topic, i) => {
                   const Icon = categoryIcons[topic.label] || Sparkles;
                   return (
                     <button key={i} className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all space-y-4 group">
                        <Icon className="w-8 h-8 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                        <div className="text-[10px] font-semibold uppercase tracking-wider">{topic.label}</div>
                     </button>
                   );
                 })}
              </div>
           </div>
        </section>

        {/* CTA */}
        <section className="py-40">
           <div className="container mx-auto px-6 text-center space-y-10">
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight font-heading" dangerouslySetInnerHTML={{ __html: t.raw("sections.mission") }} />
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                 {t("sections.missionDesc")}
              </p>
              <div className="pt-6">
                 <Link href="/contact">
                    <Button className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 font-semibold text-sm shadow-lg shadow-primary/10 group">
                       {t("sections.contactButton")} <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                 </Link>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
