import { create } from "zustand";

export type PrivacyTool =
  | "metadata-viewer"
  | "metadata-remover"
  | "metadata-injector"
  | "file-locker"
  | "secure-note"
  | "steganography"
  | "password-checker"
  | "file-shredder";

interface PrivacyState {
  activeTool: PrivacyTool;
  file: File | null;
  resultBlob: Blob | null;
  status: "idle" | "processing" | "done" | "error";
  progress: number;
  errorMessage: string | null;
  setActiveTool: (tool: PrivacyTool) => void;
  setFile: (file: File | null) => void;
  setResult: (blob: Blob) => void;
  setStatus: (status: PrivacyState["status"]) => void;
  setProgress: (pct: number) => void;
  setError: (msg: string) => void;
  reset: () => void;
}

export const usePrivacyStore = create<PrivacyState>((set) => ({
  activeTool: "metadata-viewer",
  file: null,
  resultBlob: null,
  status: "idle",
  progress: 0,
  errorMessage: null,
  setActiveTool: (activeTool) => set({ activeTool, file: null, resultBlob: null, status: "idle", errorMessage: null }),
  setFile: (file) => set({ file, resultBlob: null, status: "idle", errorMessage: null }),
  setResult: (resultBlob) => set({ resultBlob, status: "done", progress: 100 }),
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
  setError: (errorMessage) => set({ errorMessage, status: "error" }),
  reset: () => set({ file: null, resultBlob: null, status: "idle", progress: 0, errorMessage: null }),
}));
