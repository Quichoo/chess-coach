import { createLine } from "./createLine";
import type { LessonStep, OpeningDefinition } from "./types";

// King's English, Four Knights setup: 1. c4 e5 2. Nc3 Nf6 3. Nf3 Nc6
const fourKnightsStart: LessonStep[] = [
  ["c4", "Advance your queen's bishop pawn two squares."],
  ["e5", "Challenge White's center with your king's pawn."],
  ["Nc3", "Develop your queenside knight toward the center."],
  ["Nf6", "Develop your kingside knight toward the center."],
  ["Nf3", "Develop your kingside knight toward the center."],
  ["Nc6", "Develop your queenside knight toward the center."],
];

const fourKnightsDevelopment = createLine(
  "english-four-knights-development",
  "King's English — Four Knights",
  "Practice the Four Knights setup with natural development and central tension.",
  [
    ...fourKnightsStart,
    ["d4", "Advance your queen's pawn two squares."],
    ["exd4", "Capture White's central pawn with your e-pawn."],
    ["Nxd4", "Recapture with your developed knight."],
    ["Bb4", "Develop your king's bishop toward White's queenside."],
    ["Qd3", "Develop your queen onto the d-file."],
    ["O-O", "Bring your king to safety by castling kingside."],
  ],
);

// Symmetrical English: 1. c4 c5 2. Nc3 Nc6 3. g3 g6
const symmetricalStart: LessonStep[] = [
  ["c4", "Advance your queen's bishop pawn two squares."],
  ["c5", "Mirror White's first move with your queen's bishop pawn."],
  ["Nc3", "Develop your queenside knight toward the center."],
  ["Nc6", "Develop your queenside knight toward the center."],
  ["g3", "Prepare a kingside fianchetto for your king's bishop."],
  ["g6", "Prepare a kingside fianchetto for your king's bishop."],
];

const symmetricalDevelopment = createLine(
  "english-symmetrical-development",
  "Symmetrical English",
  "Practice the mirror-image setup with mutual fianchettoes and quiet maneuvering.",
  [
    ...symmetricalStart,
    ["Bg2", "Complete your kingside fianchetto."],
    ["Bg7", "Complete your kingside fianchetto."],
    ["Nf3", "Develop your kingside knight toward the center."],
    ["Nf6", "Develop your kingside knight toward the center."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["O-O", "Bring your king to safety by castling kingside."],
  ],
);

// Reversed Sicilian setup: 1. c4 e5 2. Nc3 Nf6 3. g3 d5 4. cxd5 Nxd5
const reversedSicilianStart: LessonStep[] = [
  ["c4", "Advance your queen's bishop pawn two squares."],
  ["e5", "Challenge White's center with your king's pawn."],
  ["Nc3", "Develop your queenside knight toward the center."],
  ["Nf6", "Develop your kingside knight toward the center."],
  ["g3", "Prepare a kingside fianchetto for your king's bishop."],
  ["d5", "Strike in the center with your queen's pawn."],
  ["cxd5", "Capture Black's central pawn with your c-pawn."],
  ["Nxd5", "Recapture with your developed knight."],
];

const reversedSicilian = createLine(
  "english-reversed-sicilian",
  "Reversed Sicilian Setup",
  "Practice the English transposition into a reversed Sicilian structure.",
  [
    ...reversedSicilianStart,
    ["Bg2", "Complete your kingside fianchetto."],
    ["Nb6", "Retreat your knight to safety and keep an eye on c4."],
    ["Nf3", "Develop your kingside knight toward the center."],
    ["Nc6", "Develop your queenside knight toward the center."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["Be7", "Develop your king's bishop onto the e-file."],
    ["d3", "Support your central pawns and free your pieces."],
    ["O-O", "Bring your king to safety by castling kingside."],
  ],
);

export const englishOpening: OpeningDefinition = {
  id: "english-opening",
  name: "English Opening",
  groups: [
    {
      id: "english-main-line",
      name: "Main Line — 3...d5",
      lines: [reversedSicilian],
    },
    {
      id: "english-four-knights",
      name: "King's English — Four Knights",
      lines: [fourKnightsDevelopment],
    },
    {
      id: "english-symmetrical",
      name: "Symmetrical English",
      lines: [symmetricalDevelopment],
    },
  ],
};
