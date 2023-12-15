import { useSignal } from "@preact/signals";
import { Handlers, PageProps } from "$fresh/server.ts";
import Puzzle from "../islands/Puzzle.tsx";
import { Game } from "../utils/types.ts";
import { generate } from "../utils/utils.ts";

export const handler: Handlers<Game> = {
  async GET(_req, ctx) {
    const key = "9,8,7,6,5,4,3,2,1";
    const mask = "__";
    const max = 9;
    const game = generate(key, max, mask);
    return ctx.render(game);
  },
};

export default function Home(props: PageProps<Game>) {
  const game = useSignal(props.data);
  return <Puzzle game={game} />;
}
