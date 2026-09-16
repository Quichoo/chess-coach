import { Chess, SQUARES } from "chess.js";
import type { Color, PieceSymbol, Square } from "chess.js";
import type { OpeningLesson } from "../data/openings";

const CENTRAL_SQUARES: Square[] = ["d4", "e4", "d5", "e5"];

type PieceTarget = {
  square: Square;
  piece: PieceSymbol;
  color: Color;
};

type PawnSupportLink = {
  from: Square;
  to: Square;
};

type PawnStructure = {
  squares: Square[];
  supportLinks: PawnSupportLink[];
};

type BishopPathChange = {
  square: Square;
  color: Color;
  squareColor: "light" | "dark";
  emptySquaresBefore: Square[];
  emptySquaresAfter: Square[];
  newlyReachableEmptySquares: Square[];
  noLongerReachableEmptySquares: Square[];
};

// Includes friendly occupied squares and pinned-piece attacks.
// These are geometric attacks, not legal move destinations.
function controlledSquares(
  game: Chess,
  source: Square,
  color: Color,
): Square[] {
  return SQUARES.filter((target) =>
    game.attackers(target, color).includes(source),
  );
}

function occupiedTargets(
  game: Chess,
  squares: Square[],
  color: Color,
): PieceTarget[] {
  const result: PieceTarget[] = [];

  for (const square of squares) {
    const piece = game.get(square);

    // King/check relationships are outside this fact list.
    if (piece && piece.color === color && piece.type !== "k") {
      result.push({
        square,
        piece: piece.type,
        color: piece.color,
      });
    }
  }

  return result;
}

// Describe the pawns currently on the board.
//
// A support link means one pawn geometrically attacks the square
// occupied by another pawn of the same color. It does not guarantee
// that a recapture would be legal.
function getPawnStructure(game: Chess, color: Color): PawnStructure {
  const squares = SQUARES.filter((square) => {
    const piece = game.get(square);

    return piece?.type === "p" && piece.color === color;
  });

  const supportLinks: PawnSupportLink[] = [];

  for (const target of squares) {
    const attackers = game.attackers(target, color);

    for (const source of attackers) {
      const piece = game.get(source);

      if (piece?.type === "p" && piece.color === color) {
        supportLinks.push({
          from: source,
          to: target,
        });
      }
    }
  }

  return {
    squares,
    supportLinks,
  };
}

function getSquareColor(square: Square): "light" | "dark" {
  const fileIndex = square.charCodeAt(0) - "a".charCodeAt(0);
  const rankIndex = Number(square[1]) - 1;

  // a1 is dark.
  return (fileIndex + rankIndex) % 2 === 0 ? "dark" : "light";
}

// Empty squares along a bishop's unobstructed diagonals.
//
// Friendly occupied squares and enemy occupied squares are excluded.
// No turn, check, pin, or destination-safety test is performed.
function bishopEmptySquares(
  game: Chess,
  source: Square,
  color: Color,
): Square[] {
  return controlledSquares(game, source, color).filter(
    (target) => !game.get(target),
  );
}

// Compare only bishops that remained on the same square.
//
// Moved, captured, or newly promoted bishops are outside this scope.
// This prevents a bishop relocation from being described as another
// move opening a path for a stationary bishop.
function getBishopPathChanges(before: Chess, after: Chess): BishopPathChange[] {
  const changes: BishopPathChange[] = [];

  for (const square of SQUARES) {
    const previousPiece = before.get(square);
    const currentPiece = after.get(square);

    if (
      previousPiece?.type !== "b" ||
      currentPiece?.type !== "b" ||
      previousPiece.color !== currentPiece.color
    ) {
      continue;
    }

    const emptySquaresBefore = bishopEmptySquares(
      before,
      square,
      previousPiece.color,
    );

    const emptySquaresAfter = bishopEmptySquares(
      after,
      square,
      currentPiece.color,
    );

    const newlyReachableEmptySquares = emptySquaresAfter.filter(
      (target) => !emptySquaresBefore.includes(target),
    );

    const noLongerReachableEmptySquares = emptySquaresBefore.filter(
      (target) => !emptySquaresAfter.includes(target),
    );

    if (
      newlyReachableEmptySquares.length === 0 &&
      noLongerReachableEmptySquares.length === 0
    ) {
      continue;
    }

    changes.push({
      square,
      color: currentPiece.color,
      squareColor: getSquareColor(square),
      emptySquaresBefore,
      emptySquaresAfter,
      newlyReachableEmptySquares,
      noLongerReachableEmptySquares,
    });
  }

  return changes;
}

