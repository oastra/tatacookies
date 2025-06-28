import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* SEO Meta Tags */}
        <meta charSet="UTF-8" />
        <meta
          name="description"
          content="Tatacookies – Custom cookies made in Sydney for special occasions and everyday cravings."
        />
        <meta
          name="keywords"
          content="Tatacookies, custom cookies, decorated cookies, Sydney cookies, gift cookies, cookie delivery Australia"
        />
        <meta name="author" content="Tatacookies" />
        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="Tatacookies – Custom Cookies in Sydney"
        />
        <meta
          property="og:description"
          content="Order custom decorated cookies for weddings, birthdays, corporate gifts and more."
        />
        <meta
          property="og:image"
          content="/images/cookies/alice-wonderland.wepb"
        />
        {/* Canonical URL */}
        <meta property="og:url" content="https://tatacookies.com.au" />
        <meta property="og:type" content="website" />

        {/* Favicon */}
        <meta name="apple-mobile-web-app-title" content="tatacookies" />

        {/* Google Maps API */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
