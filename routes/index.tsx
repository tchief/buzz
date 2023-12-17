import { useSignal } from "@preact/signals";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Room } from "../utils/types.ts";
import Header from "../islands/Header.tsx";
import { getCookies } from "$std/http/cookie.ts";
import { supabase } from "../utils/db.ts";
import { User } from "supabase";

interface HomeProps {
  rooms: string[];
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

    const { data } = await supabase
      .from<Room>("rooms")
      .select("slug")
      .match({ type: "words", is_promoted: true })
      .order("created_at", { ascending: false })
      .limit(15);
    const rooms = data?.map((room) => room.slug) ||
      [
        "tomorrow",
        "silence",
        "adventure",
        "stillness",
        "happiness",
        "legacy",
        "dreams",
        "souls-journey",
      ];

    const random = ["random/3", "random/4", "easy", "latest"];
    const allRooms = [...rooms, ...random];
    // const key = "tomorrow,is,a,blank,canvas,paint,it,with,purpose";
    // const mask = "_";
    // const max = "with";
    // const size = 3;
    // const type = "words";
    // const alphabet = key.split(",").sort();
    // // console.log({ alphabet });

    // const game = generate(key, size, max, mask, type, alphabet);
    return ctx.render({ rooms: allRooms, user });
  },
};

export default function Home(props: PageProps<HomeProps>) {
  const user = useSignal(props.data.user);
  const game = useSignal(null);

  return ( //flex-row flex-wrap max-w-2xl
    <div className={"p-4 mx-auto  min-h-screen"}>
      <Header user={user} game={game} />
      <ul class="flex items-center h-[70vh] max-w-2xl m-auto flex-row flex-wrap p-6 text-4xl justify-center gap-8 cursor-pointer">
        {props.data.rooms.map((slug) => (
          <li class="px-2 hover:text-[#23d5ab]">
            <a href={`/${slug}`}>
              {slug.replaceAll("-", " ").replaceAll("/", "-")}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
