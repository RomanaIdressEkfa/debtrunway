import type { Block } from "@/lib/answers";

/**
 * Renders an answer's blocks.
 *
 * The content is data rather than JSX so the same array can feed the page,
 * the index and the structured data without three copies drifting apart —
 * which is how an FAQ ends up saying one thing to a reader and another to a
 * search engine.
 */
export default function AnswerBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.kind === "h2") {
          return (
            <h2 key={i} className="mt-10 text-2xl font-bold tracking-tight">
              {block.text}
            </h2>
          );
        }
        if (block.kind === "ul") {
          return (
            <ul key={i} className="mt-4 space-y-2.5 pl-1">
              {(block.items ?? []).map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mt-3 leading-relaxed">
            {block.text}
          </p>
        );
      })}
    </>
  );
}
