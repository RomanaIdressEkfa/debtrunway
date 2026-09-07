"use client";

/**
 * PDF by way of the browser's own print dialogue.
 *
 * The obvious alternative is jsPDF or html2pdf, and both were rejected. They
 * add two to three hundred kilobytes to a page whose whole point is that it
 * loads and works without asking anything of anyone, they render their own
 * approximation of the page rather than the page, and they are one more
 * dependency to keep alive on a site meant to still work in five years.
 *
 * Every browser can already save a page as PDF, at the reader's own paper
 * size and margins, with selectable text and working links. What was missing
 * was not a library but print styles — so those are in globals.css, and this
 * is the button that opens the dialogue.
 *
 * Nothing is uploaded to make the file. On a page that asks who in a family
 * has died, that matters more than the convenience of a download button.
 */
export default function PrintButton({
  label = "Save as PDF or print",
  hint,
}: {
  label?: string;
  hint?: string;
}) {
  return (
    <div className="no-print">
      <button
        type="button"
        onClick={() => window.print()}
        className="press flex w-full items-center justify-center gap-2 rounded-xl border border-line py-3 text-base font-medium transition hover:border-brand hover:text-brand"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden fill="none">
          <path
            d="M4.5 6V2.5h7V6M4.5 11.5h7v2h-7z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 6h7a2 2 0 0 1 2 2v3.5h-2m-7 0h-2V8a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
        {label}
      </button>
      {hint && (
        <p className="mt-2 text-center text-sm text-muted">{hint}</p>
      )}
    </div>
  );
}
