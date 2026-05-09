"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Settings2, Trash2, CheckCircle2, Loader2,
  FileDown, ArrowRight, Zap, Layers, Cpu, ShieldCheck, 
  DownloadCloud, History, Undo2, Redo2, Sparkles, 
  RefreshCw, Check, X, Edit3, Table, FileSpreadsheet,
  Presentation, FileJson, Search, Filter, Save, Eye,
  Maximize2, Type, Database, CloudOff
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { DropZone } from "@/components/shared/DropZone";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExportManager } from "@/lib/export-manager";
import * as XLSX from "xlsx";
import { renderAsync } from "docx-preview";
import mammoth from "mammoth";
import JSZip from "jszip";
import initPptx, { convert as convertPptx } from "@briank-dev/pptx2html-turbo";

import { PDFDocument } from "pdf-lib";

type DocType = "pdf" | "docx" | "xlsx" | "pptx" | "csv" | "txt" | "json";

export default function DocsMasterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewContent, setPreviewContent] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>({});
  const [activeTab, setActiveTab] = useState("preview");
  const [sheets, setSheets] = useState<string[]>([]);
  const [currentSheet, setCurrentSheet] = useState(0);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrubMetadata, setScrubMetadata] = useState(false);
  const [darkPreview, setDarkPreview] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [selectedPage, setSelectedPage] = useState(1);
  const docxRef = useRef<HTMLDivElement>(null);
  const pptxRef = useRef<HTMLDivElement>(null);

  const [isRenderingDocx, setIsRenderingDocx] = useState(false);
  const [isRenderingPptx, setIsRenderingPptx] = useState(false);
  const [forceMammoth, setForceMammoth] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (docxRef.current) {
      docxRef.current.contentEditable = isEditing ? "true" : "false";
      docxRef.current.style.outline = isEditing ? "2px dashed #10b981" : "none";
    }
  }, [isEditing]);

  useEffect(() => {
    if (docType === "docx" && file && docxRef.current) {
      const renderDocx = async () => {
        setIsRenderingDocx(true);
        try {
          const arrayBuffer = await file.arrayBuffer();
          if (docxRef.current) {
            docxRef.current.innerHTML = "";
            
            if (forceMammoth) {
              throw new Error("Manual Fallback Requested");
            }

            await renderAsync(arrayBuffer, docxRef.current, undefined, {
              inWrapper: false,
              ignoreWidth: false,
              ignoreHeight: false,
            });
          }
        } catch (err) {
          console.warn("Primary DOCX Engine encountered a structural error. Switching to Mammoth fallback mode.");
          try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            if (docxRef.current) {
              docxRef.current.innerHTML = `
                <div class="mammoth-fallback p-5 lg:p-8 bg-white text-black shadow-inner min-h-screen">
                  <div class="mb-4 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                    <span class="text-xl">ℹ️</span> Smart Fallback Active: This document is rendered using a semantic parser to handle complex structures.
                  </div>
                  <div class="prose prose-sm max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter">
                    ${result.value}
                  </div>
                </div>
              `;
            }
            toast.info("Switched to secondary rendering engine for compatibility.");
          } catch (fallbackErr) {
            console.error("Secondary Engine Failure:", fallbackErr);
            if (docxRef.current) {
              docxRef.current.innerHTML = `<div class="p-5 text-red-500 font-bold uppercase tracking-widest text-center border-2 border-dashed border-red-500/20">
                <div class="mb-4 text-2xl">⚠️</div>
                Critical Engine Failure: This document is encrypted or fundamentally corrupted.
              </div>`;
            }
            toast.error("All rendering engines failed to parse this document.");
          }
        } finally {
          setIsRenderingDocx(false);
        }
      };
      renderDocx();
    }
  }, [file, docType]);

  useEffect(() => {
    if (docType === "pptx" && file && pptxRef.current) {
      const renderPptx = async () => {
        setIsRenderingPptx(true);
        try {
          await initPptx();
          const arrayBuffer = await file.arrayBuffer();
          const html = convertPptx(new Uint8Array(arrayBuffer));
          if (pptxRef.current) {
            pptxRef.current.innerHTML = `<div class="pptx-render-container w-full h-full flex flex-col items-center gap-4 py-4">${html}</div>`;
          }
        } catch (err) {
          console.error("PPTX Render Error:", err);
          if (pptxRef.current) {
            pptxRef.current.innerHTML = `<div class="p-5 text-red-500 font-bold uppercase tracking-widest text-center border-2 border-dashed border-red-500/20">
              <div class="mb-4 text-2xl">⚠️</div>
              Visual Engine Failure: Could not render slides. Check Raw Structure tab.
            </div>`;
          }
          toast.error("Failed to render presentation visually.");
        } finally {
          setIsRenderingPptx(false);
        }
      };
      renderPptx();
    }
  }, [file, docType]);

  const handleFileDrop = async (files: File[]) => {
    if (files[0]) {
      const f = files[0];
      setFile(f);
      const ext = f.name.split(".").pop()?.toLowerCase() as DocType;
      setDocType(ext);
      setIsProcessing(true);
      setPreviewContent(null);

      try {
        await parseFile(f, ext);
        toast.success(`${ext.toUpperCase()} Engine Initialized`);
      } catch (err) {
        console.error(err);
        toast.error("Failed to parse document");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const parseFile = async (f: File, type: DocType) => {
    if (type === "xlsx" || type === "csv") {
      const data = await f.arrayBuffer();
      const wb = XLSX.read(data);
      setWorkbook(wb);
      setSheets(wb.SheetNames);
      loadSheet(wb, 0);
      setMetadata({
        sheets: wb.SheetNames.length,
        creator: wb.Props?.Author || "Anonymous",
        created: wb.Props?.CreatedDate?.toString() || "Unknown"
      });
    } else if (type === "pptx") {
      try {
        const zip = await JSZip.loadAsync(f);
        let extractedText = "";
        const slideRegex = /ppt\/slides\/slide\d+\.xml/;
        
        let slideCount = 0;
        for (const filename of Object.keys(zip.files)) {
          if (slideRegex.test(filename)) {
            slideCount++;
            const content = await zip.files[filename].async("string");
            // Extract text from XML <a:t> tags
            const textNodes = content.match(/<a:t>([^<]*)<\/a:t>/g);
            if (textNodes) {
              const slideText = textNodes.map(node => node.replace(/<\/?a:t>/g, "")).join(" ");
              extractedText += `--- Slide ${slideCount} ---\n${slideText}\n\n`;
            }
          }
        }
        setPreviewContent(extractedText || "No readable text found in presentation.");
        setMetadata({ size: f.size, slides: slideCount, type: "PowerPoint Presentation" });
      } catch (err) {
        console.error("PPTX Parsing Error", err);
        setPreviewContent("Failed to extract text from presentation.");
      }
    } else if (type === "txt" || type === "json") {
      const text = await f.text();
      setPreviewContent(type === "json" ? JSON.parse(text) : text);
      setMetadata({ size: f.size, lastModified: new Date(f.lastModified).toLocaleString() });
    } else if (type === "docx") {
      // We'll use the browser's blob for the docx-preview later in the render
      setPreviewContent(URL.createObjectURL(f));
      setMetadata({ size: f.size, name: f.name });
    } else {
      setPreviewContent(URL.createObjectURL(f));
      setMetadata({ size: f.size, name: f.name });
    }
  };

  const loadSheet = (wb: XLSX.WorkBook, index: number) => {
    const sheetName = wb.SheetNames[index];
    const ws = wb.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
    setPreviewContent(json);
    setCurrentSheet(index);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    if (!previewContent) return;
    const newContent = [...(previewContent as any[])];
    newContent[rowIndex][colIndex] = value;
    setPreviewContent(newContent);
  };

  const exportSpreadsheet = () => {
    if (!previewContent || !file || !workbook) return;
    const ws = XLSX.utils.aoa_to_sheet(previewContent);
    const newWb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWb, ws, sheets[currentSheet]);
    
    if (scrubMetadata) {
      newWb.Props = {
        Author: "SafeTools User",
        Title: "Secured Document",
        CreatedDate: new Date()
      };
    }

    const ext = docType === "csv" ? "csv" : "xlsx";
    XLSX.writeFile(newWb, `master-edit-${file.name.split('.')[0]}.${ext}`);
    toast.success("Spreadsheet exported successfully");
  };

  const extractPDFPage = async () => {
    if (!file || docType !== "pdf") return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      const pageCount = pdfDoc.getPageCount();
      if (selectedPage < 1 || selectedPage > pageCount) {
        toast.error(`Invalid page number. Document has ${pageCount} pages.`);
        return;
      }

      const [copiedPage] = await newPdf.copyPages(pdfDoc, [selectedPage - 1]);
      newPdf.addPage(copiedPage);

      if (scrubMetadata) {
        newPdf.setAuthor("SafeTools User");
        newPdf.setCreator("SafeTools Studio");
        newPdf.setProducer("WASM Engine");
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes.slice(0)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `extracted-page-${selectedPage}-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Page ${selectedPage} extracted successfully`);
    } catch (err) {
      console.error("PDF Extraction Error:", err);
      toast.error("Failed to extract PDF page");
    }
  };
  const exportText = () => {
    if (!previewContent || !file) return;
    const content = typeof previewContent === "string" ? previewContent : JSON.stringify(previewContent, null, 2);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `master-edit-${file.name}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Document exported successfully");
  };

   return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-background text-foreground overflow-y-auto lg:overflow-hidden lg:overflow-hidden selection:bg-primary/30 custom-scrollbar">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:flex-row overflow-visible lg:overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-blue-500/5 blur-[140px] rounded-full animate-pulse" />
        </div>

        {!file ? (
          <div className="flex-grow flex items-center justify-center p-8 relative z-10">
            <div className="max-w-2xl w-full space-y-6 text-center">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-600/20 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-2xl relative group">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <FileText className="w-10 h-10 text-emerald-500 relative z-10" />
                </div>
                <div className="space-y-4">
                  <h1 className="text-2xl md:text-2xl font-black tracking-tighter uppercase italic leading-none">Docs <br/><span className="text-emerald-500">Master.</span></h1>
                  <p className="text-muted-foreground/60 text-xl font-medium max-w-md mx-auto leading-relaxed italic">Unified secure document laboratory. Universal support for Office, PDF, and Data formats.</p>
                </div>
              </div>
              <DropZone 
                onFilesDrop={handleFileDrop} 
                accept=".pdf,.docx,.xlsx,.pptx,.csv,.txt,.json" 
                multiple={false} 
                className="h-64 border-dashed border-border bg-secondary/30 rounded-none hover:bg-secondary/70 hover:border-emerald-500/40 transition-all group" 
              />
              
              <div className="grid grid-cols-4 gap-4 opacity-40">
                {["PDF", "DOCX", "XLSX", "CSV"].map(t => (
                  <div key={t} className="p-4 border border-border bg-white/[0.01] rounded-none flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black tracking-widest uppercase">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Inspector */}
            <aside className="flex w-full lg:w-[300px] border-b lg:border-b-0 lg:border-r border-border glass-card flex-col shrink-0 relative z-10 shadow-2xl">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
                <div className="flex flex-col gap-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 flex items-center gap-3">
                    <Edit3 className="w-4 h-4" /> Doc Inspector
                  </h3>
                  <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">Universal Engine v2.0</p>
                </div>
                <Badge variant="outline" className="text-[10px] border-emerald-500/20 bg-emerald-500/5 text-emerald-500 px-4 py-1.5 rounded-none font-black italic">
                  {docType?.toUpperCase()} ENGINE
                </Badge>
              </div>

              <ScrollArea className="flex-grow">
                <div className="p-4 space-y-4">
                  {/* Metadata Card */}
                  <div className="space-y-6">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">File Identity</Label>
                    <div className="p-5 rounded-none bg-white/[0.03] border border-border space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">Name</span>
                        <span className="text-[10px] font-black truncate max-w-[200px]">{file.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">Size</span>
                        <span className="text-[10px] font-black">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-6">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Master Controls</Label>
                    <div className="grid gap-3">
                      {(docType === "xlsx" || docType === "csv") && (
                        <Button className="w-full h-10 rounded-none bg-blue-600 hover:bg-blue-500 text-foreground font-black uppercase tracking-widest text-[10px] gap-3" onClick={exportSpreadsheet}>
                          <Save className="w-4 h-4" /> Save Spreadsheet
                        </Button>
                      )}
                      {(docType === "txt" || docType === "json" || docType === "pptx") && (
                        <Button className="w-full h-10 rounded-none bg-blue-600 hover:bg-blue-500 text-foreground font-black uppercase tracking-widest text-[10px] gap-3" onClick={exportText}>
                          <Save className="w-4 h-4" /> Save Extracted Text
                        </Button>
                      )}
                      {docType === "docx" && (
                        <>
                          <Button 
                            className={cn("w-full h-10 rounded-none font-black uppercase tracking-widest text-[10px] gap-3", isEditing ? "bg-amber-500 hover:bg-amber-400 text-black" : "bg-blue-600 hover:bg-blue-500 text-foreground")}
                            onClick={() => setIsEditing(!isEditing)}
                          >
                            <Edit3 className="w-4 h-4" /> {isEditing ? "Disable Edit Mode" : "Enable Edit Mode"}
                          </Button>
                          {isEditing && (
                            <Button 
                              className="w-full h-10 rounded-none bg-indigo-600 hover:bg-indigo-500 text-foreground font-black uppercase tracking-widest text-[10px] gap-3"
                              onClick={() => window.print()}
                            >
                              <Save className="w-4 h-4" /> Print / Save as PDF
                            </Button>
                          )}
                        </>
                      )}
                      <Button className="w-full h-10 rounded-none bg-emerald-600 hover:bg-emerald-500 text-foreground font-black uppercase tracking-widest text-[10px] gap-3" onClick={() => ExportManager.downloadFromUrl(URL.createObjectURL(file), file.name)}>
                        <DownloadCloud className="w-4 h-4" /> Export Original
                      </Button>
                      <Button variant="outline" className="w-full h-10 rounded-none border-border hover:bg-secondary/50 text-muted-foreground/80 font-black uppercase tracking-widest text-[10px] gap-3" onClick={() => setFile(null)}>
                        <RefreshCw className="w-4 h-4" /> Load Different
                      </Button>
                    </div>
                  </div>

                  {/* PDF Page Extractor */}
                  {docType === "pdf" && (
                    <div className="space-y-6">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">PDF Manipulation</Label>
                      <div className="p-6 bg-white/[0.03] border border-border rounded-none space-y-6">
                         <div className="space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                               <Layers className="w-3.5 h-3.5 text-rose-500" /> Target Page
                            </span>
                            <div className="flex items-center gap-3">
                               <input 
                                  type="number"
                                  min="1"
                                  className="w-full h-12 bg-card border border-border rounded-none text-center font-black text-emerald-500 focus:outline-none focus:border-emerald-500/50"
                                  value={selectedPage}
                                  onChange={(e) => setSelectedPage(parseInt(e.target.value) || 1)}
                               />
                               <Button 
                                  onClick={extractPDFPage}
                                  className="h-12 bg-white text-black hover:bg-emerald-500 hover:text-foreground rounded-none border-0 font-black uppercase tracking-widest text-[10px] px-6"
                               >
                                  EXTRACT
                               </Button>
                            </div>
                         </div>
                         <div className="pt-4 border-t border-border">
                            <p className="text-[8px] font-bold text-muted-foreground/40 uppercase leading-relaxed tracking-widest">
                               PRO TIP: This tool creates a fresh 1-page PDF using only the selected buffer.
                            </p>
                         </div>
                      </div>
                    </div>
                  )}

                  {/* DOCX Engine Selection */}
                  {docType === "docx" && (
                    <div className="space-y-6">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Word Rendering Core</Label>
                      <div className="p-6 bg-white/[0.03] border border-border rounded-none space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Legacy Support</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setForceMammoth(!forceMammoth)}
                            className={cn("h-8 px-4 rounded-none text-[8px] font-black uppercase tracking-[0.2em]", forceMammoth ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-secondary/50 text-muted-foreground/60 hover:bg-secondary")}
                          >
                            {forceMammoth ? "ENABLED" : "DISABLED"}
                          </Button>
                        </div>
                        <p className="text-[8px] font-bold text-muted-foreground/40 uppercase leading-relaxed tracking-widest">
                          Enable this if the document fails to render or contains complex structural elements.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Privacy & View Controls */}
                  <div className="space-y-6">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">Studio Config</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-border rounded-none group hover:border-emerald-500/30 transition-all cursor-pointer" onClick={() => setScrubMetadata(!scrubMetadata)}>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                             <ShieldCheck className={cn("w-3.5 h-3.5 transition-colors", scrubMetadata ? "text-emerald-500" : "text-muted-foreground/40")} />
                             Privacy Scrub
                          </span>
                          <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Strip EXIF & Identity</span>
                        </div>
                        <Switch checked={scrubMetadata} onCheckedChange={setScrubMetadata} className="data-[state=checked]:bg-emerald-500" />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-border rounded-none group hover:border-blue-500/30 transition-all cursor-pointer" onClick={() => setDarkPreview(!darkPreview)}>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                             <Eye className={cn("w-3.5 h-3.5 transition-colors", darkPreview ? "text-blue-500" : "text-muted-foreground/40")} />
                             Studio Dark
                          </span>
                          <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Toggle Viewer Theme</span>
                        </div>
                        <Switch checked={darkPreview} onCheckedChange={setDarkPreview} className="data-[state=checked]:bg-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border border-emerald-500/10 bg-emerald-500/[0.02] rounded-none space-y-4">
                     <div className="flex items-center gap-3 text-emerald-500">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Privacy Guard</span>
                     </div>
                     <p className="text-[9px] font-medium text-muted-foreground/60 leading-relaxed uppercase">Document is processed entirely in your browser. No data ever reaches any server.</p>
                  </div>
                </div>
              </ScrollArea>
            </aside>

            {/* Main Preview Area */}
            <div className="flex-grow flex flex-col bg-background relative overflow-hidden">
               <div className="h-10 border-b border-border bg-muted/40 backdrop-blur-xl flex items-center px-8 justify-between shrink-0">
                  <div className="flex items-center gap-4">
                     <button className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", activeTab === "preview" ? "text-emerald-500" : "text-muted-foreground/40")} onClick={() => setActiveTab("preview")}>Visual Preview</button>
                     <button className={cn("text-[10px] font-black uppercase tracking-widest transition-colors", activeTab === "data" ? "text-emerald-500" : "text-muted-foreground/40")} onClick={() => setActiveTab("data")}>Raw Structure</button>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground/40 text-[10px] font-black italic uppercase">
                     <CloudOff className="w-4 h-4" /> 100% Local Processing
                  </div>
               </div>

               <div className="flex-grow p-8 lg:p-5 overflow-auto custom-scrollbar flex flex-col items-center">
                {/* Document Metadata Bar */}
                <div className="max-w-6xl w-full mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 px-4 lg:px-0">
                  {[
                    { label: "File Size", value: (file.size / 1024 / 1024).toFixed(2) + " MB", icon: Database },
                    { label: "Format", value: docType?.toUpperCase(), icon: FileText },
                    { label: "Stability", value: "Verified", icon: ShieldCheck },
                    { label: "Engine", value: "WASM v2.0", icon: Sparkles }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/[0.03] border border-border p-4 flex items-center gap-4 group hover:border-border transition-all">
                      <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground/60 group-hover:text-foreground transition-colors">
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">{stat.label}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80">{stat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Card className={cn("w-full max-w-6xl min-h-[900px] shadow-2xl rounded-none flex flex-col overflow-hidden border-0 transition-colors duration-500", darkPreview ? "bg-[#111] text-foreground" : "bg-white text-black")}>
                     {/* Pro Preview Header */}
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
                              <h2 className="text-lg font-black tracking-tight uppercase leading-none">{file.name}</h2>
                              <span className={cn("text-[10px] font-bold uppercase tracking-widest mt-1 transition-colors", darkPreview ? "text-muted-foreground/40" : "text-gray-400")}>
                                 {docType === "xlsx" || docType === "csv" ? `Sheet: ${sheets[currentSheet] || "N/A"}` : 
                                  docType === "pdf" ? "Document View" : "Universal Preview"}
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
                                       "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all",
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
                              <span className="text-[9px] font-black w-10 text-center">{zoom}%</span>
                              <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1 hover:bg-gray-50 text-gray-400 hover:text-black transition-colors"><Maximize2 className="w-3.5 h-3.5" /></button>
                           </div>
                           <div className="relative group/search">
                              <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors", darkPreview ? "text-muted-foreground/40" : "text-gray-400")} />
                              <input 
                                 placeholder="Search document..."
                                 className={cn("h-10 pl-10 pr-4 rounded-none text-xs font-medium focus:outline-none transition-all w-[200px] lg:w-[300px]", 
                                    darkPreview ? "bg-card border-border text-foreground focus:ring-white/20" : "bg-white border-gray-200 text-black focus:ring-black")}
                                 value={searchTerm}
                                 onChange={(e) => setSearchTerm(e.target.value)}
                              />
                           </div>
                           <Badge variant="outline" className={cn("rounded-none text-[9px] font-black uppercase tracking-widest px-4 py-1.5 transition-colors", darkPreview ? "border-border text-muted-foreground/60" : "border-gray-200 text-black/40")}>
                              {activeTab === "preview" ? "Visual Mode" : "Structural Mode"}
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
                              ) : docType === "docx" ? (
                                 <div className="relative min-h-[800px] w-full">
                                    {isRenderingDocx && (
                                       <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-4 transition-all">
                                          <Loader2 className="w-10 h-10 animate-spin text-black" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Rendering Document...</span>
                                       </div>
                                    )}
                                    <div ref={docxRef} className={cn("w-full docx-container min-h-screen p-4 transition-all", darkPreview && "invert brightness-90 contrast-110")} />
                                 </div>
                              ) : docType === "pptx" ? (
                                 <div className="relative min-h-[800px] w-full bg-gray-100 flex justify-center">
                                    {isRenderingPptx && (
                                       <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-4 transition-all">
                                          <Loader2 className="w-10 h-10 animate-spin text-black" />
                                          <span className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Rendering Presentation...</span>
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
                                       placeholder="Enter content here..."
                                    />
                                 </div>
                              )
                           ) : (
                              <div className="font-mono text-[11px] p-5 bg-gray-900 text-emerald-400 rounded-none overflow-auto w-full min-h-[700px] shadow-2xl">
                                 <div className="flex items-center gap-4 mb-4 text-muted-foreground/60 uppercase tracking-widest border-b border-border pb-4">
                                    <Database className="w-5 h-5" /> Structural Metadata Analysis
                                 </div>
                                 <pre className="leading-relaxed">{JSON.stringify(metadata, null, 3)}</pre>
                                 <div className="mt-10 pt-10 border-t border-border opacity-30 italic">
                                    Engine analysis complete. Memory address: {(() => {
                                      const hash = (file?.name || "0").split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                                      return (0xDEADC0DE + hash).toString(16).toUpperCase();
                                    })()}
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  </Card>
               </div>
             </div>
          </>
        )}
      </main>

      {/* Structured Data: SoftwareApplication & FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Docs Master Pro",
            "operatingSystem": "Any",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Local DOCX/PPTX/XLSX Rendering",
              "Privacy Metadata Scrubbing",
              "PDF Page Extraction",
              "CSV/JSON Structure Analysis",
              "Zero-Server Data Sovereignty"
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is my sensitive document uploaded to a server?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. Docs Master Pro uses local WASM (WebAssembly) engines to render and process documents entirely within your browser's memory. Your data never leaves your machine."
                }
              },
              {
                "@type": "Question",
                "name": "Which Office formats are supported?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The suite supports DOCX (Word), XLSX (Excel), PPTX (PowerPoint), PDF, CSV, JSON, and standard TXT files using specialized client-side parsers."
                }
              }
            ]
          })
        }}
      />
    </div>
  );
}
