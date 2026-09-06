import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { CHILD_COOKIE, DEMO_COOKIE, getSupabaseEnv } from "@/lib/config";

const PUBLIC_PATHS = new Set(["/login"]);

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;
  const demo = request.cookies.get(DEMO_COOKIE)?.value === "1";
  const env = getSupabaseEnv();

  let authenticated = demo;

  if (env) {
    const supabase = createServerClient(env.url, env.anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    authenticated = authenticated || Boolean(user);
  }

  const isPublic =
    PUBLIC_PATHS.has(path) ||
    path.startsWith("/_next") ||
    path.startsWith("/api/calendar");

  if (!authenticated && !isPublic && path !== "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (authenticated && path === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/azi";
    return NextResponse.redirect(url);
  }

  if (path === "/") {
    const url = request.nextUrl.clone();
    url.pathname = authenticated ? "/azi" : "/login";
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => {
      redirect.cookies.set(cookie);
    });
    return redirect;
  }

  if (!demo && request.cookies.has(DEMO_COOKIE)) {
    response.cookies.delete(DEMO_COOKIE);
    response.cookies.delete(CHILD_COOKIE);
  }

  return response;
}
