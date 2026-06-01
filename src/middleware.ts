import { defineMiddleware } from "astro:middleware";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export const onRequest = defineMiddleware((context, next) => {
  const { url, cookies, redirect } = context;

  const isAuthed = (): boolean =>
    verifySessionToken(cookies.get(SESSION_COOKIE)?.value) !== null;

  // Protect all /admin routes except the login page itself
  if (url.pathname.startsWith("/admin") && url.pathname !== "/admin/login") {
    if (!isAuthed()) {
      return redirect("/admin/login");
    }
  }

  // Protect every admin API route
  if (url.pathname.startsWith("/api/admin")) {
    if (!isAuthed()) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return next();
});
