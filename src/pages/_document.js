import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta Tags */}
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
        <meta name="theme-color" content="#ffffff" />

        {/* Open Graph */}
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
          content="/images/cookies/alice-wonderland.webp"
        />
        <meta property="og:url" content="https://tatacookies.com" />
        <meta property="og:type" content="website" />
        {/* Goofle search verification */}
        <meta
          name="google-site-verification"
          content="DqXqzCUIFD5OeOCzYPacs9voCZy7lcOKbEAnxIEnT9U"
        />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

        {/* Preload Fonts */}
        <link
          rel="preload"
          href="/fonts/Satoshi/Satoshi-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Satoshi/Satoshi-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Quicksand/Quicksand-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Quicksand/Quicksand-SemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Google Maps API */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />
      </Head>
      <body className="antialiased" style={{ overflowX: "hidden" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
