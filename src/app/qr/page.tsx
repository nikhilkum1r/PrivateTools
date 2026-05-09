import { redirect } from "next/navigation";

export default function OldQRPage() {
  redirect("/tools/qr-generator");
}
