"use client";
import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import SectionWrapper from "@/components/layout/SectionWrapper";
import SectionTitle from "@/components/layout/SectionTitle";
import reviews from "@/data/reviewsData";
import ReviewCard from "../ui/ReviewCard";
import NextButton from "../icons/NextButton";
import PrevButton from "../icons/PrevButton";

const ReviewsSection = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <SectionWrapper bg="bg-bgPink">
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
          spaceBetween={30}
          effect="fade"
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          className="w-full"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Custom buttons */}
        {/* Prev Button */}
        <button
          className="custom-prev group absolute right-[64px] top-0 -translate-y-1/2 z-10 
             fill-white text-title 
             hover:fill-title hover:text-white 
             disabled:opacity-30 disabled:pointer-events-none"
          disabled={isBeginning}
        >
          <PrevButton />
        </button>

        {/* Next Button */}
        <button
          className="custom-next group absolute right-0 top-0 -translate-y-1/2 z-10 
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

export default ReviewsSection;
