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
  return (
    <div>
      <table className="puzzle">
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
