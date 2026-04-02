import { AlertTriangle, ArrowRight, MessageSquareText } from "lucide-react";
import { SlideFrame } from "./SlideFrame";
import { HardnessSlideData } from "@/types/proposal";

type HardnessSlideProps = {
  data: HardnessSlideData;
};

export function HardnessSlide({ data }: HardnessSlideProps) {
  const pairs = data.exampleQuestions.map((question, idx) => ({
    question,
    difficulty: data.difficulties[idx] ?? data.difficulties[data.difficulties.length - 1],
  }));

  return (
    <SlideFrame title="Why Hard" subtitle={data.title} metaLabel="2 / 6">
      <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-12">
        <section className="border-thin border-[var(--line-default)] p-6 md:col-span-6">
          <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            <MessageSquareText size={14} className="text-accent" /> Example Questions
          </p>
          <ul className="mt-4 space-y-3 text-base leading-8 text-foreground">
            {data.exampleQuestions.map((question) => (
              <li key={question} className="border-b border-[var(--line-faint)] pb-3 last:border-b-0">
                {question}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-thin border-[var(--line-default)] p-6 md:col-span-6">
          <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            <AlertTriangle size={14} className="text-accent" /> Difficulty
          </p>
          <ul className="mt-4 space-y-3 text-base leading-8 text-foreground">
            {data.difficulties.map((difficulty) => (
              <li key={difficulty} className="border-b border-[var(--line-faint)] pb-3 last:border-b-0">
                {difficulty}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-thin border-[var(--line-default)] p-6 md:col-span-12">
          <p className="text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">Reasoning Flow Figure</p>
          <div className="mt-4 space-y-3">
            {pairs.slice(0, 3).map((pair) => (
              <div key={pair.question} className="grid grid-cols-1 items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
                <div className="border-thin border-[var(--line-soft)] bg-[var(--surface-panel)] px-3 py-2 text-base text-foreground">
                  {pair.question}
                </div>
                <ArrowRight size={16} className="mx-auto text-accent" />
                <div className="border-thin border-[var(--accent-soft-line)] bg-[var(--surface-accent)] px-3 py-2 text-base text-foreground">
                  {pair.difficulty}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SlideFrame>
  );
}
