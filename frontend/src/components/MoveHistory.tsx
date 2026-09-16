type MoveHistoryProps = {
  moves: string[];
};

export default function MoveHistory({ moves }: MoveHistoryProps) {
  const rows = Array.from(
    { length: Math.ceil(moves.length / 2) },
    (_, index) => ({
      number: index + 1,
      white: moves[index * 2],
      black: moves[index * 2 + 1],
    }),
  );

  const latestMoveIndex = moves.length - 1;

  return (
    <section
      className="history practice-move-history"
      aria-label="Move history"
    >
      <h2>Move history</h2>

      {moves.length === 0 ? (
        <p className="practice-history-empty">Play your first move to begin.</p>
      ) : (
        <div className="practice-history-scroll">
          <table className="practice-moves-table">
            <caption className="practice-sr-only">
              Played moves, grouped by move number.
            </caption>

            <thead>
              <tr>
                <th scope="col">Move</th>
                <th scope="col">White</th>
                <th scope="col">Black</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => {
                const whiteIsLatest = index * 2 === latestMoveIndex;

                const blackIsLatest = index * 2 + 1 === latestMoveIndex;

                return (
                  <tr key={row.number}>
                    <th scope="row">{row.number}.</th>

                    <td>
                      <span
                        className={
                          whiteIsLatest
                            ? "practice-move practice-move--latest"
                            : "practice-move"
                        }
                      >
                        {row.white}
                        {whiteIsLatest && (
                          <span className="practice-sr-only">
                            {" "}
                            — latest move
                          </span>
                        )}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          blackIsLatest
                            ? "practice-move practice-move--latest"
                            : "practice-move"
                        }
                      >
                        {row.black ?? "—"}
                        {blackIsLatest && (
                          <span className="practice-sr-only">
                            {" "}
                            — latest move
                          </span>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
