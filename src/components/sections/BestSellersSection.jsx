"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import ClientSectionWrapper from "../common/ClientSectionWrapper";
import SectionTitle from "../common/SectionTitle";
import ProductCard from "../ui/cards/ProductCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BestSellersSection = ({ products = [] }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  if (products.length === 0) return null;

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
              <ProductCard
                image={product.image_url}
                title={product.title}
                price={product.price}
                slug={product.slug}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-10">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image_url}
              title={product.title}
              price={product.price}
              slug={product.slug}
            />
          ))}
        </div>
      )}
    </ClientSectionWrapper>
  );
};

export default BestSellersSection;
