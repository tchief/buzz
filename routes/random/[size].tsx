import { useSignal } from "@preact/signals";
import { Handlers, PageProps } from "$fresh/server.ts";
import Puzzle from "../../islands/Puzzle.tsx";
import { Game } from "../../utils/types.ts";
import { sizeToGame } from "../../utils/utils.ts";

export const handler: Handlers<Game> = {
  async GET(_req, ctx) {
    const game = sizeToGame(ctx.params.size);
    return ctx.render(game);
  },
};

export default function Size(props: PageProps<Game>) {
  const game = useSignal(props.data);
  return <Puzzle game={game} />;
}
