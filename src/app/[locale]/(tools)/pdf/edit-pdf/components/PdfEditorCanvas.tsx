"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { motion } from "framer-motion";
import {
  Settings2, Type, Pencil, Highlighter, ImageIcon, Eraser,
  RotateCcw, RotateCw, Trash2, Loader2, Save, ChevronLeft,
  ChevronRight, ZoomIn, ZoomOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/shared/DropZone";
import { ExportPanel } from "@/components/shared/ExportPanel";
import { AdUnit } from "@/components/shared/AdUnit";
import type { Annotation, PageInfo } from "../EditPdfClient";

if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = window.location.origin + "/lib/pdfjs/pdf.worker.min.mjs";
}

type Tool = "text" | "draw" | "highlight" | "image" | "erase";

export interface PdfEditorCanvasProps {
  t: any;
  pdfFile: File | null;
  pdfBytes: ArrayBuffer | null;
  pages: PageInfo[];
  currentPage: number;
  setCurrentPage: (p: number) => void;
  annotations: Annotation[];
  isProcessing: boolean;
  editedBlob: Blob | null;
  editedUrl: string | null;
  loadPdf: (files: File[]) => void;
  addAnnotation: (a: Annotation) => void;
  removeAnnotation: (id: string) => void;
  clearAnnotations: (page?: number) => void;
  rotatePage: (page: number, dir: "left" | "right") => void;
  deletePage: (page: number) => void;
  savePdf: () => void;
  handleReset: () => void;
  inputSize: number;
}

