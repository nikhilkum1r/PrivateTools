"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { AdUnit } from "@/components/shared/AdUnit";

interface ToolLink {
  name: string;
  href: string;
}

interface RelatedToolsProps {
  title?: string;
  tools: ToolLink[];
  className?: string;
}

export const SuggestedTools = ({ 
  title, 
  tools = [], 
  className 
}: RelatedToolsProps) => {
  const common = useTranslations("common");
  
  return (
    <section className={cn("space-y-10 py-16 border-t border-border/50", className)}>
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {title || common("relatedTools")}
        </h2>
        <p className="text-muted-foreground text-sm font-medium">
           {common("relatedToolsDesc")}
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 px-6">
        {tools.map((tool) => (
          <Link 
            key={tool.href} 
            href={tool.href}
            className="group relative px-8 py-4 rounded-2xl glass-card bg-secondary/20 hover:bg-emerald-600 border border-border/50 hover:border-emerald-500 transition-all duration-300"
          >
            <div className="flex items-center gap-3 relative z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground group-hover:text-white transition-colors">
                {tool.name}
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            
            {/* Hover Glow */}
            <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
          </Link>
        ))}
      </div>
      
      {/* Ad Placement: Tool Context (Allowed) */}
      <div className="container mx-auto px-6 pt-10">
        <AdUnit type="multiplex" />
      </div>
    </section>
  );
};
