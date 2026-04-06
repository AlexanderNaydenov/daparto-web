const DEFAULT_REVALIDATE = 60;

export type HygraphResponse<T> =
  | { data: T; errors?: undefined }
  | { data?: T; errors: { message: string }[] };

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

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = process.env.HYGRAPH_API_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      next: { revalidate: revalidateSeconds },
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
