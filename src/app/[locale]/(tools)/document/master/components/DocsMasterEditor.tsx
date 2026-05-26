"use client";

import React from "react";
import { 
  Edit3, Save, 
  DownloadCloud, RefreshCw, Layers, ShieldCheck, 
  CloudOff, Database, FileText, Sparkles, 
  FileSpreadsheet, Presentation, Search, Maximize2, 
  Eye, Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { AdUnit } from "@/components/shared/AdUnit";
import { cn } from "@/lib/utils";
import { ExportManager } from "@/lib/export-manager";

interface DocsMasterEditorProps {
  t: any;
  file: File;
  docType: string | null;
  activeTab: string;
  setActiveTab: (v: string) => void;
  previewContent: any;
  setPreviewContent: (v: any) => void;
  metadata: any;
  sheets: string[];
  currentSheet: number;
  workbook: any;
  loadSheet: (wb: any, index: number) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  scrubMetadata: boolean;
  setScrubMetadata: (v: boolean) => void;
  darkPreview: boolean;
  setDarkPreview: (v: boolean) => void;
  zoom: number;
  setZoom: (v: number) => void;
  selectedPage: number;
  setSelectedPage: (v: number) => void;
  isRenderingDocx: boolean;
  isRenderingPptx: boolean;
  forceMammoth: boolean;
  setForceMammoth: (v: boolean) => void;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  docxRef: React.RefObject<HTMLDivElement | null>;
  pptxRef: React.RefObject<HTMLDivElement | null>;
  handleCellChange: (ri: number, ci: number, val: string) => void;
  exportSpreadsheet: () => void;
  exportText: () => void;
  extractPDFPage: () => void;
  resetTool: () => void;
}

export function DocsMasterEditor({
  t, file, docType, activeTab, setActiveTab, previewContent, setPreviewContent,
  metadata, sheets, currentSheet, workbook, loadSheet, searchTerm, setSearchTerm,
  scrubMetadata, setScrubMetadata, darkPreview, setDarkPreview, zoom, setZoom,
  selectedPage, setSelectedPage, isRenderingDocx, isRenderingPptx, forceMammoth,
  setForceMammoth, isEditing, setIsEditing, docxRef, pptxRef, handleCellChange,
  exportSpreadsheet, exportText, extractPDFPage, resetTool
}: DocsMasterEditorProps) {

  return (
    <div className="flex flex-col lg:flex-row flex-grow w-full h-full">
      {/* Left Sidebar - Inspector */}
      <aside className="flex w-full lg:w-[300px] border-b lg:border-b-0 lg:border-r border-border glass-card flex-col shrink-0 relative z-10 shadow-2xl">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
          <div className="flex flex-col gap-1">
            <h3 className="text-[10px] font-bold tracking-[0.4em] text-emerald-500 flex items-center gap-3">
              <Edit3 className="w-4 h-4" /> {t("inspector.title")}
            </h3>
            <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-wider mt-1">{t("inspector.version")}</p>
          </div>
          <Badge variant="outline" className="text-[10px] border-emerald-500/20 bg-emerald-500/5 text-emerald-500 px-4 py-1.5 rounded-none font-bold">
            {t("inspector.engine", { type: docType?.toUpperCase() || "UNKNOWN" })}
          </Badge>
        </div>

        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-4">
            {/* Metadata Card */}
            <div className="space-y-6">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("inspector.identity.title")}</Label>
              <div className="p-5 rounded-none bg-white/[0.03] border border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">{t("inspector.identity.name")}</span>
                  <span className="text-[10px] font-bold truncate max-w-[200px]">{file.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">{t("inspector.identity.size")}</span>
                  <span className="text-[10px] font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("inspector.controls.title")}</Label>
              <div className="grid gap-3">
                {(docType === "xlsx" || docType === "csv" || docType === "ods") && (
                  <Button className="w-full h-10 rounded-none bg-blue-600 hover:bg-blue-500 text-foreground font-semibold uppercase tracking-wider text-[10px] gap-3" onClick={exportSpreadsheet}>
                    <Save className="w-4 h-4" /> {t("inspector.controls.saveSpreadsheet")}
                  </Button>
                )}
                {(docType === "txt" || docType === "json" || docType === "md" || docType === "xml" || docType === "html" || docType === "rtf" || docType === "pptx" || docType === "odp" || docType === "ppt") && (
                  <Button className="w-full h-10 rounded-none bg-blue-600 hover:bg-blue-500 text-foreground font-semibold uppercase tracking-wider text-[10px] gap-3" onClick={exportText}>
                    <Save className="w-4 h-4" /> {t("inspector.controls.saveText")}
                  </Button>
                )}
                {(docType === "docx" || docType === "odt" || docType === "doc") && (
                  <>
                    <Button 
                      className={cn("w-full h-10 rounded-none font-semibold uppercase tracking-wider text-[10px] gap-3", isEditing ? "bg-amber-500 hover:bg-amber-400 text-black" : "bg-blue-600 hover:bg-blue-500 text-foreground")}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit3 className="w-4 h-4" /> {isEditing ? t("inspector.controls.disableEdit") : t("inspector.controls.enableEdit")}
                    </Button>
                    {isEditing && (
                      <Button 
                        className="w-full h-10 rounded-none bg-indigo-600 hover:bg-indigo-500 text-foreground font-semibold uppercase tracking-wider text-[10px] gap-3"
                        onClick={() => window.print()}
                      >
                        <Save className="w-4 h-4" /> {t("inspector.controls.print")}
                      </Button>
                    )}
                  </>
                )}
                <Button className="w-full h-10 rounded-none bg-emerald-600 hover:bg-emerald-500 text-foreground font-semibold uppercase tracking-wider text-[10px] gap-3" onClick={() => ExportManager.downloadFromUrl(URL.createObjectURL(file), file.name)}>
                  <DownloadCloud className="w-4 h-4" /> {t("inspector.controls.exportOriginal")}
                </Button>
                <Button variant="outline" className="w-full h-10 rounded-none border-border hover:bg-secondary/50 text-muted-foreground/80 font-semibold uppercase tracking-wider text-[10px] gap-3" onClick={resetTool}>
                  <RefreshCw className="w-4 h-4" /> {t("inspector.controls.loadDifferent")}
                </Button>
              </div>
            </div>

            {/* PDF Page Extractor */}
            {docType === "pdf" && (
              <div className="space-y-6">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("manipulation.pdf.title")}</Label>
                <div className="p-6 bg-white/[0.03] border border-border rounded-none space-y-6">
                   <div className="space-y-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                         <Layers className="w-3.5 h-3.5 text-rose-500" /> {t("manipulation.pdf.target")}
                      </span>
                      <div className="flex items-center gap-3">
                         <input 
                            type="number"
                            min="1"
                            className="w-full h-12 bg-card border border-border rounded-none text-center font-bold text-emerald-500 focus:outline-none focus:border-emerald-500/50"
                            value={selectedPage}
                            onChange={(e) => setSelectedPage(parseInt(e.target.value) || 1)}
                         />
                         <Button 
                            onClick={extractPDFPage}
                            className="h-12 bg-white text-black hover:bg-emerald-500 hover:text-foreground rounded-none border-0 font-semibold uppercase tracking-wider text-[10px] px-6"
                         >
                            {t("manipulation.pdf.extract")}
                         </Button>
                      </div>
                   </div>
                   <div className="pt-4 border-t border-border">
                      <p className="text-[8px] font-bold text-muted-foreground/40 uppercase leading-relaxed tracking-wider">
                         {t("manipulation.pdf.tip")}
                      </p>
                   </div>
                </div>
              </div>
            )}

            {/* DOCX Engine Selection */}
            {docType === "docx" && (
              <div className="space-y-6">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("manipulation.docx.title")}</Label>
                <div className="p-6 bg-white/[0.03] border border-border rounded-none space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">{t("manipulation.docx.legacy")}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setForceMammoth(!forceMammoth)}
                      className={cn("h-8 px-4 rounded-none text-[8px] font-semibold uppercase tracking-wider", forceMammoth ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-secondary/50 text-muted-foreground/60 hover:bg-secondary")}
                    >
                      {forceMammoth ? t("manipulation.docx.enabled") : t("manipulation.docx.disabled")}
                    </Button>
                  </div>
                  <p className="text-[8px] font-bold text-muted-foreground/40 uppercase leading-relaxed tracking-wider">
                    {t("manipulation.docx.tip")}
                  </p>
                </div>
              </div>
            )}

            {/* Privacy & View Controls */}
            <div className="space-y-6">
              <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{t("config.title")}</Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-border rounded-none group hover:border-emerald-500/30 transition-all cursor-pointer" onClick={() => setScrubMetadata(!scrubMetadata)}>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-2">
                       <ShieldCheck className={cn("w-3.5 h-3.5 transition-colors", scrubMetadata ? "text-emerald-500" : "text-muted-foreground/40")} />
                       {t("config.scrub.title")}
                    </span>
                    <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-wider">{t("config.scrub.desc")}</span>
                  </div>
                  <Switch checked={scrubMetadata} onCheckedChange={setScrubMetadata} className="data-[state=checked]:bg-emerald-500" />
                </div>

                <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-border rounded-none group hover:border-blue-500/30 transition-all cursor-pointer" onClick={() => setDarkPreview(!darkPreview)}>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider flex items-center gap-2">
                       <Eye className={cn("w-3.5 h-3.5 transition-colors", darkPreview ? "text-blue-500" : "text-muted-foreground/40")} />
                       {t("config.dark.title")}
                    </span>
                    <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-wider">{t("config.dark.desc")}</span>
                  </div>
                  <Switch checked={darkPreview} onCheckedChange={setDarkPreview} className="data-[state=checked]:bg-blue-600" />
                </div>
              </div>
            </div>

            <div className="p-6 border border-emerald-500/10 bg-emerald-500/[0.02] rounded-none space-y-4">
               <div className="flex items-center gap-3 text-emerald-500">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{t("config.guard.title")}</span>
               </div>
               <p className="text-[9px] font-medium text-muted-foreground/60 leading-relaxed uppercase">{t("config.guard.desc")}</p>
            </div>

            {/* Sidebar AdUnit */}
            <div className="pt-2">
              <></>
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Main Preview Area */}
      <div className="flex-grow flex flex-col bg-background relative overflow-hidden">
         <div className="h-10 border-b border-border bg-muted/40 backdrop-blur-xl flex items-center px-8 justify-between shrink-0">
            <div className="flex items-center gap-4">
               <button className={cn("text-[10px] font-semibold uppercase tracking-wider transition-colors", activeTab === "preview" ? "text-emerald-500" : "text-muted-foreground/40")} onClick={() => setActiveTab("preview")}>{t("viewer.tabs.preview")}</button>
               <button className={cn("text-[10px] font-semibold uppercase tracking-wider transition-colors", activeTab === "data" ? "text-emerald-500" : "text-muted-foreground/40")} onClick={() => setActiveTab("data")}>{t("viewer.tabs.data")}</button>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground/40 text-[10px] font-bold uppercase">
               <CloudOff className="w-4 h-4" /> {t("viewer.processing")}
            </div>
         </div>

         <div className="flex-grow p-8 lg:p-5 overflow-auto custom-scrollbar flex flex-col items-center">
          <div className="max-w-6xl w-full mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 lg:px-0">
            {[
              { label: t("viewer.stats.size"), value: (file.size / 1024 / 1024).toFixed(2) + " MB", icon: Database },
              { label: t("viewer.stats.format"), value: docType?.toUpperCase(), icon: FileText },
              { label: t("viewer.stats.stability"), value: t("viewer.stats.verified"), icon: ShieldCheck },
              { label: t("viewer.stats.engine"), value: t("viewer.stats.wasm"), icon: Sparkles }
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.03] border border-border p-4 flex items-center gap-4 group hover:border-border transition-all">
                <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground/60 group-hover:text-foreground transition-colors">
                  <stat.icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-semibold uppercase tracking-wider text-muted-foreground/40">{stat.label}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/80">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          <Card className={cn("w-full max-w-6xl min-h-[900px] shadow-2xl rounded-none flex flex-col overflow-hidden border-0 transition-colors duration-500", darkPreview ? "bg-[#111] text-foreground" : "bg-white text-black")}>
               <div className={cn("h-12 border-b flex items-center px-5 justify-between shrink-0 transition-colors duration-500", darkPreview ? "border-border bg-muted/40" : "border-gray-100 bg-gray-50/50")}>
                  <div className="flex items-center gap-3">
                     <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-foreground shadow-lg transition-transform hover:scale-110", darkPreview ? "bg-white text-black" : "bg-black text-foreground")}>
                        {docType === "xlsx" || docType === "csv" ? <FileSpreadsheet className="w-5 h-5" /> : 
                         docType === "docx" ? <FileText className="w-5 h-5" /> :
                         docType === "pdf" ? <FileText className="w-5 h-5 text-red-400" /> :
                         docType === "pptx" ? <Presentation className="w-5 h-5 text-orange-400" /> :
                         <Edit3 className="w-5 h-5" /> }
                     </div>
                     <div className="flex flex-col">
                        <h2 className="text-lg font-bold tracking-tight uppercase leading-none">{file.name}</h2>
                        <span className={cn("text-[10px] font-semibold uppercase tracking-wider mt-1 transition-colors", darkPreview ? "text-muted-foreground/40" : "text-gray-400")}>
                           {docType === "xlsx" || docType === "csv" ? t("viewer.subtitles.sheet", { name: sheets[currentSheet] || "N/A" }) : 
                            docType === "pdf" ? t("viewer.subtitles.pdf") : t("viewer.subtitles.universal")}
                        </span>
                     </div>
                  </div>

                  {(docType === "xlsx" || docType === "csv") && sheets.length > 1 && (
                     <div className={cn("flex items-center gap-2 p-1.5 border shadow-sm transition-colors", darkPreview ? "bg-card border-border" : "bg-white border-gray-200")}>
                        {sheets.map((sheet, idx) => (
                           <button
                              key={sheet}
                              onClick={() => loadSheet(workbook!, idx)}
                              className={cn(
                                 "px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition-all",
                                 currentSheet === idx 
                                    ? (darkPreview ? "bg-white text-black" : "bg-black text-foreground") 
                                    : (darkPreview ? "text-muted-foreground/40 hover:text-foreground hover:bg-secondary/50" : "text-gray-400 hover:text-black hover:bg-gray-50")
                              )}
                           >
                              {sheet}
                           </button>
                        ))}
                     </div>
                  )}

                  <div className="flex items-center gap-4">
                     <div className={cn("flex items-center gap-2 border p-1 shadow-sm transition-colors", darkPreview ? "bg-card border-border" : "bg-white border-gray-200")}>
                        <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 hover:bg-gray-50 text-gray-400 hover:text-black transition-colors"><Search className="w-3.5 h-3.5" /></button>
                        <span className="text-[9px] font-bold w-10 text-center">{zoom}%</span>
                        <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1 hover:bg-gray-50 text-gray-400 hover:text-black transition-colors"><Maximize2 className="w-3.5 h-3.5" /></button>
                     </div>
                     <div className="relative group/search">
                        <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", darkPreview ? "text-muted-foreground/40" : "text-gray-400")} />
                        <input 
                           placeholder={t("viewer.controls.search")}
                           className={cn("h-10 pl-10 pr-4 rounded-none text-xs font-medium focus:outline-none transition-all w-[200px] lg:w-[300px]", 
                              darkPreview ? "bg-card border-border text-foreground focus:ring-white/20" : "bg-white border-gray-200 text-black focus:ring-black")}
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                        />
                     </div>
                     <Badge variant="outline" className={cn("rounded-none text-[9px] font-semibold uppercase tracking-wider px-4 py-1.5 transition-colors", darkPreview ? "border-border text-muted-foreground/60" : "border-gray-200 text-black/40")}>
                        {activeTab === "preview" ? t("viewer.controls.visual") : t("viewer.controls.structural")}
                     </Badge>
                  </div>
               </div>

               <div className="flex-grow p-5 overflow-auto scrollbar-hide">
                  <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.2s ease-out" }} className="w-full h-full">
                     {activeTab === "preview" ? (
                        docType === "xlsx" || docType === "csv" ? (
                           <div className={cn("overflow-auto border transition-colors", darkPreview ? "border-border bg-black" : "border-gray-100 bg-white")}>
                              <table className="w-full border-collapse">
                                 <tbody>
                                    {(previewContent as any[] || []).map((row, i) => {
                                       const rowMatches = searchTerm && row.some((cell: any) => cell?.toString().toLowerCase().includes(searchTerm.toLowerCase()));
                                       return (
                                          <tr key={i} className={cn("border-b last:border-0 hover:bg-gray-50/30 transition-colors", 
                                             darkPreview ? "border-border" : "border-gray-50",
                                             rowMatches && (darkPreview ? "bg-blue-500/10" : "bg-blue-50/20"))}>
                                             {(row as any[]).map((cell, j) => (
                                                <td key={j} className={cn("p-0 border-r last:border-0 text-sm font-medium min-w-[120px] transition-colors", 
                                                   darkPreview ? "border-border" : "border-gray-100",
                                                   searchTerm && cell?.toString().toLowerCase().includes(searchTerm.toLowerCase()) && (darkPreview ? "bg-blue-900/40" : "bg-yellow-100"))}>
                                                   <input 
                                                      className={cn("w-full h-full p-4 bg-transparent border-none focus:outline-none focus:bg-blue-50/50 transition-colors", 
                                                         darkPreview ? "text-foreground/80" : "text-gray-700")}
                                                      value={cell || ""}
                                                      onChange={(e) => handleCellChange(i, j, e.target.value)}
                                                   />
                                                </td>
                                             ))}
                                          </tr>
                                       );
                                    })}
                                 </tbody>
                              </table>
                           </div>
                        ) : (docType === "docx" || docType === "odt" || docType === "doc") ? (
                           <div className="relative min-h-[800px] w-full">
                              {isRenderingDocx && (
                                 <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-4 transition-all">
                                    <Loader2 className="w-10 h-10 animate-spin text-black" />
                                    <span className="text-[10px] font-bold tracking-wider animate-pulse">Rendering Document...</span>
                                 </div>
                              )}
                              <div ref={docxRef} className={cn("w-full docx-container min-h-screen p-4 transition-all", darkPreview && "invert brightness-90 contrast-110")} />
                           </div>
                        ) : (docType === "pptx" || docType === "odp" || docType === "ppt") ? (
                           <div className="relative min-h-[800px] w-full bg-gray-100 flex justify-center">
                              {isRenderingPptx && (
                                 <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-4 transition-all">
                                    <Loader2 className="w-10 h-10 animate-spin text-black" />
                                    <span className="text-[10px] font-bold tracking-wider animate-pulse">Rendering Presentation...</span>
                                 </div>
                              )}
                              <div ref={pptxRef} className={cn("w-full max-w-5xl pptx-container transition-all", darkPreview && "invert brightness-90 contrast-110")} />
                           </div>
                        ) : docType === "pdf" ? (
                           <iframe src={previewContent} className={cn("w-full h-[1200px] border-0 shadow-inner transition-all", darkPreview && "invert brightness-90 contrast-110")} />
                        ) : (
                           <div className="space-y-4 h-full">
                              <textarea 
                                 className={cn("w-full h-[800px] p-5 font-mono text-sm leading-relaxed border-0 focus:outline-none transition-all rounded-none resize-none", 
                                    darkPreview ? "bg-muted/40 text-emerald-400/80" : "bg-gray-50/50 text-gray-800")}
                                 value={typeof previewContent === "string" ? previewContent : JSON.stringify(previewContent, null, 2)}
                                 onChange={(e) => setPreviewContent(e.target.value)}
                                 placeholder={t("viewer.placeholder")}
                              />
                           </div>
                        )
                     ) : (
                        <div className="font-mono text-[11px] p-5 bg-gray-900 text-emerald-400 rounded-none overflow-auto w-full min-h-[700px] shadow-2xl">
                           <div className="flex items-center gap-4 mb-4 text-muted-foreground/60 uppercase tracking-wider border-b border-border pb-4">
                              <Database className="w-5 h-5" /> {t("viewer.structuralHeader")}
                           </div>
                           <pre className="leading-relaxed">{JSON.stringify(metadata, null, 3)}</pre>
                           <div className="mt-10 pt-10 border-t border-border opacity-30">
                              {t("viewer.structuralFooter", { address: (() => {
                                const hash = (file?.name || "0").split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                                return (0xDEADC0DE + hash).toString(16).toUpperCase();
                              })() })}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
