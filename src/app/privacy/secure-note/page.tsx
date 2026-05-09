import { redirect } from "next/navigation";

export default function SecureNoteRedirect() {
  redirect("/privacy/secure-notes");
}
