import { useSignal } from "@preact/signals";
import { Handlers, PageProps } from "$fresh/server.ts";
import Puzzle from "../islands/Puzzle.tsx";
import { Game } from "../utils/types.ts";
import { generate } from "../utils/utils.ts";

export const handler: Handlers<Game> = {
  async GET(_req, ctx) {
    // const key = "16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1";
    // const mask = "__";
    // const max = 16;
    // const size = 4;

    const key = "9,8,7,6,5,4,3,2,1";
    const mask = "__";
    const max = 9;
    const size = 3;
    const type = "numbers";
    const alphabet = "123456789".split("").sort();

    // const key = "c,h,e,m,i,s,t,r,y";
    // const mask = "__";
    // const max = "z";
    // const size = 3;
    // const type = "letters";
    // const alphabet = "chemistry".split("").sort();
    // console.log({ alphabet });

    const game = generate(key, size, max, mask, type, alphabet);
    return ctx.render(game);
  },
};

export default function Home(props: PageProps<Game>) {
  const game = useSignal(props.data);
  return <Puzzle game={game} />;
}
