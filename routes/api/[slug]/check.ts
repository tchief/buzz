import { FreshContext } from "$fresh/server.ts";
import { supabase } from "../../../utils/db.ts";

export const handler = async (req: Request, ctx: FreshContext) => {
  const u = new URL(req.url);
  const _key = u.searchParams.get("key");
  const _slug = ctx.params.slug;

  const { data } = await supabase?.rpc("check_key", { _slug, _key });

  const status = data ?? false;

  return new Response(JSON.stringify({ status }));
};
