"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useTheme } from "@/components/shared/ThemeProvider";

import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useRetention } from "@/components/shared/RetentionProvider";
import { tools, CATEGORIES, Category, Tool } from "@/lib/tools-data";
import { AdUnit } from "@/components/shared/AdUnit";

// Home Components
import { MainHero } from "@/components/home/MainHero";
import { TrustBar } from "@/components/home/TrustBar";
import { InfrastructureSection } from "@/components/home/InfrastructureSection";
import { BentoFeatures } from "@/components/home/BentoFeatures";
import { ModernWorkflow } from "@/components/home/ModernWorkflow";
import { ToolsSection } from "@/components/home/ToolsSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { WhyWeBuiltIt } from "@/components/home/WhyWeBuiltIt";
import { HowItWorks } from "@/components/home/HowItWorks";
import { StatsBanner } from "@/components/home/StatsBanner";
import { PrivacyEngineHeartbeat } from "@/components/home/PrivacyEngineHeartbeat";
import { SovereigntySection } from "@/components/home/SovereigntySection";
import { PerformanceSection } from "@/components/home/PerformanceSection";
import { WhySafeToolsTable } from "@/components/home/WhySafeToolsTable";
import { SecuritySection } from "@/components/home/SecuritySection";
import { TechnologyMarquee } from "@/components/home/TechnologyMarquee";
import { FAQSection } from "@/components/home/FAQSection";
import { FeatureComparison } from "@/components/home/FeatureComparison";
import { Manifesto } from "@/components/home/Manifesto";
import { DesktopExperience } from "@/components/home/DesktopExperience";
import { UseCasesSection } from "@/components/home/UseCasesSection";
import { DeveloperSection } from "@/components/home/DeveloperSection";
import { SecurityArchitecture } from "@/components/home/SecurityArchitecture";
import { TechGrid } from "@/components/home/TechGrid";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CommunityStats } from "@/components/home/CommunityStats";
import { FinalCTA } from "@/components/home/FinalCTA";
import { FreeForever } from "@/components/home/FreeForever";
import { SmartRoutingDialog } from "@/components/home/SmartRoutingDialog";

// Dynamic imports for shared components
const WhySafeTools = dynamic(() => import("@/components/shared/WhySafeTools").then(mod => mod.WhySafeTools), {
   ssr: false,
   loading: () => <div className="h-96 animate-pulse bg-secondary/10 rounded-3xl mx-6" />
});

const LocalProcessingGuide = dynamic(() => import("@/components/shared/LocalProcessingGuide").then(mod => mod.LocalProcessingGuide), {
   ssr: false,
   loading: () => <div className="h-96 animate-pulse bg-secondary/10 rounded-3xl mx-6" />
});

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

            <InfrastructureSection />

            <BentoFeatures />

            <WhySafeTools />

            <div className="container mx-auto px-6">
               <AdUnit type="in-feed" />
            </div>

            <div className="container mx-auto px-6 py-12">
               <AdUnit type="multiplex" />
            </div>

            <LocalProcessingGuide />

            <ModernWorkflow />

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

            <FeaturedCategories />

            <WhyWeBuiltIt />

            <HowItWorks />

            <StatsBanner />

            <PrivacyEngineHeartbeat />

            <SovereigntySection />

            <PerformanceSection />

            <WhySafeToolsTable />

            <SecuritySection />

            <TechnologyMarquee />

            <FAQSection />

            <FeatureComparison />

            <Manifesto />

            <DesktopExperience />

            <UseCasesSection />

            <DeveloperSection />

            <SecurityArchitecture />

            <TechGrid />

            <TestimonialsSection />

            <CommunityStats />

            <FinalCTA />

            <FreeForever />

            <SmartRoutingDialog 
               isOpen={isRoutingOpen}
               setIsOpen={setIsRoutingOpen}
               file={smartRoutingFile}
               suggestedTools={getSuggestedTools(smartRoutingFile)}
            />

            <div className="container mx-auto px-6 py-12">
               <AdUnit type="multiplex" />
            </div>
         </main>

         <Footer />
      </div>
   );
}
