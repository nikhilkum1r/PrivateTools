import { redirect } from "next/navigation";

export default async function OldQRPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect("/tools/qr-generator");
}
