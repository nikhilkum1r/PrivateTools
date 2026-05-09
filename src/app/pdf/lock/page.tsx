import { redirect } from "next/navigation";

export default function LockPdfRedirect() {
  redirect("/pdf/protect-pdf");
}
