// src/components/sections/AboutSection.jsx
"use client";

import FlexSection from "@/components/layout/FlexSection";

const AboutSection = () => {
  return (
    <FlexSection
      id="about"
      title="Indulge today & visit our bakery delights"
      paragraphs={[
        "Indulge today and experience the delight of our bakery offerings and visit us now for irresistible treats, pastries, and explore culinary wonders together.",
        "Indulge today and experience the delight of our bakery offerings and visit us now for irresistible treats, pastries, and explore culinary wonders together.",
        "Indulge today and experience the delight of our bakery offerings and visit us now for irresistible treats, pastries, and explore culinary wonders together.",
      ]}
      imageSrc="/images/hero-1.webp" // Replace with your actual video thumbnail
      imageAlt="Bakery Owner"
      bgColor="bg-white"
      mobileOrder="imageLast"
    />
  );
};

export default AboutSection;
