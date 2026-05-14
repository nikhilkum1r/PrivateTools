"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tool } from "@/lib/tools-data";

interface SmartRoutingDialogProps {
   isOpen: boolean;
   setIsOpen: (open: boolean) => void;
   file: File | null;
   suggestedTools: Tool[];
}

export function SmartRoutingDialog({
   isOpen,
   setIsOpen,
   file,
   suggestedTools
}: SmartRoutingDialogProps) {
   const router = useRouter();
   const hp = useTranslations("home");
   const t_tools = useTranslations("tools");

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogContent className="sm:max-w-xl bg-background/80 border-border p-5 rounded-2xl shadow-2xl backdrop-blur-xl">
            <DialogHeader>
               <DialogTitle className="text-xl font-extrabold tracking-tight text-center mb-4">{hp("smartRouting.title")}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4">
               {suggestedTools.map((tool) => (
                  <Button 
                     key={tool.href} 
                     variant="outline" 
                     className="h-12 justify-start px-6 rounded-3xl border-border bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 dark:bg-secondary/30 backdrop-blur-sm group transition-all" 
                     onClick={() => router.push(tool.href)}
                  >
                     <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mr-4 shadow-lg group-hover:scale-105 transition-transform", tool.color)}>
                        <tool.icon className="w-6 h-6 text-foreground" />
                     </div>
                     <div className="text-left font-bold tracking-tight text-base">{t_tools(`data.${tool.href}.title`)}</div>
                  </Button>
               ))}
            </div>
         </DialogContent>
      </Dialog>
   );
}
