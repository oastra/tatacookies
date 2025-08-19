"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import ClientSectionWrapper from "../common/ClientSectionWrapper";
import SectionTitle from "../common/SectionTitle";
import ProductCard from "../ui/cards/ProductCard";
import getBestSellersForToday from "@/utils/getBestSellersForToday";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BestSellersSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Load products dynamically based on the date
    setProducts(getBestSellersForToday());

    // detect screen size
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  return (
    <ClientSectionWrapper id="best-sellers" bg="bg-bgPink">
      <SectionTitle className="text-center text-title">
        Best Sellers
      </SectionTitle>

      {isMobile ? (
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1.2}
          spaceBetween={16}
          className="pb-8 mt-6"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="p-[2px]">
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-10">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </ClientSectionWrapper>
  );
};

export default BestSellersSection;
