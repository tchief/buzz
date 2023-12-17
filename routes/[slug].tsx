import { useSignal } from "@preact/signals";
import { getCookies } from "$std/http/cookie.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Puzzle from "../islands/Puzzle.tsx";
import { Game, Room } from "../utils/types.ts";
import { roomToGame, sizeToGame } from "../utils/utils.ts";
import { supabase } from "../utils/db.ts";
import { User } from "supabase";
import Header from "../islands/Header.tsx";
interface SlugProps {
  game: Game;
  user: User | null;
  slug?: string;
}

export const handler: Handlers<SlugProps> = {
  async GET(req, ctx) {
    if (!supabase) return ctx.render({ game: sizeToGame("3"), user: null });

    const token = getCookies(req.headers)["access_token"];
    const { user } = await supabase.auth.api.getUser(token);
    if (token) supabase.auth.setAuth(token);

    const slug = ctx.params.slug;
    const { data: room, error } = await supabase
      .from<Room>("puzzles")
      .select("*")
      .match({ slug })
      .single();
    const game = roomToGame(room);

    return ctx.render({ game, user, slug });
  },
};

export default function Size(props: PageProps<SlugProps>) {
  const game = useSignal(props.data.game);
  const user = useSignal(props.data.user);
  const slug = useSignal(props.data.slug);
  return (
    <div className={"p-4 mx-auto min-h-screen"}>
      <Header user={user} game={game} />
      <Puzzle game={game} slug={slug} />
    </div>
  );
}
