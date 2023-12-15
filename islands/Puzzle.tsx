import { type Signal } from "@preact/signals";
import { Table } from "../components/Table.tsx";
import { Game } from "../utils/types.ts";
import { check, next, prev } from "../utils/utils.ts";

interface PuzzleProps {
  game: Signal<Game>;
}

export default function Puzzle(props: PuzzleProps) {
  const increment = (i: number, j: number) => {
    if (i % 2 != 0 || j % 2 != 0) return;

    const { field, max, alphabet } = props.game.value;
    field[i][j] = next(field[i][j], max, alphabet).toString();
    const status = check(field, props.game.value.mask);
    props.game.value = { ...props.game.value, field: [...field], status };
  };

  const decrement = (i: number, j: number) => {
    if (i % 2 != 0 || j % 2 != 0) return false;

    const { field, max, alphabet } = props.game.value;
    field[i][j] = prev(field[i][j], max, alphabet).toString();
    const status = check(field, props.game.value.mask);
    props.game.value = { ...props.game.value, field: [...field], status };
    return false;
  };

  return (
    <div className={`box gradient ${props.game.value.status ? "winner" : ""}`}>
      <Table
        game={props.game}
        increment={increment}
        decrement={decrement}
      />
    </div>
  );
}
