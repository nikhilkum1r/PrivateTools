"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

import { AdUnit } from "@/components/shared/AdUnit";

interface EditorHeroProps {
  onUpload: (files: File[]) => void;
}

export function EditorHero({ onUpload }: EditorHeroProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const t = useTranslations("imageEditor");

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6 py-12 md:py-24 overflow-hidden bg-background">
      {/* Background soft gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text & Image Column */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-12 order-1">
          <div className="space-y-6 max-w-xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground font-heading leading-[1.1]"
            >
              Professional Image <span className="text-primary">Editor</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-2xl text-muted-foreground font-medium flex items-center gap-2 justify-center lg:justify-start"
            >
              Edit, Crop, and Filter <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-wider">Free</span>
            </motion.p>
          </div>

          <div className="relative group">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-black/5"
            >
              <Image 
                src="/hero-woman.webp"
                alt="Professional Image Editing"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                priority
              />
            </motion.div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 blur-3xl rounded-full -z-10" />
          </div>
        </div>

        {/* Right Column: Upload Card */}
        <div className="flex justify-center items-center order-2 w-full">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-[500px]"
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative min-h-[350px] rounded-[3rem] p-12 flex flex-col items-center justify-center transition-all duration-500",
                "glass-card border-2 border-dashed",
                isDragging ? "border-primary bg-primary/10 scale-105" : "border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl"
              )}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                className="hidden"
                multiple
                accept="image/*"
              />

              <div className="flex flex-col items-center text-center">
                <button
                  onClick={handleClick}
                  className="group relative flex items-center justify-center gap-3 px-10 h-20 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg md:text-xl shadow-[0_20px_40px_rgba(var(--color-primary-rgb),0.3)] transition-all active:scale-95"
                >
                  <Upload className="w-6 h-6" />
                  Upload Image
                </button>
              </div>
              <></>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


