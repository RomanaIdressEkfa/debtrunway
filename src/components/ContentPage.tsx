import type { ReactNode } from "react";
import { CornerMotif } from "./Ornament";

interface Props {
  heading: string;
  intro: string;
  children: ReactNode;
}

/**
 * The shell for the pages that are only prose — about, privacy, terms,
 * contact. Same hero band as the calculators, so the site does not change
 * shape when a reader steps off a tool page, with the text below held to a
 * reading measure and centred: there is no tool competing for the width here,
 * so an even margin either side reads as a page rather than a gap.
 */
export default function ContentPage({ heading, intro, children }: Props) {
  return (
    <>
      <div className="band-emerald relative isolate overflow-hidden">
        <div className="band-grid islamic-grid" aria-hidden />
        <div className="hero-wash" aria-hidden />
        <CornerMotif className="top-0 right-0 h-40 w-40 text-white/45 sm:h-56 sm:w-56" />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <header className="animate-rise grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-14">
            <h1 className="text-4xl leading-[1.03] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {heading}
            </h1>
            <p className="text-base leading-relaxed text-muted sm:text-lg lg:pb-1.5">
              {intro}
            </p>
          </header>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {children}
      </div>
    </>
  );
}
