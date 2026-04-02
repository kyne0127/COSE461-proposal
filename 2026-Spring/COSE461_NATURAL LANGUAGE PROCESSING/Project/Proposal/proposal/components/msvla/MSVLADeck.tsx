"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DocPicker } from "../DocPicker";
import { MSVLASlide } from "./MSVLASlide";
import { MSVLADeckData } from "../../types/proposal";

type MSVLADeckProps = {
  data: MSVLADeckData;
  currentDoc: string;
  docOptions: string[];
};

export function MSVLADeck({ data, currentDoc, docOptions }: MSVLADeckProps) {
  const slides = useMemo(
    () =>
      data.slides.map((slide) => ({
        id: `slide-${slide.slideNo}`,
        label: `S${slide.slideNo}`,
        node: <MSVLASlide data={slide} totalSlides={data.slides.length} />,
      })),
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
      <DocPicker currentDoc={currentDoc} docOptions={docOptions} />
    </main>
  );
}
