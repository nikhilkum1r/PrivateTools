import { Metadata } from "next";
import ImageHubClient from "./ImageHubClient";
import SEOStructuredData from "@/components/shared/SEOStructuredData";

export const metadata: Metadata = {
  title: "Professional Image Processing Suite - Free & Private | SafeTools",
  description: "A comprehensive suite of local image tools. Compress, convert, edit, and analyze images with 100% privacy and zero server uploads.",
  keywords: ["image tools online", "private image processing", "image compressor hub", "image converter suite", "online photo editor hub", "secure image tools"],
  openGraph: {
    title: "SafeTools Image Studio | Universal Visual Intelligence",
    description: "The ultimate local-first image processing suite. Fast, private, and powerful.",
    type: "website",
    url: "https://safetools.space/image",
  },
};

export default function ImagePage() {
  return (
    <>
      <SEOStructuredData 
        name="Image Processing Suite"
        description="A comprehensive suite of professional image tools including compression, conversion, and editing, all running locally in your browser."
        url="https://safetools.space/image"
      />
      <ImageHubClient />

      {/* SEO Content Section */}
      <section className="container mx-auto px-4 py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic">Next-Gen Image Processing</h2>
            <p className="text-muted-foreground leading-relaxed">
              SafeTools Image Studio is a suite of professional visual utilities designed for the privacy-conscious 
              creative. By leveraging the Web Canvas API and hardware-accelerated GPU processing directly in your 
              browser, we provide a lightning-fast experience without the need for cloud-based rendering or 
              privacy-invasive server uploads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Will image quality be preserved?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes. Our conversion and compression engines are tuned for high-fidelity output. 
                Whether you're converting RAW files to WebP or compressing high-resolution JPEGs, 
                our algorithms ensure minimal perceptual loss while maximizing storage efficiency.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Can I process images in bulk?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                SafeTools supports high-speed batch processing. You can drop hundreds of images into 
                our tools, and our local processing engine will synthesize them in parallel, 
                utilizing your device's multi-core CPU and GPU.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
