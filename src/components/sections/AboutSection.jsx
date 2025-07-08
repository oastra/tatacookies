// src/components/sections/AboutSection.jsx
"use client";

import FlexSection from "@/components/common/FlexSection";

const AboutSection = () => {
  return (
    <FlexSection
      id="about"
      title="Indulge today & visit our bakery delights"
      paragraphs={[
        "Hi, I’m Tetiana - the heart behind TataCookies.",
        "I’m from Ukraine and have been living in Australia for three years. I baked my first handmade gingerbread cookie about ten years ago for my son’s birthday - and from that day, something just clicked. What started as a hobby slowly grew into something much bigger.",
        "Now TataCookies is blossoming into a small Sydney-based cookie business filled with love, creativity, and care. I adore coming up with new ideas for custom decorated cookies, adding intricate details to every design, and seeing people smile when they see (and taste!) my creations.",
        "Every artisan gingerbread cookie I make carries a piece of my heart - made to bring joy to my community in Wollstonecraft and beyond, one cookie at a time.",
      ]}
      imageSrc="/images/about-section-owner.webp" // Replace with your actual video thumbnail
      imageAlt="In Sydney Bakery Owner"
      bgColor="bg-white"
      mobileOrder="imageLast"
    />
  );
};

export default AboutSection;
