import { create } from "zustand";

export interface PdfFile {
  id: string;
  file: File;
  pageCount?: number;
  status: "idle" | "processing" | "completed" | "error";
  progress: number;
}

interface PdfState {
  files: PdfFile[];
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  setFileStatus: (id: string, status: PdfFile["status"], progress?: number) => void;
  clearFiles: () => void;
}

export const usePdfStore = create<PdfState>((set) => ({
  files: [],
  addFiles: (newFiles) =>
    set((state) => ({
      files: [
        ...state.files,
        ...newFiles.map((f) => ({
          id: Math.random().toString(36).substring(7),
          file: f,
          status: "idle" as const,
          progress: 0,
        })),
      ],
    })),
  removeFile: (id) =>
    set((state) => ({ files: state.files.filter((f) => f.id !== id) })),
  setFileStatus: (id, status, progress = 0) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, status, progress } : f
      ),
    })),
  clearFiles: () => set({ files: [] }),
}));
