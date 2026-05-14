"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { ImageFile } from "@/store/useImageStore";

export const BlurOverlay = ({
  file,
  updateFileBlurs
}: {
  file: ImageFile,
  updateFileBlurs: (id: string, blurs: any[]) => void
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentBlur, setCurrentBlur] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    setIsDrawing(true);
    setStartPos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const width = Math.abs(x - startPos.x);
    const height = Math.abs(y - startPos.y);
    const left = Math.min(x, startPos.x);
    const top = Math.min(y, startPos.y);
    setCurrentBlur({ x: left, y: top, width, height });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentBlur && currentBlur.width > 5 && currentBlur.height > 5) {
      const newBlur = { id: Math.random().toString(36).substring(7), ...currentBlur };
      updateFileBlurs(file.id, [...(file.blurs || []), newBlur]);
    }
    setCurrentBlur(null);
  };

  return (
    <div
      className="absolute inset-0 z-40 cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {file.blurs?.map(blur => (
        <div
          key={blur.id}
          className="absolute border-2 border-emerald-500/50 backdrop-blur-3xl group/blur"
          style={{ left: blur.x, top: blur.y, width: blur.width, height: blur.height, backgroundColor: 'rgba(0,0,0,0.1)' }}
        >
          <button
            className="absolute -top-3 -right-3 w-6 h-6 bg-destructive text-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              updateFileBlurs(file.id, file.blurs?.filter(b => b.id !== blur.id) || []);
            }}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      {currentBlur && (
        <div
          className="absolute border-2 border-emerald-500 border-dashed bg-emerald-500/10"
          style={{ left: currentBlur.x, top: currentBlur.y, width: currentBlur.width, height: currentBlur.height }}
        />
      )}
    </div>
  );
};
