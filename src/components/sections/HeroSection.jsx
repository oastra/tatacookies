// src/components/sections/HeroSection.jsx - No Hydration Issues
"use client";
import Image from "next/image";
import SectionWrapper from "@/components/common/SectionWrapper";
import ButtonOrLink from "@/components/ui/ButtonOrLink";
import FlexContainer from "@/components/common/FlexContainer";
import VectorIcon from "@/components/icons/VectorIcon";

export default function HeroSection() {
  return (
    <SectionWrapper className="px-[22px] md:px-[32px] lg:px-0">
      <FlexContainer className="flex-col lg:flex-row gap-[24px] lg:max-h-[529px]">
        <div className="flex flex-col gap-[32px] lg:gap-[48px] text-center lg:text-left flex-1">
          <h1 className="text-title font-medium text-[40px] md:text-[48px] xl:text-[56px]">
            Smile-worthy cookies!
          </h1>

          <p className="text-h4 md:font-medium">
            Handcrafted gingerbread for every occasion!
            <br /> Personalized, delicious, and almost too cute to eat!
          </p>

          <div className="w-fit self-center lg:self-start">
            <ButtonOrLink isLink href="/shop" className="bg-primary">
              Order Now <VectorIcon className="ml-4" />
            </ButtonOrLink>
          </div>

          {/* Decorative image — CSS-only animation, no JavaScript */}
          <div className="relative rounded-[20px] overflow-hidden w-full h-[216px] hidden md:block opacity-0 animate-[slideInLeft_1s_ease-out_0.6s_both]">
            <Image
              src="/images/hero-rec.avif"
              alt="Decorative cookie"
              fill
              style={{ objectFit: "cover" }}
              sizes="(min-width: 768px) 400px, 0px"
              loading="lazy"
              quality={85}
            />
          </div>
        </div>

        {/* LCP image — optimized for performance */}
        <div className="relative h-[360px] md:h-[440px] lg:h-[529px] lg:flex-1 overflow-hidden rounded-[20px] opacity-0 animate-[slideInRight_1s_ease-out_0.3s_both]">
          <Image
            src="/images/hero-sq.avif"
            alt="Easter cookies"
            fill
            style={{ objectFit: "cover" }}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            quality={90}
          />
        </div>
      </FlexContainer>
    </SectionWrapper>
  );
}
