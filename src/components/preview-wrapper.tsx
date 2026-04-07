"use client";

import dynamic from "next/dynamic";
import { useCallback } from "react";

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
 * We use a full document reload on save instead of router.refresh(): in the Studio
 * sidebar iframe, router.refresh() often does not refetch RSC/fetch the same way a
 * new tab does, so draft content stayed stale until a full navigation.
 * @see https://hygraph.com/docs/developer-guides/schema/click-to-edit-next-js
 */
export function PreviewWrapper({ children }: { children: React.ReactNode }) {
  const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT?.trim();
  const studioRaw = process.env.NEXT_PUBLIC_HYGRAPH_STUDIO_URL?.trim();
  const studioUrl = normalizeStudioUrl(studioRaw || "https://app.hygraph.com");

  const hardRefresh = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  if (!endpoint) {
    return <>{children}</>;
  }

  return (
    <HygraphPreviewNextjs
      endpoint={endpoint}
      studioUrl={studioUrl}
      refresh={hardRefresh}
      debug={process.env.NODE_ENV === "development"}
      mode="auto"
      sync={{ fieldFocus: true, fieldUpdate: true }}
      overlay={{
        style: { borderColor: "var(--brand-orange)", borderWidth: "2px" },
        button: { backgroundColor: "var(--brand-orange)", color: "white" },
      }}
    >
      {children}
    </HygraphPreviewNextjs>
  );
}
