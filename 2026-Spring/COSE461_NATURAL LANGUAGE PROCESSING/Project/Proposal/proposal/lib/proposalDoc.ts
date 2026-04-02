import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { MSVLADeckData, MSVLASlideData, ProposalDeckData } from "../types/proposal";

type DocEntry = {
  name: string;
  fullPath: string;
};

const docsDirCandidates = [path.join(process.cwd(), "..", "docs"), path.join(process.cwd(), "docs")];

function normalizeDocName(input: string): string | null {
  const basename = path.basename(input).trim();
  if (!basename.toLowerCase().endsWith(".md")) {
    return null;
  }
  if (!/^[A-Za-z0-9._-]+\.md$/i.test(basename)) {
    return null;
  }
  return basename;
}

function extractDeckTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? "Research Proposal";
}

function getLanguageBlock(markdown: string): string {
  const marker = "# [한국어 원본 / Korean Version]";
  const markerIdx = markdown.indexOf(marker);
  if (markerIdx >= 0) {
    return markdown.slice(0, markerIdx);
  }
  return markdown;
}

function extractSlideSection(markdown: string, slideNo: number): string {
  const pattern = new RegExp(`##\\s+Slide\\s+${slideNo}\\.[\\s\\S]*?(?=\\n##\\s+Slide\\s+\\d+\\.|$)`, "i");
  return markdown.match(pattern)?.[0] ?? "";
}

function extractContentArea(slideSection: string): string {
  const match =
    slideSection.match(
      /\*\*\[\s*(?:슬라이드 화면 내용|Slide Content)\s*\]\s*\*\*([\s\S]*?)\*\*\[\s*(?:발표 대본|Presentation Script)\s*\]\s*\*\*/i
    ) ??
    slideSection.match(
      /\*\*\[\s*(?:Slide Content)\s*\]\s*\*\*([\s\S]*?)\*\*\[\s*(?:Presentation Script)\s*\]\s*\*\*/i
    );

  return match?.[1]?.trim() ?? slideSection;
}

function extractTitleFromContent(content: string, fallback: string): string {
  const match = content.match(/^###\s+(.+)$/m);
  return match?.[1]?.trim() ?? fallback;
}

function extractBulletsAfterLabel(content: string, labels: string[]): string[] {
  const escaped = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(
    `\\*\\*(?:${escaped.join("|")})\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\s*\\*\\*|\\n\\s*###|\\n\\s*\\d+\\.\\s*\\*\\*|$)`,
    "i"
  );
  const match = content.match(pattern);
  if (!match) {
    return [];
  }

  return match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("* "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
}

function extractCoreQuestion(content: string): string {
  const blockLines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith(">"))
    .map((line) => line.replace(/^>\s?/, "").trim())
    .filter(Boolean);

  const quotedLine = blockLines.find((line) => line.includes("?"));
  if (quotedLine) {
    return quotedLine.replace(/^["“]|["”]$/g, "");
  }
  return "For documents with many structures and exceptions, should all queries use the same retrieval strategy?";
}

function extractFlowKeywords(content: string): string[] {
  const arrows = content.match(/[^"'`\n]+➡️[^"'`\n]+/)?.[0];
  if (!arrows) {
    return ["Limitation Analysis", "Structure Reflection", "Adaptive Routing"];
  }
  return arrows
    .split("➡️")
    .map((item) => item.replace(/['"]/g, "").trim())
    .filter(Boolean);
}

function extractLimitations(content: string) {
  const regex = /\d+\.\s*\*\*(.+?)\*\*\s*\n([\s\S]*?)(?=\n\d+\.\s*\*\*|$)/g;
  const groups: { name: string; points: string[] }[] = [];
  let match: RegExpExecArray | null = regex.exec(content);
  while (match) {
    const points = match[2]
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("* "))
      .map((line) => line.slice(2).trim());
    groups.push({ name: match[1].trim(), points });
    match = regex.exec(content);
  }
  return groups;
}

function extractReferences(content: string): string[] {
  const htmlRefs = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.includes("<br />-"))
    .map((line) => line.replace(/^<br\s*\/?>-\s*/i, "").trim());
  if (htmlRefs.length > 0) {
    return htmlRefs;
  }
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
}

function extractMermaidBlock(content: string): string {
  const match = content.match(/```mermaid\s*([\s\S]*?)```/i);
  return match?.[1]?.trim() ?? "";
}

function extractNodeLabel(mermaid: string, nodeId: string, fallback: string): string {
  if (!mermaid) {
    return fallback;
  }
  const escapedId = nodeId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`${escapedId}\\(\\[([^\\]]+)\\]\\)`, "i"),
    new RegExp(`${escapedId}\\{([^}]+)\\}`, "i"),
    new RegExp(`${escapedId}\\[([^\\]]+)\\]`, "i"),
  ];

  for (const pattern of patterns) {
    const match = mermaid.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/\\n/g, " ").trim();
    }
  }

  return fallback;
}

