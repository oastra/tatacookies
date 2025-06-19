"use client";

import dynamic from "next/dynamic";
import SectionTitle from "../common/SectionTitle";
import ButtonOrLink from "../ui/ButtonOrLink";
import VectorIcon from "../icons/VectorIcon";
import SectionWrapper from "../common/SectionWrapper";
import fullImagesByCategory from "@/data/galleryImagesByCategory";
import getRandomImagesByCategory from "@/utils/getRandomImagesByCategory";

const GalleryDesktop = dynamic(() => import("../gallery/GalleryDesktop"), {
  ssr: true,
});
const GalleryMobile = dynamic(() => import("../gallery/GalleryMobile"), {
  ssr: false,
});

const categories = Object.keys(fullImagesByCategory);
// Pick 5 random images per category on render
const imagesByCategory = getRandomImagesByCategory(fullImagesByCategory, 5);

const GallerySection = () => {
  return (
    <SectionWrapper>
      <SectionTitle className="text-center">Things we bake</SectionTitle>
      <p className="text-base text-h4 md:text-h3 text-center mx-auto mt-2 mb-[40px]">
        Every cookie tells a story! From birthdays to weddings — each set is
        uniquely crafted just for you.
      </p>

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
