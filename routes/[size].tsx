import { useSignal } from "@preact/signals";
import { Handlers, PageProps } from "$fresh/server.ts";
import Puzzle from "../islands/Puzzle.tsx";
import { Game } from "../utils/types.ts";
import { create, generate, getAlphabet } from "../utils/utils.ts";

export const handler: Handlers<Game> = {
  async GET(_req, ctx) {
    const size = +(ctx.params.size ?? 3);
    const max = size * size;
    const mask = "__";
    const type = "numbers";
    const key = create(size);
    const alphabet = getAlphabet(size);
    const game = generate(key, size, max, mask, type, alphabet);
    return ctx.render(game);
  },
};

export default function Size(props: PageProps<Game>) {
  const game = useSignal(props.data);
  return <Puzzle game={game} />;
}
