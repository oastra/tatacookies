import { useRef } from "react";
import SectionWrapper from "@/components/common/SectionWrapper";
import SectionTitle from "@/components/common/SectionTitle";
import FlexContainer from "@/components/common/FlexContainer";
import FaqList from "../ui/FaqList";
import FaqImage from "../ui/FaqImage";
import ContactBox from "../contact/ContactBox";
import DecorativeStars from "../ui/DecorativeStars";
import faqData from "@/data/faqData"; // if stored externally

const FaqSection = () => {
  const sectionRef = useRef(null);

  return (
    <SectionWrapper id="faq" bg="bg-bgBlue">
      <SectionTitle className="text-center text-title">
        Common Questions
      </SectionTitle>
      <FlexContainer className="flex-col items-center lg:flex-row gap-6 items-start">
        <FaqList faqs={faqData} />
        <div className="relative w-full lg:w-auto">
          {/* Absolutely positioned stars matching full area */}

          <DecorativeStars />
          <div className="w-full flex justify-center">
            <FlexContainer className="flex flex-col sm:flex-row md:flex-row-reverse items-center gap-6 lg:p-6 z-10 relative">
              <FaqImage />
              <ContactBox />
            </FlexContainer>
          </div>
        </div>
      </FlexContainer>
    </SectionWrapper>
  );
};

export default FaqSection;
