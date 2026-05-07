"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-8 relative z-20">
      <Link 
        href="/" 
        className="hover:text-primary transition-colors flex items-center gap-1.5"
      >
        <Home className="w-3 h-3" />
        HOME
      </Link>
      
      {paths.map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join("/")}`;
        const isLast = index === paths.length - 1;
        const name = path.replace(/-/g, " ").toUpperCase();

        return (
          <div key={path} className="flex items-center space-x-2">
            <ChevronRight className="w-3 h-3 opacity-20" />
            {isLast ? (
              <span className="text-primary italic">{name}</span>
            ) : (
              <Link 
                href={href} 
                className="hover:text-foreground transition-colors"
              >
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
