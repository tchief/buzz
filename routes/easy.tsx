import { useSignal } from "@preact/signals";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Game } from "../utils/types.ts";
import { generate } from "../utils/utils.ts";
import Puzzle from "../islands/Puzzle.tsx";

export const handler: Handlers<Game> = {
  async GET(_req, ctx) {
    const key = "9,8,7,6,5,4,3,2,1";
    const mask = "_";
    const max = 9;
    const size = 3;
    const type = "numbers";
    const alphabet = "123456789".split("").sort();
    const game = generate(key, size, max, mask, type, alphabet);
    return ctx.render(game);
  },
};

export default function Size(props: PageProps<Game>) {
  const game = useSignal(props.data);
  return <Puzzle game={game} />;
}
