import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Enables Next.js Draft Mode and Hygraph live preview (DRAFT stage + preview token).
 * Configure in Hygraph Studio → Schema → model → Sidebar → Preview widget, e.g.:
 * https://your-domain.com/api/draft?secret=YOUR_SECRET&redirect=/
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
