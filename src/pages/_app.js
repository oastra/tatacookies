// src/pages/_app.js
import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
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

  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXX";

  // Fire page_view on client-side route changes, but only if consent accepted
  useEffect(() => {
    const handleRoute = (url) => {
      try {
        if (
          typeof window.gtag === "function" &&
          localStorage.getItem("tc_cookie_consent") === "accepted"
        ) {
          window.gtag("event", "page_view", { page_path: url });
        }
      } catch {}
    };
    router.events.on("routeChangeComplete", handleRoute);
    return () => router.events.off("routeChangeComplete", handleRoute);
  }, [router.events]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={canonical} />
      </Head>

      {/* GA4 loader */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="gtag-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // We control page_view via consent + route changes
          gtag('config', '${GA_ID}', {
            anonymize_ip: true,
            allow_google_signals: false,
            send_page_view: false
          });

          // If user accepted before load, send initial page_view once
          if (window.__tc_send_initial_pv__) {
            gtag('event', 'page_view', { page_path: location.pathname });
          }
        `}
      </Script>

      {/* Do NOT load Google Maps globally. It is loaded on /custom-order (or inside AddressAutocomplete). */}

      <CookieBanner />
      <Component {...pageProps} />
    </>
  );
}
