import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import type { OpeningLesson } from "../data/openings";

function createGame(moves: string[]) {
  const game = new Chess();

  for (const move of moves) {
    game.move(move);
  }

  return game;
}

type DropArgs = {
  sourceSquare: string;
  targetSquare: string | null;
};

export type OffLineAttempt = {
  lessonId: string;
  learnerColor: OpeningLesson["learnerColor"];
  positionFen: string;
  moveHistory: string[];
  ply: number;
  attemptedSan: string;
  expectedSan: string;
};

const allowOpponentByDefault = () => true;

export default function useOpeningPractice(
  lesson: OpeningLesson,
  canOpponentMove: () => boolean = allowOpponentByDefault,
) {
  const [moves, setMoves] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");

  const [offLineAttempt, setOffLineAttempt] = useState<OffLineAttempt | null>(
    null,
  );

  const game = createGame(moves);

  const isComplete = moves.length >= lesson.moves.length;
  const isLearnerTurn = game.turn() === lesson.learnerColor;

  const learnerName = lesson.learnerColor === "w" ? "White" : "Black";

  const opponentName = lesson.learnerColor === "w" ? "Black" : "White";

  const currentHint =
    !isComplete && isLearnerTurn ? lesson.hints[moves.length] : undefined;

  useEffect(() => {
    if (isComplete || isLearnerTurn) return;

    const timer = window.setInterval(() => {
      if (!canOpponentMove()) return;

      window.clearInterval(timer);

      const nextGame = createGame(moves);
      const opponentMove = lesson.moves[moves.length];

      if (!opponentMove) {
        setFeedback("The lesson reply is missing. Reset the lesson.");
        return;
      }

      try {
        nextGame.move(opponentMove);

        setMoves(nextGame.history());
        setFeedback("");
        setOffLineAttempt(null);
      } catch {
        setFeedback("The lesson contains an invalid reply. Reset the lesson.");
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, [moves, lesson, isComplete, isLearnerTurn, canOpponentMove]);

  function handleDrop({ sourceSquare, targetSquare }: DropArgs): boolean {
    if (
      !targetSquare ||
      sourceSquare === targetSquare ||
      isComplete ||
      !isLearnerTurn
    ) {
      return false;
    }

    // A new move attempt replaces the previous rejected attempt.
    setOffLineAttempt(null);

    const expectedMove = lesson.moves[moves.length];

    if (!expectedMove) {
      setFeedback("The next lesson move is missing. Reset the lesson.");
      return false;
    }

    // Validate on a separate game so rejected moves never change
    // the board or the accepted move history.
    const nextGame = createGame(moves);

    let playedMove;

    try {
      playedMove = nextGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    } catch {
      setFeedback("That move is not legal. Try another square.");
      return false;
    }

    if (playedMove.san !== expectedMove) {
      setOffLineAttempt({
        lessonId: lesson.id,
        learnerColor: lesson.learnerColor,
        positionFen: game.fen(),
        moveHistory: [...moves],
        ply: moves.length + 1,
        attemptedSan: playedMove.san,
        expectedSan: expectedMove,
      });

      setFeedback(
        `${playedMove.san} is legal, but it isn't the move in this practice line. Try again.`,
      );

      return false;
    }

    setMoves(nextGame.history());
    setFeedback("");

    return true;
  }

  function showHint() {
    if (isComplete || !isLearnerTurn) return;

    setFeedback(currentHint ?? "No hint is available for this move.");
  }

  function revealMove() {
    if (isComplete || !isLearnerTurn) return;

    setFeedback(
      `The next move in this practice line is ${lesson.moves[moves.length]}.`,
    );
  }

  function resetGame() {
    setMoves([]);
    setFeedback("");
    setOffLineAttempt(null);
  }

  let status = `Your turn — play ${learnerName}'s next move`;

  if (isComplete) {
    status = "Lesson complete!";
  } else if (!isLearnerTurn) {
    status = `Waiting for ${opponentName}'s reply…`;
  }

  return {
    position: game.fen(),
    moves,
    feedback,
    status,
    isComplete,
    isLearnerTurn,
    offLineAttempt,
    handleDrop,
    showHint,
    revealMove,
    resetGame,
  };
}
