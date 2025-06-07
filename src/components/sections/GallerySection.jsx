"use client";

import dynamic from "next/dynamic";
import SectionTitle from "../layout/SectionTitle";
import ButtonOrLink from "../layout/ButtonOrLink";
import Tabs from "../ui/Tabs";
import VectorIcon from "../icons/VectorIcon";
import SectionWrapper from "../layout/SectionWrapper";

const GalleryDesktop = dynamic(() => import("./GalleryDesktop"), {
  ssr: true,
});
const GalleryMobile = dynamic(() => import("./GalleryMobile"), {
  ssr: false, // disable SSR for mobile to avoid hydration issues
});

const categories = [
  "Holiday Cookies",
  "Custom Orders",
  "Kids' Favorites",
  "Gifts & Art Cookies",
];

const imagesByCategory = {
  "Holiday Cookies": Array(5).fill("/images/hero-1.webp"),
  "Custom Orders": Array(5).fill("/images/hero-1.webp"),
  "Kids' Favorites": Array(5).fill("/images/hero-1.webp"),
  "Gifts & Art Cookies": Array(5).fill("/images/hero-1.webp"),
};

const GallerySection = () => {
  return (
    <SectionWrapper>
      <SectionTitle className="text-center">Things we bake</SectionTitle>
      <p className="text-base text-h4 md:text-h3 text-center mx-auto mt-2 mb-[40px]">
        Every cookie tells a story! From birthdays to weddings — each set is
        uniquely crafted just for you.
      </p>

      {/* Tabs are shared */}
      <GalleryDesktop
        categories={categories}
        imagesByCategory={imagesByCategory}
      />
      <GalleryMobile
        categories={categories}
        imagesByCategory={imagesByCategory}
      />

      <div className="mt-[40px] flex justify-center">
        <ButtonOrLink isLink href="/gallery" className="bg-primary">
          View All <VectorIcon className="ml-4" />
        </ButtonOrLink>
      </div>
    </SectionWrapper>
  );
};

export default GallerySection;
