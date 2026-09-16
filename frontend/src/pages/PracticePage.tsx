import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import PracticeBoard from "../components/PracticeBoard";
import MoveHistory from "../components/MoveHistory";
import CoachChat from "../components/CoachChat";
import LessonSelector from "../components/LessonSelector";

import {
  createOpeningLesson,
  defaultLineId,
  getPracticeSelection,
} from "../data/openings";

import type { LearnerColor, PracticeSelection } from "../data/openings";

import useOpeningPractice from "../hooks/useOpeningPractice";
import type { OffLineAttempt } from "../hooks/useOpeningPractice";
import useMoveCoach from "../hooks/useMoveCoach";

import "./PracticePage.css";

type PracticeSessionProps = {
  selection: PracticeSelection;
  learnerColor: LearnerColor;
  onSelectLine: (lineId: string) => void;
  onChangeSide: (color: LearnerColor) => void;
  onRestart: () => void;
};

export default function PracticePage() {
  const [lineId, setLineId] = useState(defaultLineId);
  const [learnerColor, setLearnerColor] = useState<LearnerColor>("w");
  const [attempt, setAttempt] = useState(0);

  const selection = useMemo(() => getPracticeSelection(lineId), [lineId]);

  return (
    <PracticeSession
      key={`${lineId}-${learnerColor}-${attempt}`}
      selection={selection}
      learnerColor={learnerColor}
      onSelectLine={setLineId}
      onChangeSide={setLearnerColor}
      onRestart={() => setAttempt((current) => current + 1)}
    />
  );
}

