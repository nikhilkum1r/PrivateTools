"use client";

import { useTheme } from "@/components/shared/ThemeProvider";
import { useEffect, useState } from "react";

export function GlobalVideoBackground() {
   const { resolvedTheme } = useTheme();
   const [mounted, setMounted] = useState(false);
   const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
   
   useEffect(() => {
      setMounted(true);
      // Defer video loading to prioritize LCP and critical metrics
      const timer = setTimeout(() => {
         setShouldLoadVideo(true);
      }, 3000);
      
      return () => clearTimeout(timer);
   }, []);

   const isDark = mounted && resolvedTheme === "dark";

   if (!shouldLoadVideo) return null;

   return (
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
         <video
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-30 animate-fade-in transition-opacity duration-1000"
            key={isDark ? 'dark' : 'light'}
            suppressHydrationWarning
         >
            <source src={isDark ? "/video/hero_video_dark_mode.mp4" : "/video/hero_video_light_mode.mp4"} type="video/mp4" />
         </video>
      </div>
   );
}
