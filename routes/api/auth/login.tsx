import type { Handler, PageProps } from "$fresh/server.ts";

import { setCookie } from "$std/http/cookie.ts";
import LoginParamsConverter from "../../../islands/LoginParamsConverter.tsx";
import { supabase } from "../../../utils/db.ts";

const DEV = !Deno.env.get("DENO_DEPLOYMENT_ID");

type DataProps = {
  redirectTo: string | undefined;
};

export default function LoginEndpoint(props: PageProps<DataProps>) {
  return <LoginParamsConverter redirectTo={props.data.redirectTo || "/"} />;
}

export const handler: Handler = async (req, ctx) => {
  const url = new URL(req.url);

  const error = url.searchParams.get("error");
  const access_token = url.searchParams.get("access_token");
  const refresh_token = url.searchParams.get("refresh_token");
  const expires_in = url.searchParams.get("expires_in");

  if (error) {
    return new Response("Login failed", { status: 307, headers: { Location: "/" } });
  }

  if (!access_token || !refresh_token || !expires_in) {
    const authUrl = supabase.auth.api.getUrlForProvider("discord", {
      redirectTo: DEV ? "http://localhost:8000/api/auth/login" : url.origin + "/api/auth/login",
    });

    return ctx.render({
      redirectTo: authUrl,
    });
  }

  const { user } = await supabase.auth.api.getUser(access_token);
  if (!user) {
    return new Response("Invalid access_token", { status: 400 });
  }

  const res = new Response("OK", { status: 307, headers: { Location: "/" } });

  setCookie(res.headers, {
    name: "access_token",
    value: access_token,
    maxAge: 365 * 24 * 60 * 60,
    httpOnly: true,
    sameSite: "Strict",
    path: "/",
  });

  setCookie(res.headers, {
    name: "refresh_token",
    value: refresh_token,
    maxAge: 365 * 24 * 60 * 60,
    httpOnly: true,
    sameSite: "Strict",
    path: "/",
  });

  setCookie(res.headers, {
    name: "expires_at",
    value: (Math.floor(Date.now() / 1000) + parseInt(expires_in)).toString(),
    maxAge: 365 * 24 * 60 * 60,
    httpOnly: true,
    sameSite: "Strict",
    path: "/",
  });

  return res;
};
