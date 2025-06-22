// components/HeroSection.jsx
import { motion } from "framer-motion";
import Image from "next/image";

import ButtonOrLink from "../ui/ButtonOrLink";
import FlexContainer from "../common/FlexContainer";
import SectionWrapper from "../common/SectionWrapper";
import VectorIcon from "../icons/VectorIcon";

const HeroSection = () => {
  return (
    <div>
      <SectionWrapper className=" px-[22px] md:px-[32px] lg:px-[0px] ">
        <FlexContainer className="flex-col lg:flex-row gap-[24px]  lg:max-h-[529px]">
          {/* Left Content */}
          <div className=" flex flex-col  gap-[56px] text-center lg:text-left  flex-1 lg:flex-1">
            <h1 className="text-title font-medium text-[36px] md:text-[48px] lg:text-[56px]">
              Smile-worthy cookies!
            </h1>
            <p className="text-h4 md:text-h3 md:font-medium">
              Handcrafted gingerbread for every occasion!
              <br /> Personalized, delicious, and almost too cute to eat!
            </p>
            <div className="w-fit self-center lg:self-start">
              <ButtonOrLink isLink href="/shop" className="bg-primary">
                Order Now <VectorIcon className="ml-4" />
              </ButtonOrLink>
            </div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
              className="overflow-hidden max-h-[216px] rounded-[20px]"
            >
              <Image
                src="/images/hero-rec.webp"
                alt="Donut cookies"
                width={600}
                height={216}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full  object-cover"
                style={{ width: "100%", height: "auto" }}
              />
            </motion.div>
          </div>

          {/* Right Images */}

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            className="h-[400px] lg:h-[529px] lg:flex-1 overflow-hidden rounded-[20px]"
          >
            <Image
              src="/images/hero-sq.webp"
              alt="Easter cookies"
              width={608}
              height={529}
              className="w-full object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        </FlexContainer>
      </SectionWrapper>
    </div>
  );
};

export default HeroSection;
