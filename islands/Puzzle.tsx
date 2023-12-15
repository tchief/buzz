import { type Signal } from "@preact/signals";
import { Table } from "../components/Table.tsx";
import { Game } from "../utils/types.ts";
import { check, next, prev } from "../utils/utils.ts";
import { buildGif, share } from "../utils/svg.ts";

interface PuzzleProps {
  game: Signal<Game>;
}

export default function Puzzle(props: PuzzleProps) {
  const increment = (i: number, j: number) => {
    if (i % 2 != 0 || j % 2 != 0) return;

    const { field, max, alphabet, path, size } = props.game.value;
    field[i][j] = next(field[i][j], max, alphabet).toString();
    const status = check(field, props.game.value.mask);
    const newPath = `${path}+${i * size + j}`;
    props.game.value = { ...props.game.value, field: [...field], status, path: newPath };
    if (status) buildGif(props.game);
  };

  const decrement = (i: number, j: number) => {
    if (i % 2 != 0 || j % 2 != 0) return false;

    const { field, max, alphabet, size, path } = props.game.value;
    field[i][j] = prev(field[i][j], max, alphabet).toString();
    const status = check(field, props.game.value.mask);
    const newPath = `${path}-${i * size + j}`;
    props.game.value = { ...props.game.value, field: [...field], status, path: newPath };
    if (status) buildGif(props.game);
    return false;
  };

  return (
    <div className={`box gradient ${props.game.value.status ? "winner" : ""}`}>
      <Table
        game={props.game}
        increment={increment}
        decrement={decrement}
      />
      <svg id="svg" xmlns="http://www.w3.org/2000/svg" className={"hidden"}></svg>
      <img
        id="gif"
        src=""
        className={`${props.game.value.status ? "visible" : "collapsed"}`}
        onClick={share}
      />
    </div>
  );
}
