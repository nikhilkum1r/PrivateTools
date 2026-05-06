import { create } from "zustand";

export type ImageFormat =
  // Standard Raster
  "png" | "jpg" | "jpeg" | "jfif" | "pjpeg" | "pjp" | "webp" | "gif" | "bmp" | "dib" | "rle" | "ico" | "cur" | "svg" | "svgz" |

  // Modern / Advanced Web
  "avif" | "heic" | "heif" | "jxl" | "apng" | "mng" | "flif" |

  // Professional / Publishing
  "psd" | "psb" | "ai" | "eps" | "pdf" | "tiff" | "tif" | "indd" | "indt" | "xcf" | "kra" | "ora" | "afphoto" |

  // RAW Camera Formats
  "raw" | "dng" | "cr2" | "cr3" | "crw" | "nef" | "nrw" | "arw" | "srf" | "sr2" | "orf" | "rw2" | "raf" | "pef" | "erf" | "kdc" | "dcr" | "mos" | "mef" | "mrw" | "x3f" | "3fr" | "fff" | "iiq" | "cap" | "rwl" | "bay" | "cine" |

  // HDR / High Dynamic Range
  "exr" | "hdr" | "rgbe" | "pic" |

  // Scientific / Medical
  "dicom" | "dicomweb" | "fits" | "fts" | "img" | "nii" | "nrrd" |

  // Vector / CAD
  "cdr" | "cmx" | "dwg" | "dxf" | "wmf" | "emf" | "odg" |

  // Game / Graphics / Texture
  "dds" | "tga" | "ktx" | "ktx2" | "basis" | "pvr" | "astc" | "pkm" | "vtf" | "tex" |

  // Animation / Motion
  "webm" | "mp4" | "mov" | "lottie" | "json" |

  // Icon / Cursor
  "icns" |

  // Legacy / Rare
  "pcx" | "iff" | "lbm" | "sgi" | "ras" | "sun" | "xpm" | "xbm" | "pam" | "pbm" | "pgm" | "ppm" | "pnm" | "jp2" | "j2k" | "jpf" | "jpx" | "jpm" | "mj2" |

  // Mobile / Platform Specific
  "thumb" | "aae" | "livephoto" |

  // AI / ML / Dataset
  "npy" | "npz" | "tensor" | "mat" |

  // 3D Texture Related
  "uv" | "texture" | "matcap" |

  // Future / Experimental
  "qoi" | "bpg" | "fpx" | "hdp" | "wdp" |
  
  // Office / Other
  "pptx" | "docx" |

  // --- NEW DOCUMENT SUITE ---
  // Plain Text
  "txt" | "text" | "asc" | "ans" | "log" | "readme" |
  // Rich Text
  "rtf" | "rtfd" |
  // Microsoft Word
  "doc" | "docm" | "dot" | "dotx" | "dotm" | "wbk" |
  // OpenDocument
  "odt" | "ott" | "fodt" |
  // Print / Web Docs
  "xps" | "oxps" | "ps" | "html" | "htm" | "xhtml" | "mhtml" | "mht" |
  // eBook Formats
  "epub" | "mobi" | "azw" | "azw3" | "kfx" | "fb2" | "lit" | "pdb" | "ibooks" | "cbz" | "cbr" |
  // Markdown & Documentation
  "md" | "markdown" | "mdx" | "rst" | "adoc" | "asciidoc" | "tex" | "latex" |
  // XML / Structured
  "xml" | "xsl" | "xslt" | "xsd" | "sgml" | "yaml" | "yml" | "toml" | "ini" | "conf" | "config" |
  // Spreadsheet Documents
  "xls" | "xlsx" | "xlsm" | "xlt" | "xltx" | "xltm" | "csv" | "tsv" | "ods" | "ots" | "fods" | "numbers" |
  // Presentation Documents
  "ppt" | "pptm" | "pot" | "potx" | "pps" | "ppsx" | "odp" | "otp" | "key" |
  // Publisher / Desktop Publishing
  "pub" | "idml" | "qxd" | "sla" |
  // Notes / Knowledge
  "one" | "onetoc2" | "note" | "notebook" |
  // Database / Records
  "db" | "sqlite" | "sqlite3" | "mdb" | "accdb" | "dbf" |
  // Forms / Business
  "xfa" | "fdf" | "xfdf" |
  // Programming / Source
  "js" | "ts" | "jsx" | "tsx" | "py" | "java" | "c" | "cpp" | "h" | "hpp" | "cs" | "go" | "rs" | "php" | "rb" | "swift" | "kt" | "kts" | "scala" | "lua" | "sh" | "bat" | "ps1" |
  // Config / DevOps
  "dockerfile" | "env" | "gitignore" | "editorconfig" | "npmrc" | "yarnrc" |
  // Scientific / Academic
  "bib" | "ris" | "nb" | "ipynb" | "rmd" |
  // Legal / Government
  "ofd" | "p7m" | "xmlsig" |
  // Archive-like Document Packages
  "zipdoc" | "odm" | "sxw" |
  // Apple Ecosystem
  "pages" | "webarchive" |
  // Google Workspace Export Formats
  "gdoc" | "gsheet" | "gslides" |
  // Fax / Scan Documents
  "djvu" | "djv" |
  // Comic / Magazine
  "cbt" | "cb7" |
  // Rare / Legacy
  "wpd" | "wps" | "abw" | "zabw" | "lwp" | "sxw" | "uot" | "sdw" |
  // Future / Experimental
  "qmd" | "typ" | "typst";

