import { createLine } from "./createLine";
import type { LessonStep, OpeningDefinition } from "./types";

// Shared beginning: 1. e4 e5 2. Nf3 Nc6 3. Bc4
const italianStart: LessonStep[] = [
  ["e4", "Begin by advancing your king's pawn two squares."],
  ["e5", "Answer with a two-square advance of your king's pawn."],
  ["Nf3", "Develop your kingside knight toward the center."],
  ["Nc6", "Develop your queenside knight toward the center."],
  ["Bc4", "Develop your king's bishop toward Black's kingside."],
];

// Quiet Italian: through 6. O-O
const quietItalianStart: LessonStep[] = [
  ...italianStart,
  ["Bc5", "Develop your king's bishop toward White's kingside."],
  ["c3", "Advance your c-pawn one square."],
  ["Nf6", "Develop your kingside knight toward the center."],
  ["d3", "Use a one-square advance of your queen's pawn."],
  ["d6", "Use a one-square advance of your queen's pawn."],
  ["O-O", "Bring your king to safety by castling kingside."],
];

const quietItalian = createLine(
  "italian-game-giuoco-piano",
  "Central preparation and castling",
  "Build a quiet Italian setup with central preparation, development, and castling.",
  [...quietItalianStart, ["O-O", "Complete this setup by castling kingside."]],
);

const quietBishopRetreat = createLine(
  "italian-quiet-bishop-retreat",
  "Bishop retreat and rook development",
  "Practice a quiet setup with bishop retreats and a rook move to the e-file.",
  [
    ...quietItalianStart,
    ["a6", "Advance your a-pawn one square."],
    ["Bb3", "Retreat your developed bishop one square toward the queenside."],
    ["Ba7", "Retreat your developed bishop to the a-file."],
    ["Re1", "Move the rook beside your king onto the e-file."],
    ["O-O", "Bring your king to safety by castling kingside."],
  ],
);

const quietBishopPin = createLine(
  "italian-quiet-bishop-pin",
  "Responding to the bishop pin",
  "Practice a quiet Italian setup that introduces a bishop pin and a pawn challenge.",
  [
    ...quietItalianStart,
    ["O-O", "Bring your king to safety by castling kingside."],
    ["Re1", "Move the rook beside your king onto the e-file."],
    ["Bg4", "Develop your queenside bishop toward White's kingside."],
    ["h3", "Advance your h-pawn one square."],
    ["Bh5", "Retreat the bishop on the kingside by one diagonal step."],
  ],
);

// Classical Italian: through 6. cxd4
const classicalItalianStart: LessonStep[] = [
  ...italianStart,
  ["Bc5", "Develop your king's bishop toward White's kingside."],
  ["c3", "Advance your c-pawn one square before expanding in the center."],
  ["Nf6", "Develop your kingside knight toward the center."],
  ["d4", "Advance your queen's pawn two squares."],
  ["exd4", "Use your e-pawn to capture in the center."],
  ["cxd4", "Recapture with the pawn from the c-file."],
];

const classicalBishopExchange = createLine(
  "italian-classical-bishop-exchange",
  "Bishop exchange and central counterplay",
  "Practice central exchanges, a response to check, and Black's central counterplay.",
  [
    ...classicalItalianStart,
    ["Bb4+", "Move your developed bishop toward White's queenside with check."],
    ["Bd2", "Answer the check by developing your queenside bishop."],
    ["Bxd2+", "Exchange your developed bishop for White's bishop."],
    ["Nbxd2", "Recapture with your queenside knight."],
    ["d5", "Advance your queen's pawn two squares."],
    ["exd5", "Use your e-pawn to capture the advanced central pawn."],
    ["Nxd5", "Recapture with your knight from the kingside."],
  ],
);

