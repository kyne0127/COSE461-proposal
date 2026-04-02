"use client";

import { PropsWithChildren } from "react";

type SlideFrameProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  metaLabel?: string;
}>;

export function SlideFrame(props: SlideFrameProps) {
  const { metaLabel, children } = props;

  return (
    <section className="w-full max-w-6xl bg-background border-thin border-[var(--line-default)]">
      <header className="flex items-center justify-between border-b border-[var(--line-soft)] px-4 py-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-soft)]">Research Deck</p>
        <p className="rounded-full border-thin border-[var(--line-strong)] px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--text-dim)]">
          {metaLabel ?? "Proposal View"}
        </p>
      </header>
      <div className="grid min-h-[540px] grid-cols-12">
        <div className="col-span-12 p-6 md:col-span-12 md:p-8">{children}</div>
      </div>
    </section>
  );
}
