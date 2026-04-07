import { draftMode } from "next/headers";
import { defaultLocale, graphLocalesForUi, type AppLocale } from "@/i18n/config";

export const HYGRAPH_CACHE_TAG = "hygraph";

const DEFAULT_REVALIDATE = 60;

export type HygraphResponse<T> =
  | { data: T; errors?: undefined }
  | { data?: T; errors: { message: string }[] };

/** Non-empty env value (Vercel may define a var as empty string, which would block ?? fallback). */
function envFirst(...keys: string[]): string | undefined {
  for (const key of keys) {
    const v = process.env[key];
    if (typeof v === "string" && v.trim().length > 0) {
      return v.trim();
    }
  }
  return undefined;
}

function resolveToken(isDraft: boolean): string | undefined {
  if (isDraft) {
    return envFirst("HYGRAPH_PREVIEW_TOKEN", "HYGRAPH_API_TOKEN");
  }
  return envFirst("HYGRAPH_PRODUCTION", "HYGRAPH_API_TOKEN");
}

function notAllowedHint(message: string): string {
  const m = message.toLowerCase();
  if (!m.includes("not allowed")) {
    return message;
  }
  return `${message} — In Hygraph: Project settings → API Access → Permanent Auth Tokens → open your token → ensure “Content API” read access and permission to query the PUBLISHED stage (and all models this app uses). If the token’s default stage is DRAFT, add read access for PUBLISHED or use a dedicated production token.`;
}

export type HygraphFetchOptions = {
  revalidateSeconds?: number;
  /** UI locale; forwarded as GraphQL `locales` with fallback (de↔en). */
  locale?: AppLocale;
};

export async function hygraphFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  revalidateSecondsOrOptions: number | HygraphFetchOptions = DEFAULT_REVALIDATE
): Promise<HygraphResponse<T>> {
  const options: HygraphFetchOptions =
    typeof revalidateSecondsOrOptions === "number"
      ? { revalidateSeconds: revalidateSecondsOrOptions }
      : revalidateSecondsOrOptions;
  const revalidateSeconds = options.revalidateSeconds ?? DEFAULT_REVALIDATE;
  const locale = options.locale ?? defaultLocale;
  const mergedVariables = {
    ...(variables ?? {}),
    locales: graphLocalesForUi(locale),
  };
  const endpoint = process.env.HYGRAPH_ENDPOINT;
  if (!endpoint) {
    return {
      errors: [{ message: "HYGRAPH_ENDPOINT is not configured." }],
    };
  }

  const { isEnabled: isDraft } = await draftMode();
  const token = resolveToken(isDraft);

  if (!token) {
    return {
      errors: [
        {
          message:
            "No Hygraph token configured. Set HYGRAPH_PRODUCTION (published) and/or HYGRAPH_PREVIEW_TOKEN (draft preview), or HYGRAPH_API_TOKEN as a single read token.",
        },
      ],
    };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Rely on gcms-stage so prod vs preview matches the app; PAT must allow that stage.
  headers["gcms-stage"] = isDraft ? "DRAFT" : "PUBLISHED";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables: mergedVariables }),
      ...(isDraft
        ? { cache: "no-store" }
        : { next: { revalidate: revalidateSeconds, tags: [HYGRAPH_CACHE_TAG] } }),
    });

    const json = (await res.json()) as HygraphResponse<T>;

    if (!res.ok) {
      const raw =
        "errors" in json && Array.isArray(json.errors) && json.errors[0]?.message
          ? json.errors[0].message
          : `Hygraph HTTP ${res.status}: ${JSON.stringify(json)}`;
      return { errors: [{ message: notAllowedHint(raw) }] };
    }

    if ("errors" in json && json.errors?.length && json.data == null) {
      const first = json.errors[0]?.message ?? "GraphQL error";
      return {
        errors: [{ message: notAllowedHint(first) }],
      };
    }

    return json;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown fetch error";
    return { errors: [{ message }] };
  }
}
