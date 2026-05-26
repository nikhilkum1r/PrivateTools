"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/shared/ThemeProvider";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useRetention } from "@/components/shared/RetentionProvider";
import { tools, CATEGORIES, Category, Tool } from "@/lib/tools-data";
import { AdUnit } from "@/components/shared/AdUnit";

// Home Components — only high-value sections retained
import { MainHero } from "@/components/home/MainHero";
import { TrustBar } from "@/components/home/TrustBar";
import { BentoFeatures } from "@/components/home/BentoFeatures";
import { ToolsSection } from "@/components/home/ToolsSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhySafeToolsTable } from "@/components/home/WhySafeToolsTable";
import { FAQSection } from "@/components/home/FAQSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { SmartRoutingDialog } from "@/components/home/SmartRoutingDialog";

export default function HomePageClient() {
   const router = useRouter();
   const [search, setSearch] = useState("");
   const [activeCategory, setActiveCategory] = useState<Category>("All");
   const [dragActive, setDragActive] = useState(false);
   const [smartRoutingFile, setSmartRoutingFile] = useState<File | null>(null);
   const [isRoutingOpen, setIsRoutingOpen] = useState(false);

   const { favorites, recentTools, toggleFavorite, trackUsage } = useRetention();
   const t_tools = useTranslations("tools");
   const { resolvedTheme } = useTheme();
   const [mounted, setMounted] = useState(false);
   
   useEffect(() => {
      setMounted(true);
   }, []);

   const isDark = mounted && resolvedTheme === "dark";

   const filteredTools = useMemo(() => {
      return tools.filter(tool => {
         const searchTerm = search.toLowerCase().trim();
         if (searchTerm === "") return activeCategory === "All" || tool.cat === activeCategory;

         const localizedTitle = t_tools(`data.${tool.href}.title`).toLowerCase();
         const localizedDesc = t_tools(`data.${tool.href}.desc`).toLowerCase();
         
         const matchSearch = localizedTitle.includes(searchTerm) ||
            localizedDesc.includes(searchTerm) ||
            tool.tags.some(tag => tag.toLowerCase().includes(searchTerm));

         const matchCat = activeCategory === "All" || tool.cat === activeCategory;
         return matchSearch && matchCat;
      });
   }, [search, activeCategory, t_tools]);

   const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
      else if (e.type === "dragleave") setDragActive(false);
   };

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         setSmartRoutingFile(e.dataTransfer.files[0]);
         setIsRoutingOpen(true);
      }
   };

   const getSuggestedTools = (file: File | null) => {
      if (!file) return [];
      const ext = file.name.split('.').pop()?.toLowerCase();
      const type = file.type;
      if (ext === 'pdf' || ['docx', 'pptx', 'xlsx', 'csv', 'txt', 'json'].includes(ext || '')) return tools.filter(t => t.cat === 'Documents');
      if (type.startsWith('image/')) return tools.filter(t => t.cat === 'Creative');
      if (type.startsWith('video/')) return [tools.find(t => t.href === '/video')].filter(Boolean) as Tool[];
      return tools.slice(0, 3);
   };

   return (
      <div
         className="flex flex-col min-h-screen bg-transparent text-foreground relative"
         onDragEnter={handleDrag}
         onDragOver={handleDrag}
         onDragLeave={handleDrag}
         onDrop={handleDrop}
      >

         <Navbar />

         <main id="main-content" className="flex-grow relative z-10">
            <MainHero 
               mounted={mounted} 
               isDark={isDark} 
               favorites={favorites} 
               recentTools={recentTools} 
            />

            <TrustBar />

            <ToolsSection 
               search={search}
               setSearch={setSearch}
               activeCategory={activeCategory}
               setActiveCategory={setActiveCategory}
               filteredTools={filteredTools}
               favorites={favorites}
               toggleFavorite={toggleFavorite}
               trackUsage={trackUsage}
            />

            <HowItWorks />

            <WhySafeToolsTable />

            <BentoFeatures />

            <FAQSection />

            <div className="container mx-auto px-6 py-8">
               <AdUnit type="multiplex" />
            </div>

            <FinalCTA />

            <SmartRoutingDialog 
               isOpen={isRoutingOpen}
               setIsOpen={setIsRoutingOpen}
               file={smartRoutingFile}
               suggestedTools={getSuggestedTools(smartRoutingFile)}
            />
         </main>

         <Footer />
      </div>
   );
}
