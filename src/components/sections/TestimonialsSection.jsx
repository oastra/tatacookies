"use client";
import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import SectionWrapper from "@/components/common/SectionWrapper";
import SectionTitle from "@/components/common/SectionTitle";
import reviews from "@/data/testimonialsData";
import ReviewCard from "../ui/cards/TestimonialCard";
import NextButton from "../icons/NextButton";
import PrevButton from "../icons/PrevButton";

const TestimonialsSection = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <SectionWrapper id="review" bg="bg-bgPink">
      <SectionTitle className="text-center text-title">
        Customer Reviews
      </SectionTitle>
      <div className="relative">
        <p className="text-center text-h3 text-text2 lg:text-left mb-[40px] mx-auto">
          <span className="text-text text-h3 font-medium">
            Real smiles, real stories, real cookies.
          </span>
          <br />
          Here’s what our lovely customers are saying about their TATACOOKIES
          experience!
        </p>

        <Swiper
          modules={[Navigation, Pagination, EffectFade]}
          slidesPerView={1}
          spaceBetween={30}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          className="w-full min-h-[1px]"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index} className="h-full">
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Custom buttons */}
        {/* Prev Button */}
        <button
          className="custom-prev group absolute bottom-[-80px] right-1/2 translate-x-[0%]  md:right-[76px] md:top-0 md:-translate-y-1/2 z-10 
             fill-white text-title 
             hover:fill-title hover:text-white 
             disabled:opacity-30 disabled:pointer-events-none"
          disabled={isBeginning}
        >
          <PrevButton />
        </button>

        {/* Next Button */}
        <button
          className="custom-next group absolute bottom-[-80px] right-1/2 translate-x-[130%] md:right-[64px] md:top-0 md:-translate-y-1/2 z-10 
               fill-white text-title 
             hover:fill-title hover:text-white 
  disabled:opacity-30 disabled:pointer-events-none"
          disabled={isEnd}
        >
          <NextButton />
        </button>
      </div>
    </SectionWrapper>
  );
};

export default TestimonialsSection;
