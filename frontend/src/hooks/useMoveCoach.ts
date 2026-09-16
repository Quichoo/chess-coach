import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { useEveAgent } from "eve/react";

import type { OpeningLesson } from "../data/openings";
import type { OffLineAttempt } from "./useOpeningPractice";

import { buildMoveContext } from "../utils/buildMoveContext";

export default function useMoveCoach(lesson: OpeningLesson, moves: string[]) {
  const { send, reset, data, status, error: sessionError } = useEveAgent();

  // Index immediately after the last successfully coached learner move.
  const [processedThrough, setProcessedThrough] = useState(0);

  const [requestError, setRequestError] = useState("");
  const [sending, setSending] = useState(false);

  const inFlight = useRef(false);

  const error = requestError || (sessionError ? String(sessionError) : "");

  const sessionBusy =
    status === "submitted" || status === "streaming" || status === "resuming";

  // Lessons begin at the standard starting position:
  // even indexes are White's moves, odd indexes are Black's.
  const nextLearnerMoveIndex = moves.findIndex((_, index) => {
    const moverColor = index % 2 === 0 ? "w" : "b";

    return index >= processedThrough && moverColor === lesson.learnerColor;
  });

  const hasPendingMoves = nextLearnerMoveIndex !== -1;
  const isResponding = sending || sessionBusy;

  useEffect(() => {
    if (!hasPendingMoves || inFlight.current || sessionBusy || error) {
      return;
    }

    const moveIndex = nextLearnerMoveIndex;

    inFlight.current = true;
    setSending(true);

    async function explainMove() {
      const startedAt = performance.now();

      try {
        const moveSan = moves[moveIndex];

        if (!moveSan) {
          throw new Error("The move to explain is missing.");
        }

        const context = buildMoveContext(
          lesson,
          moves.slice(0, moveIndex),
          moveSan,
        );

        await send(JSON.stringify(context));

        console.log(
          `[Coach] ${context.ply}. ${context.move.san}: ` +
            `${((performance.now() - startedAt) / 1000).toFixed(1)}s`,
        );

        setProcessedThrough(moveIndex + 1);
      } catch (cause) {
        setRequestError(cause instanceof Error ? cause.message : String(cause));
      } finally {
        inFlight.current = false;
        setSending(false);
      }
    }

    void explainMove();
  }, [
    error,
    hasPendingMoves,
    lesson,
    moves,
    nextLearnerMoveIndex,
    send,
    sessionBusy,
    sending,
  ]);

  async function askQuestion(question: string): Promise<boolean> {
    const trimmedQuestion = question.trim();

    if (
      !trimmedQuestion ||
      inFlight.current ||
      sessionBusy ||
      hasPendingMoves ||
      error
    ) {
      return false;
    }

    inFlight.current = true;
    setSending(true);

    try {
      const game = new Chess();

      for (const move of moves) {
        game.move(move);
      }

      const lessonComplete = moves.length >= lesson.moves.length;

      if (!lessonComplete && game.turn() !== lesson.learnerColor) {
        return false;
      }

      const lastMove = moves[moves.length - 1];

      // The latest move may belong to the opponent.
      // Keep it available as context for questions.
      const lastMoveContext = lastMove
        ? buildMoveContext(lesson, moves.slice(0, -1), lastMove)
        : null;

      const payload = {
        event: "learner.question",
        schemaVersion: 1,
        question: trimmedQuestion,
        opening: lesson.name,
        variation: lesson.variation,
        learnerColor: lesson.learnerColor,
        positionFen: game.fen(),
        moveHistory: [...moves],
        lessonComplete,
        lastMoveContext,
      };

      await send(JSON.stringify(payload));

      return true;
    } catch (cause) {
      setRequestError(cause instanceof Error ? cause.message : String(cause));

      return false;
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }

  async function explainOffLineAttempt(
    attempt: OffLineAttempt,
  ): Promise<boolean> {
    if (inFlight.current || sessionBusy || hasPendingMoves || error) {
      return false;
    }

    inFlight.current = true;
    setSending(true);

    try {
      const game = new Chess();

      for (const move of moves) {
        game.move(move);
      }

      const lessonComplete = moves.length >= lesson.moves.length;

      if (lessonComplete || game.turn() !== lesson.learnerColor) {
        return false;
      }

      const expectedSan = lesson.moves[moves.length];

      if (!expectedSan) {
        throw new Error("The selected lesson move is missing.");
      }

      // Ensure this attempt still belongs to the current lesson
      // and the exact current position/history.
      const matchesCurrentHistory =
        attempt.moveHistory.length === moves.length &&
        attempt.moveHistory.every((move, index) => move === moves[index]);

      const isCurrentAttempt =
        attempt.lessonId === lesson.id &&
        attempt.learnerColor === lesson.learnerColor &&
        attempt.ply === moves.length + 1 &&
        attempt.positionFen === game.fen() &&
        attempt.expectedSan === expectedSan &&
        matchesCurrentHistory;

      if (!isCurrentAttempt) {
        return false;
      }

      // Each call independently replays the accepted history,
      // then applies ONE hypothetical move.
      const attemptedContext = buildMoveContext(
        lesson,
        moves,
        attempt.attemptedSan,
      );

      const selectedContext = buildMoveContext(lesson, moves, expectedSan);

      // An accepted lesson move is not an off-line attempt.
      if (attemptedContext.move.san === selectedContext.move.san) {
        return false;
      }

      const payload = {
        event: "learner.question",
        questionKind: "off-line-move",
        schemaVersion: 1,

        question:
          `Why doesn't ${attemptedContext.move.san} match ` +
          "this practice line? Help me understand the intended " +
          "plan without revealing the required move.",

        opening: lesson.name,
        variation: lesson.variation,
        learnerColor: lesson.learnerColor,
        positionFen: game.fen(),
        moveHistory: [...moves],
        lessonComplete: false,

        deviation: {
          boardUnchanged: true,
          revealSelectedMove: false,
          engineEvaluationAvailable: false,

          // Both alternatives start from positionFen.
          // Neither alternative has been applied to the real board.
          attempted: {
            hypothetical: true,
            legal: true,
            matchesSelectedLine: false,
            move: attemptedContext.move,
            afterFen: attemptedContext.afterFen,
            facts: attemptedContext.facts,
            positionFacts: attemptedContext.positionFacts,
          },

          selected: {
            hypothetical: true,
            legal: true,
            matchesSelectedLine: true,
            move: selectedContext.move,
            afterFen: selectedContext.afterFen,
            facts: selectedContext.facts,
            positionFacts: selectedContext.positionFacts,
          },
        },
      };

      await send(JSON.stringify(payload));

      // This request explains an attempted move.
      // It does not advance processedThrough.
      return true;
    } catch (cause) {
      setRequestError(cause instanceof Error ? cause.message : String(cause));

      return false;
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }

  // Also checks the ref, which updates before React renders.
  function canReset() {
    return !inFlight.current && !sessionBusy;
  }

  function resetCoach() {
    if (!canReset()) return;

    reset();

    setProcessedThrough(0);
    setRequestError("");
    setSending(false);
  }

  return {
    data,
    status,
    error,
    askQuestion,
    explainOffLineAttempt,
    resetCoach,
    canReset,
    isResponding,
    hasPendingMoves,
  };
}
