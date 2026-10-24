import { Chess } from "chess.js";
import type { LessonStep, PracticeLine } from "./types";

export function createLine(
  id: string,
  name: string,
  description: string,
  steps: LessonStep[],
): PracticeLine {
  const game = new Chess();
  const moves: string[] = [];
  const hints: Partial<Record<number, string>> = {};

  for (const [index, [san, hint]] of steps.entries()) {
    try {
      const playedMove = game.move(san);

      if (!playedMove) {
        throw new Error("The move could not be played.");
      }

      if (playedMove.san !== san) {
        throw new Error(
          `Use canonical notation "${playedMove.san}" instead of "${san}".`,
        );
      }
    } catch (cause) {
      const reason = cause instanceof Error ? cause.message : String(cause);

      throw new Error(
        `Invalid lesson "${id}" at ply ${index + 1} (${san}): ${reason}`,
        { cause },
      );
    }

    moves.push(san);
    hints[index] = hint;
  }

  return {
    id,
    name,
    description,
    moves,
    hints,
  };
}
