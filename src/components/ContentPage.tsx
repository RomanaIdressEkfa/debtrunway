import type { ReactNode } from "react";
import { BandCurve, CornerMotif } from "./Ornament";

interface Props {
  heading: string;
  intro: string;
  children: ReactNode;
  /**
   * Let the content fill the shell instead of sitting in a reading measure.
   *
   * For a page of panels and cards rather than running text — the support
   * page. Widening the shell to 1500px left those pages as a 768px column
   * with half the screen empty beside it, because the measure that protects
   * a paragraph strangles a grid.
   */
  wide?: boolean;
}

/**
 * The shell for the pages that are only prose — about, privacy, terms,
 * contact. Same hero band as the calculators, so the site does not change
 * shape when a reader steps off a tool page, with the text below held to a
 * reading measure and centred: there is no tool competing for the width here,
 * so an even margin either side reads as a page rather than a gap.
 */
export default function ContentPage({ heading, intro, children, wide }: Props) {
  return (
    <>
      <div className="band-emerald relative isolate overflow-hidden">
        <div className="band-grid islamic-grid" aria-hidden />
        <div className="hero-wash" aria-hidden />
        <CornerMotif className="top-0 right-0 h-40 w-40 text-white/45 sm:h-56 sm:w-56" />
        <BandCurve />
        <div className="shell px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24">
          <header className="animate-rise grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-14">
            <h1 className="display text-4xl text-balance sm:text-5xl lg:text-6xl">
              {heading}
            </h1>
            <p className="text-base leading-relaxed text-muted sm:text-lg lg:pb-1.5">
              {intro}
            </p>
          </header>
        </div>
      </div>

      {/* The container matches every other page via .shell, so the prose
          starts at the same left edge as the title in the band above it — the
          narrower container made these pages look like a different site.

          The measure itself stays narrow, on the article rather than the
          container. Sixty to seventy-five characters is where a line stops
          being comfortable to read, and a full six-column width of running
          text is well past it. Aligning the page and holding the measure are
          two different jobs, and they were being done by one element. */}
      <div className="shell px-4 pt-7 pb-10 sm:px-6 sm:pt-9 sm:pb-14">
        <article className={wide ? "" : "max-w-3xl"}>{children}</article>
      </div>
    </>
  );
}
