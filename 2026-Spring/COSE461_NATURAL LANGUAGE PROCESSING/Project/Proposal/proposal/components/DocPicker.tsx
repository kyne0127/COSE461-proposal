"use client";

import { usePathname, useRouter } from "next/navigation";

type DocPickerProps = {
  currentDoc: string;
  docOptions: string[];
};

export function DocPicker({ currentDoc, docOptions }: DocPickerProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (docOptions.length <= 1) {
    return null;
  }

  return (
    <div className="fixed bottom-3 right-3 z-30 rounded-md border-thin border-[var(--line-soft)] bg-[var(--surface-card)]/75 px-2 py-1 backdrop-blur-sm transition hover:bg-[var(--surface-card)]">
      <label htmlFor="doc-picker" className="sr-only">
        Select presentation document
      </label>
      <select
        id="doc-picker"
        value={currentDoc}
        onChange={(event) => {
          const nextDoc = event.target.value;
          router.replace(`${pathname}?doc=${encodeURIComponent(nextDoc)}`);
        }}
        className="max-w-[180px] bg-transparent text-xs text-[var(--text-subtle)] outline-none"
        aria-label="Select presentation document"
      >
        {docOptions.map((doc) => (
          <option key={doc} value={doc}>
            {doc}
          </option>
        ))}
      </select>
    </div>
  );
}
