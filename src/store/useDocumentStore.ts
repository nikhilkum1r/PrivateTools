import { create } from "zustand";

export type DocumentOperation = "word-to-pdf" | "pdf-to-txt" | "text-tools";

interface DocumentState {
  operation: DocumentOperation;
  file: File | null;
  textContent: string;
  resultBlob: Blob | null;
  status: "idle" | "processing" | "done" | "error";
  errorMessage: string | null;
  setOperation: (op: DocumentOperation) => void;
  setFile: (file: File | null) => void;
  setTextContent: (text: string) => void;
  setResult: (blob: Blob) => void;
  setStatus: (status: DocumentState["status"]) => void;
  setError: (msg: string) => void;
  reset: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  operation: "word-to-pdf",
  file: null,
  textContent: "",
  resultBlob: null,
  status: "idle",
  errorMessage: null,
  setOperation: (operation) => set({ operation, file: null, textContent: "", resultBlob: null, status: "idle" }),
  setFile: (file) => set({ file, resultBlob: null, status: "idle", errorMessage: null }),
  setTextContent: (textContent) => set({ textContent }),
  setResult: (resultBlob) => set({ resultBlob, status: "done" }),
  setStatus: (status) => set({ status }),
  setError: (errorMessage) => set({ errorMessage, status: "error" }),
  reset: () => set({ file: null, textContent: "", resultBlob: null, status: "idle", errorMessage: null }),
}));


