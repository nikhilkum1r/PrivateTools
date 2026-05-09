import ContactClient from "./ContactClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | SafeTools Support & Inquiry",
  description: "Reach out to the SafeTools team. Whether you have feature requests, architectural questions, or security concerns, we're here to help.",
  keywords: "contact safetools, privacy tools support, technical inquiry, feature request, security audit contact",
  openGraph: {
    title: "Contact Us | SafeTools Support & Inquiry",
    description: "Reach out to the SafeTools team. Whether you have feature requests, architectural questions, or security concerns, we're here to help.",
    type: "website",
    url: "https://safetools.space/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | SafeTools Support & Inquiry",
    description: "Reach out to the SafeTools team. Whether you have feature requests, architectural questions, or security concerns, we're here to help.",
    images: ["/og-image.webp"],
  },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}
