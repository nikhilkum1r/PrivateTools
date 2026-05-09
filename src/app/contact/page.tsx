import ContactClient from "./ContactClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | SafeTools Support & Inquiry",
  description: "Reach out to the SafeTools team. Whether you have feature requests, architectural questions, or security concerns, we're here to help.",
  keywords: "contact safetools, privacy tools support, technical inquiry, feature request, security audit contact",
};

export default function ContactPage() {
  return <ContactClient />;
}
