import { createLine } from "./createLine";
import type { LessonStep, OpeningDefinition } from "./types";

// Against 1. e4: through 3...d6
const modernE4Start: LessonStep[] = [
  ["e4", "Begin by advancing your king's pawn two squares."],
  ["g6", "Advance your g-pawn one square."],
  ["d4", "Advance your queen's pawn two squares."],
  ["Bg7", "Develop your king's bishop behind the advanced g-pawn."],
  ["Nc3", "Develop your queenside knight toward the center."],
  ["d6", "Advance your queen's pawn one square."],
];

const modernE4Development = createLine(
  "modern-e4-development",
  "Natural development and queenside expansion",
  "Practice White's two-knight setup and Black's queenside expansion with ...a6 and ...b5.",
  [
    ...modernE4Start,
    ["Nf3", "Develop your kingside knight toward the center."],
    ["a6", "Advance your a-pawn one square."],
    ["Be2", "Develop your king's bishop onto the e-file."],
    ["b5", "Advance your b-pawn two squares."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["Bb7", "Develop your queenside bishop behind the advanced b-pawn."],
    ["Re1", "Move the rook beside your king onto the e-file."],
    ["Nd7", "Develop your queenside knight onto the d-file."],
  ],
);

const modernE4F4 = createLine(
  "modern-e4-f4-center",
  "White builds a center with f4",
  "Practice a more ambitious White pawn setup while Black develops on the queenside.",
  [
    ...modernE4Start,
    ["f4", "Advance your f-pawn two squares."],
    ["a6", "Advance your a-pawn one square."],
    ["Nf3", "Develop your kingside knight toward the center."],
    ["b5", "Advance your b-pawn two squares."],
    ["Bd3", "Develop your king's bishop onto the d-file."],
    ["Bb7", "Develop your queenside bishop behind the advanced b-pawn."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["Nd7", "Develop your queenside knight onto the d-file."],
  ],
);

// Against 1. d4: through 2...Bg7
const modernD4Start: LessonStep[] = [
  ["d4", "Begin by advancing your queen's pawn two squares."],
  ["g6", "Advance your g-pawn one square."],
  ["c4", "Advance your c-pawn two squares."],
  ["Bg7", "Develop your king's bishop behind the advanced g-pawn."],
];

const modernD4BroadCenter = createLine(
  "modern-d4-broad-center",
  "White builds a broad pawn center",
  "Practice a setup with White's c-, d-, and e-pawns advanced, followed by a central pawn lock.",
  [
    ...modernD4Start,
    ["Nc3", "Develop your queenside knight toward the center."],
    ["d6", "Advance your queen's pawn one square."],
    ["e4", "Advance your king's pawn two squares."],
    ["Nc6", "Develop your queenside knight toward the center."],
    ["Be3", "Develop your queenside bishop onto the e-file."],
    ["e5", "Advance your king's pawn two squares."],
    ["d5", "Advance your d-pawn one more square."],
    ["Nce7", "Move your developed queenside knight back onto the e-file."],
  ],
);

const modernD4Fianchetto = createLine(
  "modern-d4-fianchetto",
  "White develops with a kingside fianchetto",
  "Practice a setup where both players develop their king's bishop behind a g-pawn.",
  [
    ...modernD4Start,
    ["Nf3", "Develop your kingside knight toward the center."],
    ["d6", "Advance your queen's pawn one square."],
    ["g3", "Advance your g-pawn one square."],
    ["Nd7", "Develop your queenside knight onto the d-file."],
    ["Bg2", "Develop your king's bishop behind the advanced g-pawn."],
    ["e5", "Advance your king's pawn two squares."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["Ne7", "Develop your kingside knight onto the e-file."],
    ["Nc3", "Develop your queenside knight toward the center."],
    ["O-O", "Bring your king to safety by castling kingside."],
  ],
);

export const modernOpening: OpeningDefinition = {
  id: "modern-defense",
  name: "Modern Defense",
  groups: [
    {
      id: "modern-against-e4",
      name: "Against 1. e4",
      lines: [modernE4Development, modernE4F4],
    },
    {
      id: "modern-against-d4",
      name: "Against 1. d4",
      lines: [modernD4BroadCenter, modernD4Fianchetto],
    },
  ],
};
