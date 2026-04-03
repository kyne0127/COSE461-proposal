import { MSVLADeck } from "../components/msvla/MSVLADeck";
import { ProposalDeck } from "../components/ProposalDeck";
import { SupplementaryDeck } from "../components/supplementary/SupplementaryDeck";
import { listProposalDocs, loadMSVLADeckData, loadProposalDeckData, loadSupplementaryDeckData } from "../lib/proposalDoc";

type HomeProps = {
  searchParams?: Promise<{
    doc?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const docOptions = await listProposalDocs();
  const requestedDocRaw = Array.isArray(resolvedSearchParams?.doc)
    ? resolvedSearchParams?.doc[0]
    : resolvedSearchParams?.doc;
  const requestedDoc = requestedDocRaw ?? docOptions[0] ?? "01_ms-vla.md";

  const requestedDocLower = (requestedDoc ?? "").toLowerCase();
  const isSupplementary = requestedDocLower.includes("supplementary");
  const isMSVLA = requestedDocLower.includes("ms-vla");

  if (isSupplementary) {
    const supplementaryData = await loadSupplementaryDeckData(requestedDoc);
    return <SupplementaryDeck data={supplementaryData} currentDoc={requestedDoc} docOptions={docOptions} />;
  }

  if (isMSVLA) {
    const msvlaData = await loadMSVLADeckData(requestedDoc);
    return <MSVLADeck data={msvlaData} currentDoc={requestedDoc} docOptions={docOptions} />;
  }

  const data = await loadProposalDeckData(requestedDoc);

  return <ProposalDeck data={data} currentDoc={requestedDoc} docOptions={docOptions} />;
}
