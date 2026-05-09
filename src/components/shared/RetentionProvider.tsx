"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface RetentionContextType {
  favorites: string[];
  recentTools: string[];
  toggleFavorite: (href: string) => void;
  trackUsage: (href: string) => void;
}

const RetentionContext = createContext<RetentionContextType | undefined>(undefined);

export function RetentionProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentTools, setRecentTools] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFavs = localStorage.getItem("safetools-favs");
      const savedRecent = localStorage.getItem("safetools-recent");
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
      if (savedRecent) setRecentTools(JSON.parse(savedRecent));
    }
  }, []);

  const toggleFavorite = (href: string) => {
    const newFavs = favorites.includes(href)
      ? favorites.filter((f) => f !== href)
      : [...favorites, href];
    setFavorites(newFavs);
    if (typeof window !== "undefined") {
      localStorage.setItem("safetools-favs", JSON.stringify(newFavs));
    }
  };

  const trackUsage = (href: string) => {
    const newRecent = [href, ...recentTools.filter((t) => t !== href)].slice(0, 4);
    setRecentTools(newRecent);
    if (typeof window !== "undefined") {
      localStorage.setItem("safetools-recent", JSON.stringify(newRecent));
    }
  };

  return (
    <RetentionContext.Provider value={{ favorites, recentTools, toggleFavorite, trackUsage }}>
      {children}
    </RetentionContext.Provider>
  );
}

export function useRetention() {
  const context = useContext(RetentionContext);
  if (context === undefined) {
    throw new Error("useRetention must be used within a RetentionProvider");
  }
  return context;
}
