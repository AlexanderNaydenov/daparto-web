import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Enables Next.js Draft Mode and Hygraph live preview (DRAFT stage + preview token).
 *
 * Configure in Hygraph Studio → Schema → model → Sidebar → Preview:
 * - API routes are always `/api/...` (not `/de/api/...`). A rewrite also maps
 *   `/:locale(de|en)/api/*` → `/api/*` so mistaken links still work.
 * - Startseite: `https://your-domain.com/api/draft?secret=YOUR_SECRET&redirect=/de`
 * - Ratgeber-Artikel: redirect must include locale + `/ratgeber/` + slug, e.g. English (Hygraph default):
 *   `https://your-domain.com/api/draft?secret=YOUR_SECRET&redirect=/en/ratgeber/{{ urlSlug }}`
 *   German: `...&redirect=/de/ratgeber/{{ urlSlug }}`
 *
 * Requires `HYGRAPH_PREVIEW_SECRET` (or `PREVIEW_SECRET`) and `NEXT_PUBLIC_HYGRAPH_*` for the Preview SDK.
 *
 * @see https://hygraph.com/docs/developer-guides/schema/live-preview
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const redirectPath = searchParams.get("redirect") ?? "/";

  const expected = process.env.HYGRAPH_PREVIEW_SECRET ?? process.env.PREVIEW_SECRET;
  if (!secret || !expected || secret !== expected) {
    return new Response("Invalid or missing secret", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  // Hygraph live preview runs in an iframe; SameSite=None is required for the bypass cookie.
  // @see https://hygraph.com/docs/developer-guides/schema/live-preview#nextjs
  const cookieStore = await cookies();
  const bypass = cookieStore.get("__prerender_bypass");
  if (bypass?.value) {
    const isProd = process.env.NODE_ENV === "production";
    cookieStore.set({
      name: "__prerender_bypass",
      value: bypass.value,
      httpOnly: true,
      path: "/",
      secure: isProd,
      sameSite: "none",
    });
  }

  redirect(redirectPath.startsWith("/") ? redirectPath : `/${redirectPath}`);
}
