// src/pages/_app.js
import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import "../styles/globals.css";
import CookieBanner from "@/components/CookieBanner";

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_ENV === "production"
      ? "https://tatacookies.com"
      : "https://tatacookiesdev.vercel.app");

  const path = (router.asPath || "/").split("#")[0].split("?")[0] || "/";
  const canonical = `${BASE_URL}${path === "/" ? "/" : path}`;

  // Track page changes for SPA navigation (Next.js client-side routing)
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Only track if gtag is available (loaded via _document.js)
      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          page_path: url,
          page_location: `${window.location.origin}${url}`,
        });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonical} />
      </Head>

      <CookieBanner />
      <Component {...pageProps} />
    </>
  );
}
