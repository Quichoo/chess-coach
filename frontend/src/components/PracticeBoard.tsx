import { useState } from "react";
import type { CSSProperties } from "react";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { Chessboard } from "react-chessboard";

type MoveAttempt = {
  sourceSquare: string;
  targetSquare: string | null;
};

type PracticeBoardProps = {
  position: string;
  learnerColor: "w" | "b";
  disabled?: boolean;
  onPieceDrop: (args: MoveAttempt) => boolean;
};

type Selection = {
  square: Square;
  position: string;
};

export default function PracticeBoard({
  position,
  learnerColor,
  disabled = false,
  onPieceDrop,
}: PracticeBoardProps) {
  const [selection, setSelection] = useState<Selection | null>(null);

  const game = new Chess(position);

  const selectedSquare =
    !disabled && selection?.position === position ? selection.square : null;

  const legalMoves = selectedSquare
    ? game.moves({
        square: selectedSquare,
        verbose: true,
      })
    : [];

  const squareStyles: Record<string, CSSProperties> = {};

  if (selectedSquare) {
    squareStyles[selectedSquare] = {
      backgroundColor: "rgba(163, 230, 53, 0.55)",
    };

    for (const move of legalMoves) {
      squareStyles[move.to] = move.captured
        ? {
            boxShadow: "inset 0 0 0 5px rgba(163, 230, 53, 0.8)",
          }
        : {
            backgroundImage:
              "radial-gradient(circle, rgba(0, 0, 0, 0.28) 22%, transparent 24%)",
          };
    }
  }

  function handleSquareClick({ square }: { square: string }) {
    if (disabled) return;

    const clickedSquare = square as Square;

    if (clickedSquare === selectedSquare) {
      setSelection(null);
      return;
    }

    if (
      selectedSquare &&
      legalMoves.some((move) => move.to === clickedSquare)
    ) {
      const accepted = onPieceDrop({
        sourceSquare: selectedSquare,
        targetSquare: clickedSquare,
      });

      if (accepted) {
        setSelection(null);
      }

      return;
    }

    const piece = game.get(clickedSquare);

    if (piece && piece.color === game.turn()) {
      setSelection({
        square: clickedSquare,
        position,
      });
    } else {
      setSelection(null);
    }
  }

  function handleDrop(args: MoveAttempt): boolean {
    setSelection(null);

    if (disabled) return false;

    return onPieceDrop(args);
  }

  return (
    <Chessboard
      options={{
        id: "practice-board",
        position,
        boardOrientation: learnerColor === "w" ? "white" : "black",
        allowDragging: !disabled,
        onPieceDrop: handleDrop,
        onSquareClick: handleSquareClick,
        squareStyles,
      }}
    />
  );
}
