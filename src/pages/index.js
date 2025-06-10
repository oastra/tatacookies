// pages/index.jsx
import Header from "@/components/layout/Header.jsx";
import HeroSection from "../components/sections/HeroSection";
import GallerySection from "@/components/sections/GallerySection";
import BestSellersSection from "@/components/sections/BestSellersSection";
import AboutSection from "@/components/sections/AboutSection";
import CustomCookieSection from "@/components/sections/CustomCookieSection";
import FaqSection from "@/components/sections/FaqSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import InstagramSection from "@/components/sections/InstagramSection";
import BlogSection from "@/components/sections/BolgSection";
import ContactSection from "@/components/sections/ContactSection";

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
        <ReviewsSection />
        <InstagramSection />
        <BlogSection />
        <ContactSection />
        {/* TODO: Add ThingsWeBake, BestSellers, InstagramFeed, Reviews, FAQ, ContactSection */}
      </main>
    </>
  );
}
