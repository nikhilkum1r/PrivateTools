"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  Trash2, 
  ChevronRight, 
  Clock, 
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HistoryItem {
  id: string;
  filename: string;
  text: string;
  timestamp: number;
}

interface OCRHistoryProps {
  t: any;
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
  onRestore: (item: HistoryItem) => void;
}

export function OCRHistory({ t, history, setHistory, onRestore }: OCRHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className="container mx-auto px-4 mt-24 max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest">{t("history.title")}</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t("history.subtitle")}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setHistory([])} 
          className="rounded-xl text-rose-500 hover:bg-rose-500/10 text-[10px] font-bold uppercase tracking-widest px-4"
        >
          {t("history.clearAll")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {history.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group cursor-pointer"
              onClick={() => onRestore(item)}
            >
              <div className="p-6 rounded-[2rem] glass-card border border-border/40 hover:border-primary/50 transition-all duration-500 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="rounded-xl bg-secondary/50 text-[8px] font-bold uppercase tracking-wider gap-2">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Badge>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-xl text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10" onClick={(e) => {
                    e.stopPropagation();
                    setHistory(history.filter(h => h.id !== item.id));
                  }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-tight truncate pr-8 italic">{item.filename}</h4>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{item.text}</p>
                </div>
                <div className="pt-2 flex items-center justify-between text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[8px] font-bold uppercase tracking-widest">{t("history.restore")}</span>
                   <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
