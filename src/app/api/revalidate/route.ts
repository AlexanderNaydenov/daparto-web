import { HYGRAPH_CACHE_TAG } from "@/lib/hygraph";
import { revalidateTag } from "next/cache";

function isAuthorized(request: Request): boolean {
  const expected = process.env.REVALIDATE_SECRET ?? process.env.HYGRAPH_REVALIDATE_SECRET;
  if (!expected) {
    return false;
  }

  const url = new URL(request.url);
  if (url.searchParams.get("secret") === expected) {
    return true;
  }

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${expected}`) {
    return true;
  }

  if (request.headers.get("x-webhook-secret") === expected) {
    return true;
  }

  return false;
}

/**
 * On-demand ISR: call when Hygraph content changes so tagged fetches refresh without a full deploy.
 * Configure in Hygraph: Project settings → Webhooks → POST URL, e.g.
 *   https://your-domain.com/api/revalidate?secret=YOUR_REVALIDATE_SECRET
 * or set header `x-webhook-secret` / `Authorization: Bearer …` to the same value.
 */
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(HYGRAPH_CACHE_TAG, "max");

  return Response.json({
    ok: true,
    revalidated: HYGRAPH_CACHE_TAG,
    at: Date.now(),
  });
}

/** Allow simple GET tests (same auth). */
export async function GET(request: Request) {
  return POST(request);
}
