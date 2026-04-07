import { hygraphFetch } from "@/lib/hygraph";
import { BANNER_QUERY } from "@/lib/queries";
import Link from "next/link";

type BannerData = {
  banners: {
    id: string;
    text: string;
    linkLabel?: string | null;
    linkUrl?: string | null;
  }[];
};

export async function SiteTopBanner() {
  const res = await hygraphFetch<BannerData>(BANNER_QUERY);
  const banner = res.data?.banners?.[0];
  if (res.errors?.length || !banner?.text) {
    return null;
  }

  const hasLink = banner.linkLabel && banner.linkUrl;

  return (
    <div className="relative z-[60] border-b border-white/10 bg-[var(--brand-primary)] text-center text-sm text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2.5 sm:px-6">
        <span className="leading-snug">{banner.text}</span>
        {hasLink ? (
          <>
            <span className="hidden text-white/50 sm:inline" aria-hidden>
              |
            </span>
            <Link
              href={banner.linkUrl!}
              className="font-semibold text-[var(--brand-accent)] underline decoration-[var(--brand-accent)] underline-offset-2 transition hover:text-white"
            >
              {banner.linkLabel}
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
}
