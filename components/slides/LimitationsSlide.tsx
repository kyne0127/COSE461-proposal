import { CircleX } from "lucide-react";
import { LimitationsSlideData } from "@/types/proposal";
import { SlideFrame } from "./SlideFrame";

type LimitationsSlideProps = {
  data: LimitationsSlideData;
};

export function LimitationsSlide({ data }: LimitationsSlideProps) {
  return (
    <SlideFrame title="Limitations" subtitle={data.title} metaLabel="3 / 6">
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-12">
        {data.groups.map((group) => (
          <article key={group.name} className="border-thin border-[var(--line-default)] p-5 md:col-span-4">
            <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">
              <CircleX size={14} className="text-accent" />
              {group.name}
            </p>
            <ul className="mt-4 space-y-3 text-base leading-7 text-foreground">
              {group.points.map((point) => (
                <li key={point} className="border-b border-[var(--line-faint)] pb-2 last:border-b-0">
                  {point}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </SlideFrame>
  );
}
