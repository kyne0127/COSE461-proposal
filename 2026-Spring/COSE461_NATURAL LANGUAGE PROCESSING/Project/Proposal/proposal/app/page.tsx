import { MSVLADeck } from "@/components/MSVLADeck";
import { ProposalDeck } from "@/components/ProposalDeck";
import { listProposalDocs, loadMSVLADeckData, loadProposalDeckData } from "@/lib/proposalDoc";

type HomeProps = {
  searchParams?: Promise<{
    doc?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const requestedDocRaw = Array.isArray(resolvedSearchParams?.doc)
    ? resolvedSearchParams?.doc[0]
    : resolvedSearchParams?.doc;
  const requestedDoc = requestedDocRaw ?? "ms-vla.md";
  const docOptions = await listProposalDocs();

  const isMSVLA = (requestedDoc ?? "").toLowerCase() === "ms-vla.md";
  if (isMSVLA) {
    const msvlaData = await loadMSVLADeckData(requestedDoc);
    return <MSVLADeck data={msvlaData} currentDoc={requestedDoc} docOptions={docOptions} />;
  }

  const data = await loadProposalDeckData(requestedDoc);

  return <ProposalDeck data={data} currentDoc={requestedDoc} docOptions={docOptions} />;
}
