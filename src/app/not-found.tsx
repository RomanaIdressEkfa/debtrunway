import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import NotFoundBody, {
  NotFoundHeading,
  NotFoundIntro,
} from "@/components/NotFoundBody";

/**
 * There was no not-found page, so Next served its default — which inherited
 * the layout's metadata and shipped the homepage's title and description on a
 * URL that says nothing was found. Two problems came out of that.
 *
 * The first is that /_not-found/ is a real, crawlable, 200-status URL in a
 * static export. It was a second copy of the homepage's metadata sitting at
 * an address nobody would want indexed, so it carries noindex now.
 *
 * The second is that a person who lands here from a stale link was being
 * shown nothing useful. A dead end on a site of fourteen tools should offer
 * the tools.
 *
 * The third, found later: it offered them only in English. A static export
 * renders this page once and the host serves that one file for every address
 * that does not exist, /bn included — so the language cannot be known here and
 * the body reads the path in the browser instead. The shipped HTML is the
 * English one, which is the right default for the crawler that sees it and
 * the noindex it carries.
 */
export const metadata: Metadata = {
  title: { absolute: "Page not found | DebtRunway" },
  description:
    "That page does not exist. Every calculator and answer on DebtRunway is listed here.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <ContentPage heading={<NotFoundHeading />} intro={<NotFoundIntro />}>
      <NotFoundBody />
    </ContentPage>
  );
}
