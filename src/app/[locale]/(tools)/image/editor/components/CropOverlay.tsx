"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ImageFile, ImageSettings } from "@/store/useImageStore";

export const CropOverlay = ({
  file,
  imageRef,
  dimensions,
  settings,
  zoom,
  updateFileCrop
}: {
  file: ImageFile,
  imageRef: React.RefObject<HTMLImageElement | null>,
  dimensions: { naturalWidth: number, naturalHeight: number },
  settings: ImageSettings,
  zoom: number,
  updateFileCrop: (id: string, crop: { x: number, y: number, width: number, height: number }) => void
}) => {
  const [isDraggingBox, setIsDraggingBox] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0 });
  const [displayMetrics, setDisplayMetrics] = useState<{
    width: number, height: number, offsetX: number, offsetY: number, scale: number
  } | null>(null);

  const { naturalWidth, naturalHeight } = dimensions;

  useEffect(() => {
    const measure = () => {
      if (!imageRef.current) return;
      const img = imageRef.current;

      const displayWidth = img.clientWidth;
      const displayHeight = img.clientHeight;

      setDisplayMetrics({
        width: displayWidth,
        height: displayHeight,
        offsetX: 0,
        offsetY: 0,
        scale: zoom * (displayWidth / naturalWidth)
      });
    };

    measure();
    const timer = setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(timer);
    };
  }, [imageRef, naturalWidth, naturalHeight, zoom, settings.rotate]);

  const crop = file.crop || { x: 0, y: 0, width: naturalWidth, height: naturalHeight };

  useEffect(() => {
    if (!displayMetrics) return;
    const { scale } = displayMetrics;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingBox) return;

      const dx_screen = (e.clientX - dragStart.x) / scale;
      const dy_screen = (e.clientY - dragStart.y) / scale;

      const rad = -(settings.rotate * Math.PI) / 180;
      const dx = dx_screen * Math.cos(rad) - dy_screen * Math.sin(rad);
      const dy = dx_screen * Math.sin(rad) + dy_screen * Math.cos(rad);

      const nextX = Math.max(0, Math.min(naturalWidth - crop.width, dragStart.cropX + dx));
      const nextY = Math.max(0, Math.min(naturalHeight - crop.height, dragStart.cropY + dy));

      updateFileCrop(file.id, { x: Math.round(nextX), y: Math.round(nextY), width: crop.width, height: crop.height });
    };

    const handleMouseUp = () => setIsDraggingBox(false);

    if (isDraggingBox) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingBox, dragStart, crop, file.id, displayMetrics, naturalWidth, naturalHeight, updateFileCrop, settings.rotate]);

  if (!displayMetrics) return null;

  const { offsetX, offsetY, scale } = displayMetrics;
  const displayX = offsetX + (crop.x * scale);
  const displayY = offsetY + (crop.y * scale);
  const displayW = crop.width * scale;
  const displayH = crop.height * scale;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingBox(true);
    setDragStart({ x: e.clientX, y: e.clientY, cropX: crop.x, cropY: crop.y });
  };

  const handleResize = (handle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startCrop = { ...crop };

    const onMove = (moveEvent: MouseEvent) => {
      if (!displayMetrics) return;
      const { scale } = displayMetrics;
      const dx_screen = (moveEvent.clientX - startX) / scale;
      const dy_screen = (moveEvent.clientY - startY) / scale;

      const rad = -(settings.rotate * Math.PI) / 180;
      const dx = dx_screen * Math.cos(rad) - dy_screen * Math.sin(rad);
      const dy = dx_screen * Math.sin(rad) + dy_screen * Math.cos(rad);

      const nextCrop = { ...startCrop };

      if (handle.includes("e")) nextCrop.width = Math.max(10, Math.min(naturalWidth - startCrop.x, startCrop.width + dx));
      if (handle.includes("s")) nextCrop.height = Math.max(10, Math.min(naturalHeight - startCrop.y, startCrop.height + dy));
      if (handle.includes("w")) {
        const moveX = Math.min(startCrop.width - 10, Math.max(-startCrop.x, dx));
        nextCrop.x = startCrop.x + moveX;
        nextCrop.width = startCrop.width - moveX;
      }
      if (handle.includes("n")) {
        const moveY = Math.min(startCrop.height - 10, Math.max(-startCrop.y, dy));
        nextCrop.y = startCrop.y + moveY;
        nextCrop.height = startCrop.height - moveY;
      }

      updateFileCrop(file.id, {
        x: Math.round(nextCrop.x),
        y: Math.round(nextCrop.y),
        width: Math.round(nextCrop.width),
        height: Math.round(nextCrop.height)
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="absolute inset-0 z-40 pointer-events-none select-none overflow-hidden">
      <svg className="w-full h-full">
        <defs>
          <mask id="crop-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect x={displayX} y={displayY} width={displayW} height={displayH} fill="black" rx="2" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="black" fillOpacity="0.6" mask="url(#crop-mask)" className="pointer-events-auto" />
      </svg>
      <div
        className="absolute border-2 border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] cursor-move pointer-events-auto group"
        style={{ left: displayX, top: displayY, width: displayW, height: displayH }}
        onMouseDown={handleMouseDown}
      >
        {["nw", "n", "ne", "e", "se", "s", "sw", "w"].map((h) => (
          <div
            key={h}
            className={cn(
              "absolute w-4 h-4 bg-primary border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform cursor-pointer shadow-lg",
              h === "nw" && "left-0 top-0 cursor-nw-resize",
              h === "n" && "left-1/2 top-0 cursor-n-resize",
              h === "ne" && "left-full top-0 cursor-ne-resize",
              h === "e" && "left-full top-1/2 cursor-e-resize",
              h === "se" && "left-full top-full cursor-se-resize",
              h === "s" && "left-1/2 top-full cursor-s-resize",
              h === "sw" && "left-0 top-full cursor-sw-resize",
              h === "w" && "left-0 top-1/2 cursor-w-resize"
            )}
            onMouseDown={(e) => handleResize(h, e)}
          />
        ))}
      </div>
    </div>
  );
};
