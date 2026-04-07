import { draftMode } from "next/headers";

export const HYGRAPH_CACHE_TAG = "hygraph";

const DEFAULT_REVALIDATE = 60;

export type HygraphResponse<T> =
  | { data: T; errors?: undefined }
  | { data?: T; errors: { message: string }[] };

function resolveToken(isDraft: boolean): string | undefined {
  if (isDraft) {
    return process.env.HYGRAPH_PREVIEW_TOKEN ?? process.env.HYGRAPH_API_TOKEN;
  }
  return process.env.HYGRAPH_PRODUCTION ?? process.env.HYGRAPH_API_TOKEN;
}

export async function hygraphFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidateSeconds: number = DEFAULT_REVALIDATE
): Promise<HygraphResponse<T>> {
  const endpoint = process.env.HYGRAPH_ENDPOINT;
  if (!endpoint) {
    return {
      errors: [{ message: "HYGRAPH_ENDPOINT is not configured." }],
    };
  }

  const { isEnabled: isDraft } = await draftMode();
  const token = resolveToken(isDraft);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    // Same queries for prod/preview; stage is controlled by header + token permissions.
    "gcms-stage": isDraft ? "DRAFT" : "PUBLISHED",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      ...(isDraft
        ? { cache: "no-store" }
        : { next: { revalidate: revalidateSeconds, tags: [HYGRAPH_CACHE_TAG] } }),
    });

    const json = (await res.json()) as HygraphResponse<T>;

    if (!res.ok) {
      const msg =
        "errors" in json && Array.isArray(json.errors) && json.errors[0]?.message
          ? json.errors[0].message
          : `Hygraph HTTP ${res.status}: ${JSON.stringify(json)}`;
      return { errors: [{ message: msg }] };
    }

    if ("errors" in json && json.errors?.length && json.data == null) {
      return {
        errors: json.errors,
      };
    }

    return json;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown fetch error";
    return { errors: [{ message }] };
  }
}
