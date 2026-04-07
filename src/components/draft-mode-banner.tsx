import { draftMode } from "next/headers";
import Link from "next/link";

export async function DraftModeBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) {
    return null;
  }

  return (
    <div className="relative z-[70] border-b border-amber-700/30 bg-amber-100 px-4 py-2 text-center text-sm text-amber-950">
      <span className="font-semibold">Entwurfsvorschau</span>
      <span className="mx-2 text-amber-800/80">—</span>
      <span className="text-amber-900">Sie sehen unveröffentlichte Inhalte aus Hygraph.</span>
      <Link
        href="/api/draft/disable?redirect=/"
        className="ml-3 font-semibold text-amber-900 underline decoration-amber-700 underline-offset-2 hover:text-amber-950"
      >
        Vorschau beenden
      </Link>
    </div>
  );
}
