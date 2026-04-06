import Link from "next/link";

/** Wordmark inspired by marketplace B2B styling — not the official trademark asset. */
export function DapartoLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-baseline gap-0.5 ${className}`}>
      <span className="font-[family-name:var(--font-barlow-condensed)] text-2xl font-bold tracking-tight text-[var(--brand-ink)] sm:text-3xl">
        dapa
        <span className="text-[var(--brand-orange)]">rto</span>
      </span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-[3px] w-8 translate-y-[-2px] rounded-sm bg-[var(--brand-orange)] transition-transform group-hover:scale-x-110"
      />
    </Link>
  );
}
