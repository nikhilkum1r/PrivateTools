"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Monitor,
  Cpu,
  Download,
  ShieldCheck,
  Undo2,
  Plus,
  Smartphone
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import JSZip from "jszip";
import { useTranslations } from "next-intl";
import Head from "next/head";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

// Modular Components
import { IconHero } from "./components/IconHero";
import { IconSidebar } from "./components/IconSidebar";
import { IconPreviewArea } from "./components/IconPreviewArea";
import { IconResultGrid } from "./components/IconResultGrid";
import { IconLandingExtras } from "./components/IconLandingExtras";

interface GeneratedIcon {
  name: string;
  url: string;
  size: number;
  width?: number;
  height?: number;
  platform: 'web' | 'android' | 'ios' | 'pwa' | 'social' | 'all';
  scale?: string;
}

interface IconStudioClientProps {
  defaultTitle?: string;
  hideNavbar?: boolean;
}

export default function IconStudioClient({ defaultTitle, hideNavbar }: IconStudioClientProps) {
  const t = useTranslations("iconStudio");
  const hp = useTranslations("home");
  const t_tools = useTranslations("tools");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<GeneratedIcon[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isSvg, setIsSvg] = useState(false);
  
  // Design State
  const [zoom, setZoom] = useState(0.8);
  const [borderRadius, setBorderRadius] = useState(0);
  const [bgColor, setBgColor] = useState("transparent");
  const [bgType, setBgType] = useState<'solid' | 'gradient'>('solid');
  const [bgGradient, setBgGradient] = useState('linear-gradient(135deg, #6366f1 0%, #a855f7 100%)');
  const [shadow, setShadow] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [palette, setPalette] = useState<string[]>([]);

  // UI State
  const [activePlatform, setActivePlatform] = useState<'all' | 'web' | 'android' | 'ios' | 'social'>('all');
  const [activeTab, setActiveTab] = useState<'basic' | 'style' | 'filters' | 'ai' | 'svg'>('basic');
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('dark');
  const [previewContext, setPreviewContext] = useState<'home' | 'settings' | 'notifications'>('home');
  const [exportFormat, setExportFormat] = useState<string>('auto');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-extract palette when image changes
  useEffect(() => {
    if (preview) {
      extractPalette(preview);
    }
  }, [preview]);

  const extractPalette = (imgUrl: string) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);
      const data = ctx.getImageData(0, 0, 100, 100).data;
      const colors = new Set<string>();
      for (let i = 0; i < data.length; i += 40) {
        const r = data[i], g = data[i+1], b = data[i+2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        if (r + g + b < 700 && r + g + b > 100) colors.add(hex);
        if (colors.size >= 5) break;
      }
      setPalette(Array.from(colors));
    };
    img.src = imgUrl;
  };

  const handleFileDrop = (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setIsSvg(f.type === "image/svg+xml" || f.name.endsWith(".svg"));
    setResults([]);
  };

  const generateIcons = async () => {
    if (!file || !preview) return;
    setIsProcessing(true);
    setResults([]);

    try {
      const img = new Image();
      img.src = preview;
      await new Promise((resolve) => (img.onload = resolve));

      const sizes: ({ s: number; n: string; p: GeneratedIcon['platform']; scale?: string } | { w: number; h: number; n: string; p: GeneratedIcon['platform'] })[] = [
        { s: 16, n: 'favicon-16x16.webp', p: 'web' },
        { s: 32, n: 'favicon-32x32.webp', p: 'web' },
        { s: 48, n: 'favicon-48x48.png', p: 'web' },
        { s: 180, n: 'apple-touch-icon.webp', p: 'ios' },
        { s: 192, n: 'android-chrome-192x192.webp', p: 'android' },
        { s: 512, n: 'android-chrome-512x512.webp', p: 'android' },
        { s: 48, n: 'ic_launcher.png', p: 'android', scale: 'mdpi' },
        { s: 72, n: 'ic_launcher.png', p: 'android', scale: 'hdpi' },
        { s: 96, n: 'ic_launcher.png', p: 'android', scale: 'xhdpi' },
        { s: 144, n: 'ic_launcher.png', p: 'android', scale: 'xxhdpi' },
        { s: 192, n: 'ic_launcher.png', p: 'android', scale: 'xxxhdpi' },
        { s: 40, n: 'icon-20@2x.png', p: 'ios', scale: '20pt@2x' },
        { s: 60, n: 'icon-20@3x.png', p: 'ios', scale: '20pt@3x' },
        { s: 58, n: 'icon-29@2x.png', p: 'ios', scale: '29pt@2x' },
        { s: 87, n: 'icon-29@3x.png', p: 'ios', scale: '29pt@3x' },
        { s: 80, n: 'icon-40@2x.png', p: 'ios', scale: '40pt@2x' },
        { s: 120, n: 'icon-40@3x.png', p: 'ios', scale: '40pt@3x' },
        { s: 120, n: 'icon-60@2x.png', p: 'ios', scale: '60pt@2x' },
        { s: 180, n: 'icon-60@3x.png', p: 'ios', scale: '60pt@3x' },
        { s: 1024, n: 'icon-1024.png', p: 'ios', scale: '1024pt' },
        { s: 512, n: 'pwa-icon-512x512.png', p: 'pwa' },
        { w: 1200, h: 630, n: 'og-image.webp', p: 'social' },
        { w: 1200, h: 600, n: 'twitter-preview.png', p: 'social' },
        { w: 1080, h: 1080, n: 'instagram-post.png', p: 'social' },
        { w: 1080, h: 1350, n: 'instagram-portrait.png', p: 'social' },
        { w: 2048, h: 2732, n: 'splash-ios.png', p: 'ios' },
        { w: 1080, h: 1920, n: 'splash-android.png', p: 'android' },
      ];

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const generated: GeneratedIcon[] = [];

      for (const item of sizes) {
        const w = 'w' in item ? item.w : item.s;
        const h = 'h' in item ? item.h : item.s;
        const size = 's' in item ? item.s : Math.min(w, h);

        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);
        
        if (bgColor !== "transparent" || exportFormat === 'image/jpeg') {
           if (bgType === 'gradient' && bgColor !== 'transparent') {
              const gradParts = bgGradient.match(/#[a-f\d]{6}/gi) || ['#6366f1', '#a855f7'];
              const grad = ctx.createLinearGradient(0, 0, w, h);
              grad.addColorStop(0, gradParts[0]);
              grad.addColorStop(1, gradParts[1]);
              ctx.fillStyle = grad;
           } else {
              ctx.fillStyle = bgColor === "transparent" ? "#ffffff" : bgColor;
           }
           
           if (borderRadius > 0 && w === h) {
              const r = (borderRadius / 100) * (w / 2);
              ctx.beginPath();
              ctx.moveTo(r, 0);
              ctx.lineTo(w - r, 0);
              ctx.quadraticCurveTo(w, 0, w, r);
              ctx.lineTo(w, h - r);
              ctx.quadraticCurveTo(w, h, w - r, h);
              ctx.lineTo(r, h);
              ctx.quadraticCurveTo(0, h, 0, h - r);
              ctx.lineTo(0, r);
              ctx.quadraticCurveTo(0, 0, r, 0);
              ctx.closePath();
              ctx.fill();
              ctx.clip();
           } else {
              ctx.fillRect(0, 0, w, h);
           }
        }

        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        
        if (shadow > 0) {
           ctx.shadowColor = "rgba(0,0,0,0.3)";
           ctx.shadowBlur = (shadow / 100) * (size / 10);
           ctx.shadowOffsetY = (shadow / 100) * (size / 20);
        }

        const targetSize = size * zoom;
        const offsetX = (w - targetSize) / 2;
        const offsetY = (h - targetSize) / 2;
        ctx.drawImage(img, offsetX, offsetY, targetSize, targetSize);
        
        ctx.filter = "none";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        const getExportConfig = (platform: string) => {
          if (exportFormat === 'auto') {
            if (platform === 'social') return { mime: 'image/jpeg', ext: '.jpg' };
            if (platform === 'android') return { mime: 'image/webp', ext: '.webp' };
            if (platform === 'web' && item.n.includes('favicon')) return { mime: 'image/x-icon', ext: '.ico' };
            return { mime: 'image/png', ext: '.png' };
          }
          return { mime: exportFormat, ext: '.png' }; // Simplified mapping
        };

        const config = getExportConfig(item.p);
        
        generated.push({
          name: item.n.replace('.png', config.ext),
          url: canvas.toDataURL(config.mime.startsWith('image/') ? config.mime : 'image/png', 0.9),
          size: size,
          width: w,
          height: h,
          platform: item.p,
          scale: 'scale' in item ? item.scale : undefined
        });
      }

      setResults(generated);
      toast.success(t("toasts.gen_success"));

      // Auto scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      toast.error(t("toasts.gen_failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const generateAdaptiveAndroid = async () => {
    if (!file || !preview) return;
    setIsProcessing(true);
    
    try {
      const zip = new JSZip();
      const adaptiveFolder = zip.folder("android/adaptive");
      
      const img = new Image();
      img.src = preview;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Foreground
      ctx.clearRect(0, 0, 1024, 1024);
      const zoomFactor = zoom * 0.8;
      const targetSize = 1024 * zoomFactor;
      const offset = (1024 - targetSize) / 2;
      ctx.drawImage(img, offset, offset, targetSize, targetSize);
      adaptiveFolder?.file("ic_launcher_foreground.png", canvas.toDataURL('image/png').split(',')[1], { base64: true });

      // 2. Background
      ctx.clearRect(0, 0, 1024, 1024);
      if (bgType === 'gradient') {
         const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
         const gradParts = bgGradient.match(/#[a-f\d]{6}/gi) || ['#6366f1', '#a855f7'];
         grad.addColorStop(0, gradParts[0]);
         grad.addColorStop(1, gradParts[1]);
         ctx.fillStyle = grad;
      } else {
         ctx.fillStyle = bgColor === 'transparent' ? '#ffffff' : bgColor;
      }
      ctx.fillRect(0, 0, 1024, 1024);
      adaptiveFolder?.file("ic_launcher_background.png", canvas.toDataURL('image/png').split(',')[1], { base64: true });

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "android-adaptive-icons.zip";
      link.click();
      toast.success(t("toasts.adaptive_success"));
    } catch (err) {
      toast.error(t("toasts.adaptive_failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = async (items: GeneratedIcon[] = results) => {
    const zip = new JSZip();
    const faviconFolder = zip.folder("favicon");
    const androidFolder = zip.folder("android");
    const iosFolder = zip.folder("ios");
    const pwaFolder = zip.folder("pwa");
    const socialFolder = zip.folder("social");

    items.forEach(icon => {
      const base64 = icon.url.split(',')[1];
      const folder = icon.platform === 'web' ? faviconFolder : 
                     icon.platform === 'android' ? androidFolder :
                     icon.platform === 'ios' ? iosFolder :
                     icon.platform === 'pwa' ? pwaFolder : socialFolder;
      folder?.file(icon.name, base64, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = "safetools-icon-bundle.zip";
    link.click();
    toast.success(t("toasts.exported"));
  };

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-background text-foreground overflow-y-auto lg:overflow-hidden selection:bg-primary/30 custom-scrollbar relative">
      <Head>
        <title>{t.raw("hero.title").replace(/<[^>]*>?/gm, '')}</title>
        <meta name="description" content={t.raw("hero.description").replace(/<[^>]*>?/gm, '')} />
      </Head>

      {!hideNavbar && <Navbar />}
      <main id="main-content" className="flex-grow relative z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          {!preview ? (
            <div className="h-full overflow-y-auto custom-scrollbar flex flex-col items-center">
              <section className="w-full max-w-[1600px] px-6 md:px-16 py-12 md:py-24">
                <IconHero t={t} onFileDrop={handleFileDrop} />
                <IconLandingExtras t={t} hp={hp} t_tools={t_tools} />
              </section>
              <footer className="w-full border-t border-border/40 bg-secondary/5">
                <Footer />
              </footer>
            </div>
          ) : (
            <motion.div 
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col min-h-screen"
            >
              <div className="flex flex-col lg:flex-row flex-1">
                <IconPreviewArea 
                  t={t}
                  preview={preview}
                  zoom={zoom}
                  borderRadius={borderRadius}
                  bgColor={bgColor}
                  bgType={bgType}
                  bgGradient={bgGradient}
                  shadow={shadow}
                  brightness={brightness}
                  contrast={contrast}
                  previewTheme={previewTheme}
                  setPreviewTheme={setPreviewTheme}
                  previewContext={previewContext}
                  setPreviewContext={setPreviewContext}
                  isSvg={isSvg}
                  canvasRef={canvasRef}
                />
                
                <IconSidebar 
                  t={t}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  zoom={zoom}
                  setZoom={setZoom}
                  borderRadius={borderRadius}
                  setBorderRadius={setBorderRadius}
                  bgColor={bgColor}
                  setBgColor={setBgColor}
                  bgType={bgType}
                  setBgType={setBgType}
                  bgGradient={bgGradient}
                  setBgGradient={setBgGradient}
                  shadow={shadow}
                  setShadow={setShadow}
                  brightness={brightness}
                  setBrightness={setBrightness}
                  contrast={contrast}
                  setContrast={setContrast}
                  exportFormat={exportFormat}
                  setExportFormat={setExportFormat}
                  isProcessing={isProcessing}
                  generateIcons={generateIcons}
                  generateAdaptiveAndroid={generateAdaptiveAndroid}
                  palette={palette}
                  isSvg={isSvg}
                  onClear={() => { setPreview(null); setFile(null); setResults([]); }}
                  downloadAll={downloadAll}
                />
              </div>

              <AnimatePresence>
                {results.length > 0 && (
                  <motion.div 
                    ref={resultsRef}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="border-t border-border/10 bg-secondary/5 py-20 px-6 md:px-12 relative z-10"
                  >
                    <div className="max-w-[1600px] mx-auto space-y-16">
                      <div className="flex flex-col items-center gap-8">
                        <div className="text-center space-y-3">
                          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground italic drop-shadow-sm">
                            {t("results.title")}
                          </h2>
                          <div className="flex items-center justify-center gap-3">
                            <div className="h-px w-8 bg-primary/30" />
                            <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-[10px]">
                              {t("results.subtitle")}
                            </p>
                            <div className="h-px w-8 bg-primary/30" />
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center gap-3 p-3 bg-secondary/10 rounded-[2.5rem] border border-border/20 backdrop-blur-2xl shadow-2xl shadow-black/5">
                          <Button 
                            variant="ghost" 
                            className="h-14 rounded-2xl px-8 font-bold uppercase tracking-widest text-[10px] gap-3 text-muted-foreground hover:text-primary transition-all"
                            onClick={() => setResults([])}
                          >
                            <Undo2 className="w-4 h-4" /> {t("sidebar.clear_history", { defaultValue: "Clear Results" })}
                          </Button>
                          
                          <div className="w-px h-8 bg-border/20 mx-1 hidden md:block" />
                          
                          <Button 
                            className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] px-12 gap-4 shadow-2xl shadow-emerald-500/20 transition-all border-none group"
                            onClick={() => downloadAll()}
                          >
                            <Download className="w-4 h-4 group-hover:animate-bounce" /> {t("results.download_all")}
                          </Button>

                          <Button 
                            variant="outline"
                            className="h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[11px] px-12 gap-4 transition-all group"
                            onClick={() => generateAdaptiveAndroid()}
                          >
                            <Smartphone className="w-4 h-4 group-hover:rotate-12 transition-transform" /> {t("sidebar.adaptive")}
                          </Button>
                        </div>
                      </div>

                      <IconResultGrid 
                        t={t}
                        results={results}
                        activePlatform={activePlatform}
                        setActivePlatform={setActivePlatform}
                        downloadAll={downloadAll}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <SEOStructuredData
        name={t("seo.title")}
        description={t("seo.description")}
        url="https://safetools.space/devtools/icons"
        faqItems={Array.isArray(t.raw("landing.faq.items")) ? (t.raw("landing.faq.items") as any) : []}
      />
    </div>
  );
}
