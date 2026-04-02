export type DeckMeta = {
  deckTitle: string;
  sourceDoc: string;
};

export type TitleProblemSlideData = {
  title: string;
  objectives: string[];
  coreQuestion: string;
  flowKeywords: string[];
};

export type HardnessSlideData = {
  title: string;
  exampleQuestions: string[];
  difficulties: string[];
};

export type LimitationGroup = {
  name: string;
  points: string[];
};

export type LimitationsSlideData = {
  title: string;
  groups: LimitationGroup[];
};

export type ProposedIdeaSlideData = {
  title: string;
  structureAware: string[];
  pipelineText: string[];
  pipelineFigure: {
    input: string;
    classifier: string;
    lightPath: string;
    complexPath: string;
    evidence: string;
    answer: string;
  };
};

export type ExperimentSlideData = {
  title: string;
  datasets: string[];
  questionTypes: string[];
  baselines: string[];
};

export type EvaluationSlideData = {
  title: string;
  metrics: string[];
  researchQuestions: string[];
  contributions: string[];
  references: string[];
};

export type ProposalDeckData = {
  meta: DeckMeta;
  slide1: TitleProblemSlideData;
  slide2: HardnessSlideData;
  slide3: LimitationsSlideData;
  slide4: ProposedIdeaSlideData;
  slide5: ExperimentSlideData;
  slide6: EvaluationSlideData;
};

export type MSVLASlideData = {
  slideNo: number;
  heading: string;
  visualGuide: string;
  contentBlock: string;
  scriptBlock: string;
};

export type MSVLADeckData = {
  meta: DeckMeta;
  slides: MSVLASlideData[];
};
