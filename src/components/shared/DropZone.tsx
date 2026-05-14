"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, ShieldCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface DropZoneProps {
  onFilesDrop: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  children?: React.ReactNode;
}

export function DropZone({
  onFilesDrop,
  accept = "image/*,video/*,audio/*,application/pdf,.heic,.heif,.tiff,.psd,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md",
  maxSize = 20,
  multiple = false,
  className,
  title,
  description,
  children,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const t = useTranslations("common.dropzone");

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
          
          if (!accept || accept === "*/*") return isSizeValid;
          
          const acceptedTypes = accept.split(",").map(t => t.trim().toLowerCase());
          const fileType = file.type.toLowerCase();
          const fileName = file.name.toLowerCase();
          
          const isTypeValid = acceptedTypes.some(type => {
            if (type.startsWith(".")) {
              return fileName.endsWith(type);
            }
            if (type.endsWith("/*")) {
              const baseType = type.split("/")[0];
              return fileType.startsWith(baseType + "/");
            }
            return fileType === type;
          });
          
          return isSizeValid && isTypeValid;
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div data-google-ads-ignore="true" className="w-full max-w-4xl mx-auto space-y-4">
      <motion.div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.01 : 1,
          borderColor: isDragging ? "var(--primary)" : "var(--border)",
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative group cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8 transition-colors duration-200 flex flex-col items-center justify-center overflow-hidden",
          isDragging ? "border-primary bg-primary/5" : "hover:border-primary/40 hover:bg-secondary/30",
          className
        )}
      >
        {children ? (
          children
        ) : (
          <div className="flex flex-col items-center text-center space-y-4 pointer-events-none relative z-10">
            <motion.div
              animate={{
                y: isDragging ? -4 : 0,
              }}
              transition={{ duration: 0.3 }}
              className={cn(
                "p-5 rounded-2xl border transition-all duration-300",
                isDragging
                  ? "bg-primary/15 text-primary border-primary/30 shadow-lg shadow-primary/10"
                  : "bg-secondary/50 text-muted-foreground border-border group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20"
              )}
            >
              <Upload className="w-8 h-8" />
            </motion.div>
            {title !== " " && (
              <div className="space-y-2">
                <p className="text-lg font-semibold tracking-tight">
                  {title || t("title")}
                </p>
                {(description || t("description")) && (
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {description || t("description")}
                  </p>
                )}
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/60">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{t("processedLocally")}</span>
                    </div>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-[10px] font-medium text-muted-foreground/60">
                      {t("maxSize", { size: maxSize })}
                    </span>
                  </div>
              </div>
            )}
          </div>
        )}

        {/* Active drop overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none bg-primary/5 rounded-2xl"
            />
          )}
        </AnimatePresence>

        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || []);
            const validFiles = selectedFiles.filter((file) => {
              const isSizeValid = file.size <= maxSize * 1024 * 1024;
              if (!accept || accept === "*/*") return isSizeValid;
              const acceptedTypes = accept.split(",").map(t => t.trim().toLowerCase());
              const fileType = file.type.toLowerCase();
              const fileName = file.name.toLowerCase();
              const isTypeValid = acceptedTypes.some(type => {
                if (type.startsWith(".")) return fileName.endsWith(type);
                if (type.endsWith("/*")) return fileType.startsWith(type.split("/")[0] + "/");
                return fileType === type;
              });
              return isSizeValid && isTypeValid;
            });
            setFiles(validFiles);
            onFilesDrop(validFiles);
          }}
          accept={accept}
          multiple={multiple}
          aria-label={typeof title === 'string' ? title : t("title")}
        />
      </motion.div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 gap-2"
          >
            {files.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                layout
                className="flex items-center justify-between p-3.5 rounded-xl bg-secondary/30 border border-border group hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/8 text-primary shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-500 shrink-0"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
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
