// src/pages/_app.js
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }) {
  const { asPath } = useRouter();

  // Prefer explicit env var; fall back to Vercel env
  const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_ENV === "production"
      ? "https://tatacookies.com"
      : "https://tatacookiesdev.vercel.app");

  // normalize path (no query/hash)
  const path = (asPath || "/").split("#")[0].split("?")[0] || "/";
  const canonical = `${BASE_URL}${path === "/" ? "/" : path}`;
  const IS_PROD =
    process.env.NEXT_PUBLIC_SITE_URL === "https://tatacookies.com";

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* single, environment-aware canonical */}
        <link rel="canonical" href={canonical} />

        {!IS_PROD && (
          <meta name="robots" content="noindex, nofollow, noarchive" />
        )}
      </Head>

      {/* Google Analytics (keep as-is) */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-1KM8XF94WX"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1KM8XF94WX');
          `,
        }}
      />

      <Component {...pageProps} />
    </>
  );
}
