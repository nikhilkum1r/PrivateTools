"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Command, ArrowRight, Clock, Heart, Search, X } from "lucide-react";
import { tools, Tool } from "@/lib/tools-data";
import { cn } from "@/lib/utils";
import { useRetention } from "./RetentionProvider";

export default function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { favorites, recentTools, trackUsage } = useRetention();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);



  const filteredTools = useMemo(() => {
    if (!search) return tools.slice(0, 10);
    return tools
      .filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
      )
      .slice(0, 10);
  }, [search]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl glass-card border border-border shadow-2xl rounded-3xl overflow-hidden backdrop-blur-3xl bg-background/40"
          >
            <div className="flex items-center px-6 py-6 border-b border-border gap-4">
              <Command className="w-6 h-6 text-primary" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search across 150+ tools..."
                className="flex-1 bg-transparent border-none outline-none text-xl font-bold placeholder:opacity-30 placeholder:italic"
              />
              <div className="flex items-center gap-2">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-40 px-3 py-1 rounded-lg bg-secondary/80 border border-border">ESC</div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-5 h-5 opacity-40" />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2 no-scrollbar">
              {/* Quick Access Sections */}
              {!search && (favorites.length > 0 || recentTools.length > 0) && (
                <div className="px-2 pb-4 space-y-4">
                  {favorites.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 px-2 italic">
                        <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> Favorites
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {favorites.map(href => {
                          const tool = tools.find(t => t.href === href);
                          if (!tool) return null;
                          return (
                            <button
                              key={href}
                              onClick={() => {
                                trackUsage(tool.href);
                                router.push(tool.href);
                                setIsOpen(false);
                              }}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 border border-transparent hover:border-border transition-all text-left group"
                            >
                              <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-foreground text-[10px]", tool.color)}>
                                <tool.icon className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-bold uppercase italic group-hover:text-primary transition-colors">{tool.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {filteredTools.length > 0 ? (
                <div className="space-y-1">
                   {search && (
                     <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-4 mb-2 opacity-60">Search Results</div>
                   )}
                   {filteredTools.map((tool) => (
                    <button
                      key={tool.href}
                      onClick={() => {
                        trackUsage(tool.href);
                        router.push(tool.href);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-6 p-4 rounded-2xl hover:bg-secondary/80 transition-all text-left group"
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-foreground shadow-lg group-hover:scale-105 transition-transform",
                          tool.color
                        )}
                      >
                        <tool.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-black uppercase italic tracking-tight font-heading group-hover:text-primary transition-colors">
                          {tool.title}
                        </div>
                        <div className="text-xs text-muted-foreground opacity-60 line-clamp-1">
                          {tool.desc}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="text-4xl">🔎</div>
                  <div className="text-sm font-black uppercase tracking-widest opacity-40 italic">
                    No tools found matching "{search}"
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-secondary/30 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                  <span className="p-1 rounded bg-secondary border border-border">↑↓</span> Navigate
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                  <span className="p-1 rounded bg-secondary border border-border">ENTER</span> Launch
                </div>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-primary italic">
                SafeTools v2.0
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
