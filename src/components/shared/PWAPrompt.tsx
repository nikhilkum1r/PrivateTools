"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait a few seconds before showing to not overwhelm the user immediately
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Optionally save dismiss state to localStorage to prevent bugging them
    localStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (typeof window !== 'undefined' && localStorage.getItem("pwa_prompt_dismissed") === "true") {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
        >
          <div className="bg-background/80 backdrop-blur-xl border border-primary/20 shadow-2xl shadow-primary/10 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-purple-500 to-primary/50"></div>
            
            <button 
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="flex flex-col pr-6">
                <h3 className="font-bold text-sm tracking-tight">Install SafeTools App</h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  Work offline, instantly load tools, and get 100% privacy on your device.
                </p>
              </div>
            </div>

            <button
              onClick={handleInstall}
              className="w-full mt-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              <Download className="w-4 h-4" />
              Install Now (Free)
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
