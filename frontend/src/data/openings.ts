import { italianOpening } from "./openings/italian";
import { modernOpening } from "./openings/modern";
import { scotchOpening } from "./openings/scotch";
import { frenchOpening } from "./openings/french";

import type {
  LearnerColor,
  OpeningDefinition,
  OpeningLesson,
  PracticeSelection,
} from "./openings/types";

export type {
  LearnerColor,
  LessonStep,
  OpeningDefinition,
  OpeningLesson,
  PracticeLine,
  PracticeSelection,
  VariationGroup,
} from "./openings/types";

export const openingCatalog: [OpeningDefinition, ...OpeningDefinition[]] = [
  italianOpening,
  modernOpening,
  scotchOpening,
  frenchOpening,
];

export const defaultLineId = italianOpening.groups[0].lines[0].id;

export function getPracticeSelection(lineId: string): PracticeSelection {
  for (const opening of openingCatalog) {
    for (const group of opening.groups) {
      const line = group.lines.find((candidate) => candidate.id === lineId);

      if (line) {
        return {
          opening,
          group,
          line,
        };
      }
    }
  }

  throw new Error(`Unknown practice line: "${lineId}".`);
}

export function createOpeningLesson(
  selection: PracticeSelection,
  learnerColor: LearnerColor,
): OpeningLesson {
  const { opening, group, line } = selection;

  return {
    id: line.id,
    name: opening.name,
    variation: `${group.name} — ${line.name}`,
    learnerColor,
    description: line.description,
    moves: line.moves,
    hints: line.hints,
  };
}

// Preserve compatibility with existing imports.
export const italianGameLesson = createOpeningLesson(
  getPracticeSelection(defaultLineId),
  "w",
);
