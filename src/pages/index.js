// pages/index.js
import Head from "next/head";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import GallerySection from "@/components/sections/GallerySection";
import BestSellersSection from "@/components/sections/BestSellersSection";
import AboutSection from "@/components/sections/AboutSection";
import CustomCookieSection from "@/components/sections/CustomCookieSection";
import FaqSection from "@/components/sections/FaqSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import BlogSection from "@/components/sections/BolgSection";
import ContactSection from "@/components/sections/ContactSection";
import CartDrawer from "@/components/shop/CartDrawer";
import dynamic from "next/dynamic";
import Footer from "@/components/layout/Footer";
import { getServiceSupabase } from "@/lib/supabase";

// Keep only truly browser-dependent
const InstagramSection = dynamic(
  () => import("@/components/sections/InstagramSection"),
  {
    ssr: false,
    loading: () => null,
  },
);

// Check if a product is currently in season
function isInSeason(product) {
  if (!product.season_start || !product.season_end) return true;
  const now = new Date();
  const today = (now.getMonth() + 1) * 100 + now.getDate();
  const [sM, sD] = product.season_start.split("-").map(Number);
  const [eM, eD] = product.season_end.split("-").map(Number);
  const start = sM * 100 + sD;
  const end = eM * 100 + eD;
  if (start <= end) return today >= start && today <= end;
  return today >= start || today <= end;
}

export default function Home({ bestSellers }) {
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
        <BestSellersSection products={bestSellers} />
        <AboutSection />
        <FaqSection />
        <CustomCookieSection />
        <TestimonialsSection />
        <InstagramSection />
        <BlogSection />

        <ContactSection />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

export async function getStaticProps() {
  const supabase = getServiceSupabase();

  const { data: products } = await supabase
    .from("products")
    .select(
      `
      id, title, slug, image_url, alt_text, is_featured, is_pinned,
      season_start, season_end, sort_order,
      product_variants (id, name, price_aud, is_active)
    `,
    )
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });

  // Apply pinned + seasonal logic
  const allFeatured = (products || []).map((p) => {
    const { product_variants, ...rest } = p;
    const activeVariants = (product_variants || []).filter((v) => v.is_active);
    const minPrice = activeVariants.length
      ? Math.min(...activeVariants.map((v) => Number(v.price_aud)))
      : 0;
    return { ...rest, price: minPrice };
  });

  const pinned = allFeatured.filter((p) => p.is_pinned);
  const seasonal = allFeatured.filter((p) => !p.is_pinned && isInSeason(p));

  // Shuffle seasonal for variety
  const shuffled = [...seasonal].sort(() => Math.random() - 0.5);

  // Pinned first, then seasonal, max 4
  const bestSellers = [...pinned, ...shuffled].slice(0, 4);

  return {
    props: {
      bestSellers: JSON.parse(JSON.stringify(bestSellers)),
    },
    revalidate: 60,
  };
}
