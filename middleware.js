// middleware.js (pure JS)
import { NextResponse } from "next/server";

export function middleware(req) {
  const host = req.headers.get("host") || "";

  // Any preview/dev deployment on Vercel
  if (host.endsWith(".vercel.app")) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  // Optional: force one host (www -> apex) at edge
  if (host === "www.tatacookies.com") {
    const url = req.nextUrl.clone();
    url.hostname = "tatacookies.com";
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

// Skip static assets
export const config = {
  matcher: ["/((?!_next|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml)$).*)"],
};
