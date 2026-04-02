import { CircleHelp, Gauge, Sparkles } from "lucide-react";
import { EvaluationSlideData } from "@/types/proposal";
import { SlideFrame } from "./SlideFrame";

type EvaluationContributionSlideProps = {
  data: EvaluationSlideData;
};

export function EvaluationContributionSlide({ data }: EvaluationContributionSlideProps) {
  const metricBars = data.metrics.map((metric, idx) => ({
    metric,
    width: `${Math.max(38, 88 - idx * 10)}%`,
  }));

  return (
    <SlideFrame title="Evaluation & Contribution" subtitle={data.title} metaLabel="6 / 6">
      <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-12">
        <section className="border-thin border-[var(--line-default)] p-6 md:col-span-6">
          <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <Gauge size={14} className="text-accent" /> Evaluation Metrics
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-foreground">
            {data.metrics.map((metric) => (
              <li key={metric} className="border-b border-[var(--line-faint)] pb-2 last:border-b-0">
                {metric}
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-2">
            {metricBars.map((item) => (
              <div key={item.metric}>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--line-faint)]">
                  <div className="h-full bg-accent" style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-thin border-[var(--line-default)] p-6 md:col-span-6">
          <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <CircleHelp size={14} className="text-accent" /> Research Questions
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-foreground">
            {data.researchQuestions.map((question) => (
              <li key={question} className="border-b border-[var(--line-faint)] pb-2 last:border-b-0">
                {question}
              </li>
            ))}
          </ul>
        </section>

        <section className="border-thin border-[var(--line-default)] p-6 md:col-span-12">
          <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <Sparkles size={14} className="text-accent" /> Expected Contribution
          </p>
          <ol className="mt-4 space-y-2 text-base leading-7 text-foreground">
            {data.contributions.map((contribution, index) => (
              <li key={contribution}>
                {index + 1}. {contribution}
              </li>
            ))}
          </ol>
          <div className="mt-6 border-t border-[var(--line-soft)] pt-3 text-sm text-[var(--text-soft)]">
            <p className="uppercase tracking-[0.2em]">References</p>
            <ul className="mt-2 space-y-1">
              {data.references.map((reference) => (
                <li key={reference}>- {reference}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </SlideFrame>
  );
}
