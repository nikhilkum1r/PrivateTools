"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { AdUnit } from "@/components/shared/AdUnit";
import { useImageStore, ImageFile, ImageSettings } from "@/store/useImageStore";
import { processImage } from "@/lib/image-processor";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ExportManager } from "@/lib/export-manager";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Settings2, Fingerprint } from "lucide-react";
import { ClientOnly } from "@/components/shared/ClientOnly";
import { TrustLayer } from "@/components/shared/TrustLayer";

import { EditorSidebar } from "./components/EditorSidebar";

// Modular Components
import { EditorHero } from "./components/EditorHero";
import { AssetSidebar } from "./components/AssetSidebar";
import { StudioHeader } from "./components/StudioHeader";
import { TelemetryOverlay } from "./components/TelemetryOverlay";
import { Toolbar } from "./components/Toolbar";
import { WorkspaceArea } from "./components/WorkspaceArea";
import { DropzoneOverlay } from "./components/DropzoneOverlay";
import { EditorDialogs } from "./components/EditorDialogs";
import { LandingExtras } from "./components/LandingExtras";
import { CropOverlay } from "./components/CropOverlay";
import { BlurOverlay } from "./components/BlurOverlay";

export default function EditorStudioClient({ mode = "landing" }: { mode?: "landing" | "studio" }) {
  const t = useTranslations("imageEditor");
  const common = useTranslations("common");
  const t_tools = useTranslations("tools");
  const router = useRouter();
  const {
    files, settings, addFiles, removeFile, updateSettings,
    setFileStatus, setProcessedUrl, clearFiles, updateFileCrop, updateFileBlurs
  } = useImageStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [imageDimensions, setImageDimensions] = useState<{ naturalWidth: number, naturalHeight: number } | null>(null);
  const [metadataFile, setMetadataFile] = useState<ImageFile | null>(null);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("format");
  const [isScanning, setIsScanning] = useState(false);
  const [isOCRDialogOpen, setIsOCRDialogOpen] = useState(false);
  const [isColorPaletteDialogOpen, setIsColorPaletteDialogOpen] = useState(false);
  const [isMetadataDialogOpen, setIsMetadataDialogOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // History Stack for Undo/Redo
  const [history, setHistory] = useState<ImageSettings[]>([]);
  const [redoStack, setRedoStack] = useState<ImageSettings[]>([]);

  const currentFile = files.find(f => f.id === selectedId) || files[0];

  // Automatic Redirection Logic for Upload-First Flow
  useEffect(() => {
    if (mode === "landing" && files.length > 0) {
      router.push("/image/editor/go");
    }
  }, [files.length, mode, router]);

  const handleAddFiles = (newFiles: File[]) => {
    addFiles(newFiles);
    if (mode === "landing") {
      router.push("/image/editor/go");
    }
  };

  // Helper to update settings with history
  const pushSettings = (newSettings: Partial<ImageSettings>) => {
    setHistory(prev => [...prev, { ...settings }]);
    setRedoStack([]);
    updateSettings(newSettings);
  };

  const undo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack(prev => [...prev, { ...settings }]);
    setHistory(prev => prev.slice(0, -1));
    updateSettings(previous);
    toast.info(t("toast.undo"));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory(prev => [...prev, { ...settings }]);
    setRedoStack(prev => prev.slice(0, -1));
    updateSettings(next);
    toast.info(t("toast.redo"));
  };

  const resetSettings = () => {
    pushSettings({
      quality: 80,
      rotate: 0,
      flipX: false,
      flipY: false,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      filter: "none",
    });
    toast.info(t("toast.reset"));
  };

  const handleProcess = async () => {
    if (!currentFile) return;
    setIsProcessing(true);
    setFileStatus(currentFile.id, "processing");

    try {
      const result = await processImage(currentFile.file, {
        ...settings,
        crop: currentFile.crop,
        blurs: currentFile.blurs
      });
      setProcessedUrl(currentFile.id, result.url, result.blob.size);
      setFileStatus(currentFile.id, "completed");
      setActiveTab("format");
      toast.success(t("toast.success"));
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 2000);
    } catch (err) {
      setFileStatus(currentFile.id, "error");
      toast.error(t("toast.failed"));
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessAll = async () => {
    setIsProcessing(true);
    for (const file of files) {
      if (file.status === "completed") continue;
      setFileStatus(file.id, "processing");
      try {
        const result = await processImage(file.file, {
          ...settings,
          crop: file.crop,
          blurs: file.blurs
        });
        setProcessedUrl(file.id, result.url, result.blob.size);
        setFileStatus(file.id, "completed");
      } catch (err) {
        setFileStatus(file.id, "error");
      }
    }
    setIsProcessing(false);
    toast.success(t("toast.batchComplete"));
  };

  const handleDownloadAll = async () => {
    const completedFiles = files.filter(f => f.status === "completed" && f.processedUrl);
    if (completedFiles.length === 0) {
      toast.error(t("toast.noCompleted"));
      return;
    }

    const zipFiles: { blob: Blob; name: string }[] = [];
    for (const file of completedFiles) {
      const response = await fetch(file.processedUrl!);
      const blob = await response.blob();
      zipFiles.push({
        blob,
        name: `processed-${file.file.name.split('.')[0]}.${settings.format}`
      });
    }

    await ExportManager.downloadZip(zipFiles, "studio-export.zip");
  };

  const handleDownloadSingle = async () => {
    if (!currentFile?.processedUrl) {
      toast.error(t("toast.processFirst"));
      return;
    }
    const ext = settings.format || currentFile.file.name.split('.').pop() || 'webp';
    const response = await fetch(currentFile.processedUrl);
    const blob = await response.blob();
    ExportManager.downloadFile(blob, `${currentFile.file.name.split('.')[0]}-studio.${ext}`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f =>
      f.type.startsWith('image/') || /\.(heic|heif|tiff?|psd|pdf|svg|webp|avif)$/i.test(f.name)
    );
    if (dropped.length > 0) {
      handleAddFiles(dropped);
      toast.success(t("toast.filesAdded", { count: dropped.length }));
    }
  };

  const handleOCR = async (file: File) => {
    setIsOcrLoading(true);
    try {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker('eng');
      // Use a canvas to ensure the format is readable by Tesseract
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((res) => img.onload = res);

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const { data: { text } } = await worker.recognize(canvas);
      setOcrResult(text);
      await worker.terminate();
      URL.revokeObjectURL(img.src);
    } catch (err) {
      console.error(err);
      toast.error(t("toast.ocrFailed"));
    } finally {
      setIsOcrLoading(false);
    }
  };

  const extractColors = (file: File) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);
      const data = ctx.getImageData(0, 0, 100, 100).data;
      const colors: { [key: string]: number } = {};
      for (let i = 0; i < data.length; i += 20) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        colors[hex] = (colors[hex] || 0) + 1;
      }
      const sorted = Object.entries(colors).sort((a, b) => b[1] - a[1]).slice(0, 8).map(c => c[0]);
      setExtractedColors(sorted);
      URL.revokeObjectURL(img.src);
    };
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleProcess();
      }
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        // Only if not in an input
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          updateSettings({ rotate: ((settings.rotate + 90) % 360) as any });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings, history, redoStack, currentFile]);

  const renderSettings = () => {
    if (!currentFile) return (
      <div className="flex-grow flex items-center justify-center p-5 text-center space-y-4">
        <div className="space-y-2">
          <p className="text-[10px] font-bold tracking-wider text-muted-foreground/40">{t("workspace.noSelection")}</p>
          <p className="text-xs text-muted-foreground/60">{t("workspace.uploadHint")}</p>
        </div>
      </div>
    );

    return (
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as string)} className="flex flex-col flex-grow min-h-0">
        <EditorSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentFile={currentFile}
          settings={settings}
          pushSettings={pushSettings}
          updateSettings={updateSettings}
          handleOCR={handleOCR}
          extractColors={extractColors}
          setMetadataFile={setMetadataFile}
          isOcrLoading={isOcrLoading}
          isProcessing={isProcessing}
          imageRef={imageRef}
          handleDownloadAll={handleDownloadAll}
          handleProcess={handleProcess}
          handleProcessAll={handleProcessAll}
          files={files}
          clearFiles={clearFiles}
        />
      </Tabs>
    );
  };

  return (
    <ClientOnly>
      <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 custom-scrollbar">
        {mode === "landing" && <Navbar />}

        <main id="main-content" className="flex-grow flex flex-col relative z-10">
          {mode === "landing" && (
            <>
              <EditorHero onUpload={handleAddFiles} />
              <TrustLayer />
              <LandingExtras 
                faqItems={[]} 
                t_tools={t_tools} 
                currentStatus="online" 
              />
            </>
          )}

          {mode === "studio" && (
            <section
              data-google-ads-ignore="true"
              className="flex flex-row overflow-hidden relative border-y border-border bg-black/20 h-screen"
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-primary/5 blur-[140px] rounded-full animate-pulse" />
                <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-blue-500/5 blur-[140px] rounded-full animate-pulse" />
              </div>

            <AssetSidebar
              files={files}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              removeFile={removeFile}
              onAddFiles={handleAddFiles}
            />

            <input
              id="studio-upload-mobile"
              type="file"
              multiple
              accept="image/*,.heic,.heif,.tiff,.tif,.psd,.svg,.pdf,.webp,.avif"
              className="hidden"
              onChange={(e) => {
                handleAddFiles(Array.from(e.target.files || []));
                (e.target as HTMLInputElement).value = "";
              }}
            />

            <section className="flex-grow bg-transparent relative flex flex-col h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
              <StudioHeader
                files={files}
                currentFile={currentFile}
                mode={mode}
                isMobileSettingsOpen={isMobileSettingsOpen}
                setIsMobileSettingsOpen={setIsMobileSettingsOpen}
                renderSettings={renderSettings}
              />

              <WorkspaceArea
                currentFile={currentFile}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                handleDrop={handleDrop}
                zoom={zoom}
                imageRef={imageRef}
                canvasRef={canvasRef}
                imageDimensions={imageDimensions}
                settings={settings}
                activeTab={activeTab}
                isProcessing={isProcessing}
                isScanning={isScanning}
                updateFileCrop={updateFileCrop}
                updateFileBlurs={updateFileBlurs}
                onAddFiles={handleAddFiles}
                onOpenOCR={() => setIsOCRDialogOpen(true)}
                onOpenColorPalette={() => setIsColorPaletteDialogOpen(true)}
                onOpenMetadata={() => setIsMetadataDialogOpen(true)}
                handleDownloadSingle={handleDownloadSingle}
              />

              <Toolbar
                currentFile={currentFile}
                undo={undo}
                redo={redo}
                history={history}
                redoStack={redoStack}
                zoom={zoom}
                setZoom={setZoom}
                settings={settings}
                pushSettings={pushSettings}
                handleProcess={handleProcess}
                handleDownloadSingle={handleDownloadSingle}
                isProcessing={isProcessing}
              />
            </section>

            <aside className="hidden lg:flex w-[320px] h-full max-h-full border-l border-border bg-card shrink-0 flex-col relative z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="px-6 py-5 border-b border-border bg-black/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[10px] font-bold tracking-wider text-primary flex items-center gap-2">
                      <Settings2 className="w-4 h-4" /> {t("workspace.studioMatrix")}
                    </h3>
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                      {t("workspace.wasmExecution")}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[8px] border-emerald-500/20 bg-emerald-500/10 text-emerald-500 font-semibold uppercase px-2 py-0.5 rounded-full italic animate-pulse">
                    {t("workspace.live")}
                  </Badge>
                </div>
              </div>
              <ScrollArea className="flex-grow">{renderSettings()}</ScrollArea>
              <div className="p-6 border-t border-border bg-black/10">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <Fingerprint className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-foreground">{t("workspace.memoryIsolated")}</span>
                </div>
              </div>
            </aside>
            </section>
          )}
        </main>

        <EditorDialogs
          ocrResult={ocrResult}
          setOcrResult={setOcrResult}
          extractedColors={extractedColors}
          setExtractedColors={setExtractedColors}
          metadataFile={metadataFile}
          setMetadataFile={setMetadataFile}
        />

        {mode === "landing" && <Footer />}
      </div>
    </ClientOnly>
  );
}
