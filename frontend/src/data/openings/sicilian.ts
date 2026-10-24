import { createLine } from "./createLine";
import type { LessonStep, OpeningDefinition } from "./types";

// Shared beginning: 1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6
const sicilianDragonStart: LessonStep[] = [
  ["e4", "Begin by advancing your king's pawn two squares."],
  ["c5", "Challenge White's center with your c-pawn."],
  ["Nf3", "Develop your kingside knight toward the center."],
  ["d6", "Support your c-pawn and prepare ...Nf6."],
  ["d4", "Advance your queen's pawn two squares."],
  ["cxd4", "Capture White's central pawn with your c-pawn."],
  ["Nxd4", "Recapture with your developed knight."],
  ["Nf6", "Develop your kingside knight toward the center."],
  ["Nc3", "Develop your queenside knight toward the center."],
  ["g6", "Prepare a kingside fianchetto for your king's bishop."],
];

// Yugoslav Attack: 6. Be3 Bg7 7. f3 O-O 8. Qd2 Nc6
const yugoslavAttack = createLine(
  "sicilian-dragon-yugoslav-attack",
  "Yugoslav Attack",
  "Practice the sharp Yugoslav Attack with Be3, f3, Qd2, and opposite-side castling.",
  [
    ...sicilianDragonStart,
    ["Be3", "Develop your queenside bishop toward Black's kingside."],
    ["Bg7", "Complete your kingside fianchetto."],
    ["f3", "Prepare g4 and prevent ...Ng4."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["Qd2", "Prepare kingside operations and connect rooks."],
    ["Nc6", "Develop your queenside knight toward the center."],
  ]
);

// Classical Variation: 6. Be2 Bg7 7. O-O O-O
const classicalVariation = createLine(
  "sicilian-dragon-classical",
  "Classical Variation",
  "Practice the solid Classical setup with Be2 and mutual kingside castling.",
  [
    ...sicilianDragonStart,
    ["Be2", "Develop your king's bishop to a solid square."],
    ["Bg7", "Complete your kingside fianchetto."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["O-O", "Bring your king to safety by castling kingside."],
  ]
);

// Levenfish Attack: 6. f4
const levenfishAttack = createLine(
  "sicilian-dragon-levenfish",
  "Levenfish Attack",
  "Practice the aggressive Levenfish Attack with an early f4 advance.",
  [
    ...sicilianDragonStart,
    ["f4", "Launch a direct kingside pawn storm."],
  ]
);

export const sicilianOpening: OpeningDefinition = {
  id: "sicilian-defense",
  name: "Sicilian Defense",
  groups: [
    {
      id: "sicilian-dragon",
      name: "Dragon Variation",
      lines: [yugoslavAttack, classicalVariation, levenfishAttack],
    },
  ],
};