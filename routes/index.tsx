import { useSignal } from "@preact/signals";
import { Handlers, PageProps } from "$fresh/server.ts";
import Puzzle from "../islands/Puzzle.tsx";
import { Game } from "../utils/types.ts";
import { generate, sizeToGame } from "../utils/utils.ts";
import Header from "../islands/Header.tsx";
import { getCookies } from "$std/http/cookie.ts";
import { supabase } from "../utils/db.ts";
import { User } from "supabase";

interface HomeProps {
  game: Game;
  user: User | null;
}

export const handler: Handlers<HomeProps> = {
  async GET(req, ctx) {
    // const token = getCookies(req.headers)['access_token'];
    // const { user } = await supabase.auth.api.getUser(token);
    // return ctx.render({ user });
    // const key = "16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1";
    // const mask = "__";
    // const max = 16;
    // const size = 4;

    // const key = "9,8,7,6,5,4,3,2,1";
    // const mask = "__";
    // const max = 9;
    // const size = 3;
    // const type = "numbers";
    // const alphabet = "123456789".split("").sort();

    // const key = "c,h,e,m,i,s,t,r,y";
    // const mask = "__";
    // const max = "z";
    // const size = 3;
    // const type = "letters";
    // const alphabet = "chemistry".split("").sort();
    // console.log({ alphabet });

    const token = getCookies(req.headers)["access_token"];
    const { user } = supabase ? await supabase.auth.api.getUser(token) : { user: null };
    if (token && supabase) supabase.auth.setAuth(token);

    const key = "tomorrow,is,a,blank,canvas,paint,it,with,purpose";
    const mask = "_";
    const max = "with";
    const size = 3;
    const type = "words";
    const alphabet = key.split(",").sort();
    // console.log({ alphabet });

    const game = generate(key, size, max, mask, type, alphabet);
    return ctx.render({ game, user });
  },
};

export default function Home(props: PageProps<HomeProps>) {
  const game = useSignal(props.data.game);
  const user = useSignal(props.data.user);
  return (
    <div className={"p-4 mx-auto  min-h-screen"}>
      <Header user={user} game={game} />
      <Puzzle game={game} />
    </div>
  );
}
