// components/ui/CookieSwiper.jsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CookieSwiper = ({ images, category }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1.2}
        spaceBetween={16}
        pagination={{
          clickable: true,
          el: ".custom-swiper-pagination", // Target a separate div
        }}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 1.5 },
        }}
        className="pb-8"
      >
        {images.map((src, i) => (
          <SwiperSlide key={src + i}>
            <div className="overflow-hidden rounded-[20px] h-[250px] sm:h-[260px] sm:aspect-[16/9] relative">
              <Image
                src={src}
                alt={`${category} cookie ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-swiper-pagination mt-8 flex justify-center"></div>
    </motion.div>
  );
};

export default CookieSwiper;
