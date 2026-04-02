"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EvaluationContributionSlide } from "@/components/slides/EvaluationContributionSlide";
import { ExperimentPlanSlide } from "@/components/slides/ExperimentPlanSlide";
import { HardnessSlide } from "@/components/slides/HardnessSlide";
import { LimitationsSlide } from "@/components/slides/LimitationsSlide";
import { ProposedIdeaSlide } from "@/components/slides/ProposedIdeaSlide";
import { TitleProblemSlide } from "@/components/slides/TitleProblemSlide";
import { ProposalDeckData } from "@/types/proposal";

type ProposalDeckProps = {
  data: ProposalDeckData;
};

export function ProposalDeck({ data }: ProposalDeckProps) {
  const slides = useMemo(
    () => [
      { id: "slide-1", label: "Title", node: <TitleProblemSlide data={data.slide1} meta={data.meta} /> },
      { id: "slide-2", label: "Hardness", node: <HardnessSlide data={data.slide2} /> },
      { id: "slide-3", label: "Limits", node: <LimitationsSlide data={data.slide3} /> },
      { id: "slide-4", label: "Idea", node: <ProposedIdeaSlide data={data.slide4} /> },
      { id: "slide-5", label: "Experiment", node: <ExperimentPlanSlide data={data.slide5} /> },
      { id: "slide-6", label: "Evaluation", node: <EvaluationContributionSlide data={data.slide6} /> },
    ],
    [data]
  );

  const [index, setIndex] = useState(0);
  const activeSlide = slides[index];

  const next = () => setIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-base text-foreground md:px-8 md:py-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -28, scale: 0.985 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto w-full max-w-6xl"
        >
          {activeSlide.node}
        </motion.div>
      </AnimatePresence>

      <div className="mx-auto mt-6 flex w-full max-w-6xl flex-wrap items-center justify-center gap-2">
        <button
          onClick={prev}
          className="flex h-9 w-9 items-center justify-center rounded-full border-thin border-[var(--line-strong)] text-foreground transition hover:bg-[var(--button-hover)]"
          aria-label="Previous slide"
        >
          <ChevronLeft size={16} />
        </button>
        {slides.map((slide, dotIdx) => (
          <button
            key={slide.id}
            onClick={() => setIndex(dotIdx)}
            aria-label={`Go to ${slide.id} slide`}
            className={`rounded-full border-thin px-3 py-1 text-xs uppercase tracking-[0.16em] transition ${
              dotIdx === index
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--surface-card)]"
                : "border-[var(--line-default)] bg-[var(--surface-card)] text-[var(--text-soft)]"
            }`}
          >
            {slide.label}
          </button>
        ))}
        <button
          onClick={next}
          className="flex h-9 w-9 items-center justify-center rounded-full border-thin border-[var(--line-strong)] text-foreground transition hover:bg-[var(--button-hover)]"
          aria-label="Next slide"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </main>
  );
}
