import { openingCatalog } from "../data/openings";
import type { PracticeSelection } from "../data/openings";
import "./LessonSelector.css";

type LessonSelectorProps = {
  selection: PracticeSelection;
  disabled: boolean;
  onSelectLine: (lineId: string) => void;
};

export default function LessonSelector({
  selection,
  disabled,
  onSelectLine,
}: LessonSelectorProps) {
  const { opening, group, line } = selection;

  function changeOpening(openingId: string) {
    const nextOpening = openingCatalog.find((item) => item.id === openingId);

    if (!nextOpening) return;

    onSelectLine(nextOpening.groups[0].lines[0].id);
  }

  function changeGroup(groupId: string) {
    const nextGroup = opening.groups.find((item) => item.id === groupId);

    if (!nextGroup) return;

    onSelectLine(nextGroup.lines[0].id);
  }

  return (
    <fieldset className="lesson-selector" disabled={disabled}>
      <legend>Choose your lesson</legend>

      <div className="lesson-selector__fields">
        <label>
          <span>Opening</span>

          <select
            value={opening.id}
            onChange={(event) => changeOpening(event.target.value)}
            disabled={openingCatalog.length === 1}
          >
            {openingCatalog.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Variation group</span>

          <select
            value={group.id}
            onChange={(event) => changeGroup(event.target.value)}
          >
            {opening.groups.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Practice line</span>

          <select
            value={line.id}
            onChange={(event) => onSelectLine(event.target.value)}
            disabled={group.lines.length === 1}
          >
            {group.lines.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="lesson-selector__note">
        Changing the lesson starts a fresh board and conversation.
      </p>
    </fieldset>
  );
}
