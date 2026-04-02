import { Database, FlaskConical, Layers } from "lucide-react";
import { ReactNode } from "react";
import { ExperimentSlideData } from "../../types/proposal";
import { SlideFrame } from "./SlideFrame";

type ExperimentPlanSlideProps = {
  data: ExperimentSlideData;
};

function PlanCard({
  title,
  items,
  icon,
  highlightOurs,
}: {
  title: string;
  items: string[];
  icon: ReactNode;
  highlightOurs?: boolean;
}) {
  return (
    <article className="border-thin border-[var(--line-default)] p-5">
      <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {icon} {title}
      </p>
      <ul className="mt-4 space-y-2 text-base leading-7 text-foreground">
        {items.map((item) => (
          <li
            key={item}
            className={`border-b border-[var(--line-faint)] pb-2 last:border-b-0 ${
              highlightOurs && item.toLowerCase().includes("ours")
                ? "font-semibold text-accent"
                : ""
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ExperimentPlanSlide({ data }: ExperimentPlanSlideProps) {
  return (
    <SlideFrame title="Experiment Plan" subtitle={data.title} metaLabel="5 / 6">
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-3">
        <PlanCard
          title="Dataset"
          items={data.datasets}
          icon={<Database size={14} className="text-[var(--text-soft)]" />}
        />
        <PlanCard
          title="Question Types"
          items={data.questionTypes}
          icon={<FlaskConical size={14} className="text-[var(--text-soft)]" />}
        />
        <PlanCard
          title="Baselines"
          items={data.baselines}
          icon={<Layers size={14} className="text-[var(--text-soft)]" />}
          highlightOurs
        />
      </div>
    </SlideFrame>
  );
}
