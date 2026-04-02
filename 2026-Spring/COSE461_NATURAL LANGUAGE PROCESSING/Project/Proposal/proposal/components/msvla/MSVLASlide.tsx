import { SlideFrame } from "@/components/slides/SlideFrame";
import { MSVLASlideData } from "@/types/proposal";
import { BlockMath } from "react-katex";

type MSVLASlideProps = {
  data: MSVLASlideData;
  totalSlides: number;
};

function getTitle(content: string, fallback: string): string {
  const match = content.match(/^###\s+(.+)$/m);
  return match?.[1]?.trim() ?? fallback;
}

function getBullets(content: string, labels: string[]): string[] {
  const escaped = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(
    `\\*\\*(?:${escaped.join("|")})\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\s*\\*\\*|\\n\\s*###|$)`,
    "i"
  );
  const block = content.match(pattern)?.[1] ?? "";
  return block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("* ") || /^\d+\.\s+/.test(line))
    .map((line) => {
      if (line.startsWith("* ")) {
        return line.slice(2).trim();
      }
      return line.replace(/^\d+\.\s+/, "").trim();
    })
    .filter(Boolean);
}

function getCallout(content: string): string {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith(">"))
    .map((line) => line.replace(/^>\s?/, "").trim());
  const candidate = lines.find((line) => line.includes("?")) ?? lines[0];
  return candidate ?? "";
}

