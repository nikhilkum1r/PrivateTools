"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import Script from "next/script";
import { Navbar } from "@/components/shared/Navbar";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { renderAsync } from "docx-preview";
import mammoth from "mammoth";
import JSZip from "jszip";
import initPptx, { convert as convertPptx } from "@briank-dev/pptx2html-turbo";
import { PDFDocument } from "pdf-lib";

// Modular Components
import { DocsMasterHero } from "./components/DocsMasterHero";
import { DocsMasterEditor } from "./components/DocsMasterEditor";

import { AdUnit } from "@/components/shared/AdUnit";

type DocType = "pdf" | "docx" | "xlsx" | "pptx" | "csv" | "txt" | "json" | "xml" | "html" | "md" | "rtf" | "odt" | "ods" | "odp" | "doc" | "xls" | "ppt";

export default function DocsMasterClient() {
  const t = useTranslations("docsMaster");
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
    if ((docType === "docx" || docType === "odt" || docType === "doc") && file && docxRef.current) {
      const renderDocx = async () => {
        setIsRenderingDocx(true);
        try {
          const arrayBuffer = await file.arrayBuffer();
          if (docxRef.current) {
            docxRef.current.innerHTML = "";
            if (forceMammoth) throw new Error("Manual Fallback Requested");

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
                  <div class="mb-4 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-800 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-3">
                    <span class="text-xl">ℹ️</span> ${t("viewer.fallback.active")}
                  </div>
                  <div class="prose prose-sm max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight">
                    ${result.value}
                  </div>
                </div>
              `;
            }
            toast.info(t("viewer.fallback.switch"));
          } catch (fallbackErr) {
            console.error("Secondary Engine Failure:", fallbackErr);
            if (docxRef.current) {
              docxRef.current.innerHTML = `<div class="p-5 text-red-500 font-semibold uppercase tracking-wider text-center border-2 border-dashed border-red-500/20">
                <div class="mb-4 text-2xl">⚠️</div>
                ${t("viewer.fallback.failure")}
              </div>`;
            }
            toast.error(t("viewer.fallback.totalFailure"));
          }
        } finally {
          setIsRenderingDocx(false);
        }
      };
      renderDocx();
    }
  }, [file, docType, forceMammoth, t]);

  useEffect(() => {
    if ((docType === "pptx" || docType === "odp" || docType === "ppt") && file && pptxRef.current) {
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
            pptxRef.current.innerHTML = `<div class="p-5 text-red-500 font-semibold uppercase tracking-wider text-center border-2 border-dashed border-red-500/20">
              <div class="mb-4 text-2xl">⚠️</div>
              ${t("viewer.pptxFailure")}
            </div>`;
          }
          toast.error(t("viewer.pptxTotalFailure"));
        } finally {
          setIsRenderingPptx(false);
        }
      };
      renderPptx();
    }
  }, [file, docType, t]);

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
        toast.success(t("viewer.initialized", { type: ext.toUpperCase() }));
      } catch (err) {
        console.error(err);
        toast.error("Failed to parse document");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const parseFile = async (f: File, type: DocType) => {
    if (type === "xlsx" || type === "csv" || type === "ods") {
      const data = await f.arrayBuffer();
      const wb = XLSX.read(data);
      setWorkbook(wb);
      setSheets(wb.SheetNames);
      loadSheet(wb, 0);
      setMetadata({
        sheets: wb.SheetNames.length,
        created: wb.Props?.CreatedDate?.toString() || "Unknown"
      });
    } else if (type === "pptx" || type === "odp" || type === "ppt") {
      try {
        const zip = await JSZip.loadAsync(f);
        let extractedText = "";
        const slideRegex = /ppt\/slides\/slide\d+\.xml/;
        let slideCount = 0;
        for (const filename of Object.keys(zip.files)) {
          if (slideRegex.test(filename)) {
            slideCount++;
            const content = await zip.files[filename].async("string");
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
    } else if (type === "txt" || type === "json" || type === "md" || type === "xml" || type === "html" || type === "rtf") {
      const text = await f.text();
      setPreviewContent(type === "json" ? JSON.parse(text) : text);
      setMetadata({ size: f.size, lastModified: new Date(f.lastModified).toLocaleString() });
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
      newWb.Props = { Author: "SafeTools User", Title: "Secured Document", CreatedDate: new Date() };
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

  const resetTool = () => {
    setFile(null);
    setDocType(null);
    setPreviewContent(null);
    setMetadata({});
  };

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-background text-foreground overflow-y-auto lg:overflow-hidden selection:bg-primary/30 custom-scrollbar">
      <Navbar />
      <main id="main-content" className="flex-grow flex flex-col lg:flex-row overflow-visible lg:overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-blue-500/5 blur-[140px] rounded-full animate-pulse" />
        </div>

        {!file ? (
          <DocsMasterHero t={t} handleFileDrop={handleFileDrop} />
        ) : (
          <DocsMasterEditor 
            t={t}
            file={file}
            docType={docType}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            previewContent={previewContent}
            setPreviewContent={setPreviewContent}
            metadata={metadata}
            sheets={sheets}
            currentSheet={currentSheet}
            workbook={workbook}
            loadSheet={loadSheet}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            scrubMetadata={scrubMetadata}
            setScrubMetadata={setScrubMetadata}
            darkPreview={darkPreview}
            setDarkPreview={setDarkPreview}
            zoom={zoom}
            setZoom={setZoom}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            isRenderingDocx={isRenderingDocx}
            isRenderingPptx={isRenderingPptx}
            forceMammoth={forceMammoth}
            setForceMammoth={setForceMammoth}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            docxRef={docxRef}
            pptxRef={pptxRef}
            handleCellChange={handleCellChange}
            exportSpreadsheet={exportSpreadsheet}
            exportText={exportText}
            extractPDFPage={extractPDFPage}
            resetTool={resetTool}
          />
        )}
      </main>

      <Script
        id="docs-master-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Docs Master Pro",
            "operatingSystem": "Any",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "featureList": ["Local DOCX/PPTX/XLSX Rendering", "Privacy Metadata Scrubbing", "PDF Page Extraction", "CSV/JSON Structure Analysis", "Zero-Server Data Sovereignty"]
          })
        }}
      />
      <Script
        id="docs-master-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is my sensitive document uploaded to a server?",
                "acceptedAnswer": { "@type": "Answer", "text": "No. Docs Master Pro uses local WASM (WebAssembly) engines to render and process documents entirely within your browser's memory. Your data never leaves your machine." }
              },
              {
                "@type": "Question",
                "name": "Which Office formats are supported?",
                "acceptedAnswer": { "@type": "Answer", "text": "The suite supports DOCX (Word), XLSX (Excel), PPTX (PowerPoint), PDF, CSV, JSON, and standard TXT files using specialized client-side parsers." }
              }
            ]
          })
        }}
      />
    </div>
  );
}
