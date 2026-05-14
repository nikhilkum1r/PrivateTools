"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileQuestion,
  Home,
  Search,
  ChevronRight,
  ShieldAlert,
  ImageIcon,
  FileText,
  Lock,
  Zap,
  Shield
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  const suggestedTools = [
    { name: "Image Compressor", href: "/image/compress", icon: ImageIcon, color: "text-blue-500" },
    { name: "Word to PDF", href: "/document/word-to-pdf", icon: FileText, color: "text-emerald-500" },
    { name: "Secure Vault", href: "/privacy/vault", icon: Lock, color: "text-purple-500" },
    { name: "Converter", href: "/image/convert", icon: Zap, color: "text-yellow-500" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      {/* Static minimal header  avoids i18n context requirement */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2 font-semibold uppercase tracking-wider text-sm">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-primary">Safe</span>Tools
        </Link>
        <Link href="/" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-primary transition-colors">
          Return Home
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 pt-20 relative">
        {/* Ambient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl w-full space-y-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary/50 border border-border flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <FileQuestion className="w-12 h-12 text-primary animate-pulse" />
            </div>

            <div className="space-y-4">
              <Badge variant="outline" className="py-1 px-4 rounded-full border-red-500/30 bg-red-500/5 text-red-500 text-[10px] font-semibold uppercase tracking-wider">
                Error 404 · Page Not Found
              </Badge>
              <h1 className="text-2xl md:text-xl font-extrabold tracking-tight uppercase leading-none">
                Lost in the <br /> <span className="text-primary">Matrix.</span>
              </h1>
              <p className="text-muted-foreground text-xl font-medium max-w-lg mx-auto">
                The resource you're looking for has been purged or moved.
                Luckily, your privacy is still intact.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto"
          >
            {suggestedTools.map((tool, i) => (
              <Link key={i} href={tool.href}>
                <Card className="p-6 bg-secondary/30 border-border hover:border-primary/30 hover:bg-secondary/50 transition-all rounded-xl flex items-center gap-4 group cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center ${tool.color} group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">Suggested</p>
                    <p className="text-sm font-bold">{tool.name}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </Card>
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-8"
          >
            <Link href="/" className={cn(buttonVariants({ size: "lg" }), "h-10 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2")}>
              <Home className="w-4 h-4" /> RETURN TO SYSTEM
            </Link>
            <Link href="/about" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-10 px-8 rounded-2xl border-border hover:bg-secondary/50 text-foreground font-bold gap-2")}>
              <Search className="w-4 h-4" /> VIEW MANIFESTO
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Static minimal footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground/40 font-semibold uppercase tracking-wider">
        © {new Date().getFullYear()} SafeTools  Privacy-First Browser Tools
      </footer>
    </div>
  );
}