function getParagraphAfterLabel(content: string, label: string): string {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\*\\*${escaped}\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\s*\\*\\*|$)`, "i");
  const block = content.match(pattern)?.[1] ?? "";
  return block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .find((line) => !line.startsWith("* ")) ?? "";
}

function getNumberedGroups(content: string): { title: string; points: string[] }[] {
  const regex = /\d+\.\s*\*\*(.+?)\*\*\s*\n([\s\S]*?)(?=\n\d+\.\s*\*\*|$)/g;
  const groups: { title: string; points: string[] }[] = [];
  let match = regex.exec(content);
  while (match) {
    const points = match[2]
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("* "))
      .map((line) => line.slice(2).trim());
    groups.push({ title: match[1].trim(), points });
    match = regex.exec(content);
  }
  return groups;
}

function getMathBlocks(content: string): string[] {
  return [...content.matchAll(/\$\$([\s\S]*?)\$\$/g)].map((match) => match[1].trim());
}

function getMermaid(content: string): string {
  return content.match(/```mermaid\s*([\s\S]*?)```/i)?.[1]?.trim() ?? "";
}

function getMermaidNode(mermaid: string, nodeId: string, fallback: string): string {
  if (!mermaid) {
    return fallback;
  }
  const escaped = nodeId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`${escaped}\\(\\[([^\\]]+)\\]\\)`, "i"),
    new RegExp(`${escaped}\\{([^}]+)\\}`, "i"),
    new RegExp(`${escaped}\\[([^\\]]+)\\]`, "i"),
  ];
  for (const pattern of patterns) {
    const hit = mermaid.match(pattern);
    if (hit?.[1]) {
      return hit[1].replace(/\\n/g, " ").trim();
    }
  }
  return fallback;
}

function stripInlineMarkdown(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
}

function renderListItem(item: string) {
  const highlighted = item.match(/^\*\*(.+?)\*\*\s*:\s*(.+)$/);
  if (highlighted) {
    return (
      <p className="leading-7 text-foreground">
        <span className="text-base font-black text-[var(--text-strong)]">{highlighted[1]}:</span>{" "}
        <span className="text-sm">{stripInlineMarkdown(highlighted[2])}</span>
      </p>
    );
  }
  return <p className="text-sm leading-7 text-foreground">{stripInlineMarkdown(item)}</p>;
}

function renderListCard(title: string, items: string[]) {
  return (
    <section className="border-thin border-[var(--line-default)] p-5">
      <p className="text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-7 text-foreground">
        {items.map((item) => (
          <li key={item} className="border-b border-[var(--line-faint)] pb-2 last:border-b-0">
            {renderListItem(item)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MSVLASlide({ data, totalSlides }: MSVLASlideProps) {
  const title = getTitle(data.contentBlock, data.heading);
  const objectives = getBullets(data.contentBlock, ["Research Objectives"]);
  const keyIdea = getBullets(data.contentBlock, ["Key Idea"]);
  const coreModules = getBullets(data.contentBlock, ["Core Modules"]);
  const datasets = getBullets(data.contentBlock, ["1️⃣ Dataset", "Dataset"]);
  const queryTypes = getBullets(data.contentBlock, ["2️⃣ Query / Instruction Types", "Query / Instruction Types"]);
  const baselines = getBullets(data.contentBlock, ["3️⃣ Baselines", "Baselines"]);
  const metrics = getBullets(data.contentBlock, ["📊 Evaluation Metrics", "Evaluation Metrics"]);
  const researchQuestions = getBullets(data.contentBlock, ["❓ Research Questions", "Research Questions"]);
  const contributions = getBullets(data.contentBlock, ["✨ Expected Contribution", "Expected Contribution"]);
  const phasesA = getBullets(data.contentBlock, ["Phase A — Adapter Pre-Alignment"]);
  const phasesB = getBullets(data.contentBlock, ["Phase B — Joint Runtime Tuning"]);
  const phasesC = getBullets(data.contentBlock, ["Phase C — Entropy-Gated Dialogue"]);
  const deliverables = getBullets(data.contentBlock, ["Deliverables"]);
  const risks = getBullets(data.contentBlock, ["Risks"]);
  const mitigations = getBullets(data.contentBlock, ["Mitigations"]);
  const takeaway = getParagraphAfterLabel(data.contentBlock, "Final Takeaway");
  const callout = getCallout(data.contentBlock);
  const limitationGroups = getNumberedGroups(data.contentBlock);
  const equations = getMathBlocks(data.contentBlock);
  const mermaid = getMermaid(data.contentBlock);
  const pipelineNodes = {
    input: getMermaidNode(mermaid, "I", "Instruction + Observation"),
    base: getMermaidNode(mermaid, "B", "Base VLA Policy"),
    adapter: getMermaidNode(mermaid, "A", "Manifold Coordinate Adapter (Delta c)"),
    residual: getMermaidNode(mermaid, "R", "Residual Correction Head (Delta a)"),
    gate: getMermaidNode(mermaid, "G", "Entropy / AMBG Gate"),
    execute: getMermaidNode(mermaid, "E", "Execute Action"),
    clarify: getMermaidNode(mermaid, "C", "Clarification Dialogue"),
  };

  return (
    <SlideFrame title={data.heading} subtitle={data.heading} metaLabel={`${data.slideNo} / ${totalSlides}`}>
      <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-12">
        <section className="border-thin border-[var(--line-default)] p-5 md:col-span-12">
          <h2 className="text-3xl font-black uppercase leading-tight text-[var(--text-strong)]">{title}</h2>
          {callout ? (
            <p className="mt-3 border-l-2 border-[var(--accent)] pl-3 text-sm leading-7 text-foreground">{callout}</p>
          ) : null}
        </section>

        {data.slideNo === 1 ? (
          <>
            <div className="md:col-span-7">{renderListCard("Research Objectives", objectives)}</div>
            <section className="border-thin border-[var(--line-default)] p-5 md:col-span-5">
              <p className="text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">Failure Signals</p>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <div className="border-thin border-[var(--line-faint)] bg-[var(--surface-card)] px-3 py-2 text-sm text-foreground">
                  Mis-executed action due to ambiguity
                </div>
                <div className="border-thin border-[var(--line-faint)] bg-[var(--surface-card)] px-3 py-2 text-sm text-foreground">
                  Unnecessary halt before execution
                </div>
                <div className="border-thin border-[var(--line-faint)] bg-[var(--surface-card)] px-3 py-2 text-sm text-foreground">
                  High latency from uncertainty handling
                </div>
              </div>
            </section>
          </>
        ) : null}

        {data.slideNo === 2 ? (
          <>
            <div className="md:col-span-7">{renderListCard("Key Idea", keyIdea)}</div>
            <section className="border-thin border-[var(--line-default)] p-5 md:col-span-5">
              <p className="text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">Equation / Mapping</p>
              <div className="mt-3 space-y-3">
                {equations.map((eq) => (
                  <div key={eq} className="border-thin border-[var(--line-faint)] bg-[var(--surface-card)] px-3 py-2 text-sm text-foreground">
                    <BlockMath math={eq} />
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {data.slideNo === 3 ? (
          <>
            {limitationGroups.map((group) => (
              <section key={group.title} className="border-thin border-[var(--line-default)] p-5 md:col-span-4">
                <p className="text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">{group.title}</p>
                <ul className="mt-3 space-y-2 text-sm leading-7 text-foreground">
                  {group.points.map((point) => (
                    <li key={point} className="border-b border-[var(--line-faint)] pb-2 last:border-b-0">
                      {point}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        ) : null}

        {data.slideNo === 4 ? (
          <>
            <section className="border-thin border-[var(--line-default)] p-5 md:col-span-8">
              <p className="text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">Pipeline Figure</p>
              <div className="mt-3 space-y-2 text-sm text-foreground">
                <div className="border-thin border-[var(--line-faint)] bg-[var(--surface-card)] px-3 py-2">{pipelineNodes.input}</div>
                <div className="border-thin border-[var(--line-faint)] bg-[var(--surface-card)] px-3 py-2">{pipelineNodes.base}</div>
                <div className="border-thin border-[var(--line-faint)] bg-[var(--surface-card)] px-3 py-2">{pipelineNodes.adapter}</div>
                <div className="border-thin border-[var(--line-faint)] bg-[var(--surface-card)] px-3 py-2">{pipelineNodes.residual}</div>
                <div className="border-thin border-[var(--line-faint)] bg-[var(--surface-accent)] px-3 py-2">{pipelineNodes.gate}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border-thin border-[var(--line-faint)] bg-[var(--surface-card)] px-3 py-2">
                    {pipelineNodes.execute}
                  </div>
                  <div className="border-thin border-[var(--line-faint)] bg-[var(--surface-info)] px-3 py-2">
                    {pipelineNodes.clarify}
                  </div>
                </div>
              </div>
            </section>
            <div className="md:col-span-4">{renderListCard("Core Modules", coreModules)}</div>
          </>
        ) : null}

        {data.slideNo === 5 ? (
          <>
            <div className="md:col-span-4">{renderListCard("Dataset", datasets)}</div>
            <div className="md:col-span-4">{renderListCard("Instruction Types", queryTypes)}</div>
            <div className="md:col-span-4">{renderListCard("Baselines", baselines)}</div>
          </>
        ) : null}

        {data.slideNo === 6 ? (
          <>
            <div className="md:col-span-6">{renderListCard("Evaluation Metrics", metrics)}</div>
            <div className="md:col-span-6">{renderListCard("Research Questions", researchQuestions)}</div>
            <div className="md:col-span-12">{renderListCard("Expected Contribution", contributions)}</div>
          </>
        ) : null}

        {data.slideNo === 7 ? (
          <>
            <div className="md:col-span-4">{renderListCard("Phase A", phasesA)}</div>
            <div className="md:col-span-4">{renderListCard("Phase B", phasesB)}</div>
            <div className="md:col-span-4">{renderListCard("Phase C", phasesC)}</div>
            <div className="md:col-span-12">{renderListCard("Deliverables", deliverables)}</div>
          </>
        ) : null}

        {data.slideNo === 8 ? (
          <>
            <div className="md:col-span-6">{renderListCard("Risks", risks)}</div>
            <div className="md:col-span-6">{renderListCard("Mitigations", mitigations)}</div>
            <section className="border-thin border-[var(--line-default)] p-5 md:col-span-12">
              <p className="text-sm uppercase tracking-[0.16em] text-[var(--text-muted)]">Final Takeaway</p>
              <p className="mt-3 text-sm leading-7 text-foreground">{takeaway}</p>
            </section>
          </>
        ) : null}

      </div>
    </SlideFrame>
  );
}
