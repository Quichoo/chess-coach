import { createLine } from "./createLine";
import type { LessonStep, OpeningDefinition } from "./types";

// Shared beginning: 1. e4 e6 2. d4 d5
const frenchStart: LessonStep[] = [
  ["e4", "Begin by advancing your king's pawn two squares."],
  ["e6", "Advance your king's pawn one square."],
  ["d4", "Advance your queen's pawn two squares."],
  ["d5", "Advance your queen's pawn two squares."],
];

const exchangeDevelopment = createLine(
  "french-exchange-development",
  "Symmetrical development and castling",
  "Practice the Exchange French with straightforward development and kingside castling.",
  [
    ...frenchStart,
    ["exd5", "Capture Black's central pawn with your e-pawn."],
    ["exd5", "Recapture with your e-pawn."],
    ["Nf3", "Develop your kingside knight toward the center."],
    ["Nf6", "Develop your kingside knight toward the center."],
    ["Bd3", "Develop your king's bishop onto the d-file."],
    ["Bd6", "Develop your king's bishop onto the d-file."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["O-O", "Bring your king to safety by castling kingside."],
  ],
);

const advanceQueenside = createLine(
  "french-advance-queenside",
  "Central pawn chains and queenside play",
  "Practice the Advance French with c3, Black's ...Qb6 development, and a queenside pawn lock.",
  [
    ...frenchStart,
    ["e5", "Advance your e-pawn one more square."],
    ["c5", "Advance your c-pawn two squares."],
    ["c3", "Advance your c-pawn one square."],
    ["Nc6", "Develop your queenside knight toward the center."],
    ["Nf3", "Develop your kingside knight toward the center."],
    ["Qb6", "Develop your queen onto the b-file."],
    ["a3", "Advance your a-pawn one square."],
    ["c4", "Advance your c-pawn one more square."],
  ],
);

const tarraschOpenCenter = createLine(
  "french-tarrasch-open-center",
  "The ...c5 reply and central exchanges",
  "Practice the Tarrasch knight setup and an open-center continuation after Black's ...c5.",
  [
    ...frenchStart,
    ["Nd2", "Develop your queenside knight onto the second rank."],
    ["c5", "Advance your c-pawn two squares."],
    ["exd5", "Capture Black's central pawn with your e-pawn."],
    ["exd5", "Recapture with your e-pawn."],
    ["Ngf3", "Develop your kingside knight toward the center."],
    ["Nc6", "Develop your queenside knight toward the center."],
    ["Bb5", "Develop your king's bishop toward Black's queenside."],
    ["Bd6", "Develop your king's bishop onto the d-file."],
    ["dxc5", "Capture with your remaining central pawn."],
    ["Bxc5", "Recapture with your developed bishop."],
    ["O-O", "Bring your king to safety by castling kingside."],
    ["Ne7", "Develop your kingside knight onto the e-file."],
  ],
);

const classicalBishopExchange = createLine(
  "french-classical-bishop-exchange",
  "Bishop exchange and central space",
  "Practice the Classical French with Bg5, an e5 advance, and an exchange of bishops.",
  [
    ...frenchStart,
    ["Nc3", "Develop your queenside knight toward the center."],
    ["Nf6", "Develop your kingside knight toward the center."],
    ["Bg5", "Develop your queenside bishop toward Black's kingside."],
    ["Be7", "Develop your king's bishop onto the e-file."],
    ["e5", "Advance your e-pawn one more square."],
    ["Nfd7", "Retreat your developed kingside knight onto the d-file."],
    ["Bxe7", "Exchange your developed bishop for Black's bishop."],
    ["Qxe7", "Recapture with your queen."],
    ["f4", "Advance your f-pawn two squares."],
    ["O-O", "Bring your king to safety by castling kingside."],
  ],
);

const winawerBishopExchange = createLine(
  "french-winawer-bishop-exchange",
  "Bishop-for-knight exchange",
  "Practice the Winawer's characteristic exchange on c3 and the resulting pawn structure.",
  [
    ...frenchStart,
    ["Nc3", "Develop your queenside knight toward the center."],
    ["Bb4", "Develop your king's bishop toward White's queenside."],
    ["e5", "Advance your e-pawn one more square."],
    ["c5", "Advance your c-pawn two squares."],
    ["a3", "Advance your a-pawn one square."],
    ["Bxc3+", "Exchange your developed bishop for White's knight."],
    ["bxc3", "Answer the check by recapturing with your b-pawn."],
    ["Ne7", "Develop your kingside knight onto the e-file."],
    ["Nf3", "Develop your remaining knight toward the center."],
    ["Bd7", "Develop your remaining bishop onto the d-file."],
  ],
);

export const frenchOpening: OpeningDefinition = {
  id: "french-defense",
  name: "French Defense",
  groups: [
    {
      id: "french-exchange",
      name: "Exchange Variation",
      lines: [exchangeDevelopment],
    },
    {
      id: "french-advance",
      name: "Advance Variation",
      lines: [advanceQueenside],
    },
    {
      id: "french-tarrasch",
      name: "Tarrasch Variation",
      lines: [tarraschOpenCenter],
    },
    {
      id: "french-classical",
      name: "Classical Variation",
      lines: [classicalBishopExchange],
    },
    {
      id: "french-winawer",
      name: "Winawer Variation",
      lines: [winawerBishopExchange],
    },
  ],
};
