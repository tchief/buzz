import { Handlers } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { supabase } from "../utils/db.ts";
import Form from "../islands/Form.tsx";
import { canNotCreateRoom, slugify, stringToWords, wordsToAlphabet } from "../utils/utils.ts";
import { Room } from "../utils/types.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    return await ctx.render();
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const name = form.get("slug")?.toString();
    const key = form.get("phrase")?.toString();

    const slug = slugify(name);
    const words = stringToWords(key);
    const alphabet = wordsToAlphabet(words);
    const roomError = canNotCreateRoom(words, alphabet, slug);

    const token = getCookies(req.headers)["access_token"];
    const { user } = supabase ? await supabase.auth.api.getUser(token) : { user: null };

    if (roomError || !user || !supabase) {
      return ctx.render({ roomError });
    }

    if (token) supabase.auth.setAuth(token);
    const { data, error } = await supabase
      .from<Room>("puzzles")
      .insert([{ slug, key, alphabet: alphabet.join(), type: "words", user_id: user.id }]);

    console.log({ data, error });

    const headers = new Headers();
    headers.set("location", `/${slug}`);
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function Create() {
  return <Form />;
}
