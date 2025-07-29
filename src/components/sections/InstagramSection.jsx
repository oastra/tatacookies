"use client";

import { useState, useEffect } from "react";
import SectionWrapper from "@/components/common/SectionWrapper";
import SectionTitle from "@/components/common/SectionTitle";
import ButtonOrLink from "@/components/ui/ButtonOrLink";
import VectorIcon from "@/components/icons/VectorIcon";
import imagesByCategory from "@/data/galleryImagesByCategory";

const InstagramSection = () => {
  const [count, setCount] = useState(8);

  useEffect(() => {
    const updateCount = () => {
      const width = window.innerWidth;
      setCount(width < 1024 ? 4 : 8);
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const allImages = Object.values(imagesByCategory).flat();

  return (
    <SectionWrapper id="instagram">
      <SectionTitle className="text-center text-title mb-[32px] lg:mb-[40px]">
        We’re on Instagram
      </SectionTitle>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-[32px] lg:mb-[40px] mx-auto">
        {allImages.slice(0, count).map((src, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[16px] aspect-square block"
          >
            <img
              src={src}
              alt={`Tatacookies post ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="text-center">
        <ButtonOrLink
          isLink
          href="https://instagram.com/tatacookies.au"
          target="_blank"
          className="w-[280px] mx-auto bg-primary text-text flex items-center justify-center gap-2"
        >
          Follow Us <VectorIcon className="ml-2 " />
        </ButtonOrLink>
      </div>
    </SectionWrapper>
  );
};

export default InstagramSection;
