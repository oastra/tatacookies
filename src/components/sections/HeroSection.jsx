// src/components/sections/HeroSection.jsx  (no "use client")
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

          {/* Small decorative image — CSS animation only (no JS) */}
          <div className="rounded-[20px] overflow-hidden w-full h-[216px] hidden md:block">
            <div className="motion-safe:[animation:hero-slide-in_0.8s_ease-out_forwards]">
              <Image
                src="/images/hero-rec.avif"
                alt="Decorative cookie"
                width={400}
                height={216}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>

        {/* LCP element — static, priority */}
        <div className="h-[360px] md:h-[440px] lg:h-[529px] lg:flex-1 overflow-hidden rounded-[20px]">
          <Image
            src="/images/hero-sq.avif"
            alt="Easter cookies"
            width={608}
            height={529}
            className="w-full h-full object-cover"
            sizes="(min-width:1024px) 50vw, 100vw"
            priority
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </FlexContainer>
    </SectionWrapper>
  );
}
