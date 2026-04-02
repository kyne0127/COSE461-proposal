import { ProposalDeck } from "@/components/ProposalDeck";
import { loadProposalDeckData } from "@/lib/proposalDoc";

type HomeProps = {
  searchParams?: Promise<{
    doc?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const resolvedSearchParams = await searchParams;
  const requestedDoc = Array.isArray(resolvedSearchParams?.doc)
    ? resolvedSearchParams?.doc[0]
    : resolvedSearchParams?.doc;

  const data = await loadProposalDeckData(requestedDoc);

  return <ProposalDeck data={data} />;
}
