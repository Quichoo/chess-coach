export type LearnerColor = "w" | "b";

export type OpeningLesson = {
  id: string;
  name: string;
  variation: string;
  learnerColor: LearnerColor;
  description: string;
  moves: string[];
  hints: Partial<Record<number, string>>;
};

export type PracticeLine = {
  id: string;
  name: string;
  description: string;
  moves: string[];
  hints: Partial<Record<number, string>>;
};

export type VariationGroup = {
  id: string;
  name: string;
  lines: [PracticeLine, ...PracticeLine[]];
};

export type OpeningDefinition = {
  id: string;
  name: string;
  groups: [VariationGroup, ...VariationGroup[]];
};

export type PracticeSelection = {
  opening: OpeningDefinition;
  group: VariationGroup;
  line: PracticeLine;
};

export type LessonStep = [san: string, hint: string];
