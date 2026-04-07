"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const HygraphPreviewNextjs = dynamic(
  () =>
    import("@hygraph/preview-sdk/react").then((mod) => ({ default: mod.HygraphPreviewNextjs })),
  { ssr: false }
);

function normalizeStudioUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Hygraph Preview SDK: click-to-edit overlays + save → refresh.
 * @see https://hygraph.com/docs/developer-guides/schema/click-to-edit-next-js
 */
export function PreviewWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT?.trim();
  const studioRaw = process.env.NEXT_PUBLIC_HYGRAPH_STUDIO_URL?.trim();
  const studioUrl = normalizeStudioUrl(studioRaw || "https://app.hygraph.com");

  if (!endpoint) {
    return <>{children}</>;
  }

  return (
    <HygraphPreviewNextjs
      endpoint={endpoint}
      studioUrl={studioUrl}
      refresh={() => router.refresh()}
      debug={process.env.NODE_ENV === "development"}
      mode="auto"
      sync={{ fieldFocus: true, fieldUpdate: false }}
      overlay={{
        style: { borderColor: "var(--brand-orange)", borderWidth: "2px" },
        button: { backgroundColor: "var(--brand-orange)", color: "white" },
      }}
    >
      {children}
    </HygraphPreviewNextjs>
  );
}
