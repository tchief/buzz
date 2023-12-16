import { useSignal } from "@preact/signals";
import { getCookies } from "$std/http/cookie.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Puzzle from "../islands/Puzzle.tsx";
import { Game, Room } from "../utils/types.ts";
import { roomToGame, sizeToGame } from "../utils/utils.ts";
import { supabase } from "../utils/db.ts";

export const handler: Handlers<Game> = {
  async GET(req, ctx) {
    if (!supabase) return ctx.render(sizeToGame("3"));

    const token = getCookies(req.headers)["access_token"];
    const { user } = await supabase.auth.api.getUser(token);
    if (token) supabase.auth.setAuth(token);

    const slug = ctx.params.slug;
    const { data: room } = await supabase
      .from<Room>("puzzles")
      .select("*")
      .match({ slug })
      .single();
    const game = roomToGame(room);

    return ctx.render(game);
  },
};

export default function Size(props: PageProps<Game>) {
  const game = useSignal(props.data);
  return <Puzzle game={game} />;
}
