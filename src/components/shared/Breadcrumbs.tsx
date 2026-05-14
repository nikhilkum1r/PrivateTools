"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) return null;
  
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex mb-6 overflow-x-auto scrollbar-hide", className)}
    >
      <ol className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />}
            <Link 
              href={item.href}
              className={cn(
                "hover:text-primary transition-colors font-medium",
                index === items.length - 1 && "text-foreground pointer-events-none"
              )}
              aria-current={index === items.length - 1 ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