export function PdfEditorCanvas({
  t, pdfFile, pdfBytes, pages, currentPage, setCurrentPage,
  annotations, isProcessing, editedBlob, editedUrl,
  loadPdf, addAnnotation, removeAnnotation, clearAnnotations,
  rotatePage, deletePage, savePdf, handleReset, inputSize
}: PdfEditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTool, setActiveTool] = useState<Tool>("text");
  const [scale, setScale] = useState(1.2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPaths, setCurrentPaths] = useState<{x: number; y: number}[]>([]);
  const [highlightStart, setHighlightStart] = useState<{x: number; y: number} | null>(null);

  // Text tool state
  const [textInput, setTextInput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState("#000000");

  // Draw tool state
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState("#ef4444");

  // Highlight tool state
  const [highlightColor, setHighlightColor] = useState("#facc15");
  const [highlightOpacity, setHighlightOpacity] = useState(0.35);

  // Render PDF page to canvas
  useEffect(() => {
    if (!pdfBytes || pages.length === 0) return;
    let cancelled = false;

    const renderPage = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfBytes) });
        const pdf = await loadingTask.promise;
        if (cancelled || currentPage > pdf.numPages) return;

        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale, rotation: pages[currentPage - 1]?.rotation || 0 });

        const canvas = canvasRef.current;
        const overlay = overlayRef.current;
        if (!canvas || !overlay) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        overlay.width = viewport.width;
        overlay.height = viewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

        // Draw existing annotations on overlay
        drawAnnotationsOverlay();
      } catch (e) {
        console.error("Render error", e);
      }
    };

    renderPage();
    return () => { cancelled = true; };
  }, [pdfBytes, currentPage, scale, pages, annotations]);

  const drawAnnotationsOverlay = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, overlay.width, overlay.height);

    const pageAnns = annotations.filter(a => a.page === currentPage);
    for (const ann of pageAnns) {
      const sx = scale;
      switch (ann.type) {
        case "text":
          ctx.font = `${(ann.fontSize || 16) * sx}px Helvetica, sans-serif`;
          ctx.fillStyle = ann.color || "#000000";
          ctx.fillText(ann.text || "", ann.x * sx, ann.y * sx + (ann.fontSize || 16) * sx);
          break;
        case "draw":
          if (ann.paths && ann.paths.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = ann.strokeColor || "#ff0000";
            ctx.lineWidth = (ann.strokeWidth || 2) * sx;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.moveTo(ann.paths[0].x * sx, ann.paths[0].y * sx);
            for (let i = 1; i < ann.paths.length; i++) {
              ctx.lineTo(ann.paths[i].x * sx, ann.paths[i].y * sx);
            }
            ctx.stroke();
          }
          break;
        case "highlight":
          ctx.fillStyle = ann.highlightColor || "#ffff00";
          ctx.globalAlpha = ann.opacity || 0.3;
          ctx.fillRect(ann.x * sx, ann.y * sx, (ann.width || 200) * sx, (ann.height || 30) * sx);
          ctx.globalAlpha = 1;
          break;
        case "image":
          // Images drawn as placeholder rectangles in overlay
          ctx.strokeStyle = "#6366f1";
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 3]);
          ctx.strokeRect(ann.x * sx, ann.y * sx, (ann.imageWidth || 100) * sx, (ann.imageHeight || 100) * sx);
          ctx.setLineDash([]);
          ctx.fillStyle = "#6366f1";
          ctx.font = "12px sans-serif";
          ctx.fillText("📷 Image", ann.x * sx + 4, ann.y * sx + 16);
          break;
      }
    }
  }, [annotations, currentPage, scale]);

  const getCanvasCoords = (e: React.MouseEvent) => {
    const overlay = overlayRef.current;
    if (!overlay) return { x: 0, y: 0 };
    const rect = overlay.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale,
    };
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === "draw" || activeTool === "highlight") return;
    const coords = getCanvasCoords(e);

    if (activeTool === "text" && textInput.trim()) {
      addAnnotation({
        id: crypto.randomUUID(),
        type: "text",
        page: currentPage,
        x: coords.x,
        y: coords.y,
        text: textInput,
        fontSize,
        color: fontColor,
      });
      setTextInput("");
    }

    if (activeTool === "erase") {
      const pageAnns = annotations.filter(a => a.page === currentPage);
      // Find nearest annotation and remove it
      let nearest: Annotation | null = null;
      let minDist = 30;
      for (const ann of pageAnns) {
        const dx = coords.x - ann.x;
        const dy = coords.y - ann.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) {
          minDist = dist;
          nearest = ann;
        }
      }
      if (nearest) removeAnnotation(nearest.id);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);
    if (activeTool === "draw") {
      setIsDrawing(true);
      setCurrentPaths([coords]);
    }
    if (activeTool === "highlight") {
      setHighlightStart(coords);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeTool === "draw" && isDrawing) {
      const coords = getCanvasCoords(e);
      setCurrentPaths(prev => [...prev, coords]);
      // Live draw on overlay
      const overlay = overlayRef.current;
      if (!overlay) return;
      const ctx = overlay.getContext("2d");
      if (!ctx || currentPaths.length < 1) return;
      const last = currentPaths[currentPaths.length - 1];
      ctx.beginPath();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth * scale;
      ctx.lineCap = "round";
      ctx.moveTo(last.x * scale, last.y * scale);
      ctx.lineTo(coords.x * scale, coords.y * scale);
      ctx.stroke();
    }

    if (activeTool === "highlight" && highlightStart) {
      const overlay = overlayRef.current;
      const coords = getCanvasCoords(e);
      if (!overlay) return;
      drawAnnotationsOverlay();
      const ctx = overlay.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = highlightColor;
      ctx.globalAlpha = highlightOpacity;
      const w = (coords.x - highlightStart.x) * scale;
      const h = (coords.y - highlightStart.y) * scale;
      ctx.fillRect(highlightStart.x * scale, highlightStart.y * scale, w, h);
      ctx.globalAlpha = 1;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (activeTool === "draw" && isDrawing) {
      setIsDrawing(false);
      if (currentPaths.length > 2) {
        addAnnotation({
          id: crypto.randomUUID(),
          type: "draw",
          page: currentPage,
          x: 0, y: 0,
          paths: currentPaths,
          strokeWidth,
          strokeColor,
        });
      }
      setCurrentPaths([]);
    }
    if (activeTool === "highlight" && highlightStart) {
      const coords = getCanvasCoords(e);
      const w = coords.x - highlightStart.x;
      const h = coords.y - highlightStart.y;
      if (Math.abs(w) > 5 && Math.abs(h) > 5) {
        addAnnotation({
          id: crypto.randomUUID(),
          type: "highlight",
          page: currentPage,
          x: Math.min(highlightStart.x, coords.x),
          y: Math.min(highlightStart.y, coords.y),
          width: Math.abs(w),
          height: Math.abs(h),
          highlightColor,
          opacity: highlightOpacity,
        });
      }
      setHighlightStart(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      const img = new Image();
      img.onload = () => {
        const maxW = 200;
        const ratio = img.width / img.height;
        const w = Math.min(img.width, maxW);
        const h = w / ratio;
        addAnnotation({
          id: crypto.randomUUID(),
          type: "image",
          page: currentPage,
          x: 50, y: 50,
          imageData: base64,
          imageWidth: w,
          imageHeight: h,
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const tools: { id: Tool; icon: any; label: string }[] = [
    { id: "text", icon: Type, label: t("studio.tools.text") },
    { id: "draw", icon: Pencil, label: t("studio.tools.draw") },
    { id: "highlight", icon: Highlighter, label: t("studio.tools.highlight") },
    { id: "image", icon: ImageIcon, label: t("studio.tools.image") },
    { id: "erase", icon: Eraser, label: t("studio.tools.erase") },
  ];

  const pageAnnotations = annotations.filter(a => a.page === currentPage);

  return (
    <section className="container mx-auto px-4 pb-16 max-w-5xl">
      <div className="glass-card rounded-3xl border border-border shadow-2xl bg-secondary/30 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-black/20 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-500 flex items-center gap-2">
            <Settings2 className="w-4 h-4" /> {t("studio.title")}
          </h3>
          <Badge variant="outline" className="text-[9px] font-semibold uppercase tracking-wider border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
            {t("studio.badge")}
          </Badge>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {!pdfFile ? (
            <div className="space-y-6">
              <div className="ad-wrapper">
                <AdUnit type="banner" className="my-0 mb-6" />
              </div>
              <DropZone
                onFilesDrop={loadPdf}
                accept=".pdf,application/pdf"
                multiple={false}
                className="h-64 border-dashed border-indigo-500/30 hover:border-indigo-500/60 bg-black/20 rounded-3xl transition-colors"
              />
            </div>
          ) : editedBlob && editedUrl ? (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <ExportPanel
                blob={editedBlob}
                filename="SafeTools_Edited.pdf"
                inputSize={inputSize}
                onReset={handleReset}
              />
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-black/30 border border-border">
                {tools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                      activeTool === tool.id
                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                        : "bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    )}
                  >
                    <tool.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tool.label}</span>
                  </button>
                ))}

                <div className="h-6 w-px bg-border mx-1" />

                {/* Page controls */}
                <button onClick={() => rotatePage(currentPage, "left")} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors" title={t("studio.pageControls.rotateLeft")}>
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button onClick={() => rotatePage(currentPage, "right")} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors" title={t("studio.pageControls.rotateRight")}>
                  <RotateCw className="w-4 h-4" />
                </button>
                {pages.length > 1 && (
                  <button onClick={() => deletePage(currentPage)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors" title={t("studio.pageControls.deletePage")}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="h-6 w-px bg-border mx-1" />

                <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors" title={t("studio.pageControls.zoomIn")}>
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors" title={t("studio.pageControls.zoomOut")}>
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono text-muted-foreground">{Math.round(scale * 100)}%</span>
              </div>

              {/* Tool-specific controls */}
              <div className="p-3 rounded-2xl bg-black/20 border border-border space-y-3">
                {activeTool === "text" && (
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={textInput}
                      onChange={e => setTextInput(e.target.value)}
                      placeholder={t("studio.textControls.placeholder")}
                      className="flex-1 min-w-[180px] px-4 py-2.5 rounded-xl bg-black/30 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-indigo-500/50"
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("studio.textControls.fontSize")}</label>
                      <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="px-2 py-1.5 rounded-lg bg-black/30 border border-border text-xs text-foreground">
                        {[10, 12, 14, 16, 20, 24, 28, 32, 40, 48].map(s => <option key={s} value={s}>{s}px</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("studio.textControls.fontColor")}</label>
                      <input type="color" value={fontColor} onChange={e => setFontColor(e.target.value)} className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent" />
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 w-full">Click on the PDF to place text</p>
                  </div>
                )}

                {activeTool === "draw" && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("studio.drawControls.strokeWidth")}</label>
                      <input type="range" min={1} max={10} value={strokeWidth} onChange={e => setStrokeWidth(Number(e.target.value))} className="w-24 accent-indigo-500" />
                      <span className="text-xs text-muted-foreground font-mono">{strokeWidth}px</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("studio.drawControls.strokeColor")}</label>
                      <input type="color" value={strokeColor} onChange={e => setStrokeColor(e.target.value)} className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent" />
                    </div>
                    <p className="text-[10px] text-muted-foreground/60">Click and drag to draw on the PDF</p>
                  </div>
                )}

                {activeTool === "highlight" && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("studio.highlightControls.color")}</label>
                      <input type="color" value={highlightColor} onChange={e => setHighlightColor(e.target.value)} className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent" />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("studio.highlightControls.opacity")}</label>
                      <input type="range" min={10} max={80} value={highlightOpacity * 100} onChange={e => setHighlightOpacity(Number(e.target.value) / 100)} className="w-24 accent-yellow-500" />
                      <span className="text-xs text-muted-foreground font-mono">{Math.round(highlightOpacity * 100)}%</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground/60">Click and drag to highlight an area</p>
                  </div>
                )}

                {activeTool === "image" && (
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold cursor-pointer hover:bg-indigo-500/20 transition-colors">
                      <ImageIcon className="w-4 h-4 inline mr-2" />
                      {t("studio.imageControls.select")}
                      <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handleImageUpload} />
                    </label>
                    <p className="text-[10px] text-muted-foreground/60">Select an image to place on the current page</p>
                  </div>
                )}

                {activeTool === "erase" && (
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] text-muted-foreground/60">Click near an annotation to remove it</p>
                    <button onClick={() => clearAnnotations(currentPage)} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors">
                      {t("studio.undoAll")}
                    </button>
                  </div>
                )}

                {/* Annotation count */}
                <div className="text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider">
                  {pageAnnotations.length > 0
                    ? t("studio.annotations", { count: pageAnnotations.length })
                    : t("studio.noAnnotations")}
                </div>
              </div>

              {/* Canvas Area */}
              <div ref={containerRef} className="relative overflow-auto rounded-2xl bg-black/40 border border-border max-h-[600px]">
                <div className="relative inline-block">
                  <canvas ref={canvasRef} className="block" />
                  <canvas
                    ref={overlayRef}
                    className="absolute top-0 left-0 cursor-crosshair"
                    onClick={handleCanvasClick}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />
                </div>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/20 border border-border">
                <Button variant="ghost" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                </Button>
                <span className="text-sm font-bold text-foreground">
                  {t("studio.pages", { current: currentPage, total: pages.length })}
                </span>
                <Button variant="ghost" size="sm" disabled={currentPage >= pages.length} onClick={() => setCurrentPage(currentPage + 1)}>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Page Thumbnails */}
              {pages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {pages.map(p => (
                    <button
                      key={p.pageNum}
                      onClick={() => setCurrentPage(p.pageNum)}
                      className={cn(
                        "shrink-0 w-16 h-20 rounded-xl border-2 flex items-center justify-center text-xs font-bold transition-all",
                        currentPage === p.pageNum
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                          : "border-border bg-black/20 text-muted-foreground hover:border-indigo-500/30"
                      )}
                    >
                      {p.pageNum}
                    </button>
                  ))}
                </div>
              )}

              {/* Save Button */}
              <button
                className="w-full h-14 rounded-2xl font-bold text-lg gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-foreground shadow-xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                onClick={savePdf}
                disabled={isProcessing}
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isProcessing ? t("studio.saving_button") : t("studio.save_button")}
              </button>

              <div className="pt-4">
                <AdUnit type="content" className="my-0" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
