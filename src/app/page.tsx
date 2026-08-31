import CalculatorPage from "@/components/CalculatorPage";
import PayoffCalculator from "@/components/PayoffCalculator";

const faqs = [
  {
    q: "What is the debt snowball method?",
    a: "You pay the minimum on every debt, then throw every spare dollar at the smallest balance. When it clears, its payment rolls onto the next-smallest debt, so the amount attacking your debt grows like a snowball. It costs slightly more in interest than the avalanche, but the early wins are why most people stick with it.",
  },
  {
    q: "What is the debt avalanche method?",
    a: "Same idea, different order: your spare money goes to the debt with the highest interest rate first, regardless of size. This always costs the least in total interest. The catch is that a large high-rate debt can take many months to clear, and some people lose momentum before the first win arrives.",
  },
  {
    q: "Which method should I choose?",
    a: "Run both above and look at the gap. If the avalanche saves you only a few hundred dollars, take the snowball and the motivation that comes with it. If the gap is large, the avalanche is worth the patience.",
  },
  {
    q: "How is the interest calculated?",
    a: "Each month your balance is charged one twelfth of its annual rate, then your payment is applied. Your card issuer may use average daily balance instead, so real statements can differ by a small amount.",
  },
  {
    q: "Does this calculator store my information?",
    a: "No. Every calculation runs in your browser. Nothing you type is sent to a server, saved, or shared.",
  },
];

export default function Home() {
  return (
    <CalculatorPage
      slug="/"
      heading={
        <>
          Debt <em className="accent-text not-italic">payoff</em> calculator
        </>
      }
      intro="Enter what you owe and what you can pay. You will see your exact debt-free date, what the interest really costs you, and the month-by-month schedule to get there."
      faqs={faqs}
      content={
        <>
          <h2 className="text-2xl font-bold tracking-tight">
            How to use this calculator
          </h2>
          <p className="mt-3 leading-relaxed">
            Start by listing every debt you carry a balance on — credit cards,
            store cards, car loans, personal loans, student loans. For each one
            you need three numbers, and all three are printed on your statement:
            the current balance, the interest rate (APR), and the minimum
            payment your lender requires.
          </p>
          <p className="mt-3 leading-relaxed">
            Then enter the extra amount you can put toward debt each month above
            those minimums. This single number does most of the work. Minimum
            payments are set so that clearing the balance takes as long as
            possible — on a typical credit card they can stretch a few thousand
            dollars into decades of payments. Almost any extra amount, paid
            consistently, collapses that timeline.
          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight">
            Snowball or avalanche?
          </h2>
          <p className="mt-3 leading-relaxed">
            Both methods pay the minimum on everything and put the extra toward
            one target debt. They differ only in which debt goes first.
          </p>
          <p className="mt-3 leading-relaxed">
            The <strong>snowball</strong> attacks the smallest balance first.
            You clear a whole debt quickly, that debt&rsquo;s payment joins your
            extra money, and the next one falls faster. The{" "}
            <strong>avalanche</strong> attacks the highest interest rate first,
            which is always the mathematically cheapest route.
          </p>
          <p className="mt-3 leading-relaxed">
            The calculator above shows both, so you can see the real trade-off
            rather than argue about it in the abstract. For most people the
            difference is smaller than they expect — and a plan you finish beats
            an optimal plan you abandon.
          </p>
        </>
      }
    >
      <PayoffCalculator />
    </CalculatorPage>
  );
}
