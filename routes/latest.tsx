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
    const token = getCookies(req.headers)["access_token"];
    const { user } = supabase ? await supabase.auth.api.getUser(token) : { user: null };
    if (token && supabase) supabase.auth.setAuth(token);

    const { data } = await supabase
      .from<Room>("rooms")
      .select("slug")
      .order("created_at", { ascending: false })
      .limit(50);
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

    const random = ["random/3", "random/4"];
    const allRooms = [...rooms, ...random];
    return ctx.render({ rooms: allRooms, user });
  },
};

export default function Home(props: PageProps<HomeProps>) {
  const user = useSignal(props.data.user);
  const game = useSignal(null);

  return (
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
