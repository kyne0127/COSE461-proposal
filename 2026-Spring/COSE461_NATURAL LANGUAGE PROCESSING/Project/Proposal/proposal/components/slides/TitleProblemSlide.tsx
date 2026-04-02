import { ArrowRight, Lightbulb } from "lucide-react";
import { SlideFrame } from "./SlideFrame";
import { DeckMeta, TitleProblemSlideData } from "../../types/proposal";

type TitleProblemSlideProps = {
  data: TitleProblemSlideData;
  meta: DeckMeta;
};

export function TitleProblemSlide({ data, meta }: TitleProblemSlideProps) {
  return (
    <SlideFrame title="Title / Problem" subtitle={meta.deckTitle} metaLabel="1 / 6">
      <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-12">
        <section className="border-thin border-[var(--line-default)] p-6 md:col-span-8">
          <p className="text-sm uppercase tracking-[0.18em] text-[var(--text-subtle)]">Problem Setting</p>
          <h2 className="mt-3 text-4xl font-black uppercase leading-tight text-[var(--text-strong)] md:text-5xl">
            {data.title}
          </h2>
          <p className="cursive-accent mt-2 text-3xl text-accent">research proposal</p>

          <p className="mt-6 text-sm uppercase tracking-[0.16em] text-[var(--text-soft)]">Research Objectives</p>
          <ul className="mt-3 space-y-2 text-base leading-8 text-foreground">
            {data.objectives.map((objective) => (
              <li key={objective}>- {objective}</li>
            ))}
          </ul>
        </section>

        <aside className="border-thin border-[var(--line-default)] p-6 md:col-span-4">
          <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[var(--text-subtle)]">
            <Lightbulb size={14} className="text-accent" /> Core Question
          </p>
          <p className="mt-4 border-l-2 border-[var(--accent)] pl-3 text-base leading-8 text-foreground">
            {data.coreQuestion}
          </p>

          <p className="mt-8 text-sm uppercase tracking-[0.16em] text-[var(--text-soft)]">Flow</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {data.flowKeywords.map((keyword, idx) => (
              <div key={`${keyword}-${idx}`} className="inline-flex items-center gap-2">
                <span className="border-thin border-[var(--line-default)] px-2 py-1 text-xs uppercase text-[var(--text-muted)]">
                  {keyword}
                </span>
                {idx < data.flowKeywords.length - 1 ? <ArrowRight size={12} className="text-accent" /> : null}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </SlideFrame>
  );
}
