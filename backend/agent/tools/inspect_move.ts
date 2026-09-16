import { defineTool } from "eve/tools";
import { z } from "zod";
import { Chess, SQUARES } from "chess.js";
import type { Color, Move, PieceSymbol, Square } from "chess.js";

const centralSquares: Square[] = ["d4", "e4", "d5", "e5"];

type PieceTarget = {
  square: Square;
  piece: PieceSymbol;
  color: Color;
};

function inspectPiece(game: Chess, source: Square) {
  const piece = game.get(source);

  if (!piece) {
    throw new Error("No piece exists on the inspected square.");
  }

  // Explicitly supply the color: after a move, the turn has changed.
  const controlledSquares = SQUARES.filter((target) =>
    game.attackers(target, piece.color).includes(source),
  );

  const attacks: PieceTarget[] = [];
  const defends: PieceTarget[] = [];

  for (const square of controlledSquares) {
    const target = game.get(square);

    // Kings are handled separately through check detection.
    if (!target || target.type === "k") continue;

    const fact: PieceTarget = {
      square,
      piece: target.type,
      color: target.color,
    };

    if (target.color === piece.color) {
      defends.push(fact);
    } else {
      attacks.push(fact);
    }
  }

  return {
    attacks,
    defends,
    controlledSquares,
    controlledCentralSquares: centralSquares.filter((square) =>
      controlledSquares.includes(square),
    ),
    occupiedCentralSquare: centralSquares.includes(source) ? source : null,
  };
}

export default defineTool({
  description:
    "Inspect one hypothetical move for a learner question. " +
    "Copy fen exactly from the question's positionFen. " +
    "Checks legality for the side to move and returns geometric " +
    "attacks, defenses, and central-square effects of the moved piece. " +
    "Does not change the lesson board or rate move quality. " +
    "Do not use for automatic lesson.move explanations.",

  inputSchema: z.object({
    fen: z
      .string()
      .min(1)
      .describe("Exact positionFen from the current learner question."),

    from: z
      .string()
      .regex(/^[a-h][1-8]$/)
      .describe("Source square of the proposed move, for example f3."),

    to: z
      .string()
      .regex(/^[a-h][1-8]$/)
      .describe("Destination square of the proposed move, for example g5."),

    promotion: z
      .enum(["q", "r", "b", "n"])
      .nullable()
      .describe("Promotion piece when promoting a pawn. Otherwise pass null."),
  }),

  execute({ fen, from, to, promotion }) {
    let game: Chess;

    try {
      game = new Chess(fen);
    } catch {
      return {
        ok: false,
        code: "INVALID_FEN",
        message: "The supplied position could not be loaded.",
      };
    }

    const source = from as Square;
    const destination = to as Square;
    const piece = game.get(source);

    if (!piece) {
      return {
        ok: false,
        code: "EMPTY_SOURCE",
        message: `There is no piece on ${from}.`,
      };
    }

    if (piece.color !== game.turn()) {
      return {
        ok: false,
        code: "WRONG_TURN",
        message: "That piece does not belong to the side to move.",
      };
    }

    const isPromotion =
      piece.type === "p" &&
      destination[1] === (piece.color === "w" ? "8" : "1");

    if (isPromotion && promotion === null) {
      return {
        ok: false,
        code: "PROMOTION_REQUIRED",
        message: "Specify the piece the pawn should promote to.",
      };
    }

    if (!isPromotion && promotion !== null) {
      return {
        ok: false,
        code: "UNEXPECTED_PROMOTION",
        message: "Pass null for promotion on a non-promotion move.",
      };
    }

    const beforeFen = game.fen();
    const before = inspectPiece(game, source);

    let move: Move;

    try {
      move = game.move({
        from: source,
        to: destination,
        ...(promotion === null ? {} : { promotion }),
      });
    } catch {
      return {
        ok: false,
        code: "ILLEGAL_MOVE",
        legal: false,
        beforeFen,
        proposedMove: { from, to, promotion },
        message: "This move is not legal in the supplied position.",
      };
    }

    const after = inspectPiece(game, destination);

    return {
      ok: true,
      legal: true,
      hypothetical: true,
      beforeFen,
      afterFen: game.fen(),

      move: {
        san: move.san,
        from: move.from,
        to: move.to,
        color: move.color,
        piece: move.piece,
        captured: move.captured ?? null,
        promotion: move.promotion ?? null,
      },

      facts: {
        scope: "moved-piece-only",
        attackSemantics: "geometric-including-pinned-pieces",
        before,
        after,

        newlyControlledCentralSquares: after.controlledCentralSquares.filter(
          (square) => !before.controlledCentralSquares.includes(square),
        ),

        noLongerControlledCentralSquares:
          before.controlledCentralSquares.filter(
            (square) => !after.controlledCentralSquares.includes(square),
          ),

        opponentInCheck: game.isCheck(),
        opponentCheckmated: game.isCheckmate(),
      },

      limitations: [
        "Attacks and defenses do not prove safe captures or legal recaptures.",
        "Piece relationships exclude kings; check is reported separately.",
        "Only the moved piece's relationships are compared.",
        "Other pieces' opened lines and castling rook effects are not listed.",
        "No development judgment, opening-line match, or engine rating.",
      ],
    };
  },
});
