// pages/index.js
import Head from "next/head";
import Header from "@/components/common/Header";
import HeroSection from "@/components/sections/HeroSection";
import GallerySection from "@/components/sections/GallerySection";
import BestSellersSection from "@/components/sections/BestSellersSection";
import AboutSection from "@/components/sections/AboutSection";
import CustomCookieSection from "@/components/sections/CustomCookieSection";
import FaqSection from "@/components/sections/FaqSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import BlogSection from "@/components/sections/BolgSection";
import ContactSection from "@/components/sections/ContactSection";
import dynamic from "next/dynamic";
import Footer from "@/components/common/Footer";

// Keep only truly browser-dependent
const InstagramSection = dynamic(
  () => import("@/components/sections/InstagramSection"),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Tatacookies - Custom Decorated Cookies in Sydney</title>
        <meta
          name="description"
          content="Order custom decorated cookies for weddings, birthdays, corporate events and special occasions in Sydney. Handmade with love by Tatacookies."
        />
      </Head>
      <Header />
      <main>
        <HeroSection />
        <GallerySection />
        <BestSellersSection />
        <AboutSection />
        <FaqSection />
        <CustomCookieSection />
        <TestimonialsSection />
        <InstagramSection />
        <BlogSection />

        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
