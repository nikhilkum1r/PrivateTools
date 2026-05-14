'use client';

/**
 * StudioSkeleton
 * 
 * Lightweight loading skeleton for tool studio pages.
 * Used as the Suspense fallback for heavy tool clients (FFmpeg, ONNX, Tesseract).
 * Prevents layout shift and gives users immediate visual feedback on slow connections.
 */
export default function StudioSkeleton() {
  return (
    <div className="flex flex-col min-h-screen animate-pulse" aria-busy="true" aria-label="Loading tool…">
      {/* Hero skeleton */}
      <section className="px-6 py-16 flex flex-col items-center gap-4">
        <div className="h-8 w-48 rounded-lg bg-muted/40" />
        <div className="h-4 w-72 rounded-md bg-muted/30" />
        <div className="h-4 w-56 rounded-md bg-muted/20" />
      </section>

      {/* Drop zone skeleton */}
      <section className="mx-auto w-full max-w-3xl px-6 mb-8">
        <div className="h-48 w-full rounded-2xl border-2 border-dashed border-muted/30 bg-muted/10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted/30" />
            <div className="h-3 w-36 rounded bg-muted/25" />
            <div className="h-3 w-24 rounded bg-muted/20" />
          </div>
        </div>
      </section>

      {/* Controls skeleton */}
      <section className="mx-auto w-full max-w-3xl px-6 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-muted/20" />
          ))}
        </div>
      </section>

      {/* Output area skeleton */}
      <section className="mx-auto w-full max-w-3xl px-6">
        <div className="h-32 w-full rounded-2xl bg-muted/15" />
      </section>
    </div>
  );
}