export interface BlurRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  processedUrl?: string;
  status: "idle" | "processing" | "completed" | "error";
  progress: number;
  outputSize?: number;
  error?: string;
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  blurs?: BlurRegion[];
}

export interface ImageSettings {
  format: ImageFormat;
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  rotate: number; // 0, 90, 180, 270
  flipX: boolean;
  flipY: boolean;
  brightness: number; // 0-200 (100 is normal)
  contrast: number; // 0-200 (100 is normal)
  saturation: number; // 0-200 (100 is normal)
  filter: "none" | "grayscale" | "sepia" | "invert" | "vivid";
  watermarkText?: string;
  watermarkColor: string;
  watermarkSize: number;
  targetSize?: number; // Target size in KB
}

interface ImageState {
  files: ImageFile[];
  settings: ImageSettings;
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  updateSettings: (settings: Partial<ImageSettings>) => void;
  updateFileSettings: (id: string, settings: Partial<Pick<ImageFile, "crop">>) => void;
  updateFileCrop: (id: string, crop: Partial<ImageFile["crop"] & {}>) => void;
  updateFileBlurs: (id: string, blurs: BlurRegion[]) => void;
  setFileStatus: (id: string, status: ImageFile["status"], progress?: number) => void;
  setProcessedUrl: (id: string, url: string, size: number) => void;
  clearFiles: () => void;
}

export const useImageStore = create<ImageState>((set) => ({
  files: [],
  settings: {
    format: "webp",
    quality: 80,
    rotate: 0,
    flipX: false,
    flipY: false,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    filter: "none",
    watermarkColor: "#ffffff",
    watermarkSize: 24,
  },
  addFiles: (newFiles) =>
    set((state) => ({
      files: [
        ...state.files,
        ...newFiles.map((f) => ({
          id: Math.random().toString(36).substring(7),
          file: f,
          previewUrl: URL.createObjectURL(f),
          status: "idle" as const,
          progress: 0,
        })),
      ],
    })),
  removeFile: (id) =>
    set((state) => {
      const fileToRemove = state.files.find((f) => f.id === id);
      if (fileToRemove) URL.revokeObjectURL(fileToRemove.previewUrl);
      if (fileToRemove?.processedUrl) URL.revokeObjectURL(fileToRemove.processedUrl);
      return { files: state.files.filter((f) => f.id !== id) };
    }),
  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
      files: state.files.map(f => f.status === "completed" ? { ...f, status: "idle" as const } : f)
    })),
  updateFileSettings: (id, settings) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, ...settings, status: "idle" as const } : f
      ),
    })),
  updateFileCrop: (id, crop) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, crop: { x: 0, y: 0, width: 0, height: 0, ...f.crop, ...crop }, status: "idle" as const } : f
      ),
    })),
  updateFileBlurs: (id, blurs) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, blurs, status: "idle" as const } : f
      ),
    })),
  setFileStatus: (id, status, progress = 0) =>
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, status, progress } : f
      ),
    })),
  setProcessedUrl: (id, url, size) =>
    set((state) => ({
      files: state.files.map((f) => {
        if (f.id === id) {
          if (f.processedUrl) URL.revokeObjectURL(f.processedUrl);
          return { ...f, processedUrl: url, outputSize: size, status: "completed" };
        }
        return f;
      }),
    })),
  clearFiles: () =>
    set((state) => {
      state.files.forEach((f) => {
        URL.revokeObjectURL(f.previewUrl);
        if (f.processedUrl) URL.revokeObjectURL(f.processedUrl);
      });
      return { files: [] };
    }),
}));
