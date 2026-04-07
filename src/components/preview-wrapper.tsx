"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { startTransition, useCallback, useEffect, useRef } from "react";

const HygraphPreviewNextjs = dynamic(
  () =>
    import("@hygraph/preview-sdk/react").then((mod) => ({ default: mod.HygraphPreviewNextjs })),
  { ssr: false }
);

/** Wait for Hygraph to persist DRAFT before refetching; instant reload often races the API. */
const SAVE_REFRESH_DELAY_MS = 700;

function normalizeStudioUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Hygraph Preview SDK: click-to-edit overlays + save → refresh.
 * We delay then call router.refresh() (not location.reload):
 * - Immediate reload can fetch before Hygraph has committed the draft → content “reverts” in the iframe.
 * - Full reload resets scroll; Studio may then field-focus and scrollIntoView, jumping the pane.
 * router.refresh() keeps the document session (draft mode) and typically preserves scroll.
 * @see https://hygraph.com/docs/developer-guides/schema/click-to-edit-next-js
 */
export function PreviewWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const saveRefreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveRefreshTimerRef.current) {
        clearTimeout(saveRefreshTimerRef.current);
      }
    };
  }, []);

  const refreshAfterSave = useCallback(() => {
    if (typeof window === "undefined") return;
    if (saveRefreshTimerRef.current) {
      clearTimeout(saveRefreshTimerRef.current);
    }
    saveRefreshTimerRef.current = setTimeout(() => {
      saveRefreshTimerRef.current = null;
      startTransition(() => {
        router.refresh();
      });
    }, SAVE_REFRESH_DELAY_MS);
  }, [router]);

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
      refresh={refreshAfterSave}
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
