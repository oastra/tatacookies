"use client";

import FlexSection from "@/components/common/FlexSection";
import ButtonOrLink from "@/components/ui/ButtonOrLink";
import VectorIcon from "@/components/icons/VectorIcon";

const CustomCookieSection = () => {
  return (
    <FlexSection
      title="Design your cookie pack"
      paragraphs={[
        <div key="0" className="text-h3 text-title mb-4">
          Can’t decide on just one flavor? No worries!
        </div>,
        <div key="1" className="text-h4 mb-4">
          With our custom cookie pack, you can mix and match your favorite
          cookies to create the perfect box just for you – or as a sweet gift!
          Choose your size, pick your flavors, and enjoy a box that’s uniquely
          yours.
        </div>,
        <div key="2" className="text-text2 text-h3 ">
          Create a cookie box that’s as unique as your cravings!
        </div>,
      ]}
      imageSrc="/images/cookies/boy-easter.webp"
      imageAlt="Custom cookie box"
      bgColor="bgPink"
      mobileOrder="imageAfterTitle"
      imgClassName="w-full object-cover [object-position:center_35%]"
      cta={
        <ButtonOrLink href="/custom-order" className="bg-primary">
          Start Your Box Design <VectorIcon className="ml-2" />
        </ButtonOrLink>
      }
    />
  );
};

export default CustomCookieSection;
