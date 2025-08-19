// pages/index.js
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
      <Header />
      <main>
        <HeroSection />
        <GallerySection />
        <BestSellersSection />
        <AboutSection />
        <FaqSection />
        <CustomCookieSection />
        <TestimonialsSection />
        <BlogSection />
        <InstagramSection />
        <ContactSection />
      </main>
    </>
  );
}
