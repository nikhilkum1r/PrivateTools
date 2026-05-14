"use client";

import { useEffect } from "react";

export default function AdSenseLoader() {
  useEffect(() => {
    // Prevent multiple injections
    if (document.getElementById("adsense-script")) return;

    const script = document.createElement("script");
    script.id = "adsense-script";
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4227099386151379";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, []);

  return null;
}
