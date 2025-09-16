import Head from "next/head";
import Script from "next/script";
import Container from "@/components/common/Container";
import CustomCookieForm from "@/components/forms/CustomCookieForm";

export default function CustomOrderPage() {
  // expose only the public key
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <>
      <Head>
        <title>Custom Order - Tatacookies | Design Your Perfect Cookies</title>
        <meta
          name="description"
          content="Design and order custom decorated cookies for your special event. Choose themes, quantities, and delivery options."
        />
      </Head>
      {apiKey && (
        <Script
          id="gmaps-places"
          strategy="afterInteractive"
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`}
          onLoad={() => window.dispatchEvent(new Event("gmaps:loaded"))}
        />
      )}

      <main className="min-h-screen py-12">
        <Container>
          <div className="w-full max-w-[1160px] mx-auto rounded-[20px] bg-bgBlue p-6 md:p-8 lg:p-16">
            <CustomCookieForm />
          </div>
        </Container>
      </main>
    </>
  );
}
