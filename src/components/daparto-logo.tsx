import Image from "next/image";
import Link from "next/link";
import type { AppLocale } from "@/i18n/config";
import { withLocale } from "@/i18n/navigation";

export function DapartoLogo({ className = "", locale }: { className?: string; locale: AppLocale }) {
  return (
    <Link href={withLocale(locale, "/")} className={`inline-flex shrink-0 items-center ${className}`}>
      <Image
        src="/daparto-logo.svg"
        alt="Daparto"
        width={220}
        height={38}
        priority
        unoptimized
        className="h-8 w-auto max-w-[200px] sm:h-9 sm:max-w-[240px]"
      />
    </Link>
  );
}
