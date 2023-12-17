import { type Signal } from "@preact/signals";
import { Table } from "../components/Table.tsx";
import { Game } from "../utils/types.ts";
import { check, fieldToKey, next, prev } from "../utils/utils.ts";
import { buildGif, share } from "../utils/svg.ts";

interface PuzzleProps {
  game: Signal<Game>;
  slug: Signal<string | undefined>;
}

export default function Puzzle(props: PuzzleProps) {
  const checkApi = async <T extends string | number>(field: T[][]) => {
    if (!props.slug.value || props.slug.value.length === 0) return false;
    const key = fieldToKey(field);
    const response = await fetch(`/api/${props.slug.value}/check?key=${key}`);
    const data = await response.json();
    return data.status;
  };

  const increment = async (i: number, j: number) => {
    if (i % 2 != 0 || j % 2 != 0) return;

    const { field, max, alphabet, path, size } = props.game.value;
    field[i][j] = next(field[i][j], max, alphabet).toString();
    const status = check(field, props.game.value.mask) && await checkApi(field);
    const newPath = `${path}+${i * size + j}`;
    props.game.value = { ...props.game.value, field: [...field], status, path: newPath };
    const cb = (src: string) => props.game.value = { ...props.game.value, gif: src };
    if (status) buildGif(props.game, cb);
  };

  const decrement = async (i: number, j: number) => {
    if (i % 2 != 0 || j % 2 != 0) return false;

    const { field, max, alphabet, size, path } = props.game.value;
    field[i][j] = prev(field[i][j], max, alphabet).toString();
    const status = check(field, props.game.value.mask) && await checkApi(field);
    const newPath = `${path}-${i * size + j}`;
    props.game.value = { ...props.game.value, field: [...field], status, path: newPath };
    const cb = (src: string) => props.game.value = { ...props.game.value, gif: src };
    if (status) buildGif(props.game, cb);
    return false;
  };

  return (
    <div className={`box`}>
      <Table
        game={props.game}
        increment={increment}
        decrement={decrement}
      />
      <svg id="svg" xmlns="http://www.w3.org/2000/svg" className={"hidden"}></svg>
      <img
        id="gif"
        src=""
        className={`${props.game.value.status && props.game.value.gif ? "gif" : "hidden"}`}
        onClick={share}
      />
    </div>
  );
}
