import { createLine } from "./createLine";
import type { LessonStep, OpeningDefinition } from "./types";

// Shared beginning: 1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4
const scotchStart: LessonStep[] = [
  ["e4", "Begin by advancing your king's pawn two squares."],
  ["e5", "Answer with a two-square advance of your king's pawn."],
  ["Nf3", "Develop your kingside knight toward the center."],
  ["Nc6", "Develop your queenside knight toward the center."],
  ["d4", "Advance your queen's pawn two squares."],
  ["exd4", "Capture the advanced central pawn with your e-pawn."],
  ["Nxd4", "Recapture with your developed knight."],
];

// Classical: through 4...Bc5
const classicalStart: LessonStep[] = [
  ...scotchStart,
  ["Bc5", "Develop your king's bishop toward White's kingside."],
];

const classicalDevelopment = createLine(
  "scotch-classical-development",
  "Traditional development",
  "Practice the Classical Scotch setup with Be3, c3, and kingside castling.",
  [
    ...classicalStart,
    ["Be3", "Develop your queenside bishop onto the e-file."],
    ["Qf6", "Develop your queen onto the f-file."],
    ["c3", "Advance your c-pawn one square."],
    ["Nge7", "Develop your kingside knight onto the e-file."],
    ["Bc4", "Develop your king's bishop toward Black's kingside."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["Bb6", "Retreat your developed bishop one square toward the queenside."],
  ],
);

const classicalPotter = createLine(
  "scotch-classical-potter",
  "Potter Variation — knight retreat",
  "Practice the Nb3 retreat and a continuation with opposite-side castling.",
  [
    ...classicalStart,
    ["Nb3", "Retreat your central knight onto the b-file."],
    ["Bb6", "Retreat your developed bishop one square toward the queenside."],
    ["Nc3", "Develop your remaining knight toward the center."],
    ["d6", "Advance your queen's pawn one square."],
    ["Qe2", "Move your queen onto the e-file."],
    ["Nge7", "Develop your kingside knight onto the e-file."],
    ["Be3", "Develop your queenside bishop onto the e-file."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["O-O-O", "Castle on the queenside in this line."],
    ["f5", "Advance your f-pawn two squares."],
  ],
);

// Schmidt: through 4...Nf6
const schmidtStart: LessonStep[] = [
  ...scotchStart,
  ["Nf6", "Develop your kingside knight toward the center."],
];

const schmidtMieses = createLine(
  "scotch-schmidt-mieses",
  "Mieses Variation — central advance",
  "Practice the knight exchange followed by White's e5 and c4 advances.",
  [
    ...schmidtStart,
    ["Nxc6", "Exchange your central knight for Black's queenside knight."],
    ["bxc6", "Recapture with your b-pawn."],
    ["e5", "Advance your remaining central pawn one square."],
    ["Qe7", "Move your queen onto the e-file."],
    ["Qe2", "Move your queen onto the e-file."],
    ["Nd5", "Move your developed knight into the center."],
    ["c4", "Advance your c-pawn two squares."],
    ["Ba6", "Develop your queenside bishop onto the a-file."],
  ],
);

const fourKnightsDevelopment = createLine(
  "scotch-four-knights-development",
  "Four Knights — exchanges and castling",
  "Reach the Scotch Four Knights position and practice central exchanges before castling.",
  [
    ...schmidtStart,
    ["Nc3", "Develop your queenside knight toward the center."],
    ["Bb4", "Develop your king's bishop toward White's queenside."],
    ["Nxc6", "Exchange your central knight for Black's queenside knight."],
    ["bxc6", "Recapture with your b-pawn."],
    ["Bd3", "Develop your king's bishop onto the d-file."],
    ["d5", "Advance your queen's pawn two squares."],
    ["exd5", "Capture in the center with your e-pawn."],
    ["cxd5", "Recapture with the pawn on the c-file."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["O-O", "Bring your king to safety by castling kingside."],
  ],
);

export const scotchOpening: OpeningDefinition = {
  id: "scotch-game",
  name: "Scotch Game",
  groups: [
    {
      id: "scotch-classical",
      name: "Classical — 4...Bc5",
      lines: [classicalDevelopment, classicalPotter],
    },
    {
      id: "scotch-schmidt",
      name: "Schmidt — 4...Nf6",
      lines: [schmidtMieses],
    },
    {
      id: "scotch-four-knights",
      name: "Four Knights — transposition",
      lines: [fourKnightsDevelopment],
    },
  ],
};
