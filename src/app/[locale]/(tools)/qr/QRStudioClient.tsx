"use client";

import React, { useState, useRef } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { toast } from "sonner";
import { FAQ } from "@/components/shared/FAQ";
import { Footer } from "@/components/shared/Footer";
import SEOStructuredData from "@/components/shared/SEOStructuredData";
import { useTranslations } from "next-intl";

// Modular Components
import { QRStudioEditor } from "./components/QRStudioEditor";

export default function QRStudioClient() {
  const t = useTranslations("qrGenerator");
  const [value, setValue] = useState("https://safetools.local");
  const [fgColor, setFgColor] = useState("#8b5cf6");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const [includeMargin, setIncludeMargin] = useState(true);
  const [copied, setCopied] = useState(false);
  const [urlValid, setUrlValid] = useState(true);
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleValueChange = (v: string) => {
    setValue(v);
    if (v.startsWith("http") || v.startsWith("mailto:") || v.startsWith("tel:") || v.startsWith("WIFI:")) {
      try { new URL(v); setUrlValid(true); } catch { setUrlValid(false); }
    } else {
      setUrlValid(v.length > 0);
    }
  };

  const downloadQR = (format: "png" | "svg" = "png") => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    if (format === "svg") {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "qrcode.svg";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      toast.success(t("export.toastSvg")); return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = size * 2; canvas.height = size * 2;
      ctx?.drawImage(img, 0, 0, size * 2, size * 2);
      canvas.toBlob(blob => {
        if (!blob) return;
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "qrcode.png";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast.success(t("export.toastPng"));
      }, "image/png");
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoFile(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const colorPresets = [
    { name: t("design.presets") + " 1", fg: "#8b5cf6", bg: "#ffffff" },
    { name: t("design.presets") + " 2", fg: "#00f3ff", bg: "#000000" },
    { name: t("design.presets") + " 3", fg: "#10b981", bg: "#050505" },
    { name: t("design.presets") + " 4", fg: "#fbbf24", bg: "#1a1a1a" },
    { name: t("design.presets") + " 5", fg: "#ffffff", bg: "#000000" },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(t("preview.copied"));
  };

  const faqItems = Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any[]).map((item: any) => ({ q: item.q, a: item.a })) : [];

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      <Navbar />
      <main id="main-content" className="flex-grow flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative scrollbar-hide">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[160px] rounded-full animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[160px] rounded-full animate-pulse" />
          <div 
            className="absolute inset-0 opacity-[0.2]" 
            style={{ 
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(var(--foreground-rgb), 0.05) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }} 
          />
        </div>

        <QRStudioEditor 
          t={t}
          value={value}
          handleValueChange={handleValueChange}
          urlValid={urlValid}
          logoFile={logoFile}
          setLogoFile={setLogoFile}
          handleLogoUpload={handleLogoUpload}
          fgColor={fgColor}
          setFgColor={setFgColor}
          bgColor={bgColor}
          setBgColor={setBgColor}
          size={size}
          level={level}
          setLevel={setLevel}
          includeMargin={includeMargin}
          setIncludeMargin={setIncludeMargin}
          copied={copied}
          copyToClipboard={copyToClipboard}
          downloadQR={downloadQR}
          qrRef={qrRef}
          colorPresets={colorPresets}
        />
      </main>

      <SEOStructuredData 
        name={t("seo.title")}
        description={t("seo.description")}
        url="https://safetools.space/qr"
        faqItems={faqItems}
      />
      <FAQ 
        items={faqItems}
        title={t("hero.title")}
        description={t("hero.subtitle")}
      />
      <Footer />
    </div>
  );
}