function PracticeSession({
  selection,
  learnerColor,
  onSelectLine,
  onChangeSide,
  onRestart,
}: PracticeSessionProps) {
  const lesson = useMemo(
    () => createOpeningLesson(selection, learnerColor),
    [selection, learnerColor],
  );

  const opponentAllowed = useRef(false);

  const canOpponentMove = useCallback(() => opponentAllowed.current, []);

  const {
    position,
    moves,
    feedback,
    status: boardStatus,
    isComplete,
    isLearnerTurn,
    offLineAttempt,
    handleDrop,
    showHint,
    revealMove,
  } = useOpeningPractice(lesson, canOpponentMove);

  const coach = useMoveCoach(lesson, moves);

  const [explainingAttempt, setExplainingAttempt] =
    useState<OffLineAttempt | null>(null);

  const [explainedAttempt, setExplainedAttempt] =
    useState<OffLineAttempt | null>(null);

  const explainingOffLineMove = explainingAttempt !== null;

  const currentAttemptExplained =
    offLineAttempt !== null && explainedAttempt === offLineAttempt;

  const waitingForCoach =
    coach.hasPendingMoves || coach.isResponding || explainingOffLineMove;

  useEffect(() => {
    opponentAllowed.current = !waitingForCoach && !coach.error;

    return () => {
      opponentAllowed.current = false;
    };
  }, [waitingForCoach, coach.error]);

  const blockLearnerMoves = waitingForCoach || Boolean(coach.error);

  const boardDisabled = blockLearnerMoves || isComplete || !isLearnerTurn;

  const questionDisabled = blockLearnerMoves || (!isComplete && !isLearnerTurn);

  const lessonFinished = isComplete && !waitingForCoach && !coach.error;

  const sessionChangeDisabled =
    coach.isResponding ||
    explainingOffLineMove ||
    (coach.hasPendingMoves && !coach.error);

  const learnerName = learnerColor === "w" ? "White" : "Black";

  const totalMoves = lesson.moves.length;
  const playedMoves = Math.min(moves.length, totalMoves);

  function canChangeSession() {
    return !sessionChangeDisabled && coach.canReset();
  }

  function selectLine(nextLineId: string) {
    if (nextLineId === selection.line.id || !canChangeSession()) {
      return;
    }

    opponentAllowed.current = false;
    onSelectLine(nextLineId);
  }

  function changeSide(color: LearnerColor) {
    if (color === learnerColor || !canChangeSession()) {
      return;
    }

    opponentAllowed.current = false;
    onChangeSide(color);
  }

  function resetLesson() {
    if (!canChangeSession()) return;

    opponentAllowed.current = false;
    onRestart();
  }

  async function askCoachWhy() {
    if (
      !offLineAttempt ||
      boardDisabled ||
      explainingOffLineMove ||
      currentAttemptExplained ||
      !coach.canReset()
    ) {
      return;
    }

    const attemptToExplain = offLineAttempt;

    opponentAllowed.current = false;
    setExplainingAttempt(attemptToExplain);

    try {
      const sent = await coach.explainOffLineAttempt(attemptToExplain);

      if (sent) {
        setExplainedAttempt(attemptToExplain);
      }
    } finally {
      setExplainingAttempt(null);
    }
  }

  let displayStatus = boardStatus;

  if (coach.error) {
    displayStatus = "Coaching paused — reset the lesson to try again.";
  } else if (explainingOffLineMove) {
    displayStatus = "Coach is explaining your attempted move…";
  } else if (waitingForCoach) {
    displayStatus = "Coach is responding…";
  }

  return (
    <main className="app practice-page">
      <header className="practice-header">
        <p className="practice-eyebrow">Opening practice</p>

        <div className="practice-heading-row">
          <h1>{lesson.name}</h1>

          <span className="practice-badge">Playing {learnerName}</span>
        </div>

        <p className="practice-variation">{lesson.variation}</p>

        <p className="practice-description">{lesson.description}</p>

        <LessonSelector
          selection={selection}
          disabled={sessionChangeDisabled}
          onSelectLine={selectLine}
        />

        <div
          className="practice-actions"
          role="group"
          aria-label="Choose your side"
        >
          <button
            type="button"
            className={`practice-button ${
              learnerColor === "w"
                ? "practice-button--primary"
                : "practice-button--secondary"
            }`}
            aria-pressed={learnerColor === "w"}
            disabled={sessionChangeDisabled}
            onClick={() => changeSide("w")}
          >
            Play White
          </button>

          <button
            type="button"
            className={`practice-button ${
              learnerColor === "b"
                ? "practice-button--primary"
                : "practice-button--secondary"
            }`}
            aria-pressed={learnerColor === "b"}
            disabled={sessionChangeDisabled}
            onClick={() => changeSide("b")}
          >
            Play Black
          </button>
        </div>

        <p className="practice-description">
          Switching sides starts a new lesson. Coaching explains your moves.
        </p>

        <div className="practice-progress">
          <div className="practice-progress-heading">
            <label htmlFor="lesson-progress">Moves played</label>

            <span>
              {playedMoves} / {totalMoves}
            </span>
          </div>

          <progress
            id="lesson-progress"
            value={playedMoves}
            max={totalMoves}
            aria-describedby="lesson-progress-note"
          >
            {playedMoves} of {totalMoves}
          </progress>

          <p id="lesson-progress-note">Includes White’s and Black’s moves.</p>
        </div>
      </header>

      <div className="practice-layout">
        <section
          className="practice-board-panel"
          aria-label="Board and lesson controls"
        >
          <p className="practice-status" role="status">
            <span
              className={`practice-status-dot${
                coach.error ? " practice-status-dot--error" : ""
              }`}
              aria-hidden="true"
            />

            {displayStatus}
          </p>

          <div className="practice-board-frame">
            <PracticeBoard
              position={position}
              learnerColor={learnerColor}
              disabled={boardDisabled}
              onPieceDrop={(args) => {
                // The ref-based check also covers the brief interval
                // before React renders a newly started request.
                if (boardDisabled || !coach.canReset()) {
                  return false;
                }

                const accepted = handleDrop(args);

                if (accepted) {
                  opponentAllowed.current = false;
                }

                return accepted;
              }}
            />
          </div>

          <div className="practice-feedback" role="status">
            {feedback && <p>{feedback}</p>}
          </div>

          <div className="practice-actions">
            {offLineAttempt && (
              <button
                type="button"
                className="practice-button practice-button--secondary"
                onClick={() => {
                  void askCoachWhy();
                }}
                disabled={boardDisabled || currentAttemptExplained}
              >
                {explainingOffLineMove
                  ? "Coach is explaining…"
                  : currentAttemptExplained
                    ? "Explanation in chat"
                    : "Ask coach why"}
              </button>
            )}

            <button
              type="button"
              className="practice-button practice-button--primary"
              onClick={showHint}
              disabled={boardDisabled}
            >
              Hint
            </button>

            <button
              type="button"
              className="practice-button practice-button--secondary"
              onClick={revealMove}
              disabled={boardDisabled}
            >
              Reveal move
            </button>

            {!lessonFinished && (
              <button
                type="button"
                className="practice-button practice-button--quiet"
                onClick={resetLesson}
                disabled={sessionChangeDisabled}
              >
                Reset lesson
              </button>
            )}
          </div>

          {lessonFinished && (
            <section
              className="practice-completion"
              aria-label="Lesson completion"
              aria-live="polite"
            >
              <h2>Lesson complete!</h2>

              <p>
                You completed “{selection.line.name}” as {learnerName}.
              </p>

              <p>
                Practice again to recall the ideas, or switch sides to
                understand the other player’s decisions.
              </p>

              <button
                type="button"
                className="practice-button practice-button--primary"
                onClick={resetLesson}
                disabled={sessionChangeDisabled}
              >
                Practice again
              </button>
            </section>
          )}

          <MoveHistory moves={moves} />
        </section>

        <aside className="practice-sidebar" aria-label="Lesson companion">
          <CoachChat
            data={coach.data}
            status={coach.status}
            error={coach.error}
            questionDisabled={questionDisabled}
            onAskQuestion={coach.askQuestion}
          />
        </aside>
      </div>
    </main>
  );
}
