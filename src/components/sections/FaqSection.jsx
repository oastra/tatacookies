import { useRef } from "react";
import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTitle from "@/components/layout/SectionTitle";
import FlexContainer from "@/components/layout/FlexContainer";
import FaqList from "../ui/FaqList";
import FaqImage from "../ui/FaqImage";
import ContactBox from "../ui/ContactBox";
import DecorativeStars from "../ui/DecorativeStars";
import faqData from "@/data/faqData"; // if stored externally

const FaqSection = () => {
  const sectionRef = useRef(null);

  return (
    <div ref={sectionRef}>
      <SectionWrapper bg="bg-bgBlue">
        <SectionTitle className="text-center text-title">
          Common Questions
        </SectionTitle>
        <FlexContainer className="flex-col items-center lg:flex-row gap-6 items-start">
          <FaqList faqs={faqData} />
          <div className="relative w-full lg:w-auto">
            {/* Absolutely positioned stars matching full area */}

            <DecorativeStars />

            <div className="flex flex-col lg:items-center lg:flex-row lg:p-6 gap-6 w-full lg:w-auto z-10 relative">
              <ContactBox />
              <FaqImage />
            </div>
          </div>
        </FlexContainer>
      </SectionWrapper>
    </div>
  );
};

export default FaqSection;
