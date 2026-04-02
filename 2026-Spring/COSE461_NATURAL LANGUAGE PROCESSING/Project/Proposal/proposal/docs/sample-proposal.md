deck_title: Efficient NLP Research Proposal
presenter: Seongmin
affiliation: COSE461 Natural Language Processing
date: 2026-04-02

## Hero
topic: Cost-Efficient Domain Adaptation for Korean Academic QA
subtitle: We propose a lightweight adaptation strategy that improves factual QA in low-resource domains while reducing inference cost.
highlight: NLP Proposal
keywords:
- Domain Adaptation
- Retrieval-Augmented Generation
- Efficiency

## About
problem: Current QA systems underperform on domain-specific Korean academic regulations due to sparse supervision and terminology shift.
gap: Prior studies optimize either quality or efficiency, but rarely provide a balanced framework under realistic budget constraints.
objectives:
- Define a robust evaluation set for Korean academic policy QA.
- Build a compact adaptation pipeline with retrieval and distilled generation.
- Compare against full-scale baselines under equal compute budgets.

## Portfolio
method_overview: Our pipeline combines targeted document preprocessing, retrieval tuning, and compact generation with iterative error analysis.
modules:
- Corpus Construction
- Retriever Fine-tuning
- Distilled Generator
- Failure Pattern Analysis
datasets:
- Internal Regulation Corpus
- KLUE-based Transfer Set
- Human Curated QA Set
images:
- https://picsum.photos/seed/proposal-1/600/600?grayscale
- https://picsum.photos/seed/proposal-2/600/600?grayscale
- https://picsum.photos/seed/proposal-3/600/600?grayscale
- https://picsum.photos/seed/proposal-4/600/600?grayscale

## Testimonial
hypothesis: A retrieval-focused compact model can achieve near-baseline answer quality with significantly lower latency and cost.
contributions:
- A practical benchmark for Korean academic QA.
- A reproducible low-cost adaptation recipe.
- Fine-grained error taxonomy for future improvements.
metrics:
- Exact Match / F1
- Average Latency per Query
- Cost per 1K Queries

## Contact
timeline:
- Week 1-2: Related work survey and dataset finalization
- Week 3-6: Model training and retrieval calibration
- Week 7-9: Evaluation and ablation studies
- Week 10: Final report and presentation
references:
- Lewis et al., Retrieval-Augmented Generation, 2020
- Guu et al., REALM, 2020
- Recent Korean QA benchmark papers (2023-2025)
contact_email: seongmin@example.com
