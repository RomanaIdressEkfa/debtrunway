"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { BN_UI } from "@/lib/bn";
import { localeOf } from "@/lib/i18n";

/**
 * The logo, linking to the homepage in the language you are reading.
 *
 * It was a plain link to "/" in the layout, which meant the one control every
 * visitor knows — click the logo to start over — took a Bengali reader out of
 * Bengali. The layout is a server component and cannot see the path, so the
 * link is its own client component rather than making the whole shell one.
 *
 * The Bengali word comes from BN_UI rather than sitting in the string here,
 * because check-i18n.ts holds every shared component to that rule — and this
 * file is the reason to keep holding them to it, since it broke the rule
 * within an hour of the rule being written.
 */
export default function HomeLink({ size = 28 }: { size?: number }) {
  const bn = localeOf(usePathname() ?? "/") === "bn";
  return (
    <Link
      href={bn ? "/bn" : "/"}
      aria-label={bn ? `DebtRunway ${BN_UI.home}` : "DebtRunway home"}
      className="transition-opacity hover:opacity-70"
    >
      <Logo size={size} />
    </Link>
  );
}