export function buildMoveContext(
  lesson: OpeningLesson,
  historyBefore: string[],
  nextMove: string,
) {
  // Assumes a game from the standard starting position.
  const before = new Chess();
  const after = new Chess();

  for (const san of historyBefore) {
    before.move(san);
    after.move(san);
  }

  // Throws if the history or attempted move is invalid.
  const played = after.move(nextMove);

  const opponent: Color = played.color === "w" ? "b" : "w";

  const controlledBefore = controlledSquares(before, played.from, played.color);

  const controlledAfter = controlledSquares(after, played.to, played.color);

  const centralBefore = CENTRAL_SQUARES.filter((square) =>
    controlledBefore.includes(square),
  );

  const centralAfter = CENTRAL_SQUARES.filter((square) =>
    controlledAfter.includes(square),
  );

  const startingPosition = new Chess();
  const originalPiece = startingPosition.get(played.from);
  const previousMoves = before.history({ verbose: true });

  const isOriginalMinorPiece =
    (played.piece === "n" || played.piece === "b") &&
    originalPiece?.type === played.piece &&
    originalPiece.color === played.color &&
    !previousMoves.some(
      (move) => move.from === played.from || move.to === played.from,
    );

  const homeRank = played.color === "w" ? "1" : "8";

  const development =
    isOriginalMinorPiece && played.to[1] !== homeRank
      ? {
          kind: "first-minor-piece-departure",
          piece: played.piece,
          from: played.from,
          to: played.to,
        }
      : null;

  return {
    event: "lesson.move",
    schemaVersion: 1,
    opening: lesson.name,
    variation: lesson.variation,
    learnerColor: lesson.learnerColor,
    actor: played.color === lesson.learnerColor ? "learner" : "opponent",
    ply: historyBefore.length + 1,
    beforeFen: before.fen(),
    afterFen: after.fen(),

    move: {
      san: played.san,
      from: played.from,
      to: played.to,
      piece: played.piece,
      color: played.color,
    },

    moveHistory: after.history(),

    followsSelectedLine: played.san === lesson.moves[historyBefore.length],

    // Existing moved-piece facts remain unchanged.
    facts: {
      scope: "moved-piece-only",
      attackSemantics: "geometric-including-pinned-pieces",

      attacks: occupiedTargets(after, controlledAfter, opponent),

      defends: occupiedTargets(after, controlledAfter, played.color),

      development,

      centralSquares: {
        definition: CENTRAL_SQUARES,
        controlledBefore: centralBefore,
        controlledAfter: centralAfter,

        newlyControlled: centralAfter.filter(
          (square) => !centralBefore.includes(square),
        ),

        noLongerControlled: centralBefore.filter(
          (square) => !centralAfter.includes(square),
        ),

        occupiedBefore: CENTRAL_SQUARES.includes(played.from)
          ? played.from
          : null,

        occupiedAfter: CENTRAL_SQUARES.includes(played.to) ? played.to : null,
      },
    },

    // Additional facts have their own explicitly defined scope.
    positionFacts: {
      pawnStructure: {
        scope: "all-pawns-after-move",
        supportSemantics: "geometric-including-pinned-pawns",
        white: getPawnStructure(after, "w"),
        black: getPawnStructure(after, "b"),
      },

      bishopPathChanges: {
        scope: "stationary-bishops-only",
        pathSemantics: "unobstructed-empty-diagonal-squares",
        establishesLegalOrSafeMoves: false,
        changes: getBishopPathChanges(before, after),
      },
    },
  };
}
