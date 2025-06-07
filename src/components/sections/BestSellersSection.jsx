"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import SectionWrapper from "../layout/SectionWrapper";
import SectionTitle from "../layout/SectionTitle";
import ProductCard from "../ui/ProductCard";
import bestSellersList from "@/data/bestSellersList";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BestSellersSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  // detect screen size to toggle Swiper
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  return (
    <SectionWrapper bg="bg-bgPink">
      <SectionTitle className="text-center text-title">
        Best Sellers
      </SectionTitle>

      {isMobile ? (
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1.2}
          spaceBetween={16}
          className="pb-8 mt-6 !overflow-visible"
          breakpoints={{
            640: { slidesPerView: 2 },
          }}
        >
          {bestSellersList.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard {...product} type="link" />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-10">
          {bestSellersList.map((product) => (
            <ProductCard key={product.id} {...product} type="link" />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};

export default BestSellersSection;
