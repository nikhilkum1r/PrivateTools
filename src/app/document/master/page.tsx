import DocsMasterClient from "./DocsMasterClient";

export const metadata = {
  title: "Docs Master | PrivateTools Studio",
  description: "Universal document processor for PDF, DOCX, XLSX, PPTX, and CSV. View and edit documents privately in your browser.",
};

export default function DocsMasterPage() {
  return <DocsMasterClient />;
}
