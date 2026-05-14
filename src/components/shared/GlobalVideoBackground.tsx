"use client";

import { useTheme } from "@/components/shared/ThemeProvider";
import { useEffect, useState } from "react";

export function GlobalVideoBackground() {
   const { resolvedTheme } = useTheme();
   const [mounted, setMounted] = useState(false);
   
   useEffect(() => {
      setMounted(true);
   }, []);

   const isDark = mounted && resolvedTheme === "dark";

   return (
      <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden="true">
         <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-30"
            key={isDark ? 'dark' : 'light'}
            suppressHydrationWarning
         >
            <source src={isDark ? "/video/hero_video_dark_mode.mp4" : "/video/hero_video_light_mode.mp4"} type="video/mp4" />
         </video>
      </div>
   );
}