const classicalBishopRetreat = createLine(
  "italian-classical-bishop-retreat",
  "Black retreats the bishop",
  "Continue the central advance with a bishop retreat and normal development.",
  [
    ...classicalItalianStart,
    ["Bb6", "Retreat your developed bishop one square toward the queenside."],
    ["Nc3", "Develop your queenside knight toward the center."],
    ["d6", "Advance your queen's pawn one square."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["O-O", "Bring your king to safety by castling kingside."],
  ],
);

// Two Knights — Quiet: through 4. d3
const twoKnightsQuietStart: LessonStep[] = [
  ...italianStart,
  ["Nf6", "Develop your kingside knight before moving your bishop."],
  ["d3", "Choose a quiet setup by advancing your queen's pawn one square."],
];

const twoKnightsTransposition = createLine(
  "italian-two-knights-quiet-transposition",
  "Return to the quiet Italian setup",
  "Reach the familiar quiet Italian position through a different move order.",
  [
    ...twoKnightsQuietStart,
    ["Bc5", "Develop your king's bishop toward White's kingside."],
    ["c3", "Advance your c-pawn one square."],
    ["d6", "Advance your queen's pawn one square."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["O-O", "Complete the setup by castling kingside."],
  ],
);

const twoKnightsBe7 = createLine(
  "italian-two-knights-quiet-be7",
  "Black develops with ...Be7",
  "Practice the quiet Two Knights setup with Black's bishop developed to e7.",
  [
    ...twoKnightsQuietStart,
    ["Be7", "Develop your king's bishop close to home on the e-file."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["Re1", "Move the rook beside your king onto the e-file."],
    ["d6", "Advance your queen's pawn one square."],
  ],
);

const twoKnightsFianchetto = createLine(
  "italian-two-knights-quiet-fianchetto",
  "Black develops with ...g6 and ...Bg7",
  "Meet a kingside fianchetto: a bishop developed behind the advanced g-pawn.",
  [
    ...twoKnightsQuietStart,
    ["h6", "Advance your h-pawn one square."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["d6", "Advance your queen's pawn one square."],
    ["c3", "Advance your c-pawn one square."],
    ["g6", "Advance your g-pawn one square."],
    ["Re1", "Move the rook beside your king onto the e-file."],
    ["Bg7", "Develop your king's bishop behind the advanced g-pawn."],
    ["Nbd2", "Develop your queenside knight to the second rank."],
    ["O-O", "Complete this setup by castling kingside."],
  ],
);

// Two Knights — Knight Attack: through 7...bxc6
const knightAttackStart: LessonStep[] = [
  ...italianStart,
  ["Nf6", "Develop your kingside knight before moving your bishop."],
  ["Ng5", "Move your developed knight forward onto the g-file."],
  ["d5", "Answer with a two-square advance of your queen's pawn."],
  ["exd5", "Use your e-pawn to capture in the center."],
  ["Na5", "Move your queenside knight toward the edge of the board."],
  ["Bb5+", "Move your developed bishop one diagonal step with check."],
  ["c6", "Answer the check by advancing your c-pawn one square."],
  ["dxc6", "Capture with your advanced pawn from the d-file."],
  ["bxc6", "Recapture with the pawn from the b-file."],
];

const knightAttackBe2 = createLine(
  "italian-two-knights-na5",
  "Bishop retreat to e2",
  "Continue the ...Na5 line with Be2 and practice responding to Black's counterplay.",
  [
    ...knightAttackStart,
    ["Be2", "Retreat your developed bishop to the e-file."],
    ["h6", "Advance your h-pawn one square."],
    ["Nf3", "Bring your advanced knight back toward its earlier square."],
    ["e4", "Advance your remaining central pawn one square."],
    ["Ne5", "Move your developed knight forward onto the e-file."],
    ["Bd6", "Develop your king's bishop toward the center."],
  ],
);

const knightAttackBd3 = createLine(
  "italian-two-knights-bd3",
  "Bishop retreat to d3",
  "Practice an alternative bishop retreat in the ...Na5 line, followed by development.",
  [
    ...knightAttackStart,
    ["Bd3", "Retreat your developed bishop to the d-file."],
    ["Nd5", "Move your kingside knight into the center."],
    ["Nf3", "Bring your advanced knight back toward its earlier square."],
    ["Bd6", "Develop your king's bishop toward the center."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["O-O", "Bring your king to safety by castling kingside."],
  ],
);

export const italianOpening: OpeningDefinition = {
  id: "italian-game",
  name: "Italian Game",
  groups: [
    {
      id: "quiet-italian",
      name: "Quiet Italian",
      lines: [quietItalian, quietBishopRetreat, quietBishopPin],
    },
    {
      id: "classical-italian",
      name: "Classical Italian",
      lines: [classicalBishopExchange, classicalBishopRetreat],
    },
    {
      id: "two-knights-quiet",
      name: "Two Knights — Quiet",
      lines: [twoKnightsTransposition, twoKnightsBe7, twoKnightsFianchetto],
    },
    {
      id: "two-knights-knight-attack",
      name: "Two Knights — Knight Attack",
      lines: [knightAttackBe2, knightAttackBd3],
    },
  ],
};
