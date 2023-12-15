import { Signal } from "@preact/signals";
import { CellType, Game } from "../utils/types.ts";
import { isNotACell } from "../utils/utils.ts";

interface TableProps<T = string | number> {
  game: Signal<Game<T>>;
  increment: (i: number, j: number) => void;
  decrement: (i: number, j: number) => void;
}

export function Table<T>(props: TableProps<T>) {
  // @ts-ignore any
  const preventDefaultWrap = (fn, ...args) => (e) => e.preventDefault() || fn(...args);
  const getFontSize = (size: number, type: CellType) =>
    type === "words" ? "puzzleWords" : size === 3 ? "" : size === 4 ? "puzzle4" : "puzzleX";
  const getCellOpacity = (status: Game["status"], i: number, j: number) =>
    status && isNotACell(i, j) ? "opacity-0" : "";

  return (
    <div>
      <table className={`puzzle ${getFontSize(props.game.value.size, props.game.value.type)}`}>
        {props.game.value.field.map((row, i) => (
          <tr>
            {row.map((cell, j) => (
              <td
                className={`${isNotACell(i, j) ? "w-[4vmin]" : "w-1/3"}`} // TODO: make grid with *?
                onClick={preventDefaultWrap(props.increment, i, j)}
                onContextMenu={preventDefaultWrap(props.decrement, i, j)}
              >
                <span
                  className={`${i % 2 != 0 ? "rotate inline-block" : ""} ${
                    getCellOpacity(props.game.value.status, i, j)
                  }`}
                >
                  {cell?.toString()}
                </span>
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}
