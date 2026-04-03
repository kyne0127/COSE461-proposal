"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DocPicker } from "../DocPicker";
import { SlideFrame } from "../slides/SlideFrame";
import { MSVLASlideData, SupplementaryDeckData } from "../../types/proposal";

type SupplementaryDeckProps = {
  data: SupplementaryDeckData;
  currentDoc: string;
  docOptions: string[];
};

function getTitle(content: string, fallback: string): string {
  const match = content.match(/^###\s+(.+)$/m);
  return match?.[1]?.trim() ?? fallback;
}

function getTableHtml(content: string): string {
  const raw = content.match(/<table[\s\S]*?<\/table>/i)?.[0] ?? "";
  return raw.replace(/src=(["'])\.\/img\/([^"']+)\1/gi, 'src="/api/supplementary-image/$2"');
}

function getBulletsAfterLabel(content: string, label: string): string[] {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\*\\*${escaped}\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\s*<div|\\n\\s*\\*\\*\\[|$)`, "i");
  const block = content.match(pattern)?.[1] ?? "";
  return block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("* "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
}

function getTakeawayHtml(content: string): string {
  return content.match(/<div[\s\S]*?<\/div>/i)?.[0] ?? "";
}

function SupplementarySlide({ slide, totalSlides }: { slide: MSVLASlideData; totalSlides: number }) {
  const title = getTitle(slide.contentBlock, slide.heading);
  const tableHtml = getTableHtml(slide.contentBlock);
  const observations = getBulletsAfterLabel(slide.contentBlock, "Key Observations");
  const takeawayHtml = getTakeawayHtml(slide.contentBlock);

  return (
    <SlideFrame title={slide.heading} subtitle={slide.heading} metaLabel={`${slide.slideNo} / ${totalSlides}`}>
      <div className="grid h-full grid-cols-1 gap-4">
        <section className="border-thin border-[var(--line-default)] p-5">
          <h2 className="text-3xl font-black uppercase leading-tight text-[var(--text-strong)]">{title}</h2>
        </section>

        {tableHtml ? (
          <section className="border-thin border-[var(--line-default)] p-5">
            <div dangerouslySetInnerHTML={{ __html: tableHtml }} />
          </section>
        ) : null}

        {observations.length > 0 ? (
          <section className="border-thin border-[var(--line-default)] p-5">
            <p className="text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">Key Observations</p>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-foreground">
              {observations.map((item) => (
                <li key={item} className="border-b border-[var(--line-faint)] pb-2 last:border-b-0">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {takeawayHtml ? (
          <section className="border-thin border-[var(--line-default)] p-5">
            <div dangerouslySetInnerHTML={{ __html: takeawayHtml }} />
          </section>
        ) : null}
      </div>
    </SlideFrame>
  );
}

export function SupplementaryDeck({ data, currentDoc, docOptions }: SupplementaryDeckProps) {
  const slides = useMemo(
    () =>
      data.slides.map((slide) => ({
        id: `slide-${slide.slideNo}`,
        label: `S${slide.slideNo}`,
        node: <SupplementarySlide slide={slide} totalSlides={data.slides.length} />,
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

      {slides.length > 1 ? (
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
      ) : null}
      <DocPicker currentDoc={currentDoc} docOptions={docOptions} />
    </main>
  );
}
