import AboutClient from "./AboutClient";

export const metadata = {
  title: "About SafeTools — The Privacy-First Manifesto",
  description: "Learn about the mission, technology, and zero-server architecture behind SafeTools. Why browser-based processing is the future of data privacy.",
  keywords: ["privacy manifesto", "zero-server architecture", "private computing", "wasm file processing", "secure file tools", "about safetools"],
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
