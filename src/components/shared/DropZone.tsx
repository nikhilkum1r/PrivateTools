"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DropZoneProps {
  onFilesDrop: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

export function DropZone({
  onFilesDrop,
  accept = "image/*,video/*,audio/*,application/pdf,.heic,.heif,.tiff,.psd,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md",
  maxSize = 20,
  multiple = false,
  className,
  title,
  description,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        const validFiles = droppedFiles.filter((file) => {
          const isSizeValid = file.size <= maxSize * 1024 * 1024;
          return isSizeValid; // Add type validation if needed
        });

        if (multiple) {
          setFiles((prev) => [...prev, ...validFiles]);
          onFilesDrop(validFiles);
        } else {
          setFiles([validFiles[0]]);
          onFilesDrop([validFiles[0]]);
        }
      }
    },
    [maxSize, multiple, onFilesDrop]
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <motion.div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={handleDrop}
        initial={{
          backgroundColor: "rgba(139, 92, 246, 0)",
          borderColor: "var(--border)",
        }}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? "var(--primary)" : "var(--border)",
          backgroundColor: isDragging ? "rgba(139, 92, 246, 0.05)" : "rgba(139, 92, 246, 0)",
        }}
        className={cn(
          "relative group cursor-pointer rounded-[2.5rem] border-2 border-dashed p-12 transition-colors duration-300 ease-in-out flex flex-col items-center justify-center overflow-hidden",
          isDragging ? "border-primary" : "hover:border-primary/50",
          className
        )}
      >
        <div className="flex flex-col items-center text-center space-y-6 pointer-events-none relative z-10">
          <motion.div 
            animate={{ 
              scale: isDragging ? [1, 1.2, 1] : 1,
              rotate: isDragging ? [0, 5, -5, 0] : 0
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="p-6 rounded-[2rem] bg-primary/10 text-primary border border-primary/20 shadow-2xl group-hover:scale-110 transition-transform duration-500"
          >
            <Upload className="w-10 h-10" />
          </motion.div>
          {title !== " " && (
            <div className="space-y-3">
              <p className="text-2xl font-black uppercase tracking-tighter italic">
                {title || "Initialize Local Asset Pipeline"}
              </p>
              <div className="flex items-center justify-center gap-3">
                 <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                    ))}
                 </div>
                 <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] italic">
                   {description || `Privacy-First Handling • Max ${maxSize}MB`}
                 </p>
                 <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                    ))}
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Secure Tunnel Effect */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute inset-0 bg-primary/5 animate-pulse" />
              <div className="absolute inset-0 border-4 border-primary/20 border-dashed animate-[spin_20s_linear_infinite] scale-150" />
            </motion.div>
          )}
        </AnimatePresence>

        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || []);
            setFiles(selectedFiles);
            onFilesDrop(selectedFiles);
          }}
          accept={accept}
          multiple={multiple}
        />
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 gap-3"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                layout
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-sm group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-primary/5 text-primary">
                    <File className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-[10px] uppercase tracking-widest truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-500"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
