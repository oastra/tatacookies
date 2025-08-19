// src/pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Meta */}
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
        {/* Use ABSOLUTE URL for social previews */}
        <meta
          property="og:image"
          content="https://tatacookies.com/images/cookies/alice-wonderland.webp"
        />
        <meta property="og:url" content="https://tatacookies.com" />
        <meta property="og:type" content="website" />
        {/* Optional Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://tatacookies.com/images/cookies/alice-wonderland.webp"
        />

        {/* Google Search Verification */}
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

        {/* Optional: small networking win for GA */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* Consent defaults MUST be here (beforeInteractive) */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
              wait_for_update: 500
            });

            try {
              var v = localStorage.getItem('tc_cookie_consent');
              if (v === 'accepted') {
                gtag('consent', 'update', { analytics_storage: 'granted' });
                window.__tc_send_initial_pv__ = true;
              } else if (v === 'rejected') {
                gtag('consent', 'update', { analytics_storage: 'denied' });
              }
            } catch (e) {}

            window.acceptAnalytics = function() {
              gtag('consent', 'update', { analytics_storage: 'granted' });
              try { localStorage.setItem('tc_cookie_consent','accepted'); } catch(e) {}
              try { gtag('event','page_view',{ page_path: location.pathname }); } catch(e) {}
            };
            window.rejectAnalytics = function() {
              gtag('consent', 'update', { analytics_storage: 'denied' });
              try { localStorage.setItem('tc_cookie_consent','rejected'); } catch(e) {}
            };
          `}
        </Script>

        {/* <link
          rel="preload"
          as="image"
          href="/images/hero-sq.avif"
          imagesrcset="/images/hero-sq.avif 1200w"
          imagesizes="(min-width:1024px) 50vw, 100vw"
        /> */}
      </Head>
      <body className="antialiased" style={{ overflowX: "hidden" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
