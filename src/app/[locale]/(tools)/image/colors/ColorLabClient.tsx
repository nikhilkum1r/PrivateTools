"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

// Modular Components
import { ColorHero } from "./components/ColorHero";
import { ColorEditor } from "./components/ColorEditor";
import { ColorLandingExtras } from "./components/ColorLandingExtras";
import { AdUnit } from "@/components/shared/AdUnit";

interface ColorSwatch {
  hex: string;
  rgb: string;
  hsl: string;
  isDark: boolean;
  type: "dominant" | "vibrant" | "muted" | "accent";
}

const STUDIO_STYLES = `
  @keyframes background-animate {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .background-animate {
    background-size: 200% 200%;
    animation: background-animate 3s linear infinite;
  }
`;

export default function ColorLabClient() {
  const t = useTranslations("colorLab");
  const common = useTranslations("common");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorSwatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sampleRate, setSampleRate] = useState(10);
  const [exportFormat, setExportFormat] = useState<"css" | "scss" | "json">("css");
  const [showHarmony, setShowHarmony] = useState<string | null>(null);
  const [mood, setMood] = useState<string>("Neutral");
  
  const imageRef = useRef<HTMLImageElement>(null);
  const toolSectionRef = useRef<HTMLDivElement>(null);

  const handleFilesDrop = (files: File[]) => {
    const file = files[0];
    if (file) {
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".heic", ".heif", ".tiff", ".tif", ".psd", ".svg", ".bmp"];
      const fileName = file.name.toLowerCase();
      const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext)) || file.type.startsWith("image/");
      
      if (!isAllowed) {
        toast.error(`${file.name} is not a supported image format.`);
        return;
      }

      setFile(file);
      setPreview(URL.createObjectURL(file));
      setColors([]);
      toolSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const toLinear = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  const getContrastRatio = (hex: string) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    const lum = getLuminance(r, g, b);
    const white = 1;
    const contrastWhite = (white + 0.05) / (lum + 0.05);
    const contrastBlack = (lum + 0.05) / (0 + 0.05);
    return { 
      onWhite: contrastWhite.toFixed(1), 
      onBlack: contrastBlack.toFixed(1), 
      passAA: contrastWhite >= 4.5 || contrastBlack >= 4.5, 
      passAAA: contrastWhite >= 7 || contrastBlack >= 7 
    };
  };

  const getHarmonyColors = (hex: string) => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    const rn = r/255, gn = g/255, bn = b/255;
    const max = Math.max(rn,gn,bn), min = Math.min(rn,gn,bn);
    let h = 0, s = 0;
    const l = (max+min)/2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      if (max === rn) h = (gn-bn)/d + (gn < bn ? 6 : 0);
      else if (max === gn) h = (bn-rn)/d + 2;
      else h = (rn-gn)/d + 4;
      h /= 6;
    }
    const hDeg = Math.round(h * 360);
    const sat = Math.round(s * 100);
    const light = Math.round(l * 100);
    const hslToHex = (hh: number, ss: number, ll: number) => {
      const hslF = (n: number) => { const k = (n + hh/30) % 12; const a = ss/100 * Math.min(ll/100, 1-ll/100); return Math.round(255*(ll/100 - a*Math.max(-1,Math.min(k-3,9-k,1)))); };
      return `#${[hslF(0),hslF(8),hslF(4)].map(x => x.toString(16).padStart(2,'0')).join('')}`;
    };
    return [
      { label: t("harmonies.comp"), hex: hslToHex((hDeg+180)%360, sat, light) },
      { label: t("harmonies.triadicA"), hex: hslToHex((hDeg+120)%360, sat, light) },
      { label: t("harmonies.triadicB"), hex: hslToHex((hDeg+240)%360, sat, light) },
      { label: t("harmonies.analogous"), hex: hslToHex((hDeg+30)%360, sat, light) },
    ];
  };

  const exportPalette = () => {
    let content = "";
    if (exportFormat === "css") {
      content = ":root {\n" + colors.map((c,i) => `  --color-${c.type}-${i+1}: ${c.hex};`).join("\n") + "\n}";
    } else if (exportFormat === "scss") {
      content = colors.map((c,i) => `$color-${c.type}-${i+1}: ${c.hex};`).join("\n");
    } else {
      content = JSON.stringify({ palette: colors.map((c,i) => ({ name: `${c.type}-${i+1}`, hex: c.hex, rgb: c.rgb, hsl: c.hsl })) }, null, 2);
    }
    const ext = exportFormat === "json" ? "json" : exportFormat;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `palette.${ext}`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    toast.success(t("tool.exportedAs", { format: exportFormat.toUpperCase() }));
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const extractPalette = async () => {
    if (!imageRef.current) return;
    setIsProcessing(true);
    const img = imageRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const scale = Math.min(1, 1000 / Math.max(img.naturalWidth, img.naturalHeight));
    canvas.width = img.naturalWidth * scale;
    canvas.height = img.naturalHeight * scale;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const colorCounts: Record<string, number> = {};
    for (let i = 0; i < imageData.length; i += 4 * sampleRate) {
      const r = imageData[i], g = imageData[i + 1], b = imageData[i + 2];
      const qr = Math.round(r / 15) * 15, qg = Math.round(g / 15) * 15, qb = Math.round(b / 15) * 15;
      const key = `${qr},${qg},${qb}`;
      colorCounts[key] = (colorCounts[key] || 0) + 1;
    }
    const sortedColors = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([key], index) => {
        const [r, g, b] = key.split(',').map(Number);
        const hex = rgbToHex(r, g, b);
        let type: ColorSwatch["type"] = "dominant";
        if (index > 0 && index < 4) type = "vibrant";
        if (index >= 4 && index < 7) type = "muted";
        if (index >= 7) type = "accent";
        return { hex, rgb: `rgb(${r}, ${g}, ${b})`, hsl: rgbToHsl(r, g, b), isDark: getLuminance(r, g, b) < 0.5, type };
      });
    const avgLum = sortedColors.reduce((acc, c) => acc + (c.isDark ? 0 : 1), 0) / sortedColors.length;
    setMood(avgLum > 0.7 ? t("moods.ethereal") : avgLum < 0.3 ? t("moods.moody") : t("moods.balanced"));
    setColors(sortedColors);
    setIsProcessing(false);
  };


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${common("export.copied")}: ${text.toUpperCase()}`);
  };

  const resetTool = () => {
    setFile(null);
    setPreview(null);
    setColors([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 relative overflow-x-hidden">
      <style>{STUDIO_STYLES}</style>
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <Navbar />

      <main id="main-content" className="flex-grow relative z-10">
        <ColorHero 
          t={t} 
          toolSectionRef={toolSectionRef} 
          handleFilesDrop={handleFilesDrop} 
        />

        <div className="max-w-7xl mx-auto px-6">
          <></>
        </div>

        <ColorEditor 
          t={t}
          common={common}
          file={file}
          preview={preview}
          colors={colors}
          isProcessing={isProcessing}
          sampleRate={sampleRate}
          setSampleRate={setSampleRate}
          mood={mood}
          extractPalette={extractPalette}
          resetTool={resetTool}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          exportPalette={exportPalette}
          copyToClipboard={copyToClipboard}
          handleFilesDrop={handleFilesDrop}
          showHarmony={showHarmony}
          setShowHarmony={setShowHarmony}
          getHarmonyColors={getHarmonyColors}
          getContrastRatio={getContrastRatio}
          imageRef={imageRef}
          toolSectionRef={toolSectionRef}
        />

        <ColorLandingExtras 
          t={t} 
          common={common} 
          copyToClipboard={copyToClipboard} 
        />
      </main>
      <Footer />
    </div>
  );
}
