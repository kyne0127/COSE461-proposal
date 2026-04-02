import { ArrowDown, CheckCircle2, GitBranchPlus, Workflow } from "lucide-react";
import { ProposedIdeaSlideData } from "@/types/proposal";
import { SlideFrame } from "./SlideFrame";

type ProposedIdeaSlideProps = {
  data: ProposedIdeaSlideData;
};

export function ProposedIdeaSlide({ data }: ProposedIdeaSlideProps) {
  return (
    <SlideFrame title="Proposed Idea" subtitle={data.title} metaLabel="4 / 6">
      <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-12">
        <section className="border-thin border-[var(--line-default)] p-6 md:col-span-8">
          <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <Workflow size={14} className="text-accent" /> Pipeline Figure
          </p>
          <div className="mt-4 border-thin border-[var(--line-soft)] bg-[var(--surface-panel)] p-4">
            <div className="grid grid-cols-1 gap-2 text-center text-sm md:text-base">
              <div className="rounded-md border-thin border-[var(--pastel-lavender-line)] bg-[var(--pastel-lavender)] px-3 py-2 font-semibold text-[var(--text-strong)] shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
                {data.pipelineFigure.input}
              </div>
              <div className="flex justify-center">
                <ArrowDown size={16} className="text-accent" />
              </div>
              <div className="rounded-md border-thin border-[var(--pastel-pink-line)] bg-[var(--pastel-pink)] px-3 py-2 font-semibold text-[var(--text-strong)] shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
                {data.pipelineFigure.classifier}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border-thin border-[var(--pastel-mint-line)] bg-[var(--pastel-mint)] px-3 py-2 text-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
                  {data.pipelineFigure.lightPath}
                </div>
                <div className="rounded-md border-thin border-[var(--pastel-sky-line)] bg-[var(--pastel-sky)] px-3 py-2 text-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
                  {data.pipelineFigure.complexPath}
                </div>
              </div>
              <div className="flex justify-center">
                <ArrowDown size={16} className="text-accent" />
              </div>
              <div className="rounded-md border-thin border-[var(--pastel-peach-line)] bg-[var(--pastel-peach)] px-3 py-2 text-foreground shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
                {data.pipelineFigure.evidence}
              </div>
              <div className="flex justify-center">
                <ArrowDown size={16} className="text-accent" />
              </div>
              <div className="rounded-md border-thin border-[var(--pastel-lilac-line)] bg-[var(--pastel-lilac)] px-3 py-2 font-semibold text-[var(--text-strong)] shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
                {data.pipelineFigure.answer}
              </div>
            </div>
            <p className="mt-3 text-sm text-[var(--text-soft)]">
              Figure: Adaptive routing pipeline from the source slide markdown.
            </p>
          </div>

          <div className="mt-4 space-y-2 text-left">
            {data.pipelineText.map((step, idx) => (
              <div
                key={step}
                className="flex w-full items-center gap-3 border-thin border-[var(--line-soft)] bg-[var(--surface-card)] px-3 py-2 text-sm text-[var(--text-strong)]"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border-thin border-[var(--line-default)] text-xs">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="border-thin border-[var(--line-default)] p-6 md:col-span-4">
          <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <GitBranchPlus size={14} className="text-accent" /> Structure-Aware Retrieval
          </p>
          <ul className="mt-4 space-y-2 text-base font-medium leading-7 text-[var(--text-strong)]">
            {data.structureAware.map((item) => (
              <li key={item} className="inline-flex w-full items-start gap-2 border-thin border-[var(--line-soft)] bg-[var(--surface-panel)] px-3 py-2">
                <CheckCircle2 size={14} className="mt-1 shrink-0 text-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </SlideFrame>
  );
}
