import { Signal } from "@preact/signals";
import { Game } from "../utils/types.ts";

interface TableProps<T = string | number> {
  game: Signal<Game<T>>;
  increment: (i: number, j: number) => void;
  decrement: (i: number, j: number) => void;
}

export function Table<T>(props: TableProps<T>) {
  // @ts-ignore any
  const preventDefaultWrap = (fn, ...args) => (e) => e.preventDefault() || fn(...args);
  const getFontSize = (size: number) => size === 3 ? "" : size === 4 ? "puzzle4" : "puzzleX";
  return (
    <div>
      <table className={`puzzle ${getFontSize(props.game.value.size)}`}>
        {props.game.value.field.map((row, i) => (
          <tr>
            {row.map((cell, j) => (
              <td
                className={`w-1/5`} // TODO: make grid with *?
                onClick={preventDefaultWrap(props.increment, i, j)}
                onContextMenu={preventDefaultWrap(props.decrement, i, j)}
              >
                <span className={i % 2 != 0 ? "rotate inline-block" : ""}>
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