function extractBlockBetween(text: string, startLabel: string, endLabel?: string): string {
  const start = text.indexOf(startLabel);
  if (start < 0) {
    return "";
  }
  const from = start + startLabel.length;
  if (!endLabel) {
    return text.slice(from).trim();
  }
  const end = text.indexOf(endLabel, from);
  return text.slice(from, end >= 0 ? end : undefined).trim();
}

function parseMSVLASlides(langBlock: string): MSVLASlideData[] {
  const sections = [...langBlock.matchAll(/##\s+Slide\s+(\d+)\.\s+([^\n]+)\n([\s\S]*?)(?=\n##\s+Slide\s+\d+\.|$)/g)];
  return sections.map((match) => {
    const slideNo = Number(match[1]);
    const heading = match[2].trim();
    const body = match[3] ?? "";
    const visualGuide = extractBlockBetween(body, "**[ Visual & Layout Guide ]**", "**[ Slide Content ]**");
    const contentBlock = extractBlockBetween(body, "**[ Slide Content ]**", "**[ Presentation Script ]**");
    const scriptBlock = extractBlockBetween(body, "**[ Presentation Script ]**");

    return {
      slideNo,
      heading,
      visualGuide,
      contentBlock,
      scriptBlock,
    };
  });
}

async function listDocEntries(): Promise<DocEntry[]> {
  const byName = new Map<string, DocEntry>();

  for (const dir of docsDirCandidates) {
    try {
      const files = await readdir(dir);
      for (const file of files) {
        if (!file.toLowerCase().endsWith(".md")) {
          continue;
        }
        if (file.toLowerCase() === "readme.md") {
          continue;
        }
        if (!byName.has(file)) {
          byName.set(file, { name: file, fullPath: path.join(dir, file) });
        }
      }
    } catch {
      // Ignore missing directories.
    }
  }

  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function loadProposalDeckData(preferredDoc?: string): Promise<ProposalDeckData> {
  let sourceDoc = "inline-default";
  let rawMarkdown = "";

  const docEntries = await listDocEntries();
  if (docEntries.length > 0) {
    const safePreferred = preferredDoc ? normalizeDocName(preferredDoc) : null;
    const preferredDefault = "structure-aware_adaptive_RAG_slides.md";
    const defaultEntry = docEntries.find((entry) => entry.name === preferredDefault);
    const selected =
      (safePreferred ? docEntries.find((entry) => entry.name === safePreferred) : undefined) ??
      defaultEntry ??
      docEntries[0];
    sourceDoc = selected.name;
    rawMarkdown = await readFile(selected.fullPath, "utf-8");
  }

  const deckTitle = extractDeckTitle(rawMarkdown);
  const langBlock = getLanguageBlock(rawMarkdown);

  const s1 = extractContentArea(extractSlideSection(langBlock, 1));
  const s2 = extractContentArea(extractSlideSection(langBlock, 2));
  const s3 = extractContentArea(extractSlideSection(langBlock, 3));
  const s4 = extractContentArea(extractSlideSection(langBlock, 4));
  const s5 = extractContentArea(extractSlideSection(langBlock, 5));
  const s6 = extractContentArea(extractSlideSection(langBlock, 6));

  const s4Mermaid = extractMermaidBlock(s4);

  return {
    meta: {
      deckTitle,
      sourceDoc,
    },
    slide1: {
      title: extractTitleFromContent(s1, "Structure-Aware Adaptive RAG"),
      objectives: extractBulletsAfterLabel(s1, ["Research Objectives"]),
      coreQuestion: extractCoreQuestion(s1),
      flowKeywords: extractFlowKeywords(s1),
    },
    slide2: {
      title: extractTitleFromContent(s2, "Why is this problem hard?"),
      exampleQuestions: extractBulletsAfterLabel(s2, ["Example questions"]).slice(0, 4),
      difficulties: extractBulletsAfterLabel(s2, ["Difficulty"]).slice(0, 4),
    },
    slide3: {
      title: extractTitleFromContent(s3, "Limitations of Existing Methods"),
      groups: extractLimitations(s3),
    },
    slide4: {
      title: extractTitleFromContent(s4, "Proposed Idea: Structure-Aware Adaptive RAG"),
      structureAware: extractBulletsAfterLabel(s4, ["Structure-aware retrieval"]).slice(0, 6),
      pipelineText: [
        "Input Query",
        "Query Complexity Classifier",
        "Simple -> Lightweight RAG / Complex -> Structure-aware Retrieval + Reranking",
        "Evidence-grounded Generation",
        "Answer + Article Citations",
      ],
      pipelineFigure: {
        input: extractNodeLabel(s4Mermaid, "Q", "Input New Query"),
        classifier: extractNodeLabel(s4Mermaid, "C", "Query Complexity Classifier"),
        lightPath: extractNodeLabel(s4Mermaid, "LR", "Lightweight RAG"),
        complexPath: extractNodeLabel(s4Mermaid, "SR", "Structure-aware Retrieval + Reranking"),
        evidence: extractNodeLabel(s4Mermaid, "EG", "Evidence-grounded Generation"),
        answer: extractNodeLabel(s4Mermaid, "A", "Answer + Article Citations"),
      },
    },
    slide5: {
      title: extractTitleFromContent(s5, "Experiment Plan"),
      datasets: extractBulletsAfterLabel(s5, ["1️⃣ Dataset", "Dataset"]).slice(0, 6),
      questionTypes: extractBulletsAfterLabel(s5, ["2️⃣ Question types", "Question types"]).slice(0, 6),
      baselines: extractBulletsAfterLabel(s5, ["3️⃣ Baselines", "Baselines"]).slice(0, 8),
    },
    slide6: {
      title: extractTitleFromContent(s6, "Evaluation and Expected Contribution"),
      metrics: extractBulletsAfterLabel(s6, ["📊 Evaluation Metrics", "Evaluation Metrics"]).slice(0, 6),
      researchQuestions: extractBulletsAfterLabel(s6, ["❓ Research Questions", "Research Questions"]).slice(0, 6),
      contributions: extractBulletsAfterLabel(s6, ["✨ Expected Contribution", "Expected Contribution"]).slice(0, 6),
      references: extractReferences(s6).slice(0, 5),
    },
  };
}

export async function loadMSVLADeckData(preferredDoc?: string): Promise<MSVLADeckData> {
  let sourceDoc = "inline-default";
  let rawMarkdown = "";

  const docEntries = await listDocEntries();
  if (docEntries.length > 0) {
    const safePreferred = preferredDoc ? normalizeDocName(preferredDoc) : null;
    const preferredDefault = "ms-vla.md";
    const defaultEntry = docEntries.find((entry) => entry.name === preferredDefault);
    const selected =
      (safePreferred ? docEntries.find((entry) => entry.name === safePreferred) : undefined) ??
      defaultEntry ??
      docEntries[0];

    sourceDoc = selected.name;
    rawMarkdown = await readFile(selected.fullPath, "utf-8");
  }

  const deckTitle = extractDeckTitle(rawMarkdown);
  const langBlock = getLanguageBlock(rawMarkdown);
  const slides = parseMSVLASlides(langBlock);

  return {
    meta: {
      deckTitle,
      sourceDoc,
    },
    slides,
  };
}

export async function listProposalDocs(): Promise<string[]> {
  const entries = await listDocEntries();
  return entries.map((entry) => entry.name);
}
